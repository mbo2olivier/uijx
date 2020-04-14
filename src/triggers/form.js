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

        return $.run(info.before, slot, data)
                .then((d) => {
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
                    
                    return req
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
                                throw content;
                            }
                            else {
                                return $.run(info.task,slot, content);
                            }
                        })
                        .then((d) => $.run(info.after, slot, d))
                    ;
                })
        ;
    }
}
