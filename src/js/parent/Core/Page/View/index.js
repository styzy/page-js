import { isCrossOrigin, replaceAll } from '../../../utils'
import constants from '../../../../constants'

/**
 * View类定义
 * @param {Page} page
 */
const View = function(core, page) {
    var _this = this

    this.page = page
    this.el = null
    this.iframe = null
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

    function iframeOnLoad() {
        // 同源
        if (!isCrossOrigin(_this.iframe)) {
            syncHeight()

            // 设置标题title
            if (core.getRouteInstance(_this.page.routeId).title != false) {
                _this.page.title.setTitle(_this.getTitle())
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
        createWrapper()
        createIframe()
    }

    function appendDom() {
        if (!_this.el) {
            log.error('插入View失败，请先执行createDom方法')
            return false
        }
        core.getViewContainerInstance().appendChild(_this.el)
    }

    function removeDom() {
        core.getViewContainerInstance().removeChild(_this.el)
    }

    function focus() {
        if (_this.el.className.indexOf(constants.className.view.focus) == -1) {
            _this.el.className = _this.el.className + ' ' + constants.className.view.focus
        }
    }

    function blur() {
        if (_this.el.className.indexOf(constants.className.view.focus) != -1) {
            _this.el.className = replaceAll(_this.el.className, ' ' + constants.className.view.focus)
        }
    }

    function reload() {
        _this.iframe.src = _this.iframe.src
    }

    function update(needRenderIframe) {
        needRenderIframe = !!needRenderIframe
        if (needRenderIframe) {
            // 重渲染iframe
            destoryIframe()
            createIframe()
        } else {
            // 只更新链接
            var route = core.getRouteInstance(_this.page.routeId)
            _this.iframe.src = route.url
        }
    }

    function getTitle() {
        return _this.iframe.contentWindow.document.title
    }

    function syncHeight() {
        if (isCrossOrigin(_this.iframe)) {
            return false
        }
        var iframeWindow = _this.iframe.contentWindow
            // 获取高度赋值给iframe
        if (core.getRouteInstance(_this.page.routeId).syncHeight) {
            if (_this.iframe.attachEvent) {
                _this.iframe.height = iframeWindow.document.documentElement.scrollHeight
            } else {
                var childHeight = iframeWindow.getComputedStyle(iframeWindow.document.documentElement)['height']
                _this.iframe.height = childHeight
            }
        }
    }

    function postMessage(message) {
        if (isCrossOrigin(_this.iframe)) {
            return false
        }
        var iframeWindow = _this.iframe.contentWindow
        iframeWindow.postMessage(message, '*')
    }

    function createWrapper() {
        var el_wrapper = document.createElement("div")
        el_wrapper.className = constants.className.view.wrapper
        _this.el = el_wrapper

    }

    function createIframe() {
        var el_iframe = document.createElement("iframe")
        var route = core.getRouteInstance(_this.page.routeId)
        el_iframe.className = constants.className.view.iframe
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
        _this.iframe = el_iframe
        _this.el.appendChild(_this.iframe)
    }

    function destoryIframe() {
        if (_this.iframe) {
            _this.el.removeChild(_this.iframe)
            _this.iframe = null
        }
    }
}

export default View