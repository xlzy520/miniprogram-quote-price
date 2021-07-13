<template>
  <view class="title-line-header" :class="center ? 'center': ''">
    <view class="title">{{title}}</view>
    <view class="line">
      <div class="line-main"></div>
    </view>
  </view>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '立即注册~'
      },
      center: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
      };
    },
    onShow() {

    },
    onLoad(options) {

    },
    methods: {

    }
  };
</script>
<style lang="scss" scoped>
  .title-line-header{
    padding: 0 20rpx;
    &.center{
      text-align: center;
      .line{
        justify-content: center;
      }
    }
    .title{
      font-size: 50rpx;
      font-weight: 600;
      color: $uni-color-primary;
      line-height: 70rpx;
      text-shadow: 0px 10rpx 20rpx rgba(32, 50, 131, 0.14);
    }
    .line{
      margin-left: 5rpx;
      margin-top: 22rpx;
      display: flex;
      .line-main{
        width: 48rpx;
        height: 9rpx;
        background: #C8D4FF;

      }
    }
  }
</style>
