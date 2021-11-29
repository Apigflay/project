<template>
  <div class="look-history-modal">
    <a-modal
      title="操作界面"
      :visible="visible"
      @cancel="handleCancel"
      :maskClosable="false"
      style="top: 70px;"
      width="368px"
      :destroyOnClose="true"
      :footer="null"
    >
      <OperationInerface2001 :power="visible" :showCount="false" :mid="pointInfo.MeasureId"></OperationInerface2001>
    </a-modal>
  </div>
</template>

<script>
import OperationInerface2001 from '@/components/OperationInerface2001'

export default {
  name: 'SetUIModal',

  components: {
    OperationInerface2001
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    pointInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  methods: {
    handleCancel(e) {
      this.$emit('update:visible', false)
    }
  }
}
</script>

