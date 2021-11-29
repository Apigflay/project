<template>
  <div class="traffic-display">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据分析</a-breadcrumb-item>
        <a-breadcrumb-item>交通显示</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">交通显示</div>
    </div>
    <div class="page-common-content">
      <AMapDisplay type="交通" />
    </div>
  </div>
</template>

<script>
import AMapDisplay from './AMapDisplay'
import { trafficAnalyseMap } from '@/api/api'
export default {
  name: 'traffic-display',

  components: {
    AMapDisplay
  },

  data() {
    return {}
  }
}
</script>


