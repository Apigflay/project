<template>
  <div class="user-manage">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>仪器管理</a-breadcrumb-item>
      </a-breadcrumb>
      <section class="userInfo-wrapper">
        <div class="username-row">
          <div style="display:flex">
            <a-avatar :size="32" icon="user" />
            <span class="ausername-text">{{userInfo().AUserName}}</span>
          </div>
          <a-button
            type="primary"
            @click="applyAdminModalVisible = true"
            v-action="['user']"
          >申请管理员账号</a-button>
        </div>

        <div class="attr-row">
          <a-row class="attr-a-row">
            <a-col :span="4" v-action="['user']">
              <span class="attr-row-title">仪器编号：</span>
              <span class="attr-row-text">{{userInfo().UserName}}</span>
            </a-col>
            <a-col :span="4">
              <span class="attr-row-title">角色：</span>
              <span class="attr-row-text">{{userInfo().UserType | roleFormat}}</span>
            </a-col>
            <a-col :span="4">
              <span class="attr-row-title">手机：</span>
              <span class="attr-row-text">{{userInfo().Phone}}</span>
            </a-col>
            <a-col :span="4">
              <span class="attr-row-title">邮箱：</span>
              <span class="attr-row-text">{{userInfo().EMail}}</span>
            </a-col>
          </a-row>
        </div>

        <div class="attr-row">
          <a-row class="attr-a-row">
            <a-col :span="4">
              <span class="attr-row-title">公司电话：</span>
              <span class="attr-row-text">{{userInfo().Tel}}</span>
            </a-col>
            <a-col :span="20">
              <span class="attr-row-title">公司名称：</span>
              <span class="attr-row-text">{{userInfo().Office}}</span>
            </a-col>
          </a-row>
        </div>
      </section>
    </div>

    <div class="page-common-content" v-action="['admin']">
      <div class="search-config-wrapper">
        <div class="search-row">
          <a-button type="primary" @click="visible = true">
            <a-icon type="plus" />添加仪器
          </a-button>
        </div>
      </div>

      <a-table
        :dataSource="dataSource"
        :rowKey="(record, index)=> index"
        :pagination="pagination"
        :loading="loading"
      >
        <a-table-column title="用户名" data-index="AUserName" key="AUserName" />
        <a-table-column title="身份" data-index="role" key="role">
          <template slot-scope="role">
            <span>操作员{{role}}</span>
          </template>
        </a-table-column>
        <a-table-column title="手机" data-index="Phone" key="Phone" />
        <a-table-column title="邮箱" data-index="EMail" key="EMail" />
        <a-table-column title="仪器编号" data-index="UserName" key="UserName" />
        <a-table-column title="仪器类型" data-index="MeasureType" key="MeasureType" />
        <a-table-column title="公司名称" data-index="Office" key="Office" />
        <a-table-column title="公司电话" data-index="Tel" key="Tel" />

        <a-table-column title="操作" key="action" width="160px">
          <template slot-scope="record">
            <div class="action-btn error-color" @click="clickDelete(record.UserName)">删除</div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      title="添加仪器"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable="false"
      style="top: 130px;"
    >
      <a-form :form="form">
        <a-form-item label="仪器编号" v-bind="formItemLayout">
          <a-input
            placeholder="请输入仪器编号或用户名"
            v-decorator="[
              'doausername',
              {
                rules: [
                  {
                    required: true, message: '请输入仪器编号或用户名', whitespace:true 
                  },
                  {
                    max:32, message: '最多输入32个字符'
                  },
                ],
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="密码" v-bind="formItemLayout">
          <a-input
            placeholder="请输入密码"
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true, message: '请输入密码'
                  }
                ],
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <apply-admin-modal :visible.sync="applyAdminModalVisible"></apply-admin-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { deleteDevice, AddDeviceByManager, GetOpListByUserName } from '@/api/manage-set'
import ApplyAdminModal from './apply-admin-modal'
export default {
  name: 'user-manage',

  components: { ApplyAdminModal },

  data() {
    return {
      loading: false,
      pagination: {
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true, // 是否可以改变 pageSize
        pageSizeOptions: ['10', '100', '1000']
      },

      form: this.$form.createForm(this),
      confirmLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        }
      },
      visible: false,
      applyAdminModalVisible: false,
      dataSource: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    ...mapGetters(['role', 'userInfo', 'socket']),

    fetchData() {
      this.loading = true
      GetOpListByUserName(this.userInfo().UserName).then(res => {
        let list = JSON.parse(res.d)
        this.dataSource = list
        this.loading = false
      })
    },

    clickDelete(deviceCode) {
      this.$confirm({
        title: '确定删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteDevice(this.userInfo().UserName, deviceCode).then(res => {
            let response = JSON.parse(res.d)
            if (response.Error == 0) {
              this.$message.success('删除成功')
              this.fetchData()
              this.$store.dispatch('GetUserInfo')
              this.socket().close()
              this.$store.dispatch('GetRealPointList') // 开启real point list websocket
              this.fetchData()
            } else {
              this.$message.error('系统错误')
            }
          })
        }
      })
    },

    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          AddDeviceByManager(this.userInfo().UserName, values.doausername, values.password).then(res => {
            let response = JSON.parse(res.d)
            if (response.Error == 0) {
              this.$message.success('添加成功')
              this.fetchData()
              this.$store.dispatch('GetUserInfo')
              this.socket().close()
              this.$store.dispatch('GetRealPointList') // 开启real point list websocket
            } else {
              this.$message.error(response.Msg)
            }
            this.handleCancel()
          })
        }
      })
    },

    handleCancel(e) {
      this.visible = false
      this.confirmLoading = false
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.user-manage {
  .userInfo-wrapper {
    margin-bottom: 12px;
    .username-row {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ausername-text {
        display: block;
        margin-left: 12px;
        font-size: 20px;
        font-weight: bold;
      }
    }

    .attr-row {
      height: 32px;
      padding-left: 45px;
      font-size: 14px;
      .attr-a-row {
        display: flex;
        align-items: center;
        height: 100%;
        .attr-row-title {
          color: rgba(0, 0, 0, 0.85);
        }
        .attr-row-text {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }

  .page-common-content {
    .config-row {
      .ant-btn {
        margin-left: 8px;
      }
    }
    .action-btn {
      display: inline-block;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>