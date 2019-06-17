<template>
    <div class="drugs">
      <div v-if="jumpFg">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab class="tab" :line-width="2" custom-bar-width="50px" :active-color="selectColor" :default-color="defaltColor">
        <tab-item  v-for="(item,index) in ypslist" :key="index" :selected="index === 0" @on-item-click="tabclickFn(item.type)">{{item.name}}</tab-item>
      </tab>
      <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-spinner v-show="InitialLoading" color="#26a2ff" class="toploadbx"></mt-spinner>
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
                     :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
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
          <nodata v-if="ypList.length<1"></nodata>
        </mt-loadmore>
      </div>
      <div class="jbbtom c9">药品信息仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      </div>
      <div v-if="!jumpFg"><loading></loading></div>
    </div>
</template>

<script type="text/ecmascript-6">
import { Spinner } from 'mint-ui'
import {Tab, TabItem} from 'vux'
import mheader from 'components/m-header/m-header'
import {formalInsuranceDrugsInfo,queryValidCityWhiteList} from 'api/api'
import loading from 'base/loading/loading'
import nodata from 'base/nodata/nodata'
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
      ypslist: [{name: '全部', type: ''}, {name: '西药', type: 'A'}, {name: '中成药', type: 'B'}, {name: '中药饮片', type: 'C'}],
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
    this.ypList = []
    this.category = ''
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
      this._queryValidCityWhiteList()
    }else{
      this.jumpFg = true;
      this._formalInsuranceDrugsInfo()
    }
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
    // this._formalInsuranceDrugsInfo()
    this.showloading = true
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
    // 查询跳转白名单
    _queryValidCityWhiteList () {
      queryValidCityWhiteList({
        cityCode: this.cityCode,
        funcCode:'insuraceDrugs'
      }).then((res) => {
        //console.log('res', res)
        if(res.data.code === 0){
          let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/drugs/drugs&query=cityAdcode%3D'+this.cityCode;
          AlipayJSBridge.call('pushWindow', {
            url: url,
            param: {
            }
          });
          AlipayJSBridge.call('popWindow');
          this.jumpFg = false;
        }else{
          this.jumpFg = true;
          this._formalInsuranceDrugsInfo()
          this.showloading = true;
        }
      }).catch((res) => {
        console.log('error', res)
      })
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
          } else {
            _that.ypList = _that.ypList.concat(res.data.data.rows)
            console.log(_that.ypList)
          }
          _that.handleBottomChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onBottomLoaded()
        } else {
          // 第一次加载数据
          _that.InitialLoading = false
          _that.showloadmt = true
          _that.handleTopChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onTopLoaded()
          _that.ypList = res.data.data.rows
          console.log(_that.ypList)
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
      this._formalInsuranceDrugsInfo(true)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadTop () { // 下拉刷新 模拟数据请求这里为了方便使用一次性定时器
      this.handleTopChange('loading') // 下拉时 改变状态码
      this.allLoaded = false // 下拉刷新时解除上拉加载的禁用
      this.pageNum = 1
      this.ypList = []
      this.showloading = true
      this._formalInsuranceDrugsInfo(false)
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
    Tab,
    TabItem,
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
      margin-top 16px
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
