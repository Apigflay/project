<template>
  <div class="person-set">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>个人设置</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">
        <span>个人设置</span>
      </div>
    </div>

    <div class="page-common-content">
      <div class="person-set-item">
        <span class="title">账号: {{ userinfo.username }}</span>
      </div>

      <div class="person-set-item">
        <span class="title">昵称: {{ userinfo.nickname }}</span>
        <a-button type="link" @click="showModal('nickname')">修改</a-button>
      </div>

      <div class="person-set-item">
        <span class="title">密码: ******</span>
        <a-button type="link" @click="showModal('password')">修改</a-button>
      </div>

      <div class="person-set-item">
        <span class="title">身份证号: {{ userinfo.identityCardNo }}</span>
        <a-button type="link" @click="showModal('identityCardNo')">修改</a-button>
      </div>

      <div class="person-set-item">
        <span class="title">从业资格说明：{{ userinfo.qualificationCertificate }}</span>
        <a-button type="link" @click="showModal('qualificationCertificate')">修改</a-button>
      </div>

      <div class="person-set-item">
        <span class="title" style="margin-bottom: 29px;">从业资格证书：</span>
        <a :href="`${api_java}${userinfo.qualificationCertificateUrl}?token=${$store.state.user.token}`" target="_blank">
            <img :src="`${api_java}${userinfo.qualificationCertificateUrl}?token=${$store.state.user.token}`" style="max-height: 50px;max-width: 130px">
        </a>
        <a-button type="link" @click="showModal('file')">上传</a-button>
      </div>

      <div class="person-set-item">
        <span class="title">备注: {{ userinfo.remark }}</span>
        <a-button type="link" @click="showModal('remark')">修改</a-button>
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
      width="600px"
    >
      <a-form-model
        ref="qualificationForm"
        v-if="type === 'file'"
        :model="qualificationForm"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item label="文件" prop="qualificationCertificateUrl">
          <a-upload
            action="/api_java/sys/user/cert/upload"
            :headers="{
              Authorization: $store.state.user.token,
            }"
            list-type="picture"
            :file-list="fileList"
            @change="uploadChange"
          >
            <a-button> <a-icon type="upload" /> 上传从业资格证书 </a-button>
          </a-upload>
        </a-form-model-item>

        <a-form-model-item label="证书有效期" prop="certificateValidDate">
          <a-date-picker v-model="qualificationForm.certificateValidDate" placeholder="请选择" :allowClear="false" />
        </a-form-model-item>
      </a-form-model>

      <a-form :form="form">
        <a-form-item label="新昵称" v-bind="formItemLayout" v-if="type === 'nickname'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'nickname',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                      {
                        max: 30,
                        message: '最大30个字符',
                      },
                    ],
                  },
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="新身份证号" v-bind="formItemLayout" v-if="type === 'identityCardNo'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'identityCardNo',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                      {
                        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/g,
                        message: '身份证格式错误',
                        trigger: 'blur',
                      },
                    ],
                  },
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="从业资格说明" v-bind="formItemLayout" v-if="type === 'qualificationCertificate'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-textarea
                placeholder="请输入"
                :rows="5"
                v-decorator="[
                  'qualificationCertificate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                      {
                        max: 1000,
                        message: '最大1000个字符',
                      },
                    ],
                  },
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="备注" v-bind="formItemLayout" v-if="type === 'remark'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'remark',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                      {
                        max: 128,
                        message: '最大128个字符',
                      },
                    ],
                  },
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="旧密码" v-bind="formItemLayout" v-if="type === 'password'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入旧密码"
                v-decorator="[
                  'opassword',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入旧密码',
                      },
                    ],
                  },
                ]"
                type="password"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="新密码" v-bind="formItemLayout" v-if="type === 'password'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请输入新密码"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入新密码',
                      },
                      {
                        validator: validateToNextPassword,
                      },
                    ],
                  },
                ]"
                type="password"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="确认密码" v-bind="formItemLayout" v-if="type === 'password'">
          <a-row :gutter="16">
            <a-col :span="22">
              <a-input
                placeholder="请再次输入新密码"
                v-decorator="[
                  'confirm',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请再次输入新密码',
                      },
                      {
                        validator: compareToFirstPassword,
                      },
                    ],
                  },
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
import { mapGetters } from 'vuex'
import { api_java } from '@/api/urlConfig'
import { modifyPasswordSelf, modifyUserSelf, modifyQualificationCertificate, getCert, lookCert } from '@/api/api'
import moment from 'moment'

export default {
  data() {
    return {
      visible: false,
      api_java,
      confirmLoading: false,
      confirmDirty: false,
      type: '',
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      },
      form: this.$form.createForm(this),
      qualificationForm: {
        qualificationCertificateUrl: undefined,
        certificateValidDate: undefined,
      },

      rules: {
        qualificationCertificateUrl: [{ required: true, message: '请上传文件', trigger: 'change' }],
        certificateValidDate: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      fileList: [],
    }
  },

  computed: {
    ...mapGetters(['userinfo']),

    modalTitle() {
      if (this.type === 'username') {
        return '修改用户名'
      } else if (this.type === 'nickname') {
        return '修改昵称'
      } else if (this.type === 'password') {
        return '修改密码'
      } else if (this.type === 'identityCardNo') {
        return '修改身份证号'
      } else if (this.type === 'qualificationCertificate') {
        return '修改从业资格说明'
      } else if (this.type === 'file') {
        return '修改从业资格证书'
      } else if (this.type === 'remark') {
        return '修改备注'
      }
    },
  },

  methods: {
    moment,

    showModal(type) {
      this.visible = true
      this.type = type

      if (type === 'file') {
        getCert().then(({ error, response }) => {
          if (error.code === 0) {
            this.qualificationForm.qualificationCertificateUrl = response.qualificationCertificateUrl
            this.qualificationForm.certificateValidDate = response.certificateValidDate
              ? moment(response.certificateValidDate)
              : undefined
            let showUrl = this.$options.filters["urlFormat"](response.qualificationCertificateUrl)
            this.fileList = [
              {
                uid: 'uid',
                name: showUrl,
                status: 'done',
                url: `${api_java}${response.qualificationCertificateUrl}?token=${this.$store.state.user.token}`,
              },
            ]
          }
        })
      }
    },

    handleOk() {
      if (this.type === 'file') {
        this.$refs.qualificationForm.validate((valid) => {
          if (valid) {
            let param = {
              qualificationCertificateUrl: this.qualificationForm.qualificationCertificateUrl,
              certificateValidDate: this.qualificationForm.certificateValidDate.valueOf(),
            }
            modifyQualificationCertificate(param)
              .then(({ error, response }) => {
                if (error.code === 0) {
                  this.$message.success('操作成功')
                  this.$store.dispatch('GetUserinfo')
                  this.handleCancel()
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.confirmLoading = false
                }, 500)
              })
          }
        })
      } else {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            if (this.type === 'password') {
              let param = {}
              param.newPwd = values.password
              param.oldPwd = values.opassword

              modifyPasswordSelf(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('修改成功')
                    this.$store.dispatch('GetUserinfo')
                    this.handleCancel()
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.confirmLoading = false
                  }, 500)
                })
            } else {
              let param = {}
              param.nickname = values.nickname
              param.identityCardNo = values.identityCardNo
              param.qualificationCertificate = values.qualificationCertificate
              param.remark = values.remark

              modifyUserSelf(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('修改成功')
                    this.$store.dispatch('GetUserinfo')
                    this.handleCancel()
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.confirmLoading = false
                  }, 500)
                })
            }
          }
        })
      }
    },

    handleCancel(e) {
      this.visible = false
      this.confirmLoading = false
      this.form.resetFields()
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

    uploadChange(info) {
      if (info.file.status === 'removed') {
        this.fileList = []
        this.qualificationForm.qualificationCertificateUrl = undefined
      } else if (this.beforeUpload(info.file)) {
        let fileListIinfo = [info.file]
        if (info.file.status === 'done') {
          if (info.file.response.error.code === 0) {
            this.$message.success(`${info.file.name} 上传成功`)
            this.$store.dispatch('GetUserinfo')
            this.qualificationForm.qualificationCertificateUrl = info.file.response.response.qualificationCertificateUrl
            fileListIinfo = fileListIinfo.map(file => {
              file.url = `${api_java}${this.qualificationForm.qualificationCertificateUrl}?token=${this.$store.state.user.token}`
              return file;
            });
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`)
        }
        this.fileList = fileListIinfo
      }
    },
    
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg和png格式的文件!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('只能上传最大10M的文件');
      }
      return isJpgOrPng && isLt10M;
    },

    uploadPreviewUser(file) {
      lookCert(file.name)
    },
  },
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
      .title {
        overflow: auto;
      }
    }
  }
}
</style>