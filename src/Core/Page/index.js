import CONSTANTS from '../../CONSTANTS'
import Sky from '../Sky'
import Title from './Title'
import View from './View'
import ContextMenu from './Contextmenu'

class Page extends Sky.Root {
    #id
    #core
    #route
    #title
    #view
    #contextmenu
    #rendered
    #sourcePageId
    get id() {
        return this.#id
    }
    get core() {
        return this.#core
    }
    get route() {
        return this.#route
    }
    get title() {
        return this.#title
    }
    get view() {
        return this.#view
    }
    get contextmenu() {
        return this.#contextmenu
    }
    get rendered() {
        return this.#rendered
    }
    get sourcePageId() {
        return this.#sourcePageId
    }
    constructor({ id, core, route, sourcePageId = null }) {
        super()
        this.#id = id
        this.#core = core
        this.#route = route
        this.#sourcePageId = sourcePageId
        this.#title = this.#createTitle()
        this.#view = this.#createView()
    }
    #createTitle() {
        let title = new Title(this.route)
        title.parentElement = this.route.titleWrapper || this.core.titleContainer.wrapperElement
        title.on('click', () => {
            this.core.controller.focus(this.id)
        })
        title.on('contextmenu', event => {
            // TODO 右键菜单逻辑
            this.core.pageList.forEach(page => {
                page.destroyContextmenu()
            })
            if (!this.route.contextmenuEnable) {
                return
            }
            let position = {
                top: event.clientY,
                left: event.clientX
            }
            this.#contextmenu = this.#createContextmenu(position)
            this.contextmenu.render()
        })
        title.on('closeButtonClick', () => {
            this.core.controller.close(this.id)
        })
        return title
    }
    #createView() {
        let view = new View(this.route, this.id)
        view.parentElement = this.route.viewWrapper || this.core.el_viewWrapper
        view.on('load', (event, title) => {
            if (typeof this.route.title !== 'string' && this.route.autoFetchTitle && title) {
                this.title.setTitle(title)
            }
            if (this.route.onLoad instanceof Function) {
                this.route.onLoad(this.id)
            }
            if (this.core.config.onLoad instanceof Function) {
                this.core.config.onLoad(this.id)
            }
        })
        return view
    }
    #createContextmenu(position) {
        let devContextmenuGroups = [
            {
                title() {
                    let el = document.createElement('div'),
                        el_icon = document.createElement('i'),
                        el_text = document.createElement('span')
                    el_icon.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_LAB}`
                    el_icon.style.verticalAlign = 'middle'
                    el_icon.style.fontSize = '20px'
                    el_icon.style.margin = '0 8px'
                    el_text.innerText = `开发者工具`

                    el.appendChild(el_icon)
                    el.appendChild(el_text)
                    return el
                },
                titleStyleText: `padding-left:0;font-size:14px;font-weight:400;`,
                menus: [
                    {
                        name: '查看/修改地址',
                        icon() {
                            let el = document.createElement('i')
                            el.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_URL}`
                            return el
                        },
                        action: () => {
                            this.core.titleContainer.addressBar.value = this.route.url
                            this.core.titleContainer.showAddressBar(url => {
                                this.route.url = url
                                this.core.titleContainer.addressBar.value = this.route.url
                                this.reload()
                            })
                        }
                    },
                    {
                        name: `${this.view.sandboxMode ? '关闭' : '开启'}沙盒模式`,
                        icon() {
                            let el = document.createElement('i')
                            el.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_SANDBOX}`
                            return el
                        },
                        action: () => {
                            this.#sandboxModeHandler()
                        }
                    },
                    {
                        name: `${this.view.viewSourceMode ? '关闭' : '开启'}查看源码模式${this.view.crossOrigin ? '（跨域禁用）' : ''}`,
                        icon() {
                            let el = document.createElement('i')
                            el.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_VIEW}`
                            return el
                        },
                        styleText: `${this.view.editSourceMode ? 'display:none' : ''}`,
                        disabled: this.view.crossOrigin,
                        action: () => {
                            this.#viewSourceModeHandler()
                        }
                    },
                    {
                        name: `${this.view.editSourceMode ? '关闭' : '开启'}编辑源码模式${this.view.crossOrigin ? '（跨域禁用）' : ''}`,
                        icon() {
                            let el = document.createElement('i')
                            el.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_CODE}`
                            return el
                        },
                        disabled: this.view.crossOrigin,
                        action: () => {
                            this.#editSourceModeHandler()
                        }
                    },
                    {
                        name: `运行源码（危险操作）`,
                        icon() {
                            let el = document.createElement('i')
                            el.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_DANGER}`
                            return el
                        },
                        styleText: `${this.view.editSourceMode ? '' : 'display:none'}`,
                        dangerous: true,
                        action: () => {
                            this.view.submitSource()
                            this.route.editSourceMode = false
                        }
                    },
                    {
                        name: '强制关闭',
                        icon() {
                            let el = document.createElement('i')
                            el.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_LOGOUT}`
                            return el
                        },
                        action: () => {
                            this.core.controller.close(this.id, true)
                        }
                    }
                ]
            }
        ]
        let contextmenu = new ContextMenu(this.route, {
            position,
            globalContextmenuGroups: this.core.config.globalRoute.contextmenuGroups,
            devContextmenuGroups: this.core.config.devMode ? devContextmenuGroups : []
        })
        contextmenu.parentElement = document.body
        contextmenu.markerParentElement = this.core.el_viewWrapper
        contextmenu.on('menuClick', (event, action) => {
            if (action instanceof Function) {
                action(this.id, this.core.controller, this.route)
            }
            this.destroyContextmenu()
        })
        contextmenu.on('destroy', () => {
            this.destroyContextmenu()
        })
        return contextmenu
    }
    #reloadTitle() {
        let title = this.#createTitle()
        title.parentElement.replaceChild(title.element, this.title.element)
        title.updateRenderState()
        this.#title = title
    }
    #reloadView() {
        let view = this.#createView()
        view.parentElement.replaceChild(view.element, this.view.element)
        view.updateRenderState()
        this.#view = view
    }
    #sandboxModeHandler() {
        this.route.sandboxMode = !this.view.sandboxMode
        this.reload()
    }
    #viewSourceModeHandler() {
        if (this.view.crossOrigin) {
            return
        }
        this.route.viewSourceMode = !this.view.viewSourceMode
        this.reload()
    }
    #editSourceModeHandler() {
        if (this.view.crossOrigin) {
            return
        }
        this.route.editSourceMode = !this.view.editSourceMode
        this.reload()
    }
    destroyContextmenu() {
        if (this.contextmenu) {
            this.contextmenu.destroy()
            this.#contextmenu = null
        }
    }
    open() {
        this.title.render()
        this.view.render()
        this.#rendered = true
        this.core.titleContainer.scrollToBottom()
    }
    refresh() {
        this.view.element.src = this.route.url
    }
    reload() {
        if (this.rendered) {
            this.#reloadTitle()
            this.#reloadView()
            if (this.core.state.currentPageId === this.id) {
                this.focus()
            }
        }
    }
    redirect(url) {
        this.route.url = url
        this.reload()
    }
    close(isForce) {
        if (!this.route.closeEnable && !isForce) {
            throw `标签页配置不允许关闭`
        }
        this.title.destroy()
        this.view.destroy()
        this.#rendered = false
        this.core.titleContainer.scrollFixOnResize()
        return true
    }
    focus() {
        this.title.focus()
        this.view.focus()
    }
    blur() {
        this.title.blur()
        this.view.blur()
    }
    syncHeight() {
        this.view.syncHeight()
    }
    setTitle(title) {
        this.title.setTitle(title)
    }
    postMessage(...args) {
        this.view.postMessage(...args)
    }
}

export default Page
