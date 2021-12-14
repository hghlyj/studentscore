import { GetMarksLists, EditMarksLists } from "network/nodeapi/studentscore";



const state = {
    // SubtratMarksLists: [],
    // AwardedMarksLists: [],
    rdedMarksLists: [],
    tratqueryInfo: [],
    total: null,
}

const mutations = {
    SET_rdedMarksLists: (state, rdedMarksLists) => {
        state.rdedMarksLists = rdedMarksLists
    },
    SET_tratqueryInfo: (state, tratqueryInfo) => {
        state.tratqueryInfo = tratqueryInfo
    },
    SET_total: (state, total) => {
        console.log(11111111, total)
        state.total = total
    },

    // SET_SubtratMarksLists: (state, SubtratMarksLists) => {
    //     state.SubtratMarksLists = SubtratMarksLists
    // },

    // SET_AwardedMarksLists: (state, AwardedMarksLists) => {
    //     state.AwardedMarksLists = AwardedMarksLists
    // },
}

const actions = {
    GettratMarksLists: async({ commit, state }, tratqueryInfo) => {
        console.log(state, 456, tratqueryInfo, state.tratqueryInfo)
        let res = []
        if (!tratqueryInfo) {
            res = await GetMarksLists(state.tratqueryInfo);
        } else {
            res = await GetMarksLists(tratqueryInfo);
            commit('SET_tratqueryInfo', tratqueryInfo)
        }

        console.log("加/减分数据：", res, tratqueryInfo);
        if (res.code == 200) {
            commit('SET_rdedMarksLists', res.data)
            console.log(res.count, 4444444444444444)
            commit('SET_total', res.count)
            console.log("获取数据成功");
        } else {
            console.log("获取数据失败");
        }
    },

    EditMarksLists: async({ commit, dispatch }, content) => {
        const id = content.id
        delete content.id
        const res = await EditMarksLists(id, content);
        if (res.code == 200) {
            dispatch('GettratMarksLists')
            return res
        } else {
            console.log('修改数据失败')
        }
    },
    // GetSubtratMarksLists: async({ commit }, SubtratqueryInfo) => {
    //     const res = await GetMarksLists(SubtratqueryInfo);
    //     console.log("----", res, SubtratqueryInfo);
    //     if (res.code == 200) {
    //         commit('SET_SubtratMarksLists', res.data)
    //         console.log("获取减分项数据成功");
    //     } else {
    //         console.log("获取减分项数据失败");
    //     }
    // },

    // GetAwardedMarksLists: async({ commit }, AwardedqueryInfo) => {
    //     const res = await GetMarksLists(AwardedqueryInfo);
    //     console.log("++++", res, AwardedqueryInfo);
    //     if (res) {
    //         commit('SET_AwardedMarksLists', res.data)
    //         this.$message.success("获取加分项数据成功");
    //     } else {
    //         this.$message.error("获取加分项数据失败");
    //     }
    // },


}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}