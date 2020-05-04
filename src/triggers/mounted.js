export default {
    name: 'mounted',
    attachTo: 'document',
    event: 'mounted',
    waiting: false,
    handle (slot, event, info, $) {
        let data = undefined;

        return $.run(info.before, slot, data)
                .then((d) => {
                    d = d || data;
            
                    return $.run(info.task,slot, d);
                })
                .then((d) => $.run(info.after, slot, d))
        ;
    }
}
