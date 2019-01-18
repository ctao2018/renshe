import * as types from './mutation-types'

const matutaions = {
  state: {
    token: '123'
  },

  mutations:{
    SET_TOKEN: (state, token) => {
      state.token = token
    },
  },
  actions: {

  }
}
export default matutaions
