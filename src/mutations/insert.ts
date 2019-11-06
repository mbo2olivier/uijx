import { Uijx } from '../core';

const INSERT = {
    name: "INSERT",
    change(data:any,target:Element, targetedAttrib:string|null,params:Array<string|null>=[],$:Uijx):void {
        if(typeof params[0] === 'string') {
            let position = params[0].replace(/^\s+|\s+$/g, '');
            if(position == 'beforebegin' || position == 'afterbegin' || position == 'beforeend' || position == 'afterend') {
                $.disconnect(target);
                target.insertAdjacentHTML(position, data);
                $.connect(target);
                $.dispatch('mutated', target, {mutation: 'INSERT', data: data, attrib: targetedAttrib});
            }else
                throw new Error('position must be on of values: beforebegin, afterbegin, beforeend or afterend');
        }
        else
            throw new Error('position argument is missing for insertion');
    }
}

export default INSERT;