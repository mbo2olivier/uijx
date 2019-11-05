import { Uijx } from '../core';
import { getEventDetail, getData } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    var slots = $.getRoot().querySelectorAll("[data-uijx-mutated]");
    let c = <CustomEvent>e;
    let target = <HTMLElement>e.target;
    let mutation = getEventDetail(c,'mutation');
    let data = getEventDetail(c,'data');
        
    for(let i=0; i< slots.length;i++) {
        let slot = slots[i];
        let info = await $.getInfo('mutated',slot);

        let id = info.param;
        if(info.param.indexOf(':') > 0) {
            let p = info.param.split(':');
            if(p[1] !== mutation) {
                continue;
            }else{
                id = p[0];
            }
        }
        let el = $.getRoot().querySelector("#"+id);

        if(el !== null && id === target.id) {
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

const mutated = {
    name: 'mutated',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("[data-uijx-mutated]");
        for(let i=0; i< slots.length;i++) {
            let slot = <HTMLElement>slots[i];
            let tid = getData(slot,'uijx-mutated') || '';
            if(tid.indexOf(':') > 0) {
                tid = tid.split(':')[0];
            }
            if(typeof tid === 'string') {
                let target = $.getRoot().querySelector('#' + tid);
                if(target !== null) {
                    target.addEventListener('uijx-mutated', handler);
                }
                else {
                    throw new Error('cannot find element with id: ' + tid);
                }
            }
            else {
                throw new Error('mutated element Id is missing');
            }
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("a[data-uijx-mutated]");
        for(let i=0; i< slots.length;i++) {
            let slot = <HTMLElement>slots[i];
            let tid = getData(slot,'uijx-mutated') ;
            if(typeof tid === 'string') {
                let target = $.getRoot().querySelector('#' + tid);
                if(target !== null) {
                    target.removeEventListener('uijx-mutated', handler);
                }
            }
        }
    }
}

export default mutated;
