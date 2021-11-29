<template>
  <div class="create-qrcode">
    <!-- <span class="title">生成激活二维码</span> -->
    <a-form :form="form" style="width:500px;">
      <a-form-item label="系统" v-bind="formItemLayout">
        <a-select
          size="large"
          v-decorator="[
                  'urltype',
                  {
                    initialValue:0,
                    rules: [{
                      required: true, message: '请选择系统'
                    }],
                  }
                ]"
          placeholder="请选择系统"
        >
          <a-select-option :value="0">测试系统</a-select-option>
          <a-select-option :value="1">正式系统</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="仪器编号" v-bind="formItemLayout">
        <a-input
          size="large"
          v-decorator="[
                  'mid',
                  {
                    rules: [{
                      required: true, message: '请输入仪器编号'
                    },{
                       pattern: /^\d{6,14}$/, message: '请输入数字，6~14位'
                    },
                    ],
                  }
                ]"
          placeholder="请输入仪器编号"
          @change="midChagne"
        ></a-input>
      </a-form-item>

      <a-form-item label="仪器类型" v-bind="formItemLayout">
        <a-select
          size="large"
          :disabled="mtypeDisabled"
          v-decorator="[
                  'mtype',
                  {
                    rules: [{
                      required: true, message: '请选择仪器类型'
                    }],
                  }
                ]"
          placeholder="请选择仪器类型"
        >
          <a-select-option value="AWA6218J">AWA6218J</a-select-option>
          <a-select-option value="AWA6218S">AWA6218S</a-select-option>
          <a-select-option value="AWA6228+">AWA6228+</a-select-option>
          <a-select-option value="AWA5688">AWA5688</a-select-option>
          <a-select-option value="AWA8578G">AWA8578G</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-bind="tailFormItemLayout">
        <a-button size="large" type="primary" block @click="submit" :loading="loading">生成激活二维码</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import debounce from 'lodash/debounce' // 防抖函数
import { CreateQRCodeByMid, GetDeviceTypeById } from '../../../api/login'

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },

      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 4
          }
        }
      },

      loading: false,
      mtypeDisabled: false
    }
  },

  created() {
    this.midChagne = debounce(this.midChagne, 500)
  },

  methods: {
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          CreateQRCodeByMid(values.urltype, values.mid, values.mtype).then(res => {
            let result = JSON.parse(res.d)
            if (result.Error) {
              this.$message.error('系统错误')
            } else {
              window.open(`/static-file/docs/res/${result.Msg}`, '_blank')
            }
            this.loading = false
          })
        }
      })
    },

    midChagne(e) {
      GetDeviceTypeById(e.target.value).then(res => {
        const result = JSON.parse(res.d)
        if (result.Error) {
          this.form.setFieldsValue({
            mtype: undefined
          })
          this.mtypeDisabled = false
        } else {
          this.form.setFieldsValue({
            mtype: result.DeviceType
          })
          this.mtypeDisabled = true
        }
      })
    }
  }
}
</script>


<style lang="less" scoped>
.create-qrcode {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30vh;
  .title {
    font-size: 24px;
    display: block;
    margin-bottom: 24px;
    color: black;
  }
}
</style>