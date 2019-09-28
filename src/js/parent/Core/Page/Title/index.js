import constants from '../../../../constants'
import { replaceAll, stopDefaultEvent } from '../../../utils'
/**
 * Title类定义
 * @param {Page} page
 */
const Title = function(core, page) {
    var _this = this

    this.page = page
    this.el = null
    this.createDom = createDom
    this.appendDom = appendDom
    this.removeDom = removeDom
    this.focus = focus
    this.blur = blur
    this.setTitle = setTitle
    this.update = update
    this.titleMoreCheck = titleMoreCheck

    function createDom() {
        var route = core.getRouteInstance(_this.page.routeId)
        var el_wrapper = document.createElement('div')
        el_wrapper.className = constants.className.title.wrapper
        el_wrapper.addEventListener('click', titleClickHandler)

        if (route.iconfont) {
            var el_iconfont = document.createElement('i')
            el_iconfont.className = constants.className.title.icon + ' ' + route.iconfont
            el_wrapper.appendChild(el_iconfont)
        }
        if (route.icon) {
            var el_icon = document.createElement('img')
            el_icon.className = constants.className.title.icon
            el_icon.src = route.icon
            el_wrapper.appendChild(el_icon)
        }
        if (route.title !== false) {
            var el_content = document.createElement('span')
            el_content.className = constants.className.title.content
            el_content.innerHTML = route.title || route.url
            el_wrapper.appendChild(el_content)
        }

        var el_close;

        // 使用iconfont作为close图标
        if (core.config.closeIconfontClass) {
            el_close = document.createElement('i')
            el_close.className = constants.className.title.close + ' ' + core.config.closeIconfontClass
        } else {
            el_close = document.createElement("span")
            el_close.className = constants.className.title.close + ' ' + core.config.closeClass
        }

        if (route.userClose) {
            el_close.addEventListener('click', closeClickHandler)
        } else {
            el_close.className = el_close.className + ' ' + constants.className.title.disableClose
        }

        el_wrapper.appendChild(el_close)

        _this.el = el_wrapper

        if (route.contextMenuEnable) {
            el_wrapper.addEventListener('contextmenu', contextMenuHandler)
        }

        function closeClickHandler(e) {
            core.router && core.router.close(_this.page.id)
            return stopDefaultEvent(e)
        }

        function titleClickHandler() {
            if (_this.page.id != core.getCurrentPageId()) {
                core.setCurrentPageId(_this.page.id)
            }
        }

        function contextMenuHandler(e) {
            var existContextMenu = core.getContextMenuInstance()
            if (existContextMenu) {
                existContextMenu.close()
            }
            var position = {
                top: e.clientY,
                left: e.clientX
            }

            var contextMenu = core.createContextMenuInstanceByPositionAndPageId(position, _this.page.id)

            contextMenu.open()
            return stopDefaultEvent(e)
        }

    }

    function appendDom() {
        if (!_this.el) {
            core.log.error('插title失败，请先执行createDom方法')
            return false
        }
        core.getTitleWrapperInstance().appendChild(_this.el)
    }

    function removeDom() {
        core.getTitleWrapperInstance().removeChild(_this.el)
    }

    function focus() {
        if (_this.el.className.indexOf(constants.className.title.focus) == -1) {
            _this.el.className = _this.el.className + ' ' + constants.className.title.focus
        }
    }

    function blur() {
        if (_this.el.className.indexOf(constants.className.title.focus) != -1) {
            _this.el.className = replaceAll(_this.el.className, ' ' + constants.className.title.focus)
        }
    }

    function setTitle(title) {
        _this.el.querySelector('.' + constants.className.title.content).innerHTML = title
    }

    function update(needReRender) {
        if (needReRender) {
            let el_old = _this.el
            createDom()
            el_old.replaceWith(_this.el)
        } else {
            var route = core.getRouteInstance(_this.page.routeId)
            setTitle(route.title || route.url)
        }
    }

    function titleMoreCheck() {
        var titleList = core.getPageInstanceIdList()
        var totalWidth = 0
        for (var i = 0; i < titleList.length; i++) {
            var titleEl = core.getPageInstance(titleList[i]).title.el
            var styles = window.getComputedStyle(titleEl)
            var titleWidth = px2num(styles['width']) + px2num(styles['marginLeft']) + px2num(styles['marginRight'])
            if (styles['paddingLeft'] != 'border-box') {
                titleWidth = titleWidth + px2num(styles['paddingLeft']) + px2num(styles['paddingRight']) + px2num(styles['borderLeftWidth']) + px2num(styles['borderRightWidth'])
            }
            totalWidth = totalWidth + titleWidth
        }
        if (!core.getTitleMoreShowState()) {
            if (totalWidth > px2num(window.getComputedStyle(core.getTitleWrapperInstance())['width'])) {
                core.getTitleMoreInstance().style.display = 'block'
            } else {
                core.getTitleMoreInstance().style.display = 'none'
            }
        }
        //			if(window.getComputedStyle(core.getTitleWrapperInstance())['height'] > window.getComputedStyle(core.getTitleContainerInstance())['height']) {
        //			} else{
        //			}
        function px2num(str) {
            return parseFloat(replaceAll(str, 'px'))
        }
    }
}

export default Title