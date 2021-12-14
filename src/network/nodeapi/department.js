import service from './request'


export function getallDepartment(content) {

    if (content) {
        const searchstudent = []
        let { depar_id, role } = content
        searchstudent.push({ 'value': depar_id, 'value1': 'depar_id=' + depar_id + '&' })
        searchstudent.push({ 'value': role, 'value1': 'role=' + role + '&' })
        let src = ''
        searchstudent.forEach(item => {
            if (item.value != "" || typeof(item.value) == 'number') {
                src += item.value1
            }
        })
        return service.get('/depar?' + src)
    } else {
        return service.get('/depar')
    }
}


export function getdyalljs(id) {

    return service.get('/dy-js?id=' + id)
}

export function getdyallbj(id) {

    return service.get('/dy-bj?id=' + id)
}


export function getDepartment(params) {
    let { page, page_size } = params
    return service.get('/depar?page=' + page + '&pagesize=' + page_size)
}

export function addDepartment(params) {
    console.log(params, 123)
    return service.post('/depar', params)
}

export function removeDepartment(id) {
    return service.delete('/depar/' + id)
}

export function getDepartmentItem(id) {
    return service.get('/depar/' + id)
}

export function editDepartmentItem(id, params) {
    return service.put('/depar/' + id, params)
}