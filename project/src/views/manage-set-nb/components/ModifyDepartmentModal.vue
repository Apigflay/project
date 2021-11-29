<template>
  <div class="ModifyDepartmentModal">
    <a-modal
      title="修改部门"
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
        <a-form-model-item label="部门" prop="deptId">
          <DepartmentTreeSelect v-model="form.deptId" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { modifyUserDepartment } from '@/api/api'
import DepartmentTreeSelect from './DepartmentTreeSelect'
export default {
  name: 'ModifyDepartmentModal',

  props: ['visible', 'recordId', 'departmentId'],

  components: {
    DepartmentTreeSelect
  },

  data() {
    return {
      loading: false,
      options: [],
      form: {
        deptId: undefined
      },
      rules: {
        deptId: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },

  watch: {
    visible(value) {
      if (value) {
        this.form.deptId = this.departmentId
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
            deptId: this.form.deptId
          }

          modifyUserDepartment(param)
            .then(({ error, response }) => {
              if (error.code === 0) {
                this.$message.success('修改成功')
                this.handleCancel()
                this.$emit('fetchData')
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
        deptId: undefined
      }
    }
  }
}
</script>

