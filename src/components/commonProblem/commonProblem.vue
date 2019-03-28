<template>
    <div class="commonProblem">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab :list="znList" @selId="getSelId"></tab>
      <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-spinner v-show="InitialLoading" color="#26a2ff" class="toploadbx"></mt-spinner>
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
                     :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
          <ul class="cp-ul">
            <li class="cp-li clearfix" v-for="(item,index) in bsList" :key="index" @click="showdtFn(index)">
              <div class="clearfix pb10">
                <p class="cp-lil left c3">{{item.lists.articleTitle}}</p>
                <i class="cp-arrri right" :class="{active: item.flag === 'true'}"></i>
              </div>
              <div class="cp-licont" v-if="item.flag === 'true'" v-html="item.lists.answer"></div>
            </li>
          </ul>
          <div slot="top" v-if="showloadmt" class="mint-loadmore-top mintLoadM" style="text-align:center">
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
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <div class="cp-btom c9">常见问题仅供参考，如有疑问请参考当地人社官网</div>
    </div>
</template>

<script type="text/ecmascript-6">
import { Spinner } from 'mint-ui'
import tab from 'components/tab/tab'
import mheader from 'components/m-header/m-header'
import {formalCommonQuestion, queryCommonQusCategory} from 'api/api'
import loading from 'base/loading/loading'
import Scroll from 'components/pull'
export default {
  data () {
    return {
      cityCode: '',
      title: '常见问题',
      backi: false,
      zfbhd: false,
      searchi: true,
      pageType: 'commonProblem',
      morei: true,
      busy: true,
      showloading: false,
      pageSize: 10,
      pageNum: 1,
      category: '',
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
    this._queryCommonQusCategory()
    this.bsList = []
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
    this._formalCommonQuestion()
    this._queryCommonQusCategory()
    this.showloading = true
  },
  methods: {
    titFn () {
      this.zfbhd = true
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '常见问题'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // 获取分类信息
    _queryCommonQusCategory () {
      queryCommonQusCategory({
        cityCode: this.cityCode
      }).then((res) => {
        // console.log('res', res)
        this.znList = [{id: '', categoryName: '全部'}]
        this.znList = this.znList.concat(res.data.data)
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 常见问题列表查询
    _formalCommonQuestion (flag) {
      let _that = this
      formalCommonQuestion({
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
            let yList2 = res.data.data.rows
            let nList2 = []
            for (let j = 0; j<yList2.length;j++) {
              let b={flag:'flase',lists:yList2[j]}
              nList2.push(b)
            }
            _that.bsList = _that.bsList.concat(nList2)
            console.log(_that.bsList)
          }
          _that.handleBottomChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onBottomLoaded()
        } else {
          // 第一次加载数据
          // _that.bsList = res.data.data.rows.map((obj, index) => {
          //   return {
          //     lists: obj,
          //     flag: false
          //   }
          // })
          let yList = res.data.data.rows
          let nList = []
          _that.InitialLoading = false
          _that.showloadmt = true
          for (let i = 0; i<yList.length;i++) {
            let a={flag:'flase',lists:yList[i]}
            nList.push(a)
          }
          console.log('nList',nList)
          _that.bsList = nList
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
      this._formalCommonQuestion(true)
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
      this._formalCommonQuestion(false)
    },
    // 点击切换
    getSelId (id) {
      this.category = id
      this.showloading = true
      this.pageNum = 1
      this._formalCommonQuestion()
    },
    showdtFn (i) {
      if (this.bsList[i].flag === 'true') {
        this.bsList[i].flag = 'false'
      } else {
        this.bsList[i].flag = 'true'
      }
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
    'v-scroll': Scroll,
    'mt-spinner': Spinner
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .commonProblem
    .cp-ul
      margin-top 16px
      .cp-li
        padding 25px 32px
        background-color #ffffff
        margin-bottom 16px
        transition: all .2s
        .cp-lil
          width 620px
          font-size 32px
          line-height 50px
        .cp-licont
          color #888888
          font-size 28px
          line-height 45px
          padding-top 19px
          border-top 2px solid #eeeeee
        .cp-arrri
          width 14px
          height 27px
          background url("../../assets/images/list_drop.png")
          background-size cover
          display inline-block
          margin-top 12px
          &.active
            width 28px
            height 15px
            background url("../../assets/images/list_drop_pre.png")
            background-size cover
    .cp-btom
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
