import Title from './Title'
import View from './View'

// Page类定义
const Page = function(core, routeId) {
    var _this = this,
        id = core.createPageInstanceId(),
        title = titleCreator(),
        view = viewCreator(),
        isRendered = false

    this.id = id
    this.title = title
    this.view = view
    this.routeId = routeId
    this.open = open
    this.close = close
    this.focus = focus
    this.blur = blur
    this.reload = reload
    this.update = update
    this.destory = destory
    this.syncHeight = syncHeight
    this.postMessage = postMessage

    // title创建方法
    function titleCreator() {
        return new Title(core, _this)
    }

    // view创建方法
    function viewCreator() {
        return new View(core, _this)
    }

    // 打开页面
    function open() {
        if (!isRendered) {
            createDom()
            appendDom()
            isRendered = true
            _this.title.titleMoreCheck()
        }
        core.setCurrentPageId(_this.id)
    }

    // 关闭页面
    function close() {
        var nextId = getNextPageId()
        typeof core.config.onClose == 'function' && core.config.onClose(_this.id, nextId)
        typeof core.getRouteInstance(_this.routeId).onClose == 'function' && core.getRouteInstance(_this.routeId).onClose(_this.id, nextId)
        if (nextId) {
            core.setCurrentPageId(nextId)
        }
        removeDom()
        isRendered = false
        _this.destory()
        _this.title.titleMoreCheck()
    }

    // 聚焦
    function focus() {
        _this.title.focus()
        _this.view.focus()
    }

    // 失焦
    function blur() {
        _this.title.blur()
        _this.view.blur()
    }

    function reload() {
        _this.view.reload()
    }

    // 更新
    function update(needRenderIframe) {
        _this.view.update(needRenderIframe)
    }

    // 销毁实例
    function destory() {
        core.removePageInstanceByPageId(_this.id)
    }

    function syncHeight() {
        _this.view.syncHeight()
    }

    function postMessage(message) {
        _this.view.postMessage(message)
    }

    // 创建dom
    function createDom() {
        _this.title.createDom()
        _this.view.createDom()
    }

    // 插入dom
    function appendDom() {
        _this.title.appendDom()
        _this.view.appendDom()
    }

    // 删除dom
    function removeDom() {
        _this.title.removeDom()
        _this.view.removeDom()
    }

    // 获取当前页面的后一个页面id，最后一个时返回前一个页面id
    function getNextPageId() {
        var pageIdList = core.getPageInstanceIdList()
        for (var i = 0; i < pageIdList.length; i++) {
            if (pageIdList[i] == _this.id) {
                if (i + 1 == pageIdList.length) {
                    return pageIdList[i - 1]
                } else {
                    return pageIdList[i + 1]
                }
            }
        }
    };
}

export default Page