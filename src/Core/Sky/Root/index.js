class Root {
    #parent = null
    #children = []
    #eventListeners = {}
    get parent() {
        return this.#parent
    }
    set parent(parent) {
        if (parent instanceof this.constructor) {
            this.#parent = parent
        }
    }
    get children() {
        return this.#children.map(child => child)
    }
    get eventListeners() {
        return this.#eventListeners
    }
    constructor() {}
    #addEventListener(eventName, listener) {
        if (!eventName) {
            return
        }
        if (!(listener instanceof Function)) {
            return
        }
        if (!this.#eventListeners.hasOwnProperty(eventName)) {
            this.#eventListeners[eventName] = []
        }
        this.#eventListeners[eventName].push(listener)
    }
    #removeEventListener(eventName, listener) {
        if (!eventName) {
            return
        }
        if (!(listener instanceof Function)) {
            return
        }
        if (this.#eventListeners.hasOwnProperty(eventName)) {
            let listenerList = this.#eventListeners[eventName]
            for (let index = 0, length = listenerList.length; index < length; index++) {
                const lsn = listenerList[index]
                if (lsn === listener) {
                    listenerList.splice(index, 1)
                    break
                }
            }
        }
    }
    #cleanEventListener(eventName) {
        if (!eventName) {
            return
        }
        if (this.#eventListeners.hasOwnProperty(eventName)) {
            delete this.#eventListeners[eventName]
        }
    }
    #triggerEventListener(eventName, ...payload) {
        if (!eventName) {
            return
        }
        if (this.#eventListeners.hasOwnProperty(eventName)) {
            let listenerList = this.#eventListeners[eventName]
            for (let index = 0, length = listenerList.length; index < length; index++) {
                const listener = listenerList[index]
                listener.call(this, ...payload)
            }
        }
    }
    on(...args) {
        return this.#addEventListener(...args)
    }
    off(eventName, listener) {
        if (listener) {
            return this.#removeEventListener(eventName, listener)
        } else {
            return this.#cleanEventListener(eventName)
        }
    }
    trigger(...args) {
        return this.#triggerEventListener(...args)
    }
    addChild(child) {
        if (child instanceof this.constructor) {
            this.#children.push(child)
        }
    }
    removeChild(child) {
        this.#children = this.#children.filter(_child => _child !== child)
    }
}

export default Root
