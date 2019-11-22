import { isHTMLElement } from '../../../utils'
import CONSTANTS from '../../../CONSTANTS'

// ContextMenu类定义
const ContextMenu = function(core, route, position) {
    let _this = this,
        page = core.getPageInstance(route.pageId)

    this.el = null
    this.el_viewMarker = null
    this.el_viewMarker_ctn = null
    this.open = open
    this.close = close

    function open() {
        createDom()
        appendDom()
        bindCloseEvent()
    }

    function close() {
        removeDom()
        unBindCloseEvent()
        core.removeContextMenuInstance()
    }

    function createDom() {
        let globalContextMenuGroups = core.config.globalRoute.contextMenuGroups,
            contextMenuGroups = route.contextMenuGroups

        let el_ctn = document.createElement('div')
        el_ctn.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.WRAPPER
        el_ctn.style.top = position.top + 'px'
        el_ctn.style.left = position.left + 'px'

        for (let index = 0, length = contextMenuGroups.length; index < length; index++) {
            const group = contextMenuGroups[index];
            let el_group = createGroup(group)
            el_ctn.appendChild(el_group)
            if (index !== (length - 1)) {
                let el_cutline = createCutline()
                el_ctn.appendChild(el_cutline)
            }
        }

        if (contextMenuGroups.length && globalContextMenuGroups.length) {
            let el_cutline = createCutline()
            el_ctn.appendChild(el_cutline)
        }

        for (let index = 0, length = globalContextMenuGroups.length; index < length; index++) {
            const group = globalContextMenuGroups[index];
            let el_group = createGroup(group)
            el_ctn.appendChild(el_group)
            if (index !== (length - 1)) {
                let el_cutline = createCutline()
                el_ctn.appendChild(el_cutline)
            }
        }

        // 开发者模式devTools菜单
        if (core.config.devMode) {
            let el_group = createDevGroup()
            el_ctn.appendChild(el_group)
        }

        _this.el = el_ctn

        function createGroup(group, className) {
            let el_group = document.createElement('div')
            el_group.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.GROUP
            if (className) {
                el_group.className += ' ' + className
            }

            if (group.title) {
                let el_title = createTitle(group.title)
                el_group.appendChild(el_title)
            }

            for (let index = 0; index < group.menus.length; index++) {
                const menu = group.menus[index];
                let el_menu = createMenu(menu)
                el_group.appendChild(el_menu)
            }

            return el_group

            function createTitle(title) {
                let el_title = document.createElement('div')
                el_title.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.TITLE
                if (isHTMLElement(title)) {
                    el_title.appendChild(title.cloneNode(true))
                } else {
                    el_title.innerHTML = title
                }
                return el_title
            }

            function createMenu(menu) {
                let el_menu = document.createElement('div')
                el_menu.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU

                let el_menu_icon = document.createElement('div')
                el_menu_icon.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU_ICON
                if (menu.icon) {
                    if (isHTMLElement(menu.icon)) {
                        el_menu_icon.appendChild(menu.icon.cloneNode(true))
                    } else {
                        let el_img = document.createElement('img')
                        el_img.src = menu.icon
                        el_menu_icon.appendChild(el_img)
                    }
                }
                el_menu.appendChild(el_menu_icon)

                let el_menu_name = document.createElement('div')
                el_menu_name.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU_NAME
                if (isHTMLElement(menu.name)) {
                    el_menu_name.appendChild(menu.name.cloneNode(true))
                } else {
                    el_menu_name.innerHTML = menu.name
                }
                el_menu.appendChild(el_menu_name)

                el_menu.addEventListener('click', function() {
                    if (typeof menu.action === 'function') {
                        menu.action(page.id, core.router)
                    }
                })

                return el_menu
            }
        }

        function createCutline() {
            let el_menu_cutline = document.createElement('div')
            el_menu_cutline.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.CUTLINE
            return el_menu_cutline
        }

        function createDevGroup() {
            let group = {
                title: 'Dev tools',
                menus: [{
                    name: (route.sandboxMode ? '关闭' : '开启') + '沙盒模式',
                    icon: '',
                    action: devTools_sandboxMode
                }]
            }

            let el_group = createGroup(group, 'dev')
            return el_group

            function devTools_sandboxMode(pageId, router) {
                route.sandboxMode = !route.sandboxMode
                route.update(route)
                page.update()
            }
        }

    }

    function appendDom() {
        _this.el && document.body.appendChild(_this.el)
    }

    function removeDom() {
        _this.el && _this.el.parentNode.removeChild(_this.el)
    }

    function bindCloseEvent() {
        let el_viewMarker = document.createElement('div')
        el_viewMarker.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.VIEW_MARKER
        el_viewMarker.addEventListener('click', closeContextMenuHandler)
        _this.el_viewMarker_ctn = core.getPageInstance(core.getCurrentPageId()).view.el
        _this.el_viewMarker_ctn.appendChild(el_viewMarker)
        _this.el_viewMarker = el_viewMarker
        window.addEventListener('click', closeContextMenuHandler)
        window.addEventListener('contextmenu', closeContextMenuHandler)
    }

    function closeContextMenuHandler() {
        _this.close()
    }

    function unBindCloseEvent() {
        _this.el_viewMarker_ctn.removeChild(_this.el_viewMarker)
        _this.el_viewMarker = null
        _this.el_viewMarker_ctn = null
        window.removeEventListener('click', closeContextMenuHandler)
        window.removeEventListener('contextmenu', closeContextMenuHandler)
    }
}
export default ContextMenu