<template>
  <div class="PointSelect">
    <a-select :value="value" :options="options" @change="handleChange" placeholder="请选择" mode="multiple"></a-select>
  </div>
</template>

<script>
import { getMeasureList } from '@/api/api'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PointSelect',

  props: ['value'],

  data() {
    return {
      options: [],
    }
  },

  computed: {
    ...mapGetters(['userinfo']),
  },

  mounted() {
    getMeasureList({
      page: {
        size: 1000000,
        current: 1,
      },
      keys: {},
    }).then(({ error, response }) => {
      if (error.code === 0) {
        this.options = response.records
          // .filter((item) => item.departmentId == this.userinfo.department.id)
          .map((item) => {
            return {
              value: item.id,
              label: item.measureName,
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
