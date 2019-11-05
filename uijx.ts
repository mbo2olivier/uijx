import "@babel/polyfill";
import Mutations from './src/mutations';
import Modifiers from './src/modifiers';
import Triggers from './src/triggers';
import { Uijx } from './src/core';

function uijx(id:string):Uijx {
    let u = new Uijx(id);
    
    // register mutations
    u.registerMutation(Mutations.REPLACE);
    u.registerMutation(Mutations.APPEND);
    u.registerMutation(Mutations.ADDCLASS);
    u.registerMutation(Mutations.REMOVE);
    u.registerMutation(Mutations.HIDE);
    u.registerMutation(Mutations.REPTEXT);
    u.registerMutation(Mutations.RMCLASS);
    u.registerMutation(Mutations.SHOW);
    u.registerMutation(Mutations.TOGGLE);
    u.registerMutation(Mutations.TOGGLECLASS);
    u.registerMutation(Mutations.FUNC);
    u.registerMutation(Mutations.CALLABLE);
    u.registerMutation(Mutations.PULSE);
    u.registerMutation(Mutations.ATTRIB);
    u.registerMutation(Mutations.INSERT);

    // register triggers
    u.registerTrigger(Triggers.LINK);
    u.registerTrigger(Triggers.SUBMIT);
    u.registerTrigger(Triggers.LOADING);
    u.registerTrigger(Triggers.LOADED);
    u.registerTrigger(Triggers.CLICK);
    u.registerTrigger(Triggers.CHANGE);
    u.registerTrigger(Triggers.BLUR);
    u.registerTrigger(Triggers.FOCUS);
    u.registerTrigger(Triggers.KEYUP);
    u.registerTrigger(Triggers.KEYDOWN);
    u.registerTrigger(Triggers.CHECKED);
    u.registerTrigger(Triggers.UNCHECKED);
    u.registerTrigger(Triggers.MUTATED);
    u.registerTrigger(Triggers.LOADER);

    //register modifiers
    u.registerModifier(Modifiers.FUNC);
    u.registerModifier(Modifiers.BIND);

    //prepare and return instance;
    u.connect(u.getRoot());
    return u;
}
window["uijx"] = uijx;