<template>
  <div class="YearSelect">
    <a-select
      :value="value"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
      style="width:100%"
      @change="handleChange"
    >
      <a-select-option
        v-for="i in new Date().getFullYear()-2015"
        :key="i"
        :value="new Date().getFullYear()-i + 1"
      >{{new Date().getFullYear()-i + 1}}年</a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  name: 'YearSelect',

  props: ['value'],

  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change')
    }
  }
}
</script>


