// import { stopDefaultEvent } from '../../utils'
import constants from '../../../constants'

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
        var globalContextMenuGroups = core.config.contextMenuGroups
        var contextMenuGroups = route.contextMenuGroups

        var el_ctn = document.createElement('div')
        el_ctn.className = constants.className.contextMenu.wrapper
        el_ctn.style.top = position.top + 'px'
        el_ctn.style.left = position.left + 'px'

        for (var index = 0, length = contextMenuGroups.length; index < length; index++) {
            var group = contextMenuGroups[index];
            var el_group = createGroup(group)
            el_ctn.appendChild(el_group)
            if (index !== (length - 1)) {
                var el_cutline = createCutline()
                el_ctn.appendChild(el_cutline)
            }
        }

        if (contextMenuGroups.length && globalContextMenuGroups.length) {
            var el_cutline = createCutline()
            el_ctn.appendChild(el_cutline)
        }

        for (var index = 0, length = globalContextMenuGroups.length; index < length; index++) {
            var group = globalContextMenuGroups[index];
            var el_group = createGroup(group)
            el_ctn.appendChild(el_group)
            if (index !== (length - 1)) {
                var el_cutline = createCutline()
                el_ctn.appendChild(el_cutline)
            }
        }

        // 开发者模式devTools菜单
        if (core.config.devMode) {
            var el_group = createDevGroup()
            el_ctn.appendChild(el_group)
        }

        _this.el = el_ctn

        function createGroup(group, className) {
            var el_group = document.createElement('div')
            el_group.className = constants.className.contextMenu.group
            if (className) {
                el_group.className += ' ' + className
            }

            if (group.title) {
                var el_title = createTitle(group.title)
                el_group.appendChild(el_title)
            }

            for (var index = 0; index < group.menus.length; index++) {
                var menu = group.menus[index];
                var el_menu = createMenu(menu)
                el_group.appendChild(el_menu)
            }

            return el_group

            function createTitle(title) {
                var el_title = document.createElement('div')
                el_title.className = constants.className.contextMenu.title
                if (title instanceof HTMLElement) {
                    el_title.appendChild(title)
                } else {
                    el_title.innerHTML = title
                }
                return el_title
            }

            function createMenu(menu) {
                var el_menu = document.createElement('div')
                el_menu.className = constants.className.contextMenu.menu

                var el_menu_icon = document.createElement('div')
                el_menu_icon.className = constants.className.contextMenu.menuIcon
                if (menu.icon) {
                    if (menu.icon instanceof HTMLElement) {
                        el_menu_icon.appendChild(menu.icon)
                    } else {
                        var el_img = document.createElement('img')
                        el_img.src = menu.icon
                        el_menu_icon.appendChild(el_img)
                    }
                }
                el_menu.appendChild(el_menu_icon)

                var el_menu_name = document.createElement('div')
                el_menu_name.className = constants.className.contextMenu.menuName
                if (menu.name instanceof HTMLElement) {
                    el_menu_name.appendChild(menu.name)
                } else {
                    el_menu_name.innerHTML = menu.name
                }
                el_menu.appendChild(el_menu_name)

                el_menu.addEventListener('click', function() {
                    if (typeof menu.action === 'function') {
                        menu.action(page.id, core.router, { userClose: route.userClose })
                    }
                })

                return el_menu
            }
        }

        function createCutline() {
            var el_menu_cutline = document.createElement('div')
            el_menu_cutline.className = constants.className.contextMenu.cutline
            return el_menu_cutline
        }

        function createDevGroup() {
            var group = {
                title: 'Dev tools',
                menus: [{
                    name: (route.sandboxMode ? '关闭' : '开启') + '沙盒模式',
                    icon: '',
                    action: devTools_sandboxMode
                }]
            }

            var el_group = createGroup(group, 'dev')
            return el_group

            function devTools_sandboxMode(pageId, router) {
                route.sandboxMode = !route.sandboxMode
                route.update(route)
                page.update(true)
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
        var el_viewMarker = document.createElement('div')
        el_viewMarker.className = constants.className.contextMenu.viewMarker
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