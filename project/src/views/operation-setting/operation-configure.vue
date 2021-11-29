<template>
  <div class="task-manage">
    <NavTag></NavTag>
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>运维设置</a-breadcrumb-item>
        <a-breadcrumb-item>常规运维表单配置</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">
        <span>常规运维表单配置</span>
        <a-button type="primary" style="margin-left: 24px" @click="openComponent(0)">创建运维表单</a-button>
        <a-button type="primary" style="margin-left: 24px" @click="openComponent(1)">管理运维项目</a-button>
        <!-- <a-button type="primary" style="margin-left: 24px" @click="openComponent(2)">添加</a-button> -->
      </div>

    </div>
    <div class="page-common-content">
        <h1 style="margin-bottom: 16px" >常规运维表单</h1>
        <a-table
            :columns="columnsGroupTask6"
            :data-source="dataSource"
            :pagination="page"
            :rowKey="(record) => record.id"
            :loading="tableLoading"
            @change="handleTableChange"
            @expand="handleExpand">
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
            <template slot="subTaskSummary" slot-scope="subTaskSummary">
            <a-popover title="子任务统计" v-if="subTaskSummary">
                <template slot="content">
                <span style="display: inline-block; width: 88px; color: #9b9b9b"
                    >待审核:{{ subTaskSummary.auditing }}
                </span>
                <span style="color: #9b9b9b">待提交:{{ subTaskSummary.executing }}</span>
                <br />

                <span style="display: inline-block; width: 88px; color: #9b9b9b"
                    >待指派:{{ subTaskSummary.waitDesignating }}
                </span>
                <span style="color: #9b9b9b">待接收:{{ subTaskSummary.waitReceiving }}</span>
                <br />

                <span style="display: inline-block; width: 88px; color: #9b9b9b"
                    >已完成:{{ subTaskSummary.completed }}
                </span>
                <span style="color: #9b9b9b">已过期:{{ subTaskSummary.overdue }}</span>
                <br />

                <span style="display: inline-block; width: 88px; color: #9b9b9b"
                    >已拒绝:{{ subTaskSummary.refused }}
                </span>
                <span style="color: #9b9b9b">已撤销:{{ subTaskSummary.revoked }}</span>
                </template>
                <span style="padding: 0px 19px; color: #1bd39b">{{ subTaskSummary.sum }}</span>
            </a-popover></template
            >
            <template slot="action" slot-scope="text, record">
            <a-space>
                <a-button
                size="small"
                v-if="type === 6 && record.taskStatus === 'COMPLETED'"
                @click="handleMenuClick(record.id, '导出报表', record)"
                >导出报表</a-button
                >

                <!-- <a-button
                size="small"
                v-if="type === 2 && record.taskStatus === 'AUDITING'"
                @click="handleMenuClick(record.id, '审批', record)"
                >审批任务</a-button
                > -->
            </a-space>
            </template>
            <!-- 子任务表格 -->
            <template slot="expandedRowRender" slot-scope="record">
            <div style="display: flex; justify-content: space-between">
                <h1>运维项目</h1>
            </div>
            <a-table
                :loading="subTableLoading"
                :columns="columnsSubTask6"
                :data-source="record.subTaskList"
                :rowKey="(record) => record.id"
                :pagination="false"
                style="margin: 12px 0px"
                size="small">
                <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>

                <template slot="action" slot-scope="text, record">
                <a-space>
                    <!-- <a-button size="small" @click="handleMenuClick(record.id, '详情')">查看详情</a-button> -->
                    <a-dropdown>
                    <a-button size="small">· · ·</a-button>
                    <a-menu slot="overlay">
                        <a-menu-item @click="handleMenuClick(record.id, '测量数据',record)">
                        <a>测量数据</a>
                        </a-menu-item>

                        <a-menu-item @click="handleMenuClick(record.id, '详情')">
                        <a>任务详情</a>
                        </a-menu-item>

                        <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                        <a>审核记录</a>
                        </a-menu-item>

                        <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                        <a>操作记录</a>
                        </a-menu-item>
                        <a-menu-item v-if="type === 6 && record.taskStatus === 'COMPLETED'" @click="handleMenuClick(record.id, '导出报表',record)">
                        <a>导出报表</a>
                        </a-menu-item>
                    </a-menu>
                    </a-dropdown>
                </a-space>
                </template>
            </a-table>
            </template>

            
        </a-table> 

    <!-- 创建运维表单 -->
    <OptionConfigTask :visible.sync="OptionConfigTaskVisible" :pageKey="'运维表单'" :operate="operate" ></OptionConfigTask>
    <!-- 管理运维项目 -->
    <OptionConfigEdit :visible.sync="OptionConfigEditVisible" :pageKey="'运维表单'" :operate="operate" @openComponent="openConfigProject"></OptionConfigEdit>
    <!-- 添加运维项目 -->
    <OptionConfigProject :visible.sync="OptionConfigProjectVisible" :pageKey="'运维表单'" :operate="operate"></OptionConfigProject>
    </div>

  </div>
</template>

<script>
import {
  getFlowPlanList,

} from '@/api/api'



import OptionConfigTask from './components/OptionConfigTask';//创建运维表单
import OptionConfigEdit from './components/OptionConfigEdit';//管理运维项目
import OptionConfigProject from './components/OptionConfigProject';//添加运维项目



const columnsGroupTask6 = [
  {
    dataIndex: 'taskTitle',
    title: '运维表单名称',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '运维项目数量',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
const columnsSubTask6 = [
  {
    dataIndex: 'id',
    title: '项目序号',
  },
  {
    dataIndex: 'measure.measureName',
    title: '项目标题',
  },
  {
    dataIndex: 'measure.address',
    title: '备注',
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
      OptionConfigTask,
      OptionConfigEdit,
      OptionConfigProject
  },

  data() {
    return {
        columnsGroupTask6,
        columnsSubTask6,
        dataSource:[],
        page:{
            current: 1,
            pageSize: 10,
            total: 0,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '100', '500'],
        },
        tableLoading:false,

        OptionConfigTaskVisible:false,
        OptionConfigEditVisible:false,
        OptionConfigProjectVisible:false,
        operate:'',


    }
  },

  created() {
    // this.fetchData()
  },
  mounted(){

  },
  watch: {

  },
  methods: {
    async fetchData() {
        
        getFlowPlanList().then(({ error, response }) => {
          if (error.code === 0) {
            console.log(response)
            // function deleteObjKey(obj){
            //   if(obj.children.length==0){
            //     delete obj.children;
            //   }else{
            //     obj.children.forEach(function(item,index){
            //       if(item.children.length==0){
            //         delete item.children;
            //       }else{
            //         deleteObjKey(item)
            //       }
            //     })
            //   }
            // }
            // deleteObjKey(response)
            // // console.log(response)
            // this.options.push(response)
            // this.deId=response.id;
            // // this.caValue=[response.departmentName];
          }
        })
     
    },
    openComponent(id,index){
        console.log(id,index)
      if(id==0){//创建运维表单
        this.OptionConfigTaskVisible=true;
        this.operate="创建";
      }else if(id==1){//配置运维项目
        this.OptionConfigEditVisible=true;
      }else if(id==2){//添加运维项目
        this.OptionConfigProjectVisible=true;
      }
    },
    handleTableChange(){

    },
    handleExpand(){

    },
    handleMenuClick(){

    },
    openConfigProject(id){
        this.OptionConfigProjectVisible=true;
        console.log(id)
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