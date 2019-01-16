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
  baseURL = 'https://100.100.100.102/test' // 测试
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://100.100.100.103/prod' // 线上环境
} else {
  baseURL = 'https://100.100.100.101/local' // 本地测试
}

export {
  baseURL
}
