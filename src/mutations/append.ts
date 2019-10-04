import { Uijx } from '../core';

const APPEND = {
    name: "APPEND",
    change(data:string,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        target.innerHTML += data;
        $.disconnect(target);
        $.connect(target);
        $.dispatch('mutated', target, {mutation: 'APPEND', data: data, attrib: targetedAttrib});
    }
}

export default APPEND;