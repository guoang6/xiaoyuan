const state = {
    islog: true,
    islogin: true,
    isclose: false,
    uinfo: JSON.parse(localStorage.getItem("uinfo")) || {},//先去localStorage中获取数据
    unread: 0

}
const getters = {

}
const mutations = {
    SET_USERINFO(state, uinfo) {
        console.log(uinfo)
        state.uinfo = uinfo,
            localStorage.setItem('uinfo', JSON.stringify(uinfo))
    },
    CHANGE_ISLOG(state) {
        state.islog = !state.islog
    },
    DELETE_USERINFO(state) {
        window.localStorage.removeItem('uinfo')
        window.localStorage.removeItem('admin_jwt_token')
    },
    SET_TOKEN(state, data) {
        state.token = data
        window.localStorage.setItem('admin_jwt_token', state.token);
    },
    JOIN() {
        state.islogin = !state.islogin;
    },
    CLOSE() {
        state.isclose = !state.isclose;
    },
    SET_UNREAD(state, num) {
        state.unread = num
    },
}
const actions = {
    setUserInfo({ commit }, data) {
        commit('SET_USERINFO', data)
    },
    changeislog({ commit }) {
        commit('CHANGE_ISLOG')
    },
    join({ commit }) {
        commit('JOIN')
    },
    close({ commit }) {
        commit('CLOSE')
    },
    deleteuserinfo({ commit }) {
        commit('DELETE_USERINFO')
    },
    setToken({ commit }, data) {
        commit('SET_TOKEN', data)
    },
    setunread({ commit }, data) {
        commit('SET_UNREAD', data)
    },
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}