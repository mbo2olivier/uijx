import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

export default {
    name: 'link',
    attachTo: 'A',
    event: 'click',
    waiting: true,
    handle (slot, event, info, $, callback) {
        event.preventDefault();
        let data = undefined;

        return $.run(info.before, slot, data)
                .then((d) => {
                    return fetch(slot.$el.href)
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
                            });
                }) 
                .then((d) => $.run(info.after, slot, d, callback))
            ;
    }
}
