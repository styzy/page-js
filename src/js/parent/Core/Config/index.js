import { configRules, globalRouteRules } from '../rules'
import { sync } from '../../../utils'

const Config = function(userConfig) {
    let config = null
    try {
        config = sync(configRules, userConfig)
        // 开发者模式未开启时，强制关闭沙盒模式
        if (!config.devMode) {
            config.sandboxMode = false
        }
        if (config.globalRoute) {
            config.globalRoute = sync(globalRouteRules, config.globalRoute)
        }
    } catch (error) {
        console.error('[Config实例化失败]', error)
    }
    return config
}

export default Config