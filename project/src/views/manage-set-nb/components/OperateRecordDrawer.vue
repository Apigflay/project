<template>
  <div class="OperateRecordDrawer">
    <a-drawer width="800" title="操作记录" :visible="visible" :closable="false" @close="handleClose">
      <a-timeline>
        <a-timeline-item v-for="item in dataSource" :key="item.id">
          <a-descriptions :title="item.operation" :column="1">
            <a-descriptions-item label="操作时间">{{ item.createTime | unix2String }} </a-descriptions-item>
            <a-descriptions-item label="描述">{{ item.descriptions }} </a-descriptions-item>
          </a-descriptions>
        </a-timeline-item>
      </a-timeline>
    </a-drawer>
  </div>
</template>

<script>
import { getOperateRecordList } from '@/api/api'
export default {
  name: 'OperateRecordDrawer',

  props: ['visible', 'recordId'],

  data() {
    return {
      dataSource: [],
    }
  },

  watch: {
    visible(value) {
      if (value === true) {
        getOperateRecordList(this.recordId).then(({ error, response }) => {
          if (error.code === 0) {
            this.dataSource = response.dataList
          }
        })
      }
    },
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
