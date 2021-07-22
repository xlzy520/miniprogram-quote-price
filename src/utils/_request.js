function reLaunchToLogin(code) {
  if (typeof code === 'string' && code.indexOf('TOKEN_INVALID') === 0) {
    uni.showToast({ title: 'token已过期', icon: 'none' })
    uni.reLaunch({
      url: '/pages/login/index',
    })
  }
}

const db = uniCloud.database()

const errorMap = {
  INVOKE_FUNCTION_FAILED: '接口超时，请稍后再试',
}

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
    console.log(result, '===========打印的 ------ ')
    if (!result) {
      return Promise.reject(result)
    }
    if (result.code) {
      reLaunchToLogin(result.code)
      return Promise.reject(result)
    }
    const {
      token,
      tokenExpired,
    } = result
    if (token && tokenExpired) {
      // store.commit('user/SET_TOKEN', {
      //   token,
      //   tokenExpired,
      // })
    }
    if (result.code === 0 || !result.code) {
      return Promise.resolve(result)
    } else {
      return Promise.reject(result)
    }
  }).catch(err => {
    if (showModal) {
      uni.showToast({
        title: errorMap[err.code] || err.message || '请求服务失败',
        showCancel: false,
        icon: 'none',
      })
    }
    return Promise.reject(err)
  })
}
