import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
import {
  getToken,setToken
} from '@/api/auth'

const service = axios.create({
  baseURL: process.env.API_ROOT,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'}
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    if (store.getters.token) {
      config.headers['Authorization'] = getToken(); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    // config.data = config.data ? qs.stringify(config.data) : null
    return config
  },
  error => {
    return Promise.error(error)
  })

// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log('响应拦截器', response)
    let tokArr = router.currentRoute.fullPath.split('?tok=')
    let tok =tokArr[1]
    let urlT = tokArr[0]
    if(tok){
      setToken(tok);
      store.commit('SET_TOKEN', tok);
      router.replace({path:urlT});
    }else{
      if (response.data.code === 40301) {
        router.replace({
          path: '/auth/',
          query: { redirect: router.currentRoute.fullPath }
        })
        // return Promise.reject(response)
      } else {
        return Promise.resolve(response)
      }
    }
    
  },
  error => {
    console.log('error2', error)
    // if (error.response.status) {
    //   switch (error.response.status) {
    //     // 401: 未登录
    //     // 未登录则跳转登录页面，并携带当前页面的路径
    //     // 在登录成功后返回当前页面，这一步需要在登录页操作。
    //     case 401:
    //       router.replace({
    //         path: '/login',
    //         query: { redirect: router.currentRoute.fullPath }
    //       });
    //       break;
    //     // 403 token过期
    //     // 登录过期对用户进行提示
    //     // 清除本地token和清空vuex中token对象
    //     // 跳转登录页面
    //     case 403:
    //       Toast({
    //         message: '登录过期，请重新登录',
    //         duration: 1000,
    //         forbidClick: true
    //       });
    //       // 清除token
    //       localStorage.removeItem('token');
    //       store.commit('loginSuccess', null);
    //       // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
    //       setTimeout(() => {
    //         router.replace({
    //           path: '/login',
    //           query: {
    //             redirect: router.currentRoute.fullPath
    //           }
    //         });
    //       }, 1000);
    //       break;
    //     // 404请求不存在
    //     case 404:
    //       Toast({
    //         message: '网络请求不存在',
    //         duration: 1500,
    //         forbidClick: true
    //       });
    //       break
    //     // 其他错误，直接抛出错误提示
    //     default:
    //       Toast ({
    //         message: error.response.data.message,
    //         duration: 1500,
    //         forbidClick: true
    //       })
    //   }
    //   return Promise.reject(error.response)
    // }
    return Promise.reject(error.response)
  }
)

export default service
