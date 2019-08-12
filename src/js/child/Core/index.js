import Router from './Router'
import AloneRouter from './AloneRouter'
import constants from '../../constants'

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
    let payload = window.top[constants.parentPayloadName]
    let parentCore = payload.core
    let router = new Router(parentCore.router)
    let routeId = parentCore.getPageInstance(router.getPageId()).routeId
    window.addEventListener('load', function() {
        window.init && window.init(router, payload.global, payload[routeId], parentCore.config)
    })
    window.addEventListener('message', function(data) {
        if (data && data.data && data.data.type === constants.postMessageType) {
            if (typeof router.messageReciver === 'function') {
                let msg = data.data
                router.messageReciver(msg)
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