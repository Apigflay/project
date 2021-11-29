<template>
  <div class="DetailMeasPoint">
    <a-modal
      title="已选测点"
      :visible="visible"
      :confirmLoading="loading"
      destroyOnClose
      centered
      :maskClosable="false"
      width="600px"
      wrapClassName="CommonModalStyle"
      @ok="handleOk"
      @cancel="handleCancel">
      <div class="d_clearArea"><span>测点信息</span><a-button @click="deletAllPoint">移除所有测点</a-button></div>
      <!-- 表格 -->
      <a-table
        :columns="columnsTaskToSubmit"
        :data-source="tableList"
        :pagination="page"
        :rowKey="(record) => record.id"
        :loading="tableLoading"
        @change="handleTableChange">
        
        <template slot="address" slot-scope="address">
          <a :href="`https://www.amap.com/search?query=${address}`" target="_blank">{{ address }}</a>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="handleMenuClick(record.id, '移除', record)">移除</a-button>
          </a-space>
        </template>
      </a-table>

     
     

  


    </a-modal>
  </div>
</template>

<script>


import {
  
} from '@/api/api'
import { api_java } from '@/api/urlConfig'

const columnsTaskToSubmit = [
  {
    dataIndex: 'measureName',
    title: '测点名称',
  },

  {
    dataIndex: 'measureCode',
    title: '测点编号',
    scopedSlots: { customRender: 'taskTypeCustom' },
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
  name: 'DetailMeasPoint',
  props: ['visible', 'hasChooseMeasuresList'],
  components: {

  },
  data() {
    return {
      loading:false,
      columnsTaskToSubmit,
      page:true,
      tableLoading:false,
      tableList:[],
      
  

    }
  },

  watch: {
    visible(value) {
      if (value === true) {
        this.tableList=JSON.parse(JSON.stringify(this.hasChooseMeasuresList));
      }
    },
    
  },

  methods: {
    handleOk() {
      this.$emit('detailMeasPointClick',this.tableList);
      this.$emit('update:visible', false)
      this.tableList=[];
    },
    handleCancel() {
      this.$emit('update:visible', false);
      this.tableList=[];
    },
    handleTableChange:function(){

    },
    handleMenuClick:function(idx,str,record){
      let isIn = this.tableList.findIndex((item1) => item1.id === idx)
      if(isIn==-1){
      }else{
        this.tableList.splice(isIn,1)
      }
    },
    deletAllPoint:function(){
      this.tableList=[];
    }

  },
}
</script>
<style lang="less" scoped>
.d_clearArea{
  padding:5px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
