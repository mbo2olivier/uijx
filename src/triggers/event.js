export default {
    name: 'event',
    attachTo: 'self',
    event: null,
    waiting: true,
    handle (slot, event, info, $, callback) {
        let data = undefined;
        
        if(['blur', 'change', 'focus', 'keydown', 'keyup'].indexOf(event.type) >= 0) {
            data = slot.$el.value;
        }

        $.run(info.before, slot, data, (d) => {
            d = d || data;
            if(info.hasModifier('prevent')) {
                event.preventDefault();
            }

            $.run(info.task,slot, d, (d) => $.run(info.after, slot, d, callback));
        });
    }
}