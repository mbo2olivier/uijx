import { Uijx } from '../core';
import { invoke, getEventDetail } from '../helpers';

let $:Uijx;

function handler(e:Event) {
    var slots = $.getRoot().querySelectorAll("[data-uijx-loaded]");
    let c = <CustomEvent>e;
    for(let i=0; i< slots.length;i++) {
        let target = slots[i];
        let info = $.getInfo('loaded',target);

        if(typeof info.before === 'string') {
            invoke(info.before,window, target);
        }

        let dtarget = getEventDetail(c,'target');
        let dloading = getEventDetail(c,'loading');
        if(info.param === dtarget.id && dloading === false) {
            info.parseData();
            let data = $.modify(info.getData(), info.getModifiers());
            $.mutate(info.mutation,data,info.target, info.targetedAttribute,info.mutationParams);
            if(typeof info.after === 'string') {
                invoke(info.after,window, target);
            }
        }
    }
}

const loaded = {
    name: 'loaded',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        document.addEventListener('uijx-loading', handler);
    },

    disconnect(el:Element, $:Uijx):void {
        document.removeEventListener('uijx-loading', handler);
    }
}

export default loaded;
