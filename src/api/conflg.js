export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}

export const ERR_OK = 0

// 服务器地址
let baseURL = ''
if (process.env.NODE_ENV === 'testing') {
  baseURL = 'http://120.77.47.227/sbjccx/' // 测试
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://www.szyibei.com/sbjccx/' // 线上环境
} else {
  baseURL = 'http://192.168.3.138:9080/sbjccx/' // 本地测试
}

export {
  baseURL
}
