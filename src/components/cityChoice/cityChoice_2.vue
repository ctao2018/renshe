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
      <div class="cc-bxtop" :class="{nohead: !showhd}" :style="`height: ${screenHeight}px`" ref="topContainer">
        <div class="cc-cbx" v-if="ssCity.cityName">
          <p class="cc-cbxp">搜索结果</p>
          <ul class="cc-cbxul clearfix" >
            <li class="cc-cbxli" @click="tofpFn(ssCity.cityCode, ssCity.cityName)">{{ssCity.cityName}}</li>
          </ul>
        </div>
        <div class="cc-cbx" v-if="cityName">
          <p class="cc-cbxp">当前城市</p>
          <ul class="cc-cbxul clearfix">
            <li class="cc-cbxli cc-ctpre" @click="dqCityFn(cityName)"><i class="cc-posi"></i>{{cityName}}</li>
          </ul>
        </div>
        <div class="cc-cbx" v-if="historyxs">
          <p class="cc-cbxp">最近访问城市</p>
          <ul class="cc-cbxul clearfix" >
            <li class="cc-cbxli" v-for="(item,index) in fwcitylist" :key="index" @click="dqCityFn(item)">{{item}}</li>
          </ul>
        </div>
        <div class="cc-cbx cc-bxnop" v-for="(item, index) in addr" :key="index" :id="item.key">
          <!--<ul class="cc-cbxul clearfix">-->
            <!--<li class="cc-cbxli" v-for="(item,index) in cityList" :key="index" @click="tofpFn(item.cityCode, item.cityName)">{{item.cityName}}</li>-->
          <!--</ul>-->
          <div class="cc-cbxp">{{item.key}}</div>
          <div class="cc-addrbx" v-for="(item1, key) in item.item" :key="key"  @click="tofpFn(item1.cityCode, item1.cityName)">
            <div class="cc-addr" >{{item1.cityName}}</div>
          </div>
        </div>
        
        <div class="loading-container" v-show="showloading">
          <loading></loading>
        </div>
        <bottomline :title="bltit" v-if="shownodata"></bottomline>
      </div>
      <div class="cc-slide">
          <span v-for="(item, index) in temABC" :key='index'>
            <span class="temABC" @click="slide(item)">{{item}}</span>
          </span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header'
import bottomline from 'components/bottomLine/bottomLine'
import {Toast} from 'vux'
import {queryOpenCityCodeInfoByCityName, queryAllOpenCityInfoByPinYin} from 'api/api'
import loading from 'base/loading/loading'
import AMap from 'AMap'
import { saveSearch } from 'api/cache' // 引用本地存储js
import storage from 'good-storage' // 引入good-storage包
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
      temABC: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      cityList: [],
      screenHeight: 0,
      addr: [],
      fwcitykey: 'fwcitykey',
      fwcitylist: [],
      historyxs: false
    }
  },
  created () {
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },
  mounted () {
    let windowWidth = document.documentElement.clientWidth
    if (windowWidth >= 414) {
      this.screenHeight = window.screen.availHeight - 102 // 设置#topdiv的高度
    } else if (windowWidth >= 375) {
      this.screenHeight = window.screen.availHeight - 94 // 设置#topdiv的高度
    } else {
      this.screenHeight = window.screen.availHeight - 80 // 设置#topdiv的高度
    }
    this.getPosiFn()
    this._queryAllOpenCityInfoByPinYin()
    this.getsearchhis()
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
    _queryAllOpenCityInfoByPinYin () {
      queryAllOpenCityInfoByPinYin({
      }).then((res) => {
        console.log('res2', res)
        this.addr = res.data.data
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
    dqCityFn (cityName) {
      let that = this
      queryOpenCityCodeInfoByCityName({
        cityName: cityName
      }).then((res) => {
        // console.log('res', res)
        if (res.data.code === 0) {
          that.ssCity = res.data.data
          saveSearch(that.ssCity.cityName, that.fwcitykey)
          this.$router.push({path: `/firstPage/${that.ssCity.cityCode}`})
        } else if (res.data.code === -2) {
          that.$vux.toast.text('该城市暂未开通服务!', 'middle')
        }
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 返回首页
    tofpFn (cityCode, cityName) {
      saveSearch(cityName, this.fwcitykey)
      this.$router.push({path: `/firstPage/${cityCode}`})
    },
    // 点击侧边字母
    slide (item) {
      let that = this
      that.strA = item
      for (let i = 0; i < that.addr.length; i++) {
        if (item === that.addr[i].key) { // 判断城市列表中是否包含右侧点击的字母，不判断会报错
          let slideScrollHeight = document.querySelector('#' + item).offsetTop - 100 // 计算要滚动的距离
          // console.log(slideScrollHeight)
           
           if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
             
             that.$refs.topContainer.scrollTop = slideScrollHeight
            
           } else{
             
             that.$refs.topContainer.scrollTop = slideScrollHeight // 赋值给需要滚动的盒子
           }
        }
      }
    },
    // 获取搜索历史列表
    getsearchhis () {
      let searches = storage.get('fwcitykey')
      this.fwcitylist = searches ? searches : []
      this.historyLeng()
    },
    // 判断是否有搜索历史
    historyLeng () {
      if (this.fwcitylist.length > 0) {
        this.historyxs = true
      } else {
        this.historyxs = false
      }
    },
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
    position absolute
    left 0
    top 0
    width: 100%;  
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .s-top
      position fixed
      left 0
      right 0
      top 88px
      padding 16px 32px
      display flex
      align-items center
      justify-content space-between
      background-color #ffffff
      z-index 5
      &.nohead
        top 0px
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
          .cc-posi
            width 33px
            height 39px
            background url("../../assets/images/positioning.png")
            background-size cover
            display inline-block
            vertical-align middle
            margin-right 10px
          &.cc-ctpre
            color: #108EE9
      .cc-addrbx
        background-color #ffffff
        padding-left 32px
        .cc-addr
          height 100px
          line-height 100px
          font-size 34px
          color #333333
          border-bottom 2px solid #eeeeee
      &.cc-bxnop
        padding 0
        margin-bottom 30px
        .cc-cbxp
          padding-left 32px
    .cc-slide
      height: 100%
      line-height 28px
      position: absolute
      right: 0
      top: 200px
      color: #333333
      display: flex
      flex-direction: column
      font-size: 26px
      text-align: center
      z-index: 3
      .temABC
        padding 2px 20px
        display inline-block
  .cc-bxtop
    margin-top 168px
    overflow-x: hidden
    overflow-y: scroll
    font-size: 26px
    height: 12rem
    width 100%
    display: block
    &.nohead
      margin-top 88px
  .weui-toast__content
    font-size 26px
</style>
