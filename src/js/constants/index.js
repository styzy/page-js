const constants = {
    selector: {
        // 路由元素
        routeEl: '[page-href]'
    },
    className: {
        titleContainer: 'page-title-container',
        titleContainerShowMore: 'show-all',
        titleWrapper: 'page-title-wrap',
        titleMore: 'page-title-more',
        title: {
            // 标题wrapper
            wrapper: 'page-title',
            // 图标
            icon: 'page-title-icon',
            // 文本
            content: 'page-title-content',
            // 关闭
            close: 'page-title-close',
            //
            disableClose: 'page-title-close-disabled',
            // 焦点
            focus: 'focus'
        },
        view: {
            // 页面wrapper
            wrapper: 'page-iframe-wrapper',
            // iframe
            iframe: 'page-iframe',
            // 焦点
            focus: 'focus'
        },
        contextMenu: {
            // 右键菜单wrapper
            wrapper: 'page-contextMenu-wrapper',
            // 标题
            title: 'page-contextMenu-title',
            // 菜单组容器
            group: 'page-contextMenu-group',
            // 标题
            title: 'page-contextMenu-title',
            // 分割线
            cutline: 'page-contextMenu-cutline',
            // 元素
            menu: 'page-contextMenu-menu',
            // 图标
            menuIcon: 'page-contextMenu-menu-icon',
            // 名称
            menuName: 'page-contextMenu-menu-name',
            // viewMarker
            viewMarker: 'page-contextMenu-menu-viewMarker'
        }
    },
    attributeName: {
        // 路由url定义
        routeUrl: 'page-href',
        // 路由icon定义
        routeIcon: 'page-icon',
        // 路由iconfont定义
        routeIconfont: 'page-iconfont',
        // 路由title定义
        routeTitle: 'page-title',
        // 路由是否禁止用户关闭
        routeDisableClose: 'page-disable-close',
        // 路由打开钩子
        routeOnLoad: 'page-onload',
        // 路由关闭钩子
        routeOnClose: 'page-onclose'
    },
    routeType: {
        Dom: 'dom',
        Code: 'code'
    },
    localStorage: {
        routeHistory: 'routeHistory'
    },
    // 父容器挂载提供给子页面的存储空间名称
    parentPayloadName: '_parent_payload',
    // devMode时window挂载数据名
    devModeWindowDataName: 'pageDevData',
    // 子页面初始化方法名称
    childInitCallbackName: 'init',
    // 页面间通信标识
    postMessageType: 'page-message',
    // 版本号
    verions: '1.0.0'
}

export default constants