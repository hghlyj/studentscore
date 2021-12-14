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
export const constantRoutes = [


]

/**node
 * asyncRoutes  
 *需要根据用户角色动态加载的路由  
 */
export const asyncRoutes = [


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