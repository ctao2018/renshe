<template>
    <div class="m-header">
        <div class="h-bx" :class="{nobtline: zfbhd}">
          <div class="h-bxl" v-if="!zfbhd">
            <i class="h-backi" v-if="!backi" @click="backFn()"></i>
            <span class="h-tit c3" v-if="title">{{title}}</span>
          </div>
          <div class="h-bxr" v-if="!zfbhd">
            <i class="h-fdji" v-if="searchi" @click="toSearFn()"></i>
            <i class="h-more" v-if="morei"></i>
          </div>
          <div class="h-sebx" v-if="zfbhd" @click="toSearFn()">
            <i class="h-sebxi"></i>
            <div class="h-sebxr">
              <span>搜索</span>
            </div>
          </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: ''
    },
    cityCode: {
      type: String,
      default: ''
    },
    searchi: {
      type: Boolean,
      default: false
    },
    morei: {
      type: Boolean,
      default: false
    },
    backi: {
      type: Boolean,
      default: false
    },
    zfbhd: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    backFn () {
      this.$router.go(-1)
    },
    toSearFn () {
      // this.$router.push({name: 'search', params: {tit: this.title, pageType: this.pageType}})
      if (this.pageType === 'commonProblem') {
        this.title = '常见问题'
      } else if (this.pageType === 'managementNetwork') {
        this.title = '社保经办网点'
      } else if (this.pageType === 'hospital') {
        this.title = '定点医院'
      } else if (this.pageType === 'drugstore') {
        this.title = '定点零售药店'
      } else if (this.pageType === 'businessGuide') {
        this.title = '办事指南'
      } else if (this.pageType === 'drugs') {
        this.title = '医保药品目录'
      }
      this.$router.push({path: `/search/${this.pageType}/${this.cityCode}`})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .m-header
      position fixed
      left 0px
      top 0px
      right 0px
      z-index 999
      .h-bx
        background-color #ffffff
        height 88px
        padding 0 32px
        display flex
        align-items center
        justify-content space-between
        border-bottom 2px solid #eeeeee
        &.nobtline
          border-bottom 2px solid #ffffff
        .h-backi
          width 24px
          height 34px
          background url("../../assets/images/nav_return.png")
          background-size 24px 34px
          display inline-block
        .h-tit
          font-size 38px
          line-height 55px
          margin-left 30px
        .h-bxr
          display flex
          align-items center
          justify-content flex-end
          .h-fdji
            width 39px
            height 39px
            background url("../../assets/images/nav_search.png")
            background-size cover
            display inline-block
            margin-right 40px
          .h-more
            width 38px
            height 6px
            background url("../../assets/images/nav_more.png")
            background-size cover
            display inline-block
        .h-sebx
          width 100%
          height 60px
          background-color #f5f5f5
          border-radius 2px
          display flex
          align-items center
          .h-sebxi
            width 29px
            height 28px
            background url("../../assets/images/list_search.png")
            background-size cover
            display inline-block
            margin 0 15px 0 24px
          .h-sebxr
            flex 1
            color #999999
            font-size 28px
</style>
