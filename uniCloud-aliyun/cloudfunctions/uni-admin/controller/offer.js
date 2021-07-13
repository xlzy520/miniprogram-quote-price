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

  async getMyHistoryOffer() {
    return this.service.offer.getMyHistoryOffer(this.ctx.data.uid)
  }
}
