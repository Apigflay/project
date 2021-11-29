<template>
  <div class="InstrumentSelect">
    <a-select
      :value="value"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
      style="width: 100%"
    >
      <a-select-option v-for="item in options" :key="item.value">
        {{ item.label }}
        <a-tag :color="item.deviceUsage === 1 ? 'cyan' : 'green'"> {{ item.deviceUsage | deviceUsageFormat }}</a-tag>
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { getInstrumentList } from '@/api/api'
export default {
  name: 'InstrumentSelect',

  props: ['value', 'id'],

  data() {
    return {
      options: [],
    }
  },

  mounted() {
    getInstrumentList({
      page: {
        size: 10000,
        current: 1,
      },
    }).then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.records.map((item) => {
          return {
            value: item.id,
            label: `${this.formatDeviceType(item.deviceType)}(${item.noiseMeasureID})`,
            deviceUsage: item.deviceUsage,
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

    formatDeviceType(val) {
      if (val == 0) {
        return 'AWA6270'
      } else if (val == 1) {
        return 'AWA6291'
      } else if (val == 2) {
        return 'AWA5636'
      } else if (val == 3) {
        return 'AWA6228'
      } else if (val == 4) {
        return 'AWA6218J'
      } else if (val == 5) {
        return 'AWA6218S'
      } else if (val == 6) {
        return 'ASV111'
      } else if (val == 7) {
        return 'AWA6256B_T'
      } else if (val == 8) {
        return 'AWA6228+'
      } else if (val == 9) {
        return 'AWA5688'
      } else if (val == 11) {
        return 'ASV1102'
      } else if (val == 12) {
        return 'AWA8578G'
      } else if (val == 13) {
        return 'AHAI2001'
      } else if (val == 14) {
        return 'AHAI3001'
      } else {
        return ''
      }
    },
  },
}
</script>


