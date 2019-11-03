import { Uijx } from '../core';
import axios, { AxiosPromise } from 'axios';
import { invoke } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let form= <HTMLFormElement>e.currentTarget;

    e.preventDefault();
    let info = await $.getInfo('submit',form);

    if(typeof info.before === 'string') {
        invoke(info.before,window, form);
    }

    let url = form.getAttribute('action');
    url = url === null ?  window.location.href : url;
    $.dispatch('loading', null, {loading: true, target: info.target});
    let data = new FormData(form);
    let ctype = form.getAttribute('enctype') || 'application/x-www-form-urlencoded';
    let method = getMethod(form);
    
    try {
        let resp;
        if(method === 'GET') {
            resp = await axios.get(url, {
                params: serialize(data)
            });
        }else {
            resp = await axios({
                method: method,
                url: url,
                data: data,
                headers: {'Content-Type': ctype }
            });
        }

        await info.parseData();
        let r = $.modify(resp.data, info.getModifiers());
        $.mutate(info.mutation,r,info.target, info.targetedAttribute,info.mutationParams);
        $.dispatch('loading', null, {loading: false, target: info.target});
        if(typeof info.after === 'string') {
            invoke(info.after,window, form,r);
        }
    }catch(error) {
        $.dispatch('loading', null, {loading: false, target: info.target});
        if(typeof info.error === 'string') {
            invoke(info.error,window, form,error);
        }
    }
}

function getMethod(f:HTMLFormElement):"get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH" | undefined
{
    let m =  f.getAttribute('method') || 'POST';

    switch(m.toUpperCase()) {
        case 'GET':
            return 'GET';
        case 'PUT':
            return 'PUT';
        case 'DELETE':
            return 'DELETE';
        case 'PATCH':
            return 'PATCH';
        default:
            return 'POST';
    }
}

function serialize(f:FormData):any {
    let data: {[key: string]:string} = {};
    f.forEach(function(value, key){
        data[key] = <string>value;
    });
    return data;
}

const submit = {
    name: 'submit',

    connect(el:Element, uijx:Uijx):void {
        $ = uijx;
        var slots = el.querySelectorAll("form[data-uijx-submit]");
        for(let i=0; i< slots.length;i++) {
            slots[i].addEventListener('submit', handler);
        }
    },

    disconnect(el:Element, $:Uijx):void {
        var slots = el.querySelectorAll("form[data-uijx-submit]");
        for(let i=0; i< slots.length;i++) {
            slots[i].removeEventListener('submit', handler);
        }
    }
}

export default submit;
