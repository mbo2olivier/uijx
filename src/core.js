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
                return undefined;
            }
        });
    }

    run(task, slot, data = null, callback = undefined, isArrowSyntax = false) {
        let ctx = this.getEmptyContext();
        ctx.$data = data;
        ctx.$el = slot;

        let tasks = (task || '').split('->');

        if(tasks.length === 1) {
            task = tasks[0];

            if(isArrowSyntax) {
                evaluate( task + ' = $data', ctx);
                if(callback) {
                    callback(undefined);
                }
            }
            else {
                if(callback) {
                    let value = evaluateAndReturn(task, ctx);
                    callback(value);
                }
                else {
                    evaluate(task, ctx);
                }
            }
        }
        else {
            let $ = this;
            task = tasks.shift();
            //check if task contain only white space
            if(!task.replace(/\s/g, '').length) {
                task = "$data";
            }

            evaluateAndPromise(task, ctx)
            .then(d => { $.run(tasks.join('->'), slot, d, callback, true); });
        }
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
                                    
                                    trigger.handle($.createMutableElement(e), event, info, $, () => {
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
