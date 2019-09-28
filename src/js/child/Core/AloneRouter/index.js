const AloneRouter = function() {
    let _this = this
    let empty = () => {}

    this.open = open
    this.close = window.close
    this.closeAll = window.close
    this.recoverCache = empty
    this.clearCache = empty
    this.reload = window.location.reload
    this.redirect = window.location.replace
    this.closeSelf = window.close
    this.getPageId = empty
    this.getPageData = empty
    this.getGlobalData = empty
    this.getParentRouter = empty
    this.getConfig = empty
    this.syncHeight = empty
    this.postMessage = empty
    this.setTitle = setTitle

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