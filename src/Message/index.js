import CONSTANTS from '../CONSTANTS'
import typeOf from '../utils/typeOf'

class Message {
    #type = CONSTANTS.POST_MESSAGE_TYPE
    #from = ''
    #to = ''
    #payload = ''
    #frozen = false
    get type() {
        return this.#type
    }
    get from() {
        return this.#from
    }
    set from(value) {
        if (this.#frozen) throw new Error('无法修改消息，当前消息已冻结')
        this.#from = value
    }
    get to() {
        return this.#to
    }
    set to(value) {
        if (this.#frozen) throw new Error('无法修改消息，当前消息已冻结')
        this.#to = value
    }
    get payload() {
        return this.#payload
    }
    set payload(value) {
        if (this.#frozen) throw new Error('无法修改消息，当前消息已冻结')
        this.#payload = value
    }
    get frozen() {
        return this.#frozen
    }
    constructor(string) {
        try {
            if (string) {
                this.#toMessage(string)
                this.freeze()
            }
        } catch (error) {
            throw new Error(`实例化Message消息失败:${error}`)
        }
    }
    #toMessage(string) {
        if (typeOf(string) !== 'String') throw `实例化参数必须为String类型`

        let message
        try {
            message = JSON.parse(string)
        } catch (error) {
            throw `实例化参数字符串无法识别`
        }

        if (typeOf(message) !== 'Object') throw `实例化参数字符串无法识别`
        if (message.type !== CONSTANTS.POST_MESSAGE_TYPE) throw `无法识别的消息类型`

        this.#from = message.from
        this.#to = message.to
        this.#payload = message.payload
    }
    toString() {
        return JSON.stringify({
            type: this.#type,
            from: this.#from,
            to: this.#to,
            payload: this.#payload
        })
    }
    freeze() {
        this.#frozen = true
    }
}

export default Message
