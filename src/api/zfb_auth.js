import {baseURL} from '@/api/conflg'
import {getGrantInfoParam} from '@/api/api'

export function zfbAuthFn () {
  console.log(baseURL)
  getGrantInfoParam({
    registePlat: 1,
    identityType: 1
  }).then((res) => {
    console.log('res', res)
  }).catch((res) => {
    console.log('error', res)
  })
  return baseURL
}
