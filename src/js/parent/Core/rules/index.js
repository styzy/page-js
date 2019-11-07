import config from './config'
import globalRoute from './globalRoute'
import route from './route'

export { config as configRules }

export { globalRoute as globalRouteRules }

export { route as routeRules }

export default {
    configRules: config,
    globalRouteRules: globalRoute,
    routeRules: route
}