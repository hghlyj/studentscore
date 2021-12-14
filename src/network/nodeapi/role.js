import service from './request'


export function getRole(params) {
    let { search, page, pagesize } = params
    // const searchstudent = []
    // let { name } = search
    // searchstudent.push({ 'value': name, 'value1': 'name=' + name + '&' })
    // let src = ''
    // searchstudent.forEach(item => {
    //     if (item.value != "") {
    //         src += item.value1
    //     }
    // })
    if (name != '') {
        return service.get('/role?' + src + 'page=' + page + '&pagesize=' + pagesize)
    }
    return service.get('/role?page=' + page + '&pagesize=' + pagesize)
}

export function addRole(params) {
    return service.post('/role', params)
}
export function removeRole(id) {
    return service.delete('/role/' + id)
}

export function getRoleItem(id) {
    return service.get('/role/' + id)
}

export function editRoleItem(id, data) {
    return service.put('/role/' + id, data)
}

export function getFilterRoleList(id) {
    return service.get('/roles/depar-role?id=' + id)
}

export function getDeparrole(id) {
    return service.get('/depar-role?id=' + id)
}