<template>
  <div class="DepartmentTreeSelect">
    <a-tree-select
      :value="value"
      :tree-data="treeData"
      :allowClear="allowClear"
      :placeholder="placeholder"
      :replaceFields="replaceFields"
      tree-default-expand-all
      :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
      @change="handleChange"
    ></a-tree-select>
  </div>
</template>

<script>
import { getDepartmentTree } from '@/api/api'

export default {
  name: 'DepartmentTreeSelect',

  props: {
    value: [String, Number],
    allowClear: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },

  data() {
    return {
      replaceFields: { children: 'children', title: 'departmentName', key: 'id', value: 'id' },
      treeData: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
    },

    fetchData() {
      getDepartmentTree().then(({ error, response }) => {
        if (error.code === 0) {
          // 如果是最顶级
          if (!response.id) {
            this.treeData = response.children
          } else {
            this.treeData = [response]
          }
        }
      })
    }
  }
}
</script>


