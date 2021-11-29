<template>
  <div class="area-display">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据分析</a-breadcrumb-item>
        <a-breadcrumb-item>区域显示</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">区域显示</div>
    </div>
    <div class="page-common-content">
      <AMapDisplay type="区域" />
    </div>
  </div>
</template>

<script>
import AMapDisplay from './AMapDisplay'
export default {
  name: 'area-display',

  components: {
    AMapDisplay
  },

  data() {
    return {}
  }
}
</script>

<style scoped lang="less">
</style>
