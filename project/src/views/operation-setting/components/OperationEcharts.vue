<template>
  <div class="operationEcharts">
    <a-modal
      title="系统信息"
      :visible="visible"
      :confirmLoading="loading"
      destroyOnClose
      centered
      :maskClosable="false"
      width="1100px"
      wrapClassName="CommonModalStyle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="operationContent">
        <a-form-model-item label="时间" style="margin-bottom: 24px">
            <a-select style="width: 188px" v-model="timeLei" placeholder="请选择">
              <a-select-option :value="1"> 小时 </a-select-option>
              <a-select-option :value="2"> 天</a-select-option>
              <a-select-option :value="3"> 月</a-select-option>
              <a-select-option :value="4"> 季</a-select-option>
              <a-select-option :value="5"> 年</a-select-option>
            </a-select>
        </a-form-model-item>
        <div class="echatrsArea">
            <div id="echartsLine1" ref="echartsLine1" class="echartsLine1"></div>

        </div>

      </div>



    </a-modal>
  </div>
</template>

<script>
// import { assignTask, auditTask } from '@/api/api'
import * as echarts from 'echarts';


export default {
  name: 'operationEcharts',

  components: {

  },

  props: ['visible', 'recordId'],

  data() {
    return {
      loading:false,
      timeLei:''
    }
  },
  created(){
    
  },
  watch:{
    visible(value){
      console.log(value+'1111111111')
      if(value){
        var chartDom = document.getElementById('echartsLine1');
          console.log(chartDom)
        setTimeout(()=> {
          var chartDom = document.getElementById('echartsLine1');
          console.log(chartDom)
          this.initEcharts()
        },0)
      }
    }
  },
  mounted(){
    this.$nextTick(()=> {
          // var timer=setInterval(()=> {
          //     var chartDom = document.getElementById('echartsLine1');
          //     console.log(chartDom)
          //     if(chartDom!==null){
          //       this.initEcharts()
          //       clearInterval(timer)
          //     }
          // },1000)
        
    })
  },
  methods: {
    handleOk(){
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.init()
    },
    init() {

    },
    initEcharts:function(){
      // var chartDom = document.getElementById('echartsLine1');
      // console.log(chartDom)
      console.log(this.$refs)
      var chartDom = this.$refs.echartsLine1;
      console.log(chartDom)
      // console.log(echarts)
      var myChart = echarts.init(chartDom);
      var option;
      option = {
          title: {
              text: '未来一周气温变化',
              subtext: '纯属虚构'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: ['最高气温', '最低气温']
          },
          toolbox: {
              show: true,
              feature: {
                  dataZoom: {
                      yAxisIndex: 'none'
                  },
                  dataView: {readOnly: false},
                  magicType: {type: ['line', 'bar']},
                  restore: {},
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
              type: 'value',
              axisLabel: {
                  formatter: '{value} °C'
              }
          },
          series: [
              {
                  name: '最高气温',
                  type: 'line',
                  data: [10, 11, 13, 11, 12, 12, 9],
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  },
                  markLine: {
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              },
              {
                  name: '最低气温',
                  type: 'line',
                  data: [1, -2, 2, 5, 3, 2, 0],
                  markPoint: {
                      data: [
                          {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                      ]
                  },
                  markLine: {
                      data: [
                          {type: 'average', name: '平均值'},
                          [{
                              symbol: 'none',
                              x: '90%',
                              yAxis: 'max'
                          }, {
                              symbol: 'circle',
                              label: {
                                  position: 'start',
                                  formatter: '最大值'
                              },
                              type: 'max',
                              name: '最高点'
                          }]
                      ]
                  }
              }
          ]
      };
      option && myChart.setOption(option);

    }
  },
}
</script>
<style lang="less" scoped>
.operationEcharts{

}
.operationContent{
  .echatrsArea{
    height: 600px;
    .echartsLine1{
      height: 300px;
      width: 500px;
    }
  }
}
</style>

