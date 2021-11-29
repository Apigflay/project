<template>
  <div class="task-manage">
    <NavTag></NavTag>
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>运维设置</a-breadcrumb-item>
        <a-breadcrumb-item>运维管理</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">
        <span>运维管理</span>
        <a-button type="primary" style="margin-left: 24px" @click="clickAdd">创建任务</a-button>
        <a-button type="primary" style="margin-left: 24px" @click="openComponent(0)">任务详情</a-button>
        <a-button type="primary" style="margin-left: 24px" @click="openComponent(2)">任务审批</a-button>
      </div>
      <!-- 表头 -->
      <a-tabs v-model="type" :tabBarGutter="4" :animated="false" @change="callback">
        <a-tab-pane :key="0">
          <span slot="tab">待执行<a-badge :count="countArr[0]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="1">
          <span slot="tab">待审批<a-badge :count="countArr[1]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="2">
          <span slot="tab">待确认<a-badge :count="countArr[2]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="3">
          <span slot="tab">进行中<a-badge :count="countArr[3]" /> </span>
        </a-tab-pane>

      </a-tabs>
    </div>
    <div class="searchArea">
      <a-form :model="searchForm" layout="inline">

          <a-form-model-item label="测点名称" style="margin-bottom: 24px">
            <a-input v-model="searchForm.taskName" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item label="执行时间" >
            <a-range-picker
              v-model="searchForm.rangeDate"
              :disabled-date="disabledDate"
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-model-item>

          <a-form-model-item label="任务类型" >
            <a-select v-model="searchForm.taskType" placeholder="请选择" style="width:200px;">
              <a-select-option :value="0"> 是劳动法吉林省地方 </a-select-option>
              <a-select-option :value="1"> 分钟 </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="任务状态" v-if="type==3">
            <a-select v-model="searchForm.taskSubType" placeholder="请选择" style="width:200px;">
              <a-select-option :value="0"> 是劳动法吉林省地方 </a-select-option>
              <a-select-option :value="1"> 分钟 </a-select-option>
            </a-select>
          </a-form-model-item>





          <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
          </a-form-model-item>
        </a-form>
    </div>    
    <div class="page-common-content">
      <!-- 待执行表格 0 -->
      <a-table
        v-if="type === 0"
        :columns="columnsTaskToSubmit0"
        :data-source="dataSource[0]"
        :pagination="page1"
        :rowKey="(record) => record.id+type"
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
        <template slot="action" slot-scope="text, record">
          <a-space>
            <!-- <a-button size="small" @click="handleMenuClick(record.id, '执行任务', record)">执行任务</a-button> -->
            <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')">
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm>
            <a-button v-else  size="small" disabled>拒绝任务</a-button>

            <!-- <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')"
            >
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm> -->

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

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>
      <!-- 待审批 1 -->
      <a-table
        v-if="type === 1"
        :columns="columnsTaskToSubmit0"
        :data-source="dataSource[1]"
        :pagination="page1"
        :rowKey="(record) => record.id+type"
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
        <template slot="action" slot-scope="text, record">
          <a-space>
            <!-- <a-button size="small" @click="handleMenuClick(record.id, '执行任务', record)">执行任务</a-button> -->
            <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')">
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm>
            <a-button v-else  size="small" disabled>拒绝任务</a-button>

            <!-- <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')"
            >
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm> -->

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

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>
      <!-- 待审批 2 -->
      <a-table
        v-if="type === 2"
        :columns="columnsTaskToSubmit0"
        :data-source="dataSource[2]"
        :pagination="page1"
        :rowKey="(record) => record.id+type"
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
        <template slot="action" slot-scope="text, record">
          <a-space>
            <!-- <a-button size="small" @click="handleMenuClick(record.id, '执行任务', record)">执行任务</a-button> -->
            <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')">
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm>
            <a-button v-else  size="small" disabled>拒绝任务</a-button>

            <!-- <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')"
            >
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm> -->

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

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>
      <!-- 待审批 3 -->
      <a-table
        v-if="type === 3"
        :columns="columnsTaskToSubmit0"
        :data-source="dataSource[3]"
        :pagination="page1"
        :rowKey="(record) => record.id+type"
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
        <template slot="action" slot-scope="text, record">
          <a-space>
            <!-- <a-button size="small" @click="handleMenuClick(record.id, '执行任务', record)">执行任务</a-button> -->
            <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')">
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm>
            <a-button v-else  size="small" disabled>拒绝任务</a-button>

            <!-- <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')"
            >
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm> -->

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

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>

      <!-- 新建运维任务 -->
      <OptionNewTask ref="newTask" :visible.sync="modalVisible" :pageKey="'任务'" :operate="operate" :recordId="recordId" :modalData="modalData" @goMeasPointPage="showMeasPointPage" @fetchData="fetchData" @openEditOperationTask="openComponent(1)"></OptionNewTask>
      <!-- 全部测点 -->
      <DetailMeasPoint :visible.sync="detailMeasPoinTVisible" :hasChooseMeasuresList="hasChooseMeasuresList" @detailMeasPointClick="goDetailMeasPoint"></DetailMeasPoint>
      <!-- 配置运维 -->
      <EditOperationTask :visible.sync="editOperationTaskVisible"></EditOperationTask>
      <!-- 任务详情 -->
      <OptionDetailTask :visible.sync="detailDrawerVisible" :recordId="recordId" />
      <!-- 任务审批 -->
      <OptionApprovalTask :visible.sync="optionApprovalVisible" :recordId="recordId"></OptionApprovalTask>


  
    
  
 
  
    </div>

  </div>
</template>

<script>
import {
  getFlowTaskPage,//首页分页查询
  } from '@/api/api'
import OptionNewTask from './components/OptionNewTask';//新建运维任务
import OptionDetailTask from './components/OptionDetailTask';//运维任务详情
import DetailMeasPoint from './components/DetailMeasPoint';//全部测点
import EditOperationTask from './components/EditOperationTask';//配置运维
import OptionApprovalTask from './components/OptionApprovalTask';//审批运维任务

import moment from 'moment';






//待提交 0
const columnsTaskToSubmit0 = [
  {
    dataIndex: 'taskTitle',
    title: '任务编号',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '仪器型号',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  {
    dataIndex: 'taskTypeCustom2',
    title: '仪器编号',
    scopedSlots: { customRender: 'taskTypeCustom2' },
  },
  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },

  {
    dataIndex: 'measure.address',
    title: '测量地点',
    scopedSlots: { customRender: 'address' },
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
    OptionNewTask,
    OptionDetailTask,
    DetailMeasPoint,
    EditOperationTask,
    OptionApprovalTask
  },

  data() {
    return {
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
      dataSource:[],

      modalVisible:false,
      operate:'',
      modalData:'',
      recordId:'',

      detailDrawerVisible:false,

      hasChooseMeasuresList:[],//全部测点展示
      detailMeasPoinTVisible:false,//全部测点

      editOperationTaskVisible:false,

      optionApprovalVisible:false,

      searchForm:{
        taskName:'',
        rangeDate:[],
        taslType:'',
        taskSubType:''
      },


      


    }
  },

  created() {
    this.fetchData()
    if(this.getUrlParams('type')!=null){
      this.type=Number(this.getUrlParams('type'));
    }
  },
  mounted(){

  },
  watch: {

  },
  methods: {
    moment,
    async fetchData(code) {
      if(code!=1){
        this.tableLoading = true
      }
      // 运行中：EXECUTING；
      // 待审核；AUDITING
      // 待确认: CONFIRMING;
      // 已完成：COMPLETED；

      // 已过期：OVERDUE；
      let promises = ['EXECUTING', 'AUDITING', 'CONFIRMING', 'COMPLETED'].map((type) =>
        getFlowTaskPage({
          size: 500,
          current: 1,
          // statusEnums: [type],
        }),
      )
      let result = await Promise.all(promises)
      console.log(result)
      result.forEach((item, index) => {
        if (item.error.code === 0) {
          if(code==1){
            // this.countArr[index] = item.response.total
            // this.dataSource[index] = item.response.records
            // this.total[index] = item.response.total
          }else{
            // this.countArr[index] = item.response.total
            // this.dataSource[index] = item.response.records
            // this.total[index] = item.response.total
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
      this.modalVisible=true;
      this.operate='新建';
      // this.detailDrawerVisible=true;
    },
    callback:function(key){
      this.searchForm={
        taskName:'',
        rangeDate:[],
        taslType:'',
        taskSubType:''
      }
    },
    handleTableChange:function(){

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
      }
    },
    clickSearch(){

    },
    clickReset(){

    },
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days')
      // message.error('最多添加三个')
    },
    getUrlParams(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let param = window.location.search.substr(1).match(reg);
    return param && param[2];
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
.searchArea{
  margin: 24px;
  padding:24px;
  background:#fff;
}
</style>