import { sync } from '../../utils'
import rules from './rules'
import globalRouteRules from '../Route/globalRules'

class Config {
    constructor(customConfig) {
        try {
            let config = sync(rules, customConfig)
            // 开发者模式未开启时，强制关闭沙盒模式
            if (!config.devMode) {
                config.sandboxMode = false
            }
            if (config.globalRoute) {
                config.globalRoute = sync(globalRouteRules, config.globalRoute)
            }
            this.#bindProperty(config)
        } catch (error) {
            throw error
        }
    }
    #bindProperty(object) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                this[key] = object[key]
            }
        }
    }
    update(customConfig) {
        try {
            let config = sync(rules, customConfig)
            for (const key in config) {
                if (!customConfig.hasOwnProperty(key)) {
                    delete config[key]
                }
            }
            this.#bindProperty(config)
        } catch (error) {
            throw error
        }
    }
}

export default Config
