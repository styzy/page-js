import CONSTANTS from '../../CONSTANTS'

const rules = {
    // 标题图标
    titleIcon: {
        default: null,
        type: [String, HTMLElement, Function],
        desc: '标题图标Icon，默认不渲染图标，支持纯文本、HTMLString、HTMLElement和Function，当值为Function时，需要返回除Function之外的其他类型值'
    },
    // 关闭按钮
    titleCloseButton: {
        default: null,
        type: [String, HTMLElement, Function],
        desc: '标题关闭按钮，默认使用字符x渲染，支持纯文本、HTMLString、HTMLElement和Function，当值为Function时，需要返回除Function之外的其他类型值'
    },
    // 是否允许关闭
    closeEnable: {
        default: true,
        type: Boolean,
        desc: '页面是否允许关闭，当设置为false时，close方法需要使用强制关闭'
    },
    // 是否允许重复
    repeatEnable: {
        default: true,
        type: Boolean,
        desc: '默认为true，即允许重复，设置为false时，可通过repeatRule属性定义重复验证规则'
    },
    // 自定义重复验证方法
    repeatRule: {
        default: CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME,
        type: [String, Function],
        desc: `仅当repeatEnable为false时有效，默认为${CONSTANTS.RULES.REPEAT_RULE.ALL}，可选择${CONSTANTS.RULES.REPEAT_RULE.ORIGIN}、${CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME}、${CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME_SEARCH}、${CONSTANTS.RULES.REPEAT_RULE.ALL},${CONSTANTS.RULES.REPEAT_RULE.ORIGIN}表示只验证url的origin，即同源验证，${CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME}表示验证origin和pathname（不包括search和hash），${CONSTANTS.RULES.REPEAT_RULE.ORIGIN_PATHNAME_SEARCH}表示除了hash部分其他全部验证，${CONSTANTS.RULES.REPEAT_RULE.ALL}表示完全验证；该参数定义为方法时，接收参数为当前验证url，返回自定义处理后的url用来验证是否重复`
    },
    // 全局是否允许右键菜单
    contextmenuEnable: {
        default: false,
        type: Boolean,
        desc: '是否允许在标签页标题上使用右键菜单'
    },
    // 全局右键菜单配置
    contextmenuGroups: {
        default: [],
        type: Array,
        desc: '右键菜单的全局配置，当contextmenuEnable设置为true时有效，注意：本参数和页面contextmenuGroups不冲突，可同时存在'
    },
    // 自动同步高度
    autoSyncHeight: {
        default: true,
        type: Boolean,
        desc: '自动同步子页面高度到父页面'
    },
    // 自动获取标题
    autoFetchTitle: {
        default: true,
        type: Boolean,
        desc: '自动获取子页面title'
    },
    // 沙盒模式
    sandboxMode: {
        default: false,
        type: Boolean,
        desc: '沙盒模式，仅在开发者模式下有效'
    },
    // 查看源码模式
    viewSourceMode: {
        default: false,
        type: Boolean,
        desc: '查看源码模式，仅在开发者模式下有效'
    }
}

export default rules
