a<template>
  <div class="RoleSelect">
    <a-select
      mode="multiple"
      :value="value"
      :options="options"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
    ></a-select>
  </div>
</template>

<script>
import { getRoleList } from '@/api/api'
export default {
  name: 'RoleSelect',

  props: ['value'],

  data() {
    return {
      options: []
    }
  },

  mounted() {
    getRoleList().then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.dataList.map(item => {
          return {
            value: item.id,
            label: item.roleName
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


