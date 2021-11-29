<template>
  <div>
    <a-form :form="form" style="max-width: 400px; margin: 60px auto 0;">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="11位手机号"
          size="large"
          v-decorator="[
            'phone',
            {
              rules: [{
                required: true, message: '请输入手机号' 
              }, {
                pattern: /^1[0-9]{10}$/, message: '手机号格式错误',
              }],
              validateTrigger: 'blur'
            }
          ]"
          style="width: 100%"
        >
          <a-select
            slot="addonBefore"
            v-decorator="[
              'prefix',
              { initialValue: '86' }
            ]"
            style="width: 70px"
          >
            <a-select-option value="86">+86</a-select-option>
          </a-select>
        </a-input>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-row :gutter="16">
          <a-col :span="15">
            <a-input
              placeholder="验证码"
              size="large"
              v-decorator="[
                'captcha',
                {
                  rules: [
                    {
                      required: true, message: '请输入验证码' 
                    },
                    { 
                      validator: this.validatorCaptcha
                    }
                  ],
                }
              ]"
            />
          </a-col>
          <a-col :span="9">
            <a-button
              @click="handleGetCaptcha"
              block
              :loading="loading"
              :disabled="disabled"
              size="large"
            >{{disabled?`已发送 ${time}s`:'获取验证码'}}</a-button>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="设置登录密码"
          size="large"
          v-decorator="[ 'password',
                  {
                    rules: [{
                      required: true, message: '请设置登录密码',
                    }, {
                      validator: validateToNextPassword,
                    }],
                  }
                ]"
          type="password"
        />
      </a-form-item>

      <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="确认登录密码"
          size="large"
          v-decorator="['confirm',
            {
              rules: [{
                required: true, message: '请确认登录密码',
              }, {
                validator: compareToFirstPassword,
              }],
            }
          ]"
          type="password"
          @blur="handleConfirmBlur"
        />
      </a-form-item>

      <a-form-item :wrapperCol="{span: 24}">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-button size="large" type="primary" block @click="nextStep">提交</a-button>
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
import { getCaptcha } from '@/api/login'
export default {
  name: 'Step1',
  data() {
    return {
      labelCol: { lg: { span: 24 }, sm: { span: 24 } },
      wrapperCol: { lg: { span: 24 }, sm: { span: 24 } },
      form: this.$form.createForm(this),
      confirmDirty: false,
      disabled: false,
      time: 59,
      interval: null,
      loading: false,
      code: ''
    }
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  methods: {
    nextStep() {
      this.form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.$emit('setForm', values)
          this.$emit('nextStep')
        }
      })
    },

    prevStep() {
      this.$emit('prevStep')
    },

    /**确认密码 start*/
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次密码不一致')
      } else {
        callback()
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    /**确认密码 end*/

    handleGetCaptcha() {
      this.form.validateFields(['phone', 'username'], { force: true }, (err, values) => {
        let phone = values.phone
        if (!err) {
          this.loading = true
          getCaptcha(phone)
            .then(res => {
              let response = JSON.parse(res.d)
              if (response.Error) {
                this.$message.error(response.Msg)
                this.loading = false
              } else {
                this.code = response.Code
                this.loading = false
                this.disabled = true
                this.$message.success('验证码已发送')
                this.interval = setInterval(() => {
                  this.time--
                  if (this.time < 0) {
                    this.disabled = false
                    this.time = 59
                    clearInterval(this.interval)
                  }
                }, 1000)
              }
            })
            .catch(err => {
              this.$message.error('获取验证码出现错误，请重试')
              this.loading = false
            })
        }
      })
    },

    validatorCaptcha(rule, value, callback) {
      if (value && value != this.code) {
        callback('验证码错误')
      }
      callback()
    }
  }
}
</script>

