import Log from '../Log'
import CONSTANTS from '../../CONSTANTS'
import Config from './Config'
import Router from './Router'
import Route from './Route'
import Page from './Page'
import ContextMenu from './ContextMenu'
import { replaceAll } from '../../utils'
import { configRules } from './rules'

// 核心类定义
const Core = function(userConfig) {
    let _this = this
    let _private = {}

    // 存储声明
    let instances = {
        route: {},
        page: {},
        titleContainer: null,
        titleWrapper: null,
        titleMore: null,
        viewContainer: null,
        viewWrapper: null,
        contextMenu: null
    }

    // 实例id存储,不暴露
    let instanceCount = {
        route: 0,
        page: 0
    }

    // 当前显示的页面和标题id
    let currentId = {
        page: null
    }

    // 状态存储
    let state = {
        isShowAllTitle: false
    }

    // version
    this.version = CONSTANTS.VERSION

    // container
    _private.init = init
    _private.setTitleContainerInstance = setTitleContainer
    this.getTitleContainerInstance = getTitleContainer
    _private.setTitleWrapperInstance = setTitleWrapper
    this.getTitleWrapperInstance = getTitleWrapper
    _private.setViewContainerInstance = setViewContainer
    this.getViewContainerInstance = getViewContainer
    _private.setViewWrapperInstance = setViewWrapper
    this.getViewWrapperInstance = getViewWrapper
    _private.setTitleMoreInstance = setTitleMore
    this.getTitleMoreInstance = getTitleMore

    // 数据方法
    this.currentId = currentId
    _private.currentPageIdWatcher = currentPageIdWatcher

    // route
    this.createRouteInstanceId = routeInstanceIdCreator
    this.createRouteInstance = createRouteInstance
    _private.addRouteInstance = addRouteInstance
    this.getRouteInstance = getRouteInstance
    this.getRouteInstanceByUrl = getRouteInstanceByUrl
    this.getRouteInstances = getRouteInstances
    this.getRouteInstanceIdList = getRouteInstanceIdList
    this.removeRouteInstance = removeRouteInstance

    // page
    this.createPageInstanceId = pageInstanceIdCreator
    this.createPageInstanceByRouteId = createPageInstanceByRouteId
    _private.addPageInstance = addPageInstance
    this.getPageInstance = getPageInstance
    this.getPageInstanceIdList = getPageInstanceIdList
    this.getPageInstances = getPageInstances
    this.removePageInstance = removePageInstance
    this.setCurrentPageId = setCurrentPageId
    this.getCurrentPageId = getCurrentPageId

    // contextMenu
    this.createContextMenuInstanceByPositionAndPageId = createContextMenuInstance
    _private.setContextMenuInstance = setContextMenuInstance
    this.getContextMenuInstance = getContextMenuInstance
    this.removeContextMenuInstance = removeContextMenuInstance

    // 存储
    this.saveLocalCache = saveLocalCache
    this.loadLocalCache = loadLocalCache
    this.clearLocalCache = clearLocalCache

    // 工具
    this.setPagePayloadByRouteId = setPagePayloadByRouteId
    this.pageLimitCheck = pageLimitValidator
    _private.titleMoreHandler = titleMoreHandler
    this.getTitleMoreShowState = getTitleMoreShowState
    _private.messageReceiver = messageReceiver

    // 开启对currentPageId的监听
    _private.currentPageIdWatcher();

    // 实例化config
    this.config = new Config(userConfig)
    if (!this.config) {
        return false
    }

    // 实例化log
    this.log = new Log(this.config.devMode)

    // 初始化
    if (!init()) {
        return false
    }

    // 实例化Router
    this.router = new Router(this)

    // 挂载信息
    window[CONSTANTS.PARENT_PAYLOAD_NAME] = {
        core: this,
        global: this.config.globalData
    }

    // devMode开启时window挂载开发数据
    if (this.config.devMode) {
        // 显示帮助信息
        showHelpInfo()
        window[CONSTANTS.DEV_MODE_WINDOW_DATA_NAME] = {
            instances: instances,
            instanceCount: instanceCount,
            currentId: currentId,
            config: this.config
        }
    }

    window.addEventListener('message', _private.messageReceiver)

    return this.router

    // ************方法声明************

    /**
     * 初始化方法
     */
    function init() {
        let initResult = initTitleCtn() && initViewCtn() && initRoute()
        return initResult

        // 初始化跳转路由
        function initRoute() {
            var el_routes = document.querySelectorAll(CONSTANTS.SELECTOR.ROUTE_ELEMENT)
            for (var i = 0; i < el_routes.length; i++) {
                var el = el_routes[i]
                el.addEventListener('click', function() {
                    bindElClick.call(this)
                })
            }
            return true

            function bindElClick() {
                if (!_this.router) {
                    return false
                }
                let options = {
                    url: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_URL)),
                    title: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_TITLE)),
                    titleIcon: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_TITLE_ICON)),
                    closeEnable: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_CLOSE_ENABLE)),
                    repeatEnable: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_REPEAT_ENABLE)),
                    autoSyncHeight: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_AUTO_SYNC_HEIGHT) === 'false'),
                    onLoad: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_ON_LOAD)),
                    onClose: getEvalValue(this.getAttribute(CONSTANTS.ATTRIBUTE_NAME.ROUTE_ON_CLOSE))
                }

                for (const key in options) {
                    if (options.hasOwnProperty(key)) {
                        const value = options[key]
                        if (value === null) {
                            delete options[key]
                        }
                    }
                }

                _this.router.open(options)

                function getEvalValue(str) {
                    if (str) {
                        try {
                            str = eval(str)
                        } catch (error) {} finally {
                            return str
                        }
                    } else {
                        return null
                    }
                }
            }
        }

        // 初始化标题栏
        function initTitleCtn() {
            let titleParam = _this.config.titleContainer,
                el_title_ctn = null
            if (typeof titleParam === 'string') {
                el_title_ctn = document.querySelector(titleParam)
            }
            if (titleParam instanceof HTMLElement) {
                el_title_ctn = titleParam
            }
            if (!titleParam) {
                _this.log.error('标题栏实例化失败，错误的titleContainer参数:\n', titleParam)
                return false
            }
            el_title_ctn.className = el_title_ctn.className + ' ' + CONSTANTS.CLASS_NAME.TITLE_CONTAINER
            _private.setTitleContainerInstance(el_title_ctn)
            var el_title_warp = document.createElement("div")
            el_title_warp.className = CONSTANTS.CLASS_NAME.TITLE_WRAPPER
            el_title_ctn.appendChild(el_title_warp)
            _private.setTitleWrapperInstance(el_title_warp)
            var el_title_more = document.createElement("div")
            el_title_more.className = CONSTANTS.CLASS_NAME.TITLE_MORE
            el_title_more.addEventListener('click', function() {
                _private.titleMoreHandler()
                if (!_this.getTitleMoreShowState()) {
                    _this.getPageInstanceIdList()[0] && _this.getPageInstance(_this.getPageInstanceIdList()[0]).title.titleMoreCheck()
                }
            })
            el_title_warp.appendChild(el_title_more)
            _private.setTitleMoreInstance(el_title_more)
            return true
        };

        // 初始化iframe容器
        function initViewCtn() {
            let viewParam = _this.config.viewContainer,
                el_view_ctn = null
            if (typeof viewParam === 'string') {
                el_view_ctn = document.querySelector(viewParam)
            }
            if (viewParam instanceof HTMLElement) {
                el_view_ctn = viewParam
            }
            if (!el_view_ctn) {
                _this.log.error('视图实例化失败，错误的viewContainer参数:\n', viewParam)
                return false
            }
            el_view_ctn.className = el_view_ctn.className + ' ' + CONSTANTS.CLASS_NAME.VIEW_CONTAINER
            _private.setViewContainerInstance(el_view_ctn)
            var el_view_wrapper = document.createElement("div")
            el_view_wrapper.className = CONSTANTS.CLASS_NAME.VIEW_WRAPPER
            el_view_ctn.appendChild(el_view_wrapper)
            _private.setViewWrapperInstance(el_view_wrapper)
            return true
        }
    }

    /**
     * 设置titleContainer
     * @param {Element} el
     */
    function setTitleContainer(el) {
        instances.titleContainer = el
    }

    /**
     * 获取titleContainer
     */
    function getTitleContainer() {
        return instances.titleContainer
    }

    /**
     * 设置titleWrapper
     * @param {Element} el
     */
    function setTitleWrapper(el) {
        instances.titleWrapper = el
    }

    /**
     * 获取titleWrapper
     */
    function getTitleWrapper() {
        return instances.titleWrapper
    }

    /**
     * 设置titleMore
     * @param {Element} el
     */
    function setTitleMore(el) {
        instances.titleMore = el
    }

    /**
     * 获取titlemore
     */
    function getTitleMore() {
        return instances.titleMore
    }

    /**
     * 设置viewContainer
     * @param {Element} el
     */
    function setViewContainer(el) {
        instances.viewContainer = el
    }

    /**
     * 获取viewContainer
     */
    function getViewContainer() {
        return instances.viewContainer
    }

    /**
     * 设置viewWrapper
     * @param {Element} el
     */
    function setViewWrapper(el) {
        instances.viewWrapper = el
    }

    /**
     * 获取viewWrapper
     */
    function getViewWrapper() {
        return instances.viewWrapper
    }

    /**
     * 监听currentId
     */
    function currentPageIdWatcher() {
        var id = null
        Object.defineProperty(currentId, 'page', {
            enumerable: true,
            configurable: false,
            set: changePageById,
            get: function() {
                return id
            }
        })

        /**
         * 根据当前pageId改变页面展示状态
         * @param {String} pageId
         */
        function changePageById(pageId) {
            try {
                var oldPage = _this.getPageInstance(id)
                var newPage = _this.getPageInstance(pageId)
                oldPage && oldPage.blur()
                newPage && newPage.focus()
                id = pageId
            } catch (e) {
                log.error('页面切换失败\n' + e)
            }
        }
    };

    /**
     * 生成route实例唯一id
     */
    function routeInstanceIdCreator() {
        return 'route-' + ++instanceCount.route
    };

    /**
     * 生成route实例
     * @param {Object} options
     */
    function createRouteInstance(options, sourcePageId) {
        let route = null
        if (options.hasOwnProperty('id')) {
            route = _this.getRouteInstance(options.id)
        }
        if (!route) {
            route = new Route(_this, options, sourcePageId)
            _private.addRouteInstance(route)
        }
        return route
    };

    /**
     * 添加route实例
     * @param {Route} route
     */
    function addRouteInstance(route) {
        if (instances.route[route.id]) {
            log.error('增加route实例失败，已存在相同id的route实例')
            return false
        }
        instances.route[route.id] = route
    };

    /**
     * 获取route实例
     * @param {String} routeId
     */
    function getRouteInstance(routeId) {
        return instances.route[routeId]
    };

    /**
     * 根据url获取pageId
     * @param {String} url
     */
    function getRouteInstanceByUrl(url) {
        var routeInstances = _this.getRouteInstances()
        for (const routeId in routeInstances) {
            const route = routeInstances[routeId];
            if (route.url.indexOf(url) !== -1) {
                return route
            }
        }
        return false
    };

    /**
     * 获取route实例集合
     */
    function getRouteInstances() {
        return instances.route
    };

    /**
     * 获取routeId列表
     */
    function getRouteInstanceIdList() {
        return Object.keys(instances.route)
    };

    /**
     * 移除route实例
     * @param {String} routeId
     */
    function removeRouteInstance(routeId) {
        delete instances.route[routeId]
        _this.saveLocalCache()
    };

    /**
     * 生成page实例唯一id
     */
    function pageInstanceIdCreator() {
        return 'page-' + ++instanceCount.page
    };

    /**
     * 通过routeId生成page实例
     * @param {String} routeId
     */
    function createPageInstanceByRouteId(routeId) {
        var page = new Page(_this, routeId)
        _private.addPageInstance(page)
        _this.getRouteInstance(routeId).pageId = page.id
        return page
    }

    /**
     * 添加page实例
     * @param {Page} page
     */
    function addPageInstance(page) {
        if (instances.page[page.id]) {
            log.error('增加page实例失败，已存在相同id的page实例')
            return false
        }
        instances.page[page.id] = page
        _this.saveLocalCache()
    };

    /**
     * 获取route实例
     * @param {String} pageId
     */
    function getPageInstance(pageId) {
        return instances.page[pageId]
    };

    /**
     * 获取pageId列表
     */
    function getPageInstanceIdList() {
        return Object.keys(instances.page)
    };

    /**
     * 获取page实例集合
     */
    function getPageInstances() {
        return instances.page
    };

    /**
     * 移除page实例
     * @param {String} pageId
     */
    function removePageInstance(pageId) {
        delete instances.page[pageId]
    };

    /**
     * 设置当前打开的页面id
     * @param {String} pageId
     */
    function setCurrentPageId(pageId) {
        currentId.page = pageId
    };

    /**
     * 获取当前打开的页面id
     */
    function getCurrentPageId() {
        return currentId.page
    };

    /**
     * 通过position和pageId创建contextMenu实例
     * @param {Object} position 
     * @param {String} pageId 
     */
    function createContextMenuInstance(position, pageId) {
        var page = _this.getPageInstance(pageId)
        var route = _this.getRouteInstance(page.routeId)
        var contextMenu = new ContextMenu(_this, route, position)
        _private.setContextMenuInstance(contextMenu)
        return contextMenu
    }

    /**
     * 设置contextMenu实例
     * @param {ContextMenu} contextMenu 
     */
    function setContextMenuInstance(contextMenu) {
        instances.contextMenu = contextMenu
    }

    /**
     * 获取contextMenu实例
     */
    function getContextMenuInstance() {
        return instances.contextMenu
    }

    /**
     * 删除contextMenu实例
     */
    function removeContextMenuInstance() {
        instances.contextMenu = null
    }

    /**
     * 保存已打开页面本地缓存
     */
    function saveLocalCache() {
        if (!_this.config.cacheEnable) {
            return false
        }
        var routeHistory = []
        var pageInstances = _this.getPageInstances()
        for (var pageId in pageInstances) {

            var route = _this.getRouteInstance(pageInstances[pageId].routeId)
            routeHistory.push(route)
        }
        window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE.ROUTE_HISTORY, JSON.stringify(routeHistory))
    }

    /**
     * 加载本地缓存页面
     */
    function loadLocalCache() {
        var temp = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE.ROUTE_HISTORY)
        if (temp) {
            return JSON.parse(temp)
        } else {
            return false
        }
    }

    /**
     * 清除本地缓存页面
     */
    function clearLocalCache() {
        window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE.ROUTE_HISTORY, '')
    }

    /**
     * 设置子页面的传递数据
     * @param {Object} payload 
     */
    function setPagePayloadByRouteId(routeId, payload) {
        window[CONSTANTS.PARENT_PAYLOAD_NAME][routeId] = payload
    }

    /**
     * 页面数量上限验证
     */
    function pageLimitValidator() {
        if (_this.config.limit) {
            return _this.getPageInstanceIdList().length < _this.config.limit
        } else {
            return true
        }
    };

    /**
     * 全部标题展示控制
     * @param {Boolean} boolean
     */
    function titleMoreHandler(boolean) {
        state.isShowAllTitle = !state.isShowAllTitle
        if (typeof boolean == 'boolean') {
            state.isShowAllTitle = boolean
        }
        if (state.isShowAllTitle) {
            _this.getTitleContainerInstance().className = _this.getTitleContainerInstance().className + ' ' + CONSTANTS.CLASS_NAME.TITLE_CONTAINER_SHOW_MORE
        } else {
            _this.getTitleContainerInstance().className = replaceAll(_this.getTitleContainerInstance().className, ' ' + CONSTANTS.CLASS_NAME.TITLE_CONTAINER_SHOW_MORE)
        }
    }

    /**
     * 获取页面title全部展示状态
     */
    function getTitleMoreShowState() {
        return state.isShowAllTitle
    }

    /**
     * 消息接收器
     */
    function messageReceiver(message) {
        if (message.data && message.data.type === CONSTANTS.POST_MESSAGE_TYPE) {
            let data = message.data
            if (data.to) {
                let pageId = data.to
                let page = _this.getPageInstance(pageId)
                page.postMessage(data)
            } else {
                if (typeof _this.config.onMessage === 'function') {
                    _this.config.onMessage(data)
                }
            }
        }
    }
}

// version
Core.version = CONSTANTS.VERSION

function showHelpInfo() {
    let helpInfo = '%c********Page标签页框架帮助********\n' +
        '\n输入对应的命令查看帮助(本帮助功能仅在devMode下有效):\n' +
        '\n1.查看实例化配置\n' +
        'Page.api.showConfig()\n' +
        '\n2.查看父页面路由方法\n' +
        'Page.api.showParentRouter()\n' +
        '\n3.查看子页面路由方法\n' +
        'Page.api.showParentRouter()\n' +
        '\n********************************'
    let helpStyle = 'color:#00a1d6;'
    console.log(helpInfo, helpStyle)

    // 挂载API文档
    Core.api = {
        showConfig: showConfig
    }
}

function showConfig() {
    let api = {}
    for (const key in configRules) {
        if (configRules.hasOwnProperty(key)) {
            let ValidType = configRules[key].type
            if (ValidType) {
                ValidType = typeof ValidType === 'object' ? ValidType.map(type => type.name).join(',') : ValidType.name
            } else {
                ValidType = '无限制'
            }
            api[key] = Object.assign({}, configRules[key], { type: ValidType })
        }
    }
    console.table(api, ['type', 'default', 'desc'])
}
export default Core