<template>
  <div class="RangePicker">
    <a-range-picker
      :value="valueMonent"
      style="width: 100%;"
      :ranges="{
        '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')], 
        '今天': [moment().startOf('day'), moment().endOf('day')], 
        '本周': [moment().startOf('week'), moment().endOf('week')], 
        '本月': [moment().startOf('month'), moment().endOf('month')],
        '本年': [moment().startOf('year'), moment().endOf('year')],
      }"
      :allowClear="allowClear"
      format="YYYY-MM-DD HH:mm:ss"
      :showTime="{
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
      }"
      @change="dateChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'RangePicker',

  props: {
    value: Array,
    allowClear: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      valueMonent: [moment(this.value[0], 'YYYY-MM-DD HH:mm:ss'), moment(this.value[1], 'YYYY-MM-DD HH:mm:ss')]
    }
  },

  methods: {
    moment,

    dateChange(date) {
      this.valueMonent = date
      this.$emit('input', [date[0].format('YYYY-MM-DD HH:mm:ss'), date[1].format('YYYY-MM-DD HH:mm:ss')])
      this.$emit('change')
    }
  }
}
</script>

