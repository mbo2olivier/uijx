import { Uijx } from '../core';
import { invoke, getEventDetail, getData } from '../helpers';

let $:Uijx;

function handler(e:Event) {
    var slots = $.getRoot().querySelectorAll("[data-uijx-mutated]");
    let c = <CustomEvent>e;
    let target = <HTMLElement>e.target;
        
    for(let i=0; i< slots.length;i++) {
        let info = $.getInfo('mutated',slots[i]);

        let id = info.param;
        if(info.param.indexOf(':') > 0) {
            let p = info.param.split(':');
            if(!p[1] === getEventDetail(c,'mutation')) {
                continue;
            }else{
                id = p[0];
            }
        }
        let el = $.getRoot().querySelector("#"+id);

        if(el !== null && id === target.id) {
            if(typeof info.before === 'string') {
                invoke(info.before,window, target);
            }
            info.parseData();
            let data = $.modify(info.getData(), info.getModifiers());
            $.mutate(info.mutation,data,info.target, info.targetedAttribute,info.mutationParams);
            if(typeof info.after === 'string') {
                invoke(info.after,window, target);
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
