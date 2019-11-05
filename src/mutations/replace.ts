import { Uijx } from '../core';

const REPLACE = {
    name: "REPLACE",
    change(data:any,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        if(targetedAttrib !== null) {
            target.setAttribute(targetedAttrib,data);
        }else {
            target.innerHTML = data;
            $.connect(target);
        }
        $.dispatch('mutated', target, {mutation: 'REPLACE', data: data, attrib: targetedAttrib});
    }
}

export default REPLACE;