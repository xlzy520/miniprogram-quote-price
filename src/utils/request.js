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

export default dbRequest
