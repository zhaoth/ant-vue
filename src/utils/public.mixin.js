export default {

  data () {
    return {

      screenHeight: document.body.clientHeight, // 这里是给到了一个默认值 （这个很重要）

      tableHeight: null // 表格高度

    }
  },

  watch: {

    // 监听屏幕高度改变表格高度

    screenHeight (val) {
      // 初始化表格高度

      console.log(this.$refs.xForm.offsetHeight)

      this.tableHeight = val - (this.$refs.header.offsetHeight + 150) + 'px'
    }

  },

  mounted () {
    // 监听屏幕高度

    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight

        this.screenHeight = window.screenHeight
      })()
    }
  }

}
