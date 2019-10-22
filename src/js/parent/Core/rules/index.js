import sync from './sync'
import config from './config'
import globalRoute from './globalRoute'
import route from './route'

export { sync }

export { config as configRules }

export { globalRoute as globalRouteRules }

export { route as routeRules }

export default {
    sync,
    configRules: config,
    globalRouteRules: globalRoute,
    routeRules: route
}