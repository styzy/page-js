import CONSTANTS from '../../CONSTANTS'
import Sky from '../Sky'
import AddressBar from './AddressBar'
import { addMouseWheelListener, px2number } from '../../utils'

class TitleContainer extends Sky.Component {
    #core
    #scrollOffset = 80
    #wrapperElement = null
    #addressBar = null
    get core() {
        return this.#core
    }
    get scrollOffset() {
        return this.#scrollOffset
    }
    get wrapperElement() {
        return this.#wrapperElement
    }
    get addressBar() {
        return this.#addressBar
    }
    constructor(core) {
        super()
        this.#core = core
        this.element = this.#createElement()
    }
    #createElement() {
        let el = this.elementify(this.core.config.titleContainer)
        if (!el) {
            throw new Error(`titleContainer必须为有效的选择器或HTMLELement实例`)
        }
        el.className += ` ${CONSTANTS.CLASS_NAME.TITLE_CONTAINER}`

        this.#addressBar = this.#createAddressBar()
        this.#hideAddressBar(el)

        this.#wrapperElement = this.#createWrapperElement()

        el.appendChild(this.addressBar.element)
        el.appendChild(this.wrapperElement)

        return el
    }
    #createAddressBar() {
        let addressBar = new AddressBar()
        addressBar.on('close', () => {
            this.#hideAddressBar()
        })
        return addressBar
    }
    #createWrapperElement() {
        let el = document.createElement('div')
        el.className = CONSTANTS.CLASS_NAME.TITLE_WRAPPER
        this.#bindMouseWheel(el)
        this.#bindScrollFixOnResize()
        return el
    }
    #getContainerWidth() {
        return px2number(window.getComputedStyle(this.element)['width'])
    }
    #bindMouseWheel(el) {
        el.style.marginLeft = '0px'
        addMouseWheelListener(el, (event, { isUp }) => {
            this.#scroll(isUp)
            this.trigger('mouseWheel', event, isUp)
        })
    }
    #bindScrollFixOnResize() {
        window.addEventListener('resize', () => {
            this.scrollFixOnResize()
        })
    }
    #scroll(isUp, offset = this.scrollOffset) {
        let offsetLimit = Math.max(this.core.getAllTitleWidth() - this.#getContainerWidth(), 0)
        if (isUp) {
            this.wrapperElement.style.marginLeft = `${Math.min(parseFloat(this.wrapperElement.style.marginLeft) + offset, 0)}px`
        } else {
            this.wrapperElement.style.marginLeft = `${Math.max(parseFloat(this.wrapperElement.style.marginLeft) - offset, -offsetLimit)}px`
        }
    }
    #hideAddressBar(el = this.element) {
        let offsetHeight = px2number(window.getComputedStyle(el)['height'])
        this.addressBar.element.style.transition = `0.3s`
        this.addressBar.element.style.marginTop = `${-offsetHeight}px`
    }
    scrollToTop() {
        this.#scroll(true, 999999999)
    }
    scrollToBottom() {
        this.#scroll(false, 999999999)
    }
    scrollFixOnResize() {
        if (this.core.getAllTitleWidth() < this.#getContainerWidth()) {
            this.scrollToTop()
        } else {
            let offset = parseFloat(this.wrapperElement.style.marginLeft)
            if (-offset > this.core.getAllTitleWidth() - this.#getContainerWidth()) {
                this.scrollToBottom()
            }
        }
    }
    showAddressBar(jumpHandler) {
        this.addressBar.element.style.marginTop = '0px'
        this.addressBar.off('jump')
        this.addressBar.on('jump', (event, url) => {
            if (jumpHandler instanceof Function) {
                jumpHandler(url)
            }
        })
        this.addressBar.focus()
    }
}

export default TitleContainer
