import Router from './Router'
import AloneRouter from './AloneRouter'
import CONSTANTS from '../../CONSTANTS'

const Core = function(initCallback) {
    let isChild = checkParent()
    if (isChild) {
        let isOpenByPage = checkOpenByPage()
        if (isOpenByPage) {
            initByParent(initCallback)
        } else {
            initAlone()
        }
    } else {
        initAlone()
    }
}

// 检测是否在框架中
function checkParent() {
    return window.self !== window.top
}

// 检测由page框架打开
function checkOpenByPage() {
    return window.name.indexOf('page') !== -1
}

// 通过框架数据初始化
function initByParent() {
    let router = new Router()
    window.addEventListener('load', function() {
        window.init && window.init(router, router.getGlobalData())
    })
    window.addEventListener('message', function(message) {
        message = message.data
        if (typeof message === 'string') {
            try {
                message = JSON.parse(message)
            } catch (error) {
                return false
            }
        } else {
            return false
        }
        if (message && message.type === CONSTANTS.POST_MESSAGE_TYPE) {
            let messageReceiver = router.getMessageReceiver()
            if (!messageReceiver && router.messageReceiver) {
                console.warn('messageReceiver消息接收器即将废弃，建议使用setMessageReceiver()代替')
                messageReceiver = router.messageReceiver
            }
            if (typeof messageReceiver === 'function') {
                messageReceiver(message)
            }
        }
    })
}

// 独立运行初始化
function initAlone() {
    window.addEventListener('load', () => {
        let aloneRouter = new AloneRouter()
        window.init && window.init(aloneRouter)
    })

}

export default Core