import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';
import 'formdata-polyfill';
import { serializeForm, encodeUriParameters } from '../helpers';

export default {
    name: 'form',
    attachTo: 'FORM',
    event: 'submit',
    waiting: true,
    handle (slot, event, info, $, callback) {
        event.preventDefault();
        let data = undefined;

        $.run(info.before, slot, data, (d) => {
            let url = slot.$el.getAttribute('action');
            let method = slot.$el.getAttribute('method') || 'GET';
            method = method.toUpperCase();
            let fdata = new FormData(slot.$el);

            let req;
            if(method === 'GET') {
                url += '?' + encodeUriParameters(serializeForm(fdata));
                req = fetch(url);
            }
            else {
                req = fetch(url, {
                    method: method,
                    body: info.hasModifier('serialize') ? JSON.stringify(serializeForm(fdata)) : fdata
                })
            }
            
            req
                .then(r => {
                    let p;
                    if(info.hasModifier('json'))
                        p = r.json();
                    else if(info.hasModifier('blob'))
                        p = r.blob();
                    else if(info.hasModifier('buffer'))
                        p = r.arrayBuffer();
                    else
                        p = r.text();
                    
                    return p.then(content => ({status: r.status, content}));
                })
                .then(({status, content})=> {
                    if(status >= 400) {
                        if(info.error) {
                            $.run(info.error,slot, content, (d) => $.run(info.after, slot, d, callback));
                        }
                        else {
                            throw new Error('error after fetching ressource. use the error hook to query the request result');
                        }
                    }
                    else {
                        $.run(info.task,slot, content, (d) => $.run(info.after, slot, d, callback));
                    }
                })
                .catch(e => {
                    console.error(e);
                })
            ;
        });
    }
}
