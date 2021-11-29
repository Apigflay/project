<template>
  <div class="traffic-data">
    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="config-row">
          <div>
            <a-select
              v-model="datatype"
              @change="datatypeChange"
              style="width:120px;margin-right:16px;"
            >
              <a-select-option value="HourCarflow">小时车流量</a-select-option>
              <a-select-option value="DateCarflow">天车流量</a-select-option>
              <a-select-option value="Carflow">瞬时车流量</a-select-option>
            </a-select>
            <a-select :value="displayType" @change="displayTypeChange">
              <a-select-option value="list">列表显示</a-select-option>
              <a-select-option value="line">图形显示</a-select-option>
            </a-select>
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
          :rowKey="(record, index) => index"
          :scroll="{y:560}"
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
import { getHisData, GetHisDataForPic, GetHisDataForExcel } from '@/api/api'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

const columns = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    width: 200,
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: '总车流量',
    dataIndex: 'TotalFlux',
    width: 150,
    sorter: (a, b) => a.TotalFlux - b.TotalFlux
  },
  {
    title: '平均车速(km/h)',
    dataIndex: 'AvgSpeed',
    width: 150,
    sorter: (a, b) => a.AvgSpeed - b.AvgSpeed
  },
  {
    title: '平均车流量',
    dataIndex: 'PerFlux',
    width: 150,
    sorter: (a, b) => a.PerFlux - b.PerFlux
  },
  {
    title: '大车平均车流量',
    dataIndex: 'CarNums',
    width: 150,
    sorter: (a, b) => a.CarNums - b.CarNums
  },
  {
    title: '中车平均车流量',
    dataIndex: 'MidCarNums',
    width: 150,
    sorter: (a, b) => a.MidCarNums - b.MidCarNums
  },
  {
    title: '小车平均车流量',
    dataIndex: 'ShortCarNums',
    width: 150,
    sorter: (a, b) => a.ShortCarNums - b.ShortCarNums
  }
]

export default {
  props: ['pointCode', 'dateRange'],

  data() {
    return {
      loading: false,
      loading_download: false,
      columns,
      dataSource_list: [],
      dataSource_line: [],
      datatype: 'HourCarflow',
      displayType: 'list',

      page: {
        currentpage: 1,
        pagesize: 100000000,
        total: 0,
        pageSizeOptions: ['100000000']
      },

      chart: null
    }
  },

  created() {
    if (this.pointCode) {
      this.fetchData()
    }
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
          pagesize: this.page.pagesize
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
          this.loading = false
        })
      } else if (this.displayType === 'line') {
        this.chart.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        if (this.datatype === 'Carflow') {
          let params = {
            measurecode: this.pointCode.split('-')[0],
            noisemeasureid: this.pointCode.split('-')[1],
            datatype: this.datatype,
            stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
            etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
          }

          let diffSecond = moment(params.etime).diff(moment(params.stime), 'second')
          params.interval = this.getInterVal(diffSecond)

          GetHisDataForPic(params).then(res => {
            let result = JSON.parse(res.d)
            if (!result.Error) {
              this.dataSource_line = result
            } else {
              this.dataSource_line = []
              // this.$message.error('获取数据出错')
            }
            this.drawLine()
          })
        } else {
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
      }
    },

    drawLine() {
      let dom = document.getElementById('line')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart = this.$echarts.init(dom)

      var option = {
        animation: false,

        tooltip: {
          trigger: 'axis'
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
          data: ['总车流量', '大车流量', '中车流量', '小车流量']
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
            max: Math.max.apply(
              Math,
              this.dataSource_line.map(item => {
                return item.TotalFlux
              })
            )
          }
        ],

        series: [
          {
            name: '总车流量',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item.TotalFlux
            })
          },
          {
            name: '大车流量',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item.CarNums
            })
          },
          {
            name: '中车流量',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item.MidCarNums
            })
          },
          {
            name: '小车流量',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item.ShortCarNums
            })
          }
        ]
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
        case 'HourCarflow':
          this.page.pagesize = 100000000
          this.page.pageSizeOptions = ['100000000']
          break
        case 'DateCarflow':
          this.page.pagesize = 100000000
          this.page.pageSizeOptions = ['100000000']
          break
        case 'Carflow':
          this.page.pagesize = 10
          this.page.pageSizeOptions = ['10', '100', '1000']
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

    getInterVal(diffSecond) {
      let param7 = 1
      if (diffSecond < 3600) {
        param7 = 1
      } else if (diffSecond < 86400) {
        param7 = 60 * 1
      } else if (diffSecond < 86400 * 2) {
        param7 = 60 * 2
      } else {
        param7 = 60 * 3
      }
      return param7
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
    }
  }
}
</script>

