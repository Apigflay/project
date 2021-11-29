<template>
  <div>
    <a-modal
      title="测点信息"
      :visible="visible"
      @ok="handleOk"
      :okText="okText"
      :cancelText="cancelText"
      @cancel="handleCancel"
      :maskClosable="false"
      style="top: 130px;"
      v-if="isResponsed()"
    >
      <div v-if="haveData">
        <a-alert message="请确认测点信息是否准确！" type="info" showIcon style="margin-bottom: 20px;" />
        <a-form :form="form" style="width:350px;margin:0 auto;">
          <a-form-item label="测点名称" v-bind="formItemLayout">
            <a-input v-model="realPointList()[0].MeasureName" read-only />
          </a-form-item>

          <a-form-item label="仪器编号" v-bind="formItemLayout">
            <a-input v-model="realPointList()[0].MeasureId" read-only />
          </a-form-item>

          <a-form-item label="测点地址" v-bind="formItemLayout">
            <a-input v-model="realPointList()[0].MeasureAddress" read-only />
          </a-form-item>
        </a-form>
      </div>

      <a-alert v-else message="暂无测点！请先添加测点！" type="warning" showIcon style="margin-bottom: 20px;" />
    </a-modal>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PointDataInfoModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
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
      form: this.$form.createForm(this)
    }
  },

  computed: {
    okText() {
      return this.haveData() ? '不准确！去添加或设置测点' : '去添加测点'
    },

    cancelText() {
      return this.haveData() ? '准确' : '关闭'
    }
  },

  methods: {
    ...mapGetters(['realPointList', 'isResponsed', 'haveData']),

    handleOk() {
      if (this.haveData()) {
        this.$router.push({
          name: 'point-manage'
        })
      } else {
        this.$router.push({
          name: 'point-manage',
          params: {
            addPointModalVisible: true
          }
        })
      }
    },

    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
