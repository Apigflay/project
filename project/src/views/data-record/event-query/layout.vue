<template>
  <div class="data-query">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据记录</a-breadcrumb-item>
        <a-breadcrumb-item>事件查询</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">事件查询</div>

      <div class="data-query-search-row">
        <span v-if="$route.name==='front-event'">测点名称：</span>

        <a-select
          v-if="$route.name==='front-event'"
          v-model="pointCode"
          style="width: 350px;margin-right:16px;margin-bottom:16px;"
          placeholder="请选择"
        >
          <a-select-option
            v-for="point in pointList()"
            :value="point.measureCode + '-' + point.noiseMeasureID"
            :key="point.measureCode + '-' + point.noiseMeasureID"
          >{{`${point.measureName}(${point.noiseMeasureID})`}}</a-select-option>
        </a-select>

        <span>时间范围：</span>
        <a-range-picker
          v-model="dateRange"
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
          :disabledDate="disabledDate"
          @calendarChange="onCalendarChange"
        />

        <a-button
          type="primary"
          style="margin-right:16px;"
          @click="clickQuery"
        >查询</a-button>
      </div>

      <div class="tabs">
        <ul>
          <li @click="$router.push({name:'system-event'})">
            <div :class="{active : $route.name === 'system-event'}">系统事件</div>
          </li>
          <li @click="$router.push({name:'front-event'})">
            <div :class="{active : $route.name === 'front-event'}">仪器事件</div>
          </li>
        </ul>
      </div>
    </div>

    <router-view ref="child" :pointCode="pointCode" :dateRange="dateRange"></router-view>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
let start

export default {
  data() {
    return {
      pointCode: undefined,
      dateRange: [moment().startOf('day'), moment().endOf('day')]
    }
  },

  created() {
    // if (this.$route.params.pointCode) {
    //   this.pointCode = this.$route.params.pointCode
    // } else {
    //   this.pointCode =
    //     this.pointList().length > 0
    //       ? this.pointList()[0].measureCode + '-' + this.pointList()[0].noiseMeasureID
    //       : undefined
    // }

    this.$store.dispatch('GetUserinfo')
  },

  methods: {
    moment,

    ...mapGetters(['pointList']),

    clickQuery() {
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
