<template>
    <div class="bottomline">
      <div class="blbx">
        <span class="blbxsp">{{title}}</span>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    title: {
      type: String,
      default: '我是有底线的'
    }
  },
  data () {
    return {
    }
  },
  created () {
  },

  methods: {
  },
  components: {
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .bottomline
    .blbx
      text-align center
      display flex
      width 65%
      margin 20px auto 0
      &:before
        position: relative
        top: -1px
        flex: 1
        content: ''
        border-top: 1px solid #E5E5E5
      &:after
        position: relative
        top: -1px
        flex: 1
        content: ''
        border-top: 1px solid #E5E5E5
      .blbxsp
        position relative
        top -20px
        font-size 24px
        color #888888
        padding 10px
        display inline-block
        vertical-align middle
</style>
