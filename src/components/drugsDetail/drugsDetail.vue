<template>
    <div class="drugsDetail">
      <mheader title="医保药品目录" v-if="showhd"></mheader>
      <ul class="dd-ul" :class="{nohead: !showhd}">
        <li class="dd-li">
          <span class="c8">药品名称</span>
          <span class="c3">{{ypxqList.name}}</span>
        </li>
        <li class="dd-li">
          <span class="c8">药品类型</span>
          <span class="c3" v-if="ypxqList.category === 'A'">西药</span>
          <span class="c3" v-if="ypxqList.category === 'B'">中成药</span>
          <span class="c3" v-if="ypxqList.category === 'C'">中药饮片</span>
        </li>
        <li class="dd-li">
          <span class="c8">药品剂型</span>
          <span class="c3">{{ypxqList.dosageForm}}</span>
        </li>
        <li class="dd-li">
          <span class="c8">医保类别</span>
          <span class="c3" v-if="ypxqList.rechargeableGrade === 'A'">甲</span>
          <span class="c3" v-if="ypxqList.rechargeableGrade === 'B'">乙</span>
          <span class="c3" v-if="ypxqList.rechargeableGrade === 'C'">自费</span>
        </li>
        <li class="dd-li dd-lib clearfix">
          <span class="c8 spa left">备注</span>
          <span class="c3 spb right" v-if="ypxqList.remark">{{ypxqList.remark}}</span>
          <span class="c3 spb right" v-else>无</span>
        </li>
      </ul>
      <div class="jbbtom c9">药品信息仅供参考，如有疑问请参考当地人社官网</div>
    </div>
</template>

<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header'
import {formalInsuranceDrugsInfodt} from 'api/api'
export default {
  data () {
    return {
      showhd: true,
      id: '',
      ypxqList: []
    }
  },
  created () {
    this.id = this.$route.params.id
    this._formalInsuranceDrugsInfodt()
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
          title: '医保药品目录'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 药品详细信息
    _formalInsuranceDrugsInfodt () {
      formalInsuranceDrugsInfodt(this.id).then((res) => {
        console.log('res', res)
        this.ypxqList = res.data.data
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
  .drugsDetail
    .dd-ul
      padding:0 32px
      background-color #ffffff
      margin-top 116px
      &.nohead
        margin-top 0px
      .dd-li
        height 110px
        display flex
        align-items center
        justify-content space-between
        border-bottom 2px solid #eeeeee
        font-size 36px
        &:last-child
          border-bottom none
        &.dd-lib
          display block
          height auto
          .spa
            line-height 110px
          .spb
            max-width 85%
            line-height 45px
            margin-top 30px
            padding-bottom 25px
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
