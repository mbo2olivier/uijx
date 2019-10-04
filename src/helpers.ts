export function getData(el:HTMLElement, key:string):string|undefined|null {
    if(el.dataset !== undefined) {
        return el.dataset[toCamelCase(key)];
    }
    return el.getAttribute("data-"+key);
}

export function setData(el:HTMLElement, key:string, value:string):void {
    if(el.dataset !== undefined) {
        el.dataset[toCamelCase(key)] = value; 
    }else{
        el.setAttribute("data-"+key, value);
    }
}

export class Dico<T> {
    [key: string]: T;
}

function toCamelCase (str:string): string {
    return str
        .replace(/\-(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\-/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

export function invoke(fname:string, context:any,...args:any[]):any {
    var namespaces = fname.split('.');
    var func = namespaces.pop();
    if(typeof func === 'undefined') {
        throw new Error('Unable to find function ' + fname + ' in the specified context');
    }
    for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

export function getEventDetail(e:CustomEvent, prop:string):any {
    if(typeof e.detail[prop] !== 'undefined') {
        return e.detail[prop];
    }
    else if(typeof e.detail.detail !== 'undefined' && e.detail.detail[prop] !== 'undefined') {
        return e.detail.detail[prop];
    }
    return undefined;
}
