import { toKebabCase } from "./helpers";

export const SHOW = {
    name: 'show',
    apply (data, el, $) {
        el.style.display =  data ? 'block' : 'none';

        $.dispatch(el, 'dom-mutated', { mutation: 'show', target: el });
    }
}

export const ADDCLASS = {
    name: 'add-class',
    apply (data, el, $) {
        if(typeof data === 'string') {
            data = data.split(' ');
        }
        for(const i in data) {
            el.classList.add(data[i]);
        }

        $.dispatch(el, 'dom-mutated', { mutation: 'add-class', target: el });
    }
}

export const RMCLASS = {
    name: 'rm-class',
    apply (data, el, $) {
        if(typeof data === 'string') {
            data = data.split(' ');
        }
        for(const i in data) {
            el.classList.remove(data[i]);
        }

        $.dispatch(el, 'dom-mutated', { mutation: 'rm-class', target: el });
    }
}

export const VISIBLE = {
    name: 'visible',
    apply (data, el, $) {
        el.style.visibility =  data ? 'visible' : 'hidden';

        $.dispatch(el, 'dom-mutated', { mutation: 'visible', target: el });
    }
}

export const STYLE = {
    name: 'style',
    apply (data, el, $) {
        for(const prop in data) {
            el.style[toKebabCase(prop)] = data[prop];
        }

        $.dispatch(el, 'dom-mutated', { mutation: 'style', target: el });
    }
}

export const CLASSES = {
    name: 'classes',
    apply (data, el, $) {
        for(const prop in data) {
            if(data[prop]) {
                el.classList.add(prop);
            }
            else {
                el.classList.remove(prop);
            }
        }

        $.dispatch(el, 'dom-mutated', { mutation: 'classes', target: el });
    }
}

export const ATTRIB = {
    name: 'attrib',
    apply (data, el, $) {
        for(const prop in data) {
            el.setAttribute(toKebabCase(prop), data[prop]);
        }

        $.dispatch(el, 'dom-mutated', { mutation: 'attrib', target: el });
    }
}

export const VALUE = {
    name: 'value',
    apply (data, el, $) {
        el.value = data;

        $.dispatch(el, 'dom-mutated', { mutation: 'value', target: el });
    }
}

export const TEXT = {
    name: 'text',
    apply (data, el, $) {
        el.innerText = data;

        $.dispatch(el, 'dom-mutated', { mutation: 'text', target: el });
    }
}

export const HTML = {
    name: 'html',
    apply (data, el, $) {
        el.innerHTML = data;
        
        $.mount(el);

        $.dispatch(el, 'dom-mutated', { mutation: 'html', target: el });
    }
}

export const BEFORE = {
    name: 'before',
    apply (data, el, $) {
        el.insertAdjacentHTML('beforebegin', data);;
        
        $.mount(el);

        $.dispatch(el, 'dom-mutated', { mutation: 'before', target: el });
    }
}

export const AFTER = {
    name: 'after',
    apply (data, el, $) {
        el.insertAdjacentHTML('afterend', data);;
        
        $.mount(el);

        $.dispatch(el, 'dom-mutated', { mutation: 'after', target: el });
    }
}

export const APPEND = {
    name: 'append',
    apply (data, el, $) {
        el.insertAdjacentHTML('beforeend', data);;
        
        $.mount(el);

        $.dispatch(el, 'dom-mutated', { mutation: 'append', target: el });
    }
}

export const PREPEND = {
    name: 'prepend',
    apply (data, el, $) {
        el.insertAdjacentHTML('afterbegin', data);;
        
        $.mount(el);

        $.dispatch(el, 'dom-mutated', { mutation: 'prepend', target: el });
    }
}
