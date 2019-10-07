import { invoke } from '../helpers';

export default {
    name: 'FUNC',

    apply(input:any, params:any[]|undefined):string {
        if(typeof params === 'undefined') {
            throw new Error('FUNC modifier require to provide at least one parameter');
        }
        if(typeof params[0] !== 'string') {
            throw new Error('Error while parsing custom modifier function name');
        }
        let fname = params[0];
        params[0] = input;
        return invoke(fname,window, params);
    }
}