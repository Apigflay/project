<template>
  <div class="DetailDrawer">
    <a-drawer width="555" :title="operate + pageKey" :visible="visible" :closable="true" @close="handleClose">
        <a-form-model :model="formTask" :rules="rulesTask" ref="refForm">
            <a-form-model-item label="任务名称" prop="taskName">
                <a-input v-model="formTask.taskName" placeholder="请输入" />
            </a-form-model-item>
        </a-form-model>
        <div>选择</div>
        <template>
            <a-table :row-selection="rowSelection" :columns="columns" :data-source="data">
                <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
        </template>
        <div class="d_submitBtn">
            <a-button type="primary" @click="goSubmitTask" >确定</a-button>
            <a-button @click="handleClose" style="margin-right: 20px;">取消</a-button>
        </div>




    </a-drawer>
  </div>
</template>

<script>
import { getTaskDetail } from '@/api/api';
//任务rules
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
  ]
}
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '备注',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];
export default {
    name: 'DetailDrawer',

    props: ['visible','pageKey','operate','modalData', 'recordId'],

    data() {
        return {
            rulesTask,
            formTask:{
                taskName:'',
            },
            loading: false,

            data,
            columns,
        }
    },
    computed: {
        rowSelection() {
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                },
                getCheckboxProps: record => ({
                    props: {
                        disabled: record.name === 'Disabled User去', // Column configuration not to be checked
                        name: record.name,
                    },
                }),
            };
        },
    },
    watch: {
        visible(value) {
        if (value === true) {
            this.loading = true
            // getTaskDetail(this.recordId)
            //   .then(({ error, response }) => {
            //     if (error.code === 0) {
            //       this.dataSource = response;
            //       this.adaptiveData()
            //     }
            //   })
            //   .finally(() => {
            //     setTimeout(() => {
            //       this.loading = false
            //     }, 500)
            //   })
        }
        },
    },

    methods: {
        handleClose() {
        this.$emit('update:visible', false)
        },
        goSubmitTask(){
            this.$refs.refForm.validate((valid) => {
                console.log(valid)
                if (valid) {
                    
                }
            })
        }
    },
}
</script>
<style lang="less" scoped>
.d_submitBtn{
  padding: 20px 20px;
  display: flex;
  flex-direction: row-reverse;
}
</style>
