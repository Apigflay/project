<template>
  <div class="import-data">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>手工导入</a-breadcrumb-item>
        <a-breadcrumb-item>导入数据</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">导入数据</div>
    </div>

    <div class="page-common-content">
      <div class="upload-container">
        <a-upload accept=".xls, .xlsx" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
          <a-button>
            <a-icon type="upload" />上传excel文件
          </a-button>
        </a-upload>
        <a-tooltip class="import-btn" title="请先上传excel文件">
          <a-button type="primary" :disabled="dataSource.length===0" @click="clickImport">导入数据</a-button>
        </a-tooltip>
      </div>

      <a-table
        :columns="columns"
        :data-source="info"
        :scroll="{ x: 4150, y: 600 }"
        :pagination="page"
        :rowKey="(record, index) => index"
      ></a-table>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { AddMeasureDataByHand } from '@/api/manual-import'

const columns = [
  {
    title: '测点编号',
    dataIndex: 'MeasureCode',
    width: 150
  },
  {
    title: '数据类型',
    dataIndex: 'DataType',
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
  {
    title: '仪器校准时间',
    dataIndex: 'CalibrationDate',
    width: 200
  },
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
    dataIndex: 'AfterMeasureValue',
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
    title: '大车流量',
    dataIndex: 'BigCarNum',
    width: 150
  },
  {
    title: '中小车流量',
    dataIndex: 'ShortCarNum'
  }
]

export default {
  name: 'import-data',

  data() {
    return {
      fileList: [],
      dataSource: [],
      info: [],
      columns,
      page: {
        total: 0,
        showTotal: (total, range) => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '50', '100']
      }
    }
  },

  methods: {
    handleRemove() {
      this.fileList = []
      this.dataSource = []
      this.page.total = 0
    },

    beforeUpload(file) {
      this.fileList = [file]
      let wb //读取完成的数据
      let reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = e => {
        wb = XLSX.read(e.target.result, {
          type: 'binary'
        })
        this.dataSource = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])

        function formatDate(numb) {
          const time = new Date((numb - 25569) * 86400 * 1000)
          const year = time.getUTCFullYear()
          const month = time.getUTCMonth() + 1
          const day = time.getUTCDate()
          const hour = time.getUTCHours()
          const min = time.getUTCMinutes()
          const sec = time.getUTCSeconds()
          return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${
            hour < 10 ? '0' + hour : hour
          }:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
        }

        this.dataSource.forEach(item => {
          item['仪器校准时间'] = formatDate(item['仪器校准时间'])
          item['测量起始时间'] = formatDate(item['测量起始时间'])
          item['测量结束时间'] = formatDate(item['测量结束时间'])
        })

        this.info = this.dataSource.map(item => {
          let temp = {}
          temp.AfterMeasureValue = item['测量后校准值']
          temp.BeforeMeasureValue = item['测量前校准值']
          temp.BigCarNum = item['大车流量']
          temp.ShortCarNum = item['中小车流量']
          temp.CalibrationDate = item['仪器校准时间']
          temp.CalibratorNumber = item['校准器编号']
          temp.CalibratorShowValue = item['校准器视值']
          temp.CalibratorType = item['校准器型号']
          temp.DataType = item['数据类型']
          temp.DeviceID = item['仪器编号']
          temp.DeviceType = item['仪器型号']
          temp.StartDt = item['测量起始时间']
          temp.EndDt = item['测量结束时间']
          temp.Operator = item['测量人姓名']
          temp.MeasureCode = item['测点编号']
          temp.LeqT = item['LeqT']
          temp.Lmax = item['Lmax']
          temp.Lmin = item['Lmin']
          temp.L5 = item['L5']
          temp.L10 = item['L10']
          temp.L50 = item['L50']
          temp.L90 = item['L90']
          temp.L95 = item['L95']
          temp.SD = item['SD']
          temp.WindSpeed = item['最大风速']
          temp.PRF = item['雨量']
          return temp
        })
        this.page.total = this.dataSource.length
      }
      return false
    },

    clickImport() {
      AddMeasureDataByHand({
        info: this.info
      }).then(res => {
        let { Error, Msg } = JSON.parse(res.d)
        if (Error === 0) {
          this.$message.success(Msg)
        } else {
          this.$message.error(Msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.upload-container {
  width: 248px;
  margin-bottom: 24px;
  position: relative;
}
.import-btn {
  position: absolute;
  top: 0;
  left: 160px;
}
</style>
