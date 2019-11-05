import { Uijx } from '../core';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let slot= <HTMLInputElement>e.currentTarget;
    let data:any = slot.value;

    let info = await $.getInfo('focus',slot);

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

const focus = {
    name: 'focus',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("[data-uijx-focus]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('focus', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("[data-uijx-focus]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('focus', handler);
        }
    }
}

export default focus;
