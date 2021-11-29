<template>
  <div class="department-manage">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>部门管理</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">
        <span>部门管理</span>
        <a-button type="primary" style="margin-left: 24px" @click="clickAdd">创建部门与部门负责人</a-button>
      </div>
    </div>

    <div class="father-cotnainer">
      <div class="page-common-content tree-container">
        <a-tree
          v-if="treeData.length"
          :tree-data="treeData"
          :replaceFields="replaceFields"
          default-expand-all
          :selectedKeys="selectedKeys"
          @select="clickTree"
        >
          <a-icon slot="switcherIcon" type="down" />
        </a-tree>
      </div>

      <div class="page-common-content detail-container">
        <div class="btn-container">
          <a-space>
            <a-button :disabled="modifyDisable" @click="clickModify('部门')">修改部门</a-button>
            <a-button @click="clickModify('部门负责人')">修改部门负责人</a-button>
            <a-button @click="clickBan">{{ department.department.status === 0 ? '启用部门' : '禁用部门' }}</a-button>
            <a-button type="danger" @click="clickDelete">删除部门</a-button>
          </a-space>
        </div>

        <a-descriptions title="部门" bordered :column="1" style="margin-bottom: 20px">
          <a-descriptions-item label="部门名称">{{ department.department.departmentName }}</a-descriptions-item>
          <a-descriptions-item label="部门所在区域"
            >{{ department.department.provinceName }}{{ department.department.cityName
            }}{{ department.department.districtName }}</a-descriptions-item
          >
          <a-descriptions-item label="区域编码">{{ department.department.adCode }}</a-descriptions-item>
          <a-descriptions-item label="部门详细地址">{{ department.department.address }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <span :style="{ color: department.department.status ? '#87d068' : '#C0C4CC' }">{{
              department.department.status | stateFormat
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="备注">{{ department.department.remark }}</a-descriptions-item>
          <!-- <a-descriptions-item label="创建用户id">{{department.department.createUserId}}</a-descriptions-item> -->
          <!-- <a-descriptions-item label="更新用户id">{{department.department.updateUserId}}</a-descriptions-item> -->
        </a-descriptions>

        <a-descriptions title="部门负责人" bordered :column="1">
          <!-- <a-descriptions-item label="id">{{department.user.id}}</a-descriptions-item> -->
          <a-descriptions-item label="部门负责人账号">{{ department.user.username }}</a-descriptions-item>
          <a-descriptions-item label="昵称">{{ department.user.nickname }}</a-descriptions-item>
          <!-- <a-descriptions-item label="密码">{{department.user.password}}</a-descriptions-item> -->
          <a-descriptions-item label="备注">{{ department.user.remark }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </div>

    <CommonModal
      :visible.sync="modalVisible"
      :pageKey="pageKey"
      :operate="operate"
      :modalData="modalData"
      @fetchData="fetchData"
    />
  </div>
</template>

<script>
import CommonModal from './components/CommonModal'
import { getDepartmentTree, getDepartment, deleteDepartment, banDepartment } from '@/api/api'

export default {
  name: 'department-manage',

  components: {
    CommonModal,
  },

  data() {
    return {
      modalVisible: false,
      operate: '',
      modalData: {},
      pageKey: '部门',
      modifyDisable: false,

      treeData: [],
      replaceFields: { children: 'children', title: 'departmentName', key: 'id' },
      currentTreeID: undefined,
      rootKey: undefined,

      department: {
        department: {},
        user: {},
      },
      selectedKeys: [],
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      getDepartmentTree().then(({ error, response }) => {
        if (error.code === 0) {
          //如果是最顶级
          if (!response.id) {
            this.treeData = response.children
          } else {
            this.treeData = [response]
          }
          if (this.treeData.length > 0) {
            this.rootKey = this.treeData[0].id
            if (this.currentTreeID === undefined) {
              this.getDepartment(this.treeData[0].id)
              this.selectedKeys = [this.treeData[0].id]
            } else {
              this.getDepartment(this.currentTreeID)
              this.selectedKeys = [this.currentTreeID]
            }
          }
        }
      })
    },

    clickTree(selectedKeys) {
      if (selectedKeys.length > 0) {
        this.currentTreeID = selectedKeys[0]
        this.selectedKeys = [this.currentTreeID]
        this.modifyDisable = this.currentTreeID != this.rootKey
        this.getDepartment(this.currentTreeID)
      }
    },

    getDepartment(id) {
      getDepartment(id).then(({ error, response }) => {
        if (error.code === 0) {
          this.department = response
          if (!this.department.user) {
            //有可能user为null
            this.department.user = {}
          }
        }
      })
    },

    clickAdd() {
      this.modalVisible = true
      this.operate = '创建'
      this.pageKey = '部门'
    },

    clickModify(pageKey) {
      this.pageKey = pageKey
      this.modalData = this.department
      this.modalVisible = true
      this.operate = '修改'
    },

    clickDelete() {
      this.$confirm({
        title: '确定删除吗？',
        okType: 'danger',
        onOk: () => {
          return new Promise((resolve, reject) => {
            deleteDepartment(this.department.department.id)
              .then(({ error, response }) => {
                if (error.code === 0) {
                  this.$message.success('删除成功')
                  this.currentTreeID = undefined
                  this.fetchData()
                }
              })
              .finally(() => {
                resolve()
              })
          })
        },
      })
    },

    clickBan() {
      let status = this.department.department.status === 0 ? 1 : 0
      let param = {
        id: this.department.department.id,
        status,
      }
      banDepartment(param).then(({ error, response }) => {
        if (error.code === 0) {
          this.$message.success('操作成功')
          this.fetchData()
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.father-cotnainer {
  display: flex;
  .tree-container {
    min-width: 260px;
    max-width: 260px;
    min-height: calc(100vh - 220px);
    max-height: 600px;
    overflow: auto;
  }
  .detail-container {
    margin-left: 0;
    flex: 1;
    position: relative;

    .btn-container {
      position: absolute;
      right: 24px;
      top: 20px;
    }
  }
}
/deep/ .ant-tree-title {
  user-select: none;
}

/deep/ .ant-descriptions-row {
  display: flex;
  .ant-descriptions-item-label {
    width: 160px !important;
  }
  .ant-descriptions-item-content {
    flex: 1;
  }
}
</style>



