import { Uijx } from '../core';
import { setData } from '../helpers';

const ATTRIB = {
    name: "ATTRIB",
    change(data:any,target:Element, targetedAttrib:string|null,params:Array<string|null>=[],$:Uijx):void {
        if(typeof params[0] === 'string') {
            let attrib = params[0];
            if(attrib === 'value' && typeof data === 'string') {
                let e = <HTMLInputElement>target;
                e.value = data;
            }
            else if (attrib.indexOf("data-") === 0) {
                setData(<HTMLElement>target, attrib.substr(5),data);
            }
            else
                target.setAttribute(attrib,data);
            $.dispatch('mutated', target, {mutation: 'ATTRIB', data: { value: data, attrib: attrib }, attrib: targetedAttrib});
        }
        else
            throw new Error('classname to toggle is missing');
    }
}

export default ATTRIB;