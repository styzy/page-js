import { isCrossOrigin, replaceAll } from '../../../../utils'
import CONSTANTS from '../../../../CONSTANTS'

/**
 * View类定义
 * @param {Page} page
 */
const View = function(core, page) {
    var _this = this

    this.page = page
    this.el_wrapper = getWrapper()
    this.el = null
    this.iframeOnLoad = iframeOnLoad
    this.createDom = createDom
    this.appendDom = appendDom
    this.removeDom = removeDom
    this.focus = focus
    this.blur = blur
    this.reload = reload
    this.update = update
    this.getTitle = getTitle
    this.syncHeight = syncHeight
    this.postMessage = postMessage

    function getWrapper() {
        let viewWrapper = core.getRouteInstance(_this.page.routeId).viewWrapper,
            el_wrapper = null
        if (typeof viewWrapper === 'string') {
            el_wrapper = document.querySelector(viewWrapper)
        }
        if (viewWrapper instanceof HTMLElement) {
            el_wrapper = viewWrapper
        }
        el_wrapper = el_wrapper || core.getViewWrapperInstance()
        return el_wrapper
    }

    function iframeOnLoad() {
        // 同源
        if (!isCrossOrigin(_this.el)) {

            let route = core.getRouteInstance(_this.page.routeId)

            route.autoSyncHeight && syncHeight()

            // 设置标题title
            if (route.title !== false) {
                if (route.title) {
                    _this.page.title.setTitle(route.title)
                } else {
                    _this.page.title.setTitle(_this.getTitle())
                }
            }
        }
        // load回调锚点
        typeof core.config.onLoad == 'function' && core.config.onLoad(_this.page.id)
        var pageOnload = core.getRouteInstance(_this.page.routeId).onLoad
        switch (typeof pageOnload) {
            case 'function':
                pageOnload(_this.page.id)
                break;
            case 'string':
                eval(pageOnload)
            default:
                break;
        }
    }

    function createDom() {
        var el_iframe = document.createElement('iframe')
        var route = core.getRouteInstance(_this.page.routeId)
        el_iframe.className = CONSTANTS.CLASS_NAME.VIEW.IFRAME
        el_iframe.src = route.url
        el_iframe.name = _this.page.id
        el_iframe.frameBorder = 0
        if (route.sandboxMode) {
            el_iframe.sandbox = ''
        }
        if (el_iframe.attachEvent) {
            el_iframe.attachEvent("onload", iframeOnLoad);
        } else {
            el_iframe.onload = iframeOnLoad
        }
        _this.el = el_iframe
    }

    function appendDom() {
        if (!_this.el) {
            log.error('插入View失败，请先执行createDom方法')
            return false
        }
        _this.el_wrapper.appendChild(_this.el)
    }

    function removeDom() {
        _this.el_wrapper.removeChild(_this.el)
    }

    function focus() {
        if (_this.el.className.indexOf(CONSTANTS.CLASS_NAME.VIEW.FOCUS) == -1) {
            _this.el.className = _this.el.className + ' ' + CONSTANTS.CLASS_NAME.VIEW.FOCUS
        }
    }

    function blur() {
        if (_this.el.className.indexOf(CONSTANTS.CLASS_NAME.VIEW.FOCUS) != -1) {
            _this.el.className = replaceAll(_this.el.className, ' ' + CONSTANTS.CLASS_NAME.VIEW.FOCUS)
        }
    }

    function reload() {
        _this.el.src = _this.el.src
    }

    function update(needReRender) {
        if (needReRender) {
            // 重渲染iframe
            removeDom()
            createDom()
            appendDom()
        } else {
            // 只更新链接
            var route = core.getRouteInstance(_this.page.routeId)
            _this.el.src = route.url
        }
    }

    function getTitle() {
        return _this.el.contentWindow.document.title
    }

    function syncHeight() {
        if (isCrossOrigin(_this.el)) {
            return false
        }
        let iframeWindow = _this.el.contentWindow
        // 获取高度赋值给iframe
        if (_this.el.attachEvent) {
            _this.el.height = iframeWindow.document.documentElement.scrollHeight
        } else {
            let childHeight = iframeWindow.getComputedStyle(iframeWindow.document.documentElement)['height']
            _this.el.style.height = childHeight
        }
    }

    function postMessage(message) {
        if (isCrossOrigin(_this.el)) {
            return false
        }
        var iframeWindow = _this.el.contentWindow
        iframeWindow.postMessage(message, '*')
    }
}

export default View