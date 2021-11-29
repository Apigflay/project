<template>
  <div class="DetailDrawer">
    <a-drawer width="555" title="运维项目配置" :visible="visible" :closable="true" @close="handleClose">
        <div class="configTitle">
            <span>运维项目</span>
            <a-button type="primary" @click="openComponent" >添加运维项目</a-button>
        </div>
        <template>
            <a-table  :columns="columns" :data-source="data">
                <template slot="action" slot-scope="text, record">
                    <a-popconfirm
                        title="Sure to delete?"
                        @confirm="() => onDelete(record.key)"
                        >
                        <a href="javascript:;">Delete</a>
                    </a-popconfirm>
                    <a-popconfirm
                        title="Sure to delete?"
                        @confirm="() => onDelete(record.key)"
                        >
                        <a href="javascript:;" style="margin-left:20px;">Delete</a>
                    </a-popconfirm>
                </template>
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


const columns = [
  {
    title: '项目标题',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '备注',
    dataIndex: 'address',
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
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
            loading: false,

            data,
            columns,
        }
    },
    computed: {

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

        },
        onDelete(){
            this.$emit('openComponent',222)
        },
        openComponent(){
            this.$emit('openComponent',111)
        }
    },
}
</script>
<style lang="less" scoped>
.configTitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.d_submitBtn{
  padding: 20px 20px;
  display: flex;
  flex-direction: row-reverse;
}
</style>
