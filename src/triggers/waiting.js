export default {
    name: 'waiting',
    attachTo: 'document',
    event: 'waiting',
    waiting: false,
    handle (slot, event, info, $, callback) {
        let data = event.detail.waiting;

        if(info.hasModifier(event.detail.slot.id) || !info.containModifiers()) {
            
            $.run(info.before, slot, data, (d) => {
                d = d || data;
        
                $.run(info.task,slot, d, (d) => $.run(info.after, slot, d, callback));
            });
        }
    }
}
