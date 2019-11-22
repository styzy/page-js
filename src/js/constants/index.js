const CONSTANTS = {
    // 版本号
    VERSION: '1.2.4',
    // 选择器
    SELECTOR: {
        // 路由元素
        ROUTE_ELEMENT: '[page-href]'
    },
    CLASS_NAME: {
        TITLE_CONTAINER: 'page-title-container',
        TITLE_CONTAINER_SHOW_MORE: 'show-all',
        TITLE_WRAPPER: 'page-title-wrap',
        TITLE_MORE: 'page-title-more',
        TITLE: {
            // 标题wrapper
            WRAPPER: 'page-title',
            // 图标
            ICON: 'page-title-icon',
            // 文本
            CONTENT: 'page-title-content',
            // 关闭
            CLOSE: 'page-title-close',
            // 默认关闭
            CLOSE_DEFAULT: 'page-title-close-default',
            // 焦点
            FOCUS: 'page-title-focus'
        },
        VIEW_CONTAINER: 'page-view-container',
        // 页面wrapper
        VIEW_WRAPPER: 'page-view-wrapper',
        VIEW: {
            // iframe
            IFRAME: 'page-view-iframe',
            // 焦点
            FOCUS: 'page-view-iframe-focus'
        },
        CONTEXTMENU: {
            // 右键菜单wrapper
            WRAPPER: 'page-contextmenu-wrapper',
            // 菜单组容器
            GROUP: 'page-contextmenu-group',
            // 标题
            TITLE: 'page-contextmenu-title',
            // 分割线
            CUTLINE: 'page-contextmenu-cutline',
            // 元素
            MENU: 'page-contextmenu-menu',
            // 图标
            MENU_ICON: 'page-contextmenu-menu-icon',
            // 名称
            MENU_NAME: 'page-contextmenu-menu-name',
            // viewMarker
            VIEW_MARKER: 'page-contextmenu-menu-viewMarker'
        }
    },
    ATTRIBUTE_NAME: {
        // 路由url定义
        ROUTE_URL: 'page-href',
        // 路由title定义
        ROUTE_TITLE: 'page-title',
        // 路由titleIcon定义
        ROUTE_TITLE_ICON: 'page-title-icon',
        // 路由是否禁止用户关闭
        ROUTE_CLOSE_ENABLE: 'page-close-enable',
        // 路由是否允许重复
        ROUTE_REPEAT_ENABLE: 'page-repeat-enable',
        // 路由打开钩子
        ROUTE_ON_LOAD: 'page-onload',
        // 路由关闭钩子
        ROUTE_ON_CLOSE: 'page-onclose',
        // 自动同步高度
        ROUTE_AUTO_SYNC_HEIGHT: 'page-auto-sync-height'
    },
    RULES: {
        REPEAT_RULE: {
            ORIGIN: 'origin',
            ORIGIN_PATHNAME: 'origin_pathname',
            ORIGIN_PATHNAME_SEARCH: 'origin_pathname_search',
            ALL: 'all'
        }
    },
    LOCAL_STORAGE: {
        ROUTE_HISTORY: 'routeHistory'
    },
    // 父容器挂载提供给子页面的存储空间名称
    PARENT_PAYLOAD_NAME: '_parent_payload',
    // devMode时window挂载数据名
    DEV_MODE_WINDOW_DATA_NAME: 'pageDevData',
    // 子页面初始化方法名称
    CHILD_INIT_CALLBACK_NAME: 'init',
    // 页面间通信标识
    POST_MESSAGE_TYPE: 'page-message'
}

export default CONSTANTS