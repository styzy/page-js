const AloneRouter = function() {
    let _this = this
    let empty = () => {}

    this.open = open
    this.close = window.close
    this.closeAll = window.close
    this.recoverCache = empty
    this.clearCache = empty
    this.closeSelf = window.close
    this.getPageId = empty
    this.syncHeight = empty
    this.postMessage = empty

    function open(url) {
        if (typeof url == 'object') {
            url = url.url
        }
        window.open(url)
    }
}

export default AloneRouter