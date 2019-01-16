<template>
    <div class="networkDetail">
      <mheader title="定点医院" :morei="morei" v-if="showhd"></mheader>
      <div class="nd-bx" :class="{nohead: !showhd}">
        <div id="mapcon" class="nd-map"></div>
        <div class="nd-tit">{{yyxqList.name}}
          <span class="h-dja" v-if="yyxqList.grade == '三级' || yyxqList.grade == '三甲'">{{yyxqList.grade}}</span>
          <span class="h-djb" v-else-if="yyxqList.grade == '二级' || yyxqList.grade == '二甲'">{{yyxqList.grade}}</span>
          <span class="h-djc" v-else>{{yyxqList.grade}}</span>
        </div>
        <div class="nd-wz">
          <span class="c9">位置</span>
          <span class="nd-wzr c3">{{yyxqList.address}}</span>
        </div>
      </div>
      <div class="nd-btnbx"><div class="nd-btna" @click="dhFn()">导航</div></div>
    </div>
</template>

<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header'
import AMap from 'AMap'
import {formalFixHospitalsdt} from 'api/api'
export default {
  data () {
    return {
      showhd: true,
      morei: true,
      id: '',
      yyxqList: []
    }
  },
  created () {
    //console.log(this.$route.params.id)
    this.id = this.$route.params.id
    this._formalFixHospitalsdt()
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },
  mounted () {
  },
  methods: {
    // 是否显示头部
    titFn () {
      this.showhd = false
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '定点医院'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 医院详细信息
    _formalFixHospitalsdt () {
      formalFixHospitalsdt(this.id).then((res) => {
        console.log('res', res)
        this.yyxqList = res.data.data
        this.getMap()
      }).catch((res) => {
        console.log('error', res)
      })
    },
    getMap () {
      let that = this
      let map = new AMap.Map('mapcon', {
        center: [Number(that.yyxqList.longitude), Number(that.yyxqList.latitude)],
        resizeEnable: true,
        zoom: 15
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
      let marker = new AMap.Marker({
        map: map,
        position: new AMap.LngLat(Number(that.yyxqList.longitude), Number(that.yyxqList.latitude)) // 此处根据页面数据可以直接传入经纬度进行描点
      })
    },
    dhFn () {
      if (this._isMobile()) {
        let map = new AMap.Map('mapcon', {
          center: [Number(this.yyxqList.longitude), Number(this.yyxqList.latitude)],
          resizeEnable: true,
          zoom: 15
        })
        let marker = new AMap.Marker({
          map: map,
          position: new AMap.LngLat(Number(this.yyxqList.longitude), Number(this.yyxqList.latitude)) // 此处根据页面数据可以直接传入经纬度进行描点
        })
        marker.markOnAMAP({
          position: [Number(this.yyxqList.longitude), Number(this.yyxqList.latitude)]
        })
        map.addControl(new AMap.ToolBar())
      } else {
        console.log('不是手机端')
      }
    },
    _isMobile () {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    }
  },
  components: {
    mheader
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .networkDetail
    background-color #ffffff
    .nd-bx
      padding 98px 32px 0 32px
      &.nohead
        padding-top 30px
      .nd-map
        width 100%
        height 468px
      .nd-tit
        margin-top 20px
        color #333333
        font-size 44px
        line-height 62px
        border-bottom 2px solid #eeeeee
        padding-bottom 20px
        .h-dja
          color #0081EC
          font-size 24px
          display inline-block
          background-color #C5E6FE
          border-radius 2px
          padding 3px 8px
          margin-left 16px
          line-height 34px
          vertical-align middle
        .h-djb
          color #03B5A9
          font-size 24px
          display inline-block
          background-color #F3FCFB
          border-radius 2px
          padding 3px 8px
          margin-left 16px
          line-height 34px
          vertical-align middle
        .h-djc
          color #888
          font-size 24px
          display inline-block
          background-color #eee
          border-radius 2px
          padding 3px 8px
          margin-left 16px
          line-height 34px
          vertical-align middle
      .nd-wz
        height 98px
        display flex
        align-items center
        justify-content space-between
        font-size 28px
        border-bottom 2px solid #eeeeee
        .nd-wzr
          max-width 85%
          line-height 38px
    .nd-btnbx
      position absolute
      left 32px
      right 32px
      bottom 16px
      .nd-btna
        width 100%
        height 88px
        line-height 88px
        text-align center
        border-radius 4px
        color #ffffff
        background-color #108EE9
        font-size 36px
</style>
