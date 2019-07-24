import constants from '../../../constants'

const Router = function(parentRouter) {
    var pageId = window.name

    this.open = parentRouter.open
    this.close = parentRouter.close
    this.closeAll = parentRouter.closeAll
    this.recoverCache = parentRouter.recoverCache
    this.clearCache = parentRouter.clearCache
    this.closeSelf = closeSelf
    this.getPageId = getPageId
    this.syncHeight = syncHeight
    this.postMessage = postMessage
    this.messageReciver = null

    function closeSelf() {
        parentRouter.close(pageId)
    }

    function getPageId() {
        return pageId
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

}

export default Router