<template>
  <div class="data-query">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据记录</a-breadcrumb-item>
        <a-breadcrumb-item>数据查询</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">数据查询</div>

      <div class="data-query-search-row">
        <span>测点名称：</span>
        <a-select
          v-model="measureOption"
          style="width: 350px;margin-right:16px;margin-bottom:16px;"
          placeholder="请选择"
          @change="getInstrumentList"
        >
          <a-select-option
            v-for="point in point_list"
            :value="`${point.measureCode}-${point.measureId}-${point.funCode}`"
            :key="point.measureCode"
          >{{`${point.measureName}(${point.measureCode})`}}</a-select-option>
        </a-select>

        <span>仪器编号：</span>
        <a-select
          v-model="instrumentCode"
          style="width: 350px;margin-right:16px;margin-bottom:16px;"
          placeholder="请选择"
          @change="setPointCode"
        >
          <a-select-option
            v-for="point in instrumentList"
            :value="point.noiseMeasureID"
            :key="point.noiseMeasureID"
          >{{point.noiseMeasureID}}</a-select-option>
        </a-select>

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
          :showTime="{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
          }"
          style="margin-right:16px;margin-bottom:16px;"
        />

        <a-button
          type="primary"
          style="margin-right:16px;"
          @click="clickQuery"
        >查询</a-button>

        <div v-if="$route.name==='statistics-data'" style="margin-top:16px;">
          <span>过滤：</span>
          <span>昼间LeqT（大于）</span>
          <a-input-number
            v-model="overForm.leqt_day"
            :precision="1"
            :min="0"
            style="width: 70px;"
          ></a-input-number>
          <span style="margin-left:8px;margin-right:16px;margin-bottom:16px;">dB</span>

          <span>夜间LeqT（大于）</span>
          <a-input-number
            v-model="overForm.leqt_night"
            :precision="1"
            :min="0"  
            style="width: 70px;"
          ></a-input-number>
          <span style="margin-left:8px;margin-right:16px;margin-bottom:16px;">dB</span>

          <span>风速（大于）</span>
          <a-input-number
            v-model="overForm.speed"
            :precision="1"
            :min="0"
            style="width: 70px;"
          ></a-input-number>
          <span style="margin-left:8px;margin-right:16px;margin-bottom:16px;">m/s</span>

          <span>雨量（大于）</span>
          <a-input-number
            v-model="overForm.rain"
            :precision="1"
            :min="0"
            style="width: 70px;"
          ></a-input-number>
          <span style="margin-left:8px;margin-right:16px;margin-bottom:16px;">mm/h</span>

          <span>总车流量（大于）</span>
          <a-input-number
            v-model="overForm.car"
            :min="0"
            style="width: 70px;"
          ></a-input-number>
          <span style="margin-left:8px;margin-right:16px;margin-bottom:16px;">辆</span>

          <span>有效采集率（小于）</span>
          <a-input-number
            v-model="overForm.rate"
            :precision="1"
            :min="0"
            style="width: 70px;"
          ></a-input-number>
          <span style="margin-left:8px;margin-right:16px;margin-bottom:16px;">%</span>

          <a-checkbox 
            v-model="overForm.burst" 
            style="margin-right:0px;margin-bottom:16px;">突发噪声</a-checkbox>
        </div>
      </div>

      <div class="tabs">
        <ul>
          <li @click="$router.push({name:'instant-data'})">
            <div :class="{active : $route.name === 'instant-data'}">噪声瞬时数据</div>
          </li>
          <li @click="$router.push({name:'statistics-data'})">
            <div :class="{active : $route.name === 'statistics-data'}">噪声统计数据</div>
          </li>
          <li @click="$router.push({name:'weather-data'})">
            <div :class="{active : $route.name === 'weather-data'}">气象数据</div>
          </li>
          <li @click="$router.push({name:'traffic-data'})">
            <div :class="{active : $route.name === 'traffic-data'}">交通数据</div>
          </li>
        </ul>
      </div>
    </div>

    <router-view
      ref="child"
      :pointCode="pointCode"
      :dateRange="dateRange"
      :overForm="overForm"
    ></router-view>
  </div>
</template>

<script>
import moment from 'moment'
import { getInstrumentListByPointId } from '@/api/api'
import { mapActions, mapGetters } from 'vuex'
let start

export default {
  data() {
    return {
      pointCode: undefined,
      measureOption: undefined,
      instrumentCode: undefined,
      dateRange: [moment().startOf('day'), moment().endOf('day')],

      overForm: {
        leqt_day: undefined,
        leqt_night: undefined,
        speed: 5,
        rain: 0,
        car: undefined,
        rate: 75,
        burst: false
      },

      point_list: [],
      instrumentList: []
    }
  },

  created() {
    this.$store.dispatch('GetUserinfo')
    var array = this.pointList();

    var obj = {};
    array.forEach(element => {
      if(!obj[element.measureCode]){
         this.point_list.push(element);
         obj[element.measureCode] = true;
      }
    });
  },

  methods: {
    moment,

    ...mapGetters(['pointList']),

    getInstrumentList() {
      let measureId = this.measureOption.split('-')[1];
      getInstrumentListByPointId(measureId).then(({ error, response }) => {
        if (error.code === 0) {
          this.instrumentList = response.dataList
        } else {
          this.$message.error(error.msg)
        }
      })
      this.instrumentCode = undefined;
      this.setOverLeqt();
    },

    setOverLeqt() {
      let funCode = this.measureOption.split('-')[2];
      if (funCode === undefined) {
        return;
      }
      if (funCode == 0) {
        this.overForm.leqt_day = 50
        this.overForm.leqt_night = 40
      } else if (funCode == 1) {
        this.overForm.leqt_day = 55
        this.overForm.leqt_night = 45
      } else if (funCode == 2) {
        this.overForm.leqt_day = 60
        this.overForm.leqt_night = 50
      } else if (funCode == 3) {
        this.overForm.leqt_day = 65
        this.overForm.leqt_night = 55
      } else if (funCode == 4) {
        this.overForm.leqt_day = 70
        this.overForm.leqt_night = 55
      } else if (funCode == 5) {
        this.overForm.leqt_day = 70
        this.overForm.leqt_night = 60
      }
    },

    setPointCode() {
      let measureCode = this.measureOption.split('-')[0];
      let measureId = this.measureOption.split('-')[1];
      this.noiseType = this.measureOption.split('-')[2];
      this.pointCode = measureCode + "-" + this.instrumentCode + "-" + measureId;
    },

    clickQuery() {
      if (!this.measureOption) {
        this.$message.warning('请选择测点')
        return
      }
      if (!this.instrumentCode) {
        this.$message.warning('请选择仪器')
        return
      }
      this.$refs.child.page.currentpage = 1
      this.$refs.child.fetchData()
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
