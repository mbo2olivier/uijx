export class DataSourceParseResult{
    public selector?:string|undefined;
    public attribute?:string|null;
    public computed:string|null=null;

    public compute():void {
        if(this.selector) {
            let e = document.querySelector(this.selector);
            this.computed = e != null ? (this.attribute ? e.getAttribute(this.attribute) : e.innerHTML) : '';
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

export function parseAction(input:string, compute:boolean=true):ActionParseResult {
    input = input.replace(/^\s+|\s+$/g, '');
    let res:ActionParseResult;
    if(input.indexOf('->') > 0) {
        let matches = /^(\((.*)\)(\[(.*)\])?)(?:\s*)->(?:\s*):(.*)+$/.exec(input);
        if(matches) {
            res = {
                data: parseDataSource(matches[1], compute),
                modifiers: matches[5].split(':').map(m => parseModifier(m,compute))
            };
        }
        else {
            throw new Error('Error parsing action command :' + input);
        }
    }else{
        res = {
            data: parseDataSource(input, compute),
            modifiers: []
        }
    }

    return res;
}

export function parseModifier(input:string, compute:boolean = true): ModifierParseResult {
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
            res.params = params.map((p) => parseDataSource(p,true),compute);
        }
        return res;
    }else{
        throw new Error('Error parsing modifier command :' + input);
    }
}

export function parseMutation(input:string):MutationParseResult {
    input = input.replace(/^\s+|\s+$/g, '');
    let target = input;
    let res:MutationParseResult = {
        mutation: 'REPLACE',
        target: target,
        params: []
    };
    if(input.indexOf(':') > 0) {
        let parts = input.split(':');
        target = (parts)[0];
        let matches = /^(\w+)(\((.*)\))?$/.exec(parts[1]);
        if(matches) {
            res.mutation = matches[1].toUpperCase();
            if(matches[3]) {
                let params = matches[3].split(',');
                res.params = params.map((p) => parseDataSource(p,true),true);
            }
        }else{
            throw new Error('Error parsing mutation command :' + input);
        }
    }
    let ds = parseDataSource(target,true);
    if(typeof ds.selector == 'undefined') {
        throw new Error('Error parsing mutation command :' + input);
    }
    let e = document.querySelector(ds.selector);
    res.target = e == null ? ds.selector : e;
    res.attribute = ds.attribute;
    return res;
}

export function parseDataSource(input:string, compute:boolean=true):DataSourceParseResult{
    input = input.replace(/^\s+|\s+$/g, '');
    let res = new DataSourceParseResult();
    res.computed = input;
    
    let matches = /^\((.*)\)(\[(\w*\-*)\])?$/.exec(input);
    if(matches) {
        res.selector = matches[1];
        res.attribute = matches[3];
    }else{
        res.selector = input;
    }
    if(compute) {
        res.compute();
    }
    return res;
}
