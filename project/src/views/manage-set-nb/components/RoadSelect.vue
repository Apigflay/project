<template>
  <div class="RoadSelect">
    <a-select
      :disabled="operate === '修改'"
      :value="value"
      :options="options"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
    ></a-select>
  </div>
</template>

<script>
import { getRoadList } from '@/api/api'
export default {
  name: 'RoadSelect',

  props: ['value', 'operate'],

  data() {
    return {
      options: []
    }
  },

  mounted() {
    getRoadList().then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.dataList.map(item => {
          return {
            value: item.id,
            label: item.roadName
          }
        })
      }
    })
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>


