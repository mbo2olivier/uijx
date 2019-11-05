import { Uijx } from '../core';

const PULSE = {
    name: "PULSE",
    change(data:any,target:Element, targetedAttrib:string|null,params:Array<string|null>=[],$:Uijx):void {
        if(typeof params[0] === 'string') {
            if(data) {
                target.classList.add(params[0]);
            }else
                target.classList.remove(params[0]);
            $.dispatch('mutated', target, {mutation: 'PULSE', data: data, attrib: targetedAttrib});
        }
        else
            throw new Error('classname to toggle is missing');
    }
}

export default PULSE;