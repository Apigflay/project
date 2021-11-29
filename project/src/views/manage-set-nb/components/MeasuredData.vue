<template>
  <div class="MeasuredData">
    <a-drawer width="555" title="测量数据" :visible="visible" :closable="false" @close="handleClose">
        <!-- routineType==null 非常规任务 routineType==0 功能区 routineType==1||2非功能区 -->
        <div class="listTitle" ><span>声仪器提交的数据</span> <span @click="showAllData">全部数据></span></div>
        <template v-if="routineType==1||routineType==2">
            <a-table v-if="pointsSummaryListM!=[]"
                    :loading="subTableLoading"
                    :columns="columnsSubTask"
                    :data-source="currentStaDatas"
                    :rowKey="(record) => record.id"
                    style="margin: 12px 0px"
                    :pagitation="false"
                    size="small">
                <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
                <template slot="leqT" slot-scope="leqT">{{ leqT | toFixed1 }}</template>
                <template slot="lafMax" slot-scope="lafMax">{{ lafMax | toFixed1 }}</template>
            </a-table>
            <div>任务历年数据</div>
            <a-table
                    :loading="subTableLoading"
                    :columns="columnsSubTask1"
                    :data-source="staDatas"
                    :rowKey="(record) => record.id"
                    style="margin: 12px 0px"
                    :pagitation="false"
                    size="small">
                <template slot="createTime" slot-scope="createTime">{{ createTime | unix2String }}</template>
                <template slot="dayEq" slot-scope="dayEq">{{ dayEq | toFixed1 }}</template>
                <template slot="nightEq" slot-scope="nightEq">{{ nightEq | toFixed1 }}</template>

            </a-table>
            <a-skeleton active :loading="false" :paragraph="{ rows: 7 }" style="margin-top: 24px">
                <a-descriptions title="其他数据" :column="1">
                    <a-descriptions-item label="风速值">{{windNum}} m/s</a-descriptions-item>
                    <a-descriptions-item label="车流量">{{carNum}}</a-descriptions-item>
                </a-descriptions>
                <a-descriptions title="测量信息" :column="1">
                    <a-descriptions-item label="仪器编号">
                        {{instrumentNumber}}
                    </a-descriptions-item>
                    <a-descriptions-item label="校准器编号">{{standardNum}}</a-descriptions-item>
                    <a-descriptions-item label="测量前校准值">{{beforeNumber | toFixed1}} dB</a-descriptions-item>
                    <a-descriptions-item label="测量后校准值">{{afterNumber | toFixed1}} dB</a-descriptions-item>
                </a-descriptions>
            </a-skeleton>
        </template>
        <template v-if="routineType==0">
            <div>时间{{gongnengData.date}} ld:{{gongnengData.ld}} ln:{{gongnengData.ln}}</div>
            <a-table v-if="pointsSummaryListM!=[]"
                    :loading="subTableLoading"
                    :columns="columnsSubTask2"
                    :data-source="currentFunAreaData"
                    :rowKey="(record) => record.id"
                    style="margin: 12px 0px"
                    :pagitation="false"
                    size="small">
                <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
                <template slot="leqT" slot-scope="leqT">{{ leqT | toFixed1 }}</template>
                <template slot="lafMax" slot-scope="lafMax">{{ lafMax | toFixed1 }}</template>
            </a-table>
            <div>任务历年数据</div>
            <a-table
                    :loading="subTableLoading"
                    :columns="columnsSubTask3"
                    :data-source="funAreaDataList"
                    :rowKey="(record) => record.id"
                    style="margin: 12px 0px"
                    :pagitation="false"
                    size="small">
                <template slot="createTime" slot-scope="createTime">{{ createTime | unix2String }}</template>
                <template slot="dayEq" slot-scope="dayEq">{{ dayEq | toFixed1 }}</template>
                <template slot="nightEq" slot-scope="nightEq">{{ nightEq | toFixed1 }}</template>
            </a-table>
            <a-skeleton active :loading="false" :paragraph="{ rows: 7 }" style="margin-top: 24px">
                <a-descriptions title="其他数据" :column="1">
                    <a-descriptions-item label="风速值">{{windNum}} m/s</a-descriptions-item>
                    <a-descriptions-item label="车流量">{{carNum}}</a-descriptions-item>
                </a-descriptions>
                <a-descriptions title="测量信息" :column="1">
                    <a-descriptions-item label="仪器编号">
                        {{instrumentNumber}}
                    </a-descriptions-item>
                    <a-descriptions-item label="校准器编号">{{standardNum}}</a-descriptions-item>
                    <a-descriptions-item label="测量前校准值">{{beforeNumber | toFixed1}} dB</a-descriptions-item>
                    <a-descriptions-item label="测量后校准值">{{afterNumber | toFixed1}} dB</a-descriptions-item>
                </a-descriptions>
            </a-skeleton>
        </template>
        <template v-if="routineType==null&&dataSubmitType==1">
            <a-table
                    :loading="subTableLoading"
                    :columns="columnsSubTask4"
                    :data-source="list"
                    :rowKey="(record) => record.id"
                    style="margin: 12px 0px"
                    :pagitation="false"
                    size="small">
              <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
              <template slot="leqT" slot-scope="leqT">{{ leqT | toFixed1 }}</template>
              <template slot="lafMax" slot-scope="lafMax">{{ lafMax | toFixed1 }}</template>
            </a-table>
            <a-skeleton active :loading="false" :paragraph="{ rows: 7 }" style="margin-top: 24px">
                <a-descriptions title="其他数据" :column="1">
                    <a-descriptions-item label="风速值">{{windNum}} m/s</a-descriptions-item>
                    <a-descriptions-item label="车流量">{{carNum}}</a-descriptions-item>
                </a-descriptions>
                <a-descriptions title="测量信息" :column="1">
                    <a-descriptions-item label="仪器编号">
                        {{instrumentNumber}}
                    </a-descriptions-item>
                    <a-descriptions-item label="校准器编号">{{standardNum}}</a-descriptions-item>
                    <a-descriptions-item label="测量前校准值">{{beforeNumber | toFixed1}} dB</a-descriptions-item>
                    <a-descriptions-item label="测量后校准值">{{afterNumber | toFixed1}} dB</a-descriptions-item>
                </a-descriptions>
            </a-skeleton> 
        </template>
        <template v-if="routineType==null&&dataSubmitType==0">
            <a-table
                    :loading="subTableLoading"
                    :columns="columnsSubTask5"
                    :data-source="list"
                    :rowKey="(record) => record.id"
                    style="margin: 12px 0px"
                    :pagitation="false"
                    size="small">
              <template slot="measureTime" slot-scope="measureTime">{{ measureTime | unix2String }}</template>
              <template slot="taskTypeCustom1" slot-scope="_, record">{{ record | toAllLp }}</template>
              <template slot="taskTypeCustom2" slot-scope="_, record">{{ record | toAllLEq }}</template>
            </a-table>
            <a-skeleton active :loading="false" :paragraph="{ rows: 7 }" style="margin-top: 24px">
                <a-descriptions title="其他数据" :column="1">
                    <a-descriptions-item label="风速值">{{windNum}} m/s</a-descriptions-item>
                    <a-descriptions-item label="车流量">{{carNum}}</a-descriptions-item>
                </a-descriptions>
                <a-descriptions title="测量信息" :column="1">
                    <a-descriptions-item label="仪器编号">
                        {{instrumentNumber}}
                    </a-descriptions-item>
                    <a-descriptions-item label="校准器编号">{{standardNum}}</a-descriptions-item>
                    <a-descriptions-item label="测量前校准值">{{beforeNumber | toFixed1}} dB</a-descriptions-item>
                    <a-descriptions-item label="测量后校准值">{{afterNumber | toFixed1}} dB</a-descriptions-item>
                </a-descriptions>
            </a-skeleton> 
        </template>



     


    </a-drawer>
  </div>
</template>

<script>
import { taskGetYearsData,taskGetDeviceBinding,taskGetDataList,taskGetDataAuditList } from '@/api/api';
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
  }
]
const columnsSubTask1 = [
  {
    dataIndex: 'createTime',
    title: '时间',
    scopedSlots: { customRender: 'createTime' },
  },
  {
    dataIndex: 'season',
    title: '季度',
    scopedSlots: { customRender: 'season' },
  },
  {
    dataIndex: 'dayEq',
    title: 'Ld(dB)',
    scopedSlots: { customRender: 'dayEq' },
  },
  {
    dataIndex: 'nightEq',
    title: 'Ln(dB)',
    scopedSlots: { customRender: 'nightEq' },
  }
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
  }
]
const columnsSubTask3 = [
  {
    dataIndex: 'createTime',
    title: '时间',
    scopedSlots: { customRender: 'createTime' },
  },
  {
    dataIndex: 'season',
    title: '季度',
  },
  {
    dataIndex: 'dayEq',
    title: 'Ld(dB)',
    scopedSlots: { customRender: 'nightEq' },
  },
  {
    dataIndex: 'nightEq',
    title: 'Ln(dB)',
    scopedSlots: { customRender: 'nightEq' },
  }
]
const columnsSubTask4 = [
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
  }
]
const columnsSubTask5 = [
  {
    dataIndex: 'measureTime',
    title: '时间',
    scopedSlots: { customRender: 'measureTime' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: 'Lp(dB)',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  {
    dataIndex: 'taskTypeCustom2',
    title: 'Leq(dB)',
    scopedSlots: { customRender: 'taskTypeCustom2' },
  }
]
export default {
    name: 'MeasuredData',
    props: ['visible', 'recordId','routineType','sonMearId','dataSubmitType','type','measTaskStatus'],
    data() {
        return {
            subTableLoading:false,
            columnsSubTask,
            columnsSubTask1,
            columnsSubTask2,
            columnsSubTask3,
            columnsSubTask4,
            columnsSubTask5,
            list:[],
            lastList:[],//绑定数据
            loading:false,
            pointsSummaryListM:[{currentStaDatas:[],staDatas:[]}],
            yearsSummaryListM:[],
            currentFunAreaData:[],//功能区现在数据
            funAreaDataList:[],//功能区历年数据
            currentStaDatas:[],//区域交通现在数据
            staDatas:[],//区域交通历年数据
            gongnengData:{},
            // 
            windNum:'',//风速值
            carNum:'',//车速值
            instrumentNumber:'',//仪器编号
            standardNum:'',//标准器编号
            beforeNumber:0,//测量前校准值
            afterNumber:0,//测量后校准值
            



        }
    },
    watch: {
        visible(value) {
            // console.log(value)
            // console.log(this.recordId)
            // console.log(this.routineType)
            // console.log(this.sonMearId)
            // console.log(this.dataSubmitType)
            // console.log(this.measTaskStatus)
            this.list = [];
            this.gongnengData={};
            this.currentFunAreaData=[];//功能区现在数据
            this.funAreaDataList=[];//功能区历年数据
            this.currentStaDatas=[];//区域交通现在数据
            this.staDatas=[];//区域交通历年数据
            if (value === true) {
                this.loading = true
                if(this.routineType==null){
                    // console.log(this.type)
                    if(this.type==2){//
                      taskGetDataAuditList(this.recordId)
                      .then(({ error, response }) => {
                          if (error.code === 0) {
                            // console.log(response)
                            if(this.dataSubmitType==0){//瞬时 lpDatas
                              if(response.lpDatas==null){
                                this.list = []
                              }else{
                                this.list=response.lpDatas[0].dataList;
                              }
                            }else{//统计 staDatas
                              if(response.staDatas==null){
                                this.list = []
                              }else{
                                this.list=response.staDatas[0].dataList;
                              }
                            }
                          }
                      })
                      .finally(() => {
                          setTimeout(() => {
                          this.loading = false
                          }, 500)
                      })
                    }else{
                      if(this.measTaskStatus=='AUDITING'||this.measTaskStatus=='COMPLETED'){
                        taskGetDataAuditList(this.recordId)
                        .then(({ error, response }) => {
                            if (error.code === 0) {
                              // console.log(response)
                              if(this.dataSubmitType==0){//瞬时 lpDatas
                                if(response.lpDatas==null){
                                  this.list = []
                                }else{
                                  this.list=response.lpDatas[0].dataList;
                                }
                              }else{//统计 staDatas
                                if(response.staDatas==null){
                                  this.list = []
                                }else{
                                  this.list=response.staDatas[0].dataList;
                                }
                              }   
                            }
                        })
                        .finally(() => {
                            setTimeout(() => {
                            this.loading = false
                            }, 500)
                        })
                      }else{
                        taskGetDataList(this.recordId)
                        .then(({ error, response }) => {
                            if (error.code === 0) {
                              if(response.records==null){
                                this.list = []
                              }else{
                                this.list = response.records
                              }
                            }
                        })
                        .finally(() => {
                            setTimeout(() => {
                            this.loading = false
                            }, 500)
                        })
                      }
                    }
                    
                }else{
                    taskGetYearsData(this.recordId)
                    .then(({ error, response }) => {
                        if (error.code === 0) {
                            // this.list = response
                            var that =this;
                            if(response.pointsSummaryList.length>0){
                              response.pointsSummaryList.forEach(function(item,index){
                                if(that.sonMearId==item.id){
                                  // console.log(item)
                                  if(item.currentFunAreaData){
                                    that.gongnengData=item.currentFunAreaData;
                                    if(item.currentFunAreaData.hourStaDataList.length>0){
                                      that.currentFunAreaData=item.currentFunAreaData.hourStaDataList;//功能区现在数据
                                    }
                                  }
                                  that.funAreaDataList=item.funAreaDataList;//功能区历年数据
                                  that.currentStaDatas=item.currentStaDatas;//区域交通现在数据
                                  that.staDatas=item.staDatas;//区域交通历年数据
                                }
                              })
                            }else{
                                that.gongnengData={};
                                that.currentFunAreaData=[];//功能区现在数据
                                that.funAreaDataList=[];//功能区历年数据
                                that.currentStaDatas=[];//区域交通现在数据
                                that.staDatas=[];//区域交通历年数据
                            }

                        }
                    })
                    .finally(() => {
                        setTimeout(() => {
                        this.loading = false
                        }, 500)
                    })
                }
                this.windNum='';
                this.instrumentNumber='';
                this.standardNum='';
                this.beforeNumber=0;
                this.afterNumber=0;
                taskGetDeviceBinding(this.recordId)
                .then(({ error, response }) => {
                    if (error.code === 0) {
                        this.lastList = response.dataList;
                        if(response.dataList.length>0){
                          var that =this;
                          response.dataList.forEach(function(item,index){
                            // console.log(item)
                            //1：声测量仪器，3：声校准仪器，4：风速仪，5：车流量仪
                            if(item.deviceClassify==4){
                              // console.log(item)
                              item.dataInfo.forEach(function(item4,index4){
                                if(index4==0){
                                  that.windNum=item4.measureValue
                                }
                              })
                            }else if(item.deviceClassify==5){
                              item.dataInfo.forEach(function(item5,index5){
                                if(index5==0){
                                  that.carNum=item5.measureValue
                                }
                              })
                            }else if(item.deviceClassify==3){
                              item.dataInfo.forEach(function(item3,index3){
                                if(item3.measureType==1){
                                  if(that.beforeNumber==0){
                                    that.beforeNumber=item3.measureValue;
                                    that.standardNum=item3.deviceSerialNo;
                                  }
                                }else if(item3.measureType==2){
                                  if(that.afterNumber==0){
                                    that.afterNumber=item3.measureValue;
                                    that.standardNum=item3.deviceSerialNo;
                                  }
                                }
                              })
                            }else if(item.deviceClassify==1){
                              that.instrumentNumber=item.deviceSerialNo;
                            }
                          })
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
    },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    showAllData(){
      this.$emit('goShowAllMeasureData', {recordId:this.recordId,routineType:this.routineType,deviceSerialNo:this.instrumentNumber,dataSubmitType:this.dataSubmitType})
    },
    add(id,routineType){
        // this.loading = true
        // if(routineType==null){
        //     taskGetDataList(id)
        //     .then(({ error, response }) => {
        //         if (error.code === 0) {
        //           if(response.records==null){
        //             this.list = []
        //           }else{
        //             this.list = response.records
        //           }
        //             console.log(response)
        //         }
        //     })
        //     .finally(() => {
        //         setTimeout(() => {
        //         this.loading = false
        //         }, 500)
        //     })
        // }else{
        //     taskGetYearsData(id)
        //     .then(({ error, response }) => {
        //         if (error.code === 0) {
        //             // this.list = response
        //             this.pointsSummaryListM=response.pointsSummaryList;
        //             this.yearsSummaryListM=response.yearsSummaryList;
        //             console.log(response)
        //         }
        //     })
        //     .finally(() => {
        //         setTimeout(() => {
        //         this.loading = false
        //         }, 500)
        //     })
        // }

        // taskGetDeviceBinding(id)
        // .then(({ error, response }) => {
        //     if (error.code === 0) {
        //         console.log(response)
        //         this.lastList = response.dataList;
        //     }
        // })
        // .finally(() => {
        //     setTimeout(() => {
        //         this.loading = false
        //     }, 500)
        // })
    }
  },
  
}
</script>
<style lang="less">
.listTitle{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}
</style>

