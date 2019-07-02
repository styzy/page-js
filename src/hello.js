class Hello {
    constructor() {
        this.name = 'es7'
    }
    sayHello() {
        document.write(`hello ${this.name}!`)
    }
}

export default new Hello()