import sync from '@styzy/utils-configuration-sync'

export { sync }

/**
 * 字符串替换方法
 * @param {String} str 源字符串
 * @param {String} targetStr 目标字符串
 * @param {String} replaceStr 替换字符串
 */
export function replaceAll(str, targetStr, replaceStr) {
    replaceStr = replaceStr || ''
    return str.replace(new RegExp(targetStr, "gm"), replaceStr);
};


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
};


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
        window.event.returnValue == false;
    }

    return false
}

export default {
    sync,
    replaceAll,
    isCrossOrigin,
    stopDefaultEvent
}