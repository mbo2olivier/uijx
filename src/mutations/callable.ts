import { Uijx } from '../core';
import { invoke } from '../helpers';

const CALLABLE = {
    name: "CALLABLE",
    change(data:string,target:Element, targetedAttrib:string|null,params:Array<string|null>=[],$:Uijx):void {
        if(typeof params === 'undefined') {
            throw new Error('CALLABLE mutation require to provide at least one parameter');
        }
        if(typeof params[0] !== 'string') {
            throw new Error('Error while parsing custom mutation function name');
        }
        let fname = params[0];
        params[0] = data;
        let args = [target, targetedAttrib].concat(params);
        return invoke(fname,window, ...args);
    }
}

export default CALLABLE;