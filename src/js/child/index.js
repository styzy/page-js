import css from '../../stylus/child.styl'
import CONSTANTS from '../CONSTANTS'
import Core from './Core'

const init = function() {
    return new Core(window[CONSTANTS.CHILD_INIT_CALLBACK_NAME])
}

init()

export default init