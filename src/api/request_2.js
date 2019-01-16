import axios from 'axios'
import qs from 'qs'

//axios.defaults.baseURL = process.env.API_ROOT

if (process.env.NODE_ENV === 'testing') {
  axios.defaults.baseURL = 'https://100.100.100.102/test' // 测试
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://100.100.100.103/prod' // 线上环境
} else {
  axios.defaults.baseURL = 'http://192.168.3.64:8764/' // 本地测试
}
axios.defaults.timeout = 10000

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
