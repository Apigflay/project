<template>
  <div class="AuditRecordDrawer">
    <a-drawer width="800" title="审核记录" :visible="visible" :closable="false" @close="handleClose">
      <a-timeline>
        <a-timeline-item v-for="item in dataSource" :key="item.id">
          <a-descriptions :title="item.operation === 0 ? '审核不通过' : '审核通过'" :column="2">
            <a-descriptions-item label="审核时间">{{ item.updateTime | unix2String }} </a-descriptions-item>
            <a-descriptions-item label="审核人账号">{{ item.auditUser.username }} </a-descriptions-item>
            <a-descriptions-item label="审核人昵称">{{ item.auditUser.nickname }} </a-descriptions-item>
            <a-descriptions-item label="操作部门">{{ item.auditDept.departmentName }} </a-descriptions-item>
            <a-descriptions-item label="备注">{{ item.remark }} </a-descriptions-item>
          </a-descriptions>
        </a-timeline-item>
      </a-timeline>
    </a-drawer>
  </div>
</template>

<script>
import { getAuditRecordList } from '@/api/api'
export default {
  name: 'AuditRecordDrawer',

  props: ['visible', 'recordId'],

  data() {
    return {
      dataSource: [],
    }
  },

  watch: {
    visible(value) {
      if (value === true) {
        getAuditRecordList(this.recordId).then(({ error, response }) => {
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

