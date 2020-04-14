export default {
    name: 'waiting',
    attachTo: 'document',
    event: 'waiting',
    waiting: false,
    handle (slot, event, info, $) {
        let data = event.detail.waiting;

        if(info.hasModifier(event.detail.slot.id) || !info.containModifiers()) {
            
            return $.run(info.before, slot, data)
                    .then((d) => {
                        d = d || data;
                
                        return $.run(info.task,slot, d);
                    })
                    .then((d) => $.run(info.after, slot, d))
            ;
        }

        return Promise.resolve(undefined);
    }
}
