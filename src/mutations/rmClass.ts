import { Uijx } from '../core';

const RMCLASS = {
    name: "RMCLASS",
    change(data:any,target:Element, targetedAttrib:string|null,params:Array<string|null>=[],$:Uijx):void {
        if(typeof params[0] === 'string') {
            target.classList.remove(params[0]);
            $.dispatch('mutated', target, {mutation: 'RMCLASS', data: params[0], attrib: targetedAttrib});
        }
        else
            throw new Error('classname to toggle is missing');
    }
}

export default RMCLASS;