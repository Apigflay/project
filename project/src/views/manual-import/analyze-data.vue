<template>
  <div class="data-analyze">
    <div style="margin:24px">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="功能区长期变化趋势分析" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <RangePicker v-model="form1.dateRange" style="width:100%" @change="getData1" />
              </a-col>

              <a-col :span="12">
                <a-select
                  v-model="form1.DayOrNight"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData1"
                >
                  <a-select-option :value="0">白天</a-select-option>
                  <a-select-option :value="1">夜晚</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <AreaSelect v-model="form1.ssq" style="width:100%" placeholder="请选择省市区" @change="getData1" />
              </a-col>
            </a-row>

            <ve-line
              :data="data1"
              :grid="grid"
              :settings="settings1"
              :loading="loading1"
              :data-empty="dataEmpty1"
              :extend="chartExtend"
            ></ve-line>
          </a-card>
        </a-col>

        <a-col :span="12">
          <a-card title="区域或交通声环境长期变化趋势分析" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <RangePicker v-model="form2.dateRange" style="width:100%" @change="getData2" />
              </a-col>

              <a-col :span="12">
                <a-select
                  v-model="form2.DataType"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData2"
                >
                  <a-select-option :value="1">区域声环境</a-select-option>
                  <a-select-option :value="3">交通声环境</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <a-select
                  v-model="form2.DayOrNight"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData2"
                >
                  <a-select-option :value="0">白天</a-select-option>
                  <a-select-option :value="1">夜晚</a-select-option>
                </a-select>
              </a-col>

              <a-col :span="12">
                <AreaSelect v-model="form2.ssq" style="width:100%" placeholder="请选择省市区" @change="getData2" />
              </a-col>
            </a-row>

            <ve-line
              :data="data2"
              :grid="grid"
              :settings="settings2"
              :loading="loading2"
              :data-empty="dataEmpty2"
              :extend="chartExtend"
            ></ve-line>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="功能区声环境同比环比分析" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <a-date-picker v-model="form3.date" show-time @change="getData3" style="width:100%" />
              </a-col>

              <a-col :span="12">
                <a-select
                  v-model="form3.YOYorNOL"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData3"
                >
                  <a-select-option :value="0">同比</a-select-option>
                  <a-select-option :value="1">环比</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <a-select
                  v-model="form3.DayOrNight"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData3"
                >
                  <a-select-option :value="0">白天</a-select-option>
                  <a-select-option :value="1">夜晚</a-select-option>
                </a-select>
              </a-col>

              <a-col :span="12">
                <AreaSelect v-model="form3.ssq" style="width:100%" placeholder="请选择省市区" @change="getData3" />
              </a-col>
            </a-row>

            <ve-line
              :data="data3"
              :grid="grid"
              :settings="settings3"
              :loading="loading3"
              :data-empty="dataEmpty3"
              :extend="chartExtend"
            ></ve-line>
          </a-card>
        </a-col>

        <a-col :span="12">
          <a-card title="区域或交通声环境同比环比分析" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <a-select
                  v-model="form4.DataType"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData4"
                >
                  <a-select-option :value="1">区域声环境</a-select-option>
                  <a-select-option :value="3">交通声环境</a-select-option>
                </a-select>
              </a-col>

              <a-col :span="12">
                <a-select
                  v-model="form4.DayOrNight"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData4"
                >
                  <a-select-option :value="0">白天</a-select-option>
                  <a-select-option :value="1">夜晚</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <AreaSelect v-model="form4.ssq" style="width:100%" placeholder="请选择省市区" @change="getData4" />
              </a-col>
            </a-row>

            <ve-line
              :data="data4"
              :grid="grid"
              :settings="settings4"
              :loading="loading4"
              :data-empty="dataEmpty4"
              :extend="chartExtend"
            ></ve-line>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="功能区排名分析" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <a-date-picker v-model="form5.date" show-time @change="getData5" style="width:100%" />
              </a-col>

              <a-col :span="12">
                <a-select
                  v-model="form5.DayOrNight"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData5"
                >
                  <a-select-option :value="0">白天</a-select-option>
                  <a-select-option :value="1">夜晚</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <AreaSelect v-model="form5.ssq" style="width:100%" placeholder="请选择省市区" @change="getData5" />
              </a-col>

              <a-col :span="12">
                <a-select
                  v-model="form5.FuncCode"
                  :defaultActiveFirstOption="false"
                  style="width:100%"
                  @change="getData5"
                >
                  <a-select-option value="0">0</a-select-option>
                  <a-select-option value="1">1</a-select-option>
                  <a-select-option value="2">2</a-select-option>
                  <a-select-option value="3">3</a-select-option>
                  <a-select-option value="4a">4a</a-select-option>
                  <a-select-option value="4b">4b</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <ve-histogram
              :data="data5"
              :grid="grid"
              :settings="settings5"
              :loading="loading5"
              :data-empty="dataEmpty5"
              :extend="chartExtend"
            ></ve-histogram>
          </a-card>
        </a-col>

        <a-col :span="12">
          <a-card title="区域或交通声环境排名分析" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <a-select v-model="form6.year" :defaultActiveFirstOption="false" style="width:100%" @change="getData6">
                  <a-select-option
                    v-for="i in 10"
                    :key="i"
                    :value="new Date().getFullYear()-i + 1"
                  >{{new Date().getFullYear()-i + 1}}年</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12">
                <a-select
                  v-model="form6.DataType"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData6"
                >
                  <a-select-option :value="1">区域声环境</a-select-option>
                  <a-select-option :value="3">交通声环境</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <a-select
                  v-model="form6.DayOrNight"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData6"
                >
                  <a-select-option :value="0">白天</a-select-option>
                  <a-select-option :value="1">夜晚</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12">
                <AreaSelect v-model="form6.ssq" style="width:100%" placeholder="请选择省市区" @change="getData6" />
              </a-col>
            </a-row>

            <ve-histogram
              :data="data6"
              :grid="grid"
              :settings="settings6"
              :loading="loading6"
              :data-empty="dataEmpty6"
              :extend="chartExtend"
            ></ve-histogram>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="声功能区噪声超标分析" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <RangePicker v-model="form7.dateRange" style="width:100%" @change="getData7" />
              </a-col>

              <a-col :span="12">
                <a-select
                  v-model="form7.DayOrNight"
                  :defaultActiveFirstOption="false"
                  placeholder="请选择时间段"
                  style="width:100%"
                  @change="getData7"
                >
                  <a-select-option :value="0">白天</a-select-option>
                  <a-select-option :value="1">夜晚</a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row :gutter="24" style="margin-bottom:24px">
              <a-col :span="12">
                <AreaSelect v-model="form7.ssq" style="width:100%" placeholder="请选择省市区" @change="getData7" />
              </a-col>
            </a-row>

            <ve-histogram
              :data="data7"
              :grid="grid"
              :settings="settings7"
              :loading="loading7"
              :data-empty="dataEmpty7"
              :extend="chartExtend"
            ></ve-histogram>
          </a-card>
        </a-col>

        <a-col :span="12">
          <a-card title="测点分布统计" :bordered="false">
            <a-row :gutter="24" style="margin-bottom:80px">
              <a-col :span="12">
                <AreaSelect v-model="form8.ssq" style="width:100%" placeholder="请选择省市区" @change="getData8" />
              </a-col>
            </a-row>

            <ve-histogram
              :data="data8"
              :grid="grid"
              :settings="settings8"
              :loading="loading8"
              :data-empty="dataEmpty8"
              :extend="chartExtend"
            ></ve-histogram>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import {
  GetFunctionLongTerm,
  GetAreaAndTrafficLongTerm,
  GetFunctionYOY,
  GetAreaAndTrafficYOY,
  GetFunctionRank,
  GetAreaAndTrafficRank,
  GetNoiseOver,
  GetMeasureDistribute
} from '@/api/manual-import'
import RangePicker from './RangePicker'
import AreaSelect from './AreaSelect'
import moment from 'moment'
export default {
  name: 'data-analyze',

  components: {
    RangePicker,
    AreaSelect
  },

  data() {
    return {
      grid: {
        bottom: 8
      },
      chartExtend: {
        series: {
          barWidth: 40,
          label: { show: true, position: 'top' },
          smooth: false
        },
        yAxis: {
          // minInterval: 1
        }
      },

      form1: {
        dateRange: ['2010-01-01 00:00:00', '2020-12-31 23:59:59'],
        DayOrNight: 0,
        ssq: ['甘肃省']
      },
      settings1: {
        labelMap: {
          LeqT: '噪声值'
        }
      },
      data1: {
        columns: ['MeasureName', 'LeqT'],
        rows: []
      },
      loading1: false,
      dataEmpty1: false,

      form2: {
        dateRange: ['2010-01-01 00:00:00', '2020-12-31 23:59:59'],
        DayOrNight: 0,
        DataType: 1,
        ssq: ['甘肃省']
      },
      settings2: {
        labelMap: {
          LeqT: '噪声值'
        }
      },
      data2: {
        columns: ['MeasureName', 'LeqT'],
        rows: []
      },
      loading2: false,
      dataEmpty2: false,

      form3: {
        YOYorNOL: 0,
        date: moment().startOf('day'),
        DayOrNight: 0,
        ssq: ['甘肃省']
      },
      settings3: {
        labelMap: {
          LeqT: '噪声值'
        }
      },
      data3: {
        columns: ['MeasureName', 'LeqT'],
        rows: []
      },
      loading3: false,
      dataEmpty3: false,

      form4: {
        DayOrNight: 0,
        DataType: 1,
        ssq: ['甘肃省']
      },
      settings4: {
        labelMap: {
          LeqT: '噪声值'
        }
      },
      data4: {
        columns: ['MeasureName', 'LeqT'],
        rows: []
      },
      loading4: false,
      dataEmpty4: false,

      form5: {
        date: moment().startOf('day'),
        DayOrNight: 0,
        FuncCode: 0,
        ssq: ['甘肃省']
      },
      settings5: {
        labelMap: {
          LeqT: '噪声值'
        }
      },
      data5: {
        columns: ['MeasureName', 'LeqT'],
        rows: []
      },
      loading5: false,
      dataEmpty5: false,

      form6: {
        year: new Date().getFullYear(),
        DayOrNight: 0,
        DataType: 1,
        ssq: ['甘肃省']
      },
      settings6: {
        labelMap: {
          LeqT: '噪声值'
        }
      },
      data6: {
        columns: ['MeasureName', 'LeqT'],
        rows: []
      },
      loading6: false,
      dataEmpty6: false,

      form7: {
        dateRange: ['2010-01-01 00:00:00', '2020-12-31 23:59:59'],
        DayOrNight: 0,
        ssq: ['甘肃省']
      },
      settings7: {
        labelMap: {
          OverCount: '超标次数'
        }
      },

      data7: {
        columns: ['MeasureName', 'OverCount'],
        rows: []
      },
      loading7: false,
      dataEmpty7: false,

      form8: {
        ssq: ['甘肃省']
      },
      settings8: {
        labelMap: {
          OverCount: '点位数'
        }
      },

      data8: {
        columns: ['MeasureName', 'OverCount'],
        rows: []
      },
      loading8: false,
      dataEmpty8: false
    }
  },

  mounted() {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
    this.getData5()
    this.getData6()
    this.getData7()
    this.getData8()
  },

  methods: {
    moment,

    getData1() {
      this.loading1 = true
      GetFunctionLongTerm({
        STime: this.form1.dateRange[0],
        ETime: this.form1.dateRange[1],
        DayOrNight: this.form1.DayOrNight,
        Province: this.form1.ssq[0] ? this.form1.ssq[0] : '',
        City: this.form1.ssq[1] ? this.form1.ssq[1] : '',
        District: this.form1.ssq[2] ? this.form1.ssq[2] : ''
      }).then(res => {
        this.data1.rows = JSON.parse(res.d)
        this.loading1 = false
        if (this.data1.rows.length == 0) {
          this.dataEmpty1 = true
        } else {
          this.dataEmpty1 = false
        }
      })
    },

    getData2() {
      this.loading2 = true
      GetAreaAndTrafficLongTerm({
        STime: this.form2.dateRange[0],
        ETime: this.form2.dateRange[1],
        DayOrNight: this.form2.DayOrNight,
        DataType: this.form2.DataType,
        Province: this.form2.ssq[0] ? this.form2.ssq[0] : '',
        City: this.form2.ssq[1] ? this.form2.ssq[1] : '',
        District: this.form2.ssq[2] ? this.form2.ssq[2] : ''
      }).then(res => {
        this.data2.rows = JSON.parse(res.d)
        this.loading2 = false
        if (this.data2.rows.length == 0) {
          this.dataEmpty2 = true
        } else {
          this.dataEmpty2 = false
        }
      })
    },

    getData3() {
      this.loading3 = true
      GetFunctionYOY({
        YOYorNOL: this.form3.YOYorNOL,
        STime: this.form3.date.format('YYYY-MM-DD HH:mm:ss'),
        DayOrNight: this.form3.DayOrNight,
        Province: this.form3.ssq[0] ? this.form3.ssq[0] : '',
        City: this.form3.ssq[1] ? this.form3.ssq[1] : '',
        District: this.form3.ssq[2] ? this.form3.ssq[2] : ''
      }).then(res => {
        this.data3.rows = JSON.parse(res.d)
        this.loading3 = false
        if (this.data3.rows.length == 0) {
          this.dataEmpty3 = true
        } else {
          this.dataEmpty3 = false
        }
      })
    },

    getData4() {
      this.loading4 = true
      GetAreaAndTrafficYOY({
        DayOrNight: this.form4.DayOrNight,
        DataType: this.form4.DataType,
        Province: this.form4.ssq[0] ? this.form4.ssq[0] : '',
        City: this.form4.ssq[1] ? this.form4.ssq[1] : '',
        District: this.form4.ssq[2] ? this.form4.ssq[2] : ''
      }).then(res => {
        this.data4.rows = JSON.parse(res.d)
        this.loading4 = false
        if (this.data4.rows.length == 0) {
          this.dataEmpty4 = true
        } else {
          this.dataEmpty4 = false
        }
      })
    },

    getData5() {
      this.loading5 = true
      GetFunctionRank({
        STime: this.form5.date.format('YYYY-MM-DD HH:mm:ss'),
        DayOrNight: this.form5.DayOrNight,
        FuncCode: this.form5.FuncCode,
        Province: this.form5.ssq[0] ? this.form5.ssq[0] : '',
        City: this.form5.ssq[1] ? this.form5.ssq[1] : '',
        District: this.form5.ssq[2] ? this.form5.ssq[2] : ''
      }).then(res => {
        this.data5.rows = JSON.parse(res.d)
        this.loading5 = false
        if (this.data5.rows.length == 0) {
          this.dataEmpty5 = true
        } else {
          this.dataEmpty5 = false
        }
      })
    },

    getData6() {
      this.loading6 = true
      GetAreaAndTrafficRank({
        year: this.form6.year,
        DayOrNight: this.form6.DayOrNight,
        DataType: this.form6.DataType,
        Province: this.form6.ssq[0] ? this.form6.ssq[0] : '',
        City: this.form6.ssq[1] ? this.form6.ssq[1] : ''
      }).then(res => {
        this.data6.rows = JSON.parse(res.d)
        this.loading6 = false
        if (this.data6.rows.length == 0) {
          this.dataEmpty6 = true
        } else {
          this.dataEmpty6 = false
        }
      })
    },

    getData7() {
      this.loading7 = true
      GetNoiseOver({
        STime: this.form7.dateRange[0],
        ETime: this.form7.dateRange[1],
        DayOrNight: this.form7.DayOrNight,
        Province: this.form7.ssq[0] ? this.form7.ssq[0] : '',
        City: this.form7.ssq[1] ? this.form7.ssq[1] : ''
      }).then(res => {
        this.data7.rows = JSON.parse(res.d)
        this.loading7 = false
        if (this.data7.rows.length == 0) {
          this.dataEmpty7 = true
        } else {
          this.dataEmpty7 = false
        }
      })
    },

    getData8() {
      this.loading8 = true
      GetMeasureDistribute({
        Province: this.form8.ssq[0] ? this.form8.ssq[0] : '',
        City: this.form8.ssq[1] ? this.form8.ssq[1] : '',
        District: this.form8.ssq[2] ? this.form8.ssq[2] : ''
      }).then(res => {
        this.data8.rows = JSON.parse(res.d)
        this.loading8 = false
        if (this.data8.rows.length == 0) {
          this.dataEmpty8 = true
        } else {
          this.dataEmpty8 = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-card {
  margin-bottom: 24px;
}
</style>
