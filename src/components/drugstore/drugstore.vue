<template>
    <div class="drugstore">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <div class="ds-top c3" @click="showSelFn()">
        <span>{{qyName}}</span>
        <i class="dowmarr" :class="{active: selshow}"></i>
      </div>
      <div class="selbig" v-if="selshow">
        <div class="selbg" @click="selbgFn()"></div>
        <div class="selbx">
          <ul class="selbxul clearfix">
            <li class="selbxli"  v-for="(item,index) in qyList" :key="index" @click="tapSel(index, item)" :class="{active: current === index}">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-spinner v-show="InitialLoading" color="#26a2ff" class="toploadbx"></mt-spinner>
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
                     :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
          <ul class="ds-ul">
            <li class="ds-li" v-for="(item,index) in ydList" :key="index" @click="toDtFn(item.id)">
              <p class="ds-lipa c3">{{item.organName}}</p>
              <div class="clearfix c9">
                <p class="ds-lipb left">{{item.organAddress}}</p>
                <p class="ds-lipc right" v-if="item.dis">{{item.dis}}</p>
              </div>
            </li>
          </ul>
          <div slot="top" v-if="showloadmt" class="mint-loadmore-top mintLoadM" style="text-align:center;">
            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
            <mt-spinner v-show="topStatus == 'loading'" color="#26a2ff"></mt-spinner>
            <span class="mint-loadmore-text">{{ topText }}</span>
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <mt-spinner v-show="bottomStatus == 'loading'" color="#26a2ff"></mt-spinner>
            <span class="mint-loadmore-text">{{ bottomText }}</span>
          </div>
        </mt-loadmore>
      </div>
      <div class="ds-btom c9">网点数据仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <div id="icenter" style="width: 0; height: 0;"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import { Spinner } from 'mint-ui'
import AMap from 'AMap'
import mheader from 'components/m-header/m-header'
import {getAreaInfoByCityCode, formalFixDrugstore} from 'api/api'
import loading from 'base/loading/loading'
import Scroll from 'components/pull'
export default {
  data () {
    return {
      cityCode: '',
      title: '定点零售药店',
      backi: false,
      zfbhd: false,
      qyName: '全部',
      searchi: true,
      pageType: 'drugstore',
      morei: true,
      selshow: false,
      current: 0,
      busy: true,
      showloading: false,
      pageSize: 10,
      pageNum: 1,
      area: '',
      jwflag: 0,
      lng: '',
      lat: '',
      ydList: [],
      qyList: [],
      InitialLoading: true, // 初始加载
      allLoaded: false, // 数据是否加载完毕
      bottomStatus: '', // 底部上拉加载状态
      wrapperHeight: 0, // 容器高度
      topStatus: '', // 顶部下拉加载状态
      topText: '',
      topPullText: '下拉刷新',
      topDropText: '释放更新',
      topLoadingText: '加载中...',
      bottomText: '',
      bottomPullText: '上拉刷新',
      bottomDropText: '释放更新',
      bottomLoadingText: '加载中...',
      showloadmt: false
    }
  },
  created () {
    if (this.$route.params.citycode) {
      this.cityCode = this.$route.params.citycode
    } else {
      this.cityCode = '440600'
    }
    this._getAreaInfoByCityCode()
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
    this.getPosiFn()
  },
  mounted () {
    let windowWidth = document.documentElement.clientWidth
    if (windowWidth >= 414) {
      this.wrapperHeight = document.documentElement.clientHeight - 60
    } else if (windowWidth >= 375) {
      this.wrapperHeight = document.documentElement.clientHeight - 54
    } else {
      this.wrapperHeight = document.documentElement.clientHeight - 47
    }
  },
  methods: {
    titFn () {
      this.zfbhd = true
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '定点零售药店'
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
          // alert(data.addressComponent.city)
          // alert(data.position.getLng())
          that.lng = data.position.getLng() // 经度
          that.lat = data.position.getLat() // 纬度
          that.jwflag = 1
          that.area = ''
          that.ydList = []
          that._formalFixDrugstore()
          that.showloading = true
        }) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', function (data) {
          if (data.info === 'FAILED') {
            console.log('获取您当前位置失败！')
            that.area = ''
            that.ydList = []
            that._formalFixDrugstore()
            that.showloading = true
          }
        })
      })
    },
    // 获取行政区信息
    _getAreaInfoByCityCode () {
      getAreaInfoByCityCode({
        cityCode: this.cityCode
      }).then((res) => {
        // console.log('res', res)
        this.qyList = [{id: '', name: '全部'}]
        this.qyList = this.qyList.concat(res.data.data)
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 药店列表查询
    _formalFixDrugstore (flag) {
      let _that = this
      formalFixDrugstore({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        area: this.area,
        longitude: this.lng,
        latitude: this.lat,
        flag: this.jwflag
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (flag) {
          // 多次加载数据
          if (res.data.data.rows.length === 0) {
          } else {
            _that.ydList = _that.ydList.concat(res.data.data.rows)
            console.log(_that.ydList)
          }
          _that.handleBottomChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onBottomLoaded()
        } else {
          // 第一次加载数据
          _that.InitialLoading = false
          _that.showloadmt = true
          _that.handleTopChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onTopLoaded()
          _that.ydList = res.data.data.rows
          console.log(_that.ydList)
        }
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    loadBottom () {
      this.handleBottomChange('loading') // 上拉时 改变状态码
      this.pageNum += 1
      this._formalFixDrugstore(true)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadTop () { // 下拉刷新 模拟数据请求这里为了方便使用一次性定时器
      this.handleTopChange('loading') // 下拉时 改变状态码
      this.allLoaded = false // 下拉刷新时解除上拉加载的禁用
      this.pageNum = 1
      this.ydList = []
      this.showloading = true
      this._formalFixDrugstore(false)
    },
    toDtFn (id) {
      this.$router.push({path: `/drugstoreDetail/${id}`})
    },
    showSelFn () {
      this.selshow = !this.selshow
    },
    selbgFn () {
      this.selshow = false
    },
    tapSel (index, item) {
      this.current = index
      this.qyName = item.name
      this.selshow = !this.selshow
      this.pageNum = 1
      this.area = item.id
      this.ydList = []
      this.showloading = true
      this._formalFixDrugstore()
    }
  },
  watch: {
    topStatus (val) {
      switch (val) {
        case 'pull':
          this.topText = this.topPullText
          break
        case 'drop':
          this.topText = this.topDropText
          break
        case 'loading':
          this.topText = this.topLoadingText
          break
      }
    },
    bottomStatus (val) {
      switch (val) {
        case 'pull':
          this.bottomText = this.bottomPullText
          break
        case 'drop':
          this.bottomText = this.bottomDropText
          break
        case 'loading':
          this.bottomText = this.bottomLoadingText
          break
      }
    }
  },
  components: {
    mheader,
    loading,
    'v-scroll': Scroll,
    'mt-spinner': Spinner
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .drugstore
    .ds-top
      position fixed
      top 90px
      left 0px
      width 100%
      z-index 999
      height 87px
      background-color #ffffff
      border-bottom 2px solid #eeeeee
      display flex
      align-items center
      justify-content center
      font-size 32px
      .dowmarr
        width 26px
        height 16px
        background url("../../assets/images/nav_drop.png")
        background-size cover
        display inline-block
        margin-left 16px
        &.active
          background url("../../assets/images/nav_drop_pre.png")
          background-size cover
    .ds-ul
      margin-top 16px
      //margin-bottom 108px
      background-color #ffffff
      .ds-li
        padding:20px 30px
        border-bottom 2px solid #eeeeee
        .ds-lipa
          font-size 32px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 42px
        .ds-lipb
          width 80%
          font-size 28px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 40px
        .ds-lipc
          font-size 26px
          line-height 40px
    .ds-btom
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
  .mint-spinner-snake
    display: inline-block
    vertical-align: middle
    width 28px!important
    height 28px!important
  .page-loadmore-wrapper
    overflow: scroll
    z-index: 100
  .mintLoadM
    margin-top:134px
</style>
