<template>
  <div class="to-be-confirmed-list">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据审核</a-breadcrumb-item>
        <a-breadcrumb-item>待审核确认列表</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">待审核确认列表</div>
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

        <template slot="action" slot-scope="text,record">
          <a-button
            size="small"
            style="margin:0px 8px 8px 0px;"
            @click="clickConfirm(record.auditRecordId,true)"
          >审核确认</a-button>
          <a-button
            size="small"
            @click="clickConfirm(record.auditRecordId,false)"
          >审核不确认</a-button>
        </template>

        <div
          slot="expandedRowRender"
          slot-scope="record"
          style="background:white;padding:24px 24px 8px 24px;"
        >
          <!-- <div class="expand-table">
            <span class="expand-table-title">过滤条件</span>
            <a-table :columns="columnsCondition" :data-source="[record.condition]" size="small" :pagination="false"></a-table>
          </div>-->

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

    <a-modal
      v-model="visible"
      title="审核意见"
      @ok="handleOk"
      @cancel="auditMessage=undefined"
    >
      <a-textarea v-model="auditMessage" placeholder="请输入审核意见" :rows="4"></a-textarea>
    </a-modal>
  </div>
</template>

<script>
import { getConfirmList, confirmData } from '@/api/api'

const columns = [
  { title: 'id', dataIndex: 'auditRecordId' },
  { title: '测点编号', dataIndex: 'measureCode' },

  { title: '审核人', dataIndex: 'auditBy' },
  { title: '审核结果', dataIndex: 'auditOperate', scopedSlots: { customRender: 'auditOperate' } },
  { title: '审核意见', dataIndex: 'auditMessage', ellipsis: true },
  { title: '审核时间', dataIndex: 'auditTime', scopedSlots: { customRender: 'auditTime' } },
  { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
]

const columnsCondition = [
  { title: '风速大于', dataIndex: 'windSpeed' },
  { title: '雨量大于', dataIndex: 'rainfall' },
  { title: 'leqT大于', dataIndex: 'leqT' },
  { title: '小车流量大于', dataIndex: 'minCar' },
  { title: '中车流量大于', dataIndex: 'midCar' },
  { title: '大车流量大于', dataIndex: 'largeCar' }
]

const columnsData = [
  { title: '测量时间', dataIndex: 'measureTime', scopedSlots: { customRender: 'measureTime' }, width: 150 },
  // { title: '测点编号', dataIndex: 'measureCode' },
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
  name: 'to-be-confirmed-list',

  data() {
    return {
      dataSource: [],
      columns,
      columnsCondition,
      columnsData,
      tableLoading: false,
      visible: false,
      auditMessage: undefined,
      auditRecordId: undefined,
      operation: undefined
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.tableLoading = true
      getConfirmList()
        .then(({ error, response }) => {
          if (error.code === 0) {
            this.dataSource = response.dataList
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    clickConfirm(auditRecordId, operation) {
      this.visible = true
      this.auditRecordId = auditRecordId
      this.operation = operation
    },

    handleOk() {
      if (this.auditMessage === undefined || this.auditMessage === '') {
        this.$message.warning('请输入审核意见')
        return
      }

      if (this.auditMessage.length > 500) {
        this.$message.warning('审核意见最大长度为500个字符')
        return
      }
      confirmData({
        auditRecordId: this.auditRecordId,
        operation: this.operation,
        auditMessage: this.auditMessage
      }).then(({ error, response }) => {
        if (error.code === 0) {
          this.$message.success('操作成功')
          this.visible = false
          this.fetchData()
        }
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

