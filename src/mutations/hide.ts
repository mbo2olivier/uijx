import { Uijx } from '../core';

const HIDE = {
    name: "HIDE",
    change(data:any,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        let t = <HTMLElement>target;
        t.style.display = 'none';
        $.dispatch('mutated', target, {mutation: 'HIDE', data: data, attrib: targetedAttrib});
    }
}

export default HIDE;