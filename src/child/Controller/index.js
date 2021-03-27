import CONSTANTS from '../../CONSTANTS'
import { deepClone } from '../../utils'

class Controller {
    #isChild = window.self !== window.top
    #isInPageFrameWork = !!window.top[CONSTANTS.FRAMEWORK_SUPPROT_FLAG]
    #isPageChild = this.isInPageFrameWork ? window.name.includes(CONSTANTS.PAGE_ID_PREFIX) : false
    #pageId = this.isPageChild ? window.name : ''
    #payloadStorage
    #parentCore
    #parentController
    #globalPayload
    #pagePayload
    #messageReceiver = null
    get isChild() {
        return this.#isChild
    }
    get isInPageFrameWork() {
        return this.#isInPageFrameWork
    }
    get isPageChild() {
        return this.#isPageChild
    }
    get pageId() {
        if (this.isPageChild) {
            return this.#pageId
        }
    }
    get sourcePageId() {
        if (this.isPageChild) {
            return this.#parentCore.pages[this.#pageId].sourcePageId
        }
    }
    get pageData() {
        if (!this.isPageChild) return

        return this.#pagePayload
    }
    get globalData() {
        if (!this.isInPageFrameWork) return

        return this.#globalPayload
    }
    constructor() {
        if (this.isChild) {
            if (this.isInPageFrameWork) {
                this.#payloadStorage = window.top[CONSTANTS.PAYLOAD_STORAGE_NAME]
                this.#parentCore = this.#payloadStorage[CONSTANTS.PAYLOAD_CORE_NAME]
                this.#parentController = this.#parentCore.controller
                this.#globalPayload = deepClone(this.#payloadStorage[CONSTANTS.PAYLOAD_GLOBAL_NAME])
                if (this.isPageChild) {
                    this.#pagePayload = deepClone(this.#payloadStorage[this.#pageId])
                }
            }
        }
        this.#bindLoadHandler()
        this.#bindMessageHandler()
    }
    #bindLoadHandler() {
        window.addEventListener('load', () => {
            let initHandler = window[CONSTANTS.CHILD_INIT_CALLBACK_NAME]
            if (initHandler instanceof Function) {
                initHandler(this, this.globalData)
            }
        })
    }
    #bindMessageHandler() {
        if (!this.isPageChild) return

        window.addEventListener('message', (nativeMessage) => {
            let message = nativeMessage.data
            if (message && typeof message === 'string') {
                try {
                    message = JSON.parse(message)
                } catch (error) {
                    return
                }
            } else {
                return
            }

            if (message.type === CONSTANTS.POST_MESSAGE_TYPE) {
                this.#messageReceiver && this.#messageReceiver(message)
            }
        })
    }
    open(options) {
        if (!this.isPageChild) {
            if (typeof options == 'object') {
                options = options.url || ''
            }
            return window.open(options)
        }

        return this.#parentController.open(options, this.#pageId)
    }
    refresh(pageId = this.#pageId) {
        if (!this.isPageChild) {
            return window.location.reload()
        }

        return this.#parentController.refresh(pageId)
    }
    reload(pageId = this.#pageId) {
        if (!this.isPageChild) {
            return window.location.reload()
        }

        return this.#parentController.reload(pageId)
    }
    redirect(url = '', pageId = this.#pageId) {
        if (!this.isPageChild) {
            return window.location.replace(url)
        }

        return this.#parentController.redirect(url, pageId)
    }
    close(pageId = this.#pageId) {
        if (!this.isPageChild) {
            return window.close()
        }

        return this.#parentController.close(pageId)
    }
    closeAll() {
        if (!this.isPageChild) {
            return window.close()
        }

        return this.#parentController.closeAll()
    }
    focus(...args) {
        return this.#parentController.focus(...args)
    }
    postMessage(data, pageId) {
        if (!this.isPageChild) return

        let message = {
            type: CONSTANTS.POST_MESSAGE_TYPE,
            from: this.#pageId,
            to: pageId,
            data: data
        }
        message = JSON.stringify(message)
        window.top.postMessage(message, '*')
    }
    setMessageReceiver(receiver) {
        if (receiver instanceof Function) {
            this.#messageReceiver = receiver
        }
    }
    getMessageReceiver() {
        return this.#messageReceiver
    }
    syncHeight() {
        if (!this.isPageChild) return

        return this.#parentController.syncHeight(this.#pageId)
    }
    setTitle(title = '') {
        if (!this.isPageChild) {
            document.title = title
            return
        }

        return this.#parentController.setTitle(this.#pageId, title)
    }
    recoverCache() {
        if (!this.isPageChild) return

        return this.#parentController.recoverCache()
    }
    clearCache() {
        if (!this.isPageChild) return

        return this.#parentController.clearCache()
    }
}

export default Controller
