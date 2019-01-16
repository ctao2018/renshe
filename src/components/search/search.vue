<template>
    <div class="search">
      <mheader :title="stit" v-if="showhd"></mheader>
      <div class="s-top" :class="{nohead: !showhd}">
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
      <!--药品-->
      <ul class="sea-jbul" v-if="ypList" >
        <li class="jbli" v-for="(item,index) in ypList" :key="index" @click="todyDtFn(item.id)">
          <p class="jblipa c3">{{item.name}}</p>
          <div class="clearfix ">
            <p class="jblipb left" v-if="item.dosageForm">{{item.dosageForm}}</p>
            <p class="jblipc right" v-if="item.category === 'A'">西药</p>
            <p class="jblipc right" v-if="item.category === 'B'">中成药</p>
            <p class="jblipc right" v-if="item.category === 'C'">中药饮片</p>
          </div>
        </li>
      </ul>
      <!--医院-->
      <ul class="syy-ul" v-if="yyList">
        <li class="ds-li" v-for="(item,index) in yyList" :key="index" @click="toyyDtFn(item.id)">
          <p class="ds-lipa c3">{{item.name}}
            <span class="h-dja" v-if="item.grade == '三级' || item.grade == '三甲'">{{item.grade}}</span>
            <span class="h-djb" v-else-if="item.grade == '二级' || item.grade == '二甲'">{{item.grade}}</span>
          </p>
          <div class="clearfix c9">
            <p class="ds-lipb left">{{item.address}}</p>
            <p class="ds-lipc right" v-if="item.dis">{{item.dis}}</p>
          </div>
        </li>
      </ul>
      <!--经办网点-->
      <ul class="sear-jbul" v-if="jbList">
        <li class="jbli" v-for="(item,index) in jbList" :key="index" @click="towdDtFn(item.id)">
          <p class="jblipa c3">{{item.name}}</p>
          <div class="clearfix c9">
            <p class="jblipb left">{{item.address}}</p>
            <p class="jblipc right" v-if="item.dis">{{item.dis}}</p>
          </div>
        </li>
      </ul>
      <!--办事指南-->
      <ul class="se-bgul" v-if="bsList">
        <li class="bgli" v-for="(item,index) in bsList" :key="index" @click="toznDtFn(item.id)">
          <div class="bglil"><p class="bglip c3">{{item.title}}</p></div>
          <i class="bg-arrri"></i>
        </li>
      </ul>
      <!--药店-->
      <ul class="sds-ul" v-if="ydList">
        <li class="ds-li" v-for="(item,index) in ydList" :key="index" @click="toydDtFn(item.id)">
          <p class="ds-lipa c3">{{item.organName}}</p>
          <div class="clearfix c9">
            <p class="ds-lipb left">{{item.organAddress}}</p>
            <p class="ds-lipc right" v-if="item.dis">{{item.dis}}</p>
          </div>
        </li>
      </ul>
      <!--常见问题-->
      <ul class="scp-ul" v-if="wtList">
        <li class="cp-li clearfix" v-for="(item,index) in wtList" :key="index" @click="showdtFn(index)">
          <div class="clearfix pb10">
            <p class="cp-lil left c3">{{item.lists.articleTitle}}</p>
            <i class="cp-arrri right" :class="{active: item.flag}"></i>
          </div>
          <div class="cp-licont" v-if="item.flag" v-html="item.lists.answer"></div>
        </li>
      </ul>
      <div class="loading-container" v-show="showloading">
        <loading></loading>
      </div>
      <bottomline :title="bltit" v-if="shownodata"></bottomline>
      <div id="icenter" style="width: 0; height: 0;"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import AMap from 'AMap'
import mheader from 'components/m-header/m-header'
import bottomline from 'components/bottomLine/bottomLine'
import {Toast} from 'vux'
import { saveSearch } from 'api/cache' // 引用本地存储js
import storage from 'good-storage' // 引入good-storage包
import {formalInsuranceDrugsInfo, formalFixHospitals, formalTransactInstitution, formalBusinessGuide, formalFixDrugstore, formalCommonQuestion} from 'api/api'
import loading from 'base/loading/loading'
export default {
  data () {
    return {
      cityCode: '',
      stit: '搜索',
      bltit: '暂无搜索结果',
      pageType: '',
      serMsg: '',
      drugskey: 'drugskey',
      hospitalkey: 'hospitalkey',
      networkkey: 'networkkey',
      drugstorekey: 'drugstorekey',
      problemkey: 'problemkey',
      guidekey: 'guidekey',
      historyxs: false,
      historybx: true,
      sslist: [],
      ypList: [],
      yyList: [],
      jbList: [],
      bsList: [],
      ydList: [],
      wtList: [],
      showhd: true,
      showloading: false,
      shownodata: false,
      pageSize: 20,
      pageNum: 1,
      jwflag: 0,
      lng: '',
      lat: '',
      ypname: '',
      yyname: '',
      jbname: '',
      znname: '',
      ydname: '',
      wtname: ''
    }
  },
  created () {
    this.sslist = []
    this.ypList = []
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
  },
  mounted () {
    //this.stit = this.$route.params.tit
    this.pageType = this.$route.params.pageType
    this.cityCode = this.$route.params.cityCode
    // console.log(this.stit, this.pageType)
    if (this.pageType === 'drugs') {
      this.getDrugshis()
      this.stit = '医保药品目录'
    } else if (this.pageType === 'hospital') {
      this.getHospitalhis()
      this.stit = '定点医院'
    } else if (this.pageType === 'managementNetwork') {
      this.getNetworkhis()
      this.stit = '社保经办网点'
    } else if (this.pageType === 'businessGuide') {
      this.getGuidehis()
      this.stit = '办事指南'
    } else if (this.pageType === 'drugstore') {
      this.getDrugstorehis()
      this.stit = '定点零售药店'
    } else if (this.pageType === 'commonProblem') {
      this.getProblemhis()
      this.stit = '常见问题'
    }
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
        if (this.pageType === 'drugs') {
          saveSearch(this.serMsg, this.drugskey)
          this.getDrugshis()
          this.ypname = this.serMsg
          this._formalInsuranceDrugsInfo()
        } else if (this.pageType === 'hospital') {
          saveSearch(this.serMsg, this.hospitalkey)
          this.getHospitalhis()
          this.yyname = this.serMsg
          this.getPosiFn()
        } else if (this.pageType === 'managementNetwork') {
          saveSearch(this.serMsg, this.networkkey)
          this.getNetworkhis()
          this.jbname = this.serMsg
          this.getPosiFn()
        } else if (this.pageType === 'businessGuide') {
          saveSearch(this.serMsg, this.guidekey)
          this.getGuidehis()
          this.znname = this.serMsg
          this._formalBusinessGuide()
        } else if (this.pageType === 'drugstore') {
          saveSearch(this.serMsg, this.drugstorekey)
          this.getDrugstorehis()
          this.ydname = this.serMsg
          this.getPosiFn()
        } else if (this.pageType === 'commonProblem') {
          saveSearch(this.serMsg, this.problemkey)
          this.getProblemhis()
          this.wtname = this.serMsg
          this._formalCommonQuestion()
        }
        this.showloading = true
        this.historybx = false
        this.serMsg = ''
      } else {
        this.$vux.toast.text('请输入需要搜索的内容！', 'middle')
        return false
      }
    },
    // 药品 获取搜索历史列表
    getDrugshis () {
      let searches = storage.get('drugskey')
      this.sslist = searches ? searches : []
      this.historyLeng()
    },
    // 医院 获取搜索历史列表
    getHospitalhis () {
      let searches = storage.get('hospitalkey')
      this.sslist = searches ? searches : []
      this.historyLeng()
    },
    // 经办网点 获取搜索历史列表
    getNetworkhis () {
      let searches = storage.get('networkkey')
      this.sslist = searches ? searches : []
      this.historyLeng()
    },
    // 办事指南 获取搜索历史列表
    getGuidehis () {
      let searches = storage.get('guidekey')
      this.sslist = searches ? searches : []
      this.historyLeng()
    },
    // 药店 获取搜索历史列表
    getDrugstorehis () {
      let searches = storage.get('drugstorekey')
      this.sslist = searches ? searches : []
      this.historyLeng()
    },
    // 常见问题 获取搜索历史列表
    getProblemhis () {
      let searches = storage.get('problemkey')
      this.sslist = searches ? searches : []
      this.historyLeng()
    },
    // 清空历史记录
    clearhis () {
      if (this.pageType === 'drugs') {
        storage.remove('drugskey')
      } else if (this.pageType === 'hospital') {
        storage.remove('hospitalkey')
      } else if (this.pageType === 'managementNetwork') {
        storage.remove('networkkey')
      } else if (this.pageType === 'businessGuide') {
        storage.remove('guidekey')
      } else if (this.pageType === 'drugstore') {
        storage.remove('drugstorekey')
      } else if (this.pageType === 'commonProblem') {
        storage.remove('problemkey')
      }
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
      if (this.pageType === 'drugs') {
        this.ypname = item
        this._formalInsuranceDrugsInfo()
      } else if (this.pageType === 'hospital') {
        this.yyname = item
        this.getPosiFn()
      } else if (this.pageType === 'managementNetwork') {
        this.jbname = item
        this.getPosiFn()
      } else if (this.pageType === 'businessGuide') {
        this.znname = item
        this._formalBusinessGuide()
      } else if (this.pageType === 'drugstore') {
        this.ydname = item
        this.getPosiFn()
      } else if (this.pageType === 'commonProblem') {
        this.wtname = item
        this._formalCommonQuestion()
      }
      this.showloading = true
      this.historybx = false
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
          that.lng = data.position.getLng() // 经度
          that.lat = data.position.getLat() // 纬度
          that.jwflag = 1
          if (that.pageType === 'managementNetwork') {
            that._formalTransactInstitution()
          } else if (that.pageType === 'hospital') {
            that._formalFixHospitals()
          } else if (that.pageType === 'drugstore') {
            that._formalFixDrugstore()
          }
        }) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', function (data) {
          if (data.info === 'FAILED') {
            console.log('获取您当前位置失败！')
            if (that.pageType === 'managementNetwork') {
              that._formalTransactInstitution()
            } else if (that.pageType === 'hospital') {
              that._formalFixHospitals()
            } else if (that.pageType === 'drugstore') {
              that._formalFixDrugstore()
            }
          }
        })
      })
    },
    // 药品列表查询
    _formalInsuranceDrugsInfo () {
      let _that = this
      formalInsuranceDrugsInfo({
        regionNo: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        category: '',
        name: this.ypname
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        _that.ypList = res.data.data.rows
        if (res.data.data.rows.length < 1) {
          _that.shownodata = true
        }
        console.log(_that.ypList)
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    // to 药品详情
    todyDtFn (id) {
      this.$router.push({path: `/drugsDetail/${id}`})
    },
    // 医院列表查询
    _formalFixHospitals () {
      let _that = this
      formalFixHospitals({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.yyname,
        longitude: this.lng,
        latitude: this.lat,
        flag: this.jwflag
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (res.data.data.rows.length < 1) {
          _that.shownodata = true
        }
        _that.yyList = res.data.data.rows
        console.log(_that.yyList)
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    // to 医院详情
    toyyDtFn (id) {
      this.$router.push({path: `/hospitalDetail/${id}`})
    },
    // 经办机构列表查询
    _formalTransactInstitution () {
      let _that = this
      formalTransactInstitution({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.jbname,
        longitude: this.lng,
        latitude: this.lat,
        flag: this.jwflag
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (res.data.data.rows.length < 1) {
          _that.shownodata = true
        }
        _that.jbList = res.data.data.rows
        console.log(_that.jbList)
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    // to 经办网点详情
    towdDtFn (id) {
      this.$router.push({path: `/networkDetail/${id}`})
    },
    // 办事指南列表查询
    _formalBusinessGuide () {
      let _that = this
      formalBusinessGuide({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        title: this.znname
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (res.data.data.rows.length < 1) {
          _that.shownodata = true
        }
        _that.bsList = res.data.data.rows
        console.log(_that.bsList)
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    // to 办事指南详情
    toznDtFn (id) {
      // this.$router.push({path: '/guideDetail', query: {id: '1'}})
      this.$router.push({path: `/guideDetail/${id}`})
    },
    // 药店列表查询
    _formalFixDrugstore (flag) {
      let _that = this
      formalFixDrugstore({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        organName: this.ydname,
        longitude: this.lng,
        latitude: this.lat,
        flag: this.jwflag
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        if (res.data.data.rows.length < 1) {
          _that.shownodata = true
        }
        _that.ydList = res.data.data.rows
        console.log(_that.ydList)
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    // to 药店详情
    toydDtFn (id) {
      this.$router.push({path: `/drugstoreDetail/${id}`})
    },
    // 常见问题列表查询
    _formalCommonQuestion () {
      let _that = this
      formalCommonQuestion({
        cityCode: this.cityCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        articleTitle: this.wtname
      }).then((res) => {
        _that.showloading = false
        // console.log('res', res)
        _that.wtList = res.data.data.rows.map((obj, index) => {
          return {
            lists: obj,
            flag: false
          }
        })
        console.log(_that.wtList)
      }).catch((res) => {
        _that.showloading = false
        console.log('error', res)
      })
    },
    showdtFn (i) {
      this.wtList[i].flag = !this.wtList[i].flag
    },
    show () {
      this.$refs.input1.blur()
      this.searchbtn()
    }
  },
  components: {
    mheader,
    Toast,
    loading,
    bottomline
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search
    background-color #ffffff
    .s-top
      margin-top 88px
      padding 30px 32px
      display flex
      align-items center
      justify-content space-between
      &.nohead
        margin-top 0px
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
    .sea-jbul
      background-color #ffffff
      .jbli
        padding:24px 32px
        border-bottom 2px solid #eeeeee
        .jblipa
          font-size 34px
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
    .syy-ul
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
          .h-dja
            color #0081EC
            font-size 24px
            display inline-block
            background-color #C5E6FE
            border-radius 2px
            padding 3px 8px
            margin-left 16px
            line-height 34px
            vertical-align middle
          .h-djb
            color #03B5A9
            font-size 24px
            display inline-block
            background-color #F3FCFB
            border-radius 2px
            padding 3px 8px
            margin-left 16px
            line-height 34px
            vertical-align middle
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
    .sear-jbul
      background-color #ffffff
      .jbli
        padding:20px 30px
        border-bottom 2px solid #eeeeee
        .jblipa
          font-size 36px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 42px
        .jblipb
          width 85%
          font-size 28px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 40px
        .jblipc
          font-size 26px
          line-height 40px
    .se-bgul
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
            font-size 36px
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
    .sds-ul
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
</style>
