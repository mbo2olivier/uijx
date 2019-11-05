import { Uijx } from '../core';
import axios, { AxiosPromise } from 'axios';
import { invoke } from '../helpers';

let $:Uijx;

async function handler(e:Event) {
    if(e.currentTarget == null)
        return;
    let form= <HTMLFormElement>e.currentTarget;
    let data:any = new FormData(form);

    e.preventDefault();
    let info = await $.getInfo('submit',form);

    if(typeof info.before === 'string') {
        data = await $.task(info.before, form, data) || data;
    }

    let url = form.getAttribute('action');
    url = url === null ?  window.location.href : url;
    $.dispatch('loading', null, {loading: true, target: info.target});
    
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

        let t = await info.getTask();
        data = await $.task(t, form, resp.data);
        $.dispatch('loading', null, {loading: false, target: info.target});
        if(typeof info.success === 'string') {
            data = await $.task(info.success, form, data);
        }
    }catch(error) {
        $.dispatch('loading', null, {loading: false, target: info.target});
        if(typeof info.error === 'string') {
            data = await $.task(info.error, form, error) || error;
        }
        else
            throw e;
    }

    if(typeof info.after === 'string') {
        await $.task(info.after, form, data);
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
