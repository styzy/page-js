import Sky from '../../Sky'

class SuperView extends Sky.Component {
    #route
    get route() {
        return this.#route
    }
    constructor(route) {
        super()
        this.#route = route
    }
}

export default SuperView
