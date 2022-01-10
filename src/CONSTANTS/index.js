const NAME_SPACE = `page`
const CONSTANTS = {
    // 版本号
    VERSION: `1.4.1`,
    // 选择器
    SELECTOR: {
        // 路由元素
        ROUTE_ELEMENT: `[page-href]`
    },
    CLASS_NAME: {
        ICONFONT: `${NAME_SPACE}-iconfont`,
        ICONFONT_LAB: `${NAME_SPACE}-iconfont-lab`,
        ICONFONT_SANDBOX: `${NAME_SPACE}-iconfont-sandbox`,
        ICONFONT_VIEW: `${NAME_SPACE}-iconfont-view`,
        ICONFONT_CODE: `${NAME_SPACE}-iconfont-code`,
        ICONFONT_DANGER: `${NAME_SPACE}-iconfont-danger`,
        ICONFONT_LOGOUT: `${NAME_SPACE}-iconfont-logout`,
        ICONFONT_URL: `${NAME_SPACE}-iconfont-url`,
        ICONFONT_LINK: `${NAME_SPACE}-iconfont-link`,
        ICONFONT_ATTACHMENT: `${NAME_SPACE}-iconfont-attachment`,
        ICONFONT_CLOSE: `${NAME_SPACE}-iconfont-close`,
        TITLE_CONTAINER: `${NAME_SPACE}-title-container`,
        TITLE_WRAPPER: `${NAME_SPACE}-title-wrapper`,
        TITLE: {
            // 标题wrapper
            WRAPPER: `${NAME_SPACE}-title`,
            // 图标
            ICON: `${NAME_SPACE}-title-icon`,
            // 文本
            CONTENT: `${NAME_SPACE}-title-content`,
            // 关闭
            CLOSE: `${NAME_SPACE}-title-close`,
            // 默认关闭
            CLOSE_DEFAULT: `${NAME_SPACE}-title-close-default`,
            // 焦点
            FOCUS: `${NAME_SPACE}-title-focus`
        },
        VIEW_CONTAINER: `${NAME_SPACE}-view-container`,
        // 页面wrapper
        VIEW_WRAPPER: `${NAME_SPACE}-view-wrapper`,
        VIEW: {
            // iframe
            IFRAME: `${NAME_SPACE}-view-iframe`,
            // 焦点
            FOCUS: `${NAME_SPACE}-view-iframe-focus`,
            // 沙盒模式
            SANDBOX_MODE: `${NAME_SPACE}-view-iframe-sandbox-mode`,
            // 查看源码模式
            VIEW_SOURCE_MODE: `${NAME_SPACE}-view-iframe-view-source-mode`,
            // 编辑源码模式
            EDIT_SOURCE_MODE: `${NAME_SPACE}-view-iframe-edit-source-mode`
        },
        CONTEXTMENU: {
            // 右键菜单wrapper
            WRAPPER: `${NAME_SPACE}-contextmenu-wrapper`,
            // 菜单组容器
            GROUP: `${NAME_SPACE}-contextmenu-group`,
            // 标题
            TITLE: `${NAME_SPACE}-contextmenu-title`,
            // 分割线
            CUTLINE: `${NAME_SPACE}-contextmenu-cutline`,
            // 菜单元素
            MENU: `${NAME_SPACE}-contextmenu-menu`,
            // 图标
            MENU_ICON: `${NAME_SPACE}-contextmenu-menu-icon`,
            // 名称
            MENU_NAME: `${NAME_SPACE}-contextmenu-menu-name`,
            // 菜单禁用
            MENU_DISABLED: `${NAME_SPACE}-contextmenu-menu-disabled`,
            // 危险菜单
            MENU_DANGEROUS: `${NAME_SPACE}-contextmenu-menu-dangerous`,
            // 遮罩
            MARKER: `${NAME_SPACE}-contextmenu-menu-marker`
        },
        // 地址栏
        ADDRESS_BAR: {
            WRAPPER: `${NAME_SPACE}-address-bar-wrapper`,
            SAFETY_ICON: `${NAME_SPACE}-address-bar-safety-icon`,
            INPUT: `${NAME_SPACE}-address-bar-input`,
            CLOSE_BUTTON: `${NAME_SPACE}-address-bar-close-button`
        }
    },
    ATTRIBUTE_NAME: {
        // 路由url定义
        ROUTE_URL: `${NAME_SPACE}-href`,
        // 路由title定义
        ROUTE_TITLE: `${NAME_SPACE}-title`,
        // 路由titleIcon定义
        ROUTE_TITLE_ICON: `${NAME_SPACE}-title-icon`,
        // 路由是否禁止用户关闭
        ROUTE_CLOSE_ENABLE: `${NAME_SPACE}-close-enable`,
        // 路由是否允许重复
        ROUTE_REPEAT_ENABLE: `${NAME_SPACE}-repeat-enable`,
        // 路由打开钩子
        ROUTE_ON_LOAD: `${NAME_SPACE}-onload`,
        // 路由关闭钩子
        ROUTE_ON_CLOSE: `${NAME_SPACE}-onclose`,
        // 自动同步高度
        ROUTE_AUTO_SYNC_HEIGHT: `${NAME_SPACE}-auto-sync-height`
    },
    RULES: {
        REPEAT_RULE: {
            ORIGIN: `origin`,
            ORIGIN_PATHNAME: `origin_pathname`,
            ORIGIN_PATHNAME_SEARCH: `origin_pathname_search`,
            ALL: `all`
        }
    },
    LOCAL_STORAGE: {
        ROUTE_HISTORY: `${NAME_SPACE}-route-history`
    },
    // 框架层数据存储空间名称
    PAYLOAD_STORAGE_NAME: `__${NAME_SPACE.toUpperCase()}_PAYLOAD_STORAGE__`,
    // 核心数据存储名称
    PAYLOAD_CORE_NAME: `__${NAME_SPACE.toUpperCase()}__CORE__`,
    // 全局数据存储名称
    PAYLOAD_GLOBAL_NAME: `__${NAME_SPACE.toUpperCase()}__GLOBAL__`,
    // 页面id前缀
    PAGE_ID_PREFIX: `styzy-${NAME_SPACE}`,
    // devMode时window挂载数据名
    DEV_MODE_WINDOW_DATA_NAME: `pageDevData`,
    // 子页面初始化方法名称，请勿修改
    CHILD_INIT_CALLBACK_NAME: `init`,
    // 页面间通信标识
    POST_MESSAGE_TYPE: `${NAME_SPACE}-message`,
    //
    FRAMEWORK_SUPPROT_FLAG: `__${NAME_SPACE.toUpperCase()}__SUPPORT__`
}

export default CONSTANTS
