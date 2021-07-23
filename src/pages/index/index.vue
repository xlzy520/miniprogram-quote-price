<template>
  <view class="p-3 product-home">
    <u-search v-model="keyword"
              :action-text="$t('common.search')"
              :placeholder="$t('search.keyword')"
              @search="search" @custom="search" @clear="clear"></u-search>
    <unicloud-db ref="udb" @error="handleError" collection="uni-id-product" :options="pageOptions"
                 :where="where" field="_id,name,name_en,imgUrls,price,status,create_date"
                 page-data="add" :orderby="orderby" :getcount="true"
                 :page-size="pageOptions.size"
                 :page-current="pageOptions.current"
                 v-slot:default="{data,loading}">
      <view class="layout-abs-center min-h-80vh" v-if="loading">
        <u-loading mode="circle" color="#2d8cf0" size="72"></u-loading>
      </view>
      <view v-else class="layout-slide flex-wrap pt-3 product-list">
        <view v-for="(item, index) in data" :key="index" class="product-item"
              @click="handleItem(item)">
          <u-image :src="item.imgUrls[0]" width="320rpx" height="320rpx" mode=""></u-image>
          <view class="text">
            <view class="title text-base text-center">{{ getLocaleName(item) }}</view>
          </view>
        </view>
      </view>
      <u-empty class="min-h-80vh" mode="search" v-if="!loading && !data.length"></u-empty>
    </unicloud-db>
  </view>
</template>

<script>
import { errorHandler } from "@/utils/request";

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
        type: uni.getStorageSync('productType')
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
  methods: {
    getLocaleName(item) {
      return this.isCN ? item.name : item.name_en
    },
    clear() {
      this.where = ''
      this.loadData()
    },
    search(value) {
      const queryRe = new RegExp(value, 'i')
      const searchKeys = ['name', 'name_en']
      searchKeys.forEach(v => {
        this.where[v] = queryRe
      })
      this.$nextTick(() => {
        this.loadData()
      })
    },
    handleItem(item) {
      uni.navigateTo({ url: '/pages/product-detail/index?id=' + item._id })
    },
    handleError(err) {
      errorHandler(err)
    },
    loadData(clear = true, callback) {
      this.$refs.udb.loadData({
        clear,
      }, callback && callback())
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
::v-deep .u-action-active{
  width: 50px;
}

.product-list {
  .product-item {
    margin-bottom: 18rpx;
    padding-bottom: 36rpx;
    width: calc(50% - 15rpx);
    overflow: hidden;
    border-radius: 14rpx;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
    .text{
      padding-left: 18upx;
    }
    .title {
      padding: 36rpx 0 6rpx;
      color: #333;
      .desc {
        color: #999999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

  }
}

.min-h-80vh{
  min-height: 80vh;
}

</style>
