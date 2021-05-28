<template>
	<view class="login">
    <login-top />
    <view class="tabs">
      <view class="tab-item">
        <view class="item-text">验证码登录</view>
        <view class="item-line"></view>
      </view>

    </view>
		<view class="login-content ftf">
			<view class="main">
        <view class="login-type-form">
          <u-form :model="loginParams" :rules="rules" ref="uForm" class="" :border-bottom="false">
            <u-form-item prop="mobile" left-icon="/static/login/account.png"
                         :left-icon-style="leftIconStyle">
<!--              <u-input v-model="loginParams.account" clearable-->
<!--                       left-icon="/static/login/account.png" placeholder="请输入手机号"></u-input>-->
              <u-input v-model="loginParams.mobile" type="number" clearable
                       left-icon="/static/login/account.png" placeholder="请输入手机号"
                       maxlength="11"></u-input>
            </u-form-item>
            <u-form-item prop="smsCode" left-icon="/static/login/sms-edit.png"
                         :left-icon-style="leftIconStyle">
              <u-input placeholder="请输入验证码" v-model="loginParams.code" maxlength="6"></u-input>
              <template slot="right">
                <view :class="['sms-code-btn', smsCodeBtnDisabled ? 'disabled': '' ]"
                      @click="getSmsCode">
                  <text class="get-text" v-if="!smsCodeBtnDisabled">获取验证码</text>
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
        <u-button class="confirm-btn" :disabled="loading" :loading="loading" @click="toLogin">
          登录
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
// import { loginParams } from 'utils/devTestData'
import userApi from '@/api/user'
import { getDeviceUUID } from '@/utils'
import LoginTop from './components/LoginTop.vue'

export default {
  components: { LoginTop },
  data() {
    return {
      loginParams: {
        mobile: '13588043792',
        code: '1234',
      },
      pwdType: 'password',
      loading: false,
      codeSeconds: 0, // 验证码发送时间间隔
      loginByPass: true,
      smsCodeBtnDisabled: true,
      userInfo: null,
      interval: null,
      tabCurrentIndex: 0,
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => this.$u.test.mobile(value),
            message: '手机号码不正确',
            trigger: ['change', 'blur'],
          }
        ],
        password: [
          {
            min: 6,
            message: '密码不能少于6个字',
            trigger: 'change',
          }
        ],
      },
      typeList: [
        {
          text: '登录',
        },
        {
          text: '注册',
        }
      ],
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
      if (!this.form.graphicCode) {
        this.$u.toast('请先输入图形验证码')
        return
      }
      // if (this.form.graphicCode !== this.graphicCode) {
      //   this.$u.toast('图形验证码输入错误')
      //   return
      // }
      wx.showLoading({ title: '验证码加载中...' })
      const smsType = this.isRegister ? 1 : 0
      userApi.sendSmsCode({
        phone: this.form.account,
        code: this.form.graphicCode,
        codeUuid: this.graphicCodeData.codeUuid,
        smsType,
      }).then(res => {
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
    // 提交表单
    toLogin() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.loading = true
          // const localAccount = uni.getStorageSync('account')
          this.$request('user/login', {
            ...this.loginParams,
            deviceId: getDeviceUUID(),
            scene: 'login',
          }).then(res => {
            console.log(res)
            uni.switchTab({ url: '/pages/home/index' })
            // this.navTo('/pages/home/index')
            uni.setStorageSync('accessToken', res.accessToken)
            this.findUserInfo()
          }).catch(() => {
            uni.showToast({ title: '登录失败', icon: 'none' })
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    register() {
      this.navTo('/pages/register-forget/index')
    },
    forget() {
      this.navTo('/pages/register-forget/index?type=forget')
    },
    findUserInfo() {
      userApi.findUserInfo().then(res => {
        uni.setStorageSync('userInfo', JSON.stringify(res))
      })
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
    .input-item-sms-code {
      .input-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sms-code-btn {
        width: 200upx;
        background-color: #fff;
        display: flex;
        padding: 15upx 0;
        justify-content: center;
        align-items: center;
        border-radius: 12upx;
      }

      .sms-code-resend {
        color: #666;
      }
    }
	}
</style>
