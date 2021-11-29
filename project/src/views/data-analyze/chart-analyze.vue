<template>
  <div class="chart-analyze">
    <div style="margin: 24px">
      <a-card title="区域分析" :bordered="false">
        <a-form-model :model="form1" ref="refForm">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-form-model-item label="开始年份">
                <YearSelect v-model="form1.startYear" @change="getData1" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="结束年份">
                <YearSelect v-model="form1.endYear" @change="getData1" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="时间段">
                <DayNigntSelect v-model="form1.type" @change="getData1" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>

        <ve-histogram
          :data="data1"
          :grid="grid"
          :settings="settings1"
          :loading="loading1"
          :data-empty="dataEmpty1"
          :extend="chartExtend"
        ></ve-histogram>
      </a-card>

      <a-card title="交通分析" :bordered="false">
        <a-form-model :model="form2" ref="refForm">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-form-model-item label="开始年份">
                <YearSelect v-model="form2.startYear" @change="getData2" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="结束年份">
                <YearSelect v-model="form2.endYear" @change="getData2" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="时间段">
                <DayNigntSelect v-model="form2.type" @change="getData2" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="道路类型">
                <a-select v-model="form2.roadType" @change="getData2">
                  <a-select-option :value="1">城市快速路</a-select-option>
                  <a-select-option :value="2">城市主干路</a-select-option>
                  <a-select-option :value="3">城市次干路</a-select-option>
                  <a-select-option :value="4">含轨道交通走廊的道路</a-select-option>
                  <a-select-option :value="5">穿过城市的高速公路</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>

        <ve-histogram
          :data="data2"
          :grid="grid"
          :settings="settings2"
          :loading="loading2"
          :data-empty="dataEmpty2"
          :extend="chartExtend"
        ></ve-histogram>
      </a-card>

      <a-card title="功能区分析" :bordered="false">
        <a-form-model :model="form3" ref="refForm">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-form-model-item label="开始年份">
                <YearSelect v-model="form3.startYear" @change="getData3" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="结束年份">
                <YearSelect v-model="form3.endYear" @change="getData3" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="时间段">
                <DayNigntSelect v-model="form3.type" @change="getData3" />
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="年度季度">
                <a-select v-model="form3.unitTime" @change="getData3">
                  <a-select-option :value="1">年度</a-select-option>
                  <a-select-option :value="2">季度</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
              <a-form-model-item label="功能区">
                <FunCodeSelect v-model="form3.funCode" @change="getData3" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>

        <ve-histogram
          :data="data3"
          :grid="grid"
          :settings="settings3"
          :loading="loading3"
          :data-empty="dataEmpty3"
          :extend="chartExtend"
        ></ve-histogram>
      </a-card>
    </div>
  </div>
</template>

<script>
import { funcodeAnalyse, trafficAnalyse, areaAnalyse } from '@/api/api'
import FunCodeSelect from '@/views/manage-set-nb/components/FunCodeSelect'
import DayNigntSelect from './DayNigntSelect'
import YearSelect from './YearSelect'
import moment from 'moment'

export default {
  name: 'chart-analyze',

  components: {
    FunCodeSelect,
    DayNigntSelect,
    YearSelect,
  },

  data() {
    return {
      grid: {
        bottom: 8,
      },
      chartExtend: {
        series: {
          type: 'bar',
          // barWidth: 40,
          barMaxWidth: 40,
          label: { show: true, position: 'top' },
          smooth: false,
        },
        yAxis: {
          // minInterval: 1
        },
        tooltip: {
          formatter: '{b0}: {c0} dB(A)',
        },
      },

      form1: {
        startYear: new Date().getFullYear() - 1,
        endYear: new Date().getFullYear(),
        type: 1,
      },
      settings1: {
        dimension: ['siteName'],
      },
      data1: {
        columns: [],
        rows: [],
      },
      loading1: false,
      dataEmpty1: false,

      form2: {
        startYear: new Date().getFullYear() - 1,
        endYear: new Date().getFullYear(),
        type: 1,
        roadType: 1,
      },
      settings2: {
        dimension: ['siteName'],
      },
      data2: {
        columns: [],
        rows: [],
      },
      loading2: false,
      dataEmpty2: false,

      form3: {
        startYear: new Date().getFullYear() - 1,
        endYear: new Date().getFullYear(),
        type: 1,
        funCode: 0,
        unitTime: 1,
      },
      settings3: {
        dimension: ['siteName'],
      },
      data3: {
        columns: [],
        rows: [],
      },
      loading3: false,
      dataEmpty3: false,
    }
  },

  mounted() {
    this.getData1()
    this.getData2()
    this.getData3()
  },

  methods: {
    moment,

    packageData(dataList) {
      let map = new Map()
      dataList.forEach((item) => {
        item.data = item.data.toFixed(2)
        if (!map.has(item.site)) {
          map.set(item.site, item.siteName)
        }
      })
      let arr = []
      for (let [key, value] of map.entries()) {
        let obj = {}
        obj.siteName = value
        dataList.forEach((item) => {
          if (item.site === key) {
            obj[item.year] = item.data
          }
        })
        arr.push(obj)
      }
      return arr
    },

    getData1() {
      let param = { ...this.form1 }
      if (param.startYear > param.endYear) {
        this.$message.error('开始年份大于结束年份')
      } else {
        this.loading1 = true
        areaAnalyse(param)
          .then(({ error, response }) => {
            if (error.code === 0) {
              if (response.dataList && response.dataList.length > 0) {
                let arr = this.packageData(response.dataList)
                this.data1.columns = Object.keys(arr[0])
                this.data1.rows = arr
              } else {
                this.data1.columns = []
                this.data1.rows = []
              }
            } else {
              this.data1.columns = []
              this.data1.rows = []
            }
          })
          .finally(() => {
            this.loading1 = false
            if (this.data1.rows.length == 0) {
              this.dataEmpty1 = true
            } else {
              this.dataEmpty1 = false
            }
          })
      }
    },

    getData2() {
      let param = { ...this.form2 }
      if (param.startYear > param.endYear) {
        this.$message.error('开始年份大于结束年份')
      } else {
        this.loading2 = true
        trafficAnalyse(param)
          .then(({ error, response }) => {
            if (error.code === 0) {
              if (response.dataList && response.dataList.length > 0) {
                let arr = this.packageData(response.dataList)
                this.data2.columns = Object.keys(arr[0])
                this.data2.rows = arr
              } else {
                this.data2.columns = []
                this.data2.rows = []
              }
            } else {
              this.data2.columns = []
              this.data2.rows = []
            }
          })
          .finally(() => {
            this.loading2 = false
            if (this.data2.rows.length == 0) {
              this.dataEmpty2 = true
            } else {
              this.dataEmpty2 = false
            }
          })
      }
    },

    getData3() {
      let param = { ...this.form3 }
      if (param.startYear > param.endYear) {
        this.$message.error('开始年份大于结束年份')
      } else {
        this.loading3 = true
        funcodeAnalyse(param)
          .then(({ error, response }) => {
            if (error.code === 0) {
              if (response.dataList && response.dataList.length > 0) {
                let arr = this.packageData(response.dataList)
                this.data3.columns = Object.keys(arr[0])
                this.data3.rows = arr
              } else {
                this.data3.columns = []
                this.data3.rows = []
              }
            } else {
              this.data3.columns = []
              this.data3.rows = []
            }
          })
          .finally(() => {
            this.loading3 = false
            if (this.data3.rows.length == 0) {
              this.dataEmpty3 = true
            } else {
              this.dataEmpty3 = false
            }
          })
      }
    },
  },
}
</script>

<style scoped lang="less">
/deep/ .ant-card {
  margin-bottom: 24px;
}
</style>
