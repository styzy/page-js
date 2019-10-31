module.exports = function(api) {
    // 每次编译是否使用缓存
    api.cache(true)
    const presets = [
        [
            "@babel/preset-env",
            {
                // polyfill使用方式，"usage"表示按需引入
                // useBuiltIns: 'usage',
                // polyfill提供库，切换版本需重新安装依赖
                // corejs: 2,
                // 是否将ES6的模块化语法转译成其他类型
                // 参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为'commonjs'
                // modules: false,
                // 强制运行所有转换,如果输出将通过UglifyJS或仅支持ES5的环境运行，则很有用
                // forceAllTransforms: true,
                // 调试模式
                // debug: true
            }
        ]
    ]
    const plugins = [
        [
            '@babel/plugin-transform-runtime',
            {
                // absoluteRuntime: false,
                corejs: {
                    version: 3,
                    proposals: true
                },
                // helpers: true,
                // regenerator: true,
                // useESModules: false
            }
        ],
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-modules-commonjs'
    ]
    return {
        presets,
        plugins
    }
}