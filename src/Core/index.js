import CONSTANTS from '../CONSTANTS'
import { replaceAll, isHTMLElement, px2number, deepClone } from '../utils'
import Config from './Config'
import TitleContainer from './TitleContainer'
import Page from './Page'
import Route from './Route'
import Message from '../Message'

class Core {
    #controller
    #config
    #titleContainer
    #pages = {}
    #pageCounter = 0
    #state = {}
    #el_viewContainer
    #el_viewWrapper
    #payloadStorage
    get controller() {
        return this.#controller
    }
    get config() {
        return this.#config
    }
    get pages() {
        return Object.assign({}, this.#pages)
    }
    get pageList() {
        return Object.values(this.pages)
    }
    get pageIdList() {
        return Object.keys(this.pages)
    }
    get pageCounter() {
        return ++this.#pageCounter
    }
    get state() {
        return this.#state
    }
    get titleContainer() {
        return this.#titleContainer
    }
    get el_viewContainer() {
        return this.#el_viewContainer
    }
    get el_viewWrapper() {
        return this.#el_viewWrapper
    }
    constructor(controller, customConfig) {
        this.#controller = controller
        this.#config = new Config(customConfig)
        this.#titleContainer = this.#createTitleContainer()
        this.#setViewElement()
        this.#initRouteElement()
        this.#observeState(this.state)
        this.#setMessageReceiver()
        this.#initPayloadStorage()
        this.#setFrameworkSupportFlag()
        this.#handleDevMode()
    }
    #createTitleContainer() {
        let titleContainer = new TitleContainer(this)
        titleContainer.on('mouseWheel', (event, isUp) => {
            this.pageList.forEach((page) => {
                page.destroyContextmenu()
            })
        })
        return titleContainer
    }
    /**
     * 初始化视图节点
     */
    #setViewElement() {
        let el_view_container, el_view_wrapper
        if (typeof this.config.viewContainer === 'string') {
            el_view_container = document.querySelector(this.config.viewContainer)
        }
        if (!isHTMLElement(el_view_container)) {
            throw new Error(`viewContainer必须为有效的选择器或HTMLELement实例`)
        }
        el_view_container.className += ` ${CONSTANTS.CLASS_NAME.VIEW_CONTAINER}`

        el_view_wrapper = document.createElement('div')
        el_view_wrapper.className = CONSTANTS.CLASS_NAME.VIEW_WRAPPER

        el_view_container.appendChild(el_view_wrapper)

        this.#el_viewContainer = el_view_container
        this.#el_viewWrapper = el_view_wrapper
    }
    /**
     * 初始化路由节点
     */
    #initRouteElement() {
        let el_routes = document.querySelectorAll(CONSTANTS.SELECTOR.ROUTE_ELEMENT),
            self = this
        el_routes.forEach((el) => {
            el.addEventListener('click', function () {
                let options = {
                    url: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_URL)),
                    title: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_TITLE)),
                    titleIcon: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_TITLE_ICON)),
                    closeEnable: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_CLOSE_ENABLE)),
                    repeatEnable: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_REPEAT_ENABLE)),
                    repeatRule: this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_REPEAT_RULE),
                    autoSyncHeight: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_AUTO_SYNC_HEIGHT) === 'false'),
                    onLoad: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_ON_LOAD)),
                    onClose: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_ON_CLOSE))
                }

                // 剔除未定义参数
                for (const key in options) {
                    if (options.hasOwnProperty(key)) {
                        const value = options[key]
                        if (value === null) {
                            delete options[key]
                        }
                    }
                }

                self.controller.open(options)
            })
        })

        function getEvalValue(str) {
            if (str) {
                try {
                    str = eval(str)
                } catch (error) {
                } finally {
                    return str
                }
            } else {
                return null
            }
        }
    }
    /**
     * 设置观察者object
     * @param {Object} object
     */
    #observeState(object) {
        let currentPageId = null
        Object.defineProperties(object, {
            currentPageId: {
                enumerable: true,
                configurable: false,
                set: (targetPageId) => {
                    if (currentPageId === targetPageId) {
                        return
                    }
                    if (!this.pages.hasOwnProperty(targetPageId)) {
                        return
                    }
                    let currentPage = this.pages[currentPageId]
                    let targetPage = this.pages[targetPageId]
                    currentPage && currentPage.blur()
                    targetPage && targetPage.focus()
                    currentPageId = targetPageId
                },
                get() {
                    return currentPageId
                }
            }
        })
    }
    /**
     * 设置消息接收器
     */
    #setMessageReceiver() {
        window.addEventListener('message', (nativeMessage) => {
            let message = nativeMessage.data
            if (message) {
                try {
                    message = new Message(message)
                } catch (error) {
                    return
                }
            } else {
                return
            }

            const pageId = message.to,
                page = this.pages[pageId]
            if (pageId && page) {
                page.postMessage(message)
            } else {
                if (this.config.onMessage instanceof Function) {
                    this.config.onMessage(message.payload, message)
                }
            }
        })
    }
    /**
     * 初始化负载仓库
     */
    #initPayloadStorage() {
        this.#payloadStorage = {}
        this.#payloadStorage[CONSTANTS.PAYLOAD_CORE_NAME] = this
        this.#payloadStorage[CONSTANTS.PAYLOAD_GLOBAL_NAME] = this.config.globalData
        window[CONSTANTS.PAYLOAD_STORAGE_NAME] = this.#payloadStorage
    }
    /**
     * 设置框架支持标识
     */
    #setFrameworkSupportFlag() {
        window[CONSTANTS.FRAMEWORK_SUPPROT_FLAG] = true
    }
    /**
     * 处理开发商模式
     */
    #handleDevMode() {
        if (this.config.devMode) {
            window.devPage = this
        }
    }
    /**
     * 生成pageId
     */
    #createPageId() {
        return `${CONSTANTS.PAGE_ID_PREFIX}-${this.pageCounter}`
    }
    /**
     * 设置标签页的传递数据
     * @param {String} pageId
     * @param {Any} payload
     */
    #setPagePayloadById(pageId, payload) {
        this.#payloadStorage[pageId] = payload
    }
    /**
     * 保存本地缓存
     */
    #saveCache() {
        if (!this.config.cacheEnable) {
            return
        }
        let routes = this.pageList.map((page) => {
            return {
                route: page.route,
                url: page.route.url
            }
        })
        window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE.ROUTE_HISTORY, JSON.stringify(routes))
    }
    /**
     * 更新配置
     * @param {Object} customConfig
     */
    updateConfig(customConfig) {
        this.config.update(customConfig)
    }
    createRoute(options) {
        if (['string', 'object'].every((type) => type !== typeof options)) {
            throw new Error(`参数类型错误，必须为 String 或 Object`)
        }
        if (typeof options === 'string') {
            options = {
                url: options,
                title: options
            }
        }
        if (!options.url) {
            throw new Error(`参数必须为有效url字符串或包含url字段`)
        }
        return new Route({ config: this.config, options })
    }
    /**
     * 创建page
     * @param {Route} route
     */
    createPage(route, sourcePageId) {
        if (!route instanceof Route) {
            throw new Error(`参数必须为Route实例`)
        }
        if (!this.pages[sourcePageId]) {
            sourcePageId = null
        }
        let page = new Page({ id: this.#createPageId(), core: this, route, sourcePageId })
        this.#pages[page.id] = page
        this.#setPagePayloadById(page.id, route.data)
        this.#saveCache()
        return page
    }
    /**
     * 移除page
     * @param {String | Page} pageId
     */
    removePage(pageId) {
        if (pageId instanceof Page) {
            pageId = pageId.id
        }
        if (this.pages.hasOwnProperty(pageId)) {
            delete this.#pages[pageId]
            this.#saveCache()
        }
    }
    /**
     * 根据route获取重复的page
     * @param {Route} route
     */
    getRepeatPageByRoute(route) {
        if (!route.repeatEnable) {
            for (let index = 0, length = this.pageList.length; index < length; index++) {
                const page = this.pageList[index]
                if (route.equalsRepeatUrl(page.route)) {
                    return page
                }
            }
        }
        return false
    }
    /**
     * 根据pageId获取下一个标签页page
     * @param {String} pageId
     */
    getNextAutoFocusPageById(pageId) {
        let autoFocusPageList = this.pageList.filter((page) => page.route.autoFocus)
        for (let index = 0, length = autoFocusPageList.length; index < length; index++) {
            const page = autoFocusPageList[index]
            if (page.id === pageId) {
                if (index + 1 === length) {
                    return autoFocusPageList[index - 1]
                } else {
                    return autoFocusPageList[index + 1]
                }
            }
        }
    }
    /**
     * 加载缓存
     */
    loadCache() {
        if (!this.config.cacheEnable) {
            throw `配置中已禁用缓存，无法恢复缓存标签页，可以通过配置cacheEnable参数来开启该功能。`
        }
        let routesString = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE.ROUTE_HISTORY)
        if (!routesString) {
            return false
        }
        let routes = JSON.parse(routesString)
        routes = routes.map((item) => {
            item.route.url = item.url
            return item.route
        })
        return routes
    }
    /**
     * 清除本地缓存
     */
    clearCache() {
        window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE.ROUTE_HISTORY, '')
    }
    /**
     * 检查是否超过上限
     */
    checkLimit() {
        return this.config.limit && this.pageList.length >= this.config.limit
    }
    /**
     * 计算所有标题长度
     */
    getAllTitleWidth() {
        let titleList = this.pageList.map((page) => page.title).filter((title) => title.rendered && title.parentElement === this.titleContainer.wrapperElement),
            totalWidth = 0

        titleList.forEach((title) => {
            totalWidth += title.getComputedWidth()
        })

        return totalWidth
    }
    /**
     * 获取全局的传递数据
     */
    getGlobalPayload() {
        return deepClone(this.#payloadStorage[CONSTANTS.PAYLOAD_GLOBAL_NAME])
    }
    /**
     * 修改全局的传递数据
     * @param {Any} payload
     */
    updateGlobalPayload(payload) {
        this.#payloadStorage[CONSTANTS.PAYLOAD_GLOBAL_NAME] = payload
    }
    /**
     * 获取标签页的传递数据
     * @param {String} pageId
     */
    getPagePayloadById(pageId) {
        if (!this.#payloadStorage.hasOwnProperty(pageId)) {
            throw new Error(`错误的pageId`)
        }
        return deepClone(this.#payloadStorage[pageId])
    }
    /**
     * 修改标签页的传递数据
     * @param {String} pageId
     * @param {Any} payload
     */
    updatePagePayloadById(pageId, payload) {
        if (!this.#payloadStorage.hasOwnProperty(pageId)) {
            throw new Error(`错误的pageId`)
        }
        this.#payloadStorage[pageId] = payload
    }
}

export { Core as Page }

export default Core
