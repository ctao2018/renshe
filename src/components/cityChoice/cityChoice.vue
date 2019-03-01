<template>
    <div class="citychoice">
      <mheader :title="title" v-if="showhd"></mheader>
      <div class="s-top" :class="{nohead: !showhd}">
        <div class="s-sebx">
          <i class="s-sebxi"></i>
          <div class="s-sebxr">
            <form action="javascript:return true;">
              <input class="s-sebxinp" v-model="serMsg" placeholder="输入城市名" @keyup.13=show() type="search" ref="input1">
            </form>
          </div>
        </div>
        <span class="s-sebtnt" @click="searchbtn()">搜索</span>
      </div>
      <div class="cc-cbx" v-if="cityName">
        <p class="cc-cbxp">当前城市</p>
        <ul class="cc-cbxul clearfix">
          <li class="cc-cbxli" @click="dqCityFn()">{{cityName}}</li>
        </ul>
      </div>
      <div class="cc-cbx" v-if="ssCity.cityName">
        <p class="cc-cbxp">搜索结果</p>
        <ul class="cc-cbxul clearfix" >
          <li class="cc-cbxli" @click="tofpFn(ssCity.cityCode)">{{ssCity.cityName}}</li>
        </ul>
      </div>
      <div class="cc-cbx">
        <p class="cc-cbxp">已开通城市</p>
        <ul class="cc-cbxul clearfix">
          <li class="cc-cbxli" v-for="(item,index) in cityList" :key="index" @click="tofpFn(item.cityCode)">{{item.cityName}}</li>
        </ul>
      </div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <bottomline :title="bltit" v-if="shownodata"></bottomline>
    </div>
</template>

<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header'
import bottomline from 'components/bottomLine/bottomLine'
import {Toast} from 'vux'
import {queryAllOpenCityInfo, queryOpenCityCodeInfoByCityName} from 'api/api'
import loading from 'base/loading/loading'
import AMap from 'AMap'
export default {
  data () {
    return {
      showhd: true,
      cityCode: '',
      serMsg: '',
      cityName: '',
      showloading: false,
      shownodata: false,
      ssCity: {},
      title: '城市选择',
      cityList: []
    }
  },
  created () {
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },
  mounted () {
    this.getPosiFn()
    this._queryAllOpenCityInfo()
  },
  methods: {
    // 是否显示头部
    titFn () {
      this.showhd = false
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '城市选择'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 获取当前位置
    getPosiFn () {
      let that = this
      let mapObj = new AMap.Map('icenter')
      mapObj.plugin('AMap.Geolocation', () => {
        let geolocation = new AMap.Geolocation({
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0 // 定位结果缓存0毫秒，默认：0
        })
        mapObj.addControl(geolocation)
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', (data) => {
          that.cityName = data.addressComponent.city
        }) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', function (data) {
          if (data.info === 'FAILED') {
            console.log('获取您当前位置失败！')
          }
        })
      })
    },
    // 获取已开通城市列表
    _queryAllOpenCityInfo () {
      queryAllOpenCityInfo({
        cityName: ''
      }).then((res) => {
        console.log('res', res)
        this.cityList = res.data.data.rows
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 获取搜索城市
    _queryOpenCityCodeInfoByCityName () {
      let that = this
      queryOpenCityCodeInfoByCityName({
        cityName: this.serMsg
      }).then((res) => {
        console.log('res', res)
        if (res.data.code === 0) {
          that.ssCity = res.data.data
        } else if (res.data.code === -2) {
          that.$vux.toast.text('该城市暂未开通服务!', 'middle')
        } else if (res.data.code === -3) {
          that.$vux.toast.text('未能匹配到该城市!', 'middle')
        }
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 点击搜索
    searchbtn () {
      if (this.serMsg) {
        this._queryOpenCityCodeInfoByCityName()
        this.serMsg = ''
      } else {
        this.$vux.toast.text('输入不能为空', 'middle')
      }
    },
    show () {
      this.$refs.input1.blur()
      this.searchbtn()
    },
    // 点击当前城市
    dqCityFn () {
      let that = this
      queryOpenCityCodeInfoByCityName({
        cityName: this.cityName
      }).then((res) => {
        // console.log('res', res)
        if (res.data.code === 0) {
          that.ssCity = res.data.data
          this.$router.push({path: `/firstPage/${that.ssCity.cityCode}}`})
        } else if (res.data.code === -2) {
          that.$vux.toast.text('该城市暂未开通服务!', 'middle')
        }
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 返回首页
    tofpFn (cityCode) {
      this.$router.push({path: `/firstPage/${cityCode}`})
    }
  },
  components: {
    mheader,
    Toast,
    loading,
    bottomline
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .citychoice
    .s-top
      margin-top 88px
      padding 16px 32px
      display flex
      align-items center
      justify-content space-between
      background-color #ffffff
      &.nohead
        margin-top 0px
      .s-sebx
        width 590px
        height 60px
        background-color #f5f5f5
        border-radius 4px
        display flex
        align-items center
        .s-sebxi
          width 29px
          height 28px
          background url("../../assets/images/list_search.png")
          background-size cover
          display inline-block
          margin 0 15px 0 24px
        .s-sebxr
          flex 1
          .s-sebxinp
            width 100%
            height 50px
            line-height 50px
            padding 5px 0
            font-size 28px
            color #333333
            background-color #f5f5f5
            outline none
      .s-sebtnt
        font-size 32px
        color #108EE9
    .cc-cbx
      padding 0 32px
      .cc-cbxp
        color #999999
        font-size 26px
        line-height 32px
        margin 24px 0 20px
      .cc-cbxul
        margin-left -20px
        .cc-cbxli
          float left
          margin 0 0 20px 20px
          width 175px
          height 42px
          line-height 42px
          color #333333
          font-size 28px
          padding 19px 20px
          background-color #ffffff
          border-radius 4px
          text-align center
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
  .weui-toast__content
    font-size 26px
</style>
