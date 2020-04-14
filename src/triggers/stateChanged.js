export default {
    name: 'state-change',
    attachTo: 'document',
    event: 'state-change',
    waiting: false,
    handle (slot, event, info, $) {
        let data = event.detail.value;

        if(info.hasModifier(event.detail.state) || !info.containModifiers()) {
            
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