import { Uijx } from '../core';

const REPTEXT = {
    name: "REPTEXT",
    change(data:any,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        let t = <HTMLElement>target;
        t.innerText = data;
        $.dispatch('mutated', target, {mutation: 'REPTEXT', data: data, attrib: targetedAttrib});
    }
}

export default REPTEXT;