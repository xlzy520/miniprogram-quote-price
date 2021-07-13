import Vue from 'vue'
import VueI18n from 'vue-i18n'

import cn from './zh-cn'
import en from './en'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    'en-US': en,
    'zh-CN': cn,
  },
})

export default i18n
