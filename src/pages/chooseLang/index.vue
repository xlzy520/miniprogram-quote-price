<template>
	<view class="layout-col-center mt-16">
    <view class="">请选择使用的语言</view>
    <view class="">Please Choose Language</view>
    <view class="layout-abs-center card-item mt-10" v-for="item in cards" :key="item.title"
          :style="cardStyle(item)" @click="updateUserProductType(item)">
      <img :src="item.icon" width="30" height="30" alt="">
      <text class="text-xl text-white ml-10">{{item.title}}</text>
    </view>
	</view>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      cards: [
        {
          title: '中文',
          value: 'zh-CN',
          icon: '/static/icon/spot-product.png',
          bgImg: '/static/img/bg-people.png',
        },
        {
          title: 'English',
          value: 'en-US',
          icon: '/static/icon/future-product.png',
          bgImg: '/static/img/bg-record.png',
        }
      ],
    }
  },
  onLoad() {
    // const query = this.$route.query
    // if (query.openId) {
    //   console.log(query)
    //   uni.setStorageSync('openId', query.openId)
    // }
  },
  methods: {
    cardStyle(item) {
      return {
        background: `url(${item.bgImg})`,
        backgroundSize: '277px',
        backgroundRepeat: 'no-repeat',
      }
    },
    updateUserProductType({ value }) {
      this.$i18n.locale = value
      uni.setStorageSync('lang', value)
    },
  },
}
</script>

<style lang="scss" scoped>
  .card-item{
    width: 554upx;
    height: 172upx;
    border-radius: 20upx;
  }
</style>
