import css from '../../stylus/child.styl'
import constants from '../constants'
import Core from './Core'

const core = new Core(window[constants.childInitCallbackName])

export default core