<template>
  <div class="task-manage">
    <NavTag></NavTag>
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>运维设置</a-breadcrumb-item>
        <a-breadcrumb-item>运维管理</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="page-common-content">
      <a-form layout="inline" class="formPadding">

        <a-form-model-item label="区域" style="margin-bottom: 24px">
            <a-select style="width: 188px" v-model="isShowDeStatus" placeholder="请选择">
              <a-select-option :value="1"> 显示 </a-select-option>
              <a-select-option :value="0"> 不显示</a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="时间" style="margin-bottom: 24px">
            <a-select style="width: 188px" v-model="timeLei" placeholder="请选择">
              <a-select-option :value="1"> 小时 </a-select-option>
              <a-select-option :value="2"> 天</a-select-option>
              <a-select-option :value="3"> 月</a-select-option>
              <a-select-option :value="4"> 季</a-select-option>
              <a-select-option :value="5"> 年</a-select-option>
            </a-select>
        </a-form-model-item>



        <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
        </a-form-model-item>
      </a-form>
      <div class="operationTaskArea">
        <p class="title">运维任务</p>
        <div class="operationTaskPerBox">
          <div class="operationTaskPer" v-for="(item,index) in operationTextData" :key="index">
              <p @click="goPages(1,index)">{{item.text}} <a-icon v-if="index!=3" type="right" /></p>
              <p class="num">{{item.num}}</p>
          </div>
        </div>
      </div>
      <div class="operationSystemArea" @click="goPages(0)">
        <p class="title"><span >系统 <a-icon type="right" /></span> </p>
        <div class="operationSystemPerBox">
          <div class="operationSystemPer" v-for="(item,index) in operationSystemData" :key="index">
              <p >{{item.text}}</p>
              <div class="systemEcharts" :id="'systemEcharts'+index"></div>
          </div>
        </div>
      </div>
      <div class="operationTatle">
        <p class="title">在线/采集率</p>
        <div class="tableTotalTip">
          <a-icon style="color:rgba(145, 213, 255, 1);" type="info-circle" />
          <span>当前在线数:6/7</span>
          <span>总在线率 50%</span>
          <span>总采集率 50%</span>
        </div>
        <a-table
          :columns="columnsTaskToSubmit0"
          :data-source="dataSource[0]"
          :pagination="page1"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          @change="handleTableChange">
          <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
          <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
          <template slot="taskTypeCustom" slot-scope="_, record">{{
            record.routineType == null ? '非常规任务' : '常规任务'
          }}</template>
          <template slot="taskTypeCustom1" slot-scope="_, record">
            {{record.routineType == 0 ? '功能区噪声测量' : ''}}
            {{record.routineType == 1 ? '区域噪声测量' : ''}}
            {{record.routineType == 2 ? '交通噪声测量' : ''}}
            {{record.routineType == null ? record.nonRoutineName : ''}}
          </template>
          <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
          <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->
          <template slot="address" slot-scope="address">
            <a :href="`https://www.amap.com/search?query=${address}`" target="_blank">{{ address }}</a>
          </template>
        </a-table>

      </div>
      <!-- //:visible.sync="operationEchatrsStatus" -->
      <OperationEchatrs :visible.sync="operationEchatrsStatus" ></OperationEchatrs>
      
    

    </div>

  </div>
</template>

<script>
import {} from '@/api/api';
import * as echarts from 'echarts';
import moment from 'moment';
import OperationEchatrs from './components/OperationEcharts.vue';

const columnsTaskToSubmit0 = [
  {
    dataIndex: 'taskTitle',
    title: '测点名称',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '状态',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '在线率',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  {
    dataIndex: 'taskTypeCustom2',
    title: '采集率',
    scopedSlots: { customRender: 'taskTypeCustom2' },
  },
]
export default {
  name: 'option-manage',

  components: {
    OperationEchatrs
  },

  data() {
    return {
      operationTextData:[{text:'待执行',num:12},{text:'待审核',num:12},{text:'待确认',num:12},{text:'已过期',num:12}],
      operationSystemData:[{text:'CPU: 45%',num:2},{text:'CPU: 45%',num:2},{text:'CPU: 45%',num:2},{text:'CPU: 45%',num:2}],
      isShowDeStatus:'',
      timeLei:'',

      page1: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '500'],
      },
      columnsTaskToSubmit0,
      tableLoading: false,
      dataSource:[],

      operationEchatrsStatus:false,
      

      


    }
  },

  created() {
    // this.fetchData()
  },
  mounted(){
    // this.initEcharts()
  },
  watch: {

  },
  methods: {
      moment,
    async fetchData(code) {
      if(code!=1){
        this.tableLoading = true
      }
      let promises = [0, 7, 2, 3, 4, 5, 6, 8].map((type) =>
        getHomeTaskList({
          page: {
            size: 100000,
            current: 1,
          },
          keys: {
            type,
          },
        },type),
      )
      let result = await Promise.all(promises)
      // console.log(result)
      result.forEach((item, index) => {
        if (item.error.code === 0) {
          if(code==1){
            this.countArr[index] = item.response.total
            // this.dataSource[index] = item.response.records
            // this.total[index] = item.response.total
          }else{
            this.countArr[index] = item.response.total
            this.dataSource[index] = item.response.records
            this.total[index] = item.response.total
          }
          
        }
      })
      this.tableLoading = false
      // if(this.isTolongSub){
      //   let index = this.dataSource[this.type].findIndex((item) => item.id === this.outnerIndex)
      //   if(index!=-1){
      //     this.handleExpand(true,result[this.type].response.records[index])
      //   }
      // }
    },
    clickAdd:function(){

    },
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days')
    },
    clickSearch:function(){

    },
    clickReset:function(){

    },
    initEcharts:function(){
      var chartDom = document.getElementById('systemEcharts0');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
          xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
          }]
      };

      option && myChart.setOption(option);
    },
    handleTableChange:function(){

    },
    handleMenuClick:function(){

    },
    goPages(pageid,index){
      if(pageid==0){//系统
        this.operationEchatrsStatus=true;
      }else if(pageid==1){
        if(index!=3){
          this.$router.push('/operation-setting/operation-manage?type='+index)
        }
      }
    },
    

   




    
   
  },
  beforeDestroy() {
    // clearInterval(this.timer);        
    // this.timer = null;
  }
}
</script>


<style lang="less" scoped>
/deep/ .ant-tabs-bar {
  margin: 0;
  border-bottom: 1px solid #fff;
}
/deep/ .ant-badge {
  transform: translate(4px, -2px);
}

/deep/ .ant-table-expanded-row {
  background-color: white;
}

.page-common-content{
  background: #F0F2F5;
  margin:0px;
  .operationTaskArea{
    background: #fff;
    padding: 10px;
    .title{
      color:#000;
    }
    .operationTaskPerBox{
      display: flex;
      color: rgba(0, 0, 0, 0.427450980392157);
      padding-left: 30px;
      .operationTaskPer{
        margin-right: 200px;
        p{
          cursor: pointer;
        }
        .num{
          font-size: 30px;
          color: rgba(0, 0, 0, 0.847058823529412);
        }
      }
    }
  }
  .operationSystemArea{
    background: #fff;
    margin-top: 20px;
    padding: 10px;
    .title{
      color:#000;
      span{
        cursor: pointer;
      }
    }
    .operationSystemPerBox{
      display: flex;
      padding-left: 5px;
      .operationSystemPer{
        width:300px;
        .systemEcharts{
          width: 300px;
          height: 60px;
        }
      }
    }
  }
  .operationTatle{
    background: #fff;
    margin-top: 20px;
    padding: 10px;
    .tableTotalTip{
      line-height: 26px;
      border: 1px solid rgba(145, 213, 255, 1);
      padding: 0 10px;
      border-radius: 8px;
      margin-bottom: 10px;
      span{
        margin-left: 10px;
      }
    }
  }
}



</style>