<template>
  <div class="point-manage">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>测点管理</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="search-row">
          <a-button type="primary" @click="addPointModalVisible = true">
            <a-icon type="plus" />添加测点
          </a-button>
        </div>
      </div>

      <a-table :dataSource="realPointList()" :rowKey="(record, index)=> index" :pagination="pagination">
        <a-table-column title="测点名称" data-index="MeasureName" key="MeasureName" />
        <a-table-column title="测点编号" data-index="MeasureCode" key="MeasureCode" />
        <a-table-column title="仪器编号" data-index="MeasureId" key="MeasureId" />
        <a-table-column title="仪器类型" data-index="MeasureType" key="MeasureType" />
        <a-table-column title="功能区" data-index="Funcode" key="Funcode">
          <template slot-scope="Funcode">
            <span>{{Funcode | funcodeFormat}}</span>
          </template>
        </a-table-column>

        <a-table-column title="气象" data-index="isReadWeather" key="isReadWeather">
          <template slot-scope="isReadWeather">
            <span>{{isReadWeather ? '有' : '无'}}</span>
          </template>
        </a-table-column>

        <a-table-column title="交通" data-index="isReadCarflow" key="isReadCarflow">
          <template slot-scope="isReadCarflow">
            <span>{{isReadCarflow ? '有' : '无'}}</span>
          </template>
        </a-table-column>

        <a-table-column title="连接状态" data-index="linkState" key="linkState">
          <template slot-scope="linkState">
            <span
              class="dot"
              :class="{'success-dot':linkState === '2', 'warning-dot':linkState === '1', 'disabled-dot':linkState === '0'}"
            ></span>
            <span>{{linkState | linkStateFormat}}</span>
          </template>
        </a-table-column>

        <a-table-column title="操作" key="action" width="320px">
          <template slot-scope="record">
            <div
              class="action-btn primary-color"
              v-if="record.linkState === '2' && (record.MeasureType.includes('2001') || record.MeasureType.includes('3001'))"
              @click="clickSetUI(record)"
            >
              设置仪器
              <a-divider type="vertical" />
            </div>

            <div class="action-btn primary-color" @click="clickSetPoint(record)">
              设置测点
              <a-divider type="vertical" />
            </div>

            <div
              class="action-btn primary-color"
              @click="clickSetParams(record)"
              v-if="record.linkState === '2' && record.MeasureType.includes('6218J') "
            >
              设置仪器参数
              <a-divider type="vertical" />
            </div>

            <div class="action-btn primary-color" @click="clickLookHistory(record)">查看仪器历史测点</div>
          </template>
        </a-table-column>
      </a-table>

      <add-point-modal :visible.sync="addPointModalVisible"></add-point-modal>
      <edit-point-modal :visible.sync="editPointModalVisible" :pointInfo="pointInfo"></edit-point-modal>
      <set-params-modal :visible.sync="setParamsModalVisible" :pointInfo="pointInfo"></set-params-modal>
      <look-history-modal :visible.sync="lookHistoryModalVisible" :pointInfo="pointInfo"></look-history-modal>
      <SetUIModal :visible.sync="UIModalVisible" :pointInfo="pointInfo"></SetUIModal>
    </div>
  </div>
</template>


<script>
import AddPointModal from './add-point-modal'
import EditPointModal from './edit-point-modal'
import SetParamsModal from './set-params-modal'
import lookHistoryModal from './look-history-modal'
import SetUIModal from './SetUIModal'
import { mapGetters } from 'vuex'

export default {
  name: 'PointManage',

  components: {
    AddPointModal,
    EditPointModal,
    SetParamsModal,
    lookHistoryModal,
    SetUIModal
  },

  data() {
    return {
      addPointModalVisible: false,
      editPointModalVisible: false,
      setParamsModalVisible: false,
      lookHistoryModalVisible: false,
      UIModalVisible: false,
      pointInfo: {},
      pagination: {
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true, // 是否可以改变 pageSize
        pageSizeOptions: ['10', '100', '1000']
      }
    }
  },

  mounted() {
    //如果从确认信息modal点进来
    if (this.$route.params.addPointModalVisible === true) {
      this.addPointModalVisible = true
    }
  },

  methods: {
    ...mapGetters(['realPointList']),

    clickSetPoint(pointInfo) {
      this.pointInfo = pointInfo
      this.editPointModalVisible = true
    },

    clickSetParams(pointInfo) {
      this.pointInfo = pointInfo
      this.setParamsModalVisible = true
    },

    clickLookHistory(pointInfo) {
      this.pointInfo = pointInfo
      this.lookHistoryModalVisible = true
    },

    clickSetUI(pointInfo) {
      this.pointInfo = pointInfo
      this.UIModalVisible = true
    }
  }
}
</script>


<style lang="less" scoped>
.point-manage {
  .page-common-content {
    .config-row {
      .ant-btn {
        margin-left: 8px;
      }
    }
    .action-btn {
      display: inline-block;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>