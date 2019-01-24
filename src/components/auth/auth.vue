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
export default {
  data () {
    return {
      showloading: true
    }
  },
  created () {
    this.zfbAuth()
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
