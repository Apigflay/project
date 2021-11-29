<template>
  <div class="manual-point-list">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>手工导入</a-breadcrumb-item>
        <a-breadcrumb-item>测点列表</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">测点列表</div>
    </div>

    <div class="page-common-content">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :rowKey="(record,index) => index"
        :loading="loading"
        :pagination="page"
      ></a-table>
    </div>
  </div>
</template>

<script>
import { GetMeasureByHand } from '@/api/manual-import'
const columns = [
  {
    title: '测点编号',
    dataIndex: 'MeasureCode'
  },
  {
    title: '测点名称',
    dataIndex: 'MeasureName'
  },
  {
    title: '测点地址',
    dataIndex: 'MeasureAddress'
  },
  {
    title: '省',
    dataIndex: 'Province'
  },
  {
    title: '市',
    dataIndex: 'City'
  },
  {
    title: '区',
    dataIndex: 'District'
  },
  {
    title: '纬度',
    dataIndex: 'Lat'
  },
  {
    title: '经度',
    dataIndex: 'Lon'
  },
  {
    title: '功能区',
    dataIndex: 'FunCode'
  },
  {
    title: '道路长度',
    dataIndex: 'L'
  }
]

export default {
  name: 'manual-point-list',

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
      }
    }
  },

  mounted() {
    this.loading = true
    GetMeasureByHand({})
      .then(res => {
        this.dataSource = JSON.parse(res.d)
        this.page.total = this.dataSource.length
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style scoped lang="less">
</style>
