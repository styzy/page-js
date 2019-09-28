// Route类定义
const Route = function(core, options) {
    var _this = this

    this.id = core.createRouteInstanceId()
    this.pageId = null
    this.update = update
    this.destory = destory

    setOptions.call(this, options)

    function update(opts) {
        setOptions.call(_this, opts)
    }

    function destory() {
        core.removeRouteInstanceByPageId(_this.id)
    }

    function setOptions(opts) {
        this.sourcePageId = opts.sourcePageId || ''
        this.title = opts.title === false ? false : opts.title
            // this.title = opts.title === false ? false : opts.title ? opts.title : opts.url
        this.preUrl = null
        if (this.url && this.url !== opts.url) {
            this.preUrl = this.url
        }
        this.url = opts.url
        this.data = opts.data
        this.icon = opts.icon
        this.iconfont = opts.iconfont
        this.userClose = opts.userClose !== false
        this.contextMenuGroups = opts.contextMenuGroups || []
        this.contextMenuEnable = opts.contextMenuEnable === undefined ? core.config.contextMenuEnable : !!opts.contextMenuEnable
        this.repeatEnable = opts.repeatEnable === undefined ? core.config.repeatEnable : !!opts.repeatEnable
        this.syncHeight = opts.syncHeight !== false
        this.onLoad = opts.onLoad
        this.onClose = opts.onClose
        if (core.config.devMode) {
            this.sandboxMode = opts.sandboxMode === undefined ? core.config.sandboxMode : !!opts.sandboxMode
        }
        core.setPagePayloadByRouteId(this.id, this.data)
    }
}

export default Route