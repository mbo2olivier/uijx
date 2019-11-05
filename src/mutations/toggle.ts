import { Uijx } from '../core';

const TOGGLE = {
    name: "TOGGLE",
    change(data:any,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        let t = <HTMLElement>target;
        if (t.style.display === "none") {
            t.style.display = "block";
        } else {
            t.style.display = "none";
        }
        $.dispatch('mutated', target, {mutation: 'TOGGLE', data: data, attrib: targetedAttrib});
    }
}

export default TOGGLE;