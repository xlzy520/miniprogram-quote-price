const {
  Service,
} = require('uni-cloud-router')
const uniCaptcha = require('uni-captcha')

module.exports = class UserService extends Service {
  async hasAdmin() {
    const {
      total,
    } = await this.db.collection('uni-id-users').where({
      role: 'admin',
    }).count()

    return !!total
  }

  async getMyHistoryOffer(product_id) {
    const payload = {
      user_id: this.ctx.auth.uid,
      isDeleted: 0,
    }
    payload.product_id = product_id
    return this.db.collection('offer').where(payload)
      .orderBy('create_date', 'desc').get()
  }
}
