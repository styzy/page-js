import constants from '../../../constants'

// Router定义
const Router = function(core) {
    let _this = this

    // 初始化
    if (!init()) {
        return false
    }

    // 公有方法
    this.open = open
    this.close = close
    this.closeAll = closeAll
    this.reload = reload
    this.recoverCache = recoverCache
    this.clearCache = clearCache
    this.syncHeightByPageId = syncHeightByPageId

    // 初始化方法
    function init() {
        try {
            initTitleCtn();
            initViewCtn();
            initRoute();
            return true;
        } catch (e) {
            core.log.error('初始化失败\n' + e);
            return false
        }

        // 初始化跳转路由
        function initRoute() {
            var el_routes = document.querySelectorAll(constants.selector.routeEl)
            for (var i = 0; i < el_routes.length; i++) {
                var el = el_routes[i]
                el.addEventListener('click', function() {
                    bindElClick.call(this)
                })
            }

            function bindElClick() {
                if (!core.router) {
                    return false
                }
                var options = {
                    url: this.getAttribute(constants.attributeName.routeUrl),
                    title: this.getAttribute(constants.attributeName.routeTitle),
                    icon: this.getAttribute(constants.attributeName.routeIcon),
                    iconfont: this.getAttribute(constants.attributeName.routeIconfont),
                    userClose: !(this.getAttribute(constants.attributeName.routeDisableClose) === 'true'),
                    repeatEnable: this.getAttribute(constants.attributeName.routeRepeatEnable) === 'true',
                    syncHeight: !(this.getAttribute(constants.attributeName.syncHeight) === 'false'),
                    onLoad: this.getAttribute(constants.attributeName.routeOnLoad) || null,
                    onClose: this.getAttribute(constants.attributeName.routeOnClose) || null
                }
                if (options.title === 'false') {
                    options.title = false
                } else if (!options.title) {
                    options.title = options.url
                }
                core.router.open(options)
            }
        };

        // 初始化标题栏
        function initTitleCtn() {
            var el_title_ctn = document.querySelectorAll(constants.selector.titleContainer)[0]
            if (!el_title_ctn) {
                core.log.error('标题栏实例化失败，未找到id为' + constants.selector.titleContainer + '的元素')
            }
            el_title_ctn.className = el_title_ctn.className + ' ' + constants.className.titleContainer
            core.setTitleContainerInstance(el_title_ctn)
            var el_title_warp = document.createElement("div")
            el_title_warp.className = constants.className.titleWrapper
            el_title_ctn.appendChild(el_title_warp)
            core.setTitleWrapperInstance(el_title_warp)
            var el_title_more = document.createElement("div")
            el_title_more.className = constants.className.titleMore
            el_title_more.addEventListener('click', function() {
                core.titleMoreHandler()
                if (!core.getTitleMoreShowState()) {
                    core.getPageInstanceIdList()[0] && core.getPageInstance(core.getPageInstanceIdList()[0]).title.titleMoreCheck()
                }
            })
            el_title_warp.appendChild(el_title_more)
            core.setTitleMoreInstance(el_title_more)
        };

        // 初始化iframe容器
        function initViewCtn() {
            var el_view_ctn = document.querySelectorAll(constants.selector.viewContainer)[0]
            if (!el_view_ctn) {
                core.log.error('页面容器实例化失败，未找到id为' + constants.selector.viewContainer + '的元素')
            }
            core.setViewContainerInstance(el_view_ctn)
        };
    };

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
}

export default Router