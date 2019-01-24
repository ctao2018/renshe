'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  EVN_CONFIG: '"dev"',
  authBackURL: '"http://192.168.3.138:9080/sbjccx/authback/"',
  // API_ROOT: '"http://localhost:9080/api/"',
})
