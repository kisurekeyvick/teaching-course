class EventEmitter {
    public listener: {[key: string]: any} = {};

    constructor(public maxListener: number = 10) {
    }

    public on = (event: string, cb: any) => {
        const listener = this.listener;

        if (listener[event] && listener[event].length > this.maxListener) {
            return;
        }

        if (listener[event] instanceof Array) {
            listener[event].indexOf(cb) === -1 && (listener[event].push(cb));
        } else {
            listener[event] = [].concat(cb);
        }
    };

    public addListener = this.on;

    public emit = (event: string, ...args: any[]) => {
        this.listener[event].forEach((cb: Function) => {
            cb.apply(null, args);
        })
    }

    public listeners = (event: string) => {
        return this.listener[event];
    }

    public setMaxListeners = (num: number) => {
        this.maxListener = num;
    }

    public removeListener = (event: string, listener: Function) => {
        const listeners = this.listener;
        const arr = listeners[event] || [];
        const i: number = arr.indexOf(listener);
        if (i > 0) {
            listeners[event].splice(i, 1);
        }
    }

    public removeAllListener = (event: string) => {
        this.listener[event] = [];
    }

    public once = (event: string, listener: Function) => {
        const self = this;
        function fn(...args: any[]) {
            listener.apply(null, args);
            self.removeListener(event, fn);
        }
        this.on(event, fn);
    }
}

export {
    EventEmitter
}
