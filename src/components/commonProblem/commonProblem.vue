<template>
    <div class="commonProblem">
      <mheader :title="title" :backi="backi" :zfbhd="zfbhd" :pageType="pageType" :searchi="searchi" :cityCode="cityCode" :morei="morei"></mheader>
      <tab :list="znList" @selId="getSelId"></tab>
      <v-scroll :on-refresh="onRefresh"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        <ul class="cp-ul">
          <li class="cp-li clearfix" v-for="(item,index) in bsList" :key="index" @click="showdtFn(index)">
            <div class="clearfix pb10">
              <p class="cp-lil left c3">{{item.lists.articleTitle}}</p>
              <i class="cp-arrri right" :class="{active: item.flag === 'true'}"></i>
            </div>
            <div class="cp-licont" v-if="item.flag === 'true'" v-html="item.lists.answer"></div>
          </li>
        </ul>
      </v-scroll>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <div class="cp-btom c9">常见问题仅供参考，如有疑问请参考当地人社官网</div>
    </div>
</template>

<script type="text/ecmascript-6">
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
      znList: []
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
    this._formalCommonQuestion()
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
            _that.busy = true
          } else {
            _that.busy = false
          let yList2 = res.data.data.rows
          let nList2 = []
          for (let j = 0; j<yList2.length;j++) {
            let b={flag:'flase',lists:yList2[j]}
            nList2.push(b)
          }
            _that.bsList = _that.bsList.concat(nList2)
            console.log(_that.bsList)
          }
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
          for (let i = 0; i<yList.length;i++) {
            let a={flag:'flase',lists:yList[i]}
            nList.push(a)
          }
          console.log('nList',nList)
           _that.bsList = nList
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
        that._formalCommonQuestion(false)
        done()
      }, 500)
    },
    loadMore: function () {
      this.busy = true
      // 多次加载数据
      setTimeout(() => {
        this.pageNum = this.pageNum + 1
        this.showloading = true
        this._formalCommonQuestion(true)
      }, 500)
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
  .commonProblem
    .cp-ul
      margin-top 114px
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
</style>
