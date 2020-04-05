export default {
    name: 'event',
    attachTo: 'self',
    event: null,
    handle (slot, event, info, $, callback) {
        $.run(info.before, slot, undefined, (data) => {
            if(info.hasModifier('prevent')) {
                event.preventDefault();
            }

            $.run(info.task,slot, data, (data) => $.run(info.after, slot, data, callback));
        });
    }
}