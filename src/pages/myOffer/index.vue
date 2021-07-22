<template>
  <view class="p-3 product-home">
    <unicloud-db ref="udb" @error="handleError"
                 collection="offer,uni-id-product" :options="pageOptions"
                 :where="where"
                 loadtime="manual"
                 field="_id,user_id,product_id{name,name_en,type},amount,currency,create_date"
                 page-data="add" :orderby="orderby" :getcount="true"
                 :page-size="pageOptions.size"
                 :page-current="pageOptions.current"
                 v-slot:default="{data,loading}">
      <view class="layout-abs-center min-h-80vh" v-if="loading">
        <u-loading mode="circle" color="#2d8cf0" size="72"></u-loading>
      </view>
      <view v-else class="layout-items-center flex-col pt-3 offer-list">
        <view v-for="(item, index) in formatExcelData(data)" :key="index"
              class="w-full p-2 offer-item">
          <view class="layout-slide">
            <view class="font-medium text-base text-red-400 product-name" @click="goProduct(item)">{{item.name}}</view>
            <view class="text-gray-600 text-sm">{{item.create_date}}</view>
          </view>
          <view class="layout-items-center justify-end mt-2">
            <view class="text-red-700 mr-5">￥ {{item.amount}}</view>
            <view class="text-blue-400">{{item.currency}}</view>
          </view>
<!--          <u-image :src="item.imgUrls" width="320rpx" height="320rpx" mode=""></u-image>-->
<!--          <view class="text">-->
<!--            <view class="title text-base text-center">{{ getLocaleName(item) }}</view>-->
<!--          </view>-->
        </view>
      </view>
      <u-empty class="min-h-80vh" mode="search" v-if="!loading && !data.length"></u-empty>
    </unicloud-db>
  </view>
</template>

<script>
import { formatTime } from '@/utils'
import { ProductTypeEnum, TradeTypeEnum, CurrencyEnum } from '@/utils/enum'

export default {
  name: '',
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      keyword: '',
      where: {
        isDeleted: 0,
        // 'product_id.type': 1,
        user_id: '60f834b990c2ba000194cea4',
      },
      loading: false,
      orderby: 'create_date',
      pageOptions: {
        size: 20,
        current: 1,
      },
    }
  },
  computed: {
    isCN() {
      return uni.getStorageSync('lang') === 'zh-CN'
    },
  },
  mounted() {
    const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
    // this.where.user_id = userInfo._id
    console.log(this.where)
    this.loadData()
  },
  methods: {
    goProduct(item) {
      uni.navigateTo({ url: '/pages/product-detail/index?id=' + item.productId })
    },
    formatExcelData(data) {
      return data.map(v => {
        const product = v.product_id[0] || {}
        return {
          ...v,
          create_date: formatTime(v.create_date),
          currency: CurrencyEnum[v.currency],
          name: this.isCN ? product.name : product.name_en,
          productId: product._id,
        }
      })
    },
    getMyHistoryOffer(isRefresh) {
      this.$request('offer/getMyHistoryOffer').then(res => {
        if (isRefresh) {
          uni.showToast({
            title: this.$t('common.refresh.success'),
            icon: 'success',
          })
        }
        // this.myHistoryOfferList = (res.data || []).map(v => ({
        //   ...v,
        //   title: this.formatPrice(v),
        //   value: formatTime(v.create_date),
        // }))
      }).finally(() => {
        uni.hideLoading()
        this.historyLoading = false
      })
    },
    handleError(e) {
      console.log(e)
    },
    loadData(clear = true, callback) {
      this.$nextTick(() => {
        this.$refs.udb.loadData({
          clear,
        }, callback && callback())
      })
    },
  },
  onPullDownRefresh() {
    this.loadData(true, () => {
      uni.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    this.$refs.udb.loadMore()
  },

}
</script>

<style lang="scss" scoped>
.offer-list{

}
.offer-item{
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
}
.product-name{
  text-decoration: underline;
}
</style>
