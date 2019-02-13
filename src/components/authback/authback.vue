<template>
    <div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
// import {authBackURL} from 'api/conflg'
import {getTokenByCode} from 'api/api'
import { setToken } from 'api/auth'
import loading from 'base/loading/loading'
import { saveSearch } from 'api/cache' // 引用本地存储js
import storage from 'good-storage' // 引入good-storage包
export default {
  data () {
    return {
      showloading: true
    }
  },
  created () {
    this.getCode()
    // let curUrl = storage.get('tobackUrl')
    // console.log('最后返回地址', curUrl[0])
  },

  methods: {
    getCode() {
      let url = decodeURI(location.search)
      let theRequest = new Object()
      if (url.indexOf('?') !== -1) {
        let str = url.substr(1);
        let strs = str.split('&');
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
        }
      }
     // console.log(theRequest)
      if (theRequest.auth_code) {
        this._getTokenByCode(theRequest.auth_code)
      }
    },
    _getTokenByCode(code) {
      getTokenByCode({
        appClient: '',
        code: code,
        identityType: 1,
        mac: '',
        registePlat: 1
      }).then((res) => {
        console.log('getTokenByCode', res)
        if (res.data.code === 0){
          if(res.data.data){
            setToken(res.data.data);
            this.$store.commit('SET_TOKEN', res.data.data);
            let curUrl = storage.get('tobackUrl')
            this.$router.replace({path: curUrl[0]})
           //window.location.href = this.$store.getters.curUrl
          }
        } else {
          this.$vux.toast.text('授权失败，请重试!', 'middle')
        }
      }).catch((res) => {
        console.log('error', res)
      })
    }
  },
  components: {
    loading
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
 .weui-toast__content
    font-size 26px
</style>
