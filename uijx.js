import {Engine} from './src/core';
import event from './src/triggers/event'

function uijx(id) {
    let root = document.getElementById(id);
    
    if(root){
        let e = new Engine(root);

        e.registerTrigger(event);

        return e;
    }
    else
        throw new Error('cannot find element with id: ' + id);
}

window["uijx"] = uijx;