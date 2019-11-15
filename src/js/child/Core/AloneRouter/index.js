const AloneRouter = function() {
    let _this = this
    let empty = () => {}

    this.open = open
    this.reload = reload
    this.redirect = redirect
    this.close = close
    this.closeAll = close
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

    function reload() {
        window.location.reload()
    }

    function redirect(url) {
        window.location.replace(url)
    }

    function close() {
        window.close()
    }

    function setTitle(title) {
        document.title = title
    }
}

export default AloneRouter