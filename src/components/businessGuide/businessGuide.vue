<template>
    <div class="businessGuide">
      <mheader :title="title" :backi="backi" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab :list="znList" :tabNum="tabNum" @selId="getSelId"></tab>
      <v-scroll :on-refresh="onRefresh"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        <ul class="bgul">
          <li class="bgli" v-for="(item,index) in bsList" :key="index" @click="toDtFn(item.id)">
            <div class="bglil"><p class="bglip c3">{{item.title}}</p></div>
            <i class="bg-arrri"></i>
          </li>
        </ul>
      </v-scroll>
      <div class="jbbtom c9">办事指南仅供参考，如有疑问请参考当地人社官网</div>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import tab from 'components/tab/tab'
import mheader from 'components/m-header/m-header'
import {formalBusinessGuide, formalBusinessGuideca} from 'api/api'
import loading from 'base/loading/loading'
import Scroll from 'components/pull'
export default {
  data () {
    return {
      cityCode: '',
      title: '办事指南',
      backi: false,
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
      znList: []
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
    this.showloading = true
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },

  methods: {
    titFn () {
      this.title = ''
      this.backi = true
      this.morei = false
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
            _that.busy = true
          } else {
            _that.busy = false
            _that.bsList = _that.bsList.concat(res.data.data.rows)
            console.log(_that.bsList)
          }
        } else {
          // 第一次加载数据
          _that.bsList = res.data.data.rows
          console.log(_that.bsList)
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
        that.bsList = []
        that.showloading = true
        that._formalBusinessGuide(false)
        done()
      }, 500)
    },
    loadMore: function () {
      this.busy = true
      // 多次加载数据
      setTimeout(() => {
        this.pageNum = this.pageNum + 1
        this.showloading = true
        this._formalBusinessGuide(true)
      }, 500)
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
  .businessGuide
    .bgul
      margin-top 114px
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
</style>
