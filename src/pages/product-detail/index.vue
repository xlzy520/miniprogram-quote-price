<template>
  <view class="product-home">
    <view class="lzy-box-shadow">
      <u-swiper :list="detail.imgUrls" height="600" img-mode="scaleToFill"></u-swiper>
    </view>
    <view class="p-3">
      <view class="name font-bold text-2xl text-red-400 mb-3">{{detail.name}}</view>
      <view class="product-detail lzy-box-shadow">
        <view class="card-title font-bold text-xl px-3 pt-3 text-red-300">产品信息</view>
        <u-cell-item title="贸易方式" :value="detail.trade_type" :arrow="false"></u-cell-item>
        <u-cell-item title="到达港口" :value="detail.port_name" :arrow="false"></u-cell-item>
        <u-cell-item title="到达港口代码" :value="detail.port_number" :arrow="false"></u-cell-item>
        <u-cell-item title="预计到港日期" :value="detail.arrive_time" :arrow="false"></u-cell-item>
        <u-cell-item title="承运商" :value="detail.carrier" :arrow="false"></u-cell-item>
        <u-cell-item title="货轮名称" :value="detail.freighter_name" :arrow="false"></u-cell-item>
        <u-cell-item title="货轮班次" :value="detail.freighter_number" :arrow="false"></u-cell-item>
        <view class="desc-title card-title font-bold text-xl px-3 pt-3 text-red-300">描述</view>
        <view class="product-desc p-3">
          <u-parse :html="detail.desc" :show-with-animation="true"></u-parse>
        </view>
      </view>
    </view>
    <view class="p-3">
      <view class="name font-bold text-2xl text-red-400 mb-3">我的历史报价</view>
      <view class="product-detail lzy-box-shadow">
        <u-cell-item title="RMB ￥145" value="2020-06-28 14:50:20" :arrow="false"></u-cell-item>
        <u-cell-item title="RMB ￥135" value="2020-06-28 14:40:20" :arrow="false"></u-cell-item>
        <u-cell-item title="RMB ￥125" value="2020-06-28 14:20:20" :arrow="false"></u-cell-item>

      </view>
    </view>
    <view class="fixed inset-x-0 px-9 z-10 footer">
      <u-button type="primary" @click="offer">输入报价</u-button>
    </view>
    <u-popup v-model="show" mode="center" class="" width="600" border-radius="30" z-index="99">
      <view class="p-3">
        <view class="name font-bold text-xl text-red-400 mb-3">请输入您的报价</view>
        <u-form :model="form" ref="uForm" label-position="top" class="lzy-form"
                :border-bottom="false">
          <u-form-item label="币种" prop="price" :border-bottom="false">
            <u-input :border="true" type="select" :select-open="currencyShow"
                     v-model="currencyLabel" placeholder="请选择学历"
                     @click="showCurrencySelect"></u-input>
            <u-select v-model="currencyShow" :list="currencyList"
                      @confirm="selectCurrency"/>
          </u-form-item>
          <u-form-item label="金额" prop="price" :border-bottom="false">
            <u-input class="u-border-bottom" v-model="form.price" type="number" focus
                     placeholder="请输入您的报价"/>
          </u-form-item>
          <u-form-item>
            <u-button type="primary" @click="submitOffer">提交</u-button>
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
  },
  methods: {
    selectCurrency(data) {
      this.form.currency = data[0].value
      this.currencyLabel = data[0].label
    },
    showCurrencySelect() {
      this.currencyShow = true
    },
    offer() {
      this.show = true
    },
    submitOffer() {
      if (!this.form.price) {
        uni.showToast({
          title: '请输入报价',
          icon: 'none'
        })
        return
      }
      uni.showModal({
        title: '提示',
        content: '确认用此价格提交？',
        success: ()=> {
          console.log(this.form)
        }
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
      })
    },
    getLocaleName(item) {
      return this.isCN ? item.name : item.name_en
    },
    handleItem(item) {
      wx.navigateTo({ url: '/pages/exhibition-detail/index?id=' + item.id })
    },
  },
  onPullDownRefresh() {

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
