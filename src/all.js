import { Page as parent } from './index'
import { Page as child } from './child'
import configRules from './Core/Config/rules'
import globalRouteRules from './Core/Route/globalRules'
import routeRules from './Core/Route/rules'

export { parent }

export { child }

export const api = {
    config: configRules,
    globalRoute: globalRouteRules,
    route: routeRules
}

export const version = parent.version

export default {
    parent,
    child,
    version
}
