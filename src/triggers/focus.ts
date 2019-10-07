import { Uijx } from '../core';
import { invoke } from '../helpers';

let $:Uijx;

function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let target= <HTMLInputElement>e.currentTarget;

    e.preventDefault();
    let info = $.getInfo('focus',target);

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
