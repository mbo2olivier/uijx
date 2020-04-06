import { toKebabCase } from "./helpers";

export const SHOW = {
    name: 'show',
    apply (data, el, $) {
        el.style.display =  data ? 'block' : 'none';

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'show', target: el } }));
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

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'add-class', target: el } }));
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

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'rm-class', target: el } }));
    }
}

export const VISIBLE = {
    name: 'visible',
    apply (data, el, $) {
        el.style.visibility =  data ? 'visible' : 'hidden';

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'visible', target: el } }));
    }
}

export const STYLE = {
    name: 'style',
    apply (data, el, $) {
        for(const prop in data) {
            el.style[toKebabCase(prop)] = data[prop];
        }

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'style', target: el } }));
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

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'classes', target: el } }));
    }
}

export const ATTRIB = {
    name: 'attrib',
    apply (data, el, $) {
        for(const prop in data) {
            el.setAttribute(toKebabCase(prop), data[prop]);
        }

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'attrib', target: el } }));
    }
}

export const VALUE = {
    name: 'value',
    apply (data, el, $) {
        el.value = data;

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'value', target: el } }));
    }
}

export const TEXT = {
    name: 'text',
    apply (data, el, $) {
        el.innerText = data;

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'text', target: el } }));
    }
}

export const HTML = {
    name: 'html',
    apply (data, el, $) {
        el.innerHTML = data;
        
        $.mount(el);

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'html', target: el } }));
    }
}

export const BEFORE = {
    name: 'before',
    apply (data, el, $) {
        el.insertAdjacentHTML('beforebegin', data);;
        
        $.mount(el);

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'before', target: el } }));
    }
}

export const AFTER = {
    name: 'after',
    apply (data, el, $) {
        el.insertAdjacentHTML('afterend', data);;
        
        $.mount(el);

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'after', target: el } }));
    }
}

export const APPEND = {
    name: 'append',
    apply (data, el, $) {
        el.insertAdjacentHTML('beforeend', data);;
        
        $.mount(el);

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'after', target: el } }));
    }
}

export const PREPEND = {
    name: 'prepend',
    apply (data, el, $) {
        el.insertAdjacentHTML('afterbegin', data);;
        
        $.mount(el);

        el.dispatchEvent(new CustomEvent('dom-mutated', { detail: { mutation: 'prepend', target: el } }));
    }
}
