<template>
  <view class="p-3 product-home">
    <u-search v-model="search"></u-search>
    <unicloud-db ref="udb" @load="tableLoad" collection="uni-id-product" :options="pageOptions"
                 :where="where" field="_id,name,imgUrls,price,status,create_date"
                 page-data="add" :orderby="orderby" :getcount="true"
                 :page-size="pageOptions.size"
                 :page-current="pageOptions.current"
                 v-slot:default="{data,pagination,loading,error,hasMore}">
      <div class="layout-slide flex-wrap pt-3 product-list">
        <view v-for="(item, index) in data" :key="index" class="product-item"
              @click="handleItem(item)">
          <u-image :src="item.imgUrls[0]" width="320rpx" height="320rpx" mode=""></u-image>
          <view class="text">
            <view class="title text-base">{{ item.name }}</view>
          </view>
        </view>
      </div>
    </unicloud-db>
  </view>
</template>

<script>
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
      search: '',
      where: '',
      orderby: 'create_date',
      pageOptions: {
        size: 20,
        current: 1,
      },
    }
  },
  methods: {
    handleItem(item) {
      wx.navigateTo({ url: '/pages/exhibition-detail/index?id=' + item.id })
    },
    tableLoad(data, ended) {
      // this.expData = data.map(v => ({
      //   ...v,
      //   create_date: this.$formatDate(v.create_date)
      // }))
      // 仅导出当前页
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear,
      })
    },
  },

}
</script>

<style lang="scss" scoped>

.product-list {
  .product-item {
    margin-bottom: 18rpx;
    padding-bottom: 36rpx;
    width: calc(50% - 15rpx);
    overflow: hidden;
    border-radius: 14rpx;
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

</style>
