export default {
    name: 'waiting',
    attachTo: 'document',
    event: 'waiting',
    waiting: false,
    handle (slot, event, info, $) {
        let data = event.detail.waiting;
        let getIn = false;

        if(info.hasModifier('self')) {
            getIn = slot.$el === event.detail.slot;
        }
        else if(event.detail.slot.id && info.hasModifier(event.detail.slot.id)) {
            getIn = true;
        }
        else if(!info.containModifiers()){
            getIn = true;
        }

        if(getIn) {
            
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
