<template>
  <div class="DeviceTypeSelect">
    <a-select
      :value="value"
      :options="options"
      @change="handleChange"
      :defaultActiveFirstOption="false"
      :allowClear="allowClear"
      :placeholder="placeholder"
      :disabled="disabled"
    ></a-select>
  </div>
</template>

<script>
import { getDeviceTypeList } from '@/api/api'
export default {
  name: 'DeviceTypeSelect',

  props: {
    value: Number,
    allowClear: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    deviceClassify: {
      type: Number,
      default: undefined,
    },
    firstFetchData: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      options: [],
    }
  },

  watch: {
    deviceClassify(value) {
      value && this.fetchData(value)
    },
  },

  mounted() {
    this.firstFetchData && this.fetchData(this.deviceClassify)
  },

  methods: {
    fetchData(value) {
      getDeviceTypeList({ deviceClassify: value }).then(({ error, response }) => {
        if (error.code === 0) {
          this.options = response.dataList.map((item) => {
            return {
              value: item.deviceType,
              label: item.deviceTypeName,
            }
          })
        }
      })
    },

    handleChange(value) {
      this.$emit('input', value)
    },
  },
}
</script>


