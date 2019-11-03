import { getData } from "./helpers";
import axios from "axios";

export class DataSourceParseResult{
    public selector?:string|undefined;
    public attribute?:string|null;
    public computed:string|null=null;
    public isRawData:boolean = false;
    public resource:string|undefined;

    public async compute():Promise<void> {
        if(this.isRawData)
            return;
        if(this.resource) {
            var resp = await axios.get(this.resource);
            this.computed = <string> resp.data;
        }
        else if(this.selector) {
            let e = <HTMLElement> document.querySelector(this.selector);
            if(e !== null) {
                if(this.attribute) {
                    this.attribute = this.attribute.trim();
                    if(this.attribute === 'value') {
                        if(e.nodeName === 'INPUT' || e.nodeName === 'SELECT' || e.nodeName === 'TEXTAREA') {
                            let input = <HTMLInputElement> e;
                            this.computed = input.value;
                        }
                        else {
                            this.computed = null;
                        }
                    }
                    else if(this.attribute.indexOf('data-') == 0) {
                        this.computed = getData(e,this.attribute.substr(5)) || null;
                    }
                    else {
                        this.computed = e.getAttribute(this.attribute);
                    }
                }else
                    this.computed = e.innerHTML;
            }else{
                this.computed = '';
            }     
        }
        else {
            this.computed = '';
        }
    }
}

export interface TargetParseResult {
    target: DataSourceParseResult;
    mutation:MutationParseResult;
}

export interface ModifierParseResult {
    modifier:string;
    params:DataSourceParseResult[]
}

export interface MutationParseResult {
    mutation:string;
    target: Element|string;
    attribute?:string|undefined|null;
    params:DataSourceParseResult[]
}

export interface ActionParseResult {
    data: DataSourceParseResult,
    modifiers: ModifierParseResult[]
}

export async function  parseAction(input:string, compute:boolean=true):Promise<ActionParseResult> {
    input = input.replace(/^\s+|\s+$/g, '');
    let res:ActionParseResult;
    if(input.indexOf('->') > 0) {
        let matches = /^(\((.*)\)(\[(.*)\])?)(?:\s*)->(?:\s*):(.*)+$/.exec(input);
        if(matches) {
            res = {
                data: await parseDataSource(matches[1], compute),
                modifiers: []
            };
            
            for(const m of matches[5].split(':')) {
                let mod = await parseModifier(m,compute);
                res.modifiers.push(mod);
            }
        }
        else {
            throw new Error('Error parsing action command :' + input);
        }
    }else{
        res = {
            data: await parseDataSource(input, compute),
            modifiers: []
        }
    }

    return res;
}

export async function parseModifier(input:string, compute:boolean = true): Promise<ModifierParseResult> {
    input = input.replace(/^\s+|\s+$/g, '');
    let res:ModifierParseResult;
    let matches = /^(\w+)(\((.*)\))?$/.exec(input);
    if(matches) {
        res = {
            modifier: matches[1].toUpperCase(),
            params: []
        };
        if(matches[3]) {
            let params = matches[3].split(',');
            for(const p of params) {
                let c = await parseDataSource(p,compute);
                res.params.push(c);
            }
        }
        return res;
    }else{
        throw new Error('Error parsing modifier command :' + input);
    }
}

export async function parseMutation(input:string):Promise<MutationParseResult> {
    input = input.replace(/^\s+|\s+$/g, '');
    let target = input;
    let res:MutationParseResult = {
        mutation: 'REPLACE',
        target: target,
        params: []
    };
    var fnMatch = /^fn\((.*)\)$/.exec(input);
    if(fnMatch) {
        res.mutation = 'CALLABLE';
        target = '';
        if(fnMatch[1]) {
            let params = fnMatch[1].split(',');
            for(const p of params) {
                let c = await parseDataSource(p,true);
                res.params.push(c);
            }
        }
    }
    else if(input.indexOf(':') >= 0) {
        let parts = input.split(':');
        target = (parts)[0];
        let matches = /^(\w+)(\((.*)\))?$/.exec(parts[1]);
        if(matches) {
            res.mutation = matches[1].toUpperCase();
            if(matches[3]) {
                let params = matches[3].split(',');
                for(const p of params) {
                    let c = await parseDataSource(p,true);
                    res.params.push(c);
                }
            }
        }else{
            throw new Error('Error parsing mutation command :' + input);
        }
    }
    
    target = target.replace(/^\s+|\s+$/g, '');
    let matches = /^\((.*)\)(\[(\w*\-*)\])?$/.exec(target);
    if(matches) {
        res.target = matches[1];
        res.attribute = matches[3];
    }else{
        res.target = target;
    }
    if(res.target !== '') {
        let e = document.querySelector(res.target);
        if(e == null) {
            throw new Error('cannot find element targeted by: ' + res.target);
        }
        res.target = e;
    }
    return res;
}

export async function parseDataSource(input:string, compute:boolean=true):Promise<DataSourceParseResult>{
    input = input.replace(/^\s+|\s+$/g, '');
    let res = new DataSourceParseResult();
    res.computed = input;
    
    let matches = /^\((.*)\)(\[(.*)\])?$/.exec(input);
    if(matches) {
        if(matches[1] === '_http') {
            res.resource = matches[3];
        }else {
            res.selector = matches[1];
            res.attribute = matches[3];
        }
    }else{
        res.isRawData = true;
    }

    if(compute) {
        await res.compute();
    }
    return res;
}
