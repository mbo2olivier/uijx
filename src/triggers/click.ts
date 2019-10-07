import { Uijx } from '../core';
import { invoke } from '../helpers';

let $:Uijx;

function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let target= <Element>e.currentTarget;

    e.preventDefault();
    let info = $.getInfo('click',target);

    if(typeof info.before === 'string') {
        invoke(info.before,window, target);
    }

    info.parseData();
    let data = $.modify(info.getData(), info.getModifiers());
    $.mutate(info.mutation,data,info.target, info.targetedAttribute,info.mutationParams);
    if(typeof info.after === 'string') {
        invoke(info.after,window, target,data);
    }
}

const click = {
    name: 'click',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("[data-uijx-click]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('click', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("[data-uijx-click]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('click', handler);
        }
    }
}

export default click;
