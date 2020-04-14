export default {
    name: 'event',
    attachTo: 'self',
    event: null,
    waiting: true,
    handle (slot, event, info, $) {
        let data = undefined;
        
        if(['blur', 'change', 'focus', 'keydown', 'keyup'].indexOf(event.type) >= 0) {
            data = slot.$el.value;
        }

        return $.run(info.before, slot, data)
                .then((d) => {
                    d = d || data;
                    if(info.hasModifier('prevent')) {
                        event.preventDefault();
                    }
        
                    return $.run(info.task,slot, d);
                })
                .then((d) => $.run(info.after, slot, d))
                //.catch((d) => $.run(info.error, slot, d))
        ;
    }
}