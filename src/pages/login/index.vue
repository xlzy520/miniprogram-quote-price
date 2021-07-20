<template>
	<view class="login">
    <login-top />
    <view class="tabs">
      <view class="tab-item">
        <view class="item-text">{{ $t('login.smsLogin') }}</view>
        <view class="item-line"></view>
      </view>

    </view>
		<view class="login-content ftf">
			<view class="main">
        <view class="login-type-form">
          <u-form :model="loginParams" :rules="rules" ref="uForm" class="" :border-bottom="false">
            <u-form-item prop="mobile" left-icon="/static/login/account.png"
                         :left-icon-style="leftIconStyle">
              <u-input v-model="loginParams.mobile" type="number" clearable
                       left-icon="/static/login/account.png"
                       :placeholder="$t('login.phone')"
                       maxlength="11"></u-input>
            </u-form-item>
<!--            <u-form-item prop="desc" left-icon="/static/login/desc.png"-->
<!--                         :left-icon-style="leftIconStyle">-->
<!--              <u-input v-model="loginParams.desc" clearable-->
<!--                       :placeholder="$t('login.desc')"-->
<!--                       maxlength="120"></u-input>-->
<!--            </u-form-item>-->
<!--            <u-form-item prop="product_type" left-icon="/static/login/future.png"-->
<!--                         :left-icon-style="leftIconStyle">-->
<!--              <u-radio-group v-model="loginParams.product_type">-->
<!--                <u-radio :name="0">期货</u-radio>-->
<!--                <u-radio :name="1">现货</u-radio>-->
<!--              </u-radio-group>-->
<!--            </u-form-item>-->
            <u-form-item prop="smsCode" left-icon="/static/login/sms-edit.png"
                         :left-icon-style="leftIconStyle">
              <u-input :placeholder="$t('login.sms')" v-model="loginParams.code"
                       maxlength="6"></u-input>
              <template slot="right">
                <view :class="['sms-code-btn', smsCodeBtnDisabled ? 'disabled': '' ]"
                      @click="getSmsCode">
                  <text class="get-text" v-if="!smsCodeBtnDisabled">{{$t('login.sms.get')}}</text>
                  <text v-else class="sms-code-resend">{{`${codeSeconds}s`}}</text>
                </view>
              </template>
            </u-form-item>

            <!--            <u-form-item prop="password" left-icon="/static/login/pwd.png"-->
<!--                         :left-icon-style="leftIconStyle">-->
<!--              <u-input placeholder="请输入密码" v-model="loginParams.password" :type="pwdType"-->
<!--                       @click-icon="togglePwd" :password-icon="false"-->
<!--                       maxlength="20"></u-input>-->
<!--              <template slot="right">-->
<!--                <u-image :src="eyeImg" width="50" height="50" @click="togglePwd" />-->
<!--              </template>-->
<!--            </u-form-item>-->
          </u-form>
        </view>
        <u-button class="confirm-btn" :disabled="!loginParams.code" :loading="loading"
                  open-type="getUserProfile"
                  @click="handleLoginClick">
          {{$t('login.submit')}}
        </u-button>
<!--        <view class="login-footer">-->
<!--          <view class="login-footer-left" @click="register">-->
<!--            立即注册-->
<!--          </view>-->
<!--          <text class="forget" @click="forget">忘记密码</text>-->
<!--        </view>-->
      </view>
		</view>
	</view>
</template>
<script>
import { getDeviceUUID, handleLoginAuth } from '@/utils'
import LoginTop from './components/LoginTop.vue'

export default {
  components: { LoginTop },
  data() {
    return {
      loginParams: {
        mobile: '13588043792',
        code: '123456',
        // desc: 'I want你们',
        // product_type: 1,
      },
      pwdType: 'password',
      loading: false,
      codeSeconds: 0, // 验证码发送时间间隔
      loginByPass: true,
      smsCodeBtnDisabled: false,
      userInfo: null,
      interval: null,
      rules: {
        mobile: [
          {
            validator: (rule, value, callback) => this.$u.test.mobile(value),
            message: this.$t('rules.phone'),
            trigger: ['change', 'blur'],
          }
        ],
        // desc: [
        //   {
        //     required: true,
        //     message: this.$t('rules.desc'),
        //     trigger: ['change', 'blur'],
        //   }
        // ],
      },
      leftIconStyle: {
        width: '50rpx',
        height: '50rpx',
      },

    }
  },
  onLoad(options) {
  },
  onUnload() {
    this.clearSmsInterval()
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  computed: {
    eyeImg() {
      return this.pwdType ? '/static/login/eye.png' : '/static/login/eye-open.png'
    },
  },
  methods: {
    togglePwd() {
      this.pwdType = this.pwdType ? '' : 'password'
    },
    clearSmsInterval() {
      this.interval = null
      this.smsCodeBtnDisabled = false
      clearInterval(this.interval)
    },
    // 发送验证码并进入倒计时
    getSmsCode() {
      this.$request('user/setVerifyCode', {
        mobile: this.loginParams.mobile,
      }).then(res => {
        this.$toast(this.$t('login.sms.success'))
        this.smsCodeBtnDisabled = true
        this.codeSeconds = 60
        this.interval = setInterval(() => {
          if (this.codeSeconds === 0) {
            this.clearSmsInterval()
          }
          this.codeSeconds--
        }, 1000)
        console.log(res)
      }).finally(() => {
        uni.hideLoading()
      })
    },
    // 返回上一页
    navBack() {
      uni.navigateBack()
    },
    // 统一跳转路由
    navTo(url) {
      uni.navigateTo({ url })
    },
    handleLoginClick() {
      // #ifdef H5
      this.toLogin()
      // #endif

      // #ifdef MP-WEIXIN
      handleLoginAuth(null, null, this.toLogin)
      // #endif
    },
    // 提交表单
    toLogin() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.loading = true
          let origin = 'web'
          // #ifdef MP-WEIXIN
          origin = 'mp'
          // #endif
          this.$request('user/loginBySms', {
            ...this.loginParams,
            deviceId: getDeviceUUID(),
            origin,
          }).then(res => {
            res = res.data
            const userInfo = res.userInfo
            if (res.type === 'register') {
              this.$toast('注册成功, 待激活状态, 管理员将尽快进行审核。')
            } else if (userInfo.status === 0) {
              this.setLocal(res)
              if (userInfo.product_type === undefined) {
                uni.navigateTo({ url: '/pages/chooseProductType/index' })
              } else {
                uni.switchTab({ url: '/pages/index/index' })
              }
            } else if (userInfo.status === 2) {
              this.$toast('待激活状态, 管理员将尽快进行审核。')
            } else if (userInfo.status === 1) {
              this.$toast('审核拒绝, 账号已停用。')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    setLocal(res) {
      uni.setStorageSync('uni_id_token', res.token)
      uni.setStorageSync('uni_id_token_expired', res.tokenExpired)
      uni.setStorageSync('mobile', res.mobile)
      uni.setStorageSync('userInfo', JSON.stringify(res.userInfo))
    },
    register() {
      this.navTo('/pages/register-forget/index')
    },
    forget() {
      this.navTo('/pages/register-forget/index?type=forget')
    },
  },
}
</script>
<style lang="scss">
	.login {
    min-height: 100vh;
    padding: 25rpx 30rpx;
    .tabs{
      padding: 0 20rpx;
      .tab-item{
        display: inline-block;
        font-size: 36rpx;
        font-weight: 600;
        color: #333333;
        line-height: 50rpx;
      }
      .item-text{
        padding-bottom: 11rpx;
      }
      .item-line{
        width: 50%;
        margin: auto;
        height: 2rpx;
        background: $uni-border-bottom-color;
      }
    }
		.login-content {
			.main {
				.login-type-form {
          padding: 0 20rpx;
          margin-bottom: 53upx;
          .input-item {
						position: relative;
						height: 90rpx;
						line-height: 90rpx;
						margin-bottom: 30rpx;
						.iconfont {
							font-size: 50rpx;
							position: absolute;
							left: 0;
						}
						.login-type-input {
							height: 90rpx;
							padding-left: 80rpx;
							border-bottom: 1rpx solid rgba(0, 0, 0, .1);
						}
						.sms-code-btn, .sms-code-resend {
							width: 240rpx;
							font-size: 26rpx;
						}
					}
				}
				.login-footer {
          margin-top: 25rpx;
          padding: 0 50rpx;
					display: flex;
					justify-content: space-between;
          font-size: 32upx;
          color: #666;
          .login-footer-left{
            color: #333333;
          }
          .forget{
            color: #FE981F;
          }
				}
			}
		}
    ::v-deep .u-form-item--left__content__icon{
      display: flex;
    }
    // 发送验证码样式
    .sms-code-btn {
      width: 200upx;
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-left: 1px solid #ccc;
      text-align: right;
      font-size: 30rpx;
      color: $uni-color-primary;
      &.disabled{
        pointer-events: none;
        cursor: not-allowed;
      }
    }

  }
</style>
