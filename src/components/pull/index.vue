<template >
  <div class="yo-scroll"
       :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}"
       @touchstart="touchStart($event)"
       @touchmove="touchMove($event)"
       @touchend="touchEnd($event)"
       @scroll="lodingdown ? undefined : onScroll($event)">
    <section class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
      <header class="pull-refresh">
        <slot name="pull-refresh">
          <div class="down-tip fs10 tc">
            <p class="mb10 c8">下拉可以刷新</p>
            <!--<span class="mr5">最后更新：</span>-->
            <!--<span>{{times}}</span>-->
          </div>
          <div class="up-tip fs10 tc">
            <p class="mb10 c8">释放立即刷新</p>
          </div>
          <div class="refresh-tip fs10 tc">
            <p class="mb10 c8">正在刷新数据中...</p>
          </div>
        </slot>
      </header>
      <slot></slot>
      <footer class="load-more">
        <slot name="load-more">
          <!--<load-more v-show="!lodingTxt" tip="正在加载更多的数据.."></load-more>-->
          <load-more v-show="lodingTxt" :show-loading="false" tip="暂无更多数据" background-color="#fbf9fe"></load-more>
        </slot>
      </footer>
    </section>
  </div>
</template>

<script>
import loading from 'base/loading/loading'
import { LoadMore } from 'vux'
export default {
  props: {
    offset: {
      type: Number,
      default: 60
    },
    enableInfinite: {
      type: Boolean,
      default: true
    },
    enableRefresh: {
      type: Boolean,
      default: true
    },
    onRefresh: {
      type: Function,
      default: undefined,
      required: false
    },
    onInfinite: {
      type: Function,
      default: undefined,
      require: false
    },
    tops: {
      type: Number,
      default: 0
    },
    lodingTxt: {
      type: Boolean,
      default: true
    },
    lodingdown: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      top: 0,
      state: 0,
      startY: 0,
      touching: false,
      infiniteLoading: false
    }
  },
  mounted () {
    this.top = this.tops
  },
  methods: {
    touchStart (e) {
      this.startY = e.targetTouches[0].pageY
      this.startScroll = this.$el.scrollTop || 0
      this.touching = true
    },
    touchMove (e) {
      if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
        return
      }
      let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
      if (diff > 0) e.preventDefault()
      this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)

      if (this.state === 2) { // in refreshing
        return
      }
      if (this.top >= this.offset) {
        this.state = 1
      } else {
        this.state = 0
      }
    },
    touchEnd (e) {
      if (!this.enableRefresh) return
      this.touching = false
      if (this.state === 2) { // in refreshing
        this.state = 2
        this.top = this.offset
        return
      }
      if (this.top >= this.offset) { // do refresh
        this.refresh()
      } else { // cancel refresh
        this.state = 0
        this.top = 0
      }
    },
    refresh () {
      this.state = 2
      this.top = this.offset
      this.onRefresh(this.refreshDone)
    },
    refreshDone () {
      this.state = 0
      this.top = 0
      this.onState()
    },
    infinite () {
      this.infiniteLoading = true
      this.onInfinite(this.infiniteDone)
    },
    infiniteDone () {
      this.infiniteLoading = false
    },
    onScroll (e) {
      if (!this.enableInfinite || this.infiniteLoading) {
        return
      }
      let outerHeight = this.$el.clientHeight
      let innerHeight = this.$el.querySelector('.inner').clientHeight
      let scrollTop = this.$el.scrollTop
      let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0
      let infiniteHeight = this.$el.querySelector('.load-more').clientHeight
      let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
      if (bottom < infiniteHeight) this.infinite()
    },
    onState () {
//      let hours = new Date().getHours()
//      let minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
//      let month = new Date().getMonth() + 1
//      let dates = new Date().getDate()
//      let times = '今天' + '   ' + hours + ':' + minutes
//      this.$store.dispatch('timeAction', times)
//      this.times = this.$store.getters.times
    }
  },
  components: {
    loading,
    LoadMore
  }
}
</script>
<style>
  .vux-loadmore .weui-loading{
    width: 30px;
    height: 30px;
  }
  .mb10{
    margin-bottom: 20px;
  }
  .tc{
    text-align: center;
  }
  .fs10 {
    font-size: 20px;
  }
  .cred{
    color: #d7092d;
  }
  .yo-scroll {
    position: absolute;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .yo-scroll .inner {
    position: absolute;
    top: -85px;
    width: 100%;
    transition-duration: 300ms;
    margin-top: 85px;
    margin-bottom: 10px;
  }
  .yo-scroll .pull-refresh {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yo-scroll.touch .inner {
    transition-duration: 0ms;
  }
  .yo-scroll.down .down-tip {
    display: block;
  }
  .yo-scroll.up .up-tip {
    display: block;
  }
  .yo-scroll.refresh .refresh-tip {
    display: block;
  }
  .yo-scroll .down-tip,
  .yo-scroll .refresh-tip,
  .yo-scroll .up-tip {
    display: none;
  }
  .yo-scroll .load-more {
    height: 1.5rem;
    line-height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
