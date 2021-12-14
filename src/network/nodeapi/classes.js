import service from './request'


export function getDeparcls(id) {
    // if (id) {
    return service.get('/depar-cls?id=' + id);
    // }
    // return service.get('/depar-cls')
}

export function getallClasses(id) {
    if (id) {
        return service.get('/cls')
    }
    return service.get('/cls')
}

export function getClasses(params) {
    let { search, page, page_size } = params
    const searchstudent = []
    let { name, depar_id, stage, sum, js_id, fdy_id } = search
    searchstudent.push({ 'value': name, 'value1': 'name=' + name + '&' })
    searchstudent.push({ 'value': depar_id, 'value1': 'depar_id=' + depar_id + '&' })
    searchstudent.push({ 'value': stage, 'value1': 'stage=' + stage + '&' })
    searchstudent.push({ 'value': sum, 'value1': 'sum=' + sum + '&' })
    searchstudent.push({ 'value': js_id, 'value1': 'js_id=' + js_id + '&' })
    searchstudent.push({ 'value': fdy_id, 'value1': 'fdy_id=' + fdy_id + '&' })
    let src = ''
    searchstudent.forEach(item => {
        if (item.value) {
            src += item.value1
        }
    })
    if (name || depar_id || stage || sum || js_id || fdy_id) {
        return service.get('/cls?' + src + 'page=' + page + '&pagesize=' + page_size)
    }
    return service.get('/cls?page=' + page + '&pagesize=' + page_size)
}

export function addClasses(params) {
    console.log(params);
    return service.post('/cls', params)
}
export function removeClasses(id) {
    return service.delete('/cls/' + id)
}

export function getClassesItem(id) {
    return service.get('/cls/' + id)
}

export function editClassesItem(id, params) {
    return service.put('/cls/' + id, params)
}