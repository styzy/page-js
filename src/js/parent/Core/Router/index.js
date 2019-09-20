import constants from '../../../constants'

// Router定义
const Router = function(core) {
    let _this = this

    // 公有方法
    this.open = open
    this.close = close
    this.closeAll = closeAll
    this.reload = reload
    this.recoverCache = recoverCache
    this.clearCache = clearCache
    this.syncHeightByPageId = syncHeightByPageId
    this.postMessage = postMessage

    /**
     * 打开页面
     * @param {Object} options
     */
    function open(options) {
        var pageId = null
        switch (typeof options) {
            case 'string':
                options = {
                    url: options,
                    title: options
                }
                break;
            case 'object':
                break;
            default:
                core.log.error('打开页面失败，接收的参数类型为String|Object|Route实例，而不是' + typeof options)
                return false
                break;
        }

        var route = createRoute(options)
        if (route) {
            var page = createPage(options, route)
            page.open()
            pageId = page.id
        }

        return pageId

        function createRoute(opts) {
            var route = null
                // 允许重复
            if (opts.repeatEnable) {
                if (!core.pageLimitCheck()) {
                    core.config.onLimit && core.config.onLimit(core.config.limit)
                    return false
                }
                route = core.createRouteInstanceByConfig(opts)
            } else {
                var existRoute = core.getRouteInstanceByUrl(opts.url)
                if (existRoute) {
                    route = existRoute
                    route.update(opts)
                } else {
                    if (!core.pageLimitCheck()) {
                        core.config.onLimit && core.config.onLimit(core.config.limit)
                        return false
                    }
                    route = core.createRouteInstanceByConfig(opts)
                }
            }
            return route
        }

        function createPage(opts, route) {
            var page = null
            if (route.pageId) {
                page = core.getPageInstance(route.pageId)
                if (route.preUrl) {
                    page.update()
                }
            } else {
                page = core.createPageInstanceByRouteId(route.id)
            }
            return page
        }
    }

    /**
     * 关闭页面
     * @param {String} pageId
     */
    function close(pageId) {
        var page = core.getPageInstance(pageId)
        if (!page) {
            log.error('关闭页面错误，错误的pageId')
            return false
        }
        var route = core.getRouteInstance(page.routeId)
        page.close()
        route.destory()
    }

    /**
     * 关闭所有页面
     */
    function closeAll() {
        var pageIdList = core.getPageInstanceIdList()
        for (var i = 0; i < pageIdList.length; i++) {
            _this.close(pageIdList[i])
        }
    }

    /**
     * 重载页面
     * @param {String} pageId 
     */
    function reload(pageId) {
        var page = core.getPageInstance(pageId)
        if (!page) {
            log.error('重载页面错误，错误的pageId')
            return false
        }
        page.reload()
    }

    /**
     * 从缓存恢复已打开的页面
     */
    function recoverCache() {
        if (!core.config.cacheEnable) {
            core.log.warn('配置中已禁用缓存，无法恢复缓存页面');
            return false
        }
        var routeHistory = core.loadLocalCache()
        if (typeof routeHistory === 'object') {
            if (routeHistory.length) {
                for (var i = 0; i < routeHistory.length; i++) {
                    _this.open(routeHistory[i])
                }
                return true
            }
        }
        return false
    }

    /**
     * 清除本地缓存
     */
    function clearCache() {
        core.clearLocalCache()
    }

    /**
     * 通过pageId同步子页面高度
     * @param {String} pageId 
     */
    function syncHeightByPageId(pageId) {
        var page = core.getPageInstance(pageId)
        if (page) {
            page.syncHeight()
        }
    }

    /**
     * 向子页面发送消息
     * @param {*} data 
     * @param {String} targetPageId 
     */
    function postMessage(data, targetPageId) {
        var postData = {
            type: constants.postMessageType,
            from: '',
            to: targetPageId,
            data: data
        }
        window.postMessage(postData, '*')
    }

}

export default Router