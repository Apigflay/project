<template>
  <div class="FunCodeSelect">
    <a-select
      :disabled="operate === '修改'"
      :value="value"
      :options="options"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
      style="width:100%"
    ></a-select>
  </div>
</template>

<script>
export default {
  name: 'FunCodeSelect',

  props: ['value', 'operate'],

  data() {
    return {
      options: [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4a' },
        { value: 5, label: '4b' }
      ]
    }
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change')
    }
  }
}
</script>


