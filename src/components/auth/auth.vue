<template>
    <div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {authBackURL} from 'api/conflg'
import {getGrantInfoParam} from 'api/api'
import loading from 'base/loading/loading'
import { saveSearch } from 'api/cache' // 引用本地存储js
import storage from 'good-storage' // 引入good-storage包
export default {
  data () {
    return {
      showloading: true,
      tobackUrl: 'tobackUrl',
    }
  },
  created () {
    this.zfbAuth()
    //console.log('redirect',this.$route.query.redirect)
    if(this.$route.query.redirect) {
      storage.remove('tobackUrl')
      let urlback = decodeURIComponent(this.$route.query.redirect)
      saveSearch(urlback, this.tobackUrl)
    }
    //this.$store.commit('SET_CURURL', this.$route.query.redirect)
  },

  methods: {
    zfbAuth() {
      console.log(authBackURL)
      getGrantInfoParam({
        registePlat: 1,
        identityType: 1
      }).then((res) => {
        //console.log('res', res)
        let backUrl = encodeURIComponent(authBackURL)
        let url = res.data.data.aplipayAuthUrl + '?app_id=' + res.data.data.appId + '&scope=auth_user,auth_base&redirect_uri=' + backUrl
        //console.log('href', url)
        window.location.href = url
        //this.$router.push({path: '/authback/'})
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
 
</style>
