import { Uijx } from '../core';
import { invoke } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let target= <HTMLInputElement>e.currentTarget;

    let info = await $.getInfo('keyup',target);

    if(typeof info.before === 'string') {
        invoke(info.before,window, target);
    }

    await info.parseData();
    let data = info.getData() == '' ? target.value : info.getData();
    data = $.modify(data, info.getModifiers());
    $.mutate(info.mutation,data,info.target, info.targetedAttribute,info.mutationParams);
    if(typeof info.after === 'string') {
        invoke(info.after,window, target,data);
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
