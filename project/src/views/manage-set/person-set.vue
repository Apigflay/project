<template>
  <div class="person-set">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>个人设置</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="page-common-content">
      <!-- <div class="person-set-item">
        <span class="title">个人头像</span>
        <span class="btn">修改</span>
      </div>-->
      <div class="person-set-item" v-action="['user']">
        <span class="title">仪器编号: {{userInfo().UserName}}</span>
        <!-- <span style="margin-left:16px; color: #ccc; user-select:none;">不可修改</span> -->
      </div>

      <div class="person-set-item" v-action="['user']">
        <span class="title">用户名: {{userInfo().AUserName}}</span>
        <a-button type="link" @click="showModal('ausername')">修改</a-button>
      </div>

      <div class="person-set-item" v-action="['admin']">
        <span class="title">用户名: {{userInfo().AUserName}}</span>
        <!-- <span style="margin-left:16px; color: #ccc; user-select:none;">不可修改</span> -->
      </div>

      <div class="person-set-item">
        <span class="title">手机号: {{userInfo().Phone}}</span>
        <a-button type="link" @click="showModal('phone')">修改</a-button>
      </div>

      <div class="person-set-item">
        <span class="title">密码</span>
        <a-button type="link" @click="showModal('password')">修改</a-button>
      </div>
    </div>

    <a-modal
      :title="modalTitle"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :destroyOnClose="true"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item label="新用户名" v-bind="formItemLayout" v-if="type ==='ausername'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入新用户名"
                v-decorator="[
                  'ausername',
                  {
                    rules: [
                      {
                        required: true, message: '请输入新用户名' , whitespace:true
                      },
                      {
                        max:32, message: '最多输入32个字符'
                      },
                      { 
                        validator: this.validatorAUserName 
                      }
                    ],
                    validateTrigger: 'blur'
                  }
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="新手机号" v-bind="formItemLayout" v-if="type ==='phone'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入新手机号"
                v-decorator="[
                  'phone',
                  {
                    rules: [{
                      required: true, message: '请输入新手机号' 
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

        <a-form-item label="验证码" v-bind="formItemLayout" v-if="type ==='phone'">
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

        <a-form-item label="旧密码" v-bind="formItemLayout" v-if="type ==='password'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入旧密码"
                v-decorator="[ 'opassword',
                  {
                    rules: [{
                      required: true, message: '请输入旧密码',
                    }, {
                      validator: this.validatorOpassword,
                    }],
                  }
                ]"
                type="password"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="新密码" v-bind="formItemLayout" v-if="type ==='password'">
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

        <a-form-item label="确认密码" v-bind="formItemLayout" v-if="type ==='password'">
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
import { mapActions, mapGetters } from 'vuex'
import { modifyUserInfo } from '@/api/manage-set'
import { getUserInfo, getCaptcha, modifyPassword, CheckAUserName } from '@/api/login'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      type: '',
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

  computed: {
    modalTitle() {
      if (this.type === 'ausername') {
        return '修改用户名'
      } else if (this.type === 'phone') {
        return '修改手机号'
      } else if (this.type === 'password') {
        return '修改密码'
      }
    }
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  methods: {
    ...mapGetters(['userInfo', 'role']),

    showModal(type) {
      this.visible = true
      this.type = type
    },

    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          if (this.type === 'ausername') {
            modifyUserInfo(this.userInfo().UserName, values.ausername, this.userInfo().Tel).then(res => {
              let response = JSON.parse(res.d)
              if (response.Error) {
                this.$message.error('系统错误')
                this.handleCancel()
              } else {
                this.$store.dispatch('GetUserInfo')
                this.$message.success('用户名修改成功')
                this.handleCancel()
              }
            })
          } else if (this.type === 'phone') {
            modifyUserInfo(this.userInfo().UserName, this.userInfo().AUserName, values.phone).then(res => {
              let response = JSON.parse(res.d)
              if (response.Error) {
                this.$message.error('系统错误')
                this.handleCancel()
              } else {
                this.$store.dispatch('GetUserInfo')
                this.$message.success('手机号修改成功')
                this.handleCancel()
              }
            })
          } else if (this.type === 'password') {
            modifyPassword(this.userInfo().UserName, values.password).then(res => {
              let response = JSON.parse(res.d)
              if (response.Error) {
                this.$message.error('系统错误')
                this.handleCancel()
              } else {
                this.$store.dispatch('GetUserInfo')
                this.$message.success('密码修改成功')
                this.handleCancel()
              }
            })
          }
        }
      })
    },

    handleCancel(e) {
      this.visible = false
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
      if (value && value === form.getFieldValue('opassword')) {
        callback('新密码与旧密码一致')
      }
      callback()
    },

    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    /**确认密码 end*/

    handleGetCaptcha() {
      this.form.validateFields(['phone'], { force: true }, (err, values) => {
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

    validatorOpassword(rule, value, callback) {
      if (value && value != this.userInfo().PassWord) {
        callback('旧密码错误')
      } else {
        callback()
      }
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


<style lang="less" scoped>
.person-set {
  .page-common-content {
    padding: 0;
    .person-set-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      border-bottom: 1px solid #e9e9e9;
      padding: 24px 32px;
    }
  }
}
</style>