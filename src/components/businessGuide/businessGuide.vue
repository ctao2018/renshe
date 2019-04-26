<template>
    <div class="businessGuide">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab :list="znList" :tabNum="tabNum" @selId="getSelId"></tab>
      <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-spinner v-show="InitialLoading" color="#26a2ff" class="toploadbx"></mt-spinner>
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
                     :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
          <ul class="bgul">
            <li class="bgli" v-for="(item,index) in bsList" :key="index" @click="toDtFn(item.id)">
              <div class="bglil"><p class="bglip c3">{{item.title}}</p></div>
              <i class="bg-arrri"></i>
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
          <nodata v-if="bsList.length<1"></nodata>
        </mt-loadmore>
      </div>
      <div class="jbbtom c9">办事指南仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { Spinner } from 'mint-ui'
import tab from 'components/tab/tab'
import mheader from 'components/m-header/m-header'
import {formalBusinessGuide, formalBusinessGuideca} from 'api/api'
import loading from 'base/loading/loading'
import nodata from 'base/nodata/nodata'
import Scroll from 'components/pull'
export default {
  data () {
    return {
      cityCode: '',
      title: '办事指南',
      backi: false,
      zfbhd: false,
      searchi: true,
      pageType: 'businessGuide',
      morei: true,
      busy: true,
      showloading: false,
      pageSize: 10,
      pageNum: 1,
      category: '',
      tabNum: '',
      bsList: [],
      znList: [],
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
    if (this.$route.params.type) {
      if (this.$route.params.type !== 'all') {
        this.category = this.$route.params.type
      }
    }
    this._formalBusinessGuideca()
    this.bsList = []
    this._formalBusinessGuide()
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
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
    this._formalBusinessGuide()
    this._formalBusinessGuideca()
    this.showloading = true
  },
  methods: {
    titFn () {
      this.zfbhd = true
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '办事指南'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 获取分类信息
    _formalBusinessGuideca () {
      formalBusinessGuideca({
        cityCode: this.cityCode
      }).then((res) => {
        console.log('res', res)
        this.znList = [{id: '', categoryName: '全部'}]
        this.znList = this.znList.concat(res.data.data)
        let index = this.znList.findIndex((value, index, arr) => {
          return value.categoryNo === this.category
        })
        this.tabNum = index.toString()
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 办事指南列表查询
    _formalBusinessGuide (flag) {
      let _that = this
      formalBusinessGuide({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        category: this.category
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (flag) {
          // 多次加载数据
          if (res.data.data.rows.length === 0) {
          } else {
            _that.bsList = _that.bsList.concat(res.data.data.rows)
            console.log(_that.bsList)
          }
          _that.handleBottomChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onBottomLoaded()
        } else {
          // 第一次加载数据
          _that.InitialLoading = false
          _that.showloadmt = true
          _that.handleTopChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onTopLoaded()
          _that.bsList = res.data.data.rows
          console.log(_that.bsList)
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
      this._formalBusinessGuide(true)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadTop () { // 下拉刷新 模拟数据请求这里为了方便使用一次性定时器
      this.handleTopChange('loading') // 下拉时 改变状态码
      this.allLoaded = false // 下拉刷新时解除上拉加载的禁用
      this.pageNum = 1
      this.bsList = []
      this.showloading = true
      this._formalBusinessGuide(false)
    },
    getSelId (id) {
      this.jbList = []
      this.category = id
      this.showloading = true
      this.pageNum = 1
      this._formalBusinessGuide()
    },
    toDtFn (id) {
      // this.$router.push({path: '/guideDetail', query: {id: '1'}})
      this.$router.push({path: `/guideDetail/${id}`})
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
  .businessGuide
    .bgul
      margin-top 16px
      background-color #ffffff
      .bgli
        height 99px
        display flex
        align-items center
        justify-content space-between
        padding 0 32px
        border-bottom 2px solid #eeeeee
        .bglil
          width 648px
          .bglip
            font-size 32px
            line-height 50px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
        .bg-arrri
          width 14px
          height 27px
          background url("../../assets/images/list_drop.png")
          background-size cover
          display inline-block
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
