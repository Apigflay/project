<template>
  <div class="audit-history-list">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据审核</a-breadcrumb-item>
        <a-breadcrumb-item>审核历史列表</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">审核历史列表</div>
    </div>

    <div class="page-common-content">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :rowKey="record=>record.auditRecordId"
        :loading="tableLoading"
      >
        <template slot="auditOperate" slot-scope="text">
          <span
            :class="[text?'success-color':'error-color']"
          >{{text | auditFormat}}</span>
        </template>
        <template slot="auditTime" slot-scope="text">{{text | moment}}</template>
        <template slot="confirmOperate" slot-scope="text">
          <span
            :class="[text?'success-color':'error-color']"
          >{{text | auditFormat}}</span>
        </template>
        <template slot="confirmTime" slot-scope="text">{{text | moment}}</template>
        <div
          slot="expandedRowRender"
          slot-scope="record"
          style="background:white;padding:24px 24px 8px 24px;"
        >
          <div class="expand-table">
            <span class="expand-table-title">数据</span>
            <a-table
              :columns="columnsData"
              :data-source="record.datas"
              size="small"
              :rowKey="record=>record.measureTime"
            >
              <template slot="measureTime" slot-scope="text">{{text | moment}}</template>
            </a-table>
          </div>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getAuditHistoryList } from '@/api/api'

const columns = [
  { title: 'id', dataIndex: 'auditRecordId' },
  { title: '测点编号', dataIndex: 'measureCode' },

  { title: '审核人', dataIndex: 'auditBy' },
  { title: '审核结果', dataIndex: 'auditOperate', scopedSlots: { customRender: 'auditOperate' } },
  { title: '审核意见', dataIndex: 'auditMessage', ellipsis: true },
  { title: '审核时间', dataIndex: 'auditTime', scopedSlots: { customRender: 'auditTime' } },

  { title: '审核确认人', dataIndex: 'confirmBy' },
  { title: '审核确认结果', dataIndex: 'confirmOperate', scopedSlots: { customRender: 'confirmOperate' } },
  { title: '审核确认意见', dataIndex: 'confirmMessage', ellipsis: true },
  { title: '审核确认时间', dataIndex: 'confirmTime', scopedSlots: { customRender: 'confirmTime' } }
]

const columnsData = [
  { title: '测量时间', dataIndex: 'measureTime', scopedSlots: { customRender: 'measureTime' }, width: 150 },
  { title: 'Ld', dataIndex: 'ld' },
  { title: 'Ln', dataIndex: 'ln' },
  { title: 'Ldn', dataIndex: 'ldn' },
  { title: 'LeqT', dataIndex: 'leqT' },
  { title: 'L5', dataIndex: 'laf5' },
  { title: 'L10', dataIndex: 'laf10' },
  { title: 'L50', dataIndex: 'laf50' },
  { title: 'L90', dataIndex: 'laf90' },
  { title: 'L95', dataIndex: 'laf95' },
  { title: 'SD', dataIndex: 'sd' },
  { title: 'Lmax', dataIndex: 'lafmax' },
  { title: 'Lmin', dataIndex: 'lafmin' },
  { title: '有效采集率', dataIndex: 'rate' }
]

export default {
  name: 'audit-history-list',

  data() {
    return {
      dataSource: [],
      columns,
      columnsData,
      tableLoading: false
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.tableLoading = true
      getAuditHistoryList()
        .then(({ error, response }) => {
          if (error.code === 0) {
            this.dataSource = response.dataList
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>


<style lang="less" scoped>
.expand-table {
  .expand-table-title {
    display: inline-block;
    margin: 0px 0px 8px 0px;
  }
}
</style>

