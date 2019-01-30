<template>
    <div class="drugs">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab class="tab" :line-width="2" custom-bar-width="50px" :active-color="selectColor" :default-color="defaltColor">
        <tab-item  v-for="(item,index) in ypslist" :key="index" :selected="index === 0" @on-item-click="tabclickFn(item.type)">{{item.name}}</tab-item>
      </tab>
      <v-scroll :on-refresh="onRefresh"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        <ul class="jbul">
          <li class="jbli" v-for="(item,index) in ypList" :key="index" @click="toDtFn(item.id)">
            <p class="jblipa c3">{{item.name}}</p>
            <div class="clearfix ">
              <p class="jblipb left" v-if="item.dosageForm">{{item.dosageForm}}</p>
              <p class="jblipc right" v-if="item.category === 'A'">西药</p>
              <p class="jblipc right" v-if="item.category === 'B'">中成药</p>
              <p class="jblipc right" v-if="item.category === 'C'">中药饮片</p>
            </div>
          </li>
        </ul>
      </v-scroll>
      <div class="jbbtom c9">药品信息仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {Tab, TabItem} from 'vux'
import mheader from 'components/m-header/m-header'
import {formalInsuranceDrugsInfo} from 'api/api'
import loading from 'base/loading/loading'
import Scroll from 'components/pull'
export default {
  data () {
    return {
      cityCode: '',
      title: '医保药品目录',
      backi: false,
      zfbhd: false,
      searchi: true,
      morei: true,
      pageType: 'drugs',
      selectColor: '#108EE9',
      defaltColor: '#333333',
      busy: true,
      showloading: false,
      pageSize: 10,
      pageNum: 1,
      category: '',
      name: '',
      ypList: [],
      ypslist: [{name: '全部', type: ''}, {name: '西药', type: 'A'}, {name: '中成药', type: 'B'}, {name: '中药饮片', type: 'C'}]
    }
  },
  created () {
    if (this.$route.params.citycode) {
      this.cityCode = this.$route.params.citycode
    } else {
      this.cityCode = '440600'
    }
    this.ypList = []
    this.category = ''
    this._formalInsuranceDrugsInfo()
    this.showloading = true
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },

  methods: {
    titFn () {
      this.zfbhd = true
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '医保药品目录'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 药品列表查询
    _formalInsuranceDrugsInfo (flag) {
      let _that = this
      formalInsuranceDrugsInfo({
        regionNo: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        category: this.category,
        name: this.name
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (flag) {
          // 多次加载数据
          if (res.data.data.rows.length === 0) {
            _that.busy = true
          } else {
            _that.busy = false
            _that.ypList = _that.ypList.concat(res.data.data.rows)
            console.log(_that.ypList)
          }
        } else {
          // 第一次加载数据
          _that.ypList = res.data.data.rows
          console.log(_that.ypList)
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
        that.ypList = []
        that.showloading = true
        that._formalInsuranceDrugsInfo(false)
        done()
      }, 500)
    },
    loadMore: function () {
      this.busy = true
      // 多次加载数据
      setTimeout(() => {
        this.pageNum = this.pageNum + 1
        this.showloading = true
        this._formalInsuranceDrugsInfo(true)
      }, 500)
    },
    toDtFn (id) {
      this.$router.push({path: `/drugsDetail/${id}`})
    },
    tabclickFn (type) {
      this.ypList = []
      this.category = type
      this.pageNum = 1
      this.showloading = true
      this._formalInsuranceDrugsInfo()
    }
  },
  components: {
    Tab,
    TabItem,
    mheader,
    loading,
    'v-scroll': Scroll
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .drugs
    .tab
      position fixed
      top 90px
      left 0px
      width 100%
      z-index 999
      height 87px
      background-color #ffffff
      border-bottom 2px solid #eeeeee
      .vux-tab-container
        height 87px
      .vux-tab
        height 80px
        padding-top 8px
        .vux-tab-item
          line-height 87px
          font-size 32px
      .scrollable
        padding-bottom 0
    .vux-tab-wrap
      padding-top 0
    .jbul
      margin-top 114px
      background-color #ffffff
      .jbli
        padding:24px 32px
        border-bottom 2px solid #eeeeee
        .jblipa
          font-size 32px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 48px
        .jblipb
          width 82%
          font-size 28px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 40px
          color #888888
        .jblipc
          font-size 26px
          line-height 40px
          color #888888
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
