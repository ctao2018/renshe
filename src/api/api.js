import request from '@/api/request'

export function getAreaInfoByCityCode (query) {
  return request({
    url: 'whArea/getAreaInfoByCityCode',
    method: 'get',
    params: query
  })
}
export function formalTransactInstitution (query) {
  return request({
    url: 'formalTransactInstitution/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalTransactInstitutiondt (id) {
  return request({
    url: 'formalTransactInstitution/' + id,
    method: 'get'
  })
}
export function formalFixDrugstore (query) {
  return request({
    url: 'formalFixDrugstore/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalFixDrugstoredt (id) {
  return request({
    url: 'formalFixDrugstore/' + id,
    method: 'get'
  })
}
export function formalFixHospitals (query) {
  return request({
    url: 'formalFixHospitals/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalFixHospitalsdt (id) {
  return request({
    url: 'formalFixHospitals/' + id,
    method: 'get'
  })
}
export function formalInsuranceDrugsInfo (query) {
  return request({
    url: 'formalInsuranceDrugsInfo/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalInsuranceDrugsInfodt (id) {
  return request({
    url: 'formalInsuranceDrugsInfo/' + id,
    method: 'get'
  })
}
export function formalBusinessGuide (query) {
  return request({
    url: 'formalBusinessGuide/pageByParam',
    method: 'get',
    params: query
  })
}
export function formalBusinessGuideca (query) {
  return request({
    url: 'formalBusinessGuide/queryGuideCategory',
    method: 'get',
    params: query
  })
}
export function formalBusinessGuidedt (id) {
  return request({
    url: 'formalBusinessGuide/getGuideContentById/' + id,
    method: 'get'
  })
}
export function formalCommonQuestion (query) {
  return request({
    url: 'formalCommonQuestion/pageByParam',
    method: 'get',
    params: query
  })
}
export function queryCommonQusCategory (query) {
  return request({
    url: 'formalCommonQuestion/queryCommonQusCategory',
    method: 'get',
    params: query
  })
}
export function queryOpenCityCodeInfoByCityName (query) {
  return request({
    url: 'whArea/queryOpenCityCodeInfoByCityName',
    method: 'get',
    params: query
  })
}
export function queryOpenModuleInfo (query) {
  return request({
    url: 'whArea/queryOpenModuleInfo',
    method: 'get',
    params: query
  })
}
export function queryAllOpenCityInfo (query) {
  return request({
    url: 'whArea/queryAllOpenCityInfo',
    method: 'get',
    params: query
  })
}
export function queryTitleOrContentByKey (query) {
  return request({
    url: 'formalCommonQuestion/queryTitleOrContentByKey',
    method: 'get',
    params: query
  })
}
