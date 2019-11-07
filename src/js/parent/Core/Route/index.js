import { routeRules, globalRouteRules } from '../rules'
import { sync } from '../../../utils'
import CONSTANTS from '../../../CONSTANTS'

// Route类定义
const Route = function(core, options, sourcePageId) {
    var _this = this,
        setOptions = _setOptions.bind(this)

    this.id = core.createRouteInstanceId()
    this.sourcePageId = sourcePageId
    this.pageId = null
    this.history = []
    this.getUrlRepeatRoute = getUrlRepeatRoute
    this.checkUrlUpdate = checkUpdate
    this.update = update
    this.destory = destory

    setOptions(options)

    function update(opts) {
        if (opts.url !== this.history[0]) {
            this.history.unshift(opts.url)
        }
        setOptions(opts)
    }

    function destory() {
        core.removeRouteInstance(_this.id)
    }

    function _setOptions(opts) {
        opts = Object.assign({}, core.config.globalRoute, opts)
        let syncOptions = sync(Object.assign({}, routeRules, globalRouteRules), opts)
        for (const optionsName in syncOptions) {
            if (syncOptions.hasOwnProperty(optionsName)) {
                this[optionsName] = syncOptions[optionsName]
            }
        }
        if (this.url instanceof URL) {
            this._url = this.url
            this.url = this._url.href
        }
        if (typeof this.url === 'string') {
            this.url = getAbsoluteUrl(this.url)
            this._url = new URL(this.url)
        }
        if (this.contextMenuGroups === core.config.globalRoute.contextMenuGroups) {
            this.contextMenuGroups = []
        }
        if (!this.customMode) {
            this.titleWrapper = null
            this.titleCreator = null
            this.viewWrapper = null
            this.autoFocus = true
        }
        if (!core.config.devMode) {
            this.sandboxMode = false
        }
        core.setPagePayloadByRouteId(this.id, this.data)

        function getAbsoluteUrl(url) {
            var a = document.createElement('a')
            a.href = url
            return a.href
        }
    }

    function getUrlRepeatRoute() {
        if (this.repeatEnable) {
            return null
        }
        let url = ''
        if (typeof this.repeatRule === 'string') {
            switch (this.repeatRule) {
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN:
                    url = this._url.host
                    break;
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME:
                    url = this._url.host + this._url.pathname
                    break;
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME_SEARCH:
                    url = this._url.host + this._url.pathname + +this._url.search
                    break;
                case CONSTANTS.RULES.REPEAT_RULE.ALL:
                    url = this._url.href
                    break;
                default:
                    break;
            }
        }
        if (typeof this.repeatRule === 'function') {
            try {
                url = this.repeatRule(url) + ''
            } catch (error) {
                core.log.error(new TypeError(`repeatRule为方法时，返回参数类型为String，而不是${typeof this.repeatRule(url)}`))
                url = this.url
            }
        }
        let routeInstances = core.getRouteInstances()
        for (const routeId in routeInstances) {
            const route = routeInstances[routeId]
            if (routeId !== this.id && route.url.indexOf(url) !== -1) {
                return route
            }
        }
        return null
    }

    function checkUpdate() {
        let history = this.history
        if (history.length > 2) {
            return history[0] !== history[1]
        } else {
            return false
        }
    }
}

export default Route