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

  async getMyHistoryOffer() {
    return this.db.collection('offer').where({
      user_id: this.ctx.auth.uid,
      isDeleted: 0,
    }).orderBy('create_date', 'desc').get()
  }
}
