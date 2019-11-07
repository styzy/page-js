import parentCore from './parent/Core'
import childCore from './child/Core'
import rules from './parent/Core/rules'
import CONSTANTS from './CONSTANTS'

export { parentCore as parent }

export { childCore as child }

export const api = {
    configuration: rules.configRules,
    globalRoute: rules.globalRouteRules,
    route: rules.routeRules
}

export const version = CONSTANTS.VERSION

export default {
    parent: parentCore,
    child: childCore,
    version
}