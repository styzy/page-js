import Root from '../Root'
import { isHTMLElement } from '../../../utils'

class Component extends Root {
    #element = null
    #parentElement = null
    #rendered = false
    get element() {
        return this.#element
    }
    set element(el) {
        this.#element = this.elementify(el)
    }
    get parentElement() {
        return this.#parentElement
    }
    set parentElement(el) {
        this.#parentElement = this.elementify(el)
    }
    get rendered() {
        return this.#rendered
    }
    constructor() {
        super()
    }
    render() {
        if (!this.rendered && this.parentElement && this.element) {
            this.parentElement.appendChild(this.element)
            this.#rendered = true
            this.trigger('rendered')
        }
    }
    destroy() {
        if (this.rendered && this.element.parentElement === this.parentElement) {
            this.parentElement.removeChild(this.element)
            this.#rendered = false
            this.trigger('destroyed')
        }
    }
    /**
     * 更新渲染状态
     */
    updateRenderState() {
        if (this.element && this.parentElement && this.element.parentElement === this.parentElement) {
            this.#rendered = true
        } else {
            this.#rendered = false
        }
    }
    /**
     * 转换为element
     * @param {*} element
     */
    elementify(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element)
        }
        if (isHTMLElement(element)) {
            return element
        }
        return null
    }
    elementPureCreator(element) {
        if (isHTMLElement(element)) {
            element = element.cloneNode(true)
        }
        if (element instanceof Function) {
            element = element()
        }
        return element
    }
}

export default Component
