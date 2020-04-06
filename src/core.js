import {getDataAttribute, toCamelCase, toKebabCase, evaluate, evaluateAndReturn, crawl } from './helpers';
import Proxy from 'es6-proxy-polyfill/dist/es6-proxy-polyfill';
import "custom-event-polyfill"

const TriggerAttribRE = /^data-on:([a-zA-Z0-9\-]+)(\.[a-zA-Z\.\-]*)?$/;

export class Engine {

    constructor(root) {
        this.root = root;
        
        this.mutations = {};
        this.triggers = {};
        this.tags = {};
    }

    start() {
        this.mount(this.root);
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

    run(task, slot, data = null, callback = undefined) {
        let ctx = this.getEmptyContext();
        ctx.$data = data;
        ctx.$el = slot;

        if(callback) {
            let value = evaluateAndReturn(task, ctx);
            callback(value);
        }
        else {
            evaluate(task, ctx);
        }
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
                            let target = trigger.attachTo === 'root' ? $.root : e;
                            let ev = toKebabCase(trigger.event || info.trigger);
                            
                            target.addEventListener(ev, (event) => {
                                e.dispatchEvent(new CustomEvent('waiting', {
                                    detail: { waiting: true, slot: e }
                                }));
                                
                                trigger.handle($.createMutableElement(e), event, info, $, () => {
                                    e.dispatchEvent(new CustomEvent('waiting', {
                                        detail: { waiting: false, slot: e }
                                    }));
                                })
                            });
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
}
