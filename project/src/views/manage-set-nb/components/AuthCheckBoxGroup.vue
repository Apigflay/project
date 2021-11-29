<template>
  <div class="AuthCheckBoxGroup">
    <a-checkbox-group :value="value" :options="options" @change="handleChange" placeholder="请选择" />
  </div>
</template>

<script>
import { getAuthList } from '@/api/api'
export default {
  name: 'AuthCheckBoxGroup',

  props: ['value', 'operate'],

  data() {
    return {
      options: []
    }
  },

  mounted() {
    getAuthList().then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.dataList.map(item => {
          return {
            value: item.id,
            label: item.authorName
          }
        })

        if (this.operate === '创建') {
          this.$emit(
            'input',
            this.options.map(item => item.value)
          )
        }
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


