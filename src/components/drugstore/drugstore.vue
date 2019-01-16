<template>
    <div class="drugstore">
      <mheader :title="title" :backi="backi" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
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
      <v-scroll :on-refresh="onRefresh"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        <ul class="ds-ul">
          <li class="ds-li" v-for="(item,index) in ydList" :key="index" @click="toDtFn(item.id)">
            <p class="ds-lipa c3">{{item.organName}}</p>
            <div class="clearfix c9">
              <p class="ds-lipb left">{{item.organAddress}}</p>
              <p class="ds-lipc right" v-if="item.dis">{{item.dis}}</p>
            </div>
          </li>
        </ul>
      </v-scroll>
      <div class="ds-btom c9">网点数据仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <div id="icenter" style="width: 0; height: 0;"></div>
    </div>
</template>

<script type="text/ecmascript-6">
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
      qyList: []
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

  methods: {
    titFn () {
      this.title = ''
      this.backi = true
      this.morei = false
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
            _that.busy = true
          } else {
            _that.busy = false
            _that.ydList = _that.ydList.concat(res.data.data.rows)
            console.log(_that.ydList)
          }
        } else {
          // 第一次加载数据
          _that.ydList = res.data.data.rows
          console.log(_that.ydList)
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
        that.ydList = []
        that.showloading = true
        that._formalFixDrugstore(false)
        done()
      }, 500)
    },
    loadMore: function () {
      this.busy = true
      // 多次加载数据
      setTimeout(() => {
        this.pageNum = this.pageNum + 1
        this.showloading = true
        this._formalFixDrugstore(true)
      }, 500)
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
  components: {
    mheader,
    loading,
    'v-scroll': Scroll
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
      margin-top 114px
      //margin-bottom 108px
      background-color #ffffff
      .ds-li
        padding:20px 30px
        border-bottom 2px solid #eeeeee
        .ds-lipa
          font-size 36px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 42px
        .ds-lipb
          width 85%
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
</style>
