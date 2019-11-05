import { Uijx } from '../core';
import { invoke } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let slot= <HTMLInputElement>e.currentTarget;
    let data:any = slot.value;

    let info = await $.getInfo('keyup',slot);

    if(typeof info.before === 'string') {
        data = $.task(info.before, slot, data) || data;
    }

    try {
        let t = await info.getTask();
        data = await $.task(t, slot, data);
        if(typeof info.success === 'string') {
            data = $.task(info.success, slot, data);
        }
    }
    catch(e) {
        if(typeof info.error === 'string') {
            data = $.task(info.error, slot, e) || e;
        }
        else
            throw e;
    }
    if(typeof info.after === 'string') {
        $.task(info.after, slot, data)
    }
}

const keyup = {
    name: 'keyup',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("[data-uijx-keyup]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('keyup', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("[data-uijx-keyup]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('keyup', handler);
        }
    }
}

export default keyup;
