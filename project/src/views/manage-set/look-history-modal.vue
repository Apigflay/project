<template>
  <div class="look-history-modal">
    <a-modal
      title="仪器历史测点"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="true"
      style="top: 70px;"
      width="1190px"
      :destroyOnClose="true"
      :footer="null"
    >
      <a-table :dataSource="dataSource" :rowKey="(record, index)=> index" :pagination="pagination">
        <a-table-column title="测点名称" data-index="MeasureName" key="MeasureName" />
        <a-table-column title="仪器编号" data-index="MeasureId" key="MeasureId" />
        <a-table-column title="测点编号" data-index="MeasureCode" key="MeasureCode" />
        <a-table-column title="测点地址" data-index="MeasureAddress" key="MeasureAddress" />
        <a-table-column title="经度" data-index="Lon" key="Lon" />
        <a-table-column title="纬度" data-index="Lat" key="Lat" />
        <a-table-column title="操作" key="action" width="150px">
          <template slot-scope="record">
            <div class="action-btn primary-color" @click="lookDataRecord(record)">查看数据记录</div>
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getHistoryPointList } from '@/api/manage-set'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'lookHistoryModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pointInfo: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      pagination: {
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      dataSource: []
    }
  },

  watch: {
    visible(val) {
      if (val === true) {
        this.getHistoryPointList()
      }
    }
  },

  methods: {
    ...mapActions(['SetHistoryPointCode']),
    ...mapGetters(['userInfo']),

    handleOk() {
      this.handleCancel()
    },

    handleCancel(e) {
      this.$emit('update:visible', false)
    },

    getHistoryPointList() {
      getHistoryPointList(this.pointInfo.MeasureId, this.userInfo().UserName).then(res => {
        let result = JSON.parse(res.d)
        if (result.Error) {
          this.$message.error('系统错误')
        } else {
          this.dataSource = result
          this.dataSource.forEach(item => {
            item.MeasureId = this.pointInfo.MeasureId
          })
        }
      })
    },

    lookDataRecord(record) {
      // this.SetHistoryPointCode(record.MeasureCode + '-' + record.MeasureId)
      this.$router.push({
        name: 'instant-data',
        params: {
          pointCode: record.MeasureCode + '-' + record.MeasureId
        }
      })
    }
  }
}
</script>


<style lang="less" scoped>
.action-btn {
  display: inline-block;
  cursor: pointer;
  user-select: none;
}
</style>