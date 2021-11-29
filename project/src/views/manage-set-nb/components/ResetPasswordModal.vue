<template>
  <div class="ResetPasswordModal">
    <a-modal
      title="重置密码"
      :visible="visible"
      :confirmLoading="loading"
      destroyOnClose
      centered
      :maskClosable="false"
      width="600px"
      wrapClassName="CommonModalStyle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="form" :rules="rules" ref="refForm">
        <a-form-model-item label="新密码" prop="password">
          <a-input-password v-model="form.password" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { resetPassword } from '@/api/api'
export default {
  name: 'ResetPasswordModal',

  props: ['visible', 'recordId'],

  data() {
    return {
      loading: false,
      form: {
        password: undefined
      },
      rules: {
        password: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 4, max: 30, message: '长度4~30个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    handleOk() {
      this.$refs.refForm.validate(valid => {
        if (valid) {
          this.loading = true

          let param = {
            id: this.recordId,
            newPwd: this.form.password
          }

          resetPassword(param)
            .then(({ error, response }) => {
              if (error.code === 0) {
                this.$message.success('修改密码成功')
                this.handleCancel()
              }
            })
            .finally(() => {
              setTimeout(() => {
                this.loading = false
              }, 500)
            })
        }
      })
    },

    handleCancel() {
      this.$emit('update:visible', false)
      this.form = {
        password: undefined
      }
    }
  }
}
</script>

