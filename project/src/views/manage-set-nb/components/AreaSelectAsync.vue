<template>
  <a-cascader
    :disabled="operate === '修改'"
    :value="value"
    :options="options"
    :load-data="loadData"
    placeholder="请选择"
    change-on-select
    :fieldNames="fieldNames"
    style="width: 100%"
    @change="onChange"
    :allowClear="false"
    v-if="loading === false"
  />
</template>

<script>
import { getArea } from '@/api/api'

export default {
  props: ['value', 'adCode', 'operate'],

  data() {
    return {
      fieldNames: { label: 'areaName', value: 'areaName', children: 'children' },
      options: [],
      loading: false,
    }
  },

  async created() {
    this.loading = true
    let { error, response } = await getArea(100000)
    if (error.code === 0) {
      this.options = response.map((item) => {
        item.isLeaf = false
        item.level = '省'
        return item
      })
    }

    try {
      if (this.value.length > 0) {
        const targetIndex = this.options.findIndex((item) => item.areaName === this.value[0])
        let { error, response } = await getArea(this.options[targetIndex].adCode)
        if (error.code === 0) {
          this.options[targetIndex].children = response.map((item) => {
            item.isLeaf = false
            return item
          })
        }

        if (this.value.length > 1) {
          const targetIndex2 = this.options[targetIndex].children.findIndex((item) => item.areaName === this.value[1])
          let { error, response } = await getArea(this.options[targetIndex].children[targetIndex2].adCode)
          if (error.code === 0) {
            this.options[targetIndex].children[targetIndex2].children = response.map((item) => {
              item.isLeaf = true
              return item
            })
          }
        }
      }
    } catch {}

    this.loading = false
  },

  methods: {
    onChange(value, selectedOptions) {
      this.$emit('input', value)
      this.$emit('update:adCode', selectedOptions[selectedOptions.length - 1].adCode)
    },

    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      let { error, response } = await getArea(targetOption.adCode)
      if (error.code === 0) {
        targetOption.children = response.map((item) => {
          item.isLeaf = targetOption.level === '省' ? false : true
          return item
        })
        this.options = [...this.options]
      }
      targetOption.loading = false
    },
  },
}
</script>