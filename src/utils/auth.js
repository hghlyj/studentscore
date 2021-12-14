export function getToken() {
    return sessionStorage.getItem('token')
}

export function setToken(token) {
    console.log(token, 456)
    window.sessionStorage.setItem('token', token)
    return window.sessionStorage.setItem('token', token);
}

export function setId(id) {
    return window.sessionStorage.setItem('userid', id);
}

export function removeToken() {
    window.sessionStorage.removeItem('id')
    return window.sessionStorage.removeItem('token')
}