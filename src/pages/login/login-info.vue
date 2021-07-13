<template>
	<view class="register container">
    <title-header :title="$t('login.complete')"/>
		<view class="main-content ftf">
      <view class="register-form">
        <u-form :model="form" ref="uForm" label-position="top">
          <u-form-item :label="$t('login.desc')" required prop="desc">
            <u-input required v-model="form.desc" :placeholder="$t('login.desc')" />
          </u-form-item>
          <u-form-item :label="productTypeSelectedLabel" required prop="type">
            <choose-product-type @change="productTypeChange"></choose-product-type>
          </u-form-item>
        </u-form>
      </view>
		</view>
    <view class="footer">
      <u-button class="confirm-btn" :disabled="btnLoading" :loading="btnLoading" @click="submit">
        {{$t('common.submit')}}
      </u-button>
    </view>
	</view>
</template>
<script>
import TitleHeader from './components/title-header'
import chooseProductType from '../../components/chooseProductType/index'

export default {
  components: { TitleHeader, chooseProductType },
  data() {
    return {
      label: this.$t('product.choose.label'),
      form: {
        desc: '3123',
        product_type: '',
      },
      btnLoading: false,
      productTypeName: '',
      rules: {
        type: [
          {
            validator: (rule, value, callback) => !!this.productTypeName,
            message: this.$t('rules.product.type'),
            trigger: ['change', 'blur'],
          }
        ],
        desc: [
          {
            required: true,
            message: this.$t('rules.desc'),
            trigger: ['change', 'blur'],
          }
        ],
      },

    }
  },
  computed: {
    productTypeSelectedLabel() {
      const value = this.productTypeName ? `：(${this.productTypeName})` : ''
      return this.label + value
    },
  },
  onLoad(options) {
    // this.findUserInfo()
  },
  onUnload() {
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  methods: {
    productTypeChange(data) {
      this.productTypeName = data.title
      this.form.product_type = data.value
    },
    submit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          console.log(this.form)
          this.updateUserInfo()
        } else {
          console.log('验证失败')
        }
      })
    },
    updateUserInfo() {
      uni.showLoading()
      this.$request('user/completeUserInfo', this.form).then(res => {
        uni.setStorageSync('productType', this.form.product_type)
        uni.switchTab({ url: '/pages/index/index' })
      }).finally(() => {
        uni.hideLoading()
      })
    },
  },
}
</script>
<style lang="scss">
	.register {
    padding: 10px 20px;
		.main-content {
      margin-top: 51rpx;
      .register-form {
        padding-left: 20rpx;
        margin-bottom: 53upx;
        .user-name-row{
          .u-border-bottom:after{
            width: 100%;
          }
        }
      }
		}
    .footer{
      margin-top: 114upx;
    }
  }
</style>
