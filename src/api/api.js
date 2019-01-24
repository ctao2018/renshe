import request from '@/api/request'

export function getAreaInfoByCityCode (query) {
  return request({
    url: 'dist/whArea/getAreaInfoByCityCode',
    method: 'get',
    params: query
  })
}
export function formalTransactInstitution (query) {
  return request({
    url: 'dist/formalTransactInstitution/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalTransactInstitutiondt (id) {
  return request({
    url: 'dist/formalTransactInstitution/' + id,
    method: 'get'
  })
}
export function formalFixDrugstore (query) {
  return request({
    url: 'dist/formalFixDrugstore/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalFixDrugstoredt (id) {
  return request({
    url: 'dist/formalFixDrugstore/' + id,
    method: 'get'
  })
}
export function formalFixHospitals (query) {
  return request({
    url: 'dist/formalFixHospitals/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalFixHospitalsdt (id) {
  return request({
    url: 'dist/formalFixHospitals/' + id,
    method: 'get'
  })
}
export function formalInsuranceDrugsInfo (query) {
  return request({
    url: 'dist/formalInsuranceDrugsInfo/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalInsuranceDrugsInfodt (id) {
  return request({
    url: 'dist/formalInsuranceDrugsInfo/' + id,
    method: 'get'
  })
}
export function formalBusinessGuide (query) {
  return request({
    url: 'dist/formalBusinessGuide/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalBusinessGuideca (query) {
  return request({
    url: 'dist/formalBusinessGuide/queryGuideCategory',
    method: 'get',
    params: query
  })
}
export function formalBusinessGuidedt (id) {
  return request({
    url: 'dist/formalBusinessGuide/getGuideContentById/' + id,
    method: 'get'
  })
}
export function formalCommonQuestion (query) {
  return request({
    url: 'dist/formalCommonQuestion/pageByParam',
    method: 'get',
    params: query
  })
}
export function queryCommonQusCategory (query) {
  return request({
    url: 'dist/formalCommonQuestion/queryCommonQusCategory',
    method: 'get',
    params: query
  })
}
export function queryOpenCityCodeInfoByCityName (query) {
  return request({
    url: 'dist/whArea/queryOpenCityCodeInfoByCityName',
    method: 'get',
    params: query
  })
}
export function queryOpenModuleInfo (query) {
  return request({
    url: 'dist/whArea/queryOpenModuleInfo',
    method: 'get',
    params: query
  })
}
export function queryAllOpenCityInfo (query) {
  return request({
    url: 'dist/whArea/queryAllOpenCityInfo',
    method: 'get',
    params: query
  })
}
export function queryTitleOrContentByKey (query) {
  return request({
    url: 'dist/formalCommonQuestion/queryTitleOrContentByKey',
    method: 'get',
    params: query
  })
}
export function queryDetailByTitleOrContent (query) {
  return request({
    url: 'dist/formalCommonQuestion/queryDetailByTitleOrContent',
    method: 'get',
    params: query
  })
}
export function getGrantInfoParam (query) {
  return request({
    url: 'auth/jwt/guest/getGrantInfoParam',
    method: 'get',
    params: query
  })
}
export function getTokenByCode(obj) {
  return request({
  url: 'auth/jwt/guest/getTokenByCode',
  method: 'post',
  data: obj
  });
}