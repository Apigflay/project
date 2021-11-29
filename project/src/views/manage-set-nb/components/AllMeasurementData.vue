<template>
  <div class="AllMeasurementData">
    <a-modal
      :title="modalKey"
      :visible="visible"
      :confirmLoading="loading"
      destroyOnClose
      centered
      :maskClosable="false"
      width="700px"
      wrapClassName="AllMeasurementData"
      okText="确定"
      @ok="handleOk"
      @cancel="handleCancel">
    <!-- routineType==null 非常规任务 routineType==0 功能区 routineType==1||2非功能区 -->
    <div class="pickerArea">
        <!-- <a-range-picker @ok=getPickerValue v-model="value" show-time>
            <template slot="renderExtraFooter">
                extra footer
            </template>
        </a-range-picker> -->
    </div>
    
    <template v-if="routineType==1||routineType==2">
        <a-table
                :scroll="{ x: 1800 }"
                :loading="subTableLoading"
                :columns="columnsSubTask"
                :data-source="list"
                :rowKey="(record) => record.id"
                style="margin: 12px 0px"
                :pagitation="pagitation"
                size="small">
            <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
            <template slot="leqT" slot-scope="leqT">{{ leqT | toFixed1 }}</template>
            <template slot="lafMax" slot-scope="lafMax">{{ lafMax | toFixed1 }}</template>
            <template slot="lafMin" slot-scope="lafMin">{{ lafMin | toFixed1 }}</template>
            <template slot="laf5" slot-scope="laf5">{{ laf5 | toFixed1 }}</template>
            <template slot="laf10" slot-scope="laf10">{{ laf10 | toFixed1 }}</template>
            <template slot="laf50" slot-scope="laf50">{{ laf50 | toFixed1 }}</template>
            <template slot="laf90" slot-scope="laf90">{{ laf90 | toFixed1 }}</template>
            <template slot="laf95" slot-scope="laf95">{{ laf95 | toFixed1 }}</template>
            <template slot="sd" slot-scope="sd">{{ sd | toFixed1 }}</template>
            <template slot="rate" slot-scope="rate">{{ rate | toFixed1 }}</template>
        </a-table>
    </template>
    <template v-if="routineType==0">
        <a-table
            :scroll="{ x: 1800 }"
            :columns="columnsSubTask1"
            :data-source="list"
            :pagination="pagitation"
            :rowKey="(record) => record.id"
            :loading="tableLoading"
            @change="handleTableChange"
            @expand="handleExpand">
            <template slot="ld" slot-scope="ld">{{ ld | toFixed1 }}</template>
            <template slot="ln" slot-scope="ln">{{ ln | toFixed1 }}</template>
            <!-- <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
            <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
            <template slot="taskTypeCustom" slot-scope="_, record">{{
            record.routineType == null ? '非常规任务' : '常规任务'
            }}</template>
            <template slot="taskTypeCustom1" slot-scope="_, record">
            {{record.routineType == 0 ? '功能区噪声测量' : ''}}
            {{record.routineType == 1 ? '区域噪声测量' : ''}}
            {{record.routineType == 2 ? '交通噪声测量' : ''}}
            {{record.routineType == null ? record.nonRoutineName : ''}}
            </template> -->
            <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
            <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->


            <!-- 子任务表格 -->
            <template slot="expandedRowRender" slot-scope="record">
                <div style="display: flex; justify-content: space-between">
                    <h6>子任务表格</h6>
                </div>
                <a-table
                    :loading="subTableLoading"
                    :columns="columnsSubTask11"
                    :data-source="record.hourStaDataList"
                    :rowKey="(record) => record.id"
                    style="margin: 12px 0px"
                    :pagitation="pagitation"
                    size="small">
                    <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
                    <template slot="leqT" slot-scope="leqT">{{ leqT | toFixed1 }}</template>
                    <template slot="lafMax" slot-scope="lafMax">{{ lafMax | toFixed1 }}</template>
                    <template slot="lafMin" slot-scope="lafMin">{{ lafMin | toFixed1 }}</template>
                    <template slot="laf5" slot-scope="laf5">{{ laf5 | toFixed1 }}</template>
                    <template slot="laf10" slot-scope="laf10">{{ laf10 | toFixed1 }}</template>
                    <template slot="laf50" slot-scope="laf50">{{ laf50 | toFixed1 }}</template>
                    <template slot="laf90" slot-scope="laf90">{{ laf90 | toFixed1 }}</template>
                    <template slot="laf95" slot-scope="laf95">{{ laf95 | toFixed1 }}</template>
                    <template slot="sd" slot-scope="sd">{{ sd | toFixed1 }}</template>
                    <template slot="rate" slot-scope="rate">{{ rate | toFixed1 }}</template>
                </a-table>
            </template>
        </a-table>
    </template>
    <template v-if="routineType==null&&dataSubmitType==1">
        <a-table
                :scroll="{ x: 1800 }"
                :loading="subTableLoading"
                :columns="columnsSubTask2"
                :data-source="list1"
                :rowKey="(record) => record.id"
                style="margin: 12px 0px"
                :pagitation="pagitation"
                size="small">
            <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
            <template slot="leqT" slot-scope="leqT">{{ leqT | toFixed1 }}</template>
            <template slot="lafMax" slot-scope="lafMax">{{ lafMax | toFixed1 }}</template>
            <template slot="lafMin" slot-scope="lafMin">{{ lafMin | toFixed1 }}</template>
            <template slot="laf5" slot-scope="laf5">{{ laf5 | toFixed1 }}</template>
            <template slot="laf10" slot-scope="laf10">{{ laf10 | toFixed1 }}</template>
            <template slot="laf50" slot-scope="laf50">{{ laf50 | toFixed1 }}</template>
            <template slot="laf90" slot-scope="laf90">{{ laf90 | toFixed1 }}</template>
            <template slot="laf95" slot-scope="laf95">{{ laf95 | toFixed1 }}</template>
            <template slot="sd" slot-scope="sd">{{ sd | toFixed1 }}</template>
            <template slot="rate" slot-scope="rate">{{ rate | toFixed1 }}</template>

        </a-table>
    </template>
    <template v-if="routineType==null&&dataSubmitType==0">
        <a-table
                :scroll="{ x: 1200 }"
                :loading="subTableLoading"
                :columns="columnsSubTask3"
                :data-source="list2"
                :rowKey="(record) => record.id"
                style="margin: 12px 0px"
                :pagitation="pagitation"
                size="small">
            <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
            <template slot="taskTypeCustom1" slot-scope="_, record">{{ record | toAllLp }}</template>
            <template slot="taskTypeCustom2" slot-scope="_, record">{{ record | toAllLEq }}</template>

        </a-table>
    </template>

    </a-modal>
  </div>
</template>

<script>
import { taskGetAuditList,taskGetAuditPage } from '@/api/api'

const rules = {
  operator: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  operation: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  remark: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
}
const columnsSubTask = [
  {
    dataIndex: 'measureTime',
    title: '时间',
    scopedSlots: { customRender: 'measureTime' },
  },
  {
    dataIndex: 'leqT',
    title: 'Leq(dB)',
    scopedSlots: { customRender: 'leqT' },
  },
  {
    dataIndex: 'lafMax',
    title: 'Lmax(dB)',
    scopedSlots: { customRender: 'lafMax' },
  },
  {
    dataIndex: 'lafMin',
    title: 'Lmin(dB)',
    scopedSlots: { customRender: 'lafMin' },
  },
  {
    dataIndex: 'laf5',
    title: 'L5(dB)',
    scopedSlots: { customRender: 'laf5' },
  },
  {
    dataIndex: 'laf10',
    title: 'L10(dB)',
    scopedSlots: { customRender: 'laf10' },
  },
  {
    dataIndex: 'laf50',
    title: 'L50(dB)',
    scopedSlots: { customRender: 'laf50' },
  },
  {
    dataIndex: 'laf90',
    title: 'L90(dB)',
    scopedSlots: { customRender: 'laf90' },
  },
  {
    dataIndex: 'laf95',
    title: 'L95(dB)',
    scopedSlots: { customRender: 'laf95' },
  },
  {
    dataIndex: 'sd',
    title: 'SD(dB)',
    scopedSlots: { customRender: 'sd' },
  },
  {
    dataIndex: 'rate',
    title: '有效采集率',
    scopedSlots: { customRender: 'rate' },
  },
  {
    dataIndex: 'lon',
    title: '经度°',
  },
  {
    dataIndex: 'lat',
    title: '纬度°',
  },
  {
    dataIndex: 'measureCode',
    title: '测点编号',
  },
  {
    dataIndex: 'deviceSerialNo',
    title: '仪器编号',
  },

]
const columnsSubTask1 = [
  {
    dataIndex: 'date',
    title: '时间',
  },
  {
    dataIndex: 'ld',
    title: 'Ld(dB)',
    scopedSlots: { customRender: 'ld' },
  },
  {
    dataIndex: 'ln',
    title: 'Ln(dB)',
    scopedSlots: { customRender: 'ln' },
  }
]
const columnsSubTask11 = [
  {
    dataIndex: 'measureTime',
    title: '时间',
    scopedSlots: { customRender: 'measureTime' },
  },
  {
    dataIndex: 'leqT',
    title: 'Leq(dB)',
    scopedSlots: { customRender: 'leqT' },
  },
  {
    dataIndex: 'lafMax',
    title: 'Lmax(dB)',
    scopedSlots: { customRender: 'lafMax' },
  },
  {
    dataIndex: 'lafMin',
    title: 'Lmin(dB)',
    scopedSlots: { customRender: 'lafMin' },
  },
  {
    dataIndex: 'laf5',
    title: 'L5(dB)',
    scopedSlots: { customRender: 'laf5' },
  },
  {
    dataIndex: 'laf10',
    title: 'L10(dB)',
    scopedSlots: { customRender: 'laf10' },
  },
  {
    dataIndex: 'laf50',
    title: 'L50(dB)',
    scopedSlots: { customRender: 'laf50' },
  },
  {
    dataIndex: 'laf90',
    title: 'L90(dB)',
    scopedSlots: { customRender: 'laf90' },
  },
  {
    dataIndex: 'laf95',
    title: 'L95(dB)',
    scopedSlots: { customRender: 'laf95' },
  },
  {
    dataIndex: 'sd',
    title: 'SD(dB)',
    scopedSlots: { customRender: 'sd' },
  },
  {
    dataIndex: 'rote',
    title: '采集率',
    scopedSlots: { customRender: 'rote' },
  },
  {
    dataIndex: 'lon',
    title: '经度°',
  },
  {
    dataIndex: 'lat',
    title: '纬度°',
  },
  {
    dataIndex: 'measureCode',
    title: '测点编号',
  },
  {
    dataIndex: 'deviceSerialNo',
    title: '仪器编号',
  },
]
const columnsSubTask2 = [
  {
    dataIndex: 'measureTime',
    title: '时间',
    scopedSlots: { customRender: 'measureTime' },
  },
  {
    dataIndex: 'leqT',
    title: 'Leq(dB)',
    scopedSlots: { customRender: 'leqT' },
  },
  {
    dataIndex: 'lafMax',
    title: 'Lmax(dB)',
    scopedSlots: { customRender: 'lafMax' },
  },
  {
    dataIndex: 'lafMin',
    title: 'Lmin(dB)',
    scopedSlots: { customRender: 'lafMin' },
  },
  {
    dataIndex: 'laf5',
    title: 'L5(dB)',
    scopedSlots: { customRender: 'laf5' },
  },
  {
    dataIndex: 'laf10',
    title: 'L10(dB)',
    scopedSlots: { customRender: 'laf10' },
  },
  {
    dataIndex: 'laf50',
    title: 'L50(dB)',
    scopedSlots: { customRender: 'laf50' },
  },
  {
    dataIndex: 'laf90',
    title: 'L90(dB)',
    scopedSlots: { customRender: 'laf90' },
  },
  {
    dataIndex: 'laf95',
    title: 'L95(dB)',
    scopedSlots: { customRender: 'laf95' },
  },
  {
    dataIndex: 'sd',
    title: 'SD(dB)',
    scopedSlots: { customRender: 'sd' },
  },
  {
    dataIndex: 'rate',
    title: '有效采集率',
    scopedSlots: { customRender: 'rate' },
  },
  {
    dataIndex: 'lon',
    title: '经度°',
  },
  {
    dataIndex: 'lat',
    title: '纬度°',
  },
  {
    dataIndex: 'measureCode',
    title: '测点编号',
  },
  {
    dataIndex: 'deviceSerialNo',
    title: '仪器编号',
  },

]
const columnsSubTask3 = [
  {
    dataIndex: 'measureTime',
    title: '时间',
    scopedSlots: { customRender: 'measureTime' },
  },
  {
    dataIndex: 'taskTypeCustom1',//leqT
    title: 'Lp(dB)',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  {
    dataIndex: 'taskTypeCustom2',//lAXMax
    title: 'Leq(dB)',
    scopedSlots: { customRender: 'taskTypeCustom2' },
  },
  {
    dataIndex: 'iniTime',
    title: '积分时间 s',
  },
  {
    dataIndex: 'lon',
    title: '经度°',
  },
  {
    dataIndex: 'lat',
    title: '纬度°',
  },
  {
    dataIndex: 'measureCode',
    title: '测点编号',
  },
  {
    dataIndex: 'deviceSerialNo',
    title: '仪器编号',
  },
]

export default {
  name: 'AllMeasurementData',

  components: {
  },

  props: ['visible', ],//'modalKey', 'recordId'

  data() {
    return {
        modalKey:'选择数据',
        loading:false,
        pagitation:true,
        value:'',
        subTableLoading:false,
        tableLoading:false,
        list:[],
        list1:[],
        list2:[],
        columnsSubTask,
        columnsSubTask1,
        columnsSubTask11,
        columnsSubTask2,
        columnsSubTask3,
        routineType:-1,
        dataSubmitType:-1,
    }
  },
  methods: {
    handleOk() {

    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.value='';
    },
    add(obj){
        this.list=[];
        // console.log(obj)
        this.dataSubmitType=obj.dataSubmitType;
        this.routineType=obj.routineType;
        this.list=[];
        this.list1=[];
        this.list2=[];
        if(obj.routineType==0){//功能区
            taskGetAuditList(obj.recordId)
                .then(({ error, response }) => {
                    if (error.code === 0) {
                        // console.log(response)
                        this.list = response.dataList;
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        this.loading = false
                    }, 500)
                })
        }else{//其他
            taskGetAuditPage(obj.recordId,obj.deviceSerialNo)
                .then(({ error, response }) => {
                    if (error.code === 0) {
                        // console.log(response)
                        if(response.records==null){

                        }else{
                          if(obj.routineType==null){
                            if(obj.dataSubmitType==0){//瞬时
                              this.list2 = response.records;
                            }else{
                              this.list1 = response.records;
                            }
                          }else{
                            this.list = response.records;
                          }
                        }
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        this.loading = false
                    }, 500)
                })
        }
    },
    getPickerValue(date,dateString){
        // console.log(date)
        // console.log(dateString)
        // console.log(this.value)
    },
    handleExpand:function(){

    },
    handleTableChange:function(){

    }
  },
}
</script>
<style lang="less">
.pickerArea{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
