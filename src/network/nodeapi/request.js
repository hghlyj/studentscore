import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: 'http://192.168.0.162:3000/',
    timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(

    config => {
        //if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + window.sessionStorage.getItem('token')
            //}
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const { data, status } = response
        // 请求成功返回data信息
        if (status >= 200 && status < 300) {
            return data
        }
    },
    error => {
        // let { status } = error.response
        // let message = 'req:' + error.message

        // if (status == 400) {}
        // if (status == 401) {
        //     router.replace({ name: 'login' })
        // }

        // Message({
        //     message,
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

export default service