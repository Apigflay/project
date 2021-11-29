<template>
  <div class="data-list">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>手工导入</a-breadcrumb-item>
        <a-breadcrumb-item>数据列表</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">数据列表</div>
    </div>

    <div class="page-common-content">
      <a-form-model :model="form" ref="form" :rules="rules">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="创建时间" prop="dateRange">
              <a-range-picker
                v-model="form.dateRange"
                style="width: 100%;"
                :ranges="{
                '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')], 
                '今天': [moment().startOf('day'), moment().endOf('day')], 
                '本周': [moment().startOf('week'), moment().endOf('week')], 
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '本年': [moment().startOf('year'), moment().endOf('year')],
              }"
                allowClear
                format="YYYY-MM-DD HH:mm:ss"
                :showTime="{
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
              }"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="数据类型" prop="DataType">
              <a-select v-model="form.DataType" :defaultActiveFirstOption="false" placeholder="请选择" allowClear>
                <a-select-option :value="1">区域声环境</a-select-option>
                <a-select-option :value="2">功能区声环境</a-select-option>
                <a-select-option :value="3">交通声环境</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="时间段" prop="DayOrNight">
              <a-select v-model="form.DayOrNight" :defaultActiveFirstOption="false" placeholder="请选择" allowClear>
                <a-select-option :value="0">白天</a-select-option>
                <a-select-option :value="1">夜晚</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="测点" prop="MeasureCode">
              <a-select v-model="form.MeasureCode" :defaultActiveFirstOption="false" placeholder="请选择" allowClear>
                <a-select-option
                  v-for="item in mlist"
                  :key="item.MeasureCode"
                  :value="item.MeasureCode"
                >{{`${item.MeasureName} (${item.MeasureCode})`}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="省市区" prop="ssq">
              <AreaSelect v-model="form.ssq" placeholder="请选择" allowClear />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="btn-container">
        <a-button type="primary" @click="handleQuery">查询</a-button>
        <a-button @click="resetForm">重置</a-button>
      </div>
    </div>

    <div class="page-common-content">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :rowKey="(record,index) => index"
        :loading="loading"
        :scroll="{ x: 4100, y: 600 }"
        :pagination="page"
      >
        <span slot="DataType" slot-scope="DataType">{{DataType | gansuFormat}}</span>
      </a-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { GetMeasureDataByHandList, GetMeasureByHand } from '@/api/manual-import'
import AreaSelect from './AreaSelect'

const columns = [
  {
    title: '测点编号',
    dataIndex: 'MeasureCode',
    width: 150
  },
  {
    title: '测点名称',
    dataIndex: 'MeasureName',
    width: 150
  },
  {
    title: 'LeqT',
    dataIndex: 'LeqT',
    width: 150
  },
  {
    title: 'L5',
    dataIndex: 'L5',
    width: 150
  },
  {
    title: 'L10',
    dataIndex: 'L10',
    width: 150
  },
  {
    title: 'L50',
    dataIndex: 'L50',
    width: 150
  },
  {
    title: 'L90',
    dataIndex: 'L90',
    width: 150
  },
  {
    title: 'L95',
    dataIndex: 'L95',
    width: 150
  },
  {
    title: 'Lmin',
    dataIndex: 'Lmin',
    width: 150
  },
  {
    title: 'Lmax',
    dataIndex: 'Lmax',
    width: 150
  },
  {
    title: 'SD',
    dataIndex: 'SD',
    width: 150
  },
  {
    title: '最大风速',
    dataIndex: 'WindSpeed',
    width: 150
  },
  {
    title: '雨量',
    dataIndex: 'PRF',
    width: 150
  },

  {
    title: '大车流量',
    dataIndex: 'BigCarNum',
    width: 150
  },
  {
    title: '中小车流量',
    dataIndex: 'ShortCarNum',
    width: 150
  },
  {
    title: '数据类型',
    dataIndex: 'DataType',
    scopedSlots: { customRender: 'DataType' },
    width: 150
  },
  {
    title: '仪器型号',
    dataIndex: 'DeviceType',
    width: 150
  },
  {
    title: '仪器编号',
    dataIndex: 'DeviceID',
    width: 150
  },
  // {
  //   title: '仪器校准时间',
  //   dataIndex: 'CalibrationDate',
  //   width: 200
  // },
  {
    title: '测量人姓名',
    dataIndex: 'Operator',
    width: 150
  },
  {
    title: '测量起始时间',
    dataIndex: 'StartDt',
    width: 200
  },
  {
    title: '测量结束时间',
    dataIndex: 'EndDt',
    width: 200
  },
  {
    title: '校准器型号',
    dataIndex: 'CalibratorType',
    width: 150
  },
  {
    title: '校准器编号',
    dataIndex: 'CalibratorNumber',
    width: 150
  },
  {
    title: '校准器视值',
    dataIndex: 'CalibratorShowValue',
    width: 150
  },
  {
    title: '测量前校准值',
    dataIndex: 'BeforeMeasureValue',
    width: 150
  },
  {
    title: '测量后校准值',
    dataIndex: 'AfterMeasureValue'
  }
]

export default {
  name: 'data-list',

  components: {
    AreaSelect
  },

  data() {
    return {
      dataSource: [],
      columns,
      loading: false,
      page: {
        total: 0,
        showTotal: total => `共 ${this.page.total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '50', '100']
      },
      form: {
        dateRange: [
          moment('2010-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
          moment('2020-12-31 23:59:59', 'YYYY-MM-DD HH:mm:ss')
        ],
        DataType: undefined,
        DayOrNight: undefined,
        MeasureCode: undefined,
        ssq: [] //省市区
      },
      rules: {
        dateRange: [{ required: true, message: '请输入', trigger: 'blur' }],
        DataType: [{ required: false, message: '请选择', trigger: 'change' }],
        DayOrNight: [{ required: false, message: '请选择', trigger: 'change' }],
        MeasureCode: [{ required: false, message: '请输入', trigger: 'change' }]
      },
      mlist: []
    }
  },

  mounted() {
    this.handleQuery()

    GetMeasureByHand({}).then(res => {
      this.mlist = JSON.parse(res.d)
    })
  },

  methods: {
    moment,

    handleQuery() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {}
          params.STime = this.form.dateRange[0].format('YYYY-MM-DD HH:mm:ss')
          params.ETime = this.form.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
          params.DataType = this.form.DataType
          params.DayOrNight = this.form.DayOrNight
          params.MeasureCode = this.form.MeasureCode
          params.Province = this.form.ssq[0] ? this.form.ssq[0] : '' //省
          params.City = this.form.ssq[1] ? this.form.ssq[1] : '' //市
          params.District = this.form.ssq[2] ? this.form.ssq[2] : '' //区
          GetMeasureDataByHandList(params).then(res => {
            this.dataSource = JSON.parse(res.d)
            this.page.total = this.dataSource.length
            this.loading = false
          })
        }
      })
    },

    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-form-item {
  display: flex;
  .ant-form-item-label {
    min-width: 80px;
  }
  .ant-form-item-control-wrapper {
    flex: 1;
  }
}

.btn-container {
  display: flex;
  justify-content: flex-end;
  button {
    margin-left: 16px;
  }
}
</style>
