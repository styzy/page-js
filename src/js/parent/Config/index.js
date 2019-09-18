export const defaultConfig = {
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
        desc: '用来存放标题的容器'
    },
    // 页面视图容器
    'viewContainer': {
        default: '#pageIframeCtn',
        type: [String, HTMLElement],
        desc: '用来存放页面视图的容器'
    },
    // 页面数量限制
    'limit': {
        default: 0,
        type: Number,
        desc: '页面数量限制,达到或超过上限会触发onLimit钩子函数'
    },
    // 沙盒模式
    'sandboxMode': {
        default: false,
        type: Boolean,
        desc: '沙盒模式，仅在开发者模式下有效',
    },
    // 关闭按钮class
    'closeClass': {
        default: '',
        type: String,
        desc: '该参数即将废弃；标题关闭按钮className，渲染在span标签上'
    },
    // 关闭按钮iconfont样式
    'closeIconfontClass': {
        default: '',
        type: String,
        desc: '该参数即将废弃；标题关闭按钮iconfont字体图标className，当该参数存在时，会自动渲染带有该参数作为class的i标签，同时closeClass参数无效，因为不渲染span标签'
    },
    // 全局是否允许右键菜单
    'contextMenuEnable': {
        default: false,
        type: Boolean,
        desc: '是否允许在标签页标题上使用右键菜单，本参数为全局参数，即设为false时，所有标签页无法使用右键菜单（即使页面的路由中设定允许使用）'
    },
    // 全局右键菜单配置
    'contextMenuGroups': {
        default: [],
        type: Array,
        desc: '右键菜单的全局配置，当contextMenuEnable设置为true时有效，可以和页面定制化右键菜单同时存在'
    },
    // 是否允许重复打开相同页面
    'repeatEnable': {
        default: false,
        type: Boolean,
        desc: '设置为true时，当页面的url完全相同时，仅对该页面聚焦，如果页面url的query参数不同，则会聚焦页面并且刷新为新的url'
    },
    // 是否允许使用本地缓存
    'cacheEnable': {
        default: false,
        type: Boolean,
        desc: '允许使用本地缓存后，每次页面的打开和关闭都会进行本地数据的存储，通过调用recoverCache（）方法可以恢复本地的缓存；注意：使用本地缓存会消耗浏览器性能'
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
    'globalData': {
        default: null,
        desc: '全局传递参数，所有标签页可以获取，支持任意类型数据'
    }
}

export const Config = function(userConfig) {
    let config = syncConfig(userConfig)
    return config
}

/**
 * 同步config
 * @param {Object} userConfig 
 */
function syncConfig(userConfig) {
    let config = {}
    if (typeof userConfig == 'object') {
        for (var key in defaultConfig) {
            if (userConfig.hasOwnProperty(key)) {
                const value = userConfig[key]
                const ValidType = defaultConfig[key].type
                    // 类型验证
                if (ValidType && !typeValid(value, ValidType)) {
                    console.error(`Page实例化失败: ${key} 属性类型应该为 ${typeof ValidType === 'object' ? ValidType.map(type=>type.name).join(',') : ValidType.name},设置的值为: ${value}`)
                    return false
                }
                config[key] = userConfig[key]
            } else {
                config[key] = defaultConfig[key].default
            }
        }

        // 开发者模式未开启时，强制关闭沙盒模式
        if (!config.devMode) {
            config.sandboxMode = false
        }
    } else {
        for (const key in defaultConfig) {
            if (defaultConfig.hasOwnProperty(key)) {
                config[key] = defaultConfig[key].default
            }
        }
    }

    return config

    /**
     * 参数类型检查
     * @param {*} value 
     * @param {*} requireTypes 
     */
    function typeValid(value, requireTypes) {
        let valueType = ''
        if (value instanceof HTMLElement) {
            valueType = 'HTMLElement'
        } else {
            valueType = Object.prototype.toString.call(value).substr(8).replace(']', '')
        }
        if (typeof requireTypes === 'function') {
            requireTypes = [requireTypes]
        }
        return requireTypes.some(requireType => requireType.name === valueType)
    }
}

export default Config