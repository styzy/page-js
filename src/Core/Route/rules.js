const rules = {
    // 页面路径
    url: {
        default: '',
        type: [String, URL],
        required: true,
        desc: '页面路径url'
    },
    // 携带参数
    data: {
        default: null,
        desc: '携带到子页面的参数'
    },
    // 标题
    title: {
        default: '',
        type: [String, Boolean],
        desc: '页面标题，默认为url，当页面加载后，会自动抓取子页面的title标签内文本'
    },
    // 加载完成回调
    onLoad: {
        default: null,
        type: Function,
        desc: '页面加载完成回调,接收参数当前页面id'
    },
    // 页面关闭回调
    onClose: {
        default: null,
        type: Function,
        desc: '页面关闭回调,接收两个参数:当前页面id和下一个页面id'
    },
    // 定制化模式
    customMode: {
        default: false,
        type: Boolean,
        desc: '开启定制化模式时，可通过自定义元素创建方法等高级属性，实现定制化需求。注意：定制化模式需要轻量级二次开发，更多请参考各定制化属性说明。'
    },
    // 自动获取焦点
    autoFocus: {
        default: true,
        type: Boolean,
        desc: '打开新页面后是否自动获取焦点，默认为true，[该属性为定制化属性，仅在customMode下生效]'
    },
    // 标题容器
    titleWrapper: {
        default: null,
        type: [String, HTMLElement],
        desc: '用来存放标题的容器,值为选择器或dom元素,该属性为定制化属性,需要二次开发样式。[该属性为定制化属性，仅在customMode下生效]'
    },
    // 标题创建方法
    titleCreator: {
        default: null,
        type: Function,
        desc:
            '用来自定义创建标题的方法，本方法执行需要返回HTMLElement类型参数，该方法接收title,close,focus,contextmenu四个参数，close方法可以关闭当前页面，focus方法可以聚焦当前页面,contextmenu方法可以唤起右键菜单。[该属性为定制化属性，仅在customMode下生效]'
    },
    // 页面视图容器
    viewWrapper: {
        default: null,
        type: [String, HTMLElement],
        desc: '用来存放页面视图的容器,值为选择器或dom元素,该属性为定制化属性,需要二次开发样式。[该属性为定制化属性，仅在customMode下生效]'
    }
}

export default rules
