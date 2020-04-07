export default {
    name: 'state-change',
    attachTo: 'document',
    event: 'state-change',
    waiting: false,
    handle (slot, event, info, $, callback) {
        let data = event.detail.value;

        if(info.hasModifier(event.detail.state) || !info.containModifiers()) {
            
            $.run(info.before, slot, data, (d) => {
                d = d || data;
        
                $.run(info.task,slot, d, (d) => $.run(info.after, slot, d, callback));
            });
        }
    }
}