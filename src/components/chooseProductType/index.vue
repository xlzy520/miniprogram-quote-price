<template>
	<view class="layout-col-center w-full">
    <view class="layout-abs-center card-item mt-5" v-for="item in cards" :key="item.title"
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
          title: this.$t('product.spot'),
          value: 1,
          icon: '/static/icon/spot-product.png',
          bgImg: '/static/img/bg-people.png',
        },
        {
          title: this.$t('product.futures'),
          value: 0,
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
    updateUserProductType(data) {
      this.$emit('change', data);
      // this.$request('user/updateUserProductType', {
      //   product_type: value,
      // }).then(res => {
      //   uni.getStorageSync('productType', value)
      //   uni.switchTab({ url: '/pages/index/index' })
      // })
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
