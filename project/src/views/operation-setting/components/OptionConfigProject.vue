<template>
  <div class="operationEcharts">
    <a-modal
      :title="operate + pageKey"
      :visible="visible"
      :confirmLoading="loading"
      destroyOnClose
      centered
      :maskClosable="false"
      width="600px"
      wrapClassName="CommonModalStyle"
      @ok="handleOk"
      @cancel="handleCancel"
    >


      <a-form-model :model="formTask" :rules="rulesTask" ref="refForm" >
          <a-form-model-item label="运维标题" prop="taskName">
              <a-input v-model="formTask.taskName" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="备注" prop="taskRemark">
              <a-input v-model="formTask.taskRemark" placeholder="请输入" />
          </a-form-model-item>
      </a-form-model>




    </a-modal>
  </div>
</template>

<script>
// import { assignTask, auditTask } from '@/api/api'
const rulesTask = {
  taskName: [
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
  taskRemark:[
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
}
export default {
  name: 'operationEcharts',

  components: {

  },

  props: ['visible','pageKey','operate','modalData', 'recordId'],

  data() {
    return {
      loading:false,
      timeLei:'',
      rulesTask,
      formTask:{
          taskName:'',
          taskRemark:''
      },
    }
  },
  created(){
    
  },
  watch:{
    visible(value){
      console.log(value+'1111111111')
      if(value){

      }
    }
  },
  mounted(){
    this.$nextTick(()=> {

        
    })
  },
  methods: {
    handleOk(){
      this.$refs.refForm.validate((valid) => {
          console.log(valid)
          if (valid) {
              
          }
      })
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.init()
    },
    init() {

    },

  },
}
</script>
<style lang="less" scoped>
.operationEcharts{

}

</style>

