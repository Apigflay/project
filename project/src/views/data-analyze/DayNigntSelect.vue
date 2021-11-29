<template>
  <div class="DayNigntSelect">
    <a-select
      :value="value"
      :options="options"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
      style="width:100%"
    ></a-select>
  </div>
</template>

<script>
export default {
  name: 'DayNigntSelect',

  props: ['value'],

  data() {
    return {
      options: [
        { value: 1, label: '白天' },
        { value: 2, label: '夜晚' }
      ]
    }
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change')
    }
  }
}
</script>


