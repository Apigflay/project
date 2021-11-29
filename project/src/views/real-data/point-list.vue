<template>
  <div class="point-list">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>实时数据</a-breadcrumb-item>
        <a-breadcrumb-item>测点列表</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">测点列表</div>
    </div>

    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="filter-row">
          <div class="filter-row-item">
            <span class="filter-row-item-label">测点名称：</span>
            <a-input
              v-model="pointName_filter"
              placeholder="搜索测点名称"
              style="width:240px;"
              allowClear
            ></a-input>
          </div>

          <div class="filter-row-item">
            <span class="filter-row-item-label">仪器编号：</span>
            <a-input
              v-model="measureCode_filter"
              placeholder="搜索仪器编号"
              style="width:240px;"
              allowClear
            ></a-input>
          </div>
        </div>

        <div class="search-config-wrapper" style="margin-bottom:0px;">
          <div class="config-row">
            <div>
              <a-select
                :value="leqtype()"
                style="width: 110px;margin-right: 16px;"
                @change="leqtypeChange"
              >
                <a-select-option value="LeqT">Leq,T</a-select-option>
                <a-select-option value="LeqTH">Leq(小时)</a-select-option>
                <a-select-option value="LeqTD">Leq(天)</a-select-option>
              </a-select>

              <a-button @click="showModal">列表配置</a-button>
            </div>
          </div>
        </div>
      </div>

      <a-table
        class="table"
        :dataSource="displayList"
        :pagination="pagination"
        :rowKey="record => record.MeasureCode + '-' + record.MeasureId"
        :scroll="{ x:2100,y: 660 }"
      >
        <a-table-column
          v-if="checkedList.includes('MeasureName')"
          title="测点名称"
          data-index="MeasureName"
          key="MeasureName"
          width="150px"
        />

        <a-table-column
          v-if="checkedList.includes('MeasureCode')"
          title="测点编号"
          data-index="MeasureCode"
          key="MeasureCode"
          width="150px"
        />

        <a-table-column
          v-if="checkedList.includes('MeasureId')"
          title="仪器编号"
          data-index="MeasureId"
          key="MeasureId"
          width="150px"
        />

        <a-table-column
          v-if="checkedList.includes('linkState')"
          title="连接状态"
          data-index="linkState"
          key="linkState"
          width="150px"
        >
          <template slot-scope="linkState">
            <span
              class="dot"
              :class="{'success-dot':linkState === '2', 'warning-dot':linkState === '1', 'disabled-dot':linkState === '0'}"
            ></span>
            <span>{{linkState | linkStateFormat}}</span>
          </template>
        </a-table-column>

        <a-table-column
          v-if="checkedList.includes('DateTime')"
          title="测量时间"
          data-index="DateTime"
          key="DateTime"
          :sorter="(a, b) => a.DateTime - b.DateTime"
          width="200px"
        >
          <template slot-scope="DateTime">
            <span>{{DateTime | timeFormat}}</span>
          </template>
        </a-table-column>

        <a-table-column
          v-if="checkedList.includes('Lp')"
          title="Lp"
          data-index="Lp"
          key="Lp"
          width="100px"
        >
          <template slot-scope="Lp">
            <span>{{ Lp }}</span>
          </template>
        </a-table-column>

        <a-table-column
          v-if="leqtype() === 'LeqT'"
          title="Leq,T"
          data-index="LeqT"
          key="LeqT"
          width="100px"
        >
          <template slot-scope="LeqT">
            <span>{{ LeqT }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-else-if="leqtype() === 'LeqTH'"
          title="Leq(小时)"
          data-index="LeqTH"
          key="LeqTH"
          width="100px"
        >
          <template slot-scope="LeqTH">
            <span>{{ LeqTH }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-else-if="leqtype() === 'LeqTD'"
          title="Leq(天)"
          data-index="LeqTD"
          key="LeqTD"
          width="100px"
        >
          <template slot-scope="LeqTD">
            <span>{{ LeqTD }}</span>
          </template>
        </a-table-column>

        <a-table-column
          v-if="checkedList.includes('Lmax')"
          title="Lmax"
          data-index="Lmax"
          key="Lmax"
          width="150px"
        >
          <template slot-scope="Lmax">
            <span>{{ Lmax }}</span>
          </template>
        </a-table-column>

        <a-table-column
          v-if="checkedList.includes('MeasureType')"
          title="仪器类型"
          data-index="MeasureType"
          key="MeasureType"
          width="150px"
        />

        <a-table-column
          v-if="checkedList.includes('Funcode')"
          title="功能区"
          data-index="Funcode"
          key="Funcode"
          width="150px"
        >
          <template slot-scope="Funcode">
            <span>{{ Funcode | funcodeFormat}}</span>
          </template>
        </a-table-column>

        <a-table-column
          v-if="checkedList.includes('LinkMode')"
          title="连接类型"
          data-index="LinkMode"
          key="LinkMode"
          width="100px"
        >
          <template slot-scope="LinkMode">
            <span>{{ LinkMode === '0' ? '网口' : '串口' }}</span>
          </template>
        </a-table-column>

        <a-table-column
          v-if="checkedList.includes('MeasureAddress')"
          title="测点地址"
          data-index="MeasureAddress"
          key="MeasureAddress"
        />

        <a-table-column
          v-if="checkedList.includes('LONG')"
          title="经度"
          data-index="LONG"
          key="LONG"
          width="100px"
        />

        <a-table-column
          v-if="checkedList.includes('Latitude')"
          title="纬度"
          data-index="Latitude"
          key="Latitude"
          width="100px"
        />
        <a-table-column
          v-if="checkedList.includes('Port')"
          title="通讯端口"
          data-index="Port"
          key="Port"
          width="100px"
        />
      </a-table>
    </div>

    <a-modal
      title="列表配置"
      v-model="modalVisible"
      :footer="null"
      style="top: 48px;"
    >
      <a-checkbox :checked="checkAll" @change="selectAll">全选</a-checkbox>
      <a-divider style="margin:12px 0px 20px 0px;"></a-divider>
      <a-checkbox-group
        v-model="checkedList"
        :options="columnsConfigOptions"
        @change="onChange"
      />
    </a-modal>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'

const columnsConfigOptions = [
  { label: '测点名称', value: 'MeasureName' },
  { label: '测点编号', value: 'MeasureCode' },
  { label: '仪器编号', value: 'MeasureId' },
  { label: '测量时间', value: 'DateTime' },
  { label: '测点地址', value: 'MeasureAddress' },
  { label: 'Lp', value: 'Lp' },
  { label: 'Lmax', value: 'Lmax' },
  { label: '仪器类型', value: 'MeasureType' },
  { label: '功能区', value: 'Funcode' },
  { label: '连接类型', value: 'LinkMode' },
  { label: '连接状态', value: 'linkState' },
  { label: '经度', value: 'LONG' },
  { label: '纬度', value: 'Latitude' },
  { label: '通讯端口', value: 'Port' }
]

export default {
  name: 'point-list',

  data() {
    return {
      modalVisible: false,
      columnsConfigOptions, //列表配置复选框的全部选项
      checkAll: false,

      pagination: {
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '1000']
      },

      socket: '',

      pointName_filter: undefined,
      measureCode_filter: undefined
    }
  },

  computed: {
    checkedList: {
      get() {
        return this.$store.getters.checkedList
      },
      set(val) {
        this.$store.commit('SET_CHECKEDLIST', val)
      }
    },

    displayList() {
      if (this.pointName_filter !== undefined && this.measureCode_filter === undefined) {
        return this.realPointList().filter(item => {
          return item.MeasureName.includes(this.pointName_filter)
        })
      }
      if (this.pointName_filter === undefined && this.measureCode_filter !== undefined) {
        return this.realPointList().filter(item => {
          return item.MeasureId.includes(this.measureCode_filter)
        })
      }

      if (this.pointName_filter !== undefined && this.measureCode_filter !== undefined) {
        return this.realPointList().filter(item => {
          return item.MeasureId.includes(this.measureCode_filter) && item.MeasureName.includes(this.pointName_filter)
        })
      }

      if (this.pointName_filter === undefined && this.measureCode_filter === undefined) {
        return this.realPointList()
      }
    }
  },

  created() {
    this.$store.getters.socket.close()
    this.$store.dispatch('GetRealPointList')
  },

  methods: {
    ...mapActions(['SetSocketMessage', 'SetRealPointList', 'SetShowColumns']),
    ...mapGetters(['realPointList', 'showColumns', 'leqtype']),

    showModal() {
      this.modalVisible = true
      this.checkAll = this.checkedList.length === columnsConfigOptions.length
    },

    selectAll(e) {
      this.checkAll = e.target.checked

      if (this.checkAll) {
        this.$store.commit(
          'SET_CHECKEDLIST',
          columnsConfigOptions.map(item => item.value)
        )
      } else {
        this.$store.commit('SET_CHECKEDLIST', [])
      }
    },

    onChange(arr) {
      this.checkAll = this.checkedList.length === columnsConfigOptions.length
      // this.$store.commit('SET_CHECKEDLIST', arr)
    },

    leqtypeChange(value) {
      this.$store.commit('SET_LEQTYPE', value)
    }
  }
}
</script>




<style lang="less" scoped>
.point-list {
  height: calc(100vh - 64px);
  overflow: auto;

  .filter-row {
    display: flex;
    .filter-row-item {
      display: flex;
      margin-right: 16px;
      .filter-row-item-label {
        min-width: 62px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>



