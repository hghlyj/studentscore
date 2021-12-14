import service from './request'


export function getStudents(params) {
    let { search, page, page_size } = params
    const searchstudent = []
    let { name, market, dormnumber, sex, cls_id, depar_id, js_id, fdy_id } = search
    searchstudent.push({ 'value': name, 'value1': 'name=' + name + '&' })
    searchstudent.push({ 'value': market, 'value1': 'market=' + market + '&' })
    searchstudent.push({ 'value': dormnumber, 'value1': 'dormnumber=' + dormnumber + '&' })
    searchstudent.push({ 'value': sex, 'value1': 'sex=' + sex + '&' })
    searchstudent.push({ 'value': cls_id, 'value1': 'cls_id=' + cls_id + '&' })
    searchstudent.push({ 'value': depar_id, 'value1': 'depar_id=' + depar_id + '&' })
    searchstudent.push({ 'value': js_id, 'value1': 'js_id=' + js_id + '&' })
    searchstudent.push({ 'value': fdy_id, 'value1': 'fdy_id=' + fdy_id + '&' })
    let src = ''
    searchstudent.forEach(item => {
        if (item.value || typeof(item.value) == 'number') {
            src += item.value1
        }
    })
    console.log('搜索:', src)
    if ((name || market || dormnumber || typeof(sex) == 'number' || cls_id || depar_id || js_id || fdy_id) && (page && page_size)) {
        console.log(456789)
        return service.get('/stu?' + src + 'page=' + page + '&pagesize=' + page_size)
    } else if (name != '' || market != '' || dormnumber != '' || typeof(sex) == 'number' || cls_id != '' || depar_id != '') {
        return service.get('/stu?' + src)
    } else if (page && page_size) {
        return service.get('/stu?page=' + page + '&pagesize=' + page_size)
    } else {
        return service.get('/stu')
    }

}
export function addStudents(params) {
    return service.post('/stu', params)
}
export function removeStudents(id) {
    return service.delete('/stu/' + id)
}

export function getStudentsItem(id) {
    return service.get('/stu/' + id)
}

export function editStudentsItem(id, params) {
    return service.put('/stu/' + id, params)
}