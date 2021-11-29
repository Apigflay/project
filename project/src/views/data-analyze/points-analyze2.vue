<template>
  <div class="points-analyze2">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据分析</a-breadcrumb-item>
        <a-breadcrumb-item>多测点数据分析</a-breadcrumb-item>
      </a-breadcrumb>

      <div class="title">多测点数据分析</div>
    </div>

    <div class="search-container">
      <div class="search-container-item">
        <span>时间范围：</span>

        <a-range-picker
          v-model="dateRange"
          :disabledDate="disabledDate"
          @calendarChange="onCalendarChange"
          :ranges="{
              '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')], 
              '今天': [moment().startOf('day'), moment().endOf('day')], 
            }"
          :allowClear="false"
          format="YYYY-MM-DD HH:mm:ss"
          :showTime="true"
        />
      </div>

      <div
        class="search-container-item"
        v-for="(item, index) in pointList_search"
        :key="item.key"
      >
        <span class="search-container-item-label">{{`测点${index + 1}：`}}</span>
        <a-input-group compact style="width:700px;">
          <a-select
            v-model="item.pcodeMidPname"
            style="width: 350px;"
            placeholder="请选择测点"
            :defaultActiveFirstOption="false"
          >
            <a-select-option
              v-for="point in pointList()"
              :value="`${point.measureCode}-${point.noiseMeasureID}-${point.measureName}`"
              :key="`${point.measureCode}-${point.noiseMeasureID}`"
              :disabled="pointList_search.some(item2=>item2.pcodeMidPname===`${point.measureCode}-${point.noiseMeasureID}-${point.measureName}`)"
            >{{`${point.measureName} (${point.noiseMeasureID})`}}</a-select-option>
          </a-select>

          <a-select
            v-model="item.marker"
            style="width: 350px;"
            placeholder="请选择指标"
            mode="multiple"
            :defaultActiveFirstOption="false"
          >
            <a-select-option value="LeqA">LeqA</a-select-option>
            <a-select-option value="LeqC">LeqC</a-select-option>
            <a-select-option value="LeqZ">LeqZ</a-select-option>
            <a-select-option value="Lasp">LASp</a-select-option>
            <a-select-option value="Lafp">LAFp</a-select-option>
            <a-select-option value="Laip">LAIp</a-select-option>
            <a-select-option value="Lcsp">LCSp</a-select-option>
            <a-select-option value="Lcfp">LCFp</a-select-option>
            <a-select-option value="Lcip">LCIp</a-select-option>
            <a-select-option value="Lzsp">LZSp</a-select-option>
            <a-select-option value="Lzfp">LZFp</a-select-option>
            <a-select-option value="Lzip">LZIp</a-select-option>
            <a-select-option value="风速">风速</a-select-option>
            <a-select-option value="雨量">雨量</a-select-option>
          </a-select>
        </a-input-group>
        <a-icon
          v-if="pointList_search.length > 1"
          type="close"
          @click="clickClose(item.key)"
          title="删除"
        />
      </div>

      <div class="btn-container">
        <a-button
          v-if="pointList_search.length < 10"
          type="dashed"
          @click="addPoint"
        >
          <a-icon type="plus" />添加测点
        </a-button>
        <a-divider></a-divider>
        <a-button type="primary" @click="searchAll" :loading="loading_btn">查询</a-button>
        <a-button @click="clickReset">重置</a-button>
      </div>
    </div>

    <a-card class="card-container" title="统计数据" :bordered="false">
      <a-select v-model="displayType" slot="extra">
        <a-select-option value="chart">图形显示</a-select-option>
        <a-select-option value="table">列表显示</a-select-option>
      </a-select>

      <a-table
        v-show="displayType==='table'"
        :dataSource="dataSource_all"
        :rowKey="(record, index) => index"
        :columns="columns_table_chart"
        :loading="loading_table"
        :scroll="{y:665}"
        :pagination="page"
      ></a-table>

      <div
        v-show="displayType==='chart'"
        id="chart"
        style="width:100%;height:665px;"
      ></div>

      <!-- 筛选统计数据 -->
      <div
        v-if="dataSource_all.length > 0 && displayType === 'chart' && loading_btn === false"
      >
        <!-- <div> -->
        <div class="small-title">筛选统计数据</div>
        <div class="search-container-item">
          <span class="search-container-item-label">阈值：</span>
          <a-input-group compact style="width:350px;margin-right:4px;">
            <a-select
              v-model="indicate"
              style="width: 100px;"
              :defaultActiveFirstOption="false"
            >
              <a-select-option value="LeqA">LeqA</a-select-option>
              <a-select-option value="LeqC">LeqC</a-select-option>
              <a-select-option value="LeqZ">LeqZ</a-select-option>
              <a-select-option value="Lasp">LASp</a-select-option>
              <a-select-option value="Lafp">LAFp</a-select-option>
              <a-select-option value="Laip">LAIp</a-select-option>
              <a-select-option value="Lcsp">LCSp</a-select-option>
              <a-select-option value="Lcfp">LCFp</a-select-option>
              <a-select-option value="Lcip">LCIp</a-select-option>
              <a-select-option value="Lzsp">LZSp</a-select-option>
              <a-select-option value="Lzfp">LZFp</a-select-option>
              <a-select-option value="Lzip">LZIp</a-select-option>
            </a-select>
            <a-select
              v-model="bdrange"
              style="width: 100px;"
              :defaultActiveFirstOption="false"
              @change="bdrangeChange"
            >
              <a-select-option :value="0">小于</a-select-option>
              <a-select-option :value="1">大于</a-select-option>
            </a-select>
            <a-input-number
              v-model="drange"
              style="width: 150px;"
              :min="0"
              :max="120"
              :precision="1"
              allowClear
              @change="drangeChange"
            />
          </a-input-group>
          <span>dB</span>
        </div>

        <div class="search-container-item">
          <span class="search-container-item-label">过滤：</span>
          <a-select
            v-model="filter"
            style="width: 350px;"
            mode="multiple"
            placeholder="请选择"
            allowClear
          >
            <a-select-option value="下雨">下雨</a-select-option>
            <a-select-option value="风速超标">风速超标</a-select-option>
          </a-select>
        </div>

        <div class="search-container-item">
          <span class="search-container-item-label">事件：</span>
          <a-input-group compact style="width:350px;margin-right:4px;">
            <a-select
              v-model="eventSwitch"
              style="width: 100px;"
              :defaultActiveFirstOption="false"
              @change="eventSwitchChange"
            >
              <a-select-option :value="0">关闭</a-select-option>
              <a-select-option :value="1">开启</a-select-option>
            </a-select>
            <a-input-number
              v-show="eventSwitch"
              v-model="eventValue"
              style="width: 250px;"
              :min="0"
              :max="1000"
              :precision="0"
              allowClear
            />
          </a-input-group>
          <span v-show="eventSwitch">持续时间(秒)</span>
        </div>

        <div class="search-container-item">
          <span class="search-container-item-label">噪声：</span>
          <a-input-group compact style="width:350px;margin-right:4px;">
            <a-select
              v-model="noiseSwitch"
              style="width: 100px;"
              :defaultActiveFirstOption="false"
              @change="noiseSwitchChange"
            >
              <a-select-option :value="0">关闭</a-select-option>
              <a-select-option :value="1">开启</a-select-option>
            </a-select>
            <a-input-number
              v-show="noiseSwitch"
              v-model="noiseValue"
              style="width: 250px;"
              :min="1"
              :max="60"
              :precision="0"
              allowClear
            />
          </a-input-group>
          <span v-show="noiseSwitch">积分时间(分钟)</span>
        </div>

        <div class="search-container-item" v-if="dateList_search.length>0">
          <span class="search-container-item-label">注意：</span>
          <span>添加时间范围必须在 ({{dateRange[0].format('YYYY-MM-DD HH:mm:ss') + ' ~ ' + dateRange[1].format('YYYY-MM-DD HH:mm:ss')}}) 之内</span>
        </div>

        <div
          class="search-container-item"
          v-for="(item, index) in dateList_search"
          :key="item.key"
        >
          <span class="search-container-item-label">{{`范围${index + 1}：`}}</span>
          <a-range-picker
            v-model="item.time"
            :allowClear="false"
            format="YYYY-MM-DD HH:mm:ss"
            :showTime="{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:30:00', 'HH:mm:ss')]
            }"
            @change="e=>dateChange(e,index)"
          />
          <a-icon
            type="close"
            @click="clickCloseDate(item.key, index)"
            title="删除"
          />
        </div>

        <div class="btn-container">
          <a-button
            v-if="dateList_search.length < 10"
            type="dashed"
            @click="addDate"
          >
            <a-icon type="plus" />添加时间范围
          </a-button>
          <a-divider></a-divider>
          <a-button
            type="primary"
            @click="searchFilter"
            :loading="loading_filter_btn"
          >查询</a-button>
          <a-button @click="clickResetDate">重置</a-button>
        </div>

        <a-card
          class="filter-card"
          title="筛选的统计结果"
          :bordered="true"
          style="margin:24px 0px;"
        >
          <div class="table-title">
            <span class="table-title-span">分钟</span>
            <download-excel
              :data="StaData"
              :fields="fields_StaData"
              :name="`分钟-筛选的统计结果`"
            >
              <a-button icon="download">导出</a-button>
            </download-excel>
          </div>

          <a-table
            :dataSource="StaData"
            :pagination="false"
            :rowKey="(record, index) => index"
            :columns="columns"
            :loading="loading_filter_statistics"
            :scroll="{x:2350,y:550}"
          ></a-table>

          <div class="table-title">
            <span class="table-title-span">小时</span>
            <download-excel
              :data="StaDataH"
              :fields="fields_StaData"
              :name="`小时-筛选的统计结果`"
            >
              <a-button icon="download">导出</a-button>
            </download-excel>
          </div>
          <a-table
            :dataSource="StaDataH"
            :pagination="false"
            :rowKey="(record, index) => index"
            :columns="columns"
            :loading="loading_filter_statistics"
            :scroll="{x:2350,y:550}"
          ></a-table>

          <div class="table-title">
            <span class="table-title-span">天</span>
            <download-excel
              :data="StaDataD"
              :fields="fields_StaDataD"
              :name="`天-筛选的统计结果`"
            >
              <a-button icon="download">导出</a-button>
            </download-excel>
          </div>
          <a-table
            :dataSource="StaDataD"
            :pagination="false"
            :rowKey="(record, index) => index"
            :columns="columns_day"
            :loading="loading_filter_statistics"
          ></a-table>

          <div class="table-title">
            <span class="table-title-span">总事件</span>
            <download-excel
              :data="EventInfo"
              :fields="fields_EventInfo"
              :name="`事件-筛选的统计结果`"
            >
              <a-button icon="download">导出</a-button>
            </download-excel>
          </div>
          <a-table
            :dataSource="EventInfo"
            :pagination="false"
            :rowKey="(record, index) => index"
            :columns="columns_event"
            :loading="loading_filter_statistics"
          ></a-table>

          <div class="table-title">
            <span class="table-title-span">事件</span>
            <download-excel
              :data="StaEvent"
              :fields="fields_StaEvent"
              :name="`总事件-筛选的统计结果`"
            >
              <a-button icon="download">导出</a-button>
            </download-excel>
          </div>
          <a-table
            :dataSource="StaEvent"
            :pagination="false"
            :rowKey="(record, index) => index"
            :columns="columns_event_all"
            :loading="loading_filter_statistics"
            :scroll="{y:550}"
          ></a-table>
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { GetMulMeasureData, GetMulMeasureDateForPic } from '@/api/api'
import debounce from 'lodash/debounce' // 防抖函数
import moment from 'moment'
let start

const columns = [
  {
    title: '测量时间',
    dataIndex: 'measuretime',
    width: 250
  },
  {
    title: '测点名称',
    dataIndex: 'MeasureName',
    width: 150
  },
  {
    title: '测点编号',
    dataIndex: 'measurecode',
    width: 150
  },
  {
    title: '仪器编号',
    dataIndex: 'measureid',
    width: 150
  },
  {
    title: '指标',
    dataIndex: 'marker',
    width: 150
  },
  {
    title: '数据有效率',
    dataIndex: 'Rate',
    width: 150
  },
  {
    title: 'LeqT',
    dataIndex: 'LeqT',
    width: 150
  },
  {
    title: 'Lmax',
    dataIndex: 'Lmax',
    width: 150
  },
  {
    title: 'Lmin',
    dataIndex: 'Lmin',
    width: 150
  },
  {
    title: 'L5',
    dataIndex: 'L5',
    width: 150
  },
  {
    title: 'L10',
    dataIndex: 'L10',
    width: 150
  },
  {
    title: 'L50',
    dataIndex: 'L50',
    width: 150
  },
  {
    title: 'L90',
    dataIndex: 'L90',
    width: 150
  },
  {
    title: 'L95',
    dataIndex: 'L95',
    width: 150
  },
  {
    title: 'SD',
    dataIndex: 'SD'
  }
]

const columns_day = [
  {
    title: '测量时间',
    dataIndex: 'measuretime'
  },
  {
    title: '测点名称',
    dataIndex: 'MeasureName'
  },
  {
    title: '测点编号',
    dataIndex: 'measurecode'
  },
  {
    title: '仪器编号',
    dataIndex: 'measureid'
  },
  {
    title: '指标',
    dataIndex: 'marker'
  },
  {
    title: '数据有效率',
    dataIndex: 'Rate'
  },
  {
    title: 'Ld',
    dataIndex: 'Ld'
  },
  {
    title: 'Ln',
    dataIndex: 'Ln'
  },
  {
    title: 'Ldn',
    dataIndex: 'Ldn'
  },
  {
    title: 'LeqT',
    dataIndex: 'LeqT'
  },
  {
    title: 'Lmax',
    dataIndex: 'Lmax'
  },
  {
    title: 'Lmin',
    dataIndex: 'Lmin'
  },
  {
    title: 'L5',
    dataIndex: 'L5'
  },
  {
    title: 'L10',
    dataIndex: 'L10'
  },
  {
    title: 'L50',
    dataIndex: 'L50'
  },
  {
    title: 'L90',
    dataIndex: 'L90'
  },
  {
    title: 'L95',
    dataIndex: 'L95'
  },
  {
    title: 'SD',
    dataIndex: 'SD'
  }
]

//总事件
const columns_event = [
  {
    title: '开始时间',
    dataIndex: 'stime'
  },
  {
    title: '结束时间',
    dataIndex: 'etime'
  },
  {
    title: '总次数',
    dataIndex: 'count'
  },
  {
    title: '白天次数',
    dataIndex: 'countDay'
  },
  {
    title: '傍晚次数',
    dataIndex: 'countEvening'
  },
  {
    title: '晚上次数',
    dataIndex: 'countNight'
  },

  {
    title: 'Lwecpn',
    dataIndex: 'Lwecpn'
  },
  {
    title: 'La-T(10)',
    dataIndex: 'La-T(10)'
  },
  {
    title: 'La-T(15)',
    dataIndex: 'La-T(15)'
  }
]

const columns_event_all = [
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: 200
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 200
  },
  {
    title: 'maxLA',
    dataIndex: 'maxLA',
    width: 150
  },
  {
    title: 'Lepn',
    dataIndex: 'Lepn',
    width: 150
  },
  {
    title: 'Td',
    dataIndex: 'Td',
    width: 150
  },
  {
    title: 'LAE(10)',
    dataIndex: 'LAE(10)',
    width: 150
  },
  {
    title: 'LAE(15)',
    dataIndex: 'LAE(15)'
  }
]

export default {
  name: 'points-analyze2',

  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      loading_statistics: false,
      loading_filter_statistics: false,

      loading_btn: false,
      loading_filter_btn: false,

      loading_table: false,

      dateRange: [moment().startOf('day'), moment().endOf('day')],
      // dateRange: [moment().startOf('day'), moment()],
      pointList_search: [{ key: 1, pcodeMidPname: undefined, marker: undefined }],
      dateList_search: [],
      // dateList_search: [{ key: 1, time: [] }],

      columns,
      columns_day,
      columns_event_all,
      columns_event,
      columns_table_chart: [],

      dataSource_all: [],
      dataSource_all_statistics: [],
      dataSource_filter_statistics: [],

      StaData: [],
      StaDataH: [],
      StaDataD: [],
      EventInfo: [],
      StaEvent: [],

      displayType: 'chart',

      page: {
        currentpage: 1,
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '1000']
      },

      indicate: 'LeqA', //指标
      bdrange: 0, //小于大于
      drange: '', //阈值
      btime: 0, //时间正选
      filter: [], //过滤
      eventSwitch: 0,
      eventValue: undefined,
      noiseSwitch: 0,
      noiseValue: undefined,

      areas: [], //框选集合

      markLine: {},

      colors: [
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
      visualMap: []
    }
  },

  computed: {
    fields() {
      let obj = {}
      this.columns.forEach(item => {
        obj[`${item.title}`] = {
          field: item.dataIndex,
          callback: value => {
            return `"${value}"`
          }
        }
      })
      return obj
    },

    fields_StaData() {
      let obj = {}
      this.columns.forEach(item => {
        obj[`${item.title}`] = {
          field: item.dataIndex,
          callback: value => {
            return `"${value}"`
          }
        }
      })
      return obj
    },

    fields_StaDataD() {
      let obj = {}
      this.columns_day.forEach(item => {
        obj[`${item.title}`] = {
          field: item.dataIndex,
          callback: value => {
            return `"${value}"`
          }
        }
      })
      return obj
    },

    fields_StaEvent() {
      let obj = {}
      this.columns_event_all.forEach(item => {
        obj[`${item.title}`] = {
          field: item.dataIndex,
          callback: value => {
            return `"${value}"`
          }
        }
      })
      return obj
    },

    fields_EventInfo() {
      let obj = {}
      this.columns_event.forEach(item => {
        obj[`${item.title}`] = {
          field: item.dataIndex,
          callback: value => {
            return `"${value}"`
          }
        }
      })
      return obj
    }
  },

  created() {
    this.$store.dispatch('GetUserinfo')
    this.drangeChange = debounce(this.drangeChange, 500)
  },

  mounted() {
    setTimeout(() => {
      this.drawChart()
    }, 500)

    window.onresize = () => {
      this.chart.resize()
    }
  },

  methods: {
    moment,
    ...mapGetters(['pointList']),

    searchAll() {
      //如果没有选择测点
      if (this.pointList_search.some(item => item.pcodeMidPname === undefined)) {
        this.$message.warning('请选择测点')
        return
      }
      //如果没有选择指标
      if (this.pointList_search.some(item => item.marker === undefined)) {
        this.$message.warning('请选择指标')
        return
      }

      //设置colums
      this.initColumnsTableChart()

      let param = {}
      param.stime = this.dateRange[0].format('YYYY-MM-DD HH:mm:ss')
      param.etime = this.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
      param.total = 1000000

      let arr = []
      this.pointList_search.forEach((item, index) => {
        arr = arr.concat(
          item.marker.map(element => {
            return {
              measureid: item.pcodeMidPname.split('-')[1],
              measurecode: item.pcodeMidPname.split('-')[0],
              markers: element
            }
          })
        )
      })

      param.measureinfo = arr

      this.loading_btn = true
      this.loading_statistics = true

      if (this.displayType === 'table') {
        this.loading_table = true
      }
      if (this.displayType === 'chart') {
        this.chart.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })
      }

      GetMulMeasureDateForPic(param).then(res => {
        let result = JSON.parse(res.d)
        if (result.Error) {
          this.$message.error('系统错误')
        } else {
          this.dataSource_all_statistics = result.StaData
          this.dataSource_all = Object.freeze(result.DataInfo)

          if (this.displayType === 'table') {
            this.loading_table = false
          }

          if (this.displayType === 'chart') {
            this.drawChart()
          }
        }
        this.loading_statistics = false
        this.loading_btn = false
        this.clickResetDate()
      })
    },

    searchFilter() {
      let param = {}
      param.measurecodes = this.pointList_search.map(item => item.pcodeMidPname.split('-')[0]).join()
      param.measureids = this.pointList_search.map(item => item.pcodeMidPname.split('-')[1]).join()
      // param.markers = this.pointList_search.map(item => item.marker).join()
      param.markers = this.indicate
      param.stime = this.dateRange[0].format('YYYY-MM-DD HH:mm:ss')
      param.etime = this.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
      param.total = 1
      param.stimerange = this.dateList_search.map(item => item.time[0].format('YYYY-MM-DD HH:mm:ss')).join()
      param.etimerange = this.dateList_search.map(item => item.time[1].format('YYYY-MM-DD HH:mm:ss')).join()
      param.btime = 0 //是否反选
      param.drange = this.drange //阈值
      param.bdrange = this.bdrange //大于小于
      param.continuedtime = this.eventValue //事件持续时间
      param.integtime = this.noiseValue //噪声积分时间

      param.wind = this.filter.includes('风速超标') ? 1 : 0
      param.rain = this.filter.includes('下雨') ? 1 : 0

      this.loading_filter_btn = true
      this.loading_filter_statistics = true

      GetMulMeasureData(param).then(res => {
        let result = JSON.parse(res.d)
        if (result.Error) {
          this.$message.error('系统错误')
        } else {
          this.StaData = result.StaData
          this.StaDataD = result.StaDataD
          this.StaDataH = result.StaDataH
          if (result.EventInfo.length > 0) {
            result.EventInfo[0].count = result.EventInfo[0].count.split('.')[0]
            result.EventInfo[0].countDay = result.EventInfo[0].countDay.split('.')[0]
            result.EventInfo[0].countEvening = result.EventInfo[0].countEvening.split('.')[0]
            result.EventInfo[0].countNight = result.EventInfo[0].countNight.split('.')[0]
          }
          this.EventInfo = result.EventInfo //总事件
          this.StaEvent = result.StaEvent
        }
        this.loading_filter_btn = false
        this.loading_filter_statistics = false
      })
    },

    drawChart() {
      this.chart = this.$echarts.init(document.getElementById('chart'))

      let legendData = this.columns_table_chart.map((item, index) => {
        if (index > 0) {
          return item.title
        }
      })
      legendData = legendData.slice(1) //去掉第一个item因为是undefined，引入echarts-gl会报错

      let series = this.columns_table_chart.map((item, index) => {
        if (index > 0) {
          let yAxisIndex = 0
          if (item.title.includes('风速')) {
            yAxisIndex = 1
          } else if (item.title.includes('雨量')) {
            yAxisIndex = 2
          } else {
            yAxisIndex = 0
          }
          return {
            name: item.title,
            showSymbol: false,
            sampling: 'max', //折线图在数据量远大于像素点时候的降采样策略，开启后可以有效的优化图表的绘制效率，默认关闭，也就是全部绘制不过滤数据点。
            connectNulls: false,
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            markLine: this.markLine,
            data: this.dataSource_all.map(item2 => {
              return item2[item.dataIndex]
            }),
            yAxisIndex
          }
        }
      })
      series = series.slice(1)
      let that = this

      let options = {
        animation: false,

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              let unit = ''
              if (params[i].seriesName.includes('风速')) {
                unit = 'm/s'
              } else if (params[i].seriesName.includes('雨量')) {
                unit = 'mm'
              } else {
                unit = 'dB'
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}${unit}`
            }
            return relVal
          }
        },

        color: this.colors,

        legend: {
          top: '44px',
          data: legendData
        },

        visualMap: this.visualMap,

        grid: {
          left: '50px',
          right: '80px',
          bottom: '44px',
          top: '110px',
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
          data: this.dataSource_all.map(item => {
            return item.MeasureTime
          })
        },

        yAxis: [
          {
            type: 'value',
            name: '噪声(dB)',
            min: 0,
            max: 120
          },
          {
            type: 'value',
            name: '风速(m/s)',
            min: 0,
            max: 12,
            position: 'right'
          },
          {
            type: 'value',
            name: '雨量(mm)',
            min: 0,
            max: 1.2,
            offset: 80, // 偏移
            position: 'right'
          }
        ],

        brush: {
          xAxisIndex: 0,
          throttleType: 'debounce',
          throttleDelay: 500,
          outOfBrush: {
            colorAlpha: 0.1
          }
        },

        toolbox: {
          right: '32px',
          itemGap: 16,
          itemSize: 20,
          feature: {
            brush: {
              type: ['lineX', 'keep']
            },

            myTool1: {
              show: true,
              title: '反选',
              icon: `path://M0.979,0.764H6.14v5.161H0.979V0.764z M4.42,12.806h1.72v-0.43H4.42V12.806z M0.979,8.075h1.72v-0.43h-1.72
		V8.075z M8.29,5.925H7.86v1.72h0.43V5.925z M0.979,12.806h1.72v-0.43h-1.72V12.806z M8.29,2.484H7.86v1.72h0.43V2.484z
		 M1.409,9.365h-0.43v1.72h0.43V9.365z M4.42,8.075h1.72v-0.43H4.42V8.075z M12.591,4.205h0.43v-1.72h-0.43V4.205z M12.591,7.645
		h0.43v-1.72h-0.43V7.645z M11.301,0.764v0.43h1.72v-0.43H11.301z M7.86,1.194h1.72v-0.43H7.86V1.194z M12.591,11.085h0.43v-1.72
		h-0.43V11.085z M7.86,12.806h1.72v-0.43H7.86V12.806z M11.301,12.806h1.72v-0.43h-1.72V12.806z`,
              onclick: () => {
                /**
                 * 区间列表的交集(不包括端点)
                 * @param A 区间列表A,格式:[[xxx,xxx],[xxx,xxx]]
                 * @param B 区间列表B,格式:[[xxx,xxx],[xxx,xxx]]
                 * @return
                 */
                function intervalIntersection(A, B) {
                  let ans = []
                  let i = 0
                  let j = 0
                  while (i < A.length && j < B.length) {
                    let lo = Math.max(A[i][0], B[j][0])
                    let hi = Math.min(A[i][1], B[j][1])
                    if (lo <= hi) {
                      ans.push([lo, hi])
                    }
                    if (A[i][1] < B[j][1]) {
                      i += 1
                    } else {
                      j += 1
                    }
                  }
                  //去端点
                  let res = []
                  ans.forEach(function(e) {
                    if (e[0] !== e[1]) {
                      //非端点
                      res.push([e[0], e[1]])
                    }
                  })
                  return res
                }

                if (that.areas.length === 1) {
                  let arr = [...that.areas]

                  if (arr[0].coordRange[0] === 0) {
                    that.areas[0] = {
                      xAxisIndex: 0,
                      brushType: 'lineX',
                      coordRange: [arr[0].coordRange[1] + 1, that.dataSource_all.length - 1]
                    }
                  } else if (arr[0].coordRange[1] === that.dataSource_all.length - 1) {
                    that.areas[0] = {
                      xAxisIndex: 0,
                      brushType: 'lineX',
                      coordRange: [0, arr[0].coordRange[0] - 1]
                    }
                  } else {
                    that.areas[0] = {
                      xAxisIndex: 0,
                      brushType: 'lineX',
                      coordRange: [0, arr[0].coordRange[0] - 1]
                    }

                    that.areas[1] = {
                      xAxisIndex: 0,
                      brushType: 'lineX',
                      coordRange: [arr[0].coordRange[1] + 1, that.dataSource_all.length - 1]
                    }
                  }
                } else if (that.areas.length > 1) {
                  let sectionArr = []
                  that.areas.forEach(area => {
                    if (area.coordRange[0] === 0) {
                      sectionArr.push([[area.coordRange[1] + 1, that.dataSource_all.length - 1]])
                    } else if (area.coordRange[1] === that.dataSource_all.length - 1) {
                      sectionArr.push([[0, area.coordRange[0] - 1]])
                    } else {
                      sectionArr.push([
                        [0, area.coordRange[0] - 1],
                        [area.coordRange[1] + 1, that.dataSource_all.length - 1]
                      ])
                    }
                  })

                  let arrs = [[0, that.dataSource_all.length - 1]]
                  sectionArr.forEach(section => {
                    arrs = intervalIntersection(section, arrs)
                  })

                  // that.areas = arrs
                  that.areas = []
                  arrs.forEach((item, index) => {
                    that.areas[index] = {
                      xAxisIndex: 0,
                      brushType: 'lineX',
                      coordRange: item
                    }
                  })
                }

                that.chart.dispatchAction({
                  type: 'brush',
                  areas: that.areas
                })
              }
            },

            myTool2: {
              show: true,
              title: '清除选择',
              icon: `path://M261.333333 949.333333V757.333333h32v192h202.666667V693.333333h32v256h202.666667V757.333333h32v192H928V576H96v373.333333h165.333333zM928 544V370.282667a10.666667 10.666667 0 0 0-10.666667-10.666667H640a32 32 0 0 1-32-32V74.666667H416v252.949333a32 32 0 0 1-32 32H106.666667a10.666667 10.666667 0 0 0-10.666667 10.666667V544h832zM384 64a21.333333 21.333333 0 0 1 21.333333-21.333333h213.333334a21.333333 21.333333 0 0 1 21.333333 21.333333v263.616h277.333333a42.666667 42.666667 0 0 1 42.666667 42.666667V960a21.333333 21.333333 0 0 1-21.333333 21.333333H85.333333a21.333333 21.333333 0 0 1-21.333333-21.333333V370.282667a42.666667 42.666667 0 0 1 42.666667-42.666667h277.333333V64z`,
              onclick: () => {
                that.clickResetDate()
              }
            }
          },
          emphasis: {
            iconStyle: {
              borderColor: '#1BD39B'
            }
          }
        },

        dataZoom: [
          // {
          //   type: 'inside',
          //   start: 0,
          //   end: 100
          // },
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            start: 0,
            end: 100,
            left: '0%',
            handleIcon:
              'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%'
          },
          {
            type: 'slider',
            start: 0,
            end: 100,
            bottom: '0px',
            handleIcon:
              'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%'
          }
        ],

        series: series
      }

      this.chart.clear()
      this.chart.setOption(options, true)
      this.chart.resize()
      this.chart.hideLoading()

      //初始化brush，默认为多选
      this.chart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'brush',
        brushOption: {
          brushType: 'lineX',
          brushMode: 'multiple'
        }
      })

      this.chart.on('brushSelected', function(params) {
        that.areas = params.batch[0].areas
        if (that.areas.length === 0) {
          that.dateList_search = []
        }

        if (that.areas.length > 0 && params.batch[0].selected.length > 0) {
          that.dateList_search = []
          that.areas.forEach((item, index) => {
            if (item.coordRange[0] < 0) {
              item.coordRange[0] = 0
            }
            if (item.coordRange[0] > that.dataSource_all.length - 1) {
              item.coordRange[0] = that.dataSource_all.length - 1
            }

            if (item.coordRange[1] < 0) {
              item.coordRange[1] = 0
            }
            if (item.coordRange[1] > that.dataSource_all.length - 1) {
              item.coordRange[1] = that.dataSource_all.length - 1
            }
            that.dateList_search.push({
              key: that.dateList_search.length > 0 ? that.dateList_search[that.dateList_search.length - 1].key + 1 : 1,
              time: [
                moment(that.dataSource_all[item.coordRange[0]].MeasureTime), //左右拉选框会溢出数组长度范围
                moment(that.dataSource_all[item.coordRange[1]].MeasureTime)
              ]
            })
          })
        }
      })
    },

    disabledDate(date) {
      if (start) {
        return date.diff(start, 'days') < -1 || date.diff(start, 'days') > 1 || date > moment().endOf('day') // 限定日期2天之内
      }
      return date > moment().endOf('day')
    },

    onCalendarChange(dates) {
      if (dates.length === 1) {
        start = dates[0]
      } else {
        start = null
      }
    },

    addPoint() {
      this.pointList_search.push({
        key: this.pointList_search[this.pointList_search.length - 1].key + 1,
        pcodeMidPname: undefined,
        marker: undefined
      })
    },

    addDate() {
      this.dateList_search.push({
        key: this.dateList_search.length > 0 ? this.dateList_search[this.dateList_search.length - 1].key + 1 : 1,
        time: []
      })
    },

    clickClose(key) {
      this.pointList_search = this.pointList_search.filter(item => item.key !== key)
    },

    clickCloseDate(key, index) {
      this.dateList_search = this.dateList_search.filter(item => item.key !== key)

      if (this.areas.length > 0) {
        this.areas.splice(index, 1)
        this.chart.dispatchAction({
          type: 'brush',
          areas: this.areas
        })
      }
    },

    clickReset() {
      this.pointList_search = [{ key: 1, pcodeMidPname: undefined, marker: undefined }]
      this.dateRange = [moment().startOf('day'), moment().endOf('day')]
    },

    clickResetDate() {
      this.dateList_search = []
      this.areas = []
      this.chart.dispatchAction({
        type: 'brush',
        areas: this.areas
      })
      this.bdrange = 0
      this.drange = ''
      // this.btime = 0
      this.eventSwitch = 0
      this.eventValue = undefined
      this.noiseSwitch = 0
      this.noiseValue = undefined
      this.indicate = 'LeqA'
      this.filter = []

      this.dataSource_filter_statistics = []
      this.markLine = {}
      this.visualMap = []
      this.drawChart()
    },

    initColumnsTableChart() {
      let arr = [
        {
          title: '测量时间',
          dataIndex: 'MeasureTime'
        }
      ]

      this.pointList_search.forEach((item, index) => {
        let aaa = item.marker.map(element => {
          let temp = element
          if (
            element !== 'LeqA' &&
            element !== 'LeqC' &&
            element !== 'LeqZ' &&
            element !== '风速' &&
            element !== '雨量'
          ) {
            element =
              element[0].toUpperCase() + element[1].toUpperCase() + element[2].toUpperCase() + element[3].toLowerCase()
          }
          return {
            title: `测点${index + 1}(${element})`,
            width: 200,
            dataIndex: item.pcodeMidPname.split('-')[0] + '_' + item.pcodeMidPname.split('-')[1] + '_' + temp
          }
        })
        arr = arr.concat(aaa)
      })
      this.columns_table_chart = arr
    },

    dateChange(e, index) {
      let sindex = this.dataSource_all.findIndex(
        item => item.MeasureTime === e[0].format('YYYY-MM-DD HH:mm:ss') + '.000'
      )

      if (sindex === -1) {
        this.$message.error('开始时间不在总时间范围之内')
        this.dateList_search[index].time = []
        return
      }

      let eindex = this.dataSource_all.findIndex(
        item => item.MeasureTime === e[1].format('YYYY-MM-DD HH:mm:ss') + '.000'
      )

      if (eindex === -1) {
        this.$message.error('结束时间不在总时间范围之内')
        this.dateList_search[index].time = []
        return
      }

      this.areas[index] = {
        xAxisIndex: 0,
        brushType: 'lineX',
        coordRange: [sindex, eindex]
      }

      this.chart.dispatchAction({
        type: 'brush',
        areas: this.areas
      })
    },

    bdrangeChange(value) {
      if (this.drange === '' || this.drange === null || this.drange === undefined) {
        this.markLine = {}
        this.visualMap = []
      } else {
        this.visualMap = this.columns_table_chart.map((item, index) => {
          if (index > 0) {
            if (value == 0) {
              //小于
              return {
                show: false,
                pieces: [
                  {
                    lt: this.drange,
                    gte: 0,
                    color: this.colors[index - 1]
                  }
                ],
                outOfRange: {
                  color: '#F5F5F5'
                },
                seriesIndex: index - 1
              }
            } else {
              //大于
              return {
                show: false,
                pieces: [
                  {
                    lt: 200,
                    gt: this.drange,
                    color: this.colors[index - 1]
                  }
                ],
                outOfRange: {
                  color: '#F5F5F5'
                },
                seriesIndex: index - 1
              }
            }
          }
        })
        this.visualMap = this.visualMap.slice(1)
      }
      this.drawChart()
      this.chart.dispatchAction({
        type: 'brush',
        areas: this.areas
      })
    },

    noiseSwitchChange(value) {
      if (value === 0) {
        this.noiseValue = undefined
      }
    },

    eventSwitchChange(value) {
      if (value === 0) {
        this.eventValue = undefined
      }
    },

    //标线
    drangeChange(value) {
      if (value === '' || value === null || value === undefined) {
        this.markLine = {}
        this.visualMap = []
      } else {
        this.markLine = {
          lineStyle: {
            // color: '#F6BD16',
            color: '#969EAE',
            type: 'solid'
          },
          data: [
            {
              name: '阈值',
              yAxis: value
            }
          ]
        }

        this.visualMap = this.columns_table_chart.map((item, index) => {
          if (index > 0) {
            if (this.bdrange == 0) {
              //小于
              return {
                show: false,
                pieces: [
                  {
                    lt: value,
                    gte: 0,
                    color: this.colors[index - 1]
                  }
                ],
                outOfRange: {
                  color: '#F5F5F5'
                },
                seriesIndex: index - 1
              }
            } else {
              //大于
              return {
                show: false,
                pieces: [
                  {
                    lt: 200,
                    gt: value,
                    color: this.colors[index - 1]
                  }
                ],
                outOfRange: {
                  color: '#F5F5F5'
                },
                seriesIndex: index - 1
              }
            }
          }
        })
        this.visualMap = this.visualMap.slice(1)
      }

      this.drawChart()
      this.chart.dispatchAction({
        type: 'brush',
        areas: this.areas
      })
    }
  }
}
</script>

<style lang="less" scoped>
.points-analyze2 {
  .search-container {
    margin: 24px;
    padding: 32px;
    background: white;
  }
  .search-container-item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    .search-container-item-label {
      display: inline-block;
      min-width: 70px;
      text-align: right;
      user-select: none;
    }
    i {
      font-size: 16px;
      margin-left: 16px;
      cursor: pointer;
      color: red;
    }
  }

  .btn-container {
    padding-left: 70px;
    button {
      margin-right: 16px;
    }
  }

  .small-title {
    font-size: 16px;
    display: block;
    margin: 24px 0px;
    margin-top: 32px;
    color: rgba(0, 0, 0, 0.85);
  }

  .card-container {
    margin: 24px;
  }

  .table-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 48px 0px 16px;
    font-weight: bold;

    &:first-child {
      margin-top: 8px;
    }
  }
  .filter-card {
    /deep/ .ant-card-head {
      background: #fafafa;
    }
  }
}
</style>