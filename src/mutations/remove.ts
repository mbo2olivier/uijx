import { Uijx } from '../core';

const REMOVE = {
    name: 'REMOVE',
    change(data:any,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        target.remove();
        $.dispatch('mutated', target, {mutation: 'REMOVE', data: data, attrib: targetedAttrib});
    }
}

export default REMOVE;