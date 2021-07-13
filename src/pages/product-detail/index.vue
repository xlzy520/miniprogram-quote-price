<template>
  <view class="product-home">
    <view class="lzy-box-shadow">
      <u-swiper :list="detail.imgUrls" height="600" img-mode="scaleToFill"></u-swiper>
    </view>
    <view class="p-3">
      <view class="name font-bold text-2xl text-red-400 mb-3">{{detail.name}}</view>
      <view class="product-detail lzy-box-shadow">
        <view class="card-title font-bold text-xl px-3 pt-3 text-red-300">
          {{$t('product.detail.title')}}</view>
        <u-cell-item :title="$t('product.detail.trade_type')"
                     :value="detail.trade_type" :arrow="false"></u-cell-item>
        <u-cell-item :title="$t('product.detail.port_name')"
                     :value="detail.port_name" :arrow="false"></u-cell-item>
        <u-cell-item :title="$t('product.detail.port_number')"
                     :value="detail.port_number" :arrow="false"></u-cell-item>
        <u-cell-item :title="$t('product.detail.arrive_time')"
                     :value="detail.arrive_time" :arrow="false"></u-cell-item>
        <u-cell-item :title="$t('product.detail.carrier')"
                     :value="detail.carrier" :arrow="false"></u-cell-item>
        <u-cell-item :title="$t('product.detail.freighter_name')"
                     :value="detail.freighter_name" :arrow="false"></u-cell-item>
        <u-cell-item :title="$t('product.detail.freighter_number')"
                     :value="detail.freighter_number" :arrow="false"></u-cell-item>
        <view class="desc-title card-title font-bold text-xl px-3 pt-3 text-red-300">
          {{$t('product.detail.desc')}}</view>
        <view class="product-desc p-3">
          <u-parse :html="detail.desc" :show-with-animation="true"></u-parse>
        </view>
      </view>
    </view>
    <view class="p-3">
      <view class="name font-bold text-2xl text-red-400 mb-3">
        {{$t('product.detail.myHistoryOffer')}}</view>
      <view class="product-detail lzy-box-shadow">
        <u-cell-item v-for="item in myHistoryOfferList" :key="item._id"
                     :title="formatPrice(item)"
                     :value="formatTime(item.create_date)"
                     :arrow="false"></u-cell-item>

      </view>
    </view>
    <view class="fixed inset-x-0 px-9 z-10 footer">
      <u-button type="primary" @click="openOfferModal">{{$t('product.action.offer')}}</u-button>
    </view>
    <u-popup v-model="show" mode="center" class="" width="600" border-radius="30" z-index="99">
      <view class="p-3">
        <view class="name font-bold text-xl text-red-400 mb-3">
          {{$t('product.action.offer.label')}}</view>
        <u-form :model="form" ref="uForm" label-position="top" class="lzy-form"
                :border-bottom="false">
          <u-form-item :label="$t('common.currency')" prop="price" :border-bottom="false">
            <u-input :border="true" type="select" :select-open="currencyShow"
                     v-model="currencyLabel"
                     @click="showCurrencySelect"></u-input>
            <u-select v-model="currencyShow" :list="currencyList"
                      @confirm="selectCurrency"/>
          </u-form-item>
          <u-form-item :label="$t('common.price')" prop="price" :border-bottom="false">
            <u-input class="u-border-bottom" v-model="form.price" type="number" focus
                     :placeholder="$t('product.action.offer.label')"/>
          </u-form-item>
          <u-form-item>
            <u-button type="primary" @click="submitOffer">{{$t('common.submit')}}</u-button>
          </u-form-item>
        </u-form>
      </view>

    </u-popup>

  </view>
</template>

<script>
import { ProductTypeEnum, TradeTypeEnum, CurrencyEnum } from '@/utils/enum'
import { formatTime } from '@/utils'

const db = uniCloud.database()
const dbCName = 'uni-id-product'
const offerDBName = 'offer'
export default {
  name: 'Product-Detail',
  data() {
    const currencyList = CurrencyEnum.map((v, index) => ({ label: v, value: index }))
    return {
      list: [],
      id: '',
      show: false,
      currencyShow: false,
      form: {
        currency: 0,
        price: '',
      },
      currencyLabel: 'RMB',
      currencyList,
      detail: {
        imgUrls: [],
      },
      myHistoryOfferList: []
    }
  },
  onLoad() {
    const query = this.$route.query
    if (query.id) {
      this.id = query.id
      this.getDetail()
    }
  },
  computed: {
    isCN() {
      return uni.getStorageSync('lang') === 'zh-CN'
    },
    userID() {
      const userInfo = uni.getStorageSync('userInfo')
      const id = typeof userInfo === 'string' ? JSON.parse(userInfo)._id : userInfo._id
      return id
    },
  },
  methods: {
    formatPrice(data){
      const currency = CurrencyEnum[data.currency]
      const amount = data.amount
      return `${currency} ￥${amount}`
    },
    selectCurrency(data) {
      this.form.currency = data[0].value
      this.currencyLabel = data[0].label
    },
    showCurrencySelect() {
      this.currencyShow = true
    },
    openOfferModal() {
      this.show = true
    },
    offer() {
      db.collection(offerDBName).add({
        product_id: this.id,
        amount: this.form.price,
        user_id: this.userID,
        currency: this.form.currency,
      }).then(res => {
        uni.showToast({
          title: this.$t('common.success'),
          icon: 'success',
        })
        this.getMyHistoryOffer()
      }).finally(() => {
        this.show = false
      })
    },
    submitOffer() {
      if (!this.form.price) {
        uni.showToast({
          title: this.$t('product.action.offer.label'),
          icon: 'none',
        })
        return
      }
      uni.showModal({
        title: this.$t('common.tips'),
        content: this.$t('product.action.offer.confirm'),
        success: () => {
          console.log(this.form)
          this.offer()
        },
      })
    },
    getDetail() {
      uni.showLoading()
      this.$dbRequest(db.collection(dbCName).doc(this.id).get({ getOne: true })).then((res) => {
        const data = res.data
        this.detail = {
          ...data,
          trade_type: TradeTypeEnum[data.trade_type],
          arrive_time: formatTime(data.arrive_time),
        }
      }).finally(() => {
        uni.hideLoading()
        uni.stopPullDownRefresh()
      })
    },
    getMyHistoryOffer() {
      this.$request('offer/getMyHistoryOffer').then(res => {
        this.myHistoryOfferList = res.data
        console.log(res);
        // uni.setStorageSync('productType', this.form.product_type)
        // uni.switchTab({ url: '/pages/index/index' })
      }).finally(() => {
        uni.hideLoading()
      })
      // this.$dbRequest(db.collection(offerDBName).where({
      //   user_id: this.userID,
      //   isDeleted: 0,
      // }).get()).then((res) => {
      //   const data = res.data
      // })
    },
    getLocaleName(item) {
      return this.isCN ? item.name : item.name_en
    },
    handleItem(item) {
      wx.navigateTo({ url: '/pages/exhibition-detail/index?id=' + item.id })
    },
  },
  onPullDownRefresh() {
    this.getDetail()
    this.getMyHistoryOffer()
  },
  onReachBottom() {
  },

}
</script>

<style lang="scss" scoped>
.product-home{
  padding-bottom: 180upx;
}
.product-detail{
  border-top: 1px solid #f3f3f3;
}
.footer{
  bottom: 60upx;
}
</style>
