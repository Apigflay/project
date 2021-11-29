<template>
  <div class="operation-interface">
    <div style="margin-top:-8vh">
      <OperationInerface2001 :power="power" :showCount="true" :mid="$route.params.mid"></OperationInerface2001>
    </div>
  </div>
</template>

<script>
import OperationInerface2001 from '@/components/OperationInerface2001'

export default {
  name: 'operation-interface',

  components: {
    OperationInerface2001
  },

  data() {
    return {
      power: false
    }
  },

  mounted() {
    this.power = true
  }
}
</script>


<style lang="less" scoped>
.operation-interface {
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>