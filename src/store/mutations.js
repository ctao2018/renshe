import * as types from './mutation-types'
// 同步修改操作
const matutaions = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}
export default matutaions
