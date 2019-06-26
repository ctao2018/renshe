<template>
    <div class="firstpage">
      <div class="h-bx" v-if="showtop">
        <i class="h-backi" @click="backFn()"></i>
        <span class="h-tit " >人社基础查询</span>
      </div>
      <div class="fp-top">
        <i class="fp-toppic"></i>
        <div class="fp-searbx">
          <span class="fp-sl" @click="toCityCh()">{{cityName}}<i class="fp-sli"></i></span>
          <div class="fp-sr" @click="toComSear()">
            <i class="fp-sri"></i>
            <!--<div class="fp-srr"><input class="fp-srrinp" v-model="serMsg" placeholder="试试搜索社保问题" type="text"></div>-->
            <div class="fp-srr"><span class="fp-srspa">试试搜索社保问题</span></div>
          </div>
        </div>
      </div>
      <div class="fp-bxb">
        <ul class="fp-bul">
          <li class="fp-bli" @click="topageFn(1)" v-show="jbshow">
            <i class="fp-blii fp-bia"></i>
            <p class="fp-blip">社保网点查询</p>
          </li>
          <li class="fp-bli" @click="topageFn(2)" v-show="yyshow">
            <i class="fp-blii fp-bib"></i>
            <p class="fp-blip">定点医院</p>
          </li>
          <li class="fp-bli" @click="topageFn(3)" v-show="ydshow">
            <i class="fp-blii fp-bic"></i>
            <p class="fp-blip">定点零售药店</p>
          </li>
          <li class="fp-bli" @click="topageFn(4)" v-show="wtshow">
            <i class="fp-blii fp-bid"></i>
            <p class="fp-blip">常见问题</p>
          </li>
        </ul>
      </div>
      <div class="fp-bxc" v-show="bsshow">
        <div class="fp-ctit">
          <span class="fp-ctitl"><i class="fp-ctitli"></i>办事指南</span>
          <span class="fp-ctitr" @click="toGuideFn('all')">全部</span>
        </div>
        <div class="fp-cbxcon">
          <ul class="fp-cul clearfix">
            <li class="fp-cli fp-clia" @click="toGuideFn(1)">
              <p class="fp-clipa">社保缴费</p>
              <p class="fp-clipb">新社保政策解读</p>
            </li>
            <li class="fp-cli fp-clib" @click="toGuideFn(2)">
              <p class="fp-clipa">医疗保险</p>
              <p class="fp-clipb">医疗保险报销范围</p>
            </li>
            <li class="fp-cli fp-clic" @click="toGuideFn(3)">
              <p class="fp-clipa">少儿保险</p>
              <p class="fp-clipb">新生儿如何办理</p>
            </li>
            <li class="fp-cli fp-clid" @click="toGuideFn(4)">
              <p class="fp-clipa">养老保险</p>
              <p class="fp-clipb">养老保险新政策</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="fp-bxd"  v-show="ypshow">
        <div class="fp-ctit">
          <span class="fp-ctitl"><i class="fp-ctitli"></i>其他</span>
          <span class="fp-ctitr"></span>
        </div>
        <ul class="fp-dul ">
          <li class="fp-dli" @click="toDrugsFn()">
            <i class="fp-dlii fp-dliia"></i>
            <span class="fp-dlisa">医保药品目录</span>
          </li>
        </ul>
      </div>
      <div id="icenter" style="width: 0; height: 0;"></div>
      <!-- <div @click="jumptest">test授权</div> -->
    </div>
</template>

<script type="text/ecmascript-6">
import AMap from 'AMap'
import {queryOpenCityCodeInfoByCityName, queryOpenModuleInfo,whArea} from 'api/api'
import {zfbAuthFn} from 'api/zfb_auth'
import {Toast} from 'vux'
export default {
  data () {
    return {
      serMsg: '',
      showtop: true,
      yyshow: false,
      jbshow: false,
      ydshow: false,
      ypshow: false,
      bsshow: false,
      wtshow: false,
      cityName: '选择城市',
      lng: '',
      lat: '',
      cityCode: ''
    }
  },
  created () {
    if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.titFn()
    }
    //console.log('this.$route.path',this.$route.path)
    
    //this.$store.commit('SET_CURURL', window.location.href)
    // console.log(this.$store.state.app.token)
    // console.log(this.$store.getters.token)

    // 0624test star
    let url = decodeURI(location.search)
    console.log('test',url)
      let theRequest = new Object()
      if (url.indexOf('?') !== -1) {
        let str = url.substr(1);
        let strs = str.split('&');
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
        }
      }
     console.log('theRequest',theRequest)
  },
  mounted () {
    if (this.$route.params.citycode) {
      this.cityCode = this.$route.params.citycode
      this._queryOpenModuleInfo()
      this._whArea()
    } else {
      this.getPosiFn()
    }
  },
  beforeRouteLeave (to, from, next) {
    to.meta.keepAlive = false
    next()
  },
  methods: {
    //test
    jumptest() {
      let id = encodeURIComponent('cityAdcode=440100')
      //let url = 'alipays://platformapi/startapp?appId=2018032302431666&page=pages/managementNetwork/managementNetwork&query=' + id
      //let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/managementNetwork/managementNetwork&query=' + id
      //let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/hospital/hospital&query=cityAdcode%3D440100';
      //let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/drugstore/drugstore&query=cityAdcode%3D440100'
      //let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/drugs/drugs&query=cityAdcode%3D440100'
      //let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/businessGuide/businessGuide&query=cityAdcode%3D440100'
      //let url = 'alipays://platformapi/startapp?appId=2019030563473125&page=pages/commonProblem/commonProblem&query=cityAdcode%3D440100'
      
      let backUrl = decodeURIComponent('https://test.szyibei.com/sbjccx/firstPage/')
      //let url = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017022505871867&scope=auth_base&redirect_uri=' + backUrl
      let url = 'https://test.szyibei.com/oauth2/publicAppAuthorize.htm?app_id=2017022505871867&scope=auth_base&redirect_uri=' + backUrl
      console.log(url)
      window.location.href = url
    },
    titFn () {
      this.showtop = false
      document.addEventListener('AlipayJSBridgeReady', function () {
        AlipayJSBridge.call('setTitle', {
          title: '首页'
        })
        AlipayJSBridge.call('setTransparentTitle', {
          transparentTitle: 'none'
        })
      }, false)
    },
    // to 城市选择页面
    toCityCh () {
      this.$router.push({path: '/cityChoice_2/'})
    },
    // to 综合搜索页面
    toComSear () {
      this.$router.push({path: '/comSearch/' + this.cityCode})
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
          that.cityName = data.addressComponent.city
          that.lng = data.position.getLng() // 定位成功返回的经度
          that.lat = data.position.getLat() // 定位成功返回的纬度
          that._queryOpenCityCodeInfoByCityName()
        }) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', function (data) {
          if (data.info === 'FAILED') {
            console.log('获取您当前位置失败！')
            that.cityCode = '440600'
            that._queryOpenModuleInfo()
          }
        })
      })
    },
     // 根据城市编码获取城市名字
    _whArea () {
      whArea(this.cityCode).then((res) => {
         this.cityName = res.data.data.name
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 获取城市编码
    _queryOpenCityCodeInfoByCityName () {
      let that = this
      queryOpenCityCodeInfoByCityName({
        cityName: this.cityName
      }).then((res) => {
        // console.log('res', res)
        if (res.data.code === 0) {
          that.cityCode = res.data.data.cityCode
          that._queryOpenModuleInfo()
        } else if (res.data.code === -2) {
          that.$vux.toast.text('本城市暂未开通服务,将跳转到城市选择页面!', 'middle')
          setTimeout(() => {
            this.$router.push({path: '/cityChoice_2/'})
          }, 2000)
        }
      }).catch((res) => {
        console.log('error', res)
      })
    },
    // 查询开通城市模块列表
    _queryOpenModuleInfo () {
      queryOpenModuleInfo({
        cityCode: this.cityCode
      }).then((res) => {
        console.log('res', res.data.data)
        let mkList = res.data.data
        for (let i = 0; i < mkList.length; i++) {
          if (mkList[i].moduleEn === 'fixDrugstore') {
            this.ydshow = true
          } else if (mkList[i].moduleEn === 'transactInstitution') {
            this.jbshow = true
          } else if (mkList[i].moduleEn === 'fixHospitals') {
            this.yyshow = true
          } else if (mkList[i].moduleEn === 'insuraceDrugs') {
            this.ypshow = true
          } else if (mkList[i].moduleEn === 'businessGuide') {
            this.bsshow = true
          } else if (mkList[i].moduleEn === 'commonQuestion') {
            this.wtshow = true
          }
        }
      }).catch((res) => {
        console.log('error', res)
      })
    },
    topageFn (i) {
      if (i === 1) {
        this.$router.push({path: '/managementNetwork/' + this.cityCode})
      } else if (i === 2) {
        this.$router.push({path: '/hospital/' + this.cityCode})
      } else if (i === 3) {
        this.$router.push({path: '/drugstore/' + this.cityCode})
      } else if (i === 4) {
        this.$router.push({path: '/commonProblem/' + this.cityCode})
      }
    },
    toGuideFn (i) {
      if (i === 'all') {
        this.$router.push({path: '/businessGuide/' + this.cityCode + '/' + i})
      } else if (i === 1) {
        this.$router.push({path: '/businessGuide/' + this.cityCode + '/' + 1})
      } else if (i === 2) {
        this.$router.push({path: '/businessGuide/' + this.cityCode + '/' + 3})
      } else if (i === 3) {
        this.$router.push({path: '/businessGuide/' + this.cityCode + '/' + 4})
      } else if (i === 4) {
        this.$router.push({path: '/businessGuide/' + this.cityCode + '/' + 2})
      }
    },
    toDrugsFn () {
      this.$router.push({path: '/drugs/' + this.cityCode})
    },
    backFn () {
      console.log('0')
    }
  },
  components: {
    Toast
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .firstpage
    .h-bx
      position absolute
      left 0px
      top 0px
      right 0px
      z-index 999
      height 88px
      padding 0 32px
      display flex
      align-items center
      .h-backi
        width 24px
        height 34px
        background url("../../assets/images/hone_ten_return.png")
        background-size 24px 34px
        display inline-block
      .h-tit
        font-size 38px
        line-height 55px
        margin-left 30px
        color #ffffff
    .fp-top
      position relative
      .fp-toppic
        width 750px
        height 320px
        background url("../../assets/images/hone_bnaner.png")
        background-size cover
        display inline-block
      .fp-searbx
        position absolute
        left 32px
        bottom -41px
        width 686px
        height 92px
        background-color #ffffff
        box-shadow 0px 4px 15px 0px rgba(153,153,153,0.24)
        border-radius 4px
        display flex
        align-items center
        .fp-sl
          max-width 280px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          font-size 34px
          font-weight 500
          line-height 48px
          color #333333
          margin-right 40px
          margin-left 16px
          .fp-sli
            width 9px
            height 12px
            background url("../../assets/images/sjx.png")
            background-size cover
            display inline-block
            margin-left 15px
            vertical-align middle
        .fp-sr
          flex 1
          display flex
          align-items center
          .fp-sri
            width 29px
            height 28px
            background url("../../assets/images/list_search.png")
            background-size cover
            display inline-block
            margin-right 15px
          .fp-srr
            flex 1
            .fp-srrinp
              width 100%
              height 72px
              line-height 72px
              padding 10px 0
              font-size 28px
              color #333333
              background-color #fff
            .fp-srspa
              line-height 72px
              color #999999
              font-size 28px
    .fp-bxb
      background-color #ffffff
      padding-top 100px
      padding-bottom 30px
      margin-bottom 16px
      .fp-bul
        display flex
        .fp-bli
          flex 1
          text-align center
          .fp-blii
            width 92px
            height 92px
            display inline-block
            margin-bottom 15px
            &.fp-bia
              background url("../../assets/images/hone_branches.png")
              background-size cover
            &.fp-bib
              background url("../../assets/images/hone_hospital.png")
              background-size cover
            &.fp-bic
              background url("../../assets/images/hone_medicine.png")
              background-size cover
            &.fp-bid
              background url("../../assets/images/hone_dru11.png")
              background-size cover
          .fp-blip
            color #333333
            text-align center
            font-size 26px
            line-height 32px
    .fp-bxc
      background-color #ffffff
      margin-bottom 16px
      .fp-ctit
        height 75px
        border-bottom 2px solid #eeeeee
        padding 0 32px
        display flex
        align-items center
        justify-content space-between
        .fp-ctitl
          color #333333
          font-size 28px
          font-weight 600
          .fp-ctitli
            width 8px
            height 31px
            background url("../../assets/images/hone_label.png")
            background-size cover
            display inline-block
            margin-right 15px
            vertical-align middle
        .fp-ctitr
          color #108EE9
          font-size 28px
      .fp-cbxcon
        padding 0 32px
      .fp-cul
        margin-top 20px
        margin-left -14px
        padding-bottom 22px
        .fp-cli
          float left
          margin-left 14px
          margin-bottom 14px
          width 336px
          height 162px
          &.fp-clia
            background url("../../assets/images/hone_collect.png")
            background-size cover
          &.fp-clib
            background url("../../assets/images/hone_medical.png")
            background-size cover
          &.fp-clic
            background url("../../assets/images/hone_children.png")
            background-size cover
          &.fp-clid
            background url("../../assets/images/hone_old.png")
            background-size cover
          .fp-clipa
            color #ffffff
            margin 43px 0 0 24px
            font-size 30px
            line-height 42px
            font-weight 500
          .fp-clipb
            color #ffffff
            font-size 24px
            line-height 33px
            margin-left 24px
    .fp-bxd
      background-color #ffffff
      margin-bottom 16px
      .fp-ctit
        height 75px
        border-bottom 2px solid #eeeeee
        padding 0 32px
        display flex
        align-items center
        justify-content space-between
        .fp-ctitl
          color #333333
          font-size 28px
          font-weight 600
          .fp-ctitli
            width 8px
            height 31px
            background url("../../assets/images/hone_label.png")
            background-size cover
            display inline-block
            margin-right 15px
            vertical-align middle
        .fp-ctitr
          color #108EE9
          font-size 28px
      .fp-dli
        height 136px
        padding 0 32px
        display flex
        align-items center
        .fp-dlii
          width 44px
          height 44px
          display inline-block
          margin-right 15px
          &.fp-dliia
            background url("../../assets/images/hone_drug.png")
            background-size cover
        .fp-dlisa
          color #333333
          font-size 34px
  .weui-toast__content
    font-size 26px
</style>
