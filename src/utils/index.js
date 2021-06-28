import dayjs from 'dayjs'

export const formatTime = (time, template = 'YYYY/MM/DD HH:mm:ss') => dayjs(time).format(template)

export function getDeviceUUID() {
  const deviceId = uni.getStorageSync('uni_deviceId') ||
    uni.getSystemInfoSync().deviceId ||
    uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2)

  uni.setStorageSync('uni_deviceId', deviceId)
  return deviceId
}
