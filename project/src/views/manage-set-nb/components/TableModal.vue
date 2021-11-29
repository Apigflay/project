<template>
  <div class="TableModal">
    <a-modal
      :title="modalKey"
      :visible="visible"
      destroyOnClose
      centered
      :maskClosable="false"
      width="90%"
      :footer="null"
      dialogClass="full-modal"
      @cancel="handleCancel"
    >
      <a-button
        v-if="!['历史绑定仪器', '历史绑定测点', '审核记录', '操作记录', '当前审核的子任务'].includes(modalKey)"
        type="primary"
        style="margin-bottom: 24px"
        @click="clickAdd"
        >{{ `创建${modalKey}` }}</a-button
      >

      <a-table
        v-if="modalKey === '仪器维修记录'"
        :columns="clounmsMaintain"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
      >
        <template slot="repairDate" slot-scope="repairDate">{{ repairDate | unix2String }}</template>

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="clickModify(record.id)">修改</a-button>
            <a-button type="danger" size="small" @click="clickDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table>

      <a-table
        v-if="modalKey === '校准器维修记录'"
        :columns="clounmsMaintain"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
      >
        <template slot="repairDate" slot-scope="repairDate">{{ repairDate | unix2String }}</template>

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="clickModify(record.id)">修改</a-button>
            <a-button type="danger" size="small" @click="clickDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table>

      <a-table
        v-if="modalKey === '风速仪维修记录'"
        :columns="clounmsMaintain"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
      >
        <template slot="repairDate" slot-scope="repairDate">{{ repairDate | unix2String }}</template>

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="clickModify(record.id)">修改</a-button>
            <a-button type="danger" size="small" @click="clickDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table>

      <!-- <a-table
        v-if="modalKey === '仪器检定记录'"
        :columns="clounmsInspect"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
      >
        <template slot="validDate" slot-scope="validDate">{{ validDate | unix2String }}</template>
        <template slot="verificationDate" slot-scope="verificationDate">{{ verificationDate | unix2String }}</template>

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="clickModify(record.id)">修改</a-button>
            <a-button type="danger" size="small" @click="clickDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table> -->

      <a-table
        v-if="modalKey === '仪器检定记录' || modalKey === '校准器检定记录' || modalKey === '风速仪检定记录'"
        :columns="modalKey === '校准器检定记录' ? clounmsInspectCalibrator : clounmsInspect"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
      >

        <template slot="certUrl" slot-scope="certUrl">
          <a :href="`${api_java}${certUrl}?token=${$store.state.user.token}`" target="_blank">
            <!-- {{certUrl | urlFormat}} -->
            <img :src="`${api_java}${certUrl}?token=${$store.state.user.token}`" style="max-height: 50px;max-width: 130px">
          </a>
        </template>
        <template slot="validity" slot-scope="validity">{{ validity }} 月</template>
        <template slot="verificationDate" slot-scope="verificationDate">{{ verificationDate | unix2String }}</template>

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="clickModify(record.id)">修改</a-button>
            <a-button type="danger" size="small" @click="clickDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table>

      <a-table
        v-if="modalKey === '历史绑定仪器'"
        :columns="clounmsHistoryInstrument"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
        :pagination="page"
        @change="handleTableChange"
      >
        <template slot="bindTime" slot-scope="bindTime">{{ bindTime | unix2String }}</template>
        <template slot="unbindTime" slot-scope="unbindTime">{{ unbindTime | unix2String }}</template>
        <template slot="deviceType" slot-scope="deviceType">{{ deviceType | deviceTypeFormat }}</template>

        <template slot="action" slot-scope="text, record">
          <a-button v-if="!record.unbindTime&&!record.unbindTime" size="small" @click="clickUnbind(record)">解绑</a-button>
        </template>
      </a-table>

      <a-table
        v-if="modalKey === '历史绑定测点'"
        :columns="clounmsHistoryPoint"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
        :pagination="page"
        @change="handleTableChange"
      >
        <template slot="bindTime" slot-scope="bindTime">{{ bindTime | unix2String }}</template>
        <template slot="unbindTime" slot-scope="unbindTime">{{ unbindTime | unix2String }}</template>
        <template slot="deviceType" slot-scope="deviceType">{{ deviceType | deviceTypeFormat }}</template>
      </a-table>

      <a-table
        v-if="modalKey === '审核记录'"
        :columns="clounmsAuditRecord"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
        :pagination="page"
        @change="handleTableChange"
      >
        <template slot="bindTime" slot-scope="bindTime">{{ bindTime | unix2String }}</template>
        <template slot="unbindTime" slot-scope="unbindTime">{{ unbindTime | unix2String }}</template>
      </a-table>

      <a-table
        v-if="modalKey === '操作记录'"
        :columns="clounmsOperateRecord"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
        :pagination="page"
        @change="handleTableChange"
      >
        <template slot="createTime" slot-scope="createTime">{{ createTime | unix2String }}</template>
        <template slot="originStatus" slot-scope="originStatus">{{ originStatus | taskStatusFormat }}</template>
        <template slot="targetStatus" slot-scope="targetStatus">{{ targetStatus | taskStatusFormat }}</template>
      </a-table>

      <a-table
        v-if="modalKey === '当前审核的子任务'"
        :columns="clounmsAuditSubTask"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(record) => record.id"
        :pagination="page"
        @change="handleTableChange"
      >
        <template slot="bindTime" slot-scope="bindTime">{{ bindTime | unix2String }}</template>
        <template slot="unbindTime" slot-scope="unbindTime">{{ unbindTime | unix2String }}</template>
      </a-table>
    </a-modal>

    <CommonModal
      :visible.sync="modalVisible"
      :pageKey="modalKey"
      :operate="operate"
      :modalData="modalData"
      :commonModalData="commonModalData"
      :recordId="recordId"
      @fetchData="fetchData"
    />
  </div>
</template>

<script>
import CommonModal from './CommonModal'
import { api_java  } from '@/api/urlConfig'
import {
  getMaintainList,
  getMaintain,
  deleteMaintain,
  getInspectList,
  getInspect,
  deleteInspect,
  getHistoryInstrumentList, //查看测点历史仪器
  getHistoryPointList, //查看仪器历史测点
  bindInstrument,
  getMaintainCalibratorList,
  getInspectCalibratorList,
  getMaintainAnemographList,
  getInspectAnemographList,
  getCalibrationAccuracy,
  getAuditRecordList,
  getOperateRecordList,
  getAuditSubTaskList,
} from '@/api/api'
const clounmsMaintain = [
  {
    dataIndex: 'reason',
    title: '维修原因',
  },
  {
    dataIndex: 'repairDate',
    title: '维修日期',
    scopedSlots: { customRender: 'repairDate' },
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const clounmsInspect = [
  {
    dataIndex: 'validity',
    title: '检定有效期',
    scopedSlots: { customRender: 'validity' },
  },
  {
    dataIndex: 'verificationDate',
    title: '检定日期',
    scopedSlots: { customRender: 'verificationDate' },
  },
  {
    dataIndex: 'accuracy',
    title: '精度',
  },
  {
    dataIndex: 'certUrl',
    title: '检定证书',
    scopedSlots: { customRender: 'certUrl' },
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const clounmsInspectCalibrator = [
  {
    dataIndex: 'validity',
    title: '检定有效期',
    scopedSlots: { customRender: 'validity' },
  },
  {
    dataIndex: 'verificationDate',
    title: '检定日期',
    scopedSlots: { customRender: 'verificationDate' },
  },
  {
    dataIndex: 'accuracy',
    title: '精度',
  },
  {
    dataIndex: 'value',
    title: '检定示值(dB)',
    scopedSlots: { customRender: 'value' },
  },
  {
    dataIndex: 'certUrl',
    title: '检定证书',
    scopedSlots: { customRender: 'certUrl' },
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const clounmsHistoryInstrument = [
  // {
  //   dataIndex: 'id',
  //   title: 'id'
  // },
  {
    dataIndex: 'deviceId',
    title: '仪器id',
  },
  {
    dataIndex: 'noiseMeasureID',
    title: '仪器编号',
  },
  {
    dataIndex: 'deviceType',
    title: '仪器类型',
    scopedSlots: { customRender: 'deviceType' },
  },
  // {
  //   dataIndex: 'measureCode',
  //   title: '测点编号'
  // },
  {
    dataIndex: 'bindTime',
    title: '绑定时间',
    scopedSlots: { customRender: 'bindTime' },
  },
  {
    dataIndex: 'unbindTime',
    title: '解绑时间',
    scopedSlots: { customRender: 'unbindTime' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const clounmsHistoryPoint = [
  // {
  //   dataIndex: 'id',
  //   title: 'id'
  // },
  // {
  //   dataIndex: 'noiseMeasureID',
  //   title: '仪器编号'
  // },
  // {
  //   dataIndex: 'deviceType',
  //   title: '仪器类型',
  //   scopedSlots: { customRender: 'deviceType' }
  // },
  {
    dataIndex: 'measureId',
    title: '测点id',
  },
  {
    dataIndex: 'measureCode',
    title: '测点编号',
  },
  {
    dataIndex: 'bindTime',
    title: '绑定时间',
    scopedSlots: { customRender: 'bindTime' },
  },
  {
    dataIndex: 'unbindTime',
    title: '解绑时间',
    scopedSlots: { customRender: 'unbindTime' },
  },
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' }
  // }
]

const clounmsAuditRecord = [
  {
    dataIndex: 'operation',
    title: '意见',
  },
  {
    dataIndex: 'create_time',
    title: '申请时间',
    scopedSlots: { customRender: 'create_time' },
  },
  {
    dataIndex: 'update_time',
    title: '审核时间',
    scopedSlots: { customRender: 'update_time' },
  },
  {
    dataIndex: 'applyId',
    title: '申请批次',
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
]

const clounmsOperateRecord = [
  {
    dataIndex: 'operation',
    title: '操作描述',
  },
  {
    dataIndex: 'createTime',
    title: '操作时间',
    scopedSlots: { customRender: 'createTime' },
  },
  {
    dataIndex: 'descriptions',
    title: '具体描述',
  },
  {
    dataIndex: 'originStatus',
    title: '变更前状态',
    scopedSlots: { customRender: 'originStatus' },
  },
  {
    dataIndex: 'targetStatus',
    title: '变更后状态',
    scopedSlots: { customRender: 'targetStatus' },
  },
  {
    dataIndex: 'nickname',
    title: '用户昵称',
  },
  {
    dataIndex: 'departmentName',
    title: '部门名称',
  },
]

const clounmsAuditSubTask = [
  // {
  //   dataIndex: 'id',
  //   title: 'id',
  // },
  {
    dataIndex: 'taskTitle',
    title: '任务标题',
  },
  {
    dataIndex: 'taskType',
    title: '任务分类',
    scopedSlots: { customRender: 'taskType' },
  },
  {
    dataIndex: 'taskStatus',
    title: '任务状态',
    scopedSlots: { customRender: 'taskStatus' },
  },
  {
    dataIndex: 'routineType',
    title: '常规监测数据类型',
    scopedSlots: { customRender: 'routineType' },
  },
  {
    dataIndex: 'nonRoutineName',
    title: '非常规监测类型名称',
  },
  {
    dataIndex: 'dataSubmitType',
    title: '非常规监测数据提交类型',
    scopedSlots: { customRender: 'dataSubmitType' },
  },
  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },
]
export default {
  name: 'TableModal',

  props: ['visible', 'recordId', 'modalKey', 'commonModalData'],

  components: {
    CommonModal,
  },

  data() {
    return {
      api_java,
      tableLoading: false,
      
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '500'],
      },

      clounmsMaintain,
      clounmsInspect,
      clounmsInspectCalibrator,
      clounmsHistoryInstrument,
      clounmsHistoryPoint,
      clounmsAuditRecord,
      clounmsOperateRecord,
      clounmsAuditSubTask,

      data: [],
      modalVisible: false,
      modalData: {},
      operate: '',
    }
  },

  watch: {
    visible(value) {
      if (value) {
        this.fetchData()
      }
    },
  },

  methods: {

    handleTableChange(pagination, filters, sorter) {
      this.page = { ...pagination }
      this.fetchData()
    },

    fetchData() {
      this.tableLoading = true
      if (this.modalKey === '仪器维修记录') {
        getMaintainList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '校准器维修记录') {
        getMaintainCalibratorList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '风速仪维修记录') {
        getMaintainAnemographList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '仪器检定记录') {
        getInspectList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '校准器检定记录') {
        getInspectCalibratorList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '风速仪检定记录') {
        getInspectAnemographList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '历史绑定仪器') {
        getHistoryInstrumentList({
          page: {
            size: this.page.pageSize,
            current: this.page.current,
          },
          keys: {
            measureId: this.recordId,
          },
        })
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.records
              this.page.total = response.total
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '历史绑定测点') {
        getHistoryPointList({
          page: {
            size: this.page.pageSize,
            current: this.page.current,
          },
          keys: {
            deviceId: this.recordId,
          },
        })
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.records
              this.page.total = response.total
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '审核记录') {
        getAuditRecordList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '操作记录') {
        getOperateRecordList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      } else if (this.modalKey === '当前审核的子任务') {
        getAuditSubTaskList(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }
    },

    handleCancel() {
      this.$emit('update:visible', false)
    },

    clickAdd() {
      if (this.modalKey === '校准器检定记录') {
        getCalibrationAccuracy(this.commonModalData.calibrationDeviceType).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '创建'
          }
        })
      } else {
        this.modalVisible = true
        this.operate = '创建'
      }
    },

    clickModify(id) {
      if (
        this.modalKey === '仪器维修记录' ||
        this.modalKey === '校准器维修记录' ||
        this.modalKey === '风速仪维修记录'
      ) {
        getMaintain(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }

      if (
        this.modalKey === '仪器检定记录' ||
        this.modalKey === '校准器检定记录' ||
        this.modalKey === '风速仪检定记录'
      ) {
        getInspect(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }
    },

    clickUnbind({ id, measureId, deviceId }) {
      bindInstrument({
        id,
        measureId,
        deviceId,
        operation: 0,
      }).then(({ error, response }) => {
        if (error.code === 0) {
          this.$message.success('解绑成功')
          this.fetchData()
        }
      })
    },

    clickDelete(id) {
      this.$confirm({
        title: '确定删除吗？',
        okType: 'danger',
        onOk: () => {
          return new Promise((resolve, reject) => {
            if (
              this.modalKey === '仪器维修记录' ||
              this.modalKey === '校准器维修记录' ||
              this.modalKey === '风速仪维修记录'
            ) {
              deleteMaintain(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (
              this.modalKey === '仪器检定记录' ||
              this.modalKey === '校准器检定记录' ||
              this.modalKey === '风速仪检定记录'
            ) {
              deleteInspect(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }
          })
        },
      })
    },
  },
}
</script>

<style lang="less">
.full-modal {
  padding-bottom: 0;
  top: 0px;
  .ant-modal-body {
    // min-height: calc(100vh - 55px);
  }
}
</style>
