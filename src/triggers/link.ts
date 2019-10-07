import { Uijx } from '../core';
import axios from 'axios';
import { invoke } from '../helpers';

let $:Uijx;

function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let target= <Element>e.currentTarget;

    e.preventDefault();
    let info = $.getInfo('link',target);

    if(typeof info.before === 'string') {
        invoke(info.before,window, target);
    }

    let href = target.getAttribute('href');
    if(typeof href !== 'string') {
        throw new Error('missing href attribute on ' + target);
    }
    $.dispatch('loading', null, {loading: true, target: info.target});
    axios
        .get(href)
        .then((resp) => {
            info.parseData();
            let r = $.modify(resp.data, info.getModifiers());
            $.mutate(info.mutation,r,info.target, info.targetedAttribute,info.mutationParams);
            $.dispatch('loading', null, {loading: false, target: info.target});
            if(typeof info.after === 'string') {
                invoke(info.after,window, target,r);
            }
        })
        .catch(function (error) {
            $.dispatch('loading', null, {loading: false, target: info.target });
            if(typeof info.error === 'string') {
                invoke(info.error,window, target,error);
            }
        })
    ;
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
