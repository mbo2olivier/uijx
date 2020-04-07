export default {
    name: 'mutation',
    attachTo: 'document',
    event: 'dom-mutated',
    waiting: false,
    handle (slot, event, info, $, callback) {
        let data = undefined;

        if(info.hasModifier(event.detail.target.id) || !info.containModifiers()) {
            
            $.run(info.before, slot, data, (d) => {
                d = d || data;
        
                $.run(info.task,slot, d, (d) => $.run(info.after, slot, d, callback));
            });
        }
    }
}
