<template>
  <div class="task-manage">
    <NavTag></NavTag>
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>运维设置</a-breadcrumb-item>
        <a-breadcrumb-item>周期任务管理</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">
        <span>周期任务管理</span>
        <a-button type="primary" style="margin-left: 24px" @click="openComponent(3)">创建周期计划</a-button>

        <a-button type="primary" style="margin-left: 24px" @click="openComponent(0)">计划详情</a-button>
        <a-button type="primary" style="margin-left: 24px" @click="openComponent(2)">计划审批</a-button>
      </div>
    </div>

    <div class="page-common-content">
      <h1 style="margin-bottom: 16px" >周期任务表单</h1>
      <!-- 待执行表格 0 -->
      <a-table
        :columns="columnsTaskToSubmit0"
        :data-source="dataSource"
        :pagination="page1"
        :rowKey="(record) => record.id"
        :loading="tableLoading"
        @change="handleTableChange">
        <template slot="taskTypeCustom" slot-scope="_, record">
          {{record.planType == 1 ? '常规运维' : ''}}
          {{record.planType == 2 ? '仪器送检' : ''}}
          {{record.planType == 3 ? '校准器送检' : ''}}
        </template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.repeatCount}} {{record.repeatUnit | cycleFormat}}/次
        </template>
        <template slot="taskTypeCustom2" slot-scope="_, record">
          {{record.operatorList | userType1Format}} 
        </template>
        <template slot="taskTypeCustom3" slot-scope="_, record">
          {{record.operatorList | userType2Format}} 
        </template>
        <!-- <template slot="address" slot-scope="address">
          <a :href="`https://www.amap.com/search?query=${address}`" target="_blank">{{ address }}</a>
        </template> -->
        <template slot="action" slot-scope="text, record">
          <a-space>
            <!-- <a-button size="small" @click="handleMenuClick(record.id, '执行任务', record)">执行任务</a-button> -->
            <a-popconfirm
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')">
              <a-button size="small">删除</a-button>
            </a-popconfirm>
            <a-dropdown>
              <a-button size="small">· · ·</a-button>
              <a-menu slot="overlay">

                <a-menu-item @click="handleMenuClick(record.id, '详情')">
                  <a>任务详情</a>
                </a-menu-item>

                <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                  <a>审核记录</a>
                </a-menu-item>

                <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                  <a>操作记录</a>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>


      <!-- 新建运维任务 -->
      <!-- <OptionNewTask ref="newTask" :visible.sync="modalVisible" :pageKey="'任务'" :operate="operate" :recordId="recordId" :modalData="modalData" @goMeasPointPage="showMeasPointPage" @fetchData="fetchData" @openEditOperationTask="openComponent(1)"></OptionNewTask> -->
      <!-- 全部测点 -->
      <!-- <DetailMeasPoint :visible.sync="detailMeasPoinTVisible" :hasChooseMeasuresList="hasChooseMeasuresList" @detailMeasPointClick="goDetailMeasPoint"></DetailMeasPoint> -->
      <!-- 配置运维 -->
      <!-- <EditOperationTask :visible.sync="editOperationTaskVisible"></EditOperationTask> -->
      <!-- 任务详情 -->
      <!-- <OptionDetailTask :visible.sync="detailDrawerVisible" :recordId="recordId" /> -->
      <!-- 任务审批 -->
      <!-- <OptionApprovalTask :visible.sync="optionApprovalVisible" :recordId="recordId"></OptionApprovalTask> -->

      <!-- 新建周期计划 -->
      <OptionPlanTask ref="newTask" :visible.sync="OptionPlanTaskVisible" :pageKey="'运维计划'" :operate="operate" :recordId="recordId" :modalData="modalData" @goMeasPointPage="showMeasPointPage" @fetchData="fetchData" @openEditOperationTask="openComponent(1)"></OptionPlanTask>
      <!-- 周期计划详情 -->
      <OptionPlanDetailTask :visible.sync="detailDrawerVisible" :recordId="recordId" />


  
    
  
 
  
    </div>

  </div>
</template>

<script>
import {
  getFlowPlanList,

} from '@/api/api'
import OptionNewTask from './components/OptionNewTask';//新建运维任务
import OptionDetailTask from './components/OptionDetailTask';//运维任务详情
import DetailMeasPoint from './components/DetailMeasPoint';//全部测点
import EditOperationTask from './components/EditOperationTask';//配置运维
import OptionApprovalTask from './components/OptionApprovalTask';//审批运维任务


import OptionPlanTask from './components/OptionPlanTask';//新建周期计划
import OptionPlanDetailTask from './components/OptionPlanDetailTask';//周期计划详情



//待提交 0
const columnsTaskToSubmit0 = [
  {
    dataIndex: 'title',
    title: '任务标题',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务发布频率',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  {
    dataIndex: 'taskTypeCustom2',
    title: '主运维人员',
    scopedSlots: { customRender: 'taskTypeCustom2' },
  },
  {
    dataIndex: 'taskTypeCustom3',
    title: '备选运维人员',
    scopedSlots: { customRender: 'taskTypeCustom3' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'operation-manage',

  components: {
    OptionPlanTask,
    OptionPlanDetailTask,



    OptionNewTask,
    OptionDetailTask,
    DetailMeasPoint,
    EditOperationTask,
    OptionApprovalTask,

    
  },

  data() {
    return {
      dataSource:[],
      OptionPlanTaskVisible:false,


      page1: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '500'],
      },

      tableLoading: false,
      columnsTaskToSubmit0,
      countArr:[],
      type:0,
      

      modalVisible:false,
      operate:'',
      modalData:'',
      recordId:'',

      detailDrawerVisible:false,

      hasChooseMeasuresList:[],//全部测点展示
      detailMeasPoinTVisible:false,//全部测点

      editOperationTaskVisible:false,

      optionApprovalVisible:false,


      


    }
  },

  created() {
    this.fetchData()
  },
  mounted(){

  },
  watch: {

  },
  methods: {
    async fetchData() {
        this.tableLoading=true;
        var param ={
          current:1,
          size:10
        }
        getFlowPlanList(param).then(({ error, response }) => {
          if (error.code === 0) {
            console.log(response)
            this.dataSource=response.records;
            const pagination = { ...this.pagination };
            pagination.total = response.total;
            pagination.pageSize = 10;
            this.tableLoading = false;
            this.pagination = pagination;
            
          }
        })
     
    },
    handleTableChange(pagination, filters, sorter) {//分页
      this.tableLoading = true;
      getFlowPlanList({
        size: 10,
        current: pagination.current,
      }).then(({ error, response }) => {
          if (error.code === 0) {
            const pagination = { ...this.pagination };
            pagination.total = response.total;
            this.tableLoading = false;
            this.dataSource=response.records;
            this.pagination = pagination;
          }
      })
    },
    
    handleMenuClick:function(){

    },
    showMeasPointPage:function(list){
      this.hasChooseMeasuresList=list;
      this.detailMeasPoinTVisible=true;
    },
    goDetailMeasPoint:function(list){
      this.$refs.newTask.add(list)
    },
    openComponent(id){
      if(id==0){//任务详情
        this.detailDrawerVisible=true;
      }else if(id==1){//配置运维
        this.editOperationTaskVisible=true;
      }else if(id==2){//任务审批
        this.optionApprovalVisible=true;
      }else if(id==3){//新建计划
        this.OptionPlanTaskVisible=true;
        this.operate='新建';
      }
    }

    

   




    
   
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
</style>