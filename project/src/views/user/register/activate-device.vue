<template>
  <div>
    <a-steps class="steps" :current="currentTab">
      <a-step title="填写设备信息" />
      <a-step title="验证手机号" />
      <a-step title="填写个人信息" />
      <a-step title="完成" />
    </a-steps>
    <div class="content">
      <step1 v-show="currentTab === 0" @nextStep="nextStep" @setForm="setForm" />
      <step2
        v-show="currentTab === 1"
        @nextStep="nextStep"
        @prevStep="prevStep"
        @setForm="setForm"
      />
      <step3
        v-show="currentTab === 2"
        @nextStep="nextStep"
        @prevStep="prevStep"
        @setForm="setForm"
        :otherForm="form"
      />
      <step4 v-show="currentTab === 3" :form="form" @finish="finish" />
    </div>
  </div>
</template>

<script>
import Step1 from './activate-device-step1'
import Step2 from './activate-device-step2'
import Step3 from './activate-device-step3'
import Step4 from './activate-device-step4'

export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step4
  },

  inject: ['reload'],

  data() {
    return {
      currentTab: 0,
      form: {}
    }
  },

  methods: {
    nextStep() {
      if (this.currentTab < 3) {
        this.currentTab += 1
      }
    },

    prevStep() {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },

    finish() {
      this.reload()
    },

    setForm(values) {
      Object.assign(this.form, values)
    }
  }
}
</script>

<style lang="less" scoped>
.steps {
  max-width: 1000px;
  padding-top: 150px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 0 auto;
}
</style>
