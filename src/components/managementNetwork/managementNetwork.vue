<template>
    <div class="jbnetwork">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab :list="qyList" @selId="getSelId"></tab>
      <v-scroll :on-refresh="onRefresh"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        <ul class="jbul">
          <li class="jbli" v-for="(item,index) in jbList" :key="index" @click="toDtFn(item.id)">
            <p class="jblipa c3">{{item.name}}</p>
            <div class="clearfix c9">
              <p class="jblipb left">{{item.address}}</p>
              <p class="jblipc right" v-if="item.dis">{{item.dis}}</p>
            </div>
          </li>
        </ul>
      </v-scroll>
      <div class="jbbtom c9">网点数据仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <div id="icenter" style="width: 0; height: 0;"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import AMap from 'AMap'
import tab from 'components/tab/tab'
import mheader from 'components/m-header/m-header'
import {getAreaInfoByCityCode, formalTransactInstitution} from 'api/api'
import loading from 'base/loading/loading'
import Scroll from 'components/pull'
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
      qyList: []
    }
  },
  created () {
    if (this.$route.params.citycode) {
      this.cityCode = this.$route.params.citycode
    } else {
      this.cityCode = '440600'
    }
    if (this.$route.params.lng) {
      this.cityCode = this.$route.params.lng
    } else {
    }
    this._getAreaInfoByCityCode()
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
    this.getPosiFn()
    // console.log(this.$store.state.app.token)
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
            _that.busy = true
          } else {
            _that.busy = false
            _that.jbList = _that.jbList.concat(res.data.data.rows)
            console.log(_that.jbList)
          }
        } else {
          // 第一次加载数据
          _that.jbList = res.data.data.rows
          console.log(_that.jbList)
          // 当第一次加载数据完之后，把这个滚动到底部的函数触发打开
          _that.busy = false
        }
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    onRefresh (done) {
      let that = this
      setTimeout(function () {
        that.pageNum = 1
        that.jbList = []
        that.showloading = true
        that._formalTransactInstitution(false)
        done()
      }, 500)
    },
    loadMore: function () {
      this.busy = true
      // 多次加载数据
      setTimeout(() => {
        this.pageNum = this.pageNum + 1
        this.showloading = true
        this._formalTransactInstitution(true)
      }, 500)
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
  components: {
    tab,
    mheader,
    loading,
    'v-scroll': Scroll
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .jbnetwork
    .jbul
      margin-top 114px
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
</style>
