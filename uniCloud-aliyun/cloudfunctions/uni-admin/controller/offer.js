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
    const {
      product_id,
    } = this.ctx.data
    return this.service.offer.getMyHistoryOffer(product_id)
  }
}
