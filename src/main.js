import Vue from 'vue'
import uView from 'uview-ui'
import i18n from '@/locale/index'

import formRules from '@/utils/formRules'
import setting from '@/setting'
import { request } from '@/utils/_request'
import dbRequest from '@/utils/request'
import dayjs from 'dayjs'

import divider from '@/components/divider'

import App from './App'

import '@/style/tailwind.css'
import '@/style/index.scss'
import UMask from 'uview-ui/components/u-mask/u-mask'
import UIcon from 'uview-ui/components/u-icon/u-icon'


Vue.component('divider', divider)
Vue.component('u-mask', UMask)
Vue.component('u-icon', UIcon)

Vue.config.productionTip = false

Vue.prototype.$request = request
Vue.prototype.$dbRequest = dbRequest
Vue.prototype.$dayjs = dayjs
Vue.prototype.$rules = formRules

Vue.prototype.$baseUrl = setting.baseUrl
Vue.prototype.$uploadUrl = setting.baseUrl + 'api/common/file/upload'

Vue.prototype.$toast = (title, icon = 'none', otherOptions) => {
  uni.showToast({ title, icon, ...otherOptions })
}

App.mpType = 'app'
Vue.use(uView)

const app = new Vue({
  i18n,
  ...App,
})
app.$mount()
