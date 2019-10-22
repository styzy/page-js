import css from '../../stylus/child.styl'
import CONSTANTS from '../CONSTANTS'
import Core from './Core'

const core = new Core(window[CONSTANTS.CHILD_INIT_CALLBACK_NAME])

export default core