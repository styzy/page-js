import sync, { isHTMLElement } from '@styzy/utils-configuration-sync'

export function addMouseWheelListener(el, handler, options) {
    el.addEventListener('mousewheel', mouseWheelHandler, options)
    el.addEventListener('DOMMouseScroll', mouseWheelHandler, options)

    function mouseWheelHandler(event = window.event) {
        let wheelDelta = event.wheelDelta || -event.detail * 24
        let isUp = wheelDelta > 0
        if (handler instanceof Function) {
            handler.call(el, event, { wheelDelta, isUp })
        }
        return stopDefaultEvent(event)
    }
}

export function createURL(url) {
    if (url instanceof URL) {
        return url
    }
    if (typeof url === 'string') {
        return new URL(getAbsoluteUrl(url))
    }

    function getAbsoluteUrl(url) {
        var a = document.createElement('a')
        a.href = url
        return a.href
    }
}

/**
 * iframe是否跨域
 * @param {Element} iframe
 */
export function isCrossOrigin(iframe) {
    var isCrossOrigin = false
    try {
        var test = !iframe.contentWindow.location.href
    } catch (e) {
        isCrossOrigin = true
    }
    return isCrossOrigin
}

export { isHTMLElement }

export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export function px2number(str) {
    let number = parseFloat(str)
    return isNaN(number) ? 0 : number
}

/**
 * 字符串替换方法
 * @param {String} str 源字符串
 * @param {String} targetStr 目标字符串
 * @param {String} replaceStr 替换字符串
 */
export function replaceAll(str, targetStr, replaceStr) {
    replaceStr = replaceStr || ''
    return str.replace(new RegExp(targetStr, 'gm'), replaceStr)
}

export function smartClone(data) {
    if (data instanceof Object && !(data instanceof Function)) {
        return Object.assign(data.constructor(), data)
    } else {
        return data
    }
}

export function stopDefaultEvent(event) {
    event = event || window.event
    if (!event) {
        return false
    }

    if (event.stopPropagation) {
        event.stopPropagation()
    }
    if (event.preventDefault) {
        event.preventDefault()
    }
    if (window.event) {
        window.event.returnValue == false
    }

    return false
}

export { sync }

export default {
    addMouseWheelListener,
    createURL,
    isCrossOrigin,
    isHTMLElement,
    isObject,
    px2number,
    replaceAll,
    smartClone,
    stopDefaultEvent,
    sync
}
