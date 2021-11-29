<template>
  <a-config-provider :autoInsertSpaceInButton="true" :locale="locale">
    <div id="app" v-cloak>
      <router-view v-if="isRouterAlive" />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],

  provide() {
    return {
      reload: this.reload
    }
  },

  data() {
    return {
      locale: zhCN,
      isRouterAlive: true
    }
  },

  computed: {
    realPointListNotNull() {
      return this.realPointList().length > 0 ? true : false
    }
  },

  watch: {
    realPointListNotNull(curVal) {
      if (curVal === true) {
        this.SetCurrentPointCode(this.realPointList()[0].MeasureCode)
      }
    }
  },

  created() {
    //监听页面关闭事件，关闭socket
    let _this = this
    window.addEventListener('beforeunload', function() {
      _this.socket().close()
      _this.realEventSocket().close()
    })
  },

  methods: {
    ...mapGetters(['socket', 'realEventSocket', 'realPointList']),
    ...mapActions(['SetCurrentPointCode']),

    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style>
#app {
  height: 100%;
}
[v-cloak] {
  display: none !important;
}
</style>
