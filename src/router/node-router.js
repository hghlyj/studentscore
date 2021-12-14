import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/layout'




/**node
 * constantRoutes
 *没有权限要求的基本页面  
 *所有的角色都可以访问  
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/node-view/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () =>
            import ('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            component: () =>
                import ('views/dashboard/index'),
            name: 'Dashboard',
            meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
        }]
    },

]

/**node
 * asyncRoutes  
 *需要根据用户角色动态加载的路由  
 */
export const asyncRoutes = [{
        path: '/department',
        component: Layout,
        redirect: '/department/index',
        children: [{
            path: 'index',
            name: 'Department',
            component: () =>
                import ('views/node-view/DepartmentList'),
            meta: { title: '部门', icon: 'dashboard', affix: false, roles: ['admin'] }
        }, ]
    },

    // {
    //     path: '/role',
    //     component: Layout,
    //     redirect: '/role/index',
    //     children: [{
    //         path: 'index',
    //         name: 'role',
    //         component: () =>
    //             import ('views/node-view/RoleList'),
    //         meta: { title: '角色', icon: 'dashboard', affix: false, roles: ['admin'] }
    //     }, ]
    // },

    {
        path: '/adminuser',
        component: Layout,
        redirect: '/adminuser/index',
        children: [{
            path: 'index',
            name: 'adminuser',
            component: () =>
                import ('views/node-view/AdminuserList'),
            meta: { title: '管理员', icon: 'dashboard', affix: false, roles: ['admin'] }
        }, ]
    },

    // {
    //     path: '/classlist',
    //     component: Layout,
    //     redirect: '/classlist/index',
    //     children: [{
    //         path: 'index',
    //         name: 'ClassList',
    //         component: () =>
    //             import ('views/node-view/classList'),
    //         meta: { title: '班级', icon: 'dashboard', affix: false, roles: ['admin', 'js', 'fdy'] }
    //     }, ]
    // },
    {
        path: '/classlist2',
        component: Layout,
        redirect: '/classlist2/index',
        children: [{
            path: 'index',
            name: 'ClassList2',
            component: () =>
                import ('views/node-view/classList2'),
            meta: { title: '班级', icon: 'dashboard', affix: false, roles: ['admin', 'js', 'fdy'] }
        }, ]
    },

    {
        path: '/students',
        component: Layout,
        redirect: '/students/index',
        children: [{
            path: 'index',
            name: 'Students',
            component: () =>
                import ('views/node-view/Students'),
            meta: { title: '学生', icon: 'peoples', affix: false, roles: ['admin', 'js', 'fdy'] }
        }, ]
    },

    {
        path: '/studentScore',
        component: Layout,
        redirect: '/studentScore/Index',
        alwaysShow: true,
        name: 'studentScore',
        meta: {
            title: '综合积分管理',
            icon: 'lock',
            roles: ['admin', 'dc', 'js', 'fdy'],
        },

        children: [{
                path: 'Index',
                component: () =>
                    import ('views/node-view/StudentScore/index'),
                name: 'Index',
                meta: {
                    title: '综合积分制度',
                    roles: ['admin', 'js', 'fdy', 'dc']
                }
            },

            {
                path: 'Fdyawa',
                component: () =>
                    import ('views/node-view/StudentScore/fdyawa.vue'),
                name: 'Fdyawa',
                meta: {
                    title: '导员加分审核',
                    roles: ['admin', 'fdy']
                },

            },
            {
                path: 'Fdysub',
                component: () =>
                    import ('views/node-view/StudentScore/fdysub.vue'),
                name: 'Fdysub',
                meta: {
                    title: '导员减分审核',
                    roles: ['admin', 'fdy']
                },

            },

            {
                path: 'Dcawa',
                component: () =>
                    import ('views/node-view/StudentScore/dcawa.vue'),
                name: 'Dcawa',
                meta: {
                    title: '督察加分审核',
                    roles: ['admin', 'dc']
                },

            },
            {
                path: 'Dcsub',
                component: () =>
                    import ('views/node-view/StudentScore/dcsub.vue'),
                name: 'Dcsub',
                meta: {
                    title: '督察减分审核',
                    roles: ['admin', 'dc']
                },

            },
            {
                path: 'jsshow',
                component: () =>
                    import ('views/node-view/StudentScore/jsshow'),
                name: 'jsshow',
                meta: {
                    title: '讲师查看',
                    roles: ['admin', 'js']
                },

            },

            {
                path: 'Edit',
                component: () =>
                    import ('views/node-view/StudentScore/Edit'),
                name: 'Edit',
                meta: {
                    title: '学生加/减分',
                    roles: ['admin', 'fdy', 'dc', 'js']
                },

            },

        ]
    },
]


const createRouter = () => new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router