<template>
  <div class="UserSelect">
    <a-select
      :value="value"
      :options="options"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
    ></a-select>
  </div>
</template>

<script>
import { getUsers } from '@/api/api'
export default {
  name: 'UserSelect',

  props: ['value'],

  data() {
    return {
      options: [],
    }
  },

  mounted() {
    getUsers().then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.dataList.map((item) => {
          return {
            value: item.id,
            label: `${item.username}(${item.nickname}) - ${item.departmentName}`,
          }
        })
      }
    })
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
    },
  },
}
</script>


