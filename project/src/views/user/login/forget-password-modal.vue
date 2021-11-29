<template>
  <div>
    <a-modal
      title="忘记密码"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable="false"
      style="top: 130px;"
    >
      <a-form :form="form">
        <a-form-item label="用户名" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入用户名或仪器编号"
                v-decorator="[
                  'username',
                  {
                    rules: [{
                      required: true, message: '请输入用户名或仪器编号' 
                    }],
                  }
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="手机号" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入手机号"
                v-decorator="[
                  'phone',
                  {
                    rules: [{
                      required: true, message: '请输入手机号' 
                    }, {
                      pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误',
                    }],
                    validateTrigger: 'blur'
                  }
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="验证码" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="13">
              <a-input
                placeholder="请输入验证码"
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
              >{{disabled?`已发送 ${time}s`:'获取验证码'}}</a-button>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="新密码" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入新密码"
                v-decorator="[ 'password',
                  {
                    rules: [{
                      required: true, message: '请输入新密码',
                    }, {
                      validator: validateToNextPassword,
                    }],
                  }
                ]"
                type="password"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="确认密码" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请再次输入新密码"
                v-decorator="[ 'confirm',
                  {
                    rules: [{
                      required: true, message: '请再次输入新密码',
                    }, {
                      validator: compareToFirstPassword,
                    }],
                  }
                ]"
                type="password"
                @blur="handleConfirmBlur"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getUserInfo, getCaptcha, modifyPassword } from '@/api/login'
export default {
  name: 'ForgetPasswordModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      confirmDirty: false,
      confirmLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      form: this.$form.createForm(this),
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
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.confirmLoading = true
          modifyPassword(values.username, values.password).then(res => {
            let response = JSON.parse(res.d)
            if (response.Error) {
              this.$message.error('系统错误')
              this.handleCancel()
            } else {
              this.$message.success('密码修改成功')
              this.handleCancel()
            }
          })
        }
      })
    },

    handleCancel(e) {
      this.$emit('update:visible', false)
      this.confirmLoading = false
      this.form.resetFields()
      this.code = ''
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
          getUserInfo(values.username).then(res => {
            let response = JSON.parse(res.d)
            if (response.Phone != phone) {
              this.$message.error('用户名与手机号不匹配')
              this.loading = false
            } else {
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
