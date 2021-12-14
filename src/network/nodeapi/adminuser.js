import service from './request'


// 后台登录接口
export function Login(data) {
    return service.post('/login', data)
}
//展示教职工列表
export function GetAdminUser(content1) {
    const { query, page, page_size } = content1
    const search = []
    console.log('查询参数', query)
    let { name, depar_id, role, is_active } = query
    search.push({ 'value': name, 'value1': 'name=' + name + '&' })
    search.push({ 'value': depar_id, 'value1': 'depar_id=' + depar_id + '&' })
    search.push({ 'value': role, 'value1': 'role=' + role + '&' })
    search.push({ 'value': is_active, 'value1': 'is_active=' + is_active + '&' })
    let src = ''


    search.forEach(item => {
        if (item.value || typeof(item.value) == 'boolean' || typeof(item.value) == 'number') {
            src += item.value1
        }
    })
    if ((name || depar_id || role || typeof(is_active) == 'boolean') && (page && page_size)) {
        return service.get('/user?' + src + 'page=' + page + '&pagesize=' + page_size)
    } else if ((name || depar_id || role || typeof(is_active) == 'boolean')) {
        return service.get('/user?' + src)
    } else if (page && page_size) {
        return service.get('/user?page=' + page + '&pagesize=' + page_size)
    } else {
        return service.get('/user')
    }


}
//添加教职工
export function addAdminUser(params) {
    return service.post('/user', params)
}
//删除
export function removeAdminUser(id) {
    return service.delete('/user/' + id)
}

//获取单条
export function getAdminUserItem(id) {
    return service.get('/user/' + id)
}

//修改状态
export function editAdminUserItem(id, content) {
    return service.put('/user/' + id, content)
}

//修改教职工
export function editAdminUsersItem(id, content) {
    return service.put('/user/' + id, content)
}