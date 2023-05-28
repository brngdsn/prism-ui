import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SELECT_SERVICE: 'SELECT_SERVICE'
}

const state = {
  selectedService: null
}

const getters = {
  selectedService: state => {
    console.log('ojk')
    return state.selectedService
  }
}

const actions = {
  selectService ({ commit }, { service }) {
    return commit(types.SELECT_SERVICE, { service })
  },
  // async fetchResource ({commit}, config) {
  //   return api.get(config.url)
  //     .then(response => {
  //       commit(types.MUT_RESOURCE, {
  //         additive: config.additive,
  //         prop: config.prop,
  //         body: response.body,
  //         headers: response.headers
  //       })
  //       return response.body
  //     })
  //     .catch(e => Promise.reject(e))
  // }
}

const mutations = {
  [types.SELECT_SERVICE] (state, config) {
    state.selectedService = config.service
  },
  // [types.MUT_RESOURCE] (state, resource) {
  //   // state['pages'] = resource.headers.get('x-total-count')
  //   if (resource.additive) {
  //     state[resource.prop] = [...state[resource.prop], ...resource.body]
  //   } else {
  //     state[resource.prop] = resource.body
  //   }
  // }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
