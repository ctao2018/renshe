<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" class="child-view"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="child-view"></router-view>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  data () {
    return {
      //transitionName: 'slide-left' // 默认动态路由变化为slide-right
    }
  },
  components: {
  },
//  watch: {
//    '$route' (to, from) {
//      const toDepth = to.path.split('/').length
//      const fromDepth = from.path.split('/').length
//      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
//    }
//  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #app {
    width: 100%;
    height: 100%;
    overflow: scroll;
   -webkit-overflow-scrolling: touch;
    position: absolute;
    left:0;
    top:0;
  }
  .child-view {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    position:absolute;
    transition: all .2s;
  }
  .fade-enter-active,.fade-leave-active{
    transition: all .2s ease;
  }
  .fade-ener,.fade-leave-active{
    opacity: 0;
  }
  /*.slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100px, 0);
    transform: translate(100px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-100px, 0);
    transform: translate(-100px, 0);
  }*/
  /*.slide-enter-active, .slide-leave-active {
    transition: all 0.3s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }*/
</style>
