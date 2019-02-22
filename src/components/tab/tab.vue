<template>
  <div class="tabbox">
    <tab class="tab" :line-width="2" :animate="animate" :custom-bar-width="barwidth" :active-color="selectColor" :default-color="defaltColor">
      <tab-item  v-for="(item,indexB) in list" :key="indexB" :selected="selB === indexB" @on-item-click="tabclickFn(indexB,item.id)">{{item.name || item.categoryName}}</tab-item>
    </tab>
    <div class="arrbx" @click="showSelFn()"><i class="dowmarr" :class="{active: selshow}"></i></div>
    <div class="selbig" v-if="selshow">
      <div class="selbg" @click="selbgFn()"></div>
      <div class="selbx">
        <ul class="selbxul clearfix">
          <li class="selbxli"  v-for="(item,index) in list" :key="index" @click="tapSel(index,item.categoryNo)" :class="{active: current === index}">{{item.name || item.categoryName}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {Tab, TabItem} from 'vux'
export default {
  props: {
    list: {
      type: Array,
      default: null
    },
    tabNum: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      selectColor: '#108EE9',
      defaltColor: '#333333',
      current: 0,
      selshow: false,
      animate: false,
      barwidth: '55px',
      indexB: 0,
      selB: 0,
      newdata: ''
    }
  },
  created () {
  },
  mounted () {
    this.newdata = this.tabNum
    this.current = Number(this.tabNum)
    this.selB = Number(this.tabNum)
  },
  methods: {
    tapSel (index, id) {
      this.current = index
      this.selB = index
      this.selshow = !this.selshow
      this.$emit('selId', id)
    },
    tabclickFn (indx, id) {
      this.selB = indx
      this.current = indx
      this.$emit('selId', id)
    },
    showSelFn () {
      this.selshow = !this.selshow
    },
    selbgFn () {
      this.selshow = false
    }
  },
  watch: {
    tabNum: {
      handler (oldval, newval) {
        this.current = Number(oldval)
        this.selB = Number(oldval)
        if (oldval < 0) {
          this.current = 0
          this.selB = 0
        }
      },
      deep: true
    }
  },
  components: {
    Tab,
    TabItem
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus" >

@import "~common/stylus/variable"
.tabbox
  position relative
  .tab
    position fixed
    top 90px
    left 0px
    width 100%
    z-index 999
    height 87px
    background-color #ffffff
    border-bottom 2px solid #eeeeee
    font-size 32px
    .vux-tab-container
      height 87px
    .vux-tab
      height 60px
      padding-top 27px
      .vux-tab-item
        line-height 35px
        font-size 32px
    .scrollable
      padding-bottom 0
  .vux-tab-wrap
    padding-top 0
  .arrbx
    position fixed
    right 0px
    top: 90px
    width 106px
    height 86px
    z-index 1002
    justify-content center
    display flex
    align-items center
    background-image: linear-gradient(90deg,rgba(255,255,255,0)0%,rgba(255,255,255,1)25%);
    .dowmarr
      width 26px
      height 16px
      background url("../../assets/images/nav_drop.png")
      background-size cover
      display inline-block
      margin-top 10px
      &.active
        background url("../../assets/images/nav_drop_pre.png")
        background-size cover
  .selbig
    position fixed
    left 0px
    right 0px
    bottom 0px
    top: 180px
    z-index 1002
    .selbg
      position absolute
      left 0px
      right 0px
      bottom 0px
      top: 0px
      z-index 2
      background rgba(0,0,0,.65)
    .selbx
      position absolute
      left 0px
      right 0px
      top: 0px
      z-index 3
      background-color #ffffff
      padding 30px 30px 10px
      max-height 900px
      overflow auto
      .selbxul
        margin-left -25px
        .selbxli
          float left
          margin-left 25px
          margin-bottom 25px
          color #333333
          font-size 28px
          border-radius 4px
          background-color #f5f5f5
          padding 20px 36px
          min-width 140px
          max-width 280px
          text-align center
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          &.active
            background-color #e1f2fe
            color: #108EE9
</style>
