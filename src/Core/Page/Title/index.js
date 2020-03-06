import CONSTANTS from '../../../CONSTANTS'
import SuperView from '../SuperView'
import { replaceAll, stopDefaultEvent, isHTMLElement, px2number } from '../../../utils'

class Title extends SuperView {
    #textElement = null
    get textElement() {
        return this.#textElement
    }
    constructor(route) {
        super(route)
        this.element = this.#createElement()
    }
    #createElement() {
        let el = null,
            self = this

        if (this.route.titleCreator) {
            el = this.route.titleCreator(
                this.route.title,
                event => {
                    return this.trigger('closeButtonClick', event)
                },
                event => {
                    return this.trigger('click', event)
                },
                event => {
                    return this.trigger('contextmenu', event)
                }
            )
            if (!isHTMLElement(el)) {
                throw new Error(`titleCreator方法需要返回HTMLElement类型参数`)
            }
        } else {
            el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.TITLE.WRAPPER
            el.addEventListener('click', event => {
                this.trigger('click', event)
            })

            // 图标渲染
            let icon = this.route.titleIcon
            if (icon instanceof Function) {
                icon = icon(this.route)
            }
            if (icon) {
                let el_icon = createIconElement(icon)
                el.appendChild(el_icon)
            }

            // 标题内容渲染
            let title = this.route.title
            if (title === true) {
                title = this.route.url
            }
            if (title !== false) {
                if (title instanceof Function) {
                    title = title(this.route)
                }
                let el_content = createContentElement(title)
                el.appendChild(el_content)
                this.#textElement = el_content
            }

            // 标题关闭按钮渲染
            if (this.route.closeEnable) {
                let closeButton = this.route.titleCloseButton
                if (closeButton instanceof Function) {
                    closeButton = closeButton(this.route)
                }
                let el_closeButton = createCloseButtonElement(closeButton)
                el_closeButton.addEventListener('click', event => {
                    this.trigger('closeButtonClick', event)
                    return stopDefaultEvent(event)
                })
                el.appendChild(el_closeButton)
            }

            el.addEventListener('contextmenu', event => {
                this.trigger('contextmenu', event)
                return stopDefaultEvent(event)
            })
        }

        return el

        function createIconElement(icon) {
            let el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.TITLE.ICON
            icon = self.elementPureCreator(icon)
            if (isHTMLElement(icon)) {
                el.appendChild(icon)
            } else {
                el.innerHTML = icon
            }
            return el
        }

        function createContentElement(title) {
            let el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.TITLE.CONTENT
            title = self.elementPureCreator(title)
            if (isHTMLElement(title)) {
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
            closeButton = self.elementPureCreator(closeButton)
            if (isHTMLElement(closeButton)) {
                el.appendChild(closeButton)
            } else {
                el.innerHTML = closeButton
            }
            return el
        }
    }
    focus() {
        if (!this.element.className.includes(CONSTANTS.CLASS_NAME.TITLE.FOCUS)) {
            this.element.className += ` ${CONSTANTS.CLASS_NAME.TITLE.FOCUS}`
        }
    }
    blur() {
        if (this.element.className.includes(CONSTANTS.CLASS_NAME.TITLE.FOCUS)) {
            this.element.className = replaceAll(this.element.className, ` ${CONSTANTS.CLASS_NAME.TITLE.FOCUS}`)
        }
    }
    setTitle(title) {
        if (this.textElement) {
            this.textElement.innerHTML = title
        }
    }
    getComputedWidth() {
        let styles = window.getComputedStyle(this.element),
            width = px2number(styles['width']) + px2number(styles['marginLeft']) + px2number(styles['marginRight'])
        if (styles['boxSizing'] !== 'border-box') {
            width += px2number(styles['paddingLeft']) + px2number(styles['paddingRight']) + px2number(styles['borderLeftWidth']) + px2number(styles['borderRightWidth'])
        }
        return width
    }
}

export default Title
