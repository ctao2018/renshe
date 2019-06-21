<template>
    <div class="jbnetwork">
      <div v-if="jumpFg">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab :list="qyList" @selId="getSelId"></tab>
      <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-spinner v-show="InitialLoading" color="#26a2ff" class="toploadbx"></mt-spinner>
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
                     :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
          <ul class="jbul">
            <li class="jbli" v-for="(item,index) in jbList" :key="index" @click="toDtFn(item.id)">
              <p class="jblipa c3">{{item.name}}</p>
              <div class="clearfix c9">
                <p class="jblipb left">{{item.address}}</p>
                <p class="jblipc right" v-if="item.dis">{{item.dis}}</p>
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
          <nodata v-if="jbList.length<1"></nodata>
        </mt-loadmore>
      </div>
      <div class="jbbtom c9">网点数据仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <div id="icenter" style="width: 0; height: 0;"></div>
      </div>
      <div v-if="!jumpFg"><loading></loading></div>
    </div>
</template>

<script type="text/ecmascript-6">
import { Spinner } from 'mint-ui'
import AMap from 'AMap'
import tab from 'components/tab/tab'
import mheader from 'components/m-header/m-header'
import {getAreaInfoByCityCode, formalTransactInstitution,queryValidCityWhiteList} from 'api/api'
import loading from 'base/loading/loading'
import nodata from 'base/nodata/nodata'
import Scroll from 'components/pull'
import { setTimeout } from 'timers';
// import { setToken } from 'api/auth'
export default {
  data () {
    return {
      cityCode: '',
      title: '社保经办网点',
      zfbhd: false,
      backi: false,
      searchi: true,
      pageType: 'managementNetwork',
      morei: true,
      busy: true,
      showloading: false,
      pageSize: 10,
      pageNum: 1,
      area: '',
      jwflag: 0,
      lng: '',
      lat: '',
      jbList: [],
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
      showloadmt: false,
      jumpFg:false,
    }
  },
  created () {
    if (this.$route.params.citycode) {
      this.cityCode = this.$route.params.citycode
    } else {
      this.cityCode = '440600'
    }
    // if (this.$route.params.token) {
    //   console.log(this.$route.params.token)
    //   setToken(this.$route.params.token);
    //   this.$store.commit('SET_TOKEN', this.$route.params.token);
    // } 
    
    if (this.$route.params.lng) {
      this.cityCode = this.$route.params.lng
    } else {
    }
    let u = navigator.userAgent;
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    // if (/AlipayClient/.test(window.navigator.userAgent)) {
    const strversions = navigator.userAgent;
    if(strversions.indexOf("Alipay") != -1){
      this.titFn()
      if(!isIOS){
        this._queryValidCityWhiteList()
      }else{
         this.jumpFg = true;
        this._getAreaInfoByCityCode()
        let jwd = this.$store.state.app.positionJW
        if(jwd.lat){
          this.lng= jwd.lng;
          this.lat= jwd.lat;
          this.jwflag = 1
          this.area = ''
          this.jbList = []
          this._formalTransactInstitution()
        }else{
          this.getPosiFn()
        }
        this.showloading = true;
      }
    }else{
      this.jumpFg = true;
      this._getAreaInfoByCityCode()
      let jwd = this.$store.state.app.positionJW
      if(jwd.lat){
        this.lng= jwd.lng;
        this.lat= jwd.lat;
        this.jwflag = 1
        this.area = ''
        this.jbList = []
        this._formalTransactInstitution()
      }else{
        this.getPosiFn()
      }
      this.showloading = true;
    }
    //console.log('jwd',this.$store.state.app.positionJW)
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
  // beforeRouteLeave (to, from, next) {
  //   to.meta.keepAlive = false
  //   next()
  // },
  methods: {
    titFn () {
      this.zfbhd = true
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '社保经办网点'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    getSelId (id) {
      this.jbList = []
      this.area = id
      this.showloading = true
      this.pageNum = 1
      this._formalTransactInstitution()
    },
    toDtFn (id) {
      this.$router.push({path: `/networkDetail/${id}`})
    },
    // 查询跳转白名单
    _queryValidCityWhiteList () {
      queryValidCityWhiteList({
        cityCode: this.cityCode,
        funcCode:'h5ToMiniProgram'
      }).then((res) => {
        //console.log('res', res)
        if(res.data.code === 0){
          let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/managementNetwork/managementNetwork&query=cityAdcode%3D'+this.cityCode;
          ap.pushWindow({
            url: url,
          });
          ap.popWindow();
          
          this.jumpFg = false;
        }else{
          this.jumpFg = true;
          this._getAreaInfoByCityCode()
          let jwd = this.$store.state.app.positionJW
          if(jwd.lat){
            this.lng= jwd.lng;
            this.lat= jwd.lat;
            this.jwflag = 1
            this.area = ''
            this.jbList = []
            this._formalTransactInstitution()
          }else{
            this.getPosiFn()
          }
          this.showloading = true;
        }
      }).catch((res) => {
        console.log('error', res)
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
    // 经办机构列表查询
    _formalTransactInstitution (flag) {
      let _that = this
      formalTransactInstitution({
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
            //_that.allLoaded = true // 模拟数据加载完毕 禁用上拉加载
          } else {
            _that.jbList = _that.jbList.concat(res.data.data.rows)
            console.log(_that.jbList)
          }
          _that.handleBottomChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onBottomLoaded()
        } else {
          // 第一次加载数据
          _that.InitialLoading = false
          _that.showloadmt = true
          _that.jbList = res.data.data.rows
          console.log(_that.jbList)
          _that.handleTopChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onTopLoaded()
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
      this._formalTransactInstitution(true)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadTop () { // 下拉刷新 模拟数据请求这里为了方便使用一次性定时器
      this.handleTopChange('loading') // 下拉时 改变状态码
      this.allLoaded = false // 下拉刷新时解除上拉加载的禁用
      this.pageNum = 1
      this.jbList = []
      this.showloading = true
      this._formalTransactInstitution(false)
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
          let positionjw ={
            lng:that.lng,
            lat:that.lat
          }
          this.$store.commit('SET_POSITIONJW', positionjw)
          that.jwflag = 1
          that.area = ''
          that.jbList = []
          that._formalTransactInstitution()
          that.showloading = true
        }) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', function (data) {
          if (data.info === 'FAILED') {
            console.log('获取您当前位置失败！')
            that.area = ''
            that.jbList = []
            that._formalTransactInstitution()
            that.showloading = true
          }
        })
      })
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
    tab,
    mheader,
    loading,
    nodata,
    'v-scroll': Scroll,
    'mt-spinner': Spinner
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .jbnetwork
    .jbul
      margin-top 16px
      background-color #ffffff
      .jbli
        padding:20px 30px
        border-bottom 2px solid #eeeeee
        .jblipa
          font-size 32px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 42px
        .jblipb
          width 80%
          font-size 28px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 40px
        .jblipc
          font-size 26px
          line-height 40px
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
