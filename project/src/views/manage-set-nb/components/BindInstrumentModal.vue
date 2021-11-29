<template>
  <div class="BindInstrumentModal">
    <a-modal
      title="绑定仪器"
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
        <a-form-model-item label="选择仪器" prop="deviceId">
          <InstrumentSelect v-model="form.deviceId" :id="modalData.measureId" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import InstrumentSelect from './InstrumentSelect'
import { bindInstrument } from '@/api/api'
export default {
  name: 'BindInstrumentModal',

  components: {
    InstrumentSelect,
  },

  props: ['visible', 'modalData'],

  data() {
    return {
      loading: false,
      form: {
        deviceId: undefined,
      },
      rules: {
        deviceId: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    }
  },

  methods: {
    handleOk() {
      this.$refs.refForm.validate((valid) => {
        if (valid) {
          this.loading = true

          let param = {
            deviceId: this.form.deviceId,
            measureId: this.modalData.measureId,
            operation: 1,
          }

          bindInstrument(param)
            .then(({ error, response }) => {
              if (error.code === 0) {
                this.$message.success('绑定成功')
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
        deviceId: undefined,
      }
    },
  },
}
</script>

<style scoped lang="less">
</style>
