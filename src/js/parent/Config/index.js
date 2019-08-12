const Config = function(userConfig) {
    let initialConfig = {
        // 页面数量限制
        limit: 0,
        // 开发者模式
        devMode: false,
        // 沙盒模式，仅在开发者模式下有效
        sandboxMode: false,
        // 关闭按钮样式
        closeClass: '',
        // 关闭按钮iconfont样式
        closeIconfontClass: '',
        // 是否使用右键菜单
        contextMenuEnable: false,
        // 右键菜单全局参数
        contextMenuGroups: [],
        // 同样的页面是否允许打开多个
        repeatEnable: false,
        // 是否允许使用本地缓存
        cacheEnable: false,
        // 达到上限回调
        onLimit: function() {},
        // 加载完成回调
        onLoad: function() {},
        // 关闭回调
        onClose: function() {},
        // 消息回调
        onMessage: function() {},
        // 全局子页面传递参数
        globalData: {}
    }
    let config = syncConfig(initialConfig, userConfig)
    return config
}

/**
 * 同步config
 * @param {Object} config 
 * @param {Object} newConfig 
 */
function syncConfig(config, newConfig) {
    if (typeof newConfig == 'object') {
        for (var key in config) {
            if (newConfig.hasOwnProperty(key)) {
                if (typeof newConfig[key] == typeof config[key]) {
                    config[key] = newConfig[key]
                } else {
                    console.error('Page实例化失败, ' + key + ' 属性类型应该为 ' + typeof config[key] + ' ,而不是 ' + typeof newConfig[key])
                    return false
                }
            }
        }
        // 开发者模式未开启时，强制关闭沙盒模式
        if (!config.devMode) {
            config.sandboxMode = false
        }
        return config
    } else {
        return false
    }
}

export default Config