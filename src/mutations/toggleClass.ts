import { Uijx } from '../core';

const TOGGLECLASS = {
    name: "TOGGLECLASS",
    change(data:string,target:Element, targetedAttrib:string|null,params:Array<string|null>=[],$:Uijx):void {
        if(typeof params[0] === 'string') {
            target.classList.toggle(params[0]);
            $.dispatch('mutated', target, {mutation: 'TOGGLECLASS', data: params[0], attrib: targetedAttrib});
        }
        else
            throw new Error('classname to toggle is missing');
    }
}

export default TOGGLECLASS;