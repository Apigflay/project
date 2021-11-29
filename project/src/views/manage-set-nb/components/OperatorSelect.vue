<template>
  <div class="OperatorSelect">
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
import { getOperatorList } from '@/api/api'
export default {
  name: 'OperatorSelect',

  props: ['value','id'],

  data() {
    return {
      options: [],
    }
  },

  mounted() {
    getOperatorList(this.id).then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.dataList.map((item) => {
          return {
            value: item.id,
            label: `${item.username}(${item.nickname} )`,
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


