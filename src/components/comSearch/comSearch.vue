<template>
    <div class="comsearch">
      <mheader :title="stit" v-if="showhd"></mheader>
      <div class="s-topbx" :class="{nohead: !showhd}">
        <div class="s-top" >
          <div class="s-sebx">
            <i class="s-sebxi"></i>
            <div class="s-sebxr">
              <form action="javascript:return true;">
                <input class="s-sebxinp" @keyup.13=show() type="search" ref="input1" v-model="serMsg" placeholder="搜索" >
              </form>
            </div>
          </div>
          <span class="s-sebtnt" @click="searchbtn()">搜索</span>
        </div>
        <div class="s-lsbx" v-if="historybx">
          <h2 class="s-lsbxh c3">搜索历史</h2>
          <ul class="s-lsbxul clearfix" v-if="historyxs">
            <li class="s-lsbxli left c3" v-for="(item,index) in sslist" :key="index" @click="searHis(item)">{{item}}</li>
          </ul>
          <div class="s-qcbx" v-if="historyxs"><span class="s-qcbxsa" @click="clearhis()">清除历史记录</span></div>
        </div>
      </div>
      <div v-if="showbsList">
        <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }">
          <mt-spinner v-show="InitialLoading" color="#26a2ff" class="toploadbx"></mt-spinner>
          <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
                       :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                       :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul class="se-bgul" v-if="bsList">
              <li class="bgli" v-for="(item,index) in bsList" :key="index" @click="toznDtFn(item.id,item.type)">
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
          </mt-loadmore>
        </div>
      </div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <bottomline style="margin-top: 100px" :title="bltit" v-if="shownodata"></bottomline>
      <div id="icenter" style="width: 0; height: 0;"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import { Spinner } from 'mint-ui'
import mheader from 'components/m-header/m-header'
import bottomline from 'components/bottomLine/bottomLine'
import {Toast} from 'vux'
import { saveSearch } from 'api/cache' // 引用本地存储js
import storage from 'good-storage' // 引入good-storage包
import {queryTitleOrContentByKey} from 'api/api'
import loading from 'base/loading/loading'
import Scroll from 'components/pull'
export default {
  data () {
    return {
      cityCode: '',
      stit: '搜索',
      bltit: '暂无搜索结果',
      serMsg: '',
      searkey: 'searkey',
      historyxs: false,
      historybx: true,
      sslist: [],
      bsList: [],
      showhd: true,
      showloading: false,
      shownodata: false,
      lodingTxt: false,
      showbsList: true,
      pageSize: 15,
      pageNum: 1,
      busy: true,
      serkey: '',
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
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },
  mounted () {
    if (this.$route.params.citycode) {
      this.cityCode = this.$route.params.citycode
    } else {
      this.cityCode = '440600'
    }
    this.wrapperHeight = document.documentElement.clientHeight
    this.shownodata = false
    this.getsearchhis()
  },
  methods: {
    // 是否显示头部
    titFn () {
      this.showhd = false
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: this.stit
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    searchbtn () {
      if (this.serMsg) {
        saveSearch(this.serMsg, this.searkey)
        this.bsList = []
        this.pageNum = 1
        this.serkey = this.serMsg
        this._queryTitleOrContentByKey()
        this.serMsg = ''
        this.historybx = false
        this.showloading = true
      } else {
        this.$vux.toast.text('请输入需要搜索的内容！', 'middle')
        return false
      }
    },
    // 获取搜索历史列表
    getsearchhis () {
      let searches = storage.get('searkey')
      this.sslist = searches ? searches : []
      this.historyLeng()
    },
    // 清空历史记录
    clearhis () {
      storage.remove('searkey')
      this.sslist = []
      this.historyxs = false
    },
    // 判断是否有搜索历史
    historyLeng () {
      if (this.sslist.length > 0) {
        this.historyxs = true
      } else {
        this.historyxs = false
      }
    },
    // 直接点击记录查询
    searHis (item) {
      this.serkey = item
      this._queryTitleOrContentByKey()
      this.showloading = true
      this.lodingTxt = false
      this.historybx = false
    },
    // 列表查询
    _queryTitleOrContentByKey (flag) {
      this.shownodata = false
      this.lodingTxt = false
      let _that = this
      queryTitleOrContentByKey({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        key: this.serkey
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (flag) {
          // 多次加载数据
          if (res.data.data.rows.length === 0) {
            this.lodingTxt = true
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
          _that.bsList = res.data.data.rows
          _that.handleTopChange('loadingEnd') // 数据加载完毕 修改状态码
          _that.$refs.loadmore.onTopLoaded()
          if (_that.bsList.length === 0) {
            _that.shownodata = true
            _that.showbsList = false
          } else {
            _that.showbsList = true
          }
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
      this.lodingTxt = false
      this.pageNum += 1
      this._queryTitleOrContentByKey(true)
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
      this.lodingTxt = false
      this._queryTitleOrContentByKey(false)
    },
    // to 详情
    toznDtFn (id, type) {
      if (type === 'businessGuide') {
        this.$router.push({path: `/guideDetail/${id}`})
      } else if (type === 'commonQuestion') {
        this.$router.push({path: `/comQuestDetail/${id}`})
      } else if (type === 'policy') {

      }
    },
    show () {
      this.$refs.input1.blur()
      this.searchbtn()
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
    Toast,
    loading,
    bottomline,
    'v-scroll': Scroll,
    'mt-spinner': Spinner
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .comsearch
    background-color #ffffff
    .s-topbx
      position absolute
      left 0px
      right 0px
      top 0px
      background-color #ffffff
      z-index 99
      padding-top 100px
      padding-bottom 10px
      &.nohead
        padding-top 0px
    .s-top
      padding 0px 32px
      display flex
      align-items center
      justify-content space-between
      .s-sebx
        width 590px
        height 70px
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
            padding 10px 0
            font-size 28px
            color #333333
            background-color #f5f5f5
            outline none
      .s-sebtnt
        font-size 32px
        color #108EE9
    .s-lsbx
      margin-top 30px
      padding 0 32px
      .s-lsbxh
        font-size 36px
        font-weight 600
        margin-bottom 28px
      .s-lsbxul
        margin-left -24px
        .s-lsbxli
          margin 0 0 24px 24px
          padding 16px 24px
          font-size 28px
          background-color #f5f5f5
    .s-qcbx
      margin-top 24px
      padding-top 30px
      border-top 2px solid #eeeeee
      .s-qcbxsa
        color #108EE9
        font-size 32px
    .se-bgul
      background-color #ffffff
      margin-top 8px
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
    .scp-ul
      .cp-li
        padding 25px 32px
        background-color #ffffff
        border-bottom 2px solid #eeeeee
        transition: all .2s
        .cp-lil
          width 620px
          font-size 36px
          line-height 50px
        .cp-licont
          color #888888
          font-size 32px
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
    .yo-scroll
      top: 0px
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
