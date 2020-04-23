import CONSTANTS from '../CONSTANTS'
import Core from '../Core'
import Logger from '../Logger'

class Controller {
    static get version() {
        return CONSTANTS.VERSION
    }
    #core
    #logger
    get version() {
        return CONSTANTS.VERSION
    }
    constructor(customConfig = {}) {
        this.#logger = new Logger()
        try {
            this.#core = new Core(this, customConfig)
        } catch (error) {
            this.#exceptionHandler(`初始实例化`, error)
        }
    }
    #exceptionHandler(name, error) {
        if (this.#core ? this.#core.config.devMode : true) {
            if (error instanceof Error) {
                this.#logger.error(`[page] ${name}错误：\n${error.message}`)
            } else {
                this.#logger.warn(`[page] ${name}失败：\n${error}`)
            }
        }
    }
    /**
     * 打开标签页
     * @param {Object} options
     * @param {String} sourcePageId
     */
    open(options = '', sourcePageId) {
        try {
            let route = this.#core.createRoute(options),
                isLimit = this.#core.checkLimit(),
                repeatPage = this.#core.getRepeatPageByRoute(route)
            if (repeatPage) {
                // url不完全一致时，重载重复页面
                if (!route.equalsUrl(repeatPage.route)) {
                    repeatPage.route.url = route.url
                    this.#core.updatePagePayloadById(repeatPage.id, route.data)
                    this.reload(repeatPage.id)
                }
                repeatPage.route.autoFocus && this.focus(repeatPage.id)
                return repeatPage.id
            }
            if (isLimit) {
                this.#core.config.onLimit && this.#core.config.onLimit(this.#core.config.limit)
                throw `标签页达到上限`
            }
            let page = this.#core.createPage(route, sourcePageId)
            page.open()
            page.route.autoFocus && this.focus(page.id)
            return page.id
        } catch (error) {
            this.#exceptionHandler(`打开标签页`, error)
            return false
        }
    }
    /**
     * 刷新页面(不重新加载，仅刷新标签页)
     * @param {String} pageId
     */
    refresh(pageId = '') {
        try {
            let page = this.#core.pages[pageId]
            if (!page) {
                throw new Error(`错误的pageId`)
            }
            page.refresh()
        } catch (error) {
            this.#exceptionHandler(`刷新标签页`, error)
        }
    }
    /**
     * 重新加载
     * @param {String} pageId
     */
    reload(pageId = '') {
        try {
            let page = this.#core.pages[pageId]
            if (!page) {
                throw new Error(`错误的pageId`)
            }
            page.reload()
        } catch (error) {
            this.#exceptionHandler(`重新加载标签页`, error)
        }
    }
    /**
     * 重定向页面
     * @param {String} url
     * @param {String} pageId
     */
    redirect(url = '', pageId = '') {
        try {
            let page = this.#core.pages[pageId]
            if (!page) {
                throw new Error(`错误的pageId`)
            }
            page.redirect(url)
        } catch (error) {
            this.#exceptionHandler(`重定向标签页`, error)
        }
    }
    /**
     * 设置焦点标签页
     * @param {String} pageId
     */
    focus(pageId = '') {
        try {
            this.#core.state.currentPageId = pageId
        } catch (error) {
            this.#exceptionHandler(`设置焦点标签页`, error)
        }
    }
    /**
     * 关闭标签页
     * @param {String} pageId
     * @param {Boolean} isForce
     */
    close(pageId = '', isForce = false) {
        try {
            let page = this.#core.pages[pageId]
            if (!page) {
                throw new Error(`错误的pageId`)
            }
            if (page.close(isForce)) {
                let nextAutoFocusPage
                if (page.id === this.#core.state.currentPageId) {
                    nextAutoFocusPage = this.#core.getNextAutoFocusPageById(page.id)
                    if (nextAutoFocusPage) {
                        this.focus(nextAutoFocusPage.id)
                    }
                }
                page.route.onClose && page.route.onClose(page.id, nextAutoFocusPage ? nextAutoFocusPage.id : null)
                this.#core.config.onClose && this.#core.config.onClose(page.id, nextAutoFocusPage ? nextAutoFocusPage.id : null)
                this.#core.removePage(page)
            }
        } catch (error) {
            this.#exceptionHandler(`关闭标签页`, error)
        }
    }
    /**
     * 关闭全部标签页
     * @param {Boolean} isForce
     */
    closeAll(isForce = false) {
        try {
            this.#core.pageIdList.reverse().forEach((pageId) => {
                this.close(pageId)
            })
        } catch (error) {
            this.#exceptionHandler(`关闭全部标签页`, error)
        }
    }
    /**
     * 发送消息
     * @param {Any} payload
     * @param {String} pageId
     */
    postMessage(payload, pageId = '') {
        try {
            let message = {
                type: CONSTANTS.POST_MESSAGE_TYPE,
                from: '',
                to: pageId,
                data: payload
            }
            message = JSON.stringify(message)
            window.postMessage(message, '*')
        } catch (error) {
            this.#exceptionHandler(`发送消息`, error)
        }
    }
    /**
     * 同步高度
     * @param {String} pageId
     */
    syncHeight(pageId = '') {
        try {
            let page = this.#core.pages[pageId]
            if (!page) {
                throw new Error(`错误的pageId`)
            }
            page.syncHeight()
        } catch (error) {
            this.#exceptionHandler(`同步标签页高度`, error)
        }
    }
    /**
     * 设置标题
     * @param {String} pageId
     * @param {String} title
     */
    setTitle(pageId = '', title = '') {
        try {
            let page = this.#core.pages[pageId]
            if (!page) {
                throw new Error(`错误的pageId`)
            }
            page.setTitle(title)
        } catch (error) {
            this.#exceptionHandler(`设置标签页标题`, error)
        }
    }
    recoverCache() {
        try {
            let cacheRoutes = this.#core.loadCache()
            if (cacheRoutes) {
                cacheRoutes.forEach((route) => {
                    this.open(route)
                })
                return true
            } else {
                return false
            }
        } catch (error) {
            this.#exceptionHandler(`恢复缓存`, error)
            return false
        }
    }
    clearCache() {
        try {
            return this.#core.clearCache()
        } catch (error) {
            this.#exceptionHandler(`清除缓存`, error)
        }
    }
    /**
     * 更新配置
     * @param {Object} customConfig
     */
    config(customConfig = {}) {
        try {
            this.#core.updateConfig(customConfig)
        } catch (error) {
            this.#exceptionHandler(`更新配置`, error)
        }
    }
    /**
     * 检查是否达到上限
     */
    checkLimit() {
        try {
            return this.#core.checkLimit()
        } catch (error) {
            this.#exceptionHandler(`检查是否达到上限`, error)
        }
    }
    /**
     * 获取传递数据
     * @param {String} pageId
     */
    getData(pageId = '') {
        try {
            if (pageId) {
                return this.#core.getPagePayloadById(pageId)
            } else {
                return this.#core.getGlobalPayload()
            }
        } catch (error) {
            this.#exceptionHandler(`获取传递数据`, error)
        }
    }
    /**
     * 更新传递数据
     * @param {Function} update
     * @param {String} pageId
     */
    updateData(update, pageId = '') {
        try {
            if (update instanceof Function) {
                if (pageId) {
                    let newPayload = update(this.#core.getPagePayloadById(pageId))
                    this.#core.updatePagePayloadById(pageId, newPayload)
                } else {
                    let newPayload = update(this.#core.getGlobalPayload())
                    this.#core.updateGlobalPayload(newPayload)
                }
            } else {
                throw new Error(`第一个参数必须为方法`)
            }
        } catch (error) {
            this.#exceptionHandler(`更新传递数据`, error)
        }
    }
}

export default Controller
