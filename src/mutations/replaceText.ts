import { Uijx } from '../core';

const REPTEXT = {
    name: "REPTEXT",
    change(data:string,target:Element, targetedAttrib:string|null,$:Uijx):void {
        let t = <HTMLElement>target;
        t.innerText = data;
    }
}

export default REPTEXT;