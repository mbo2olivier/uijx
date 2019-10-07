import { template } from 'dot';

export default {
    name: 'BIND',

    apply(input:any, params:any[]|undefined):string {
        if(typeof params === 'undefined') {
            throw new Error('BIND modifier require to provide Id of element to use as template');
        }
        if(typeof params[0] !== 'string') {
            throw new Error('invalid template element id');
        }
        let el = document.getElementById(params[0]);
        if(el === null)
            throw new Error('cannot find template element with id: ' + params[0]);
        
        let fn = template(el.innerText);
        let data = typeof input === 'object' ? input : JSON.parse(input);
        return fn(data);
    }
}