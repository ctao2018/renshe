import * as types from './mutation-types'
import {
  getToken
} from '@/api/auth'
const matutaions = {
  state: {
    token: getToken(),
    curUrl:'',
    mapbtn:true,
    positionJW:{}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_CURURL: (state, curUrl) => {
      state.curUrl = curUrl
    },
    SET_MAPBTN: (state, flag) => {
      state.mapbtn = flag
    },
    SET_POSITIONJW: (state, positionJW) => {
      state.positionJW = positionJW
    },
  },
  actions: {

  }
}
export default matutaions
