<template>
  <div class="apply-admin-modal">
    <a-modal
      title="申请管理员账号"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable="false"
      style="top: 70px;"
      :destroyOnClose="true"
    >
      <a-form :form="form">
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

        <a-form-item label="联系人" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入联系人"
                v-decorator="[
                  'linker',
                  {
                    rules: [{
                      required: true, message: '请输入联系人' ,whitespace:true
                    },{
                      max:32, message: '最多输入32个字符'
                    }],
                  }
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="邮箱" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-auto-complete
                @search="handleSearch"
                placeholder="请输入邮箱"
                v-decorator="['email', { initialValue:'', rules: [{required: false, message: '请输入邮箱'}] }]"
              >
                <template slot="dataSource">
                  <a-select-option v-for="email in autoCompleteEmails" :key="email">{{email}}</a-select-option>
                </template>
              </a-auto-complete>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="公司名称" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入公司名称"
                v-decorator="[
                  'office',
                  {
                    rules: [{
                      required: true, message: '请输入公司名称' ,whitespace:true
                    },{
                      max:128, message: '最多输入128个字符'
                    }],
                  }
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="公司电话" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入公司电话"
                v-decorator="['tel', { initialValue:'',rules: [{required: false, message: '请输入公司电话'}] }]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="管理员用户名" v-bind="formItemLayout">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入管理员账号的用户名"
                v-decorator="[
                  'username',
                  {
                    rules: [{
                      required: true, message: '请输入管理员账号的用户名' ,whitespace:true
                    },{
                      max:32, message: '最多输入32个字符'
                    },
                    { 
                      validator: this.validatorAUserName 
                    }],
                    validateTrigger: 'blur'
                  }
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="上传证明" v-bind="formItemLayout" extra="只能上传1张图片">
          <a-upload
            :beforeUpload="beforeUpload"
            accept="image/jpeg, image/png"
            :fileList="fileList"
            :remove="handleRemove"
            v-decorator="[
              'file',
              {
                rules: [
                {
                  required: true, message: '请上传1张证明图片' 
                }, 
                { 
                  validator: this.validatorFile 
                }],
              }
            ]"
          >
            <a-button>
              <a-icon type="upload" />上传证明图片
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getCaptcha, CheckAUserName } from '@/api/login'
import { RegisterManager } from '@/api/manage-set'
export default {
  name: 'apply-admin-modal',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      confirmLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      form: this.$form.createForm(this),
      disabled: false,
      time: 59,
      interval: null,
      loading: false,
      code: '',
      fileList: [],
      autoCompleteEmails: []
    }
  },

  methods: {
    handleOk() {
      this.form.validateFields((err, { file, linker, office, tel, username, phone, email }) => {
        if (!err) {
          this.confirmLoading = true
          RegisterManager(username, office, linker, tel, file, phone, email).then(res => {
            let result = JSON.parse(res.d)
            if (result.Error == -1) {
              this.$message.error('系统错误')
              this.handleCancel()
            } else {
              this.$message.success('操作成功，请耐心等待审核', 6)
              this.handleCancel()
            }
          })
        }
      })
    },

    handleCancel(e) {
      this.$emit('update:visible', false)
      this.fileList = []
      this.confirmLoading = false
      this.form.resetFields()
    },

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

    beforeUpload(file) {
      this.fileList = []
      this.fileList = [...this.fileList, file]
      return false
    },

    handleRemove() {
      this.fileList = []
    },

    validatorFile(rule, value, callback) {
      function CheckIsChinese(val) {
        var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
        if (reg.test(val)) {
          return true
        }
        return false
      }

      if (value) {
        if (!value.file.type.includes('image')) {
          callback('只能上传图片')
        }
        if (CheckIsChinese(value.file.name)) {
          callback('图片名称不能包含中文')
        }
        callback()
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
    }
  }
}
</script>
