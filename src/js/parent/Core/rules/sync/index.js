import typeValid from './typeValid'

/**
 * 同步
 * @param {Object} rules 
 * @param {Object} _custom 
 */
function sync(rules, _custom) {
    let options = {}
    for (var key in rules) {
        const rule = rules[key]
        if (typeof _custom == 'object' && _custom.hasOwnProperty(key) && _custom[key] !== null) {
            const value = _custom[key]
            const ValidType = rule.type
            // 类型验证
            if (ValidType && !typeValid(value, ValidType)) {
                throw new TypeError(`${key} 属性类型应该为 ${typeof ValidType === 'object' ? ValidType.map(type=>type.name).join(',') : ValidType.name},设置的值为: ${value}`)
                // return false
            }
            options[key] = _custom[key]
        } else {
            if (rule.required) {
                throw new Error(`${key} 属性类型是必须的`)
            } else {
                options[key] = rules[key].default
            }
        }
    }
    return options
}

export default sync