import {Engine} from './src/core';
import event from './src/triggers/event';
import link from './src/triggers/link';
import form from './src/triggers/form';
import waiting from './src/triggers/waiting';
import mutation from './src/triggers/mutation';
import stateChanged from './src/triggers/stateChanged';
import { SHOW , ADDCLASS, RMCLASS, VISIBLE, STYLE, CLASSES, ATTRIB, VALUE, TEXT, HTML, AFTER, BEFORE, PREPEND, APPEND } from './src/mutations';

function Uijx(id) {
    let root = document.getElementById(id);
    
    if(root){
        let e = new Engine(root);
        // register built-in triggers
        e.registerTrigger(event);
        e.registerTrigger(link);
        e.registerTrigger(form);
        e.registerTrigger(waiting);
        e.registerTrigger(mutation);
        e.registerTrigger(stateChanged);

        //register built-in mutations
        e.registerMutation(SHOW);
        e.registerMutation(ADDCLASS);
        e.registerMutation(RMCLASS);
        e.registerMutation(STYLE);
        e.registerMutation(VISIBLE);
        e.registerMutation(CLASSES);
        e.registerMutation(ATTRIB);
        e.registerMutation(VALUE);
        e.registerMutation(TEXT);
        e.registerMutation(HTML);
        e.registerMutation(AFTER);
        e.registerMutation(BEFORE);
        e.registerMutation(APPEND);
        e.registerMutation(PREPEND);

        return e;
    }
    else
        throw new Error('cannot find element with id: ' + id);
}

window["Uijx"] = Uijx;