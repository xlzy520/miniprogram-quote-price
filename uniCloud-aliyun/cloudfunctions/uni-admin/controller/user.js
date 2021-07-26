const {
  Controller,
} = require('uni-cloud-router')

module.exports = class UserController extends Controller {
  async login() {
    const {
      username,
      password,
      captchaText,
      captchaOptions,
    } = this.ctx.data
    return this.service.user.login({
      username,
      password,
      captchaText,
      captchaOptions,
    })
  }

  async loginBySms() {
    const {
      mobile,
      code,
      desc,
      origin,
      deviceId,
      wxUserInfo,
      wxLoginCode,
    } = this.ctx.data
    if (!code) {
      return {
        code: 500,
        msg: '请填写验证码',
      }
    }
    if (!/^1\d{10}$/.test(mobile)) {
      return {
        code: 500,
        msg: '手机号码填写错误',
      }
    }
    // res = await uniIDIns.loginBySms(params)

    return this.service.user.loginBySms({
      mobile,
      code,
      desc,
      origin,
      deviceId,
      wxUserInfo,
      wxLoginCode,
    })
  }

  async register() {
    const {
      username,
      password,
      ...params
    } = this.ctx.data
    const admin = await this.service.user.hasAdmin()
    if (admin) {
      return {
        code: 10001,
        message: '超级管理员已存在，请登录...',
      }
    }

    return this.ctx.uniID.register({
      username,
      password,
      role: ['admin'],
      ...params,
    })
  }

  async logout() {
    return this.service.user.logout(this.ctx.event.uniIdToken)
  }

  async completeUserInfo() {
    const {
      product_type, desc,
    } = this.ctx.data
    return this.service.user.completeUserInfo({ product_type, desc }, this.ctx.event.uniIdToken)
  }

  async setVerifyCode() {
    const {
      mobile, code,
    } = this.ctx.data
    return this.service.user.setVerifyCode(mobile, code)
  }
  
  async sendMessage() {
    const {
      uid,
    } = this.ctx.data
    return this.service.user.sendTmpMessage(uid)
  }

  async sendSmsCode() {
    const {
      mobile,
    } = this.ctx.data
    return this.service.user.sendSmsCode(mobile)
  }

  async createCaptcha() {
    return await this.service.user.createCaptcha(this.ctx.data)
  }

  async getNeedCaptcha() {
    return await this.service.user.getNeedCaptcha(this.ctx.data)
  }

  async getCurrentUserInfo() {
    return this.service.user.getCurrentUserInfo(this.ctx.data.uid)
  }
}
