import { Dico, getData, invoke } from "./helpers";
import { parseMutation, parseAction, parseTask, parseDataSource } from "./syntax";

export class Uijx {
    
    private root:Element;
    private triggers:Dico<Trigger>;
    private modifiers:Dico<Modifier>;
    private mutations:Dico<Mutation>;

    constructor(id:string) {
        let root = document.getElementById(id);
        if(root) {
            this.root = root;
            this.triggers = new Dico<Trigger>();
            this.modifiers = new Dico<Modifier>();
            this.mutations = new Dico<Mutation>();
        }else{
            throw new Error("cannot find element with id: " + id);
        }
    }

    public getRoot():Element {
        return this.root;
    }

    public registerTrigger(t:Trigger):Uijx{
        this.triggers[t.name] = t;
        return this;
    }

    public connect(el:Element):void {
        for(let k in this.triggers) {
            this.triggers[k].connect(el, this);
        }
    }

    public disconnect(el:Element):void {
        for(let k in this.triggers) {
            this.triggers[k].disconnect(el, this);
        }
    }

    public registerModifier(m:Modifier):Uijx {
        this.modifiers[m.name] = m;
        return this;
    }

    public registerMutation(m:Mutation):Uijx {
        this.mutations[m.name] = m;
        return this;
    }

    public mutate(mutation:string, data:any,target:Element|string, targetedAttrib:string|undefined|null,mutationParams:Array<string|null>=[]): void {
        if(this.mutations[mutation]) {
            let t = typeof target === 'string' ? this.root.querySelector(target): target;
            if(t !== null)
                this.mutations[mutation].change(data, t, targetedAttrib || null, mutationParams,this);
            else
                throw new Error('cannot find element matching with selector : ' + target);
        }else
            throw new Error('cannot find mutation named :' + mutation);
    }

    public async getInfo(trigger:string, s:Element): Promise<TriggerInfo> {
        let slot = s as HTMLElement;
        let m = getData(slot,trigger + '-mutation');
        let t = new TriggerInfo(this,trigger, s);
        t.before = getData(slot,trigger + '-before');
        t.after = getData(slot,trigger + '-after');
        t.error = getData(slot,trigger + '-error');
        t.success = getData(slot,trigger + '-success');
        t.param = getData(slot,'uijx-' + trigger) || "";
        t.rawData = getData(slot,trigger + '-source') || t.param;
        t.task = getData(slot,trigger + '-task') || t.rawData;

        if(!m) {
            let parts = t.task.split('->');
            m =  parts.length === 3 ? parts[2] : m;
        }
        
        if(m) {
            t.isMutationDefined = true;
            let mres = await parseMutation(m);
            if(mres.mutation === 'CALLABLE') {
                mres.target = s;
            } else
                mres.target = mres.target === '' ? slot : mres.target;

            t.mutationParams = mres.params.map((v) => v.computed);
            t.mutation = mres.mutation;
            t.target = mres.target;
        }else
            t.isMutationDefined = false;

        return t;
    }

    public modify(input:any, mods:ModifierData[]):any {
        return mods.reduce((i,mod) => {
            if(this.modifiers[mod.name]) {
                let m = this.modifiers[mod.name];
                return m.apply(i,mod.params);
            }
            else {
                throw new Error('modifier "' + mod.name + '" is not registrated.');
            }
        }, input);
    }

    public dispatch(e:string, el:Element|null,d:{}|undefined = undefined):void {
        let data:CustomEventInit<{}> = { detail: d };
        data.bubbles = false;
        let ev:CustomEvent;
        let ename = 'uijx-' + e;
        if ( typeof window.CustomEvent === "function" ) {
            ev = new CustomEvent(ename,data);
        }
        else {
            ev = document.createEvent('CustomEvent');
            ev.initCustomEvent(ename, false, false, data );
        }
        if(el === null)
            document.dispatchEvent(ev);
        else
            el.dispatchEvent(ev);
    }

    public async task(task:TaskInfo|string, slot:Element, input:any):Promise<any> {
        let t:TaskInfo;
        if(typeof task === 'string') {
            if(task.indexOf('->') >= 0) {
                t = new TaskInfo();
                let res = await parseTask(task, true);
                t.data = res.data.computed;
                res.modifiers.forEach(m => {
                    t.modifiers.push({ name: m.modifier, params : m.params.map(p => p.computed) });
                });

                if(res.mutation.mutation === 'CALLABLE') {
                    t.target = slot;
                } else
                    t.target = res.mutation.target === '' ? slot : res.mutation.target;
                
                t.mutationParams = res.mutation.params.map((v) => v.computed);
                t.mutation = res.mutation.mutation;
            }
            else
                return invoke(task, window, slot, input) || input;
        }
        else
            t = task;

        let data:any = t.data ? t.data : input;
        
        data = this.modify(data, t.modifiers);
        this.mutate(t.mutation, data, t.target, t.targetedAttribute, t.mutationParams);

        return data;
    }
}

export class TaskInfo {
    public modifiers:ModifierData[];
    public mutation:string;
    public mutationParams:Array<string|null>;
    public target: Element|string;
    public targetedAttribute: string | undefined | null;
    public data:any;

    constructor() {
        this.modifiers = [];
        this.mutation = 'REPLACE';
        this.mutationParams = [];
        this.targetedAttribute = null;
        this.target = '';
        this.data = null;
    }
}

export class TriggerInfo {
    public trigger:string;
    public slot: Element;
    public before:string|undefined|null;
    public after:string|undefined|null;
    public error:string|undefined|null;
    public success:string|undefined|null;
    private data:string|undefined|null;
    public task:string;
    public rawData:string;
    public param:string;
    private modifiers:ModifierData[];
    public mutation:string;
    public mutationParams:Array<string|null>;
    public target: Element|string;
    public targetedAttribute: string | undefined | null;
    public isMutationDefined:boolean;
    public engine: Uijx;

    constructor(engine:Uijx, t:string, slot:Element, target: Element|string = '', targetedAttrib:string|null = null, mutation:string="REPLACE", mutationParams:Array<string|null>=[]) {
        this.trigger = t;
        this.slot = slot;
        this.target = target;
        this.engine = engine;
        this.mutation = 'REPLACE';
        this.targetedAttribute = null;
        this.modifiers = [];
        this.rawData = "";
        this.param = "";
        this.mutationParams = [];
        this.isMutationDefined = false;
        this.task = '';
    }

    public async getTask():Promise<TaskInfo> {
        let t = new TaskInfo();
        let res = await parseTask(this.task, true, false);
        t.data = res.data.computed;
        res.modifiers.forEach(m => {
            t.modifiers.push({ name: m.modifier, params : m.params.map(p => p.computed) });
        });

        if(this.isMutationDefined) {
            t.target = this.target;
            t.mutation = this.mutation;
            t.mutationParams = this.mutationParams;
        }
        else {
            if(res.mutation.mutation === 'CALLABLE') {
                t.target = this.slot;
            } else
                t.target = res.mutation.target === '' ? this.slot : res.mutation.target;
            
            t.mutationParams = res.mutation.params.map((v) => v.computed);
        }
        
        return t;
    }

    public async parseData():Promise<void> {
        let res = await parseAction(this.rawData,true);
        this.data = res.data.computed;
        res.modifiers.forEach(m => {
            this.modifiers.push({ name: m.modifier, params : m.params.map(p => p.computed) });
        });
        
    }

    public getData():string|undefined|null {
        return this.data;
    }

    public getModifiers():ModifierData[] {
        return this.modifiers;
    }
}

export interface Trigger {
    name:string;
    connect(el:Element, $:Uijx):void
    disconnect(el:Element, $:Uijx):void
}

export interface Mutation {
    name:string;
    change(data:any,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>,$:Uijx):void
}

export interface Modifier {
    name: string;
    apply(input:any, params:any[]|undefined):any
}

export interface ModifierData {
    name: string;
    params: Array<any|null>
}
