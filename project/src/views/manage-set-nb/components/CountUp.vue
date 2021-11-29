<template>
  <div class="CountUp">
    <a-statistic title="测量时长" :value="diffValue">
      <template #formatter="{ value }">{{ value }}</template>
    </a-statistic>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'CountUp',

  props: {
    value: {
      type: Number,
      default: function () {
        return moment().valueOf()
      },
    },
  },

  data() {
    return {
      diffValue: undefined,
      interval: null,
    }
  },

  mounted() {
    let now = moment()
    let diff = now.diff(this.value)
    this.diffValue = moment(diff).utc(0).format('HH:mm:ss')
    this.interval = setInterval(() => {
      let now = moment()
      let diff = now.diff(this.value)
      this.diffValue = moment(diff).utc(0).format('HH:mm:ss')
    }, 1000)
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },
}
</script>

