import CONSTANTS from '../../../CONSTANTS'

const Router = function() {
    let payload = window.top[CONSTANTS.PARENT_PAYLOAD_NAME]
    let parentCore = payload.core
    let parentRouter = parentCore.router
    let pageId = window.name
    let routeId = parentCore.getPageInstance(pageId).routeId
    let route = parentCore.getRouteInstance(routeId)
    let messageReceiver = null

    this.open = open
    this.reload = reload
    this.redirect = redirect
    this.close = close
    this.closeAll = closeAll
    this.postMessage = postMessage
    this.setMessageReceiver = setMessageReceiver
    this.getMessageReceiver = getMessageReceiver
    this.syncHeight = syncHeight
    this.setTitle = setTitle
    this.getPageId = getPageId
    this.getSourcePageId = getSourcePageId
    this.getPageData = getPagePayload
    this.getGlobalData = getGlobalPayload
    // this.getParentPage = getParentRouter
    // this.getConfig = getConfig
    this.messageReceiver = null
    this.recoverCache = parentRouter.recoverCache
    this.clearCache = parentRouter.clearCache

    function open(options) {
        return parentRouter.open(options, pageId)
    }

    function reload(targetPageId) {
        targetPageId = targetPageId || pageId
        return parentRouter.reload(targetPageId)
    }

    function redirect(url, targetPageId) {
        targetPageId = targetPageId || pageId
        return parentRouter.redirect(url, targetPageId)
    }

    function close(targetPageId) {
        targetPageId = targetPageId || pageId
        return parentRouter.close(targetPageId)
    }

    function closeAll() {
        return parentRouter.closeAll()
    }

    function postMessage(data, targetPageId) {
        var message = {
            type: CONSTANTS.POST_MESSAGE_TYPE,
            from: pageId,
            to: targetPageId,
            data: data
        }
        message = JSON.stringify(message)
        window.top.postMessage(message, '*')
    }

    function setMessageReceiver(receiver) {
        if (typeof receiver === 'function') {
            messageReceiver = receiver
        } else {
            parentCore.log.error(`messageReceiver必须为function，而不是${typeof receiver}`)
        }
    }

    function getMessageReceiver() {
        return messageReceiver
    }

    function syncHeight() {
        parentRouter.syncHeight(pageId)
    }

    function setTitle(title) {
        parentRouter.setTitle(pageId, title)
    }

    function getPageId() {
        return pageId
    }

    function getSourcePageId() {
        return route.sourcePageId
    }

    function getPagePayload() {
        return payload[routeId]
    }

    function getGlobalPayload() {
        return payload.global
    }

    function getParentRouter() {
        return parentRouter
    }

    function getConfig() {
        return parentCore.config
    }
}

export default Router