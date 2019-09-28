import Mutations from './src/mutations';
import Triggers from './src/triggers';
import { Uijx } from './src/core';

function uijx(id:string):Uijx {
    let u = new Uijx(id);
    
    // register mutations
    u.registerMutation(Mutations.REPLACE);
    u.registerMutation(Mutations.APPEND);

    // register triggers
    u.registerTrigger(Triggers.LINK);
    //prepare and return instance;
    u.connect(u.getRoot());
    return u;
}
window["uijx"] = uijx;