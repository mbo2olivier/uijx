import { Uijx } from '../core';
import { invoke } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let slot= <HTMLInputElement>e.currentTarget;

    let info = await $.getInfo('checked',slot);

    if(typeof info.before === 'string') {
        invoke(info.before,window, slot);
    }
    
    if(slot.checked) {
        await info.parseData();
        let data = $.modify(info.getData(), info.getModifiers());
        $.mutate(info.mutation,data,info.target, info.targetedAttribute,info.mutationParams);
        if(typeof info.after === 'string') {
            invoke(info.after,window, slot,data);
        }
    }
}

const checked = {
    name: 'checked',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("[data-uijx-checked]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('change', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("[data-uijx-checked]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('change', handler);
        }
    }
}

export default checked;
