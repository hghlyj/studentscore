const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,




    token: state => state.nodeuser.token,
    // avatar: state => state.nodeuser.avatar,
    avatar: state => "127.0.0.1:3000/static/images/awafile/130429199906106000.jpg",
    name: state => state.nodeuser.name,
    introduction: state => state.nodeuser.introduction,
    roles: state => state.nodeuser.roles,

    SubtratMarksLists: state => state.scorelist.SubtratMarksLists,
    AwardedMarksLists: state => state.scorelist.AwardedMarksLists,
    rdedMarksLists: state => state.scorelist.rdedMarksLists,
    total: state => state.scorelist.total,

    permission_routes: state => state.nodepermission.routes,


    errorLogs: state => state.errorLog.logs
}
export default getters