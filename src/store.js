import Proxy from 'es6-proxy-polyfill/dist/es6-proxy-polyfill';

export default class Store {
    constructor($, params) {
        let self = this;

        self.actions = params.hasOwnProperty('actions') ? params.actions : {};
        self.state = new Proxy(params.state || {}, {
            set(state, key, value) {

                state[key] = value;

                $.dispatch(document, 'state-change', { state: key, value: value  });

                return true;
            }
        });
    }

    dispatch (action, payload) {
        let self = this;
        if(typeof self.actions[action] !== 'function') {
            throw new Error('Action ' + action +' doesn\'t exist.');
        }

        self.actions[action](self.state, payload);
    }
}