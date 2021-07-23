<template>
	<view class="layout-col-center mt-16">
    <view class="">请选择使用的语言</view>
    <view class="">Please Choose Language</view>
    <view class="layout-abs-center card-item mt-10"
          :class="item.class"
          v-for="item in cards" :key="item.title"
          @click="updateUserProductType(item)">
      <img :src="item.icon" width="30" height="30" alt="" class="card-item-icon">
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
          class: 'cn',
        },
        {
          title: 'English',
          value: 'en-US',
          icon: '/static/icon/future-product.png',
          bgImg: '/static/img/bg-record.png',
          class: 'en',
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
    updateUserProductType({ value }) {
      this.$i18n.locale = value
      uni.setStorageSync('lang', value)
      uni.showToast({ title: this.$t('choose.success') })
      uni.navigateBack();
    },
  },
}
</script>

<style lang="scss" scoped>
  .card-item{
    &.cn{
      background-image: $card-bg-blue;
    }
    &.en{
      background-image: $card-bg-green;
    }
  }
</style>
