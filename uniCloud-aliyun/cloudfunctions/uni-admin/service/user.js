const {
  Service,
} = require('uni-cloud-router')
const uniCaptcha = require('uni-captcha')

module.exports = class UserService extends Service {
  async login({
    username,
    password,
    captchaText,
    captchaOptions,
  }) {
    const needCaptcha = await this.getNeedCaptcha(captchaOptions)
    if (needCaptcha) {
      if (!captchaText) {
        const captchaRes = await this.createCaptcha(captchaOptions)
        captchaRes.needCaptcha = needCaptcha
        return captchaRes
      } else {
        const verifyRes = await uniCaptcha.verify({
          captcha: captchaText,
          ...captchaOptions,
        })
        // 验证失败
        if (verifyRes.code !== 0) {
          const newCaptcha = await this.createCaptcha(captchaOptions)
          verifyRes.captchaBase64 = newCaptcha.captchaBase64
          verifyRes.needCaptcha = needCaptcha
          return verifyRes
        }
      }
    }

    const res = await this.ctx.uniID.login({
      username,
      password,
      needPermission: true,
    })
    await this.loginLog(res, captchaOptions)
    if (res.code) {
      res.needCaptcha = true
      return res
    }
    res.needCaptcha = false
    await this.checkToken(res.token, {
      needPermission: true,
      needUserInfo: false,
    })
    return res
  }

  async logout(token) {
    return await this.ctx.uniID.logout(token)
  }

  async checkToken(token) {
    const auth = await this.ctx.uniID.checkToken(token, {
      needPermission: true,
      needUserInfo: false,
    })
    if (auth.code) {
      // 校验失败，抛出错误信息
      this.ctx.throw('TOKEN_INVALID', `${auth.message}，${auth.code}`)
    }
    this.ctx.auth = auth // 设置当前请求的 auth 对象
  }

  async hasAdmin() {
    const {
      total,
    } = await this.db.collection('uni-id-users').where({
      role: 'admin',
    }).count()

    return !!total
  }

  async hasRegistered(mobile) {
    const {
      total,
    } = await this.db.collection('uni-id-users').where({
      mobile,
    }).count()

    return !!total
  }

  async getCurrentUserInfo(field = []) {
    return this.ctx.uniID.getUserInfo({
      uid: this.ctx.auth.uid,
      field,
    })
  }

  async setVerifyCode(mobile) {
    const randomStr = '00000' + Math.floor(Math.random() * 1000000)
    const code = randomStr.substring(randomStr.length - 6)
    return this.ctx.uniID.setVerifyCode({
      mobile,
      code: '123456',
      expiresIn: 180,
      type: 'login',
    })
  }

  async completeUserInfo({ product_type, desc }, token) {
    await this.checkToken(token, {
      needPermission: true,
      needUserInfo: false,
    })
    return this.ctx.uniID.updateUser({
      product_type,
      desc,
      uid: this.ctx.auth.uid,
    })
  }

  async loginBySms({ mobile, code, desc }) {
    const regInfo = await this.ctx.uniID.loginBySms({
      mobile,
      code,
      role: ['user'],
    })
    if (!regInfo.code) {
      await this.checkToken(regInfo.token, {
        needPermission: true,
        needUserInfo: false,
      })
      if (regInfo.type === 'register') {
        await this.ctx.uniID.updateUser({
          uid: regInfo.uid,
          desc,
          status: 2,
        })
        regInfo.userInfo.status = 2
      } else if (regInfo.userInfo.status !== 0) {
        return {
          success: false,
          msg: '',
          data: {
            status: regInfo.userInfo.status,
          },
        }
      } else {
        return {
          success: true,
          msg: '',
          data: {
            ...regInfo,
          },
        }
      }
    }

    return regInfo
  }

  async sendSmsCode(mobile = []) {
    const templateId = '' // 替换为自己申请的模板id
    if (!templateId) {
      return {
        code: 500,
        msg: 'sendSmsCode需要传入自己的templateId，参考https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=sendsmscode',
      }
    }
    const randomStr = '00000' + Math.floor(Math.random() * 1000000)
    const code = randomStr.substring(randomStr.length - 6)
    return this.ctx.uniID.sendSmsCode({
      mobile,
      code,
      type: 'login',
      templateId,
    })
  }

  // 登录记录
  async loginLog(res = {}, params, type = 'login') {
    const now = Date.now()
    const uniIdLogCollection = this.db.collection('uni-id-log')
    const logData = {
      deviceId: params.deviceId || this.ctx.DEVICEID,
      ip: params.ip || this.ctx.CLIENTIP,
      type,
      create_date: now,
    }

    Object.assign(logData,
      res.code === 0 ? {
        user_id: res.uid,
        state: 1,
      } : {
        state: 0,
      })

    return uniIdLogCollection.add(logData)
  }

  async getNeedCaptcha(params) {
    const now = Date.now()
    // 查询是否在 {2小时} 内 {前2条} 有 {登录失败} 数据，来确定是否需要验证码
    const recordSize = 1
    const recordDate = 120 * 60 * 1000

    const uniIdLogCollection = this.db.collection('uni-id-log')
    const recentRecord = await uniIdLogCollection.where({
      deviceId: params.deviceId || this.ctx.DEVICEID,
      create_date: this.db.command.gt(now - recordDate),
      type: 'login',
    })
      .orderBy('create_date', 'desc')
      .limit(2)
      .get(recordSize)

    return !!recentRecord.data.filter(item => item.state === 0).length
  }

  async createCaptcha(params) {
    const createRes = await uniCaptcha.create(params)
    createRes.needCaptcha = true
    return createRes
  }
}
