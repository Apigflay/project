<template>
  <div class="DetailDrawer">
    <a-drawer width="555" :title="operate + pageKey" :visible="visible" :closable="true" @close="handleClose">
      <div class="d_title">基本信息</div>
      <!-- 任务表单 -->
      <a-form-model :model="formTask" :rules="rulesTask" ref="refForm">
        <a-form-model-item label="任务类型" prop="taskType">
          <a-radio-group @change="taskTypeChange" v-if="this.operate === '创建'" v-model="formTask.taskType">
            <a-radio-button :value="0"> 常规任务 </a-radio-button>
            <a-radio-button :value="1"> 非常规任务 </a-radio-button>
          </a-radio-group>
          <span v-if="this.operate === '修改'">{{ formTask.taskType === 0 ? '常规任务' : '非常规任务' }}</span>
        </a-form-model-item>

        <a-form-model-item label="任务标题" prop="taskTitle">
          <a-input v-model="formTask.taskTitle" placeholder="请输入" />
        </a-form-model-item>

        <!-- <a-form-model-item label="时间" prop="rangeDate">
          <a-range-picker v-model="formTask.rangeDate" :disabled-date="disabledDate" />
        </a-form-model-item> -->
        <a-form-model-item label="时间" prop="rangeDate">
          <a-range-picker
            v-model="formTask.rangeDate"
            :disabled-date="disabledDate"
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-model-item>

        <!-- 常规任务 -->
        <div v-if="formTask.taskType === 0">
          <a-form-model-item label="监测数据类型" prop="routineType">
            <a-select @change="clickReset" v-model="formTask.routineType" placeholder="请选择">
              <a-select-option :value="0"> 功能区噪声测量 </a-select-option>
              <a-select-option :value="1"> 区域噪声测量 </a-select-option>
              <a-select-option :value="2"> 交通噪声测量 </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="formTask.routineType === 1 || formTask.routineType === 2"
            label="测量时间段"
            extra="结束时间必须大于开始时间"
          >
            <template >
                <a-space v-for="(item,index) in formTask.rangeTimeList" :key="index">
                  <a-time-picker
                    v-model="item.rangeStart"
                    :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                    valueFormat="HH:mm:ss"
                    placeholder="开始时间"
                  />
                  <span>~</span>
                  <a-time-picker
                    v-model="item.rangeEnd"
                    :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                    valueFormat="HH:mm:ss"
                    placeholder="结束时间"
                  />
                </a-space>
            </template>
            <br><a-button @click="addTimePicker" type="primary" icon="plus">添加</a-button>
            <a-button style="margin-left:20px;" @click="reduceTimePicker" type="primary" icon="minus">删除</a-button>
          </a-form-model-item>
        </div>

        <!-- 非常规任务 -->
        <div v-if="formTask.taskType === 1">
          <a-form-model-item label="监测数据类型名称" prop="nonroutineName">
            <a-input v-model="formTask.nonroutineName" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="数据提交类型" prop="dataSubmitType">
            <a-select v-model="formTask.dataSubmitType" placeholder="请选择">
              <a-select-option :value="0"> 瞬时 </a-select-option>
              <a-select-option :value="1"> 分钟 </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>

        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="formTask.remark" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>

      <!-- 测点选择 -->
      <div class="d_point"><span><span class="d_pointX">*</span>选择测点</span> <span @click="goAllMeasPointPage" class="d_blue">已选测点({{operate=='修改'?formTask.measuresList.length:hasChooseMeasuresList.length}}个)</span></div>
      <a-form :model="searchForm" layout="inline">
        <div class="d_search"><div>部门</div><div class="d_searchInput">搜索</div></div>
        <a-form-model-item label="" style="margin-bottom: 24px;width:200px;">
          <a-cascader
              v-model="cascaderValue"
              :defaultValue='caValue'
              :options="options"
              placeholder="请选择"
              change-on-select
              :fieldNames="fieldNames"
              style="width: 100%"
              @change="onChange"
              :allowClear="false"
              v-if="loading === false"
            />
        </a-form-model-item>

        <a-form-model-item label="" style="margin-bottom: 24px;width:200px;">
          <a-input v-model="keyWords" placeholder="请输入" allowClear></a-input>
        </a-form-model-item>
        <div class="d_search"><div>下级部门</div></div>
        <a-form-model-item label="" style="margin-bottom: 24px">
            <a-select style="width: 188px" v-model="isShowDeStatus" placeholder="请选择">
              <a-select-option :value="1"> 显示 </a-select-option>
              <a-select-option :value="0"> 不显示</a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item style="margin-bottom: 24px;">
          <a-button @click="clickReset" style="margin-left: 58px;margin-right: 20px;">重置</a-button>
          <a-button type="primary" @click="clickSearch" >查询</a-button>
        </a-form-model-item>
      </a-form>
      <div class="d_content">
        <span>
          <a-icon type="exclamation-circle" style="color:#108ee9;" />
          共{{measuresList.length}}个测点
        </span>
        
        <span>
          <a-button @click="clickNoChoose" style="margin-left: 58px;margin-right: 20px;">全不选</a-button>
          <a-button type="primary" @click="clickAllChoose" >全选</a-button>
        </span>
      </div>
      <!-- table -->
      <a-table
        :columns="columnsGroupTask6"
        :data-source="measuresList"
        :pagination="pagination"
        :rowKey="(record) => record.id"
        :loading="tableLoading"
        @change="handleTableChange">
        <template slot="address" slot-scope="address">
          <a :href="`https://www.amap.com/search?query=${address}`" target="_blank">{{ address }}</a>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="handleMenuClick(record.id, '添加', record)">添加</a-button>
          </a-space>
        </template>
      </a-table> 
      <!-- 发布 -->
      <div class="d_submitBtn">
        <a-button type="primary" @click="goSubmitTask" >确定</a-button>
        <a-button @click="handleClose" style="margin-right: 20px;">取消</a-button>
      </div>




    </a-drawer>
  </div>
</template>

<script>
import { getDepartmentTree,getConditionMeasureList,createNormalTask,createUnnormalTask,getPointListById,updateTask,     getTaskDetail } from '@/api/api';
import moment from 'moment';
import PointSelect from '@/views/manage-set-nb/components/PointSelect';
import message from 'ant-design-vue/es/message';
//任务rules
const rulesTask = {
  taskType: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  taskTitle: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 60,
      message: '最大长度60个字符',
      trigger: 'blur',
    },
  ],
  remark: [
    {
      required: false,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 60,
      message: '最大长度60个字符',
      trigger: 'blur',
    },
  ],
  rangeDate: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  routineType: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  measuresList: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  nonroutineName: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 60,
      message: '最大长度60个字符',
      trigger: 'blur',
    },
  ],
  dataSubmitType: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
}
const columnsGroupTask6 = [
  {
    dataIndex: 'measureName',
    title: '测点名称',
  },

  {
    dataIndex: 'measureCode',
    title: '测点编号',
    scopedSlots: { customRender: 'measureCode' },
  },
  {
    dataIndex: 'address',
    title: '测点地址',
    scopedSlots: { customRender: 'address' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },

]
export default {
  name: 'NewTask',
  props: ['visible','pageKey','operate','modalData', 'recordId'],
  components: {
    PointSelect,
  },
  data() {
    return {
      // loading: false,
      rulesTask,//任务校验规则
      formTask: {//新建
        taskType: 0,
        taskTitle: '',
        remark: '',
        rangeDate: [],
        routineType: undefined, //监测数据类型
        rangeTimeList:[{rangeStart:'',rangeEnd:''},],
        rangeStart1: '',
        rangeEnd1: '',
        rangeStart2: '',
        rangeEnd2: '',
        rangeStart3: '',
        rangeEnd3: '',
        measuresList: [],
        nonroutineName: '',
        dataSubmitType: undefined,
      },
      searchForm:{
        department:{},
        keyWords:'',
        downDepartment:{}
      },

      fieldNames: { label: 'departmentName', value: 'id', children: 'children' },
      options: [],
      deId:0,//部门id
      loading: false,
      isShowDeStatus:1,//是否显示下级部门
      keyWords:'',//关键字搜索
      measuresList:[],//测点列表----表格展示
      pagination:{},
      tableLoading:false,
      columnsGroupTask6,
      hasChooseMeasuresList:[],//已选择测点列表
      caValue:[],
      cascaderValue:[],

    }
  },
  created(){
    console.log('component created')
  },
  mounted(){
    console.log('component mounted')
  },
  watch: {
    visible(value) {
      if (value === true) {
        console.log(this.visible)
        console.log(this.pageKey)
        console.log(this.operate)
        console.log(this.modalData)
        console.log(this.recordId)
        //获取部门列表
        getDepartmentTree().then(({ error, response }) => {
          if (error.code === 0) {
            function deleteObjKey(obj){
              if(obj.children.length==0){
                delete obj.children;
              }else{
                obj.children.forEach(function(item,index){
                  if(item.children.length==0){
                    delete item.children;
                  }else{
                    deleteObjKey(item)
                  }
                })
              }
            }
            deleteObjKey(response)
            // console.log(response)
            this.options.push(response)
            this.deId=response.id;
            // this.caValue=[response.departmentName];
          }
        })
        if (this.operate === '创建') {

        }else if(this.operate === '修改'){
                      // this.formTask = {
            //   ...this.modalData,
            // }
            this.modalData.routineType == null ? (this.formTask.taskType = 1) : (this.formTask.taskType = 0)
            this.formTask.taskTitle = this.modalData.taskTitle
            this.formTask.routineType = this.modalData.routineType
            this.formTask.dataSubmitType = this.modalData.dataSubmitType
            this.formTask.remark = this.modalData.remark
            this.formTask.rangeDate = [
              moment(Number(this.modalData.startTime)),
              moment(Number(this.modalData.stopTime)),
            ]
            this.formTask.nonroutineName = this.modalData.nonRoutineName

            if (this.modalData.timeRanges != null) {
              this.formTask.rangeTimeList=this.modalData.timeRanges;
            }

            if (this.modalData.measurePoints != null) {
              this.formTask.measuresList = this.modalData.measurePoints
            } else {
              this.formTask.measuresList = [this.modalData.measure.id]
            }
            this.formTask.id = this.modalData.id
            getPointListById({
              ids:this.modalData.measurePoints

            }).then(({ error, response }) => {
                if (error.code === 0) {
                  console.log(response)
                  this.hasChooseMeasuresList=response.dataList;
                }
            })
        }
      }
    },
    hasChooseMeasuresList(newValue,oldValue){
      console.log(newValue)
      console.log(oldValue)
      if(newValue.length==0){
        this.formTask.measuresList=[];
      }else{
        this.formTask.measuresList=[];
        // console.log(this.formTask.measuresList)
        newValue.forEach((item,index) =>{
          this.formTask.measuresList.push(item.id)
        });
        // console.log(this.formTask.measuresList)
      }
      // console.log(this.formTask.measuresList)
      // if(newValue.length>oldValue.length){
      //   this.formTask.measuresList=[];
      //   newValue.forEach((item,index) =>{
      //     this.formTask.measuresList.push(item.id)
      //   });
      // }
      // if(newValue.length<oldValue.length){
      //   this.formTask.measuresList=[];
      //   newValue.forEach((item,index) =>{
      //     this.formTask.measuresList.push(item.id)
      //   });
      // }
    }
  },

  methods: {
    moment,
    handleClose() {
      this.$emit('update:visible', false)
      this.init()
    },
    goSubmitTask() {
      console.log('submit')
      console.log(this.formTask.measuresList)
      if(this.formTask.measuresList.length>0){
        console.log(this.formTask.measuresList)
      }else{
        message.error('您还未选择测点')
        return;
      }
      this.$refs.refForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.loading = true
          if (this.pageKey === '任务') {
            let param = {
              taskTitle: this.formTask.taskTitle,
              remark: this.formTask.remark,
              startTime: this.formTask.rangeDate[0].valueOf(),
              stopTime: this.formTask.rangeDate[1].valueOf(),
              measuresList: this.formTask.measuresList,
            }
            //常规任务
            if (this.formTask.taskType === 0) {
              param.routineType = this.formTask.routineType
              console.log(param)
              console.log(99999222222)
              console.log(this.operate)
              console.log(this.operate === '创建')
              console.log(this.formTask.rangeTimeList)
              if(this.formTask.routineType==1||this.formTask.routineType==2){
                if(this.formTask.rangeTimeList.length>0){
                  param.timeRanges=this.formTask.rangeTimeList;
                }
              }else{
                // delete param.timeRanges;
              }
              if (this.operate === '创建') {
                createNormalTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('创建成功')
                      this.handleClose()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              } else if (this.operate === '修改') {
                param.id = this.formTask.id
                updateTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleClose()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            }

            //非常规任务
            if (this.formTask.taskType === 1) {
              param.nonroutineName = this.formTask.nonroutineName
              param.dataSubmitType = this.formTask.dataSubmitType
              if (this.operate === '创建') {
                createUnnormalTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('创建成功')
                      this.handleClose()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              } else if (this.operate === '修改') {
                param.id = this.formTask.id
                updateTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleClose()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            }
          }
        }
      })
    },
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days')
    },
    addTimePicker:function(){
      if(this.formTask.rangeTimeList.length<3){
        this.formTask.rangeTimeList.push({rangeStart:'',rangeEnd:''})
      }else{
        message.error('最多添加三个')
      }
      
    },
    reduceTimePicker:function(){
      if(this.formTask.rangeTimeList.length>0){
        this.formTask.rangeTimeList.pop();
      }
    },
    onChange(value, selectedOptions) {//部门选择
      this.deId=Number(value[value.length-1]);
      // console.log(value)
      // console.log(selectedOptions)
    },
    clickSearch:function(){//搜索
      var obj;
      if(this.formTask.taskType==1){
        var obj={
          deptId:Number(this.deId),
          includeSubDept:Number(this.isShowDeStatus),
          keyword:this.keyWords,
          noiseType:3
        }
      }
      if(this.formTask.taskType==0&&this.formTask.routineType==undefined){
        message.error('请选择监测数据类型')
        return;
      }
      if(this.formTask.taskType==0&&this.formTask.routineType==0){
        var obj={
          deptId:Number(this.deId),
          includeSubDept:Number(this.isShowDeStatus),
          keyword:this.keyWords,
          noiseType:0
        }
      }
      if(this.formTask.taskType==0&&this.formTask.routineType==1){
        var obj={
          deptId:Number(this.deId),
          includeSubDept:Number(this.isShowDeStatus),
          keyword:this.keyWords,
          noiseType:1
        }
      }
      if(this.formTask.taskType==0&&this.formTask.routineType==2){
        var obj={
          deptId:Number(this.deId),
          includeSubDept:Number(this.isShowDeStatus),
          keyword:this.keyWords,
          noiseType:2
        }
      }

      getConditionMeasureList({
        page:{
          size: 10,
          current: 1,
        },
        keys:obj

      }).then(({ error, response }) => {
          if (error.code === 0) {
            const pagination = { ...this.pagination };
            pagination.total = response.total;
            // pagination.pageSize = 20;
            this.tableLoading = false;
            this.measuresList=response.records;
            this.pagination = pagination;
          }
      })
    },
    clickReset:function(){//重置
      this.isShowDeStatus=1;
      this.keyWords='';
      this.cascaderValue=[];
      this.hasChooseMeasuresList=[];
      this.measuresList=[];
      const pagination = { ...this.pagination };
      pagination.total = 0;
      this.pagination = pagination;
    },
    taskTypeChange:function(){//
        this.clickReset();
    },
    // disabledDate(current) {
    //   // Can not select days before today and today
    //   return current && current < moment().endOf('day');
    // },
    handleTableChange(pagination, filters, sorter) {//分页
      this.tableLoading = true;
      getConditionMeasureList({
        page:{
          size: 10,
          current: pagination.current,
        },
        keys:{
          deptId:Number(this.deId),
          includeSubDept:Number(this.isShowDeStatus),
          keyword:this.keyWords,
        }

      }).then(({ error, response }) => {
          if (error.code === 0) {
            const pagination = { ...this.pagination };
            pagination.total = response.total;
            this.tableLoading = false;
            this.measuresList=response.records;
            this.pagination = pagination;
          }
      })
    },
    clickAllChoose:function(){
      if(this.hasChooseMeasuresList.length==0){//0
        this.hasChooseMeasuresList=this.measuresList.concat(this.hasChooseMeasuresList)
      }else{
        this.measuresList.forEach((item,index) =>{
          let isIn = this.hasChooseMeasuresList.findIndex((item1) => item1.id === item.id)
          if(isIn==-1){
            this.hasChooseMeasuresList.push(item)
          }else{
          }
        });
      }
    },
    clickNoChoose:function(){
      if(this.hasChooseMeasuresList==0){

      }else{
        this.measuresList.forEach((item,index) =>{
          let isIn = this.hasChooseMeasuresList.findIndex((item1) => item1.id === item.id)
          if(isIn==-1){
          }else{
            this.hasChooseMeasuresList.splice(isIn,1)
          }
        });
      }
    },
    goAllMeasPointPage:function(){
      if(this.operate=='修改'){
        this.$emit('goMeasPointPage', this.hasChooseMeasuresList)
      }

      if(this.operate=='创建'){
        if(this.hasChooseMeasuresList.length>0){
          this.$emit('goMeasPointPage', this.hasChooseMeasuresList)
        }else{
          message.error('您还未选择测点')
        }
      }
    },
    add:function(list){
      console.log(list)
      this.hasChooseMeasuresList=list;
    },
    handleMenuClick:function(idx,operate,record){//添加
      console.log(idx)
      console.log(operate)
      console.log(record)
      if(this.hasChooseMeasuresList.length==0){//0
        this.hasChooseMeasuresList.push(record)
      }else{
        let isIn = this.hasChooseMeasuresList.findIndex((item1) => item1.id === idx)
        if(isIn==-1){
          this.hasChooseMeasuresList.push(record)
        }else{
        }
      }
    },
    init:function(){
      this.formTask={//新建
        taskType: 0,
        taskTitle: '',
        remark: '',
        rangeDate: [],
        routineType: undefined, //监测数据类型
        rangeTimeList:[{rangeStart:'',rangeEnd:''},],
        rangeStart1: '',
        rangeEnd1: '',
        rangeStart2: '',
        rangeEnd2: '',
        rangeStart3: '',
        rangeEnd3: '',
        measuresList: [],
        nonroutineName: '',
        dataSubmitType: undefined,
      }
      this.fieldNames={ label: 'departmentName', value: 'id', children: 'children' };
      this.options=[];
      this.deId=0;
      this.isShowDeStatus=1;
      this.keyWords='';
      this.measuresList=[];
      this.pagination={};
      this.hasChooseMeasuresList=[];

      const pagination = { ...this.pagination };
      pagination.total = 0;
      this.measuresList=[];
      this.pagination = pagination;
    },




    adaptiveData() {
      if (!this.dataSource.createUser) {
        this.dataSource.createUser = {}
      }
      if (!this.dataSource.operateUser) {
        this.dataSource.operateUser = {}
      }
      if (!this.dataSource.updateUser) {
        this.dataSource.updateUser = {}
      }
      if (!this.dataSource.measure) {
        this.dataSource.measure = {}
      }
      // if (!this.dataSource.dispatchDept) {
      //   this.dataSource.measure = {}
      // }
    },
  },
}
</script>
<style lang="less" scoped>
.d_title{
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.d_point{
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  .d_pointX{
    color:red;
    padding: 0 5px 0 0;
  }
  .d_blue{
    color: rgb(22, 179, 179);
    cursor: pointer;
  }
}
.d_search{
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin-top: 15px;
  display: flex;
  .d_searchInput{
    margin-left: 186px;
  }
}
.d_content{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border:1px solid #91d5ff;
  border-radius: 10px;
  height: 68px;
  padding: 20px;
}
.d_submitBtn{
  padding: 20px 20px;
  display: flex;
  flex-direction: row-reverse;
}
</style>

