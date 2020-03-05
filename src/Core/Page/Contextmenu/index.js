import CONSTANTS from '../../../CONSTANTS'
import SuperView from '../SuperView'
import { isHTMLElement, stopDefaultEvent } from '../../../utils'

class Contextmenu extends SuperView {
    #markerElement = null
    #markerParentElement = null
    get markerElement() {
        return this.#markerElement
    }
    get markerParentElement() {
        return this.#markerParentElement
    }
    set markerParentElement(element) {
        this.#markerParentElement = this.elementify(element)
    }
    constructor(route, args) {
        super(route)
        this.element = this.#createElement(args)
    }
    #createElement({ position, globalContextmenuGroups, devContextmenuGroups }) {
        let self = this,
            el = document.createElement('div')
        el.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.WRAPPER
        el.style.top = `${position.top}px`
        el.style.left = `${position.left}px`

        this.route.contextmenuGroups.forEach((group, index) => {
            el.appendChild(createGroup(group))
            if (index !== this.route.contextmenuGroups.length - 1) {
                el.appendChild(createCutline())
            }
        })

        if (this.route.contextmenuGroups.length && globalContextmenuGroups.length) {
            el.appendChild(createCutline())
        }

        globalContextmenuGroups.forEach((group, index) => {
            el.appendChild(createGroup(group))
            if (index !== globalContextmenuGroups.length - 1) {
                el.appendChild(createCutline())
            }
        })

        // 开发者模式devTools菜单
        if (devContextmenuGroups.length) {
            devContextmenuGroups.forEach(group => {
                el.appendChild(createGroup(group, 'dev'))
            })
        }

        el.addEventListener('click', event => {
            return stopDefaultEvent(event)
        })

        return el

        function createGroup(group, className) {
            let el_group = document.createElement('div')
            el_group.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.GROUP
            if (className) {
                el_group.className += ' ' + className
            }

            if (group.title) {
                let el_title = createTitle(group.title, group.titleStyleText)
                el_group.appendChild(el_title)
            }
            for (let index = 0; index < group.menus.length; index++) {
                const menu = group.menus[index]
                let el_menu = createMenu(menu)
                el_group.appendChild(el_menu)
            }

            return el_group

            function createTitle(title, titleStyleText) {
                let el_title = document.createElement('div')
                el_title.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.TITLE
                title = self.elementPureCreator(title)
                if (isHTMLElement(title)) {
                    el_title.appendChild(title)
                } else {
                    el_title.innerHTML = title
                }
                if (titleStyleText) {
                    el_title.setAttribute('style', titleStyleText)
                }
                return el_title
            }

            function createMenu(menu) {
                let el_menu = document.createElement('div')
                el_menu.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU
                if (menu.disabled) {
                    el_menu.className += ` ${CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU_DISABLED}`
                } else if (menu.dangerous) {
                    el_menu.className += ` ${CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU_DANGEROUS}`
                }
                if (menu.styleText) {
                    el_menu.setAttribute('style', menu.styleText)
                }

                let el_menu_icon = document.createElement('div')
                el_menu_icon.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU_ICON
                if (menu.icon) {
                    menu.icon = self.elementPureCreator(menu.icon)
                    if (isHTMLElement(menu.icon)) {
                        el_menu_icon.appendChild(menu.icon)
                    }
                    if (typeof menu.icon === 'string') {
                        let el_img = document.createElement('img')
                        el_img.src = menu.icon
                        el_menu_icon.appendChild(el_img)
                    }
                }
                el_menu.appendChild(el_menu_icon)

                let el_menu_name = document.createElement('div')
                el_menu_name.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.MENU_NAME
                menu.name = self.elementPureCreator(menu.name)
                if (isHTMLElement(menu.name)) {
                    el_menu_name.appendChild(menu.name)
                } else {
                    el_menu_name.innerHTML = menu.name
                }
                el_menu.appendChild(el_menu_name)

                el_menu.addEventListener('click', event => {
                    if (!menu.disabled) {
                        self.trigger('menuClick', event, menu.action)
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
    }
    #addDestroyHandler() {
        this.#markerElement = document.createElement('div')
        this.markerElement.className = CONSTANTS.CLASS_NAME.CONTEXTMENU.MARKER
        this.markerElement.addEventListener('click', this.#destroyHandler)
        this.markerParentElement.appendChild(this.markerElement)
        window.addEventListener('click', this.#destroyHandler)
        window.addEventListener('contextmenu', this.#destroyHandler)
    }
    #removeDestroyHandler() {
        if (this.markerElement && this.markerElement.parentElement === this.markerParentElement) {
            this.markerParentElement.removeChild(this.markerElement)
        }
        window.removeEventListener('click', this.#destroyHandler)
        window.removeEventListener('contextmenu', this.#destroyHandler)
    }
    #destroyHandler = () => {
        this.trigger('destroy')
    }
    render() {
        super.render()
        this.#addDestroyHandler()
    }
    destroy() {
        super.destroy()
        this.#removeDestroyHandler()
    }
}

export default Contextmenu
