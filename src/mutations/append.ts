import { Uijx } from '../core';

const APPEND = {
    name: "APPEND",
    change(data:string,target:Element, targetedAttrib:string|null,mutationParams:Array<string|null>=[],$:Uijx):void {
        var div = document.createElement('div');
        div.innerHTML = data;
        $.disconnect(target);
        while(div.firstChild) {
            target.appendChild(div.firstChild);
        }
        $.connect(target);
        $.dispatch('mutated', target, {mutation: 'APPEND', data: data, attrib: targetedAttrib});
    }
}

export default APPEND;