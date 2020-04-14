export default {
    name: 'mutation',
    attachTo: 'document',
    event: 'dom-mutated',
    waiting: false,
    handle (slot, event, info, $) {
        let data = undefined;

        if(info.hasModifier(event.detail.target.id) || !info.containModifiers()) {
            
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
