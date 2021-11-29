<template>
  <div class="review-admin">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>审核管理员</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="page-common-content">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="pagination"
        :rowKey="(record, index) => index"
      >
        <span slot="UserState" slot-scope="UserState">
          <span
            class="dot"
            :class="{'success-dot':UserState == 1, 'error-dot':UserState == 2, 'disabled-dot':UserState == 0}"
          ></span>
          <span>{{UserState | userStateFormat}}</span>
        </span>

        <span slot="FilePath" slot-scope="FilePath" @click="lookImg(FilePath)">
          <div class="file-img-wrapper">
            <div class="mask">
              <a-icon type="search" />
            </div>
            <img :src="`/static-file/RegisterFile/${FilePath}`" alt class="file-img" />
          </div>
        </span>

        <span slot="action" slot-scope="record" v-if="record.UserState==0">
          <div
            class="action-btn primary-color"
            @click="reviewPass(record.UserName,record.Phone)"
          >审核通过</div>
          <a-divider type="vertical" />
          <div
            class="action-btn error-color"
            @click="reviewRefuse(record.UserName,record.Phone)"
          >审核不通过</div>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a :href="`http://localhost:1888/RegisterFile/${record.FilePath}`" download="">下载图片</a> -->
        </span>
      </a-table>
      <div class="big-img-wrapper" @click="colseImg">
        <img class="big-img" :src="`/static-file/RegisterFile/${bigImgSrc}`" alt />
      </div>
    </div>
  </div>
</template>

<script>
import { GetManagerList, ModifyUserState } from '@/api/manage-set'

const columns = [
  {
    title: '申请时间',
    dataIndex: 'RegisterDt',
    sorter: (a, b) => Date.parse(a.RegisterDt) - Date.parse(b.RegisterDt),
    width: '180px'
  },
  {
    title: '联系人',
    dataIndex: 'Linker'
  },
  {
    title: '手机号',
    dataIndex: 'Phone'
  },
  {
    title: '公司电话',
    dataIndex: 'Tel'
  },
  {
    title: '邮箱',
    dataIndex: 'Email'
  },
  {
    title: '公司名称',
    dataIndex: 'Office',
    width: '200px'
  },
  {
    title: '申请的管理员用户名',
    dataIndex: 'UserName',
    width: '200px'
  },
  {
    title: '状态',
    dataIndex: 'UserState',
    scopedSlots: { customRender: 'UserState' }
  },
  {
    title: '证明图片',
    dataIndex: 'FilePath',
    scopedSlots: { customRender: 'FilePath' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '180px'
  }
]

export default {
  name: 'review-admin',

  data() {
    return {
      columns,
      dataSource: [],
      loading: false,
      pagination: {
        pagesize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '1000']
      },
      bigImgSrc: ''
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      GetManagerList().then(res => {
        let result = JSON.parse(res.d)
        if (result.Error) {
          this.$message.error('系统错误')
        } else {
          this.dataSource = result
        }
      })
    },

    reviewPass(username, phone) {
      this.$confirm({
        title: '确定审核通过吗？',
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: () => {
          ModifyUserState(username, 1, phone).then(res => {
            let response = JSON.parse(res.d)
            if (response.Error) {
              this.$message.error('系统错误')
            } else {
              this.$message.success('审核通过成功')
              this.fetchData()
            }
          })
        }
      })
    },

    reviewRefuse(username, phone) {
      this.$confirm({
        title: '确定审核不通过吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          ModifyUserState(username, 2, phone).then(res => {
            let response = JSON.parse(res.d)
            if (response.Error) {
              this.$message.error('系统错误')
            } else {
              this.$message.success('审核不通过成功')
              this.fetchData()
            }
          })
        }
      })
    },

    lookImg(src) {
      this.bigImgSrc = src
      document.querySelector('.big-img-wrapper').style.visibility = 'visible'
    },

    colseImg() {
      document.querySelector('.big-img-wrapper').style.visibility = 'hidden'
    }
  }
}
</script>

<style lang="less" scoped>
.review-admin {
  .action-btn {
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }

  .file-img-wrapper {
    max-width: 40px;
    max-height: 40px;
    min-width: 40px;
    min-height: 40px;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;

    &:hover {
      .mask {
        opacity: 1;
      }
    }
    .file-img {
      width: 40px;
      height: 40px;
    }
    .mask {
      width: 100%;
      height: 100%;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.55);
      position: absolute;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transition: all 0.3s;
    }
  }
}

.big-img-wrapper {
  position: fixed;
  min-width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  user-select: none;
  .big-img {
    min-height: 90vh;
    max-height: 90vh;
  }
}
</style>