import { Uijx } from '../core';

const REPLACE = {
    name: "REPLACE",
    change(data:string,target:Element, targetedAttrib:string|null,$:Uijx):void {
        target.innerHTML = data;
        $.connect(target);
    }
}

export default REPLACE;