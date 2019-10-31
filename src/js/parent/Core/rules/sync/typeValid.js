/**
 * 参数类型检查
 * @param {*} value 
 * @param {*} requireTypes 
 */
const typeValid = function(value, requireTypes) {
    if (!(requireTypes instanceof Array)) {
        requireTypes = [requireTypes]
    }
    let valueType = ''
    if (value instanceof HTMLElement) {
        valueType = 'HTMLElement'
    } else {
        valueType = Object.prototype.toString.call(value).substr(8).replace(']', '')
    }
    return requireTypes.some(requireType => {
        if (requireType === HTMLElement) {
            return valueType === 'HTMLElement'
        } else {
            let name = requireType.name || getFnName(requireType)
            return name === valueType
        }
    })

    function getFnName(fn) {
        return fn.toString().match(/^\s*function (\w+)/)[1]
    }
}

export default typeValid