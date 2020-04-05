
export function evaluateAndReturn(expression, ctx) {
    let f = new Function('c', 'with (c) { return ' + expression + ' }');
    return f(ctx);
}

export function evaluate(expression, ctx) {
    (new Function('c', 'with (c) { ' + expression + ' }'))(ctx);
}

export function crawl(e, callback) {
    if(callback(e) === false) return;
    let n = e.firstElementChild;
    while (n) {
        crawl(n, callback);
        n = n.nextElementSibling;
    }
}

export function getDataAtribute(el, name) {
    if(el.dataset !== undefined) {
        return el.dataset[toCamelCase(name)];
    }else {
        return el.getAttribute("data-"+name);
    }
}

export function setDataAttribute(el, name, value) {
    if(el.dataset !== undefined) {
        el.dataset[toCamelCase(name)] = value; 
    }else{
        el.setAttribute("data-"+name, value);
    }
}

export function toCamelCase (str) {
    return str
        .replace(/\-(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\-/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); })
    ;
}

export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]/, '-')
        .toLowerCase()
    ;
}