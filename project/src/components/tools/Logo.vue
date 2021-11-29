<template>
  <div class="logo">
    <router-link :to="{name:'real-data'}">
      <img class="logo-img" src="../../../public/logo.png" alt />
      <h1 v-if="showTitle" style="color:rgba(0,0,0,1);">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',

  props: {
    title: {
      type: String,
      default: '噪声监测平台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>

<style lang="less">
.logo-img {
  width: 50px !important;
  margin-top: 2px;
  margin-left: -11px;
}
</style>
