import router from "../router"

export function AfterLogin(data) {
    window.sessionStorage.setItem('token', data.access)
    window.sessionStorage.setItem('refresh', data.refresh)
    window.sessionStorage.setItem('username', data.username)
    return true
}

export function CheckLogin() {
    if (window.sessionStorage.getItem('token')) {
        return true
    }
}

export function LoginOut() {
    window.sessionStorage.clear()
    router.replace({ name: 'login' })
    return true
}

export function UserInfo() {
    let username = window.sessionStorage.getItem('username')
    return { username }
}

export function getHeader() {
    let token = window.sessionStorage.getItem('token')
    return { 'Authorization': 'Bearer ' + token }
}