<template>
    <div class="guideDetail">
      <mheader title="常见问题" :morei="morei" v-if="showhd"></mheader>
      <div class="gdbx" :class="{nohead: !showhd}">
        <h2 class="gdbxtit c3">{{gdxqList.articleTitle}}</h2>
        <div class="gdbxtop c9">
          <p>来源：{{gdxqList.source}}</p>
          <p>日期：{{gdxqList.createTime}}</p>
        </div>
        <div class="gdbxcont c6">
          <p v-html="gdxqList.answer"></p>
        </div>
      </div>
      <div class="jbbtom c9">办事指南仅供参考，如有疑问请参考当地人社官网</div>
    </div>
</template>

<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header'
import {queryDetailByTitleOrContent} from 'api/api'
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
    this._queryDetailByTitleOrContent()
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
          title: '常见问题'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 详细信息
    _queryDetailByTitleOrContent () {
      queryDetailByTitleOrContent({
        type: 'commonQuestion',
        id: this.id
      }).then((res) => {
        //console.log('res', res)
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
