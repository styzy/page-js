import rules from './rules'
import globalRules from './globalRules'
import CONSTANTS from '../../CONSTANTS'
import { createURL, sync } from '../../utils'

class Route {
    #URL
    #history = []
    title
    titleIcon
    titleCloseButton
    closeEnable
    repeatEnable
    repeatRule
    contextmenuEnable
    contextmenuGroups
    autoSyncHeight
    autoFetchTitle
    onLoad
    onClose
    data
    sandboxMode = false
    viewSourceMode = false
    editSourceMode = false
    customMode = false
    autoFocus = true
    titleWrapper = null
    titleCreator = null
    viewWrapper = null
    get URL() {
        return this.#URL
    }
    get url() {
        return this.URL ? this.URL.href : ''
    }
    set url(url) {
        try {
            this.#URL = createURL(url)
        } catch (error) {}
    }
    get repeatCheckUrl() {
        return this.#getRepeatCheckUrl()
    }
    constructor({ config, options }) {
        try {
            // 移除全局右键菜单配置
            let globalRoute = Object.assign({}, config.globalRoute)
            delete globalRoute.contextmenuGroups

            options = Object.assign({}, globalRoute, options)
            let syncOptions = sync(Object.assign({}, rules, globalRules), options),
                oldURL = this.URL

            this.url = syncOptions.url
            this.title = syncOptions.title
            this.titleIcon = syncOptions.titleIcon
            this.titleCloseButton = syncOptions.titleCloseButton
            this.closeEnable = syncOptions.closeEnable
            this.repeatEnable = syncOptions.repeatEnable
            this.repeatRule = syncOptions.repeatRule
            this.contextmenuEnable = syncOptions.contextmenuEnable
            this.contextmenuGroups = syncOptions.contextmenuGroups
            this.autoSyncHeight = syncOptions.autoSyncHeight
            this.autoFetchTitle = syncOptions.autoFetchTitle
            this.onLoad = syncOptions.onLoad
            this.onClose = syncOptions.onClose
            this.data = syncOptions.data
            if (config.devMode) {
                this.sandboxMode = syncOptions.sandboxMode
                this.viewSourceMode = syncOptions.viewSourceMode
            }
            this.customMode = syncOptions.customMode
            if (this.customMode) {
                this.titleWrapper = syncOptions.titleWrapper
                this.titleCreator = syncOptions.titleCreator
                this.viewWrapper = syncOptions.viewWrapper
                this.autoFocus = syncOptions.autoFocus
            }
            if (!oldURL || oldURL.href !== this.URL.href) {
                this.#history.unshift(syncOptions.URL)
            }
        } catch (error) {
            throw new Error(`Create route error: ${error.message}`)
        }
    }
    /**
     * 检查是否重复
     * @param {Page} pageList
     */
    #getRepeatCheckUrl() {
        let url = ''
        if (typeof this.repeatRule === 'string') {
            switch (this.repeatRule) {
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN:
                    url = this.URL.host
                    break
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME:
                    url = this.URL.host + this.URL.pathname
                    break
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME_SEARCH:
                    url = this.URL.host + this.URL.pathname + +this.URL.search
                    break
                case CONSTANTS.RULES.REPEAT_RULE.ALL:
                    url = this.URL.href
                    break
                default:
                    break
            }
        }
        if (this.repeatRule instanceof Function) {
            url = this.repeatRule(this.URL.href)
            if (typeof url !== 'string') {
                throw `repeatRule为方法时，返回参数类型必须为String，而不是${typeof url}`
            }
        }
        return url
    }
    equalsRepeatUrl(route) {
        return this.repeatCheckUrl === route.repeatCheckUrl
    }
    equalsUrl(route) {
        return this.url === route.url
    }
}

export default Route
