const config = {
    // 开发者模式
    'devMode': {
        default: false,
        type: Boolean,
        desc: '开发者模式'
    },
    // 标题容器
    'titleContainer': {
        default: '#pageTitleCtn',
        type: [String, HTMLElement],
        desc: '用来存放标题的容器,值为选择器或dom元素'
    },
    // 页面视图容器
    'viewContainer': {
        default: '#pageIframeCtn',
        type: [String, HTMLElement],
        desc: '用来存放页面视图的容器,值为选择器或dom元素'
    },
    // 是否允许使用本地缓存
    'cacheEnable': {
        default: false,
        type: Boolean,
        desc: '允许使用本地缓存后，每次页面的打开和关闭都会进行本地数据的存储，通过调用recoverCache（）方法可以恢复本地的缓存；注意：使用本地缓存会消耗浏览器性能'
    },
    // 页面数量限制
    'limit': {
        default: 0,
        type: Number,
        desc: '页面数量限制,达到或超过上限会触发onLimit钩子函数'
    },
    // 达到上限回调
    'onLimit': {
        default: null,
        type: Function,
        desc: '当设置limit参数不为0时，标签页数量达到limit或超过时，触发该方法，参数：limit'
    },
    // 加载完成回调
    'onLoad': {
        default: null,
        type: Function,
        desc: '每次标签页加载成功后触发，参数：pageId'
    },
    // 关闭页面回调
    'onClose': {
        default: null,
        type: Function,
        desc: '每次页面关闭前触发，参数：pageId, nextPageId'
    },
    // 消息回调
    'onMessage': {
        default: null,
        type: Function,
        desc: '收到消息回调，标签页面向框架发送消息时触发，参数：message'
    },
    // 全局荷载
    'globalData': {
        default: null,
        desc: '全局传递参数，所有标签页可以获取，支持任意类型数据'
    },
    // 全局路由配置
    'globalRoute': {
        default: null,
        type: Object,
        desc: '全局路由参数配置，具体说明请查看全局路由参数配置说明'
    }
}

export default config