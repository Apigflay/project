<template>
  <div class="statistics-data">
    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="config-row">
          <div>
            <a-select
              v-model="datatype"
              @change="datatypeChange"
              style="width:110px;margin-right:16px;"
            >
              <a-select-option value="StaData">T分钟统计</a-select-option>
              <a-select-option value="HourStaData">小时统计</a-select-option>
              <a-select-option value="DateStaData">天统计</a-select-option>
            </a-select>
            <a-select :value="displayType" @change="displayTypeChange">
              <a-select-option value="list">列表显示</a-select-option>
              <a-select-option value="line">图形显示</a-select-option>
            </a-select>

            <a-divider type="vertical" style="margin:0px 24px;"></a-divider>

            <a-input
              v-model="remark"
              style="width:300px;margin-right:16px;transform:translateY(1px)"
              allowClear
              placeholder="请输入审核意见"
            ></a-input>

            <span>
              <a-button
                style="margin-right:16px;"
                @click="handleJudge(true)"
              >审核通过</a-button>
              <a-button
                style="margin-right:16px;"
                @click="handleJudge(false)"
              >审核不通过</a-button>
            </span>
          </div>

          <a-button
            icon="download"
            @click="clickDownload"
            :loading="loading_download"
          >导出</a-button>
        </div>
      </div>

      <div v-show="displayType === 'list'">
        <a-table
          class="table"
          :columns="columns"
          :dataSource="dataSource_list"
          :loading="loading"
          :pagination="false"
          :rowKey="(record, index) => record.MeasureTime + record.MeasureCode"
          :scroll="{ x:2500, y: 560 }"
          :rowClassName="rowClassNameFunction"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps }"
        >
          <span
            slot="CheckState"
            slot-scope="CheckState"
          >{{CheckState|CheckStateFormat}}</span>
          <span slot="OkState" slot-scope="OkState">{{OkState|OkStateFormat}}</span>
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
        >
          <template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value!=='100000000'">{{props.value}}条/页</span>
            <span v-if="props.value==='100000000'">全部</span>
          </template>
        </a-pagination>
      </div>

      <div
        v-show="displayType === 'line'"
        id="line"
        style="width: 100%; height: 665px;"
      ></div>
    </div>
  </div>
</template>


<script>
import { getHisData, GetHisDataForExcel, auditData, getConfigList } from '@/api/api'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

const columns_minute_hour = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    width: 200,
    fixed: 'left',
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: 'LeqT',
    dataIndex: 'LeqT',
    sorter: (a, b) => a.LeqT - b.LeqT,
    width: 100,
    scopedSlots: { customRender: 'LeqT' }
  },
  {
    title: 'Lmax',
    dataIndex: 'LAFmax',
    sorter: (a, b) => a.LAFmax - b.LAFmax,
    width: 100,
    scopedSlots: { customRender: 'LAFmax' }
  },
  {
    title: 'Lmin',
    dataIndex: 'LAFmin',
    sorter: (a, b) => a.LAFmin - b.LAFmin,
    width: 100,
    scopedSlots: { customRender: 'LAFmin' }
  },
  {
    title: 'L5',
    dataIndex: 'LAF5',
    sorter: (a, b) => a.LAF5 - b.LAF5,
    width: 100,
    scopedSlots: { customRender: 'LAF5' }
  },
  {
    title: 'L10',
    dataIndex: 'LAF10',
    sorter: (a, b) => a.LAF10 - b.LAF10,
    width: 100,
    scopedSlots: { customRender: 'LAF10' }
  },
  {
    title: 'L50',
    dataIndex: 'LAF50',
    sorter: (a, b) => a.LAF50 - b.LAF50,
    width: 100,
    scopedSlots: { customRender: 'LAF50' }
  },
  {
    title: 'L90',
    dataIndex: 'LAF90',
    sorter: (a, b) => a.LAF90 - b.LAF90,
    width: 100,
    scopedSlots: { customRender: 'LAF90' }
  },
  {
    title: 'L95',
    dataIndex: 'LAF95',
    sorter: (a, b) => a.LAF95 - b.LAF95,
    width: 100,
    scopedSlots: { customRender: 'LAF95' }
  },
  {
    title: 'SD',
    dataIndex: 'SD',
    sorter: (a, b) => a.SD - b.SD,
    width: 100,
    scopedSlots: { customRender: 'SD' }
  },
  {
    title: '有效采集率',
    dataIndex: 'Rate',
    sorter: (a, b) => a.Rate - b.Rate,
    scopedSlots: { customRender: 'Rate' },
    width: 150
  },
  {
    title: '风速',
    dataIndex: 'MaxSpeed',
    width: 100
  },
  {
    title: '雨量',
    dataIndex: 'PRF',
    width: 100
  },
  {
    title: '小车流量',
    dataIndex: 'ShortCarNums',
    width: 100
  },
  {
    title: '中车流量',
    dataIndex: 'MidCarNums',
    width: 100
  },
  {
    title: '大车流量',
    dataIndex: 'CarNums',
    width: 100
  },
  {
    title: '总车流量',
    dataIndex: 'TotalFlux',
    width: 100
  },
  {
    title: '审核状态',
    dataIndex: 'CheckState',
    scopedSlots: { customRender: 'CheckState' }
  }
]

const columns_day = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    width: 200,
    fixed: 'left',
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: 'Ld',
    dataIndex: 'Ld',
    width: 100,
    sorter: (a, b) => a.Ld - b.Ld,
    scopedSlots: { customRender: 'Ld' }
  },
  {
    title: 'Ln',
    dataIndex: 'Ln',
    width: 100,
    sorter: (a, b) => a.Ln - b.Ln,
    scopedSlots: { customRender: 'Ln' }
  },
  {
    title: 'Ldn',
    dataIndex: 'Ldn',
    width: 100,
    sorter: (a, b) => a.Ldn - b.Ldn,
    scopedSlots: { customRender: 'Ldn' }
  },
  {
    title: 'LeqT',
    dataIndex: 'LeqT',
    width: 100,
    sorter: (a, b) => a.LeqT - b.LeqT,
    scopedSlots: { customRender: 'LeqT' }
  },
  {
    title: 'Lmax',
    dataIndex: 'LAFmax',
    width: 100,
    sorter: (a, b) => a.LAFmax - b.LAFmax,
    scopedSlots: { customRender: 'LAFmax' }
  },
  {
    title: 'Lmin',
    dataIndex: 'LAFmin',
    width: 100,
    sorter: (a, b) => a.LAFmin - b.LAFmin,
    scopedSlots: { customRender: 'LAFmin' }
  },
  {
    title: 'L5',
    dataIndex: 'LAF5',
    width: 100,
    sorter: (a, b) => a.LAF5 - b.LAF5,
    scopedSlots: { customRender: 'LAF5' }
  },
  {
    title: 'L10',
    dataIndex: 'LAF10',
    width: 100,
    sorter: (a, b) => a.LAF10 - b.LAF10,
    scopedSlots: { customRender: 'LAF10' }
  },
  {
    title: 'L50',
    dataIndex: 'LAF50',
    width: 100,
    sorter: (a, b) => a.LAF50 - b.LAF50,
    scopedSlots: { customRender: 'LAF50' }
  },
  {
    title: 'L90',
    dataIndex: 'LAF90',
    width: 100,
    sorter: (a, b) => a.LAF90 - b.LAF90,
    scopedSlots: { customRender: 'LAF90' }
  },
  {
    title: 'L95',
    dataIndex: 'LAF95',
    width: 100,
    sorter: (a, b) => a.LAF95 - b.LAF95,
    scopedSlots: { customRender: 'LAF95' }
  },
  {
    title: 'SD',
    dataIndex: 'SD',
    width: 100,
    sorter: (a, b) => a.SD - b.SD,
    scopedSlots: { customRender: 'SD' }
  },
  {
    title: '有效采集率',
    dataIndex: 'Rate',
    sorter: (a, b) => a.Rate - b.Rate,
    scopedSlots: { customRender: 'Rate' },
    width: 150
  },
  {
    title: '风速',
    dataIndex: 'MaxSpeed',
    width: 100
  },
  {
    title: '雨量',
    dataIndex: 'PRF',
    width: 100
  },
  {
    title: '小车流量',
    dataIndex: 'ShortCarNums',
    width: 100
  },
  {
    title: '中车流量',
    dataIndex: 'MidCarNums',
    width: 100
  },
  {
    title: '大车流量',
    dataIndex: 'CarNums',
    width: 100
  },
  {
    title: '总车流量',
    dataIndex: 'TotalFlux',
    width: 100
  },
  {
    title: '审核状态',
    dataIndex: 'CheckState',
    scopedSlots: { customRender: 'CheckState' }
  }
]

export default {
  props: ['pointCode', 'dateRange', 'overForm'],

  data() {
    return {
      loading: false,
      loading_download: false,
      columns: [],
      dataSource_list: [],
      dataSource_line: [],
      datatype: 'StaData',
      displayType: 'list',

      setting: {
        day: undefined,
        night: undefined
      },

      page: {
        currentpage: 1,
        pagesize: 10,
        total: 0,
        pageSizeOptions: ['10', '100', '1000']
      },

      chart: null,
      selectedRowKeys: [],
      remark: undefined
    }
  },

  created() {
    this.columns = columns_minute_hour
    if (this.pointCode) {
      this.fetchData()
    }
    let param = {
      'keys':'daytime.start.hour'
    }
    getConfigList(param).then(({ error, response }) => {
        if (error.code == 0) {
          let day = Number(response.dataList[0].settingValue);
          this.setting.day = day;
          this.setting.night = day + 16;
        }
      })
  },

  mounted() {
    this.drawLine()

    window.onresize = () => {
      this.chart.resize()
    }
  },

  methods: {
    moment,

    fetchData() {
      if (!this.pointCode) {
        this.$message.warning('请选择测点')
        return
      }
      if (this.displayType === 'list') {
        this.loading = true
        let params = {
          measurecode: this.pointCode.split('-')[0],
          noisemeasureid: this.pointCode.split('-')[1],
          datatype: this.datatype,
          stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
          etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
          currentpage: this.page.currentpage,
          pagesize: this.page.pagesize,
          selwea: 1,
          selcar: 1
        }

        getHisData(params).then(res => {
          let result = JSON.parse(res.d)
          if (!result.Error) {
            this.dataSource_list = result.DataInfo
            this.page.total = result.count
          } else {
            this.dataSource_list = []
            this.page.total = 0
            // this.$message.error('获取数据出错')
          }
          // this.dataSource_list = [
          //   { MeasureTime: '2020', LeqT: 100, PRF: 100, MaxSpeed: 100, TotalFlux: 100, LAF10: 100 },
          //   { LeqT: 66, PRF: 66, MaxSpeed: 100, TotalFlux: 100, LAF10: 100, CheckState: '' }
          // ]
          this.loading = false
        })
      } else if (this.displayType === 'line') {
        this.chart &&
          this.chart.showLoading({
            text: '',
            color: '#1BD39B',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
          })

        let params = {
          measurecode: this.pointCode.split('-')[0],
          noisemeasureid: this.pointCode.split('-')[1],
          datatype: this.datatype,
          stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
          etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
          currentpage: 1,
          pagesize: 100000000
        }

        getHisData(params).then(res => {
          let result = JSON.parse(res.d)
          if (!result.Error) {
            this.dataSource_line = result.DataInfo
          } else {
            this.dataSource_line = []
            // this.$message.error('获取数据出错')
          }
          this.drawLine()
        })
      }
    },

    drawLine() {
      let dom = document.getElementById('line')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart = this.$echarts.init(dom)

      let legendData = this.columns.map((item, index) => {
        return item.title
      })
      legendData = legendData.slice(1)

      let series = this.columns.map((item, index) => {
        if (index > 0) {
          return {
            name: item.title,
            showSymbol: false,
            connectNulls: false,
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item2 => {
              return item2[item.dataIndex]
            })
          }
        }
      })
      series = series.slice(1)

      let option = {
        animation: false,

        tooltip: {
          trigger: 'axis',
          formatter: params => {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              if (params[i].seriesName === '有效采集率') {
                relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}%`
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}dB`
            }
            return relVal
          }
        },

        color: [
          '#FF0000',
          '#00BFFF',
          '#FF00FF',
          '#1ce322',
          '#bf686d',
          '#EE7942',
          '#99FF00',
          '#4400FF',
          '#0856FF',
          '#2ae0c8',
          '#585858',
          '#800080'
        ],

        legend: {
          data: legendData
        },

        grid: {
          left: '50px',
          right: '80px',
          bottom: '20px',
          containLabel: true
        },

        xAxis: {
          axisLabel: {
            lineHeight: 24,
            showMaxLabel: true,
            showMinLabel: true
          },
          type: 'category',
          boundaryGap: false,
          data: this.dataSource_line.map(item => {
            return item.MeasureTime
          })
        },

        yAxis: [
          {
            min: 0,
            max: 120
          }
        ],

        series: series
      }

      this.chart.clear()
      this.chart.setOption(option, true)
      this.chart.resize()
      this.chart.hideLoading()
    },

    pageSizeChange(current, size) {
      this.page.pagesize = size
      this.page.currentpage = 1
      this.fetchData()
    },

    pageChange(page, pageSize) {
      this.page.currentpage = page
      this.fetchData()
    },

    datatypeChange(value) {
      switch (value) {
        case 'StaData':
          this.columns = columns_minute_hour
          this.page.pagesize = 10
          this.page.pageSizeOptions = ['10', '100', '1000']
          break
        case 'HourStaData':
          this.columns = columns_minute_hour
          this.page.pagesize = 100000000
          this.page.pageSizeOptions = ['100000000']
          break
        case 'DateStaData':
          this.columns = columns_day
          this.page.pagesize = 100000000
          this.page.pageSizeOptions = ['100000000']
          break
      }
      this.page.currentpage = 1
      this.fetchData()
    },

    displayTypeChange(value) {
      this.displayType = value
      this.page.currentpage = 1
      this.fetchData()
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
        eventtype: ''
      }

      GetHisDataForExcel(params).then(res => {
        let result = JSON.parse(res.d)
        if (!result.Error) {
          window.open(`/static-file/docs/res/${result.Msg}`, '_self')
        }
        this.loading_download = false
      })
    },

    getHourTime(times) {
      var timearr = times.replace(" ", ":").replace(".", ":").replace(/\:/g, "-").split("-");
      return Number(timearr[3] + "." + timearr[4] + timearr[5])
    },

    rowClassNameFunction(record) {
      function isEmpty(value) {
        return value === '' || value === undefined || value === null
      }

      if (record.CheckState == 1) {
        return 'success-color'
      }

      if (record.CheckState == 2) {
        return 'error-color'
      }

      let flag = false, leqDay = false, leqNight = false
      let time = this.getHourTime(record.MeasureTime)
      if (!isEmpty(this.overForm.leqt_day)) {
        leqDay = ((time >= this.setting.day && time < this.setting.night) && (record.LeqT > this.overForm.leqt_day || record.Ln > this.overForm.leqt_day))
      }
      if (!isEmpty(this.overForm.leqt_night)) {
        leqNight = ((time < this.setting.day || time >= this.setting.night) && (record.LeqT > this.overForm.leqt_night || record.Ld > this.overForm.leqt_night))
      }
      flag = flag || (leqDay || leqNight)
      if (!isEmpty(this.overForm.speed)) {
        flag = flag || record.MaxSpeed > this.overForm.speed
      }
      if (!isEmpty(this.overForm.rain)) {
        flag = flag || record.PRF > this.overForm.rain
      }
      if (!isEmpty(this.overForm.car)) {
        flag = flag || record.TotalFlux > this.overForm.car
      }
      if (!isEmpty(this.overForm.rate)) {
        flag = flag || record.Rate < this.overForm.rate
      }
      if (this.overForm.burst) {
        flag = flag || parseFloat(record.LeqT) > parseFloat(record.LAF10)
      }

      if (
        isEmpty(this.overForm.leqt_day) &&
        isEmpty(this.overForm.leqt_night) &&
        isEmpty(this.overForm.speed) &&
        isEmpty(this.overForm.rain) &&
        isEmpty(this.overForm.car) &&
        isEmpty(this.overForm.rate) &&
        this.overForm.burst == false
      ) {
        flag = false
      }

      return flag ? 'warning-color' : ''
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    getCheckboxProps(record) {
      let bool
      bool = record.CheckState != 0
      return {
        props: {
          disabled: bool
        }
      }
    },

    handleJudge(operation) {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据')
        return
      }

      if (this.remark === undefined || this.remark === '') {
        this.$message.warning('请输入审核意见')
        return
      }
      let param = {}
      param.operation = operation
      param.auditMessage = this.remark
      param.measureId = Number(this.pointCode.split('-')[2])
      if (this.datatype === 'StaData') {
        param.recordType = 2
      } else if (this.datatype === 'HourStaData') {
        param.recordType = 0
      } else if (this.datatype === 'DateStaData') {
        param.recordType = 3
      }
      param.deviceSerialNo = this.pointCode.split('-')[1] //仪器串号

      function str2unix(str) {
        let s = str.substring(0, 19).replace(/-/g, '/')
        return new Date(s).getTime()
      }
      param.measureTimes = this.selectedRowKeys.map(item => str2unix(item))

      auditData(param).then(({ error, response }) => {
        if (error.code === 0) {
          this.$message.success('操作成功')
          this.remark = ''
          this.selectedRowKeys = []
          this.fetchData()
        }
      })
    }
  }
}
</script>

