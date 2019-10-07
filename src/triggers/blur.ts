import { Uijx } from '../core';
import { invoke } from '../helpers';

let $:Uijx;

function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let target= <HTMLInputElement>e.currentTarget;

    let info = $.getInfo('blur',target);

    if(typeof info.before === 'string') {
        invoke(info.before,window, target);
    }

    info.parseData();
    let data = info.getData() == '' ? target.value : info.getData();
    data = $.modify(data, info.getModifiers());
    $.mutate(info.mutation,data,info.target, info.targetedAttribute,info.mutationParams);
    if(typeof info.after === 'string') {
        invoke(info.after,window, target,data);
    }
}

const blur = {
    name: 'blur',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("[data-uijx-blur]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('blur', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("[data-uijx-blur]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('blur', handler);
        }
    }
}

export default blur;
