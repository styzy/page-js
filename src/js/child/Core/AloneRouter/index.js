const AloneRouter = function() {
    let _this = this
    let empty = () => {}

    this.open = open
    this.reload = window.location.reload
    this.redirect = window.location.replace
    this.close = window.close
    this.closeAll = window.close
    this.postMessage = empty
    this.setMessageReceiver = empty
    this.getMessageReceiver = empty
    this.syncHeight = empty
    this.setTitle = setTitle
    this.getPageId = empty
    this.getSourcePageId = empty
    this.getPageData = empty
    this.getGlobalData = empty
    // this.getParentRouter = empty
    // this.getConfig = empty
    this.recoverCache = empty
    this.clearCache = empty

    function open(url) {
        if (typeof url == 'object') {
            url = url.url
        }
        window.open(url)
    }

    function setTitle(title) {
        document.title = title
    }
}

export default AloneRouter