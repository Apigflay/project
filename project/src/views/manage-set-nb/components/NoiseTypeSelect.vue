<template>
  <div class="NoiseTypeSelect">
    <a-select
      :disabled="operate === '修改'"
      :value="value"
      :options="options"
      @change="handleChange"
      placeholder="请选择"
      :defaultActiveFirstOption="false"
    ></a-select>
  </div>
</template>

<script>
export default {
  name: 'NoiseTypeSelect',

  props: ['value', 'operate'],

  data() {
    return {
      options: [
        { value: 0, label: '功能区噪声' },
        { value: 1, label: '区域噪声' },
        { value: 2, label: '交通噪声' },
        { value: 3, label: '非常规噪声' },
      ]
    }
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>


