import { Uijx } from '../core';

const SHOW = {
    name: "SHOW",
    change(data:string,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        let t = <HTMLElement>target;
        t.style.display = 'block';
        $.dispatch('mutated', target, {mutation: 'SHOW', data: data, attrib: targetedAttrib});
    }
}

export default SHOW;