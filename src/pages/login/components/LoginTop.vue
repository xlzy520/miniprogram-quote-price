<template>
  <view class="login-top">
    <view class="welcome">
      <view class="title">Hello，~</view>
      <text class="f36">{{$t('login.welcome')}}</text>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  onShow() {

  },
  onLoad(options) {

  },
  methods: {

  },
}
</script>
<style lang="scss">
  .login-top {
    padding: 0 20rpx;
    padding-bottom: 60rpx;
    .welcome {
      font-weight: 500;
      color: $uni-color-primary;
      line-height: 50rpx;
      .title {
        font-size: 70rpx;
        font-weight: 600;
        line-height: 98rpx;
        text-shadow: 0 20rpx 30rpx rgba(32, 50, 131, 0.14);
      }
    }
  }
</style>
