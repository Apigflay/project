<template>
  <div class="system-event">
    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="search-row"></div>
        <a-button icon="download" @click="clickDownload" :loading="loading_download">导出</a-button>
      </div>

      <a-table
        class="table"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="false"
        :rowKey="(record, index) => index"
        :scroll="{ x:1300, y: 560 }"
      ></a-table>

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
    </div>
  </div>
</template>


<script>
import { getHisData, GetHisDataForExcel } from '@/api/api'
import moment from 'moment'

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
    width: 200,
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

export default {
  props: ['dateRange'],

  data() {
    return {
      loading: false,
      columns,
      dataSource: [],
      page: {
        currentpage: 1,
        pagesize: 10,
        total: 0,
        pageSizeOptions: ['10', '100', '1000']
      },
      datatype: 'SystemEvent',

      loading_download: false
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    moment,

    fetchData(pageChange) {
      this.loading = true
      if (!pageChange) {
        this.page.currentpage = 1
      }
      let params = {
        datatype: this.datatype,
        stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        currentpage: this.page.currentpage,
        pagesize: this.page.pagesize
      }

      getHisData(params).then(res => {
        let result = JSON.parse(res.d)
        this.dataSource = result.DataInfo
        this.page.total = result.count
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
      this.loading_download = true
      let params = {
        measurecode: '',
        noisemeasureid: '',
        datatype: this.datatype,
        stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        eventtype: ''
      }

      GetHisDataForExcel(params).then(res => {
        let result = JSON.parse(res.d)
        if (!result.Error) {
          window.open(`/static-file/docs/res/${result.Msg}`, '_self')
        }
        this.loading_download = false
      })
    }
  }
}
</script>

