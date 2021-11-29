<template>
  <a-popover
    v-model="visible"
    trigger="hover"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '380px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-list>
          <span v-for="(realEvent, index) in realEventList()" :key="realEvent.EventTime">
            <a-list-item v-if="index <= 2">
              <a-list-item-meta :title="realEvent.MeasureName" :description="timeFormat(realEvent.EventTime)"></a-list-item-meta>
              <span class="event-text">{{realEvent.EventName}}</span>
            </a-list-item>
          </span>
          <div slot="footer" @click="goToRealEvent" v-if="realEventList().length > 0">查看更多事件</div>
        </a-list>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge :count="length">
        <a-icon style="font-size: 16px;padding: 4px;transform: translateY(3px)" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderNotice',

  data() {
    return {
      loading: false,
      visible: false
    }
  },

  computed: {
    length() {
      return this.realEventList().length
    }
  },

  methods: {
    ...mapGetters(['realEventList']),

    fetchNotice() {
      this.visible = !this.visible
    },

    goToRealEvent() {
      this.visible = !this.visible
      this.$router.push({ name: 'real-event' })
    },

    timeFormat(date) {
      const year = date.slice(0, 4)
      const month = date.slice(4, 6)
      const day = date.slice(6, 8)
      const hour = date.slice(8, 10)
      const min = date.slice(10, 12)
      const sec = date.slice(12, 14)
      return `${year}-${month}-${day} ${hour}:${min}:${sec}`
    }
  }
}
</script>

<style lang="css" scoped>
.header-notice-wrapper {
  top: 50px !important;
}
</style>
<style lang="less">
.ant-list-item {
  position: relative;
  .event-text {
    position: absolute;
    top: 12px;
    right: 0px;
  }
}
.header-notice-wrapper {
  .ant-list-footer {
    text-align: center;
    padding-bottom: 0;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #1bd39b;
    }
  }
}
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>

<style >
.ant-list-item-meta-title {
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
