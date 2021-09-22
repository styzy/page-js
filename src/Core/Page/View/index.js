import CONSTANTS from '../../../CONSTANTS'
import SuperView from '../SuperView'
import { replaceAll, isCrossOrigin } from '../../../utils'

class View extends SuperView {
    #sandboxMode = false
    #viewSourceMode = false
    #editSourceMode = false
    get sandboxMode() {
        return this.#sandboxMode
    }
    get viewSourceMode() {
        return this.#viewSourceMode
    }
    get editSourceMode() {
        return this.#editSourceMode
    }
    get crossOrigin() {
        return isCrossOrigin(this.element)
    }
    constructor(route, pageId) {
        super(route)
        this.element = this.#createElement(pageId)
    }
    #createElement(pageId) {
        let el = document.createElement('iframe')
        el.className = CONSTANTS.CLASS_NAME.VIEW.IFRAME
        el.src = this.route.url
        el.name = pageId
        el.frameBorder = 0
        el.setAttribute('allowtransparency', 'true')

        if (this.route.sandboxMode) {
            el.sandbox = ''
            el.className += ` ${CONSTANTS.CLASS_NAME.VIEW.SANDBOX_MODE}`
            this.#sandboxMode = true
        }
        if (el.attachEvent) {
            el.attachEvent('onload', (event) => {
                this.#iframeLoad(event)
            })
        } else {
            el.addEventListener('load', (event) => {
                this.#iframeLoad(event)
            })
        }
        return el
    }
    #iframeLoad(event) {
        if (this.crossOrigin) {
            this.trigger('load', event)
            return
        }
        this.route.autoSyncHeight && this.syncHeight()
        if (this.route.editSourceMode) {
            this.#editSource()
            this.element.className += ` ${CONSTANTS.CLASS_NAME.VIEW.EDIT_SOURCE_MODE}`
            this.#editSourceMode = true
        } else if (this.route.viewSourceMode) {
            this.#viewSource()
            this.element.className += ` ${CONSTANTS.CLASS_NAME.VIEW.VIEW_SOURCE_MODE}`
            this.#viewSourceMode = true
        }
        this.trigger('load', event, this.#getTitle())
    }
    // 获取子页面实际title
    #getTitle() {
        if (this.element) {
            return this.element.contentWindow.document.title
        }
    }
    // 查看源码
    #viewSource() {
        if (this.crossOrigin) {
            return
        }
        let iframeWindow = this.element.contentWindow,
            iframeDocument = iframeWindow.document,
            code = iframeDocument.documentElement.innerHTML
        iframeDocument.body.innerText = code
    }
    // 编辑源码
    #editSource() {
        this.#viewSource()
        let iframeWindow = this.element.contentWindow,
            iframeDocument = iframeWindow.document
        iframeDocument.body.setAttribute('contenteditable', 'true')
    }
    submitSource() {
        if (!this.editSourceMode) {
            return
        }
        let iframeWindow = this.element.contentWindow,
            iframeDocument = iframeWindow.document,
            code = iframeDocument.body.innerText
        iframeDocument.documentElement.innerHTML = code
        this.#editSourceMode = false
    }
    focus() {
        if (!this.element.className.includes(CONSTANTS.CLASS_NAME.VIEW.FOCUS)) {
            this.element.className += ` ${CONSTANTS.CLASS_NAME.VIEW.FOCUS}`
        }
    }
    blur() {
        if (this.element.className.includes(CONSTANTS.CLASS_NAME.VIEW.FOCUS)) {
            this.element.className = replaceAll(this.element.className, ` ${CONSTANTS.CLASS_NAME.VIEW.FOCUS}`)
        }
    }
    syncHeight() {
        if (this.crossOrigin) {
            return
        }
        let iframeWindow = this.element.contentWindow
        if (this.element.attachEvent) {
            this.element.height = iframeWindow.document.documentElement.scrollHeight
        } else {
            this.element.style.height = iframeWindow.getComputedStyle(iframeWindow.document.documentElement)['height']
        }
    }
    postMessage(message) {
        if (this.crossOrigin) {
            return
        }
        const iframeWindow = this.element.contentWindow
        iframeWindow.postMessage(message.toString(), '*')
    }
}

export default View
