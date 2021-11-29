<template>
  <div class="CommonModal">
    <a-modal
      :title="modalKey"
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
      <!-- 指派表单 -->
      <a-form-model v-if="modalKey === '指派'" :model="form" :rules="rules" ref="refForm">
        <a-form-model-item label="操作员" prop="operator">
          <OperatorSelect v-model="form.operator" />
        </a-form-model-item>
      </a-form-model>

      <!-- 审批表单 -->
      <a-form-model v-if="modalKey === '审批'" :model="form" :rules="rules" ref="refForm">
        <a-form-model-item label="意见" prop="operation">
          <a-select v-model="form.operation" placeholder="请选择" :defaultActiveFirstOption="false">
            <a-select-option :value="0"> 驳回 </a-select-option>
            <a-select-option :value="1"> 通过 </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="form.remark" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import OperatorSelect from './OperatorSelect'
import { assignTask, auditTask } from '@/api/api'

const rules = {
  operator: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  operation: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  remark: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
}

export default {
  name: 'SecondaryModal',

  components: {
    OperatorSelect,
  },

  props: ['visible', 'modalKey', 'recordId'],

  data() {
    return {
      rules,
      loading: false,
      form: {
        operator: undefined,
        operation: undefined,
        remark: undefined,
      },
    }
  },

  methods: {
    handleOk() {
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          let response
          this.loading = true
          if (this.modalKey === '指派') {
            response = await assignTask({
              id: this.recordId,
              operator: this.form.operator,
            })
          }

          if (this.modalKey === '审批') {
            response = await auditTask({
              id: this.recordId,
              operation: this.form.operation,
              remark: this.form.remark,
            })
          }

          if (response.error.code === 0) {
            this.$message.success(this.modalKey + '成功')
            this.handleCancel()
            this.$emit('fetchData')
          }
          setTimeout(() => {
            this.loading = false
          }, 500)
        }
      })
    },

    handleCancel() {
      this.$emit('update:visible', false)
      this.init()
    },

    init() {
      this.form = {
        operator: undefined,
        operation: undefined,
        remark: undefined,
      }
    },
  },
}
</script>

