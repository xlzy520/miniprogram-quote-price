<script>
export default {
  onLaunch() {
    // console.log('App Launch')
    this.setLocale()
  },
  onShow() {
    // console.log('App Show')
  },
  onHide() {
    // console.log('App Hide')
  },
  methods: {
    setLocale() {
      const locale = uni.getStorageSync('lang')
      if (locale) {
        this.$i18n.locale = locale
      } else {
        uni.navigateTo({ url: '/pages/chooseLang/index' })
      }
    },
  },
}
</script>

<style>
	/*每个页面公共css */
</style>
