<template>
  <div>
    <a-form :form="form" style="max-width: 400px; margin: 60px auto 0;">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          style="width:100%"
          placeholder="请输入仪器编号"
          size="large"
          v-decorator="[
            'username', 
            { rules: [
                { required: true, message: '请输入仪器编号' },
                { validator: this.validatorUserName },
              ],
              validateTrigger: 'blur',
            }
          ]"
          @keyup.enter="nextStep"
        />
      </a-form-item>

      <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input size="large" v-model="deviceType" disabled />
      </a-form-item>

      <a-form-item :wrapperCol="{span: 24}">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-button size="large" type="primary" block @click="nextStep" :loading="loading">提交</a-button>
          </a-col>
          <a-col :span="12">
            <a-button size="large" @click="$router.push({name:'login'})" block>返回</a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { GetDeviceTypeById } from '@/api/login'

export default {
  name: 'Step1',

  data() {
    return {
      labelCol: { lg: { span: 24 }, sm: { span: 24 } },
      wrapperCol: { lg: { span: 24 }, sm: { span: 24 } },
      form: this.$form.createForm(this),
      deviceType: '',
      loading: false
    }
  },

  methods: {
    nextStep() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('setForm', values)
          this.$emit('nextStep')
        }
      })
    },

    validatorUserName(rule, value, callback) {
      if (value) {
        GetDeviceTypeById(value).then(res => {
          const result = JSON.parse(res.d)
          if (result.Error) {
            this.deviceType = ''
            callback(result.Msg)
          } else {
            this.deviceType = result.DeviceType
            callback()
          }
        })
      } else {
        callback()
      }
    }
  }
}
</script>
