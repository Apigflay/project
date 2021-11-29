<template>
  <div class="DetailDrawer">
    <a-drawer width="555" title="子任务详情" :visible="visible" :closable="false" @close="handleClose">
      <a-skeleton active :loading="loading" :paragraph="{ rows: 12 }">
        <a-descriptions title="任务信息" :column="1">
          <a-descriptions-item label="任务标题">{{ dataSource.taskTitle }} </a-descriptions-item>
          <a-descriptions-item label="任务id">{{ dataSource.id }} </a-descriptions-item>
          <a-descriptions-item label="任务类型"
            >{{ dataSource.routineType == null ? '非常规任务' : '常规任务' }}
          </a-descriptions-item>
          <a-descriptions-item label="任务分类"
            >{{ dataSource.taskType == 0 ? '可执行任务' : '组任务' }}
          </a-descriptions-item>
          <a-descriptions-item v-if="dataSource.routineType != null" label="常规监测数据类型">
            {{ dataSource.routineType | routineTypeFormat }}
          </a-descriptions-item>
          <a-descriptions-item v-if="dataSource.routineType == null" label="非常规监测类型名称">
            {{ dataSource.nonRoutineName }}
          </a-descriptions-item>
          <a-descriptions-item v-if="dataSource.routineType == null" label="非常规监测数据提交类型">
            {{ dataSource.dataSubmitType | dataSubmitTypeFormat }}
          </a-descriptions-item>
          <a-descriptions-item label="任务状态">{{ dataSource.taskStatus | taskStatusFormat }} </a-descriptions-item>
          <a-descriptions-item label="任务开始时间">{{ dataSource.startTime | unix2String }} </a-descriptions-item>
          <a-descriptions-item label="任务结束时间">{{ dataSource.stopTime | unix2String }} </a-descriptions-item>
          <a-descriptions-item label="测量时间段" v-if="dataSource.routineType !== 0 && dataSource.routineType != null"
            ><span v-for="(item, index) in dataSource.timeRanges" :key="index" style="padding-right: 6px">
              {{ `${item.rangeStart} - ${item.rangeEnd}` }}
            </span></a-descriptions-item
          >
          <a-descriptions-item label="备注">{{ dataSource.remark }} </a-descriptions-item>
        </a-descriptions>
      </a-skeleton>

      <a-skeleton active :loading="loading" :paragraph="{ rows: 7 }" style="margin-top: 24px">
        <a-descriptions title="测点信息" :column="1">
          <a-descriptions-item label="测点编号">{{ dataSource.measure.measureCode }} </a-descriptions-item>
          <a-descriptions-item label="测点名称">{{ dataSource.measure.measureName }} </a-descriptions-item>
          <a-descriptions-item label="省市区"
            >{{ dataSource.measure.provinceName }} {{ dataSource.measure.cityName }}
            {{ dataSource.measure.districtName }}
          </a-descriptions-item>
          <a-descriptions-item label="地址">{{ dataSource.measure.address }} </a-descriptions-item>
          <a-descriptions-item label="经度">{{ dataSource.measure.lon }} </a-descriptions-item>
          <a-descriptions-item label="纬度">{{ dataSource.measure.lat }} </a-descriptions-item>
        </a-descriptions>
      </a-skeleton>

      <a-skeleton active :loading="loading" :paragraph="{ rows: 5 }" style="margin-top: 24px">
        <a-descriptions title="任务最近记录" :column="1">
          <a-descriptions-item label="更新人账号">{{ dataSource.updateUser.username }} </a-descriptions-item>
          <a-descriptions-item label="更新人昵称">{{ dataSource.updateUser.nickname }} </a-descriptions-item>
          <a-descriptions-item label="更新人部门">{{ dataSource.updateUser.departmentName }} </a-descriptions-item>
          <a-descriptions-item label="更新时间">{{ dataSource.updateTime | unix2String }} </a-descriptions-item>

          <!-- <a-descriptions-item label="执行人账号">{{ dataSource.operateUser.username }} </a-descriptions-item>
          <a-descriptions-item label="执行人昵称">{{ dataSource.operateUser.nickname }} </a-descriptions-item>
          <a-descriptions-item label="执行人部门">{{ dataSource.operateUser.departmentName }} </a-descriptions-item> -->
          <!-- <a-descriptions-item label="已指派到的部门"
            >{{ dataSource.dispatchDept.departmentName }}
          </a-descriptions-item> -->
        </a-descriptions>
      </a-skeleton>

      <a-skeleton active :loading="loading" :paragraph="{ rows: 5 }" style="margin-top: 24px">
        <a-descriptions title="创建人信息" :column="1">
          <a-descriptions-item label="创建人账号">{{ dataSource.createUser.username }} </a-descriptions-item>
          <a-descriptions-item label="创建人昵称">{{ dataSource.createUser.nickname }} </a-descriptions-item>
          <a-descriptions-item label="创建人部门">{{ dataSource.createUser.departmentName }} </a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ dataSource.createTime | unix2String }} </a-descriptions-item>
        </a-descriptions>
      </a-skeleton>

      <a-skeleton active :loading="loading" :paragraph="{ rows: 4 }" style="margin-top: 24px">
        <a-descriptions title="执行人信息" :column="1">
          <a-descriptions-item label="执行人账号">{{ dataSource.operateUser.username }} </a-descriptions-item>
          <a-descriptions-item label="执行人昵称">{{ dataSource.operateUser.nickname }} </a-descriptions-item>
          <a-descriptions-item label="执行人部门">{{ dataSource.operateUser.departmentName }} </a-descriptions-item>
        </a-descriptions>
      </a-skeleton>
    </a-drawer>
  </div>
</template>

<script>
import { getTaskDetail } from '@/api/api'
export default {
  name: 'DetailDrawer',

  props: ['visible', 'recordId'],

  data() {
    return {
      dataSource: {
        createUser: {},
        operateUser: {},
        updateUser: {},
        measure: {},
        dispatchDept: {},
      },
      loading: false,
    }
  },

  watch: {
    visible(value) {
      if (value === true) {
        this.loading = true
        getTaskDetail(this.recordId)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.dataSource = response;
              this.adaptiveData()
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

    adaptiveData() {
      if (!this.dataSource.createUser) {
        this.dataSource.createUser = {}
      }
      if (!this.dataSource.operateUser) {
        this.dataSource.operateUser = {}
      }
      if (!this.dataSource.updateUser) {
        this.dataSource.updateUser = {}
      }
      if (!this.dataSource.measure) {
        this.dataSource.measure = {}
      }
      // if (!this.dataSource.dispatchDept) {
      //   this.dataSource.measure = {}
      // }
    },
  },
}
</script>

