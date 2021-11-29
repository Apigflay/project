<template>
  <div class="AnemographSelect">
    <a-select
      :value="value"
      :options="options"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
      style="width: 100%"
    >
      <a-select-option v-for="item in options" :key="item.value">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import { getAnemographList } from '@/api/api'
export default {
  name: 'AnemographSelect',

  props: ['value', 'id'],

  data() {
    return {
      options: [],
    }
  },

  mounted() {
    getAnemographList({
      page: {
        size: 10000,
        current: 1,
      },
    }).then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.records.map((item) => {
          return {
            value: item.id,
            label: `${item.windDeviceType}(${item.windDeviceNo})`,
          }
        })
      }
    })
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
  },
}
</script>


