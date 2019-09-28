import { Dico, getData } from "./helpers";
import { parseMutation, parseAction } from "./syntax";

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

    public mutate(mutation:string, data:string,target:Element|string, targetedAttrib:string|undefined|null): void {
        if(this.mutations[mutation]) {
            let t = typeof target === 'string' ? this.root.querySelector(target): target;
            if(t !== null)
                this.mutations[mutation].change(data, t, targetedAttrib || null, this);
            else
                throw new Error('cannot find element matching with selector : ' + target);
        }else
            throw new Error('cannot find mutation named :' + mutation);
    }

    public getInfo(trigger:string, el:Element): TriggerInfo {
        let e = el as HTMLElement;
        let m = getData(e,trigger + '-mutation') || "";
        let mres = parseMutation(m);

        let t = new TriggerInfo(this,trigger, el, mres.target, mres.attribute,mres.mutation);
        t.before = getData(e,trigger + '-before');
        t.after = getData(e,trigger + '-after');
        t.error = getData(e,trigger + '-error');
        t.rawData = getData(e,trigger) || "";
        return t;
    }

    public modify(input:any, mods:ModifierData[]):string {
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

    public dispatch(e:string, el:Element,data:CustomEventInit<{}> | undefined):void {
        let ev = new CustomEvent('uijx-' + e,data);
        el.dispatchEvent(ev);
    }
}

export class TriggerInfo {
    public trigger:string;
    public slot: Element;
    public before:string|undefined|null;
    public after:string|undefined|null;
    public error:string|undefined|null;
    private data:string|undefined|null;
    public rawData:string;
    private modifiers:ModifierData[];
    public mutation:string;
    public target: Element|string;
    public targetedAttribute: string | undefined | null;
    public engine: Uijx;

    constructor(engine:Uijx, t:string, slot:Element, target: Element|string, targetedAttrib:string|null = null, mutation:string="REPLACE") {
        this.trigger = t;
        this.slot = slot;
        this.target = target;
        this.engine = engine;
        this.mutation = mutation;
        this.targetedAttribute = targetedAttrib;
        this.modifiers = [];
        this.rawData = "";
    }

    public parseData():void {
        let res = parseAction(this.rawData,true);
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
    change(data:string,target:Element, targetedAttrib:string|null,$:Uijx):void
}

export interface Modifier {
    name: string;
    apply(input:any, params:any[]|undefined):string
}

export interface ModifierData {
    name: string;
    params: Array<any|null>
}
