<template>
    <div class="guideDetail">
      <mheader title="办事指南" :morei="morei" v-if="showhd"></mheader>
      <div class="gdbx" :class="{nohead: !showhd}">
        <h2 class="gdbxtit c3">{{gdxqList.title}}</h2>
        <div class="gdbxtop c9">
          <p>来源：{{gdxqList.source}}</p>
          <p>日期：{{gdxqList.createTime}}</p>
        </div>
        <div class="gdbxcont c6">
          <p>一、申请条件</p>
          <p v-html="gdxqList.businessCondition"></p>
          <p>二、材料清单</p>
          <p v-html="gdxqList.detailedList"></p>
          <p>三、办事流程</p>
          <p v-html="gdxqList.businesssProcess"></p>
        </div>
      </div>
      <div class="jbbtom c9">办事指南仅供参考，如有疑问请参考当地人社官网</div>
    </div>
</template>

<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header'
import {formalBusinessGuidedt} from 'api/api'
export default {
  data () {
    return {
      showhd: true,
      morei: true,
      id: '',
      gdxqList: []
    }
  },
  created () {
    this.id = this.$route.params.id
    this._formalBusinessGuidedt()
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },

  methods: {
    // 是否显示头部
    titFn () {
      this.showhd = false
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '办事指南'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 办事指南详细信息
    _formalBusinessGuidedt () {
      formalBusinessGuidedt(this.id).then((res) => {
        console.log('res', res)
        this.gdxqList = res.data.data
        this.gdxqList.createTime = this.gdxqList.createTime.substring(0, 10)
      }).catch((res) => {
        console.log('error', res)
      })
    }
  },
  components: {
    mheader
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .guideDetail
    background-color #ffffff
    .gdbx
      padding:108px 32px 108px
      background-color #ffffff
      &.nohead
        padding-top 30px
      .gdbxtit
        font-size 48px
        font-weight 500
        line-height 67px
        margin-bottom 32px
      .gdbxtop
        font-size 28px
        line-height 40px
        margin-bottom 32px
      .gdbxcont
        font-size 36px
        line-height 50px
        p
          margin-bottom 50px
          line-height 50px
    .jbbtom
      position fixed
      background-color #f5f5f5
      z-index 999
      left 0px
      right 0px
      bottom 0px
      height 108px
      text-align center
      line-height 108px
      font-size 24px
</style>
