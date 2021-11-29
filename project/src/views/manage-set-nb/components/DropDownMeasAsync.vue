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
import { getAreaByToken } from '@/api/api'

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
    let { error, response } = await getAreaByToken(this.$store.getters['token'])
    if (error.code === 0) {
      function deleteObjKey(obj){
        if(obj.children.length==0){
          delete obj.children;
        }else{
          obj.children.forEach(function(item,index){
            if(item.children.length==0){
              delete item.children;
            }else{
              deleteObjKey(item)
            }
          })
        }
      }
      deleteObjKey(response)
      this.options.push(response)
    }
    this.loading = false;
  },

  methods: {
    onChange(value, selectedOptions) {
      this.$emit('input', value)
      this.$emit('update:adCode', selectedOptions[selectedOptions.length - 1].adCode)
    },
    async loadData(selectedOptions) {
    },
  },
}
</script>