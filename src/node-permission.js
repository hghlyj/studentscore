import router from './router/node-router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取token
import getPageTitle from '@/utils/get-page-title' //获取页面标题

NProgress.configure({ showSpinner: false }) // NProgress 配置

const whiteList = ['/login'] // 没有登录 重定向 白名单
router.beforeEach(async(to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 页面标题
    document.title = getPageTitle(to.meta.title)

    // 确认用户是否已登录
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            // 如果已登录，则重定向到主页
            next({ path: '/' })
            NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
        } else {
            // 判断用户是否通过getInfo获取了权限角色  
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                console.log('权限角色', store.getters.roles);
                next()
            } else {
                try {
                    //注意:角色必须是对象数组! 例如:['js']或['js'，'fdy']  
                    const { roles } = await store.dispatch('nodeuser/getInfo');
                    console.log(123456789, roles);
                    //根据角色生成可访问的路由图  

                    const accessRoutes = await store.dispatch('nodepermission/generateRoutes', roles);
                    //动态添加可访问路由
                    router.addRoutes(accessRoutes)
                        //破解方法，确保addRoutes完成  
                        //设置replace: true，这样导航就不会留下历史记录  
                    next({...to, replace: true })
                } catch (error) {
                    // 删除令牌，然后进入登录页面重新登录
                    console.log('错误清除token', error)

                    await store.dispatch('nodeuser/resetToken')
                    Message.error(error || 'Has Error')
                    next(`//login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free 登录白名单，直接去
            next()
        } else {
            console.log('没有权限重定向登录页面');
            // 其他没有访问权限的页面将被重定向到登录页面。  
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
    NProgress.done()
})

router.afterEach(() => {
    NProgress.done()
})