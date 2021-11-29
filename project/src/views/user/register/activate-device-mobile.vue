<template>
  <div>
    <div v-if="state===''" class="activate-device-mobile">
      <div class="logo-container">
        <img src="/logo.png" />
        <span>噪声监测平台</span>
      </div>

      <div class="form-container">
        <span class="form-name">激活设备</span>

        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="仪器编号"
              size="large"
              v-decorator="['username']"
              disabled
              style="width: 100%"
            ></a-input>
          </a-form-item>

          <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input size="large" v-model="deviceType" disabled />
          </a-form-item>

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
            ></a-input>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-row :gutter="16">
              <a-col :span="13">
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
              <a-col :span="11">
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

          <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="用户名"
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
              <a-col :span="24">
                <a-button
                  size="large"
                  type="primary"
                  block
                  @click="clickActive"
                  :loading="loading_submit"
                >激 活</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <div v-else class="activate-device-mobile-result">
      <result :type="state" :title="title" :description="description">
        <div slot="action">
          <a-row :gutter="16" style="margin-top:48px">
            <a-col :span="24"></a-col>
          </a-row>
        </div>
      </result>
    </div>
  </div>
</template>

<script>
import { getCaptcha, activeDevice, CheckAUserName, GetDeviceTypeById } from '@/api/login'
import { Result } from '@/components'

export default {
  name: 'register-mobile',

  components: {
    Result
  },

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
      loading_submit:false,
      code: '',
      autoCompleteEmails: [],

      state: '',
      description: '',
      deviceType:''
    }
  },

  computed: {
    title() {
      if (this.state === 'success') {
        return '激活成功'
      } else {
        return '激活失败'
      }
    }
  },

  created() {
    this.validatorUserName()
  },

  mounted() {
    this.form.setFieldsValue({
      username: this.$route.query.mid
    })
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  methods: {
    clickActive() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading_submit = true
          activeDevice(values).then(res => {
            let result = JSON.parse(res.d)
            if (result.Error == 0) {
              this.state = 'success'
              this.description = '请用电脑登录账号'
            } else {
              this.state = 'error'
              this.description = result.Msg
            }
            this.loading_submit = false
          })
        }
      })
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
    },

    validatorUserName() {
      GetDeviceTypeById(this.$route.query.mid).then(res => {
        const result = JSON.parse(res.d)
        if (result.Error) {
          this.state = 'error'
          this.description = result.Msg
        }else{
           this.deviceType = result.DeviceType
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.activate-device-mobile {
  .logo-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    padding: 24px;
    padding-top: 48px;
    img {
      width: 100px;
      margin-bottom: 12px;
    }
  }

  .form-container {
    padding: 0px 24px;
    padding-bottom: 48px;
    .form-name {
      display: inline-block;
      font-size: 18px;
      margin-bottom: 12px;
    }
  }
}

.activate-device-mobile-result {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 24px;
  overflow: hidden;
  .result {
    margin-top: -10vh;
  }
  .rescan {
    font-size: 20px;
  }
}
</style>