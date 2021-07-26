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

  async loginBySms({
    mobile, code, desc, origin, deviceId, wxUserInfo, wxLoginCode,
  }) {
    try {
      // const codeRes = await this.setVerifyCode(mobile, code)
      // if (codeRes) {
      //   console.log(codeRes);
      // }
      const loginResult = await this.ctx.uniID.loginBySms({
        mobile,
        code,
        role: ['user'],
      })
      await this.loginLog(loginResult, { origin, deviceId }, loginResult.type)
      if (!loginResult.code) {
        await this.checkToken(loginResult.token, {
          needPermission: true,
          needUserInfo: false,
        })
        // 注册
        if (loginResult.type === 'register') {
          let payload = {
            uid: loginResult.uid,
            desc,
            status: 2,
          }
          if (wxUserInfo) {
            const res = await this.ctx.uniID.code2SessionWeixin({
              code: wxLoginCode,
            })
            const { openid: wx_openid, unionid: wx_unionid } = res
            payload = {
              ...payload, ...wxUserInfo, origin, wx_unionid, wx_openid,
            }
          }
          await this.ctx.uniID.updateUser(payload)
          loginResult.userInfo.status = 2
        } else if (loginResult.userInfo.status !== 0) {
          // 正常登陆
          if (wxUserInfo.nickName !== loginResult.userInfo.nickName ||
            wxUserInfo.avatarUrl !== loginResult.userInfo.avatarUrl) {
            await this.ctx.uniID.updateUser({ ...wxUserInfo, uid: loginResult.uid })
          }
          return {
            code: 0,
            status: loginResult.userInfo.status,
            product_type: loginResult.userInfo.product_type,
            ...loginResult,
          }
        }
      }

      if (loginResult.userInfo) {
        if (wxUserInfo.nickName !== loginResult.userInfo.nickName ||
          wxUserInfo.avatarUrl !== loginResult.userInfo.avatarUrl) {
          const resWeixin = await this.ctx.uniID.code2SessionWeixin({
            code: wxLoginCode,
          })
          const { openid: wx_openid, unionid: wx_unionid } = resWeixin
          const updateRes = await this.ctx.uniID.updateUser({
            ...wxUserInfo,
            uid: loginResult.uid,
            wx_unionid,
            wx_openid,
          })
        }
        return {
          code: 0,
          status: loginResult.userInfo.status,
          product_type: loginResult.userInfo.product_type,
          ...loginResult,
        }
      }

      return {
        code: 0,
        ...loginResult,
      }
    } catch (e) {
      return e
    }
  }

  async code2SessionWeixin({ code }) {
    const appid = ''
  }

  // 微信小程序通知账号审核结果
  async sendTmpMessage() {
  // async sendTmpMessage({ openid, uid }) {
    const token = await this.getAccessToken()
    const res = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`, {
        method: 'POST',
        contentType: 'json',
        data: {
          touser: 'oF8WN5IUyCtUVBPcjBqvYSRODcsM',
          template_id: 'llTbB84LyUnMGYtHNrzQJomvy-6oQkfV3PAhyDwcKIE',
          data: {
            phrase1: {
              value: '审核中',
            },
            thing2: {
              value: '2015年01月05日 12:30',
            },
            thing3: {
              value: '腾讯微信总部',
            },
            time4: {
              value: '2020-03-20',
            },
            phone_number5: {
              value: '13388888888',
            },
          },
        },
        dataType: 'json', // 指定返回值为json格式，自动进行parse
      }
    )
    console.log(res.data)
    return res.data
  }

  async getAccessToken() {
    const result = await uniCloud.httpclient.request('https://api.weixin.qq.com/cgi-bin/token', {
      method: 'GET',
      contentType: 'json',
      data: {
        grant_type: 'client_credential',
        secret: '77847ec99e1dc3006100a53687c1dc8a',
        appid: 'wx7f8b189a342eb7ba',
      },
      dataType: 'json', // 指定返回值为json格式，自动进行parse
    })
    console.log(result.data)
    return result.data.access_token
  }

  async setVerifyCode(mobile, code) {
    return this.ctx.uniID.setVerifyCode({
      mobile,
      code: '123456',
      expiresIn: 180,
      type: 'login',
    })
  }

  async sendSmsCode(mobile) {
    return uniCloud.callFunction({
      name: 'aliSendCode',
      data: {
        mobile,
      },
    })
    // return this.ctx.uniID.sendSmsCode({
    //   mobile,
    //   code,
    //   type: 'login',
    //   templateId,
    // })
  }

  // 登录记录
  async loginLog(res = {}, params, type = 'login') {
    const now = Date.now()
    const uniIdLogCollection = this.db.collection('uni-id-log')
    console.log(this.ctx.context.CLIENTIP)
    const logData = {
      deviceId: params.deviceId || this.ctx.context.DEVICEID,
      ip: this.ctx.context.CLIENTIP,
      type,
      origin: params.origin,
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
