<template>
  <div class="weather-data">
    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="config-row">
          <div>
            <a-select
              v-model="datatype"
              @change="datatypeChange"
              style="width:110px;margin-right:16px;"
            >
              <a-select-option value="HourWeather">小时气象</a-select-option>
              <a-select-option value="DateWeather">天气象</a-select-option>
              <a-select-option value="Weather">瞬时气象</a-select-option>
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
          :scroll="{ x:1500, y: 560 }"
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

      <!-- <div
        v-show="displayType === 'line'"
        id="line"
        style="width: 100%; height: 665px;margin-bottom:48px;"
      ></div>-->
      <div
        v-show="displayType === 'line'"
        id="speed"
        style="width: 100%; height: 665px;margin-bottom:48px;"
      ></div>

      <div
        v-show="displayType === 'line'"
        id="temperature"
        style="width: 100%; height: 665px;margin-bottom:48px;"
      ></div>

      <div
        v-show="displayType === 'line'"
        id="humidity"
        style="width: 100%; height: 665px;margin-bottom:48px;"
      ></div>

      <div
        v-show="displayType === 'line'"
        id="rainfall"
        style="width: 100%; height: 665px;margin-bottom:48px;"
      ></div>

      <div
        v-show="displayType === 'line'"
        id="direction"
        style="width: 100%; height: 665px;margin-bottom:48px;"
      ></div>

      <div
        v-show="displayType === 'line'"
        id="air"
        style="width: 100%; height: 665px;"
      ></div>
    </div>
  </div>
</template>


<script>
import { getHisData, GetHisDataForPic, GetHisDataForExcel } from '@/api/api'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

const columns_sec = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    width: 200,
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: '风速(m/s)',
    dataIndex: 'W-Speed',
    width: 100,
    sorter: (a, b) => a['W-Speed'] - b['W-Speed'],
    scopedSlots: { customRender: 'W-Speed' }
  },
  {
    title: '风向(°)',
    dataIndex: 'W-Direction',
    width: 100,
    sorter: (a, b) => a['W-Direction'] - b['W-Direction'],
    scopedSlots: { customRender: 'W-Direction' }
  },
  {
    title: '温度(℃)',
    dataIndex: 'A-Temp',
    width: 100,
    sorter: (a, b) => a['A-Temp'] - b['A-Temp'],
    scopedSlots: { customRender: 'A-Temp' }
  },
  {
    title: '湿度(%)',
    dataIndex: 'Humi-R',
    width: 100,
    sorter: (a, b) => a['Humi-R'] - b['Humi-R'],
    scopedSlots: { customRender: 'Humi-R' }
  },
  {
    title: '大气压(hPa)',
    dataIndex: 'Ari-P',
    width: 100,
    sorter: (a, b) => a['Ari-P'] - b['Ari-P'],
    scopedSlots: { customRender: 'Ari-P' }
  },
  {
    title: '雨量(mm)',
    dataIndex: 'PRF',
    width: 100,
    sorter: (a, b) => a.PRF - b.PRF,
    scopedSlots: { customRender: 'PRF' }
  }
]

const columns_hour_day = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    width: 200,
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: '风速(m/s)',
    dataIndex: 'W-Speed',
    width: 100,
    sorter: (a, b) => a['W-Speed'] - b['W-Speed']
  },
  {
    title: '风向(°)',
    dataIndex: 'W-Direction',
    width: 100,
    sorter: (a, b) => a['W-Direction'] - b['W-Direction']
  },
  {
    title: '温度(℃)',
    dataIndex: 'A-Temp',
    width: 100,
    sorter: (a, b) => a['A-Temp'] - b['A-Temp']
  },
  {
    title: '湿度(%)',
    dataIndex: 'Humi-R',
    width: 100,
    sorter: (a, b) => a['Humi-R'] - b['Humi-R']
  },
  {
    title: '大气压(hPa)',
    dataIndex: 'Ari-P',
    width: 100,
    sorter: (a, b) => a['Ari-P'] - b['Ari-P']
  },
  {
    title: '雨量(mm)',
    dataIndex: 'PRF',
    width: 100,
    sorter: (a, b) => a.PRF - b.PRF
  },
  {
    title: '最大风速(m/s)',
    dataIndex: 'MaxSpeed',
    width: 100,
    sorter: (a, b) => a.MaxSpeed - b.MaxSpeed
  },
  {
    title: '最小风速(m/s)',
    dataIndex: 'MinSpeed',
    width: 100,
    sorter: (a, b) => a.MinSpeed - b.MinSpeed
  },
  {
    title: '最大温度(℃)',
    dataIndex: 'MaxAtemp',
    width: 100,
    sorter: (a, b) => a.MaxAtemp - b.MaxAtemp
  },
  {
    title: '最小温度(℃)',
    dataIndex: 'MinAtemp',
    width: 100,
    sorter: (a, b) => a.MinAtemp - b.MinAtemp
  },
  {
    title: '最大湿度(%)',
    dataIndex: 'MaxHumi',
    width: 100,
    sorter: (a, b) => a.MaxHumi - b.MaxHumi
  },
  {
    title: '最小湿度(%)',
    dataIndex: 'MinHumi',
    width: 100,
    sorter: (a, b) => a.MinHumi - b.MinHumi
  }
]

export default {
  props: ['pointCode', 'dateRange'],

  data() {
    return {
      loading: false,
      loading_download: false,
      columns: [],
      dataSource_list: [],
      dataSource_line: [],
      datatype: 'HourWeather',
      displayType: 'list',

      page: {
        currentpage: 1,
        pagesize: 100000000,
        total: 0,
        pageSizeOptions: ['100000000']
      },

      chart_air: null,
      chart_speed: null,
      chart_temperature: null,
      chart_humidity: null,
      chart_rainfall: null,
      chart_direction: null
    }
  },

  // computed: {
  //   fields() {
  //     let obj = {}
  //     this.columns.forEach(item => {
  //       if (item.dataIndex === 'MeasureTime') {
  //         obj[`[${item.title}]`] = {
  //           field: item.dataIndex,
  //           callback: value => {
  //             return `[${value}]`
  //           }
  //         }
  //       } else {
  //         obj[`[${item.title}]`] = item.dataIndex
  //       }
  //     })
  //     return obj
  //   }
  // },

  created() {
    this.columns = columns_hour_day
    if (this.pointCode) {
      this.fetchData()
    }
  },

  mounted() {
    this.drawCharts()

    window.onresize = () => {
      this.chart_air.resize()
      this.chart_speed.resize()
      this.chart_temperature.resize()
      this.chart_humidity.resize()
      this.chart_rainfall.resize()
      this.chart_direction.resize()
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
        this.chart_air.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        this.chart_speed.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        this.chart_temperature.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        this.chart_humidity.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        this.chart_rainfall.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        this.chart_direction.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        if (this.datatype === 'Weather') {
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

            this.drawCharts()
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
            this.drawCharts()
          })
        }
      }
    },

    drawCharts() {
      // this.drawLine()
      this.drawTemperature()
      this.drawHumidity()
      this.drawSpeed()
      this.drawAir()
      this.drawRainfall()
      this.drawDirection()
    },

    drawTemperature() {
      let dom = document.getElementById('temperature')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart_temperature = this.$echarts.init(dom)

      var option = {
        animation: false,

        title: {
          text: '温度(℃)'
        },

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}℃`
            }
            return relVal
          }
        },

        color: ['#FF0000', '#00BFFF', '#FF00FF'],

        legend: {
          data: this.datatype === 'Weather' ? ['温度'] : ['温度', '最大温度', '最小温度']
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
            min: -20,
            max: 50
          }
        ],

        series: [
          {
            name: '温度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['A-Temp']
            })
          },
          {
            name: '最大温度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['MaxAtemp']
            })
          },
          {
            name: '最小温度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['MinAtemp']
            })
          }
        ]
      }

      this.chart_temperature.clear()
      this.chart_temperature.setOption(option, true)
      this.chart_temperature.resize()
      this.chart_temperature.hideLoading()
    },

    drawHumidity() {
      let dom = document.getElementById('humidity')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart_humidity = this.$echarts.init(dom)

      var option = {
        animation: false,

        title: {
          text: '湿度(%)'
        },

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}%`
            }
            return relVal
          }
        },

        color: ['#1ce322', '#bf686d', '#EE7942'],

        legend: {
          data: this.datatype === 'Weather' ? ['湿度'] : ['湿度', '最大湿度', '最小湿度']
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
            max: 100
          }
        ],

        series: [
          {
            name: '湿度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['Humi-R']
            })
          },
          {
            name: '最大湿度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['MaxHumi']
            })
          },
          {
            name: '最小湿度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['MinHumi']
            })
          }
        ]
      }

      this.chart_humidity.clear()
      this.chart_humidity.setOption(option, true)
      this.chart_humidity.resize()
      this.chart_humidity.hideLoading()
    },

    drawSpeed() {
      let dom = document.getElementById('speed')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart_speed = this.$echarts.init(dom)

      var option = {
        animation: false,

        title: {
          text: '风速(m/s)'
        },

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}m/s`
            }
            return relVal
          }
        },

        color: ['#99FF00', '#4400FF', '#0856FF'],

        legend: {
          data: this.datatype === 'Weather' ? ['风速'] : ['风速', '最大风速', '最小风速']
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
            max: 10
          }
        ],

        series: [
          {
            name: '风速',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['W-Speed']
            })
          },
          {
            name: '最大风速',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['MaxSpeed']
            })
          },
          {
            name: '最小风速',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['MinSpeed']
            })
          }
        ]
      }

      this.chart_speed.clear()
      this.chart_speed.setOption(option, true)
      this.chart_speed.resize()
      this.chart_speed.hideLoading()
    },

    drawRainfall() {
      let dom = document.getElementById('rainfall')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart_rainfall = this.$echarts.init(dom)

      var option = {
        animation: false,

        title: {
          text: '雨量(mm)'
        },

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}mm`
            }
            return relVal
          }
        },

        color: ['#2ae0c8'],

        legend: {
          data: ['雨量']
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
            max: 10
          }
        ],

        series: [
          {
            name: '雨量',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['PRF']
            })
          }
        ]
      }

      this.chart_rainfall.clear()
      this.chart_rainfall.setOption(option, true)
      this.chart_rainfall.resize()
      this.chart_rainfall.hideLoading()
    },

    drawDirection() {
      let dom = document.getElementById('direction')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart_direction = this.$echarts.init(dom)

      var option = {
        animation: false,

        title: {
          text: '风向(°)'
        },

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}°`
            }
            return relVal
          }
        },

        color: ['#800080'],

        legend: {
          data: ['风向']
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
            max: 360
          }
        ],

        series: [
          {
            name: '风向',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item => {
              return item['W-Direction']
            })
          }
        ]
      }

      this.chart_direction.clear()
      this.chart_direction.setOption(option, true)
      this.chart_direction.resize()
      this.chart_direction.hideLoading()
    },

    drawAir() {
      let dom = document.getElementById('air')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart_air = this.$echarts.init(dom)

      var option = {
        animation: false,

        title: {
          text: '大气压(hPa)'
        },

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}hPa`
            }
            return relVal
          }
        },

        color: ['#4a819c'],

        legend: {
          data: ['大气压']
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
            min: 1000,
            max: 1050
          }
        ],

        series: {
          name: '大气压',
          type: 'line',
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          data: this.dataSource_line.map(item => {
            return item['Ari-P']
          })
        }
      }

      this.chart_air.clear()
      this.chart_air.setOption(option, true)
      this.chart_air.resize()
      this.chart_air.hideLoading()
    },

    // disabledDate(date) {
    //   if (start) {
    //     return date.diff(start, 'days') < -2 || date.diff(start, 'days') > 2 || date > moment().endOf('day') // 限定日期3天之内
    //   }
    //   return date > moment().endOf('day')
    // },

    // onCalendarChange(dates) {
    //   if (dates.length === 1) {
    //     start = dates[0]
    //   } else {
    //     start = null
    //   }
    // },

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
        case 'HourWeather':
          this.columns = columns_hour_day
          this.page.pagesize = 100000000
          this.page.pageSizeOptions = ['100000000']
          break
        case 'DateWeather':
          this.columns = columns_hour_day
          this.page.pagesize = 100000000
          this.page.pageSizeOptions = ['100000000']
          break
        case 'Weather':
          this.columns = columns_sec
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
