<template>
  <div class="notification-way">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>通知方式</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="page-common-content">
      <a-button type="primary" style="margin-bottom: 24px;margin-right: 16px;" @click="clickAddBtn">
        <a-icon type="plus" />添加通知方式
      </a-button>
      <!-- <a-button @click="batchDelete" :disabled="this.selectedRowKeys.length === 0">批量删除</a-button> -->

      <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
      <a-table
        :dataSource="dataSource"
        :loading="loading"
        :rowKey="(record, index) => record.mid +',' +record.eid"
        :pagination="pagination"
      >
        <a-table-column title="测点名称" data-index="measurename" key="measurename" />
        <!-- <a-table-column title="测点编号" data-index="MeasureCode" key="MeasureCode" /> -->
        <a-table-column title="仪器编号" data-index="mid" key="mid" />
        <a-table-column title="通知号码" data-index="phone" key="phone">
          <template slot-scope="phone">
            <span v-if="phone">
              <span v-for="(phonenum, index) in phone.split(',')" :key="phonenum">
                <a-tag color="blue" v-if="index === 0">{{phonenum}}</a-tag>
                <a-tag color="cyan" v-else-if="index === 1">{{phonenum}}</a-tag>
                <a-tag color="green" v-else-if="index === 2">{{phonenum}}</a-tag>
                <a-tag color="pink" v-else-if="index === 3">{{phonenum}}</a-tag>
                <a-tag color="purple" v-else-if="index === 4">{{phonenum}}</a-tag>
                <a-tag color="orange" v-else>{{phonenum}}</a-tag>
              </span>
            </span>
          </template>
        </a-table-column>
        <a-table-column title="事件" data-index="eid" key="eid">
          <template slot-scope="eid">
            <span>{{eid | eventIDFormat}}</span>
          </template>
        </a-table-column>
        <!-- <a-table-column title="短信通知" data-index="note" key="note">
          <template slot-scope="note">
            <span>有{{note}}</span>
          </template>
        </a-table-column>
        <a-table-column title="客户端通知" data-index="client" key="client">
          <template slot-scope="client">
            <span>有{{client}}</span>
          </template>
        </a-table-column> -->
        <!-- <a-table-column title="邮箱通知" data-index="phone" key="phone" /> -->
        <a-table-column title="操作" key="action">
          <template slot-scope="record">
            <div
              class="action-btn primary-color"
              @click="clickModifyBtn(record.eid,record.mid,record)"
            >修改</div>
            <a-divider type="vertical" />
            <div class="action-btn error-color" @click="actionDelete(record.eid,record.mid)">删除</div>
          </template>
        </a-table-column>
      </a-table>

      <a-modal
        :title="modalTitle"
        :visible="visible"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        :destroyOnClose="true"
        :keyboard="false"
        :maskClosable="false"
        width="580px"
      >
        <a-form :form="form">
          <a-form-item label="事件" v-bind="formItemLayout" v-if="type ==='add'">
            <a-row :gutter="16">
              <a-col :span="20">
                <a-select
                  class="event"
                  mode="multiple"
                  placeholder="请选择事件"
                  v-decorator="[
                    'eid',
                    {
                      rules: [{
                        required: true, message: '请选择事件' 
                      }],
                    }
                  ]"
                >
                  <a-select-option v-for="item in eventArr" :key="item.value">{{item.label}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item label="仪器编号" v-bind="formItemLayout" v-if="type ==='add'">
            <a-row :gutter="16">
              <a-col :span="20">
                <a-select
                  @change="deviceCodeChange"
                  placeholder="请选择仪器编号"
                  v-decorator="[
                    'mid',
                    {
                      rules: [{
                        required: true, message: '请选择仪器编号' 
                      }],
                    }
                  ]"
                >
                  <a-select-option
                    v-for="item in deviceList"
                    :key="item.NoiseMeasureID"
                    :value="item.NoiseMeasureID"
                  >{{item.NoiseMeasureID}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item label="仪器类型" v-bind="formItemLayout" v-if="type ==='add'">
            <a-row :gutter="16">
              <a-col :span="20">
                <a-input v-model="deviceType" :disabled="true" />
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item label="短信通知号码" v-bind="formItemLayout">
            <a-row :gutter="16">
              <a-col :span="20">
                <a-input
                  placeholder="请输入短信通知号码"
                  v-decorator="[
                  'phone',
                  {
                    rules: [{
                       required: true,whitespace: true, message: '请输入短信通知号码' 
                    }, {
                      pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误',
                    }],
                    validateTrigger: 'blur'
                  }
                ]"
                />
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item
            v-for="(k) in form.getFieldValue('keys')"
            :key="k"
            v-bind="formItemLayoutWithOutLabel"
            :required="false"
          >
            <a-row :gutter="16">
              <a-col :span="20">
                <a-input
                  v-decorator="[
                  `otherPhones[${k}]`,
                  {
                    rules: [{
                       required: true,whitespace: true, message: '请输入短信通知号码' 
                    }, {
                      pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误',
                    }],
                    validateTrigger: 'blur'
                  }
                ]"
                  placeholder="请输入短信通知号码"
                />
              </a-col>
              <a-col :span="4">
                <a-icon
                  v-if="form.getFieldValue('keys').length >= 1"
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  :disabled="form.getFieldValue('keys').length === 0"
                  @click="() => remove(k)"
                />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-row :gutter="16">
              <a-col :span="20">
                <a-button type="dashed" @click="add" block>
                  <a-icon type="plus" />增加号码
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getNoticeWayList, addNoticeWay, deleteNotice, GetDeviceAndTypeByUserName } from '@/api/manage-set'
import { mapGetters } from 'vuex'
let id = 0
let eventArr = [
  { label: '手动控制电校准', value: 'E0001' },
  { label: '自动电校准', value: 'E0002' },
  { label: '加热', value: 'E0003' },
  { label: '噪声超标', value: 'E0004' },
  { label: '仪器启动', value: 'E0005' },
  { label: '仪器正常关机', value: 'E0006' },
  { label: '停电', value: 'E0007' },
  { label: '机箱门被打开', value: 'E0008' },
  { label: '读声级计出错', value: 'E0009' },
  { label: 'CF出错', value: 'E0010' },
  { label: 'USB口出错', value: 'E0011' },
  { label: '电池电压不足', value: 'E0012' },
  { label: '声校准', value: 'E0013' }
]
export default {
  data() {
    return {
      deviceType: '',
      eventArr,
      dataSource: [],
      type: '',
      modalTitle: '',
      visible: false,
      confirmLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 18, offset: 6 }
        }
      },
      eid: '',
      mid: '',
      loading: false,
      pagination: {
        // current: 1,
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true, // 是否可以改变 pageSize
        pageSizeOptions: ['10', '100', '1000']
      },
      selectedRowKeys: [],
      deviceList: []
    }
  },

  watch: {
    visible(val) {
      if (val === true) {
        this.GetDeviceAndTypeByUserName()
      }
    }
  },

  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },

  created() {
    this.fetchData()
  },

  methods: {
    ...mapGetters(['userInfo']),

    fetchData() {
      this.loading = true
      getNoticeWayList(this.userInfo().UserName).then(res => {
        let list = JSON.parse(res.d)
        this.dataSource = list
        this.loading = false
      })
    },

    GetDeviceAndTypeByUserName() {
      GetDeviceAndTypeByUserName(this.userInfo().UserName).then(res => {
        let result = JSON.parse(res.d) // 接收数据
        this.deviceList = result
      })
    },

    actionDelete(eid, mid) {
      this.$confirm({
        title: '确定删除吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteNotice(eid, mid).then(res => {
            let response = JSON.parse(res.d)
            if (response.Error) {
              this.$message.error('系统错误')
            } else {
              this.$message.success('删除成功')
              this.fetchData()
            }
          })
        }
      })
    },

    clickAddBtn() {
      this.type = 'add'
      this.modalTitle = '添加通知方式'
      this.visible = true
    },

    clickModifyBtn(eid, mid, record) {
      id = 0
      this.type = 'modify'
      this.modalTitle = '修改通知方式'
      this.visible = true
      this.eid = eid
      this.mid = mid
      let phones = record.phone.split(',')
      for (let i = 0; i < phones.length - 1; i++) {
        this.add()
      }
      phones.filter((item, index) => index !== 0)
      setTimeout(() => {
        this.form.setFieldsValue({
          phone: phones[0],
          otherPhones: phones.filter((item, index) => index !== 0)
        })
      }, 300)
    },

    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.form.resetFields()
      this.deviceType = ''
    },

    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let phoneArr = []
          if (values.otherPhones) {
            for (let i = 0; i < values.otherPhones.length; i++) {
              if (values.otherPhones[i]) {
                phoneArr.push(values.otherPhones[i])
              }
            }
          }
          phoneArr.unshift(values.phone)

          if (this.type === 'add') {
            addNoticeWay(values.eid.join(), values.mid, phoneArr.join()).then(res => {
              let response = JSON.parse(res.d)
              if (response.Error) {
                this.$message.error('系统错误')
                this.handleCancel()
              } else {
                this.$message.success('添加通知方式成功')
                this.fetchData()
                this.handleCancel()
              }
            })
          } else if (this.type === 'modify') {
            addNoticeWay(this.eid, this.mid, phoneArr.join()).then(res => {
              let response = JSON.parse(res.d)
              if (response.Error) {
                this.$message.error('系统错误')
                this.handleCancel()
              } else {
                this.$message.success('修改通知方式成功')
                this.fetchData()
                this.handleCancel()
              }
            })
          }
        }
      })
    },

    remove(k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      if (keys.length === 0) {
        return
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },

    add() {
      const { form } = this
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      form.setFieldsValue({
        keys: nextKeys
      })
    },

    batchDelete() {
      this.$confirm({
        title: '确定删除吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          let arr = this.selectedRowKeys
          this.selectedRowKeys = []
          for (let i = 0; i < arr.length; i++) {
            let mid = arr[i].split(',')[0]
            let eid = arr[i].split(',')[1]
            deleteNotice(eid, mid).then(res => {
              let response = JSON.parse(res.d)
              if (response.Error) {
                this.$message.error('系统错误')
              } else {
                this.$message.success('删除成功')
                this.fetchData()
              }
            })
          }
        }
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    deviceCodeChange(value) {
      this.deviceList.forEach(item => {
        if (item.NoiseMeasureID == value) {
          this.deviceType = item.MeasureType
        }
      })
    }
  }
}
</script>


<style lang="less" scoped>
.notification-way {
  .action-btn {
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }
  /deep/ .ant-pagination {
    margin-bottom: 0;
  }
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 2px;
  font-size: 18px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #504f4f;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.event {
  /deep/ .ant-select-selection__rendered {
    // height: 100px;
  }
}
</style>