import { Uijx } from '../core';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let slot= <HTMLInputElement>e.currentTarget;
    let data:any = slot.value;

    let info = await $.getInfo('keydown',slot);

    if(typeof info.before === 'string') {
        data = await $.task(info.before, slot, data) || data;
    }

    try {
        let t = await info.getTask();
        data = await $.task(t, slot, data);
        if(typeof info.success === 'string') {
            data = await $.task(info.success, slot, data);
        }
    }
    catch(e) {
        if(typeof info.error === 'string') {
            data = await $.task(info.error, slot, e) || e;
        }
        else
            throw e;
    }
    if(typeof info.after === 'string') {
        await $.task(info.after, slot, data)
    }
}

const keydown = {
    name: 'keydown',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("[data-uijx-keydown]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('keydown', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("[data-uijx-keydown]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('keydown', handler);
        }
    }
}

export default keydown;
