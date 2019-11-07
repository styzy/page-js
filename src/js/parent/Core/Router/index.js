import CONSTANTS from '../../../CONSTANTS'

// Router定义
const Router = function(core) {
    let _this = this

    // 公有方法
    this.open = open
    this.close = close
    this.closeAll = closeAll
    this.reload = reload
    this.redirect = redirect
    this.recoverCache = recoverCache
    this.clearCache = clearCache
    this.syncHeightByPageId = syncHeightByPageId
    this.postMessage = postMessage
    this.setTitle = setTitleByPageId

    /**
     * 打开页面
     * @param {Object} options
     */
    function open(options, sourcePageId) {
        sourcePageId = sourcePageId || null
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
        }

        if (!options.url) {
            core.log.error('打开页面失败，url不可为空')
            return false
        }

        let route = createRoute(options)
        if (route) {
            let page = getPage(route)
            if (route.checkUrlUpdate()) {
                page.update()
            }
            page.open()
            return page.id
        } else {
            return null
        }

        function createRoute(opts) {
            let route = core.createRouteInstance(opts, sourcePageId)
            let existRoute = route.getUrlRepeatRoute()
            if (existRoute) {
                core.removeRouteInstance(route.id)
                existRoute.update(opts)
                return existRoute
            }
            if (!core.pageLimitCheck()) {
                core.removeRouteInstance(route.id)
                core.config.onLimit && core.config.onLimit(core.config.limit)
                return false
            }
            return route
        }

        function getPage({ pageId, id: routeId }) {
            if (pageId) {
                return core.getPageInstance(pageId)
            } else {
                return core.createPageInstanceByRouteId(routeId)
            }
        }
    }

    /**
     * 关闭页面
     * @param {String} pageId
     */
    function close(pageId, isForce) {
        var page = core.getPageInstance(pageId)
        if (!page) {
            core.log.error('关闭页面失败，错误的pageId')
            return false
        }
        var route = core.getRouteInstance(page.routeId)
        if (!route.closeEnable && !isForce) {
            core.log.warn('关闭页面失败，页面配置不允许关闭')
            return false
        }
        page.close()
        route.destory()
    }

    /**
     * 关闭所有页面
     */
    function closeAll(isForce) {
        var pageIdList = core.getPageInstanceIdList()
        for (var i = 0; i < pageIdList.length; i++) {
            _this.close(pageIdList[i], isForce)
        }
    }

    /**
     * 重载页面
     * @param {String} pageId 
     */
    function reload(pageId) {
        var page = core.getPageInstance(pageId)
        if (!page) {
            core.log.error('重载页面错误，错误的pageId')
            return false
        }
        page.reload()
    }

    /**
     * 重定向页面
     * @param {String} url 
     * @param {String} pageId 
     */
    function redirect(url, pageId) {
        var page = core.getPageInstance(pageId)
        if (!page) {
            core.log.error('重定向页面错误，错误的pageId')
            return false
        }
        if (url) {
            var route = core.getRouteInstance(page.routeId)
            route.url = url
            route.update(route)
            page.update()
        } else {
            page.reload()
        }
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
        if (routeHistory instanceof Array) {
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
        var message = {
            type: CONSTANTS.POST_MESSAGE_TYPE,
            from: '',
            to: targetPageId,
            data: data
        }
        message = JSON.stringify(message)
        window.postMessage(message, '*')
    }

    /**
     * 
     * @param {String} pageId 
     * @param {String} title 
     */
    function setTitleByPageId(pageId, title) {
        var page = core.getPageInstance(pageId)
        if (page) {
            page.title.setTitle(title)
        }
    }

}

export default Router