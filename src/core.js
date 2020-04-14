import {getDataAttribute, toCamelCase, toKebabCase, evaluate, evaluateAndReturn, crawl, evaluateAndPromise } from './helpers';
import Proxy from 'es6-proxy-polyfill/dist/es6-proxy-polyfill';
import "custom-event-polyfill";
import 'whatwg-fetch';
import Store from './store';

const TriggerAttribRE = /^data-on:([a-zA-Z0-9\-]+)(\.[a-zA-Z\.\-]*)?$/;

export class Engine {

    constructor(root) {
        this.root = root;
        
        this.mutations = {};
        this.triggers = {};
        this.tags = {};
        this.store = null;
    }

    start() {
        this.mount(this.root);
        this.dispatch(this.root, 'mounted');
    }

    createStore(params) {
        this.store = new Store(this, params);

        return this;
    }

    registerTrigger(t) {
        this.triggers[t.name] = t;
    }

    registerMutation(m) {
        this.mutations[toCamelCase(m.name)] = m.apply;
    }

    getEmptyContext() {
        let $ = this;
        return {
            $dom: new Proxy($.tags, {
                get(subject, prop) {
                    if(prop in subject) {
                        prop = toKebabCase(prop);
                        return $.createMutableElement(document.getElementById(prop));
                    }
                }
            }),
            $el: null,
            $data: null,
            q (query) {
                let el = $.root.querySelector(query);
                return el ? $.createMutableElement(el) : undefined;
            },
            fetchText(url) {
                return fetch(url).then(r => r.text());
            },
            fetchJson(url) {
                return fetch(url).then(r => r.json());
            },
            $state: $.store ? $.store.state : undefined,
            $dispatch (action, payload) {
                if($.store) {
                    $.store.dispatch(action, payload);
                }
                else {
                    console.error('no store founded. call Engine.createStore before use $dispatch function');
                }
            }
        };
    }

    createMutableElement(el) {
        let mutations = this.mutations;
        let $ = this;
        let subject = { $el: el };
        for (const key in this.mutations) {
            if (this.mutations.hasOwnProperty(key)) {
                subject[key] = '';
            }
        }

        return new Proxy(subject, {
            set (s, prop, value) {
                if(typeof mutations[prop] !== 'undefined') {
                    mutations[prop](value, s.$el, $);
                    return true;
                }
                return false;
            },
            get (s, prop) {
                if(prop === '$el') {
                    return s[prop];
                }
                if(prop === 'value') {
                    return s.$el.value;
                }
                if(prop === 'id') {
                    return s.$el.id;
                }
                if(prop === 'classes') {
                    return s.$el.classname;
                }
                if(prop === 'href') {
                    return s.$el.href;
                }
                return undefined;
            }
        });
    }

    run(task, slot, data = null, isArrowSyntax = false) {
        let ctx = this.getEmptyContext();
        ctx.$data = data;
        ctx.$el = slot;

        task = (task || '');
        if(task.indexOf('->') >= 0) {
            let tasks = (task || '').split('->');
            let runner = new Task();

            while(tasks.length > 0) {
                let expr = tasks.shift();
                //check if task contain only white space
                if(!expr.replace(/\s/g, '').length) {
                    expr = "$data";
                }
                expr = tasks.length === 0 ? expr + ' = $data' : expr;

                runner.enqueue(expr);
            }

            return runner.run(ctx, data);
        }
        else
            return evaluateAndPromise(task, ctx);
    }

    dispatch(el, event, data) {
        el.dispatchEvent(new CustomEvent(event, {
            detail: data, bubbles: true
        }));
    }

    mount(el) {
        let $ = this;
        crawl(el, (e) => {
            if(e.id && !e._uijx_initiated) {
                $.tags[toCamelCase(e.id)] = '';
                for(let i=0; i < e.attributes.length; i++) {
                    let a = e.attributes[i];
                    if(TriggerAttribRE.test(a.name)) { 
                        let info = new TriggerInfo(e, a.name);
                        let trigger = $.triggers[info.trigger] || $.triggers['event'];
                        if(trigger) {
                            let target = null;
                            if(trigger.attachTo === 'document')
                                target = document;
                            else if(trigger.attachTo === 'root')
                                target = $.root;
                            else if(trigger.attachTo === 'self')
                                target = e;
                            else
                                target = (new RegExp('^' + trigger.attachTo + '$')).test(e.nodeName.toUpperCase()) ? e :null;

                            if(target) {
                                let ev = toKebabCase(trigger.event || info.trigger);
                            
                                target.addEventListener(ev, (event) => {
                                    if(trigger.waiting) {
                                        $.dispatch(e, 'waiting', { waiting: true, slot: e });
                                    }

                                    trigger.handle($.createMutableElement(e), event, info, $)
                                    .catch(er => {
                                        if(info.error) {
                                            $.run(info.error, e, er);
                                        }
                                        else {
                                            console.error("error thrown, use data-*-error hook to capture error",er);
                                        }
                                    })
                                    .then(() => {
                                        if(trigger.waiting) {
                                            $.dispatch(e, 'waiting', { waiting: false, slot: e });
                                        }
                                    })
                                });
                            }
                        }
                    }
                }

                e._uijx_initiated = true;
            }
        })
        ;
    }
}

export class TriggerInfo {

    constructor(el, attribute) {
        let matches = TriggerAttribRE.exec(attribute);
        if(matches) {
            this.trigger = matches[1];
            this.modifiers = matches[2] || '';
            this.after = getDataAttribute(el, this.trigger + '-after');
            this.before = getDataAttribute(el, this.trigger + '-before');
            this.error = getDataAttribute(el,this.trigger + '-error');
            this.task = el.getAttribute(attribute);
        }
        else
            throw new Error('"' + attribute + '" is not a valid trigger attribute');
    }

    getModifierList() {
        return this.rawModifiers.split('.');
    }

    hasModifier(modifier) {
        return this.modifiers.indexOf('.' + modifier) >= 0;
    }

    containModifiers() {
        return this.modifiers.trim().length !== 0;
    }
}

class Task {
    constructor() {
        this.queue = [];
        this.isWorking = false;
    }

    enqueue (expr) {
        this.queue.push({promise: (ctx) => evaluateAndPromise(expr, ctx)});
    }

    run (ctx, data = undefined) {
        let self = this;

        return new Promise((resolve, reject) => {
            const _dequeue = (ctx, data) => {

                if(self.isWorking)
                    return;

                const item = self.queue.shift();
                if(!item) {
                    resolve(data);
                    return;
                }

                try {
                    self.isWorking  = true;
                    ctx.$data = data;
                    item.promise(ctx)
                    .then((value) => {
                        self.isWorking = false;
                        _dequeue(ctx, value);
                    })
                    .catch(err => {
                        self.isWorking = false;
                        reject(err);
                    })
                }
                catch(err) {
                    self.isWorking = false;
                    reject(err);
                }
            };

            _dequeue(ctx, data);

        });
    }
}