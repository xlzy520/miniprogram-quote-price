<template>
<!--pages/mine/index.wxml-->
<view class="app-container">
  <view class="user-info ftf layout-items-center">
    <view class="avatar">
      <image :src="avatar" mode="widthFix"></image>
<!--      <view class="txt f24 layout-abs-center" @click="editUserInfo">编辑</view>-->
    </view>
    <view class="info">
      <view v-if="userInfo.mobile">
        <view class="nick-name">
          <text class="text-base">{{ userInfo.nickName || '暂无' }}</text>
          <image src="/static/icon/mine/icon-user-tag.png" mode="widthFix"></image>
        </view>
        <view class="account text-gray-500 text-xs">
          {{$t('login.phone')}}：{{ userInfo.mobile || '********' }}
        </view>
      </view>
      <view v-else class="text-base layout-col-center to-login-btn" @click="toLogin">
        {{$t('login.submit')}}</view>
    </view>
  </view>
  <view class="ctr-group">
    <view class="ctr-item layout-slide" v-for="item in navList" :key="item.title"
          @click="toPage(item)">
      <view class="layout-slide">
        <image :src="item.icon" mode="widthFix"></image>
        <view class="content">
          <view class="list-item-title f30">{{item.title}}</view>
          <view class="c6 f24">{{item.desc}}</view>
        </view>
      </view>
      <u-icon name="arrow-right" color="#CCC"></u-icon>
    </view>
  </view>
  <view v-if="userInfo.mobile" class="">
    <u-button class="confirm-btn logout" @click="logout">
      {{$t('logout.submit')}}
    </u-button>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      userInfo: {
        mobile: '12312',
      },
      navList: [
        // {
        //   title: '我的设置',
        //   desc: '姓名、手机号、地址管理',
        //   url: '/pages/mine/myInfo',
        //   icon: '/static/icon/mine/icon-user-info.png',
        // },
        {
          title: this.$t('mine.offer'),
          // desc: '我的报价记录',
          url: '/pages/mine/mySign',
          icon: '/static/icon/mine/icon-sign.png',
        }
        // {
        //   title: '我的预约',
        //   desc: '我的预约门票',
        //   url: '/pages/mine/myAppoint',
        //   icon: '/static/icon/mine/icon-appoint.png',
        // },
        // {
        //   title: '我的收藏',
        //   desc: '我感兴趣的视频内容',
        //   url: '/pages/mine/myFavorite',
        //   icon: '/static/icon/mine/icon-collection.png',
        // },
        // {
        //   title: '我的活动',
        //   desc: '我预约的活动',
        //   url: '/pages/mine/myActivity',
        //   icon: '/static/icon/mine/icon-export-apply.png',
        // },
        // {
        //   title: '关于小程序',
        //   desc: '了解小程序更多信息',
        //   url: '/pages/mine/aboutUs',
        //   icon: '/static/icon/mine/icon-about.png',
        // }

      ],
    }
  },

  components: {
  },
  props: {},
  onShow(options) {
    this.checkUserInfo()
  },
  computed: {
    avatar() {
      return this.userInfo.avatarUrl || '/static/icon/avatar.png'
    },
  },
  methods: {
    /**
     * 判断是否有用户信息，无则自动填入微信信息
     */
    checkUserInfo() {
      const userInfoStr = uni.getStorageSync('userInfo')
      const wxUserInfo = uni.getStorageSync('wxUserInfo')
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        this.userInfo = {
          ...userInfo,
          nickName: wxUserInfo.nickName,
          avatarUrl: wxUserInfo.avatarUrl,
        }
      }
    },
    findUserInfo() {
      // findUserInfo(true)
    },
    logout() {
      const localAccount = uni.getStorageSync('account')
      this.$request('user/logout').finally(() => {
        uni.removeStorageSync('accessToken')
        uni.removeStorageSync('userInfo')
        this.toLogin()
      })
    },
    toLogin() {
      uni.navigateTo({ url: '/pages/login/index' })
    },
    toPage(item) {
      uni.showToast({ title: '正在开发中...', icon: 'none' })
      // if (!this.userInfo.mobile) {
      //   this.toLogin()
      //   return
      // }
      // uni.navigateTo({ url: item.url })
    },
    editUserInfo() {
      uni.navigateTo({ url: '/pages/mine/myInfo' })
    },
  },
}
</script>
<style lang="scss">
  .app-container{
    padding: 30upx 40upx;
  }
.user-info {
  .avatar {
    position: relative;
    margin-right: 28rpx;
    width: 110rpx;
    height: 110rpx;
    border-radius: 24rpx;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
    .txt {
      position: absolute;
      padding: 3rpx 0;
      left: 0;
      bottom: 0;
      width: 100%;
      color: #fff;
      background: rgba(86, 86, 86, 0.6);
    }
  }
  .info {
    flex: 1;
    image {
      margin-left: 34rpx;
      width: 37rpx;
      height: 37rpx;
    }
  }
  .to-login-btn{
    width: 178upx;
    height: 68upx;
    background: #DBFCFF;
    border-radius: 6upx;
    color: #39D5E3;
    line-height: 45px;
  }
  .nick-name {
    margin-bottom: 6rpx;
    display: flex;
    align-items: center;
    color: #333;
    font-weight: bold;
  }
}
.apply-wrapper{
  width: 668upx;
  margin: auto;
  background: #FFFFFF;
  box-shadow: 0px 0px 30upx 0px rgba(0,145,255,0.14);
  border-radius: 24upx;
  padding: 30upx 100upx;
  line-height: 80upx;
  margin-top: 55upx;
  .apply-item{
    font-size: 32upx;
    color: #333;
    line-height: 45upx;
  }
  .apply-item-line{
    width: 1px;
    background: #E4E4E4;
    height: 80upx;
  }
}

.ctr-group {
  margin-top: 40rpx;
  padding: 0 10upx;
}

.ctr-group .ctr-item {
  padding: 25rpx 0;
}

.ctr-group .ctr-item image {
  margin-right: 36rpx;
  width: 55rpx;
  height: 55rpx;
}

.ctr-group .ctr-item .list-item-title {
  margin-bottom: 7rpx;
}
</style>
