import { Uijx } from '../core';

const APPEND = {
    name: "APPEND",
    change(data:string,target:Element, targetedAttrib:string|null,$:Uijx):void {
        target.innerHTML += data;
        $.disconnect(target);
        $.connect(target);
    }
}

export default APPEND;