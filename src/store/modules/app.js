import * as types from './mutation-types'
import {
  getToken
} from '@/api/auth'
const matutaions = {
  state: {
    token: getToken(),
    curUrl:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_CURURL: (state, curUrl) => {
      state.curUrl = curUrl
    },
  },
  actions: {

  }
}
export default matutaions
