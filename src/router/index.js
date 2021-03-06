import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/my-products'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/user-manager',
                    component: resolve => require(['../components/page/UserManager.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/user-detail',
                    component: resolve => require(['../components/page/UserDetail.vue'], resolve),
                    neta: {title: '用户详情'}
                },
                {
                    path: '/my-products',
                    component: resolve => require(['../components/page/MyProducts.vue'], resolve),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/user-order',
                    component: resolve => require(['../components/page/UserOrder.vue'], resolve),
                    meta: {title: '用户订单'}
                },
                {
                    path: '/order-detail',
                    component: resolve => require(['../components/page/OrderDetail.vue'], resolve),
                    meta: {title: '订单详情'}
                },
                {
                    path: '/products',
                    component: resolve => require(['../components/page/ProductList.vue'], resolve),
                    meta: { title: '产品管理' }
                },
                {
                    path: '/account',
                    component: resolve => require(['../components/page/Account.vue'], resolve),
                    meta: { title: '记账管理' }
                },
                {
                    path: '/store-detail',
                    component: resolve => require(['../components/page/StoreDetail.vue'], resolve),
                    meta: {title: '入库详情'}
                },
                {
                    path: '/group-products',
                    component: resolve => require(['../components/page/GroupProducts.vue'], resolve),
                    meta: { title: '产品组合' }
                },
                // {
                //     path: '/form',
                //     component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                //     meta: { title: '基本表单' }
                // },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: resolve => require(['../components/page/Markdown.vue'], resolve),
                //     meta: { title: 'markdown编辑器' }
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: resolve => require(['../components/page/Upload.vue'], resolve),
                //     meta: { title: '文件上传' }
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 权限页面
                //     path: '/permission',
                //     component: resolve => require(['../components/page/Permission.vue'], resolve),
                //     meta: { title: '权限测试', permission: true }
                // }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
