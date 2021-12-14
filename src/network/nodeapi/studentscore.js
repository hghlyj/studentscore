import service from './request'

//获取响应适度的描述信息    （过滤功能）
export function GetPutIntoEffect(id) {
    return service.get('/putintoeffect?id=' + id)
}

//加分模板
export function GetAwardedMarksall() {
    return service.get('/awa')
}

export function GetAwardedMarkss(content1) {
    const { query, page, page_size } = content1
    const search = []
    let { content } = query
    search.push({ 'value': content, 'value1': 'content=' + content + '&' })
    let src = ''
    search.forEach(item => {
        if (item.value == "" || item.value == null) {
            return;
        } else {
            src += item.value1
        }
    })
    if (content != '' && (page && page_size)) {
        return service.get('/awa?' + src + 'page=' + page + '&pagesize=' + page_size)
    } else if (page && page_size) {
        return service.get('/awa?page=' + page + '&pagesize=' + page_size)
    } else {
        return service.get('/awa')
    }
}
export function GetAwardedMarkssOne(id) {
    return service.get('/awa/' + id)
}

export function CreateAwardedMarkss(data) {
    return service.post('/awa', data)
}

export function UpdateAwardedMarkss(id, data) {
    return service.put('/awa/' + id, data)
}

export function DeleteAwardedMarkss(id) {
    return service.delete('/awa/' + id, )
}



//扣分

export function GetSubtractMarksall() {
    return service.get('/sub')

}
export function GetSubtractMarks(content1) {
    const { query, page, page_size } = content1
    const search = []
    let { Disciplinetype, content, expel } = query
    search.push({ 'value': Disciplinetype, 'value1': 'Disciplinetype=' + Disciplinetype + '&' })
    search.push({ 'value': content, 'value1': 'content=' + content + '&' })
    search.push({ 'value': expel, 'value1': 'expel=' + expel + '&' })
    let src = ''
    search.forEach(item => {
        if (item.value || typeof(item.value) == 'boolean' || typeof(item.value) == 'number') {
            src += item.value1
        }
    })
    console.log('搜索', query)
    if ((Disciplinetype || content || typeof(expel) == 'boolean') && (page && page_size)) {
        return service.get('/sub?' + src + 'page=' + page + '&pagesize=' + page_size)
    } else if (page && page_size) {
        return service.get('/sub?page=' + page + '&pagesize=' + page_size)
    } else {
        return service.get('/sub')
    }

}


export function GetSubtractMarksOne(id) {
    return service.get('/sub/' + id)
}

export function CreateSubtractMarks(data) {
    return service.post('/sub', data)
}

export function UpdateSubtractMarks(id, data) {
    return service.put('/sub/' + id, data)
}

export function DeleteSubtractMarks(id) {
    return service.delete('/sub/' + id, )
}



//加减分查询
export function GetMarksLists(content1) {
    const { query, page, page_size } = content1
    const search = []
    console.log('查询参数', query)
    let { state, name, depar, cls, lecturer, counsellor, market, status, js_id, fdy_id, depar_id, cls_id, sex, dormnumber, disciplinetype, content, data } = query
    search.push({ 'value': name, 'value1': 'name=' + name + '&' })
        // search.push({ 'value': depar, 'value1': 'depar=' + depar + '&' })
        // search.push({ 'value': cls, 'value1': 'cls=' + cls + '&' })
        // search.push({ 'value': lecturer, 'value1': 'lecturer=' + lecturer + '&' })
        // search.push({ 'value': counsellor, 'value1': 'counsellor=' + counsellor + '&' })
    search.push({ 'value': market, 'value1': 'market=' + market + '&' })
    search.push({ 'value': state, 'value1': 'state=' + state + '&' })
    search.push({ 'value': status, 'value1': 'status=' + status + '&' })
    search.push({ 'value': js_id, 'value1': 'js_id=' + js_id + '&' })
    search.push({ 'value': fdy_id, 'value1': 'fdy_id=' + fdy_id + '&' })
    search.push({ 'value': depar_id, 'value1': 'depar_id=' + depar_id + '&' })
    search.push({ 'value': cls_id, 'value1': 'cls_id=' + cls_id + '&' })
    search.push({ 'value': sex, 'value1': 'sex=' + sex + '&' })
    search.push({ 'value': dormnumber, 'value1': 'dormnumber=' + dormnumber + '&' })
    search.push({ 'value': disciplinetype, 'value1': 'disciplinetype=' + disciplinetype + '&' })
    search.push({ 'value': content, 'value1': 'content=' + content + '&' })
    search.push({ 'value': data, 'value1': 'data=' + data + '&' })
    let src = ''

    if (state) {
        //有违纪的src
        // let { name } = query
        // search.push({ 'value': name, 'value1': 'name=' + name + '&' })

    } else {
        //没有违纪的src
        // let { name } = query
        // search.push({ 'value': name, 'value1': 'name=' + name + '&' })

    }
    search.forEach(item => {
        if (item.value || typeof(item.value) == 'boolean' || typeof(item.value) == 'number') {
            src += item.value1
        }
    })
    if ((data || content || disciplinetype || dormnumber || cls_id || typeof(sex) == 'boolean' || typeof(state) == 'boolean' || typeof(state) == 'number') || (typeof(status) == 'number' || market || counsellor || lecturer || depar || name || js_id || fdy_id) && (page && page_size)) {
        console.log(src)
        return service.get('/list?' + src + 'page=' + page + '&pagesize=' + page_size)
    } else {
        return service.get('/list?page=' + page + '&pagesize=' + page_size)
    }
}

export function GetScorelistOne(id) {
    return service.get('/list/' + id)
}

export function CreateMarksLists(content) {
    return service.post('/list', content)
}

//单个状态   局部修改
export function EditMarksLists(id, content) {
    console.log(content, 121212);
    return service.put('/list/' + id, content)
}