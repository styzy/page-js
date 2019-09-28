import constants from '../../../constants'

const Router = function() {
    let payload = window.top[constants.parentPayloadName]
    let parentCore = payload.core
    let parentRouter = parentCore.router
    let pageId = window.name
    let routeId = parentCore.getPageInstance(pageId).routeId
    let route = parentCore.getRouteInstance(routeId)

    this.open = open
    this.close = parentRouter.close
    this.closeAll = parentRouter.closeAll
    this.recoverCache = parentRouter.recoverCache
    this.clearCache = parentRouter.clearCache
    this.reload = reload
    this.redirect = redirect
    this.closeSelf = closeSelf
    this.getPageId = getPageId
    this.getSourcePageId = getSourcePageId
    this.getPageData = getPagePayload
    this.getGlobalData = getGlobalPayload
    this.getParentPage = getParentRouter
    this.getConfig = getConfig
    this.syncHeight = syncHeight
    this.postMessage = postMessage
    this.messageReceiver = null
    this.setTitle = setTitle

    function open(options) {
        return parentRouter.open(options, pageId)
    }

    function reload() {
        parentRouter.reload(pageId)
    }

    function redirect(url, targetPageId) {
        targetPageId = targetPageId || pageId
        parentRouter.redirect(url, targetPageId)
    }

    function closeSelf() {
        parentRouter.close(pageId)
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

    function syncHeight() {
        parentRouter.syncHeightByPageId(window.name)
    }

    function postMessage(data, targetPageId) {
        var postData = {
            type: constants.postMessageType,
            from: pageId,
            to: targetPageId,
            data: data
        }
        window.top.postMessage(postData, '*')
    }

    function setTitle(title) {
        parentRouter.setTitle(pageId, title)
    }

}

export default Router