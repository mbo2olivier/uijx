import { Uijx } from '../core';
import axios from 'axios';
import { invoke } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let slot= <Element>e.currentTarget;
    let data:any = '';

    e.preventDefault();
    let info = await $.getInfo('link',slot);

    if(typeof info.before === 'string') {
        data = $.task(info.before, slot, data) || data;
    }

    let href = slot.getAttribute('href');
    if(typeof href !== 'string') {
        throw new Error('missing href attribute on ' + slot);
    }
    $.dispatch('loading', null, {loading: true, target: info.target});
    
    try {
        let resp = await axios.get(href);
        let t = await info.getTask();
        data = await $.task(t, slot, resp.data);
        $.dispatch('loading', null, {loading: false, target: info.target});
        if(typeof info.success === 'string') {
            data = $.task(info.success, slot, data);
        }
    }catch(error) {
        $.dispatch('loading', null, {loading: false, target: info.target });
        if(typeof info.error === 'string') {
            data = $.task(info.error, slot, error) || error;
        }
        else
            throw e;
    }
    if(typeof info.after === 'string') {
        $.task(info.after, slot, data);
    }
}

const link = {
    name: 'link',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("a[data-uijx-link]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('click', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("a[data-uijx-link]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('click', handler);
        }
    }
}

export default link;
