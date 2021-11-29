<template>
  <div class="real-event">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>实时数据</a-breadcrumb-item>
        <a-breadcrumb-item>实时事件</a-breadcrumb-item>
      </a-breadcrumb>

      <div class="title">实时事件</div>
    </div>

    <div class="page-common-content">
      <a-table
        class="table"
        :columns="columns"
        :dataSource="realEventList()"
        :loading="loading"
        :pagination="pagination"
        :rowKey="(record, index)=> index"
      >
        <span slot="EventTime" slot-scope="EventTime">{{EventTime | timeFormat}}</span>
      </a-table>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
const columns = [
  {
    title: '测点名称',
    dataIndex: 'MeasureName'
  },
  {
    title: '开始时间',
    dataIndex: 'EventTime',
    sorter: (a, b) => a.EventTime - b.EventTime,
    scopedSlots: { customRender: 'EventTime' }
  },
  {
    title: '事件名称',
    dataIndex: 'EventName'
  },
  {
    title: '事件ID',
    dataIndex: 'EventID'
  },
  {
    title: '事件描述',
    dataIndex: 'EventDesc'
  }
]

export default {
  data() {
    return {
      loading: false,
      columns,
      pagination: {
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true, // 是否可以改变 pageSize
        pageSizeOptions: ['10', '100', '1000']
      },
      socket: ''
    }
  },

  created() {
    this.$store.getters.realEventSocket.close()
    this.$store.dispatch('GetRealEventList')
  },

  methods: {
    ...mapGetters(['realEventList'])
  }
}
</script>


<style lang="less" scoped>
.real-event {
  height: calc(100vh - 64px);
  overflow: auto;
}
</style>

