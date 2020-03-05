import CONSTANTS from '../../../CONSTANTS'
import Sky from '../../Sky'

class AddressBar extends Sky.Component {
    #inputElement = null
    get value() {
        return this.element.value
    }
    set value(value) {
        this.#inputElement.value = value
    }
    constructor() {
        super()
        this.element = this.#createElement()
    }
    #createElement() {
        let el = document.createElement('div')
        el.className = CONSTANTS.CLASS_NAME.ADDRESS_BAR.WRAPPER

        let el_safetyIcon = document.createElement('div')
        el_safetyIcon.className = CONSTANTS.CLASS_NAME.ADDRESS_BAR.SAFETY_ICON

        let el_input = document.createElement('input')
        el_input.className = CONSTANTS.CLASS_NAME.ADDRESS_BAR.INPUT
        el_input.addEventListener('keydown', event => {
            // Enter
            if (event.keyCode === 13) {
                el_input.blur()
                this.trigger('jump', event, el_input.value)
            }
            this.trigger('keydown', event)
        })
        el_input.addEventListener('focus', event => {
            this.trigger('focus', event)
        })
        el_input.addEventListener('blur', event => {
            this.trigger('blur', event)
        })
        el_input.addEventListener('input', event => {
            this.trigger('input', event)
        })

        let el_closeButton = document.createElement('div'),
            el_closeIcon = document.createElement('i')
        el_closeButton.className = CONSTANTS.CLASS_NAME.ADDRESS_BAR.CLOSE_BUTTON
        el_closeButton.addEventListener('click', event => {
            this.trigger('close', event)
        })
        el_closeIcon.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_CLOSE}`
        el_closeButton.appendChild(el_closeIcon)

        el.appendChild(el_safetyIcon)
        el.appendChild(el_input)
        el.appendChild(el_closeButton)
        this.#inputElement = el_input

        return el
    }
    focus() {
        this.#inputElement.focus()
    }
    blur() {
        this.#inputElement.blur()
    }
}

export default AddressBar
