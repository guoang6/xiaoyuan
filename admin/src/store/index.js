import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)

const state = {
  commentnum: '',
  contentid: '',
  contentname:'',
  contentuserid:'',
  url:'http://localhost:8080'
}
const getters = {}
const mutations = {
  SET_CONTENTID(state, id) {
    state.contentid = id
  },
  SET_COMMENTNUM(state, num) {
    state.commentnum = num
  },
  SET_CONTENTINFO(state, data) {
    state.contentname = data.contentname
    state.contentuserid =data. contentuserid
  },

}
const actions = {
  setcontentid({ commit }, data) {
    commit('SET_CONTENTID', data)
  },
  setcommentnum({ commit }, data) {
    commit('SET_COMMENTNUM', data)
  },
  setcontentinfo({ commit }, data) {
    commit('SET_CONTENTINFO', data)
  },

}
export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: {
    user
  }

})


