import CONSTANTS from './Constants'
import { isHTMLElement } from '../utils'

class Logger {
    #element
    #nativeMode = true
    get nativeMode() {
        return this.#nativeMode
    }
    constructor(element) {
        this.#element = this.#elementify(element)
        this.#nativeMode = !this.#element
    }
    /**
     * 转换为element
     * @param {*} element
     */
    #elementify(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element)
        }
        if (isHTMLElement(element)) {
            return element
        }
        return null
    }
    log(...args) {
        if (this.nativeMode) {
            return window.console.log(...args)
        }
    }
    warn(...args) {
        if (this.nativeMode) {
            return window.console.warn(...args)
        }
    }
    info(...args) {
        if (this.nativeMode) {
            return window.console.info(...args)
        }
    }
    error(...args) {
        if (this.nativeMode) {
            return window.console.error(...args)
        }
    }
}

export default Logger
