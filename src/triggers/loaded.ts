import { Uijx } from '../core';
import { getEventDetail } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    let c = <CustomEvent>e;
    var slots = $.getRoot().querySelectorAll("[data-uijx-loaded]");
    let dtarget = getEventDetail(c,'target');
    let dloading = getEventDetail(c,'loading');
    let data:any = dloading;

    for(let i=0; i< slots.length;i++) {
        let slot = slots[i];
        let info = await $.getInfo('loaded',slot);

        
        if(info.param === dtarget.id && dloading === false) {
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
                await $.task(info.after, slot, data);
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
