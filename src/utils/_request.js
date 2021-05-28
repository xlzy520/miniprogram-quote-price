function reLaunchToLogin(code) {
  if (typeof code === 'string' && code.indexOf('TOKEN_INVALID') === 0) {
    uni.reLaunch({
      url: '/pages/login/index',
    })
  }
}

const db = uniCloud.database()

db.on('error', function ({
  code, // 错误码详见https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=returnvalue
  message,
}) {
  reLaunchToLogin(code)
})

export function request(action, data, {
  functionName = 'uni-admin',
  showModal = true,
} = {}) {
  return uniCloud.callFunction({
    name: functionName,
    data: {
      action,
      data,
    },
  }).then(({
    result,
  }) => {
    if (!result) {
      return Promise.resolve(result)
    }
    if (result.code) {
      reLaunchToLogin(result.code)
      // const err = new Error(result.message)
      // err.code = result.code
      const err = result
      return Promise.reject(err)
    }
    const {
      token,
      tokenExpired,
    } = result
    if (token && tokenExpired) {
      store.commit('user/SET_TOKEN', {
        token,
        tokenExpired,
      })
    }
    return Promise.resolve(result)
  }).catch(err => {
    showModal && uni.showModal({
      content: err.message || '请求服务失败',
      showCancel: false,
    })
    return Promise.reject(err)
  })
}
