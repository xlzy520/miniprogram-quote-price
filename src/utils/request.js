const isDev = process.env.NODE_ENV === 'development'

// #ifdef H5
// #endif

/**
 *
 * @type require {UniCloud.Db} db相关操作
 */
const dbRequest = (DBQueryCommand) => new Promise((resolve, reject) => {
  DBQueryCommand.then(res => {
    resolve(res.result)
  }).catch(err => {
    uni.showToast({
      title: err.message || '请求服务失败',
      icon: 'none',
    })
    reject(err)
  }).finally(() => {
    uni.hideLoading()
  })
})

const errCodeMap = {
  TOKEN_INVALID_ANONYMOUS_USER: '当前用户为匿名身份',
}

export const errorHandler = (err) => {
  const message = errCodeMap[err.code]
  if (message) {
    uni.showToast({ title: message, icon: 'none' })
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

export default dbRequest
