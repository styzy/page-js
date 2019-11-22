import { routeRules, globalRouteRules } from '../rules'
import { sync } from '../../../utils'
import CONSTANTS from '../../../CONSTANTS'

// Route类定义
const Route = function(core, options, sourcePageId) {
    var _this = this,
        history = [],
        setOptions = _setOptions.bind(this)

    this.id = core.createRouteInstanceId()
    this.sourcePageId = sourcePageId
    this.pageId = null
    this.getUrlRepeatRoute = getUrlRepeatRoute
    this.update = update
    this.destory = destory

    setOptions(options)

    function update(opts) {
        setOptions(opts)
    }

    function destory() {
        core.removeRouteInstance(_this.id)
    }

    function _setOptions(opts) {
        opts = Object.assign({}, core.config.globalRoute, opts)
        let syncOptions = sync(Object.assign({}, routeRules, globalRouteRules), opts)

        syncOptions.URL = createURL(syncOptions.url)
        syncOptions.url = syncOptions.URL.href

        if (!this.URL || this.URL.href !== syncOptions.URL.href) {
            history.unshift(syncOptions.URL)
        }

        for (const optionsName in syncOptions) {
            if (syncOptions.hasOwnProperty(optionsName)) {
                this[optionsName] = syncOptions[optionsName]
            }
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

        function createURL(url) {
            if (url instanceof URL) {
                return url
            }
            if (typeof url === 'string') {
                return new URL(getAbsoluteUrl(url))
            }

            function getAbsoluteUrl(url) {
                var a = document.createElement('a')
                a.href = url
                return a.href
            }
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
                    url = this.URL.host
                    break;
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME:
                    url = this.URL.host + this.URL.pathname
                    break;
                case CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME_SEARCH:
                    url = this.URL.host + this.URL.pathname + +this.URL.search
                    break;
                case CONSTANTS.RULES.REPEAT_RULE.ALL:
                    url = this.URL.href
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
}

export default Route