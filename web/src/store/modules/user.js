const state = {
    islog: true,
    islogin: true,
    isclose: false,
    userinfo: JSON.parse(localStorage.getItem("userinfo")) || {avatar:''},//先去localStorage中获取数据
    unread: 0

}
const getters = {

}
const mutations = {
    SET_USERINFO(state, userinfo) {
        console.log(userinfo)
        state.userinfo = userinfo,
            localStorage.setItem('userinfo', JSON.stringify(userinfo))
    },
    CHANGE_ISLOG(state) {
        state.islog = !state.islog
    },
    DELETE_USERINFO(state) {
        state.userinfo={avatar:''}
        window.localStorage.removeItem('userinfo')
        window.localStorage.removeItem('luffy_jwt_token')

    },
    SET_TOKEN(state, data) {
        state.token = data
        window.localStorage.setItem('luffy_jwt_token', state.token);
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