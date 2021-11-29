<template>
  <div class="front-event">
    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="config-row">
          <a-select
            v-model="eventtype"
            @change="eventtypeChange"
            style="width:150px;"
          >
            <a-select-option :value="0">所有事件</a-select-option>
            <a-select-option :value="1">超标</a-select-option>
            <a-select-option :value="2">加热</a-select-option>
            <!-- <a-select-option :value="3">录音</a-select-option> -->
            <a-select-option :value="4">校准</a-select-option>
            <a-select-option :value="5">测点连接</a-select-option>
            <a-select-option :value="6">仪器开关机</a-select-option>
            <a-select-option :value="7">停电</a-select-option>
            <a-select-option :value="8">机箱门被打开</a-select-option>
            <a-select-option :value="9">读声级计出错</a-select-option>
            <a-select-option :value="10">CF卡出错</a-select-option>
            <a-select-option :value="11">USB口出错</a-select-option>
            <a-select-option :value="12">电池电压不足</a-select-option>
          </a-select>
          <a-button
            icon="download"
            @click="clickDownload"
            :loading="loading_download"
          >导出</a-button>
        </div>
      </div>

      <a-table
        class="table"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="false"
        :rowKey="(record, index) => index"
        :scroll="{ x:1300, y: 600 }"
      >
        <span slot="RecordList" slot-scope="text">
          <div v-if="text.length>0">
            <a-button size="small" @click="clickLookModal(text,'录音')">查看录音</a-button>
          </div>
        </span>

        <span slot="PhotoList" slot-scope="text">
          <div v-if="text.length>0">
            <a-button size="small" @click="clickLookModal(text,'图片')">查看图片</a-button>
          </div>
        </span>
      </a-table>

      <a-pagination
        showSizeChanger
        :showTotal="total => `共 ${total} 条`"
        :pageSizeOptions="page.pageSizeOptions"
        v-model="page.currentpage"
        :pageSize.sync="page.pagesize"
        :total="page.total"
        @change="pageChange"
        @showSizeChange="pageSizeChange"
      />

      <a-modal
        :title="'查看' + modalTitle"
        :visible="visible"
        destroyOnClose
        centered
        width="520px"
        :footer="null"
        @cancel="visible = false"
      >
        <a-table
          :columns="modalColumns"
          :data-source="modalDataSource"
          size="small"
          :rowKey="(record,index)=>record.id"
        >
          <span slot="action" slot-scope="text,record">
            <a-button size="small" @click="clicklookFile(record.fileName)">查看</a-button>
          </span>
        </a-table>
      </a-modal>
    </div>
  </div>
</template>


<script>
import { getHisData, GetHisDataForExcel } from '@/api/api'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

const columns = [
  {
    title: '级别',
    dataIndex: 'EventLevel',
    sorter: (a, b) => a.EventLevel - b.EventLevel,
    width: 100,
    scopedSlots: { customRender: 'EventLevel' }
  },
  {
    title: '开始时间',
    dataIndex: 'EventRecord',
    width: 200,
    sorter: (a, b) => Date.parse(a.EventRecord) - Date.parse(b.EventRecord)
  },
  {
    title: '结束时间',
    dataIndex: 'EventTime',
    width: 200,
    sorter: (a, b) => Date.parse(a.EventTime) - Date.parse(b.EventTime)
  },
  {
    title: '来源',
    width: 100,
    dataIndex: 'EventSource'
  },
  {
    title: '事件ID',
    width: 100,
    dataIndex: 'EventID'
  },
  {
    title: '类型',
    width: 100,
    dataIndex: 'EventType'
  },
  {
    title: '用户',
    width: 100,
    dataIndex: 'User'
  },
  {
    title: 'IP',
    width: 200,
    dataIndex: 'IP'
  },
  {
    title: '描述',
    width: 200,
    dataIndex: 'EventDescribe'
  }
]

//超标
const columns_over = [
  {
    title: '级别',
    dataIndex: 'EventLevel',
    sorter: (a, b) => a.EventLevel - b.EventLevel,
    width: 100,
    scopedSlots: { customRender: 'EventLevel' }
  },
  {
    title: '开始时间',
    dataIndex: 'EventRecord',
    width: 200,
    sorter: (a, b) => Date.parse(a.EventRecord) - Date.parse(b.EventRecord)
  },
  {
    title: '结束时间',
    dataIndex: 'EventTime',
    width: 200,
    sorter: (a, b) => Date.parse(a.EventTime) - Date.parse(b.EventTime)
  },
  {
    title: '来源',
    width: 100,
    dataIndex: 'EventSource'
  },
  {
    title: '事件ID',
    width: 100,
    dataIndex: 'EventID'
  },
  {
    title: '类型',
    width: 100,
    dataIndex: 'EventType'
  },
  {
    title: '用户',
    width: 100,
    dataIndex: 'User'
  },
  {
    title: 'IP',
    width: 200,
    dataIndex: 'IP'
  },
  {
    title: '描述',
    width: 200,
    dataIndex: 'EventDescribe'
  },
  {
    title: '录音',
    width: 100,
    dataIndex: 'RecordList',
    scopedSlots: { customRender: 'RecordList' }
  },
  {
    title: '图片',
    width: 100,
    dataIndex: 'PhotoList',
    scopedSlots: { customRender: 'PhotoList' }
  }
]

const modalColumns = [
  {
    title: '文件',
    dataIndex: 'displayName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  props: ['pointCode', 'dateRange'],

  data() {
    return {
      loading: false,
      columns: columns_over,
      modalColumns,
      dataSource: [],
      modalDataSource: [],
      modalTitle: '',

      page: {
        currentpage: 1,
        pagesize: 10,
        total: 0,
        pageSizeOptions: ['10', '100', '1000']
      },

      datatype: 'EventData',
      eventtype: 0,

      loading_download: false,
      visible: false //查看录音modal
    }
  },

  created() {
    if (this.pointCode) {
      this.fetchData()
    }
  },

  methods: {
    moment,

    fetchData(pageChange) {
      if (!this.pointCode) {
        this.$message.warning('请选择测点')
        return
      }
      this.loading = true
      if (!pageChange) {
        this.page.currentpage = 1
      }
      let params = {
        measurecode: this.pointCode.split('-')[0],
        noisemeasureid: this.pointCode.split('-')[1],
        datatype: this.datatype,
        stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        currentpage: this.page.currentpage,
        pagesize: this.page.pagesize,
        eventtype: this.eventtype
      }
      getHisData(params).then(res => {
        let result = JSON.parse(res.d)
        if (!result.Error) {
          this.dataSource = result.DataInfo
          this.page.total = result.count
        } else {
          this.dataSource = []
          this.page.total = 0
          // this.$message.error('获取数据出错')
        }
        this.loading = false
      })
    },

    pageSizeChange(current, size) {
      this.page.pagesize = size
      this.fetchData()
    },

    pageChange(page, pageSize) {
      this.page.currentpage = page
      this.fetchData(true)
    },

    clickDownload() {
      if (!this.pointCode) {
        this.$message.warning('请选择测点')
        return
      }
      this.loading_download = true
      let params = {
        measurecode: this.pointCode.split('-')[0],
        noisemeasureid: this.pointCode.split('-')[1],
        datatype: this.datatype,
        stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        eventtype: this.eventtype
      }

      GetHisDataForExcel(params).then(res => {
        let result = JSON.parse(res.d)
        if (!result.Error) {
          window.open(`/static-file/docs/res/${result.Msg}`, '_self')
        }
        this.loading_download = false
      })
    },

    eventtypeChange(value) {
      //所有事件，和超标事件
      if (value == 0 || value == 1) {
        this.columns = columns_over
      } else {
        this.columns = columns
      }

      this.fetchData()
    },

    clickLookModal(list, modalTitle) {
      this.visible = true
      this.modalTitle = modalTitle
      this.modalDataSource = list.map((item, index) => {
        return {
          id: index,
          fileName: item,
          displayName: `${modalTitle}${index + 1}`
        }
      })
    },

    clicklookFile(fileName) {
      if (this.modalTitle === '录音') {
        window.open(`/static-file/video${fileName}`, '_blank')
      } else if (this.modalTitle === '图片') {
        window.open(`/static-file/image${fileName}`, '_blank')
      }
    }
  }
}
</script>

