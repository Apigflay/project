<template>
  <div>
    <a-form :form="form" style="max-width: 400px; margin: 60px auto 0;">
      <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="*用户名"
          size="large"
          v-decorator="[
            'ausername', 
            { rules: [
                { required: true, message: '请输入用户名' },
                { validator: this.validatorAUserName }
              ],
              validateTrigger: 'blur'
            }
          ]"
        />
      </a-form-item>

      <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-auto-complete
          @search="handleSearch"
          placeholder="邮箱"
          size="large"
          v-decorator="['email', { initialValue:'', rules: [{required: false, message: '请输入邮箱'}] }]"
        >
          <template slot="dataSource">
            <a-select-option v-for="email in autoCompleteEmails" :key="email">{{email}}</a-select-option>
          </template>
        </a-auto-complete>
      </a-form-item>

      <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="公司电话"
          size="large"
          v-decorator="['tel', { initialValue:'', rules: [{required: false, message: '请输入公司电话'}] }]"
        />
      </a-form-item>

      <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="公司名称"
          size="large"
          v-decorator="['office', { initialValue:'', rules: [{required: false, message: '请输入公司名称'}] }]"
          @keyup.enter="nextStep"
        />
      </a-form-item>

      <a-form-item :wrapperCol="{span: 24}">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-button size="large" type="primary" block @click="nextStep" :loading="loading">提交</a-button>
          </a-col>
          <a-col :span="12">
            <a-button size="large" @click="prevStep" block>上一步</a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { activeDevice, CheckAUserName } from '@/api/login'
export default {
  name: 'Step1',

  props: ['otherForm'],

  data() {
    return {
      labelCol: { lg: { span: 24 }, sm: { span: 24 } },
      wrapperCol: { lg: { span: 24 }, sm: { span: 24 } },
      form: this.$form.createForm(this),
      autoCompleteEmails: [],
      loading: false
    }
  },

  methods: {
    nextStep() {
      const {
        form: { validateFields }
      } = this
      validateFields((err, values) => {
        let obj = Object.assign({}, this.otherForm, values)
        if (!err) {
          this.loading = true
          activeDevice(obj).then(res => {
            let result = JSON.parse(res.d)
            if (result.Error == 0) {
              this.$store.commit('SET_REGISTERSTATE', 'success')
            } else {
              this.$store.commit('SET_REGISTERSTATE', 'fail')
            }
            this.loading = false
            this.$emit('nextStep')
          })
        }
      })
    },

    prevStep() {
      this.$emit('prevStep')
    },

    handleSearch(value) {
      let result
      if (!value || value.indexOf('@') >= 0) {
        result = []
      } else {
        result = [
          'qq.com',
          'foxmail.com',
          'outlook.com',
          'hotmail.com',
          '163.com',
          '126.com',
          'gmail.com',
          'sina.com',
          'yahoo.com',
          'msn.com'
        ].map(domain => `${value}@${domain}`)
      }
      this.autoCompleteEmails = result
    },

    validatorAUserName(rule, value, callback) {
      if (value) {
        CheckAUserName(value).then(res => {
          const result = JSON.parse(res.d)
          if (result.Error == 1) {
            callback('用户名已存在')
          } else if (result.Error == -1) {
            callback('校验用户名出现系统错误，请刷新页面')
          } else if (result.Error == 0) {
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
