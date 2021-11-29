<template>
  <a-layout class="point-data" v-if="realPointListNotNull">
    <a-layout-sider class="point-data-sider">
      <div class="point-data-sider-header">
        <span class="title">测点列表</span>
        <span class="more" @click="$router.push({name:'point-list'})">更多</span>
      </div>
      <a-menu
        theme="light"
        mode="inline"
        :selectedKeys="[currentPointCodeMeasureCode()]"
        @click="clickMenuItem"
      >
        <a-menu-item
          v-for="(point) in realPointList()"
          :key="`${point.MeasureCode}-${point.MeasureId}`"
        >
          <span
            class="dot"
            :class="{'success-dot':point.linkState === '2', 'warning-dot':point.linkState === '1', 'disabled-dot':point.linkState === '0'}"
          ></span>
          <span>{{ point.MeasureName }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout class="point-data-content">
      <div class="real-data">
        <div class="real-data-header" @click="showOrHideRealData">
          <span class="title">实时数据</span>
          <a-icon class="icon" id="icon-down" type="down" />
        </div>
        <div class="real-data-content" id="real-data-content">
          <a-row class="row" type="flex" justify="space-between">
            <a-col class="item" :span="5">
              <div class="key">测量时间</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template slot="title">{{currentPoint.DateTime | timeFormat}}</template>
                  {{currentPoint.DateTime | timeFormat}}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="3">
              <div class="key">Lp</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template slot="title">{{currentPoint.Lp}}</template>
                  {{currentPoint.Lp}}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="3">
              <a-dropdown class="key" placement="bottomLeft">
                <span style="cursor: pointer;">
                  <span class="leq" style="margin-right:8px;">{{leqType}}</span>
                  <a-icon type="down" />
                </span>
                <a-menu slot="overlay" @click="handleDropDownChange">
                  <a-menu-item>
                    <span>Leq，T</span>
                  </a-menu-item>
                  <a-menu-item>
                    <span>Leq(小时)</span>
                  </a-menu-item>
                  <a-menu-item>
                    <span>Leq(天)</span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <div class="value" style="margin-top:5px">
                <a-tooltip
                  placement="bottom"
                  arrowPointAtCenter
                  v-if="leqType === 'Leq，T'"
                >
                  <template slot="title">{{currentPoint.LeqT }}</template>
                  {{currentPoint.LeqT }}
                </a-tooltip>
                <a-tooltip
                  placement="bottom"
                  arrowPointAtCenter
                  v-else-if="leqType === 'Leq(小时)'"
                >
                  <template slot="title">{{currentPoint.LeqTH }}</template>
                  {{currentPoint.LeqTH }}
                </a-tooltip>
                <a-tooltip
                  placement="bottom"
                  arrowPointAtCenter
                  v-else-if="leqType === 'Leq(天)'"
                >
                  <template slot="title">{{currentPoint.LeqTD }}</template>
                  {{currentPoint.LeqTD }}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="3">
              <div class="key">Lmax</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template slot="title">{{currentPoint.Lmax }}</template>
                  {{currentPoint.Lmax }}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="4">
              <div class="key">仪器编号</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template slot="title">{{currentPoint.MeasureId}}</template>
                  {{currentPoint.MeasureId}}
                </a-tooltip>
              </div>
            </a-col>
          </a-row>
          <a-row
            class="row"
            type="flex"
            justify="space-between"
            style="padding-top:0"
          >
            <a-col class="item" :span="5">
              <div class="key">测点编号</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template slot="title">{{currentPoint.MeasureCode}}</template>
                  {{currentPoint.MeasureCode}}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="3">
              <div class="key">连接类型</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template
                    slot="title"
                  >{{currentPoint.LinkMode === '0' ? '网口' : '串口'}}</template>
                  {{currentPoint.LinkMode === '0' ? '网口' : '串口'}}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="3">
              <div class="key">功能区</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template
                    slot="title"
                  >{{currentPoint.Funcode | funcodeFormat}}</template>
                  {{currentPoint.Funcode | funcodeFormat}}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="3">
              <div class="key">通讯端口</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template slot="title">{{currentPoint.Port}}</template>
                  {{currentPoint.Port}}
                </a-tooltip>
              </div>
            </a-col>
            <a-col class="item" :span="4">
              <div class="key">测点地址</div>
              <div class="value">
                <a-tooltip placement="bottom" arrowPointAtCenter>
                  <template slot="title">{{currentPoint.MeasureAddress}}</template>
                  {{currentPoint.MeasureAddress}}
                </a-tooltip>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-row class="gantt-and-rate" :gutter="24">
        <a-col
          class="chart"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="18"
          :xxl="18"
        >
          <div class="chart-header">
            <span class="title">数据甘特图</span>
            <div class="chart-header-right">
              <a-range-picker
                v-model="dateRange"
                @change="getGanttData"
                :ranges="{
                  '今天': [moment().startOf('day'), moment().endOf('day')], 
                  '本周': [moment().startOf('week'), moment().endOf('week')], 
                  '本月': [moment().startOf('month'), moment().endOf('month')],
                }"
                :allowClear="false"
                format="YYYY-MM-DD HH:mm:ss"
                :showTime="{
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
                }"
                :disabledDate="disabledDate"
                @calendarChange="onCalendarChange"
              />
            </div>
          </div>
          <div class="chart-content">
            <div id="gantt" style="width: 100%;height:400px;"></div>
          </div>
        </a-col>
        <a-col
          class="rate"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="6"
          :xxl="6"
        >
          <div class="rate-header">
            <span class="title">设备采集率</span>
          </div>
          <div class="rate-content">
            <div class="item">
              <div class="name">设备运转率(上月)</div>
              <div class="percent">{{currentPoint.HardRate+'%'}}</div>
              <mini-progress
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="currentPoint.HardRate"
                height="8px"
              />
            </div>
            <div class="item">
              <div class="name">数据传输率(上月)</div>
              <div class="percent">{{currentPoint.UpRate+'%'}}</div>
              <mini-progress
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="currentPoint.UpRate"
                height="8px"
              />
            </div>
            <div class="item">
              <div class="name">月采集率</div>
              <div class="percent">{{currentPoint.DevCapRate+'%'}}</div>
              <mini-progress
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="currentPoint.DevCapRate"
                height="8px"
              />
            </div>
          </div>
        </a-col>
      </a-row>

      <a-row class="weather-and-state-and-car" :gutter="24">
        <a-col
          class="weather"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="12"
          :xxl="12"
        >
          <div class="weather-header">
            <span class="title">{{ haveWeatherModule ? '气象数据' : '气象数据（无气象模块）'}}</span>
          </div>
          <div class="weather-content" v-if="haveWeatherModule">
            <!-- <canvas id="CLEAR_DAY" height="73" width="73"></canvas> -->
            <span class="number">{{currentPoint['A-Temp']}}</span>
            <span class="text">℃</span>
            <a-row class="row">
              <a-col :span="8" class="item">
                <div class="top">湿度(%)</div>
                <div class="bottom">
                  <img
                    src="../../assets/temperature.png"
                    style="margin-left: 2px;"
                  />
                  <span>{{currentPoint['Humi-R']}}</span>
                </div>
              </a-col>
              <a-col :span="8" class="item">
                <div class="top">风向(度)</div>
                <div class="bottom">
                  <img src="../../assets/wind-direction.png" />
                  <span>{{currentPoint['Humi-R']}}</span>
                </div>
              </a-col>
            </a-row>
            <a-row class="row">
              <a-col :span="8" class="item">
                <div class="top">气压(hpa)</div>
                <div class="bottom">
                  <img src="../../assets/air-pressure.png" style="width: 18px;" />
                  <span>{{currentPoint['Ari-P']}}</span>
                </div>
              </a-col>
              <a-col :span="8" class="item">
                <div class="top">雨量(mm)</div>
                <div class="bottom">
                  <img src="../../assets/rainfall.png" />
                  <span>{{currentPoint['PRF']}}</span>
                </div>
              </a-col>
              <a-col :span="8" class="item">
                <div class="top">风速(m/s)</div>
                <div class="bottom">
                  <img src="../../assets/wind-speed.png" />
                  <span>{{currentPoint['W-Speed']}}</span>
                </div>
              </a-col>
            </a-row>
          </div>
          <div class="weather-content" v-else></div>
        </a-col>
        <a-col
          class="state"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="6"
          :xxl="6"
        >
          <div class="state-header">
            <span class="title">仪器状态</span>
          </div>
          <div class="state-content">
            <div class="item">
              <div class="name">工作电压(v)</div>
              <div class="percent">
                <span>{{currentPoint['W-Vol']}}</span>
              </div>
            </div>
            <div class="item">
              <div class="name">电池电压(v)</div>
              <div class="percent">
                <span>{{currentPoint['S-Vol']}}</span>
              </div>
            </div>
            <div class="item">
              <div class="name">剩余容量(KB)</div>
              <div class="percent">
                <span>{{currentPoint['Free-M']}}</span>
              </div>

              <mini-progress
                v-if="currentPoint['Free-M']==0&&currentPoint['Used-M']==0"
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="0"
                height="8px"
              />
              <mini-progress
                v-else
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="freeKBpercent"
                height="8px"
              />
            </div>
          </div>
        </a-col>
        <a-col
          class="traffic"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="6"
          :xxl="6"
        >
          <div class="traffic-header">
            <span class="title">{{haveCarModule ? '车流数据' : '车流数据（无交通模块）'}}</span>
          </div>

          <div class="traffic-content" v-if="haveCarModule">
            <div id="pie" style="height: 240px;padding-top:10px"></div>
            <div
              class="average-speed"
            >平均车速：{{currentPoint.AvgCarSpeed?currentPoint.AvgCarSpeed:0 +'km/h'}}</div>
          </div>
          <div class="traffic-content" v-else></div>
        </a-col>
      </a-row>
    </a-layout>
    <!-- <point-data-info-modal :visible.sync="modalVisible"></point-data-info-modal> -->
  </a-layout>
  <a-empty v-else style="margin-top:30vh">
    <span slot="description">暂无实时数据</span>
  </a-empty>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'
import { MiniProgress } from '@/components'
import PointDataInfoModal from './point-data-info-modal'
import { getGanttData } from '@/api/api'
import moment from 'moment'

let echarts = require('echarts')
let start

export default {
  components: {
    MiniProgress,
    PointDataInfoModal
  },

  data() {
    return {
      flag: 1, //实时数据展开 flag
      modalVisible: false, //point data info modal
      leqType: 'Leq，T',
      dateRange: [moment().startOf('day'), moment().endOf('day')], //默认日期范围
      ganttData: [],
      ganttChart: null,
      pieChart: null,
      interval: null
    }
  },

  computed: {
    realPointListNotNull() {
      return this.realPointList().length > 0 ? true : false
    },

    currentPoint() {
      if (this.realPointListNotNull) {
        if (this.currentPointCodeMeasureCode() === '') {
          this.$store.commit(
            'SET_CURRENTPOINTCODEMEASURECODE',
            this.realPointList()[0].MeasureCode + '-' + this.realPointList()[0].MeasureId
          )
          return this.realPointList()[0]
        } else {
          let point = this.realPointList().find(
            item => item.MeasureCode + '-' + item.MeasureId === this.currentPointCodeMeasureCode()
          )
          if (point) {
            return point
          } else {
            this.$store.commit(
              'SET_CURRENTPOINTCODEMEASURECODE',
              this.realPointList()[0].MeasureCode + '-' + this.realPointList()[0].MeasureId
            )
            return this.realPointList()[0]
          }
        }
      } else {
        return {}
      }
    },

    haveWeatherModule() {
      return this.currentPoint.isReadWeather
    },

    haveCarModule() {
      return this.currentPoint.isReadCarflow
    },

    freeKBpercent() {
      return (
        (parseInt(this.currentPoint['Free-M']) /
          (parseInt(this.currentPoint['Free-M']) + parseInt(this.currentPoint['Used-M']))) *
        100
      )
    },

    ganttInterval() {
      let stime = this.dateRange[0]
      let etime = this.dateRange[1]
      let result = etime.diff(stime, 'day')
      if (result <= 0) {
        return 1000 * 3600 * 2
      } else if (result <= 6) {
        return 1000 * 3600 * 24 * 1
      } else if (result <= 30) {
        return 1000 * 3600 * 24 * 7
      } else {
        return 1000 * 3600 * 24 * 365
      }
    }
  },

  created() {
    this.$store.getters.socket.close()
    this.$store.dispatch('GetRealPointList')
  },

  mounted() {
    this.showModal()
    this.drawCharts()

    let that = this
    window.onresize = () => {
      that.ganttChart.resize()
      that.pieChart.resize()
    }
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  watch: {
    realPointListNotNull(curVal) {
      if (curVal === true) {
        this.drawCharts()
      }
    }
  },

  methods: {
    moment,

    ...mapActions(['SetPointDataInfoModalShowed', 'SetCurrentPointIndex', 'SetSocketMessage', 'SetRealPointList']),

    ...mapGetters(['pointDataInfoModalShowed', 'role', 'realPointList', 'currentPointCodeMeasureCode']),

    showModal() {
      //用户角色为操作员才显示确认测点信息
      if (this.role() === 'user') {
        //如果测点信息modal没有展示过，则展示，并且下次进入页面就不展示了
        if (this.pointDataInfoModalShowed() === false) {
          this.modalVisible = true
          this.SetPointDataInfoModalShowed(true) //设置vuex  测点信息modal已经展示过了
        }
      }
    },

    drawCharts() {
      if (this.realPointListNotNull) {
        this.$nextTick().then(() => {
          this.getGanttData()
          if (this.haveCarModule) {
            setTimeout(() => {
              this.drawPie()
            }, 500)
          }
        })
      }
    },

    drawGantt() {
      this.ganttChart = echarts.init(document.getElementById('gantt'))

      // let colors = ['#1BD39B']
      let colors = ['rgb(19, 194, 194)']

      let option = {
        animation: false,

        color: colors,

        tooltip: {
          formatter: function(params) {
            if (params.data.error) {
              return `${params.name}：${params.value[1]} ~ ${params.value[2]}<br />
                    采集率：${params.data.itemStyle.opacity * 100}%<br />
                    ${params.data.error == 1 ? '仪器没数据' : '服务器未读'}`
            } else {
              return `${params.name}：${params.value[1]} ~ ${params.value[2]}<br />
                    采集率：${params.data.itemStyle.opacity * 100}%`
            }
          }
        },

        grid: {
          left: '24px',
          right: '72px',
          top: '24px',
          bottom: '24px',
          containLabel: true
        },

        xAxis: {
          show: true,
          type: 'time',
          // interval: this.ganttInterval,
          min: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
          max: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            padding: [10, 0, 0, 0],
            formatter: function(value, index) {
              function getzf(num) {
                if (parseInt(num) < 10) {
                  num = '0' + num
                }
                return num
              }
              var date = new Date(value)
              return (
                getzf(date.getFullYear()) +
                '-' +
                getzf(date.getMonth() + 1) +
                '-' +
                getzf(date.getDate()) +
                ' ' +
                getzf(date.getHours()) +
                ':' +
                getzf(date.getMinutes()) +
                ':' +
                getzf(date.getSeconds())
              )
            },
            showMaxLabel: true,
            showMinLabel: true,
            rotate: '0'
          }
        },

        yAxis: {
          data: ['1s等效', '气象', '天统计', '小时统计', '分钟统计', '瞬时值', 'oct', '1/3oct', '车流量']
        },

        // dataZoom: [
        //   {
        //     type: 'slider',
        //     filterMode: 'weakFilter',
        //     showDataShadow: false,
        //     bottom: 24,
        //     height: 16,
        //     borderColor: 'transparent',
        //     backgroundColor: '#e2e2e2',
        //     handleIcon:
        //       'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        //     handleSize: 20,
        //     handleStyle: {
        //       shadowBlur: 6,
        //       shadowOffsetX: 1,
        //       shadowOffsetY: 2,
        //       shadowColor: '#aaa'
        //     },
        //     labelFormatter: ''
        //   },
        //   {
        //     type: 'inside',
        //     filterMode: 'weakFilter'
        //   }
        // ],

        series: [
          {
            type: 'custom',
            renderItem: function(params, api) {
              //开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0) //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
              var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
              var end = api.coord([api.value(2), categoryIndex])
              var height = 20 //柱体宽度

              return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect(
                  {
                    // 矩形的位置和大小。
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                  },
                  {
                    // 当前坐标系的包围盒。
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                  }
                ),
                style: api.style()
              }
            },
            encode: {
              x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
              y: 0 // data 中『维度0』对应到 Y 轴
            },
            // 维度0 维度1 维度2
            // 0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
            data: this.ganttData
          }
        ]
      }
      this.ganttChart.clear()
      this.ganttChart.setOption(option, true)
      this.ganttChart.hideLoading()
    },

    drawPie() {
      this.pieChart = echarts.init(document.getElementById('pie'))
      var colorList = ['#0a4291', '#0a57b6', '#1373db', '#2295ff', '#48adff']
      // var colorList = ['rgb(28, 212, 157)', 'rgba(28, 212, 157, 0.7)', 'rgba(28, 212, 157, 0.4)']

      var total = {
        value: this.currentPoint.TotalCarFlux ? this.currentPoint.TotalCarFlux : 0,
        name: '总车流量'
      }

      var originalData = [
        {
          value: this.currentPoint.BigCarNums ? this.currentPoint.BigCarNums : 0,
          name: '大车流量'
        },
        {
          value: this.currentPoint.MidCarNums ? this.currentPoint.MidCarNums : 0,
          name: '中车流量'
        },
        {
          value: this.currentPoint.ShortCarNums ? this.currentPoint.ShortCarNums : 0,
          name: '小车流量'
        }
      ]

      echarts.util.each(originalData, function(item, index) {
        item.itemStyle = {
          normal: {
            color: colorList[index]
          }
        }
      })

      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 12
          }
        },

        backgroundColor: '#ffffff',

        title: [
          {
            text: total.name,
            left: '49%',
            top: '43%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
              color: '#999',
              fontWeight: 'normal',
              fontSize: 14
            }
          },
          {
            text: total.value,
            left: '49%',
            top: '54%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
              color: '#666',
              fontWeight: 'normal',
              fontSize: 20
            }
          }
        ],

        series: [
          {
            hoverAnimation: false, //设置饼图默认的展开样式
            radius: [60, 100],
            name: 'pie',
            type: 'pie',
            selectedMode: 'single',
            selectedOffset: 16, //选中是扇区偏移量
            clockwise: true,
            startAngle: 90,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 3,
                borderColor: '#ffffff'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
              }
            },
            data: originalData
          }
        ]
      }
      this.pieChart.clear()
      this.pieChart.setOption(option, true)
    },

    //点击实时数据小箭头触发
    showOrHideRealData() {
      if (this.flag === 1) {
        document.querySelector('#icon-down').style.transform = 'rotateX(180deg)'
        document.querySelector('#real-data-content').style.height = '188px'
        this.flag = 2
      } else if (this.flag === 2) {
        document.querySelector('#icon-down').style.transform = 'rotateX(0deg)'
        document.querySelector('#real-data-content').style.height = '102px'
        this.flag = 1
      }
    },

    handleDropDownChange({ item }) {
      this.leqType = item.$el.innerText
    },

    clickMenuItem({ key }) {
      this.$store.commit('SET_CURRENTPOINTCODEMEASURECODE', key) //key is 测点编号
      this.getGanttData()
      setTimeout(() => {
        this.drawPie()
      }, 500)
    },

    getGanttData() {
      let _this = this
      _this.ganttChart &&
        _this.ganttChart.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

      let params = {
        measureid: _this.currentPoint.MeasureId,
        stime: _this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: _this.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
      }

      getGanttData(params).then(res => {
        let response = JSON.parse(res.d)
        if (response.Error) {
          _this.ganttData = []
        } else {
          _this.ganttData = response.data
        }
        _this.drawGantt()
      })
    },

    disabledDate(date) {
      if (start) {
        return date.diff(start, 'days') < -30 || date.diff(start, 'days') > 30 || date > moment().endOf('day') // 限定日期31天之内
      }
      return date > moment().endOf('day')
    },

    onCalendarChange(dates) {
      if (dates.length === 1) {
        start = dates[0]
      } else {
        start = null
      }
    }
  }
}
</script>

<style lang="less">
.point-data {
  height: calc(100vh - 64px);
  overflow: hidden;
  .point-data-sider {
    height: calc(100vh - 64px);
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    margin-left: 1px;
    box-shadow: 2px 0 4px 0 rgba(33, 49, 64, 0.08);
    .point-data-sider-header {
      height: 52px;
      line-height: 54px;
      padding-left: 24px;
      padding-right: 24px;
      background: #fff;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
      }
      .more {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #1bd39b;
        cursor: pointer;
        position: absolute;
        left: 150px;
        color: #1bd39b;
      }
    }
    .ant-layout-sider-trigger {
      background: #fff;
      color: #002140;
    }
    .ant-menu-inline {
      border-right: 0;
    }
  }

  .point-data-content {
    width: 100%;
    margin-left: 2px;
    padding: 24px;
    padding-bottom: 0;
    overflow: auto;

    .real-data {
      margin-bottom: 24px;
      .real-data-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #e9e9e9;
        padding: 0px 24px;
        height: 56px;
        cursor: pointer;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
        }
        .icon {
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
        }
      }
      .real-data-content {
        height: 102px;
        overflow: hidden;
        transition: all 0.3s;
        background: #fff;
        .row {
          background: #fff;
          padding: 24px 60px;
          .item {
            .key {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.45);
              line-height: 22px;
              margin-bottom: 5px;
            }
            .value {
              font-family: PingFangSC-Regular;
              font-size: 24px;
              color: rgba(0, 0, 0, 0.85);
              line-height: 32px;
              min-height: 32px;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
          }
        }
      }
    }

    .gantt-and-rate {
      .chart {
        margin-bottom: 24px;
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #e9e9e9;
          padding: 0px 24px;
          height: 56px;

          .title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
          }
          .chart-header-right {
            display: flex;
            .radio {
              display: flex;
              margin-right: 20px;
              .item {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0px 10px;
                cursor: pointer;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
                &:hover {
                  color: #1bd39b;
                }
              }
            }
          }

          .ant-radio-group {
            margin-right: 24px;
            transform: translateY(-1px);
          }
        }
        .chart-content {
          background: #fff;
          overflow: hidden;
        }
      }
      .rate {
        margin-bottom: 24px;
        .rate-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #e9e9e9;
          padding: 0px 24px;
          height: 56px;
          .title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
          }
        }
        .rate-content {
          background: #fff;
          height: 400px;
          padding: 24px;
          .item {
            margin-bottom: 41px;

            .name {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.45);
              line-height: 22px;
            }
            .percent {
              font-family: PingFangSC-Regular;
              font-size: 24px;
              color: rgba(0, 0, 0, 0.85);
              line-height: 32px;
              min-height: 32px;
              margin-bottom: 10px;
              margin-top: 5px;
            }
          }
        }
      }
    }

    .weather-and-state-and-car {
      .weather {
        margin-bottom: 24px;
        .weather-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #e9e9e9;
          padding: 0px 24px;
          height: 56px;
          .title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
          }
        }
        .weather-content {
          background: #fff;
          height: 289px;
          padding: 24px;
          padding-left: 36px;
          padding-right: 10px;
          .number {
            font-family: PingFangSC-Regular;
            font-size: 46px;
            color: rgba(0, 0, 0, 0.85);
            margin-right: 5px;
          }
          .text {
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 38px;
          }
          .row {
            margin-top: 20px;
            .item {
              .top {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.45);
                line-height: 22px;
                // padding-left: 25px;
              }
              .bottom {
                font-family: PingFangSC-Regular;
                font-size: 24px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 32px;
                img {
                  transform: translateY(-3px);
                  margin-right: 8px;
                }
              }
            }
          }
        }
      }

      .state {
        margin-bottom: 24px;
        .state-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #e9e9e9;
          padding: 0px 24px;
          height: 56px;
          .title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
          }
        }
        .state-content {
          background: #fff;
          height: 289px;
          padding: 24px;
          .item {
            margin-bottom: 21px;
            .name {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.45);
              line-height: 22px;
            }
            .percent {
              font-family: PingFangSC-Regular;
              font-size: 24px;
              color: rgba(0, 0, 0, 0.85);
              line-height: 32px;
              min-height: 32px;
              margin-bottom: 10px;
              margin-top: 5px;
            }
          }
        }
      }

      .traffic {
        margin-bottom: 24px;
        .traffic-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #e9e9e9;
          padding: 0px 24px;
          height: 56px;
          .title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
          }
        }
        .traffic-content {
          background: #fff;
          height: 289px;
          position: relative;
          overflow: hidden;

          .g2-guide-html {
            width: 100px;
            height: 80px;
            vertical-align: middle;
            text-align: center;
            line-height: 0.4;
          }

          .g2-guide-html .title {
            font-size: 12px;
            color: #8c8c8c;
            font-weight: 300;
          }

          .g2-guide-html .value {
            font-size: 30px;
            color: #000;
            font-weight: bold;
          }
          .average-speed {
            position: absolute;
            bottom: 24px;
            width: 100%;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
  }
}
</style>

