export default {
    name: 'mounted',
    attachTo: 'document',
    event: 'mounted',
    waiting: false,
    handle (slot, event, info, $, callback) {
        let data = undefined;

        $.run(info.before, slot, data, (d) => {
            d = d || data;
    
            $.run(info.task,slot, d, (d) => $.run(info.after, slot, d, callback));
        });
    }
}
