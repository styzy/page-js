const presets = [
    [
        "@babel/env",
        {
            corejs: "3",
            // 是否将ES6的模块化语法转译成其他类型
            // 参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为'commonjs'
            modules: "commonjs",
            useBuiltIns: 'usage'
        }
    ]
]

module.exports = { presets }