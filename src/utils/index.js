import dayjs from 'dayjs'

export const formatTime = (time, template = 'YYYY/MM/DD HH:mm:ss') => dayjs(time).format(template)

export function getDeviceUUID() {
  const deviceId = uni.getStorageSync('uni_deviceId') ||
    uni.getSystemInfoSync().deviceId ||
    uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2)

  uni.setStorageSync('uni_deviceId', deviceId)
  return deviceId
}

export const handleLoginAuth = (successCallback, errorCallback, finallyCallback) => {
  const localUserInfo = uni.getStorageSync('wxUserInfo')
  if (localUserInfo) {
    if (finallyCallback) {
      finallyCallback()
    } else {
      successCallback && successCallback()
    }
    return
  }
  wx.getUserProfile({
    desc: '用于完善用户资料',
  }).then(res => {
    uni.setStorageSync('wxUserInfo', res.userInfo)
    successCallback && successCallback()
  }).catch((e) => {
    if (e.errMsg === 'getUserProfile:fail auth deny') {
      uni.showToast({ title: '用户信息未授权', icon: 'none'})
      // Taro.atMessage({
      //   message: getLocaleHelper().t('error.workOrder.unAuthorized'),
      //   type: 'error',
      // })
      errorCallback && errorCallback()
    }
  }).finally(() => {
    finallyCallback && finallyCallback()
  })
}
