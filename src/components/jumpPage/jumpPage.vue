<template>
    <div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import loading from 'base/loading/loading'
import {
  setToken
} from 'api/auth'
export default {
  data () {
    return {
      showloading: true,
    }
  },
  created () {
    //console.log(window.location.href)
    let tokArr = window.location.href.split('?toUrl=')
    if(tokArr[1]){
      let urlALL = decodeURIComponent(tokArr[1])
      let newArr = urlALL.split('?tok=')
      let tok =newArr[1]
      let urlT = newArr[0].replace(/http.+\/sbjccx/,"");
      console.log(urlT)
      if(tok){
        setToken(tok);
        this.$store.commit('SET_TOKEN', tok);
        this.$store.commit('SET_MAPBTN', false);
        this.$router.replace({path: urlT})
      }
    }
  },

  methods: {
    
  },
  components: {
    loading
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
 
</style>
