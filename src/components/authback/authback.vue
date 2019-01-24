<template>
    <div></div>
</template>

<script type="text/ecmascript-6">
import {authBackURL} from 'api/conflg'
import {getTokenByCode} from 'api/api'
import { setToken } from '@/api/auth'
export default {
  data () {
    return {
    }
  },
  created () {
    this.getCode()
    console.log(this.$store.getters.curUrl)
  },

  methods: {
    getCode() {
      let url = decodeURI(location.search)
      let theRequest = new Object()
      if (url.indexOf("?") != -1) {
              let str = url.substr(1);
              let strs = str.split("&");
              for ( let i = 0; i < strs.length; i++) {
                  theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
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
            this.$router.push({path: this.$store.getters.curUrl})
           //window.location.href = this.$store.getters.curUrl
          }
        } else {
          this.$vux.toast.text('授权失败，请重试!', 'middle')
        }
        
       // window.location.href = 
        // this.$router.push({path:decodeURIComponent(this.$route.query.redirect)})
      }).catch((res) => {
        console.log('error', res)
      })
    }
  },
  components: {
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
 
</style>
