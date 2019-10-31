import CONSTANTS from '../../../CONSTANTS'

const Router = function() {
    let payload = window.top[CONSTANTS.PARENT_PAYLOAD_NAME]
    let parentCore = payload.core
    let parentRouter = parentCore.router
    let pageId = window.name
    let routeId = parentCore.getPageInstance(pageId).routeId
    let route = parentCore.getRouteInstance(routeId)

    this.open = open
    this.close = close
    this.closeAll = parentRouter.closeAll
    this.reload = reload
    this.redirect = redirect
    this.syncHeight = syncHeight
    this.postMessage = postMessage
    this.messageReceiver = null
    this.setTitle = setTitle
    this.getPageId = getPageId
    this.getSourcePageId = getSourcePageId
    this.getPageData = getPagePayload
    this.getGlobalData = getGlobalPayload
    this.getParentPage = getParentRouter
    this.getConfig = getConfig
    this.recoverCache = parentRouter.recoverCache
    this.clearCache = parentRouter.clearCache

    function open(options) {
        return parentRouter.open(options, pageId)
    }

    function close(targetPageId) {
        targetPageId = targetPageId || pageId
        parentRouter.close(targetPageId)
    }

    function reload(targetPageId) {
        targetPageId = targetPageId || pageId
        parentRouter.reload(targetPageId)
    }

    function redirect(url, targetPageId) {
        targetPageId = targetPageId || pageId
        parentRouter.redirect(url, targetPageId)
    }

    function syncHeight() {
        parentRouter.syncHeightByPageId(pageId)
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