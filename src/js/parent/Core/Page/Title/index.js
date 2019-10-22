import CONSTANTS from '../../../../CONSTANTS'
import { replaceAll, stopDefaultEvent } from '../../../../utils'
/**
 * Title类定义
 * @param {Page} page
 */
const Title = function(core, page) {
    var _this = this

    this.page = page
    this.el_wrapper = getWrapper()
    this.el = null
    this.createDom = createDom
    this.appendDom = appendDom
    this.removeDom = removeDom
    this.focus = focus
    this.blur = blur
    this.setTitle = setTitle
    this.update = update
    this.titleMoreCheck = titleMoreCheck

    function getWrapper() {
        let titleWrapper = core.getRouteInstance(_this.page.routeId).titleWrapper,
            el_wrapper = null
        if (typeof titleWrapper === 'string') {
            el_wrapper = document.querySelector(titleWrapper)
        }
        if (titleWrapper instanceof HTMLElement) {
            el_wrapper = titleWrapper
        }
        el_wrapper = el_wrapper || core.getTitleWrapperInstance()
        return el_wrapper
    }

    function createDom() {
        let route = core.getRouteInstance(_this.page.routeId),
            el_title = null

        if (route.titleCreator) {
            el_title = route.titleCreator(route.title, closeClickHandler, titleClickHandler, contextMenuHandler)
            if (!(el_title instanceof HTMLElement)) {
                core.log.error(`titleCreator方法需要返回HTMLElement类型参数`)
                return false
            }
        } else {
            el_title = document.createElement('div')
            el_title.className = CONSTANTS.CLASS_NAME.TITLE.WRAPPER
            el_title.addEventListener('click', titleClickHandler)

            // 图标渲染
            let icon = route.titleIcon || core.config.titleIcon
            if (typeof icon === 'function') {
                icon = icon(route)
            }
            if (icon) {
                let el_icon = createIconElement(icon)
                el_title.appendChild(el_icon)
            }

            // 标题内容渲染
            if (route.title !== false) {
                let title = route.title || route.url
                if (typeof title === 'function') {
                    title = title(route)
                }
                let el_content = createContentElement(title)
                el_title.appendChild(el_content)
            }

            // 标题关闭按钮渲染
            if (route.closeEnable) {
                let closeButton = route.titleCloseButton || core.config.titleCloseButton
                if (typeof closeButton === 'function') {
                    closeButton = closeButton(route)
                }
                let el_closeButton = createCloseButtonElement(closeButton)
                el_title.appendChild(el_closeButton)
            }

            el_title.addEventListener('contextmenu', contextMenuHandler)
        }

        _this.el = el_title

        function titleClickHandler() {
            if (_this.page.id != core.getCurrentPageId()) {
                core.setCurrentPageId(_this.page.id)
            }
        }

        function createIconElement(icon) {
            let el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.TITLE.ICON
            if (icon instanceof HTMLElement) {
                el.appendChild(icon)
            } else {
                el.innerHTML = icon
            }
            return el
        }

        function createContentElement(title) {
            let el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.TITLE.CONTENT
            if (title instanceof HTMLElement) {
                el.appendChild(title)
            } else {
                el.innerHTML = title
            }
            return el
        }

        function createCloseButtonElement(closeButton) {
            let el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.TITLE.CLOSE
            if (!closeButton) {
                closeButton = 'x'
                el.className += ` ${CONSTANTS.CLASS_NAME.TITLE.CLOSE_DEFAULT}`
            }
            if (closeButton instanceof HTMLElement) {
                el.appendChild(closeButton)
            } else {
                el.innerHTML = closeButton
            }
            el.addEventListener('click', closeClickHandler)
            return el
        }

        function closeClickHandler(e) {
            core.router && core.router.close(_this.page.id)
            return stopDefaultEvent(e)
        }

        function contextMenuHandler(e) {
            if (!route.contextMenuEnable) {
                return false
            }
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
        _this.el_wrapper.appendChild(_this.el)
    }

    function removeDom() {
        _this.el_wrapper.removeChild(_this.el)
    }

    function focus() {
        if (_this.el.className.indexOf(CONSTANTS.CLASS_NAME.TITLE.FOCUS) == -1) {
            _this.el.className = _this.el.className + ' ' + CONSTANTS.CLASS_NAME.TITLE.FOCUS
        }
    }

    function blur() {
        if (_this.el.className.indexOf(CONSTANTS.CLASS_NAME.TITLE.FOCUS) != -1) {
            _this.el.className = replaceAll(_this.el.className, ' ' + CONSTANTS.CLASS_NAME.TITLE.FOCUS)
        }
    }

    function setTitle(title) {
        let el_content = _this.el.querySelector(`.${CONSTANTS.CLASS_NAME.TITLE.CONTENT}`)
        if (el_content) el_content.innerHTML = title
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
        // var titleList = core.getPageInstanceIdList()
        var titleList = core.getTitleWrapperInstance().querySelectorAll(`.${CONSTANTS.CLASS_NAME.TITLE.WRAPPER}`)
        var totalWidth = 0
        for (var i = 0; i < titleList.length; i++) {
            // var titleEl = core.getPageInstance(titleList[i]).title.el
            var titleEl = titleList[i]
            var styles = window.getComputedStyle(titleEl)
            var titleWidth = px2num(styles['width']) + px2num(styles['marginLeft']) + px2num(styles['marginRight'])
            if (styles['paddingLeft'] != 'border-box') {
                titleWidth = titleWidth + px2num(styles['paddingLeft']) + px2num(styles['paddingRight']) + px2num(styles['borderLeftWidth']) + px2num(styles['borderRightWidth'])
            }
            totalWidth = totalWidth + titleWidth
        }
        if (!core.getTitleMoreShowState()) {
            let containerWidth = px2num(window.getComputedStyle(core.getTitleWrapperInstance())['width'])
            if (totalWidth > containerWidth) {
                core.getTitleMoreInstance().style.display = 'block'
            } else {
                core.getTitleMoreInstance().style.display = 'none'
            }
        }

        function px2num(str) {
            return parseFloat(replaceAll(str, 'px'))
        }
    }
}

export default Title