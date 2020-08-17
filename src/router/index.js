import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/周杰伦',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/org.vue'),
                    meta: {title: '组织机构'}
                },
                {
                    path: '/周润发',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: {title: '2222'}
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: {title: '自定义图标'}
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: {title: '基础表格'}
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: {title: 'tab选项卡'}
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: {title: '基本表单'}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: {title: '富文本编辑器'}
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: {title: 'markdown编辑器'}
                },
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/org.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/comm',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/community.vue'),
                    meta: { title: '社区管理' }
                },
                {
                    path: '/menuList',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/menuList.vue'),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/orgList.vue'),
                    meta: { title: '组织机构' }
                },
                {
                    path: '/company',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/company.vue'),
                    meta: { title: '公司列表' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/user.vue'),
                    meta: { title: '用户列表' }
                },
                {
                    path: '/dict',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/dict.vue'),
                    meta: { title: '字典列表' }
                },
                {
                    path: '/dictItem',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/dictItem.vue'),
                    meta: { title: '字典项列表' }
                },
                {
                    path: '/role',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/role.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/unitModel',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/unitModel.vue'),
                    meta: { title: '单元型号管理' }
                },
                {
                    path: '/commArea',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/commArea.vue'),
                    meta: { title: '分区管理' }
                },
                {
                    path: '/agreement',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/agreements.vue'),
                    meta: {title: '协议管理'}
                },

                {
                    path: '/buildings',
                    component: () => import(/* webpackChunkName: "company" */ '../components/page/building.vue'),
                    meta: { title: '建筑管理' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
