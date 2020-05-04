import {Engine} from './src/core';
import event from './src/triggers/event';
import link from './src/triggers/link';
import form from './src/triggers/form';
import waiting from './src/triggers/waiting';
import mutation from './src/triggers/mutation';
import stateChanged from './src/triggers/stateChanged';
import mounted from './src/triggers/mounted';
import { SHOW , TOGGLE, ADDCLASS, RMCLASS, TOGGLECLASS, VISIBLE, STYLE, CLASSES, ATTRIB, VALUE, TEXT, HTML, AFTER, BEFORE, PREPEND, APPEND } from './src/mutations';

function Uijx(id) {
    let root = document.getElementById(id);
    
    if(root){
        let e = new Engine(root);
        // register built-in triggers
        e.trigger(event);
        e.trigger(link);
        e.trigger(form);
        e.trigger(waiting);
        e.trigger(mutation);
        e.trigger(stateChanged);
        e.trigger(mounted);

        //register built-in mutations
        e.mutation(SHOW);
        e.mutation(TOGGLE);
        e.mutation(ADDCLASS);
        e.mutation(RMCLASS);
        e.mutation(TOGGLECLASS);
        e.mutation(STYLE);
        e.mutation(VISIBLE);
        e.mutation(CLASSES);
        e.mutation(ATTRIB);
        e.mutation(VALUE);
        e.mutation(TEXT);
        e.mutation(HTML);
        e.mutation(AFTER);
        e.mutation(BEFORE);
        e.mutation(APPEND);
        e.mutation(PREPEND);

        return e;
    }
    else
        throw new Error('cannot find element with id: ' + id);
}

window["Uijx"] = Uijx;