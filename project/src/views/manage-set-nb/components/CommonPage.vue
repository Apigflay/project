<template>
  <div class="user-manage-nb">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>{{ `${pageKey}管理` }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">
        <span>{{ `${pageKey}管理` }}</span>
        <a-button
          v-if="pageKey !== '权限' && pageKey !== '配置'"
          type="primary"
          style="margin-left: 24px"
          @click="clickAdd"
          >{{ `创建${pageKey}` }}</a-button
        >
      </div>
    </div>

    <div class="page-common-content">
      <div v-if="pageKey === '仪器'">
        <a-form :model="searchForm" layout="inline">
          <a-form-model-item label="仪器串号" style="margin-bottom: 24px">
            <a-input v-model="searchForm.noiseMeasureID" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
          </a-form-model-item>
        </a-form>

        <a-table
          :columns="columnsInstrument"
          :data-source="data"
          :pagination="page"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          @change="handleTableChange"
        >
          <template slot="deviceClassify" slot-scope="deviceClassify">{{
            deviceClassify | deviceClassifyFormat
          }}</template>
          <template slot="deviceUsage" slot-scope="deviceUsage">{{ deviceUsage | deviceUsageFormat }}</template>
          <template slot="productionDate" slot-scope="productionDate">{{ productionDate | unix2String }}</template>
          <template slot="validity" slot-scope="validity">{{ validity }} </template>

          <template slot="readOct" slot-scope="readOct">{{ readOct | booleanFormat }}</template>
          <template slot="readOct13" slot-scope="readOct13">{{ readOct13 | booleanFormat }}</template>
          <template slot="readSta" slot-scope="readSta">{{ readSta | booleanFormat }}</template>
          <template slot="readLeq1s" slot-scope="readLeq1s">{{ readLeq1s | booleanFormat }}</template>
          <template slot="readLp" slot-scope="readLp">{{ readLp | booleanFormat }}</template>
          <template slot="readWeather" slot-scope="readWeather">{{ readWeather | booleanFormat }}</template>
          <template slot="readCar" slot-scope="readCar">{{ readCar | booleanFormat }}</template>
          <template slot="readDust" slot-scope="readDust">{{ readDust | booleanFormat }}</template>

          <template slot="action" slot-scope="text, record">
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record.id)">修改</a-button>
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '历史绑定测点')"
              >历史绑定测点</a-button
            >
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '仪器维修记录')"
              >仪器维修记录</a-button
            >
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '仪器检定记录')"
              >仪器检定记录</a-button
            >
            <a-button type="danger" size="small" style="margin: 0px 8px 8px 0px" @click="clickDelete(record.id)"
              >删除</a-button
            >
          </template>
        </a-table>
      </div>

      <div v-if="pageKey === '校准器'">
        <a-form :model="searchForm" layout="inline">
          <a-form-model-item label="校准器编号" style="margin-bottom: 24px">
            <a-input v-model="searchForm.calibrationDeviceNo" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
          </a-form-model-item>
        </a-form>

        <a-table
          :columns="columnsCalibrator"
          :data-source="data"
          :pagination="page"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          @change="handleTableChange"
        >
          <template slot="validity" slot-scope="validity">{{ validity }}</template>
          <template slot="productionDate" slot-scope="productionDate">{{ productionDate | unix2String }}</template>

          <template slot="action" slot-scope="text, record">
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record.id)">修改</a-button>
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '校准器维修记录')"
              >校准器维修记录</a-button
            >
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '校准器检定记录')"
              >校准器检定记录</a-button
            >
            <a-button type="danger" size="small" style="margin: 0px 8px 8px 0px" @click="clickDelete(record.id)"
              >删除</a-button
            >
          </template>
        </a-table>
      </div>

      <a-table
        v-if="pageKey === '道路'"
        :columns="columnsRoad"
        :data-source="data"
        :pagination="page"
        :rowKey="(record) => record.id"
        :loading="tableLoading"
        @change="handleTableChange"
      >
        <template slot="roadType" slot-scope="roadType">{{ roadType | roadTypeFormat }}</template>
        <template slot="roadLength" slot-scope="roadLength">{{ roadLength | NumberFormat }}</template>

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="clickModify(record.id)">修改</a-button>
            <a-button type="danger" size="small" @click="clickDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table>

      <div v-if="pageKey === '测点'">
        <a-form :model="searchForm" layout="inline">
          <a-form-model-item label="测点编号" style="margin-bottom: 24px">
            <a-input v-model="searchForm.measureCode" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item label="测点名称" style="margin-bottom: 24px">
            <a-input v-model="searchForm.measureName" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item label="测点区域" style="margin-bottom: 24px">
            <!-- <AreaSelectAsync v-model="searchForm.area" :adCode.sync="searchForm.adCode" /> -->
            <DropDownMeasAsync v-model="searchForm.area" :adCode.sync="searchForm.adCode"></DropDownMeasAsync>
          </a-form-model-item>

          <a-form-model-item label="噪声类型" style="margin-bottom: 24px">
            <NoiseTypeSelect v-model="searchForm.noiseType" style="width: 193px" />
          </a-form-model-item>

          <!-- <a-form-model-item label="所在部门" style="margin-bottom: 24px">
            <DepartmentTreeSelect v-model="searchForm.deptId" style="width: 200px" placeholder="搜索部门" />
          </a-form-model-item> -->

          <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
          </a-form-model-item>
        </a-form>

        <a-table
          :columns="columnsMeasure"
          :data-source="data"
          :pagination="page"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          @change="handleTableChange"
        >
          <template slot="area" slot-scope="text, record">{{
            `${record.provinceName}${record.cityName}${record.districtName}`
          }}</template>
          <template slot="funCode" slot-scope="funCode">{{ funCode | funcodeFormat }}</template>
          <template slot="noiseType" slot-scope="noiseType">{{ noiseType | noiseTypeFormat }}</template>

          <template slot="action" slot-scope="text, record">
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record.id)"
              >修改</a-button>
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="bindInstrument(record.id)"
              >绑定仪器</a-button>
            <a-button type="danger" size="small" style="margin: 0px 8px 8px 0px" @click="clickDelete(record.id)"
              >删除</a-button>
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '历史绑定仪器')"
              >历史绑定仪器</a-button>
          </template>
        </a-table>
      </div>

      <a-table
        v-if="pageKey === '权限'"
        :columns="columnsAuth"
        :data-source="data"
        :pagination="page"
        :rowKey="(record) => record.id"
        :loading="tableLoading"
        @change="handleTableChange"
      ></a-table>

      <div v-if="pageKey === '角色'">
        <a-form :model="searchForm" layout="inline">
          <a-form-model-item label="角色名称" style="margin-bottom: 24px">
            <a-input v-model="searchForm.nameLike" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item label="角色状态" style="margin-bottom: 24px">
            <a-select
              v-model="searchForm.status"
              placeholder="请选择"
              allowClear
              :defaultActiveFirstOption="false"
              style="width: 120px"
            >
              <a-select-option :value="0">禁用</a-select-option>
              <a-select-option :value="1">启用</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="创建时间" style="margin-bottom: 24px">
            <a-range-picker
              v-model="searchForm.dateRange"
              :ranges="{
                今天: [moment().startOf('day'), moment().endOf('day')],
                本周: [moment().startOf('week'), moment().endOf('week')],
                本月: [moment().startOf('month'), moment().endOf('month')],
                本年: [moment().startOf('year'), moment().endOf('year')],
              }"
              :allowClear="true"
              format="YYYY-MM-DD HH:mm:ss"
              :showTime="{
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }"
            />
          </a-form-model-item>

          <!-- <a-form-model-item label="所在部门" style="margin-bottom: 24px">
            <DepartmentTreeSelect v-model="searchForm.deptId" style="width: 200px" placeholder="搜索部门" />
          </a-form-model-item> -->

          <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
          </a-form-model-item>
        </a-form>

        <a-table
          :columns="columnsRole"
          :data-source="data"
          :pagination="page"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          @change="handleTableChange"
        >
          <template slot="status" slot-scope="status">
            <span :style="{ color: status ? '#87d068' : '#C0C4CC' }">{{ status | stateFormat }}</span>
          </template>
          <template slot="createTime" slot-scope="createTime">{{ createTime | unix2String }}</template>
          <template slot="updateTime" slot-scope="updateTime">{{ updateTime | unix2String }}</template>

          <template slot="action" slot-scope="text, record">
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record.id)">修改</a-button>
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickBan(record.id, record.status)">{{
              record.status == 0 ? '启用' : '禁用'
            }}</a-button>
            <a-button type="danger" size="small" style="margin: 0px 8px 8px 0px" @click="clickDelete(record.id)"
              >删除</a-button
            >
          </template>
        </a-table>
      </div>

      <div v-if="pageKey === '用户'">
        <a-form :model="searchForm" layout="inline">
          <a-form-model-item label="账号" style="margin-bottom: 24px">
            <a-input v-model="searchForm.nameLike" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item label="昵称" style="margin-bottom: 24px">
            <a-input v-model="searchForm.nickNameLike" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item label="用户状态" style="margin-bottom: 24px">
            <a-select
              v-model="searchForm.status"
              placeholder="请选择"
              allowClear
              :defaultActiveFirstOption="false"
              style="width: 120px"
            >
              <a-select-option :value="0">禁用</a-select-option>
              <a-select-option :value="1">启用</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="所在部门" style="margin-bottom: 24px">
            <DepartmentTreeSelect v-model="searchForm.deptId" style="width: 200px" placeholder="搜索部门" />
          </a-form-model-item>

          <a-form-model-item label="下级部门" style="margin-bottom: 24px">
            <a-select v-model="searchForm.deptScope" style="width: 120px">
              <a-select-option :value="0">不包括</a-select-option>
              <a-select-option :value="1">包括</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
          </a-form-model-item>
        </a-form>

        <a-table
          :columns="columnsUser"
          :data-source="data"
          :pagination="page"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          @change="handleTableChange"
        >
          <template slot="status" slot-scope="status">
            <span :style="{ color: status ? '#87d068' : '#C0C4CC' }">{{ status | stateFormat }}</span>
          </template>
          <template slot="createTime" slot-scope="createTime">{{ createTime | unix2String }}</template>
          <template slot="updateTime" slot-scope="updateTime">{{ updateTime | unix2String }}</template>

          <template slot="action" slot-scope="text, record">
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record.id, '基本信息')"
              >修改基本信息</a-button
            >
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record.id, '角色')"
              >修改角色</a-button
            >
            <a-button
              size="small"
              style="margin: 0px 8px 8px 0px"
              @click="clickModifyDepartment(record.id, record.deptId)"
              >修改部门</a-button
            >
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickResetPassword(record.id)"
              >修改密码</a-button
            >
            <a-button type="danger" size="small" style="margin: 0px 8px 8px 0px" @click="clickDelete(record.id)"
              >删除</a-button
            >
          </template>
        </a-table>
      </div>

      <a-table
        v-if="pageKey === '配置'"
        :columns="columnsConfig"
        :data-source="data"
        :pagination="page"
        :rowKey="(record) => record.settingKey"
        :loading="tableLoading"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, record">
          <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record)">修改</a-button>
        </template>
      </a-table>

      <div v-if="pageKey === '任务'">
        <a-form :model="searchForm" layout="inline">
          <a-radio-group v-model="searchForm.type" style="margin-bottom: 24px" @change="clickSearch">
            <a-radio-button :value="0"> 待提交 <a-badge :count="countArr[0]" /></a-radio-button>
            <a-radio-button :value="1"> 待领取 <a-badge :count="countArr[1]" /></a-radio-button>
            <a-radio-button :value="2"> 待审批 <a-badge :count="countArr[2]" /></a-radio-button>
            <a-radio-button :value="3"> 待发布 <a-badge :count="countArr[3]" /></a-radio-button>
            <a-radio-button :value="4"> 进行中 <a-badge :count="countArr[4]" /></a-radio-button>
            <a-radio-button :value="5"> 已关闭 <a-badge :count="countArr[5]" /></a-radio-button>
          </a-radio-group>
        </a-form>

        <a-table
          :columns="columnsTask"
          :data-source="data"
          :pagination="page"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          :scroll="{ x: 1800 }"
          @change="handleTableChange"
        >
          <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
          <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
          <template slot="createTime" slot-scope="createTime">{{ createTime | unix2String }}</template>
          <template slot="updateTime" slot-scope="updateTime">{{ updateTime | unix2String }}</template>
          <template slot="routineType" slot-scope="routineType">{{ routineType | routineTypeFormat }}</template>
          <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template>
          <template slot="dataSubmitType" slot-scope="dataSubmitType">{{
            dataSubmitType | dataSubmitTypeFormat
          }}</template>
          <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>

          <template slot="action" slot-scope="text, record">
            <a-space>
              <a-button v-if="searchForm.type === 3" size="small" @click="clickModify(record.id)">修改</a-button>
              <a-button size="small" @click="handleMenuClick(record.id, '详情')">详情</a-button>
              <a-button size="small" v-if="searchForm.type === 3" @click="handleMenuClick(record.id, '发布')"
                >发布</a-button
              >
              <a-button
                v-if="searchForm.type === 5"
                size="small"
                @click="handleMenuClick(record.id, '导出报表', record)"
                >导出报表</a-button
              >
              <a-button v-if="searchForm.type === 3" type="danger" size="small" @click="clickDelete(record.id)"
                >删除</a-button
              >
              <a-dropdown>
                <a-button size="small">· · ·</a-button>
                <a-menu slot="overlay">
                  <a-menu-item v-if="searchForm.type === 1" @click="handleMenuClick(record.id, '指派')">
                    <a>分 派</a>
                  </a-menu-item>

                  <a-menu-item @click="handleMenuClick(record.id, '审核')">
                    <a>审 核</a>
                  </a-menu-item>

                  <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                    <a>审核记录</a>
                  </a-menu-item>

                  <a-menu-item @click="handleMenuClick(record.id, '当前审核的子任务')">
                    <a>当前审核的子任务</a>
                  </a-menu-item>

                  <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                    <a>操作记录</a>
                  </a-menu-item>

                  <a-menu-item @click="handleMenuClick(record.id, '撤销')">
                    <a>撤 销</a>
                  </a-menu-item>

                  <a-menu-item v-if="record.routineType == null" @click="handleMenuClick(record.id, '拒绝')">
                    <a>拒 绝</a>
                  </a-menu-item>

                  <a-menu-item @click="handleMenuClick(record.id, '接收')">
                    <a>接 收</a>
                  </a-menu-item>

                  <a-menu-item
                    v-if="record.routineType == null && searchForm.type === 1"
                    @click="handleMenuClick(record.id, '领取')"
                  >
                    <a>领 取</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-space>
          </template>
        </a-table>
      </div>

      <div v-if="pageKey === '风速仪'">
        <a-form :model="searchForm" layout="inline">
          <a-form-model-item label="风速仪编号" style="margin-bottom: 24px">
            <a-input v-model="searchForm.windDeviceNo" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item label="风速仪型号" style="margin-bottom: 24px">
            <a-input v-model="searchForm.windDeviceType" placeholder="请输入" allowClear></a-input>
          </a-form-model-item>

          <a-form-model-item style="margin-bottom: 24px">
            <a-button type="primary" @click="clickSearch" style="margin-right: 8px">搜索</a-button>
            <a-button @click="clickReset">重置</a-button>
          </a-form-model-item>
        </a-form>

        <a-table
          :columns="columnsAnemograph"
          :data-source="data"
          :pagination="page"
          :rowKey="(record) => record.id"
          :loading="tableLoading"
          @change="handleTableChange"
        >
          <template slot="validity" slot-scope="validity">{{ validity }}</template>
          <template slot="productionDate" slot-scope="productionDate">{{ productionDate | unix2String }}</template>

          <template slot="action" slot-scope="text, record">
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="clickModify(record.id)">修改</a-button>
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '风速仪维修记录')"
              >风速仪维修记录</a-button
            >
            <a-button size="small" style="margin: 0px 8px 8px 0px" @click="lookTableModal(record, '风速仪检定记录')"
              >风速仪检定记录</a-button
            >
            <a-button type="danger" size="small" style="margin: 0px 8px 8px 0px" @click="clickDelete(record.id)"
              >删除</a-button
            >
          </template>
        </a-table>
      </div>
    </div>

    <CommonModal
      :visible.sync="modalVisible"
      :pageKey="pageKey"
      :operate="operate"
      :modalData="modalData"
      :keyword="keyword"
      @fetchData="fetchData"
    />
    <SecondaryModal
      :visible.sync="secondaryModalVisible"
      :modalKey="modalKey"
      :recordId="recordId"
      @fetchData="fetchData"
    />
    <BindInstrumentModal :visible.sync="bindInstrumentModalVisible" :modalData="modalData" />
    <ResetPasswordModal :visible.sync="resetPasswordModalVisible" :recordId="recordId" />
    <TableModal :visible.sync="tableModalVisible" :recordId="recordId" :modalKey="modalKey" :commonModalData="modalData" />
    <ModifyDepartmentModal
      :visible.sync="modifyDepartmentModalVisible"
      :recordId="recordId"
      :departmentId="departmentId"
      @fetchData="fetchData"
    />
    <DetailDrawer :visible.sync="detailDrawerVisible" :recordId="recordId" />
  </div>
</template>

<script>
import {
  //仪器
  getInstrumentList,
  getInstrument,
  deleteInstrument,

  //校准器
  getCalibratorList,
  getCalibrator,
  deleteCalibrator,

  //道路
  getRoadList,
  getRoad,
  deleteRoad,

  //测点
  getMeasureManageList,
  getMeasure,
  deleteMeasure,

  //权限
  getAuthList,

  //角色
  getRoleList,
  deleteRole,
  getRole,
  banRole,

  //用户
  getUserList,
  deleteUser,
  getUserinfoById,
  getCert,

  //配置
  getConfigList,

  //任务
  getHomeTaskList,
  deleteTask,
  getTaskDetail,
  revokeTask,
  publishTask,
  refuseTask,
  acceptTask,
  claimTask,
  exportReport,

  //风速仪
  getAnemographList,
  deleteAnemograph,
  getAnemograph,
} from '@/api/api'

import moment from 'moment'
import CommonModal from './CommonModal'
import SecondaryModal from './SecondaryModal'
import BindInstrumentModal from './BindInstrumentModal'
import ResetPasswordModal from './ResetPasswordModal'
import ModifyDepartmentModal from './ModifyDepartmentModal'
import TableModal from './TableModal'
import DeviceTypeSelect from '@/views/manage-set-nb/components/DeviceTypeSelect'
import DepartmentTreeSelect from '@/views/manage-set-nb/components/DepartmentTreeSelect'
import NoiseTypeSelect from '@/views/manage-set-nb/components/NoiseTypeSelect'
import DetailDrawer from '@/views/manage-set-nb/components/DetailDrawer'
import AreaSelectAsync from '@/views/manage-set-nb/components/AreaSelectAsync'
import DropDownMeasAsync from '@/views/manage-set-nb/components/DropDownMeasAsync';

const columnsInstrument = [
  {
    dataIndex: 'noiseMeasureID',
    title: '仪器串号',
  },
  {
    dataIndex: 'linkPort',
    title: '端口',
  },
  {
    dataIndex: 'deviceUsage',
    title: '使用方式',
    scopedSlots: { customRender: 'deviceUsage' },
  },
  {
    dataIndex: 'deviceClassify',
    title: '仪器类型',
    scopedSlots: { customRender: 'deviceClassify' },
  },
  {
    dataIndex: 'deviceTypeName',
    title: '仪器型号',
  },
  {
    dataIndex: 'password',
    title: '密码',
  },

  {
    dataIndex: 'producer',
    title: '生产厂家',
  },
  {
    dataIndex: 'productionDate',
    title: '出厂日期',
    scopedSlots: { customRender: 'productionDate' },
  },
  {
    dataIndex: 'verificationRecord.validity',
    title: '检定有效期(月)',
    scopedSlots: { customRender: 'validity' },
  },
  {
    dataIndex: 'verificationRecord.accuracy',
    title: '精度',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const columnsCalibrator = [
  {
    dataIndex: 'calibrationDeviceNo',
    title: '校准器编号',
  },
  // {
  //   dataIndex: 'calibrationDeviceType',
  //   title: '校准器型号type',
  //   scopedSlots: { customRender: 'calibrationDeviceType' }
  // },
  {
    dataIndex: 'calibrationDeviceType',
    title: '校准器型号',
  },
  {
    dataIndex: 'producer',
    title: '生产厂家',
  },
  {
    dataIndex: 'productionDate',
    title: '出厂日期',
    scopedSlots: { customRender: 'productionDate' },
  },
  {
    dataIndex: 'verificationRecord.validity',
    title: '检定有效期(月)',
    scopedSlots: { customRender: 'validity' },
  },
  {
    dataIndex: 'verificationRecord.value',
    title: '检定示值(dB)',
  },
  {
    dataIndex: 'verificationRecord.accuracy',
    title: '精度',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const columnsAnemograph = [
  {
    dataIndex: 'windDeviceNo',
    title: '风速仪编号',
  },
  {
    dataIndex: 'windDeviceType',
    title: '风速仪型号',
  },
  {
    dataIndex: 'producer',
    title: '生产厂家',
  },
  {
    dataIndex: 'productionDate',
    title: '出厂日期',
    scopedSlots: { customRender: 'productionDate' },
  },
  {
    dataIndex: 'verificationRecord.validity',
    title: '检定有效期(月)',
    scopedSlots: { customRender: 'validity' },
  },
  {
    dataIndex: 'verificationRecord.accuracy',
    title: '精度',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const columnsRoad = [
  {
    dataIndex: 'roadName',
    title: '道路名称',
  },
  {
    dataIndex: 'roadType',
    title: '道路类型',
    scopedSlots: { customRender: 'roadType' },
  },
  {
    dataIndex: 'roadLength',
    title: '道路长度(米)',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const columnsMeasure = [
  {
    dataIndex: 'measureCode',
    title: '测点编号',
  },
  {
    dataIndex: 'measureName',
    title: '测点名称',
  },
  {
    dataIndex: 'noiseType',
    title: '噪声类型',
    scopedSlots: { customRender: 'noiseType' },
  },
  {
    dataIndex: 'funCode',
    title: '功能区代码',
    scopedSlots: { customRender: 'funCode' },
  },
  {
    dataIndex: 'area',
    title: '区域',
    scopedSlots: { customRender: 'area' },
  },
  {
    dataIndex: 'adCode',
    title: '区域编码',
  },
  {
    dataIndex: 'address',
    title: '详细地址',
    width: 200,
  },
  {
    dataIndex: 'lon',
    title: '经度',
  },
  {
    dataIndex: 'lat',
    title: '纬度',
  },
  // {
  //   dataIndex: 'deptName',
  //   title: '创建部门',
  // },
  {
    dataIndex: 'nickname',
    title: '创建人',
  },

  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' },
  },
]

const columnsUser = [
  {
    dataIndex: 'username',
    title: '账号',
  },
  {
    dataIndex: 'nickname',
    title: '昵称',
  },
  {
    dataIndex: 'status',
    title: '用户状态',
    scopedSlots: { customRender: 'status' },
  },
  {
    dataIndex: 'department.departmentName',
    title: '所在部门',
  },
  {
    dataIndex: 'identityCardNo',
    title: '身份证号',
  },
  {
    dataIndex: 'qualificationCertificate',
    title: '从业资格说明',
    ellipsis: true,
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
    scopedSlots: { customRender: 'createTime' },
  },
  // {
  //   dataIndex: 'createBy',
  //   title: '创建人id'
  // },
  {
    dataIndex: 'updateTime',
    title: '更新时间',
    scopedSlots: { customRender: 'updateTime' },
  },
  // {
  //   dataIndex: 'updateBy',
  //   title: '更新人id'
  // },
  {
    dataIndex: 'remark',
    title: '备注',
    ellipsis: true,
  },

  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: '200px',
  },
]

const columnsAuth = [
  // {
  //   dataIndex: 'id',
  //   title: 'id'
  // },
  {
    dataIndex: 'authorName',
    title: '权限名称',
  },
  // {
  //   dataIndex: 'perms',
  //   title: '权限字符串',
  // },
  {
    dataIndex: 'remark',
    title: '备注',
  },
]

const columnsRole = [
  // {
  //   dataIndex: 'id',
  //   title: 'id'
  // },
  {
    dataIndex: 'roleName',
    title: '角色名称',
  },
  // {
  //   dataIndex: 'roleKey',
  //   title: '角色关键字'
  // },
  {
    dataIndex: 'status',
    title: '角色状态',
    scopedSlots: { customRender: 'status' },
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
    scopedSlots: { customRender: 'createTime' },
  },
  // {
  //   dataIndex: 'updateTime',
  //   title: '更新时间',
  //   scopedSlots: { customRender: 'updateTime' }
  // },
  {
    dataIndex: 'createUser.username',
    title: '创建账号',
  },
  {
    dataIndex: 'createUser.nickname',
    title: '创建昵称',
  },
  {
    dataIndex: 'department.departmentName',
    title: '创建部门',
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const columnsConfig = [
  {
    dataIndex: 'remark',
    title: '描述',
  },
  {
    dataIndex: 'settingValue',
    title: '值',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

const columnsTask = [
  // {
  //   dataIndex: 'id',
  //   title: 'id',
  // },
  {
    dataIndex: 'taskTitle',
    title: '任务标题',
  },
  {
    dataIndex: 'taskType',
    title: '任务分类',
    scopedSlots: { customRender: 'taskType' },
  },
  {
    dataIndex: 'taskStatus',
    title: '任务状态',
    scopedSlots: { customRender: 'taskStatus' },
  },
  {
    dataIndex: 'routineType',
    title: '常规监测数据类型',
    scopedSlots: { customRender: 'routineType' },
  },
  {
    dataIndex: 'nonRoutineName',
    title: '非常规监测类型名称',
  },
  {
    dataIndex: 'dataSubmitType',
    title: '非常规监测数据提交类型',
    scopedSlots: { customRender: 'dataSubmitType' },
  },
  // {
  //   dataIndex: 'measure.measureCode',
  //   title: '测点编号',
  // },
  // {
  //   dataIndex: 'measure.measureName',
  //   title: '测点名称',
  // },

  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },
  // {
  //   dataIndex: 'createTime',
  //   title: '创建时间',
  //   scopedSlots: { customRender: 'createTime' },
  // },
  // {
  //   dataIndex: 'updateTime',
  //   title: '更新时间',
  //   scopedSlots: { customRender: 'updateTime' },
  // },
  // {
  //   dataIndex: 'createUser.username',
  //   title: '创建人账号',
  // },
  // {
  //   dataIndex: 'createUser.nickname',
  //   title: '创建人昵称',
  // },
  // {
  //   dataIndex: 'createDept.departmentName',
  //   title: '创建人部门',
  // },
  // {
  //   dataIndex: 'operateUser.username',
  //   title: '执行人账号',
  // },
  // {
  //   dataIndex: 'operateUser.nickname',
  //   title: '执行人昵称',
  // },
  // {
  //   dataIndex: 'dispatchDept.departmentName',
  //   title: '当前处理部门',
  // },
  // {
  //   dataIndex: 'updateUser.username',
  //   title: '更新人账号',
  // },
  // {
  //   dataIndex: 'updateUser.nickname',
  //   title: '更新人昵称',
  // },

  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'CommonPage',

  components: {
    CommonModal,
    SecondaryModal,
    BindInstrumentModal,
    ResetPasswordModal,
    ModifyDepartmentModal,
    TableModal,
    DeviceTypeSelect,
    DepartmentTreeSelect,
    NoiseTypeSelect,
    DetailDrawer,
    AreaSelectAsync,
    DropDownMeasAsync,
  },

  props: ['pageKey'],

  data() {
    return {
      tableLoading: false,

      modalVisible: false,
      secondaryModalVisible: false,
      bindInstrumentModalVisible: false,
      resetPasswordModalVisible: false,
      modifyDepartmentModalVisible: false,
      tableModalVisible: false,
      operate: '',
      modalData: {},
      modalKey: '',
      recordId: '',
      keyword: '',
      departmentId: '',

      data: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '500'],
      },

      columnsInstrument,
      columnsRoad,
      columnsMeasure,
      columnsUser,
      columnsAuth,
      columnsRole,
      columnsConfig,
      columnsCalibrator, //校准器columns
      columnsTask,
      columnsAnemograph,

      searchForm: {
        measureCode: undefined,
        measureName: undefined,

        noiseMeasureID: undefined,
        deviceType: undefined,

        status: undefined,
        nameLike: undefined,
        nickNameLike: undefined,
        deptId: this.$store.state.user.userinfo.department.id,
        deptScope: 0,
        dateRange: [],
        noiseType: undefined,
        calibrationDeviceNo: undefined,
        windDeviceNo: undefined,
        windDeviceType: undefined,
        adCode: undefined,
        type: 0,
      },

      countArr: [],

      detailDrawerVisible: false,
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    moment,

    clickSearch() {
      this.page.current = 1
      this.fetchData()
    },

    clickReset() {
      this.searchForm = {
        measureCode: undefined,
        measureName: undefined,

        noiseMeasureID: undefined,
        deviceType: undefined,

        status: undefined,
        nameLike: undefined,
        nickNameLike: undefined,
        deptId: this.$store.state.user.userinfo.department.id,
        deptScope: 0,
        dateRange: [],
        noiseType: undefined,
        calibrationDeviceNo: undefined,
        windDeviceNo: undefined,
        windDeviceType: undefined,
        adCode: undefined,
        type: 0,
      }
      this.clickSearch()
    },

    async fetchData() {
      this.tableLoading = true
      if (this.pageKey === '仪器') {
        getInstrumentList({
          page: {
            size: this.page.pageSize,
            current: this.page.current,
          },
          keys: {
            noiseMeasureID: this.searchForm.noiseMeasureID,
            deviceType: this.searchForm.deviceType,
          },
        })
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.records
              this.page.total = response.total
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '校准器') {
        getCalibratorList({
          page: {
            size: this.page.pageSize,
            current: this.page.current,
          },
          keys: {
            calibrationDeviceNo: this.searchForm.calibrationDeviceNo,
          },
        })
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.records
              this.page.total = response.total
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '风速仪') {
        getAnemographList({
          page: {
            size: this.page.pageSize,
            current: this.page.current,
          },
          keys: {
            windDeviceNo: this.searchForm.windDeviceNo,
            windDeviceType: this.searchForm.windDeviceType,
          },
        })
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.records
              this.page.total = response.total
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '道路') {
        getRoadList()
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
              this.page.total = response.dataList.length
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '测点') {
        getMeasureManageList({
          page: {
            size: this.page.pageSize,
            current: this.page.current,
          },
          keys: {
            measureCode: this.searchForm.measureCode,
            measureName: this.searchForm.measureName,
            noiseType: this.searchForm.noiseType,
            adCode: this.searchForm.adCode,
            deptId: this.searchForm.deptId,
          },
        })
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.records
              this.page.total = response.total
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '用户') {
        let params = { ...this.searchForm }
        getUserList({
          page: {
            size: this.page.pageSize,
            current: this.page.current,
          },
          keys: {
            status: params.status,
            nameLike: params.nameLike,
            nickNameLike: params.nickNameLike,
            deptId: params.deptId,
            deptScope: params.deptScope,
          },
        })
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.records
              this.page.total = response.total
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '权限') {
        getAuthList()
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
              this.page.total = this.data.length
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '角色') {
        let params = {}
        params.status = this.searchForm.status
        params.nameLike = this.searchForm.nameLike
        params.id = this.searchForm.deptId
        if (this.searchForm.dateRange.length > 0) {
          params.startTime = this.searchForm.dateRange[0].valueOf()
          params.stopTime = this.searchForm.dateRange[1].valueOf()
        } else {
          params.startTime = undefined
          params.stopTime = undefined
        }
        getRoleList(params)
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
              this.page.total = this.data.length
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '配置') {
        getConfigList()
          .then(({ error, response }) => {
            if (error.code === 0) {
              this.data = response.dataList
              this.page.total = this.data.length
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      }

      if (this.pageKey === '任务') {
        // let { error, response } = await getHomeTaskList({
        //   page: {
        //     size: this.page.pageSize,
        //     current: this.page.current,
        //   },
        //   keys: {
        //     type: this.searchForm.type,
        //   },
        // })
        // if (error.code === 0) {
        //   this.data = response.records
        //   this.page.total = response.total
        // }

        let promises = [0, 1, 2, 3, 4, 5].map((item) =>
          getHomeTaskList({
            page: {
              size: this.page.pageSize,
              current: this.page.current,
            },
            keys: {
              type: item,
            },
          }),
        )
        let result = await Promise.all(promises)
        result.forEach((item, index) => {
          if (item.error.code === 0) {
            this.countArr[index] = item.response.total
          }
        })
        this.data = result[this.searchForm.type].response.records
        this.page.total = result[this.searchForm.type].response.total
      }
      this.tableLoading = false
    },

    handleTableChange(pagination, filters, sorter) {
      this.page = { ...pagination }
      this.fetchData()
    },

    clickAdd() {
      this.modalVisible = true
      this.operate = '创建'
    },

    //绑定仪器
    bindInstrument(id) {
      this.bindInstrumentModalVisible = true
      this.modalData = {
        measureId: id,
      }
    },

    lookTableModal(record, modalKey) {
      this.tableModalVisible = true
      this.recordId = record.id
      this.modalKey = modalKey
      this.modalData = record
    },

    clickBan(id, status) {
      let param = {
        id,
        status: status == 0 ? 1 : 0,
      }
      banRole(param).then(({ error, response }) => {
        if (error.code === 0) {
          this.$message.success(`${status == 0 ? '启用' : '禁用'}成功`)
          this.fetchData()
        }
      })
    },

    clickResetPassword(id) {
      this.recordId = id
      this.resetPasswordModalVisible = true
    },

    clickModifyDepartment(id, departmentId) {
      this.modifyDepartmentModalVisible = true
      this.recordId = id
      this.departmentId = departmentId
    },

    clickModify(id, keyword) {
      if (this.pageKey === '仪器') {
        getInstrument(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }

      if (this.pageKey === '校准器') {
        getCalibrator(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }

      if (this.pageKey === '风速仪') {
        getAnemograph(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }

      if (this.pageKey === '道路') {
        getRoad(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }

      if (this.pageKey === '测点') {
        getMeasure(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }

      if (this.pageKey === '角色') {
        getRole(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }

      if (this.pageKey === '用户') {
        getUserinfoById(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.keyword = keyword
            this.operate = '修改'
            getCert({ id }).then(({ error, response }) => {
              if (error.code === 0) {
                this.modalData.qualificationCertificateUrl = response.qualificationCertificateUrl
                this.modalData.certificateValidDate = response.certificateValidDate
                  ? moment(response.certificateValidDate)
                  : undefined
                this.modalVisible = true
              }
            })
          }
        })
      }

      if (this.pageKey === '配置') {
        this.modalData = id
        this.modalVisible = true
        this.operate = '修改'
      }

      if (this.pageKey === '任务') {
        getTaskDetail(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
      }
    },

    clickDelete(id) {
      this.$confirm({
        title: '确定删除吗？',
        okType: 'danger',
        onOk: () => {
          return new Promise((resolve, reject) => {
            if (this.pageKey === '仪器') {
              deleteInstrument(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (this.pageKey === '校准器') {
              deleteCalibrator(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (this.pageKey === '风速仪') {
              deleteAnemograph(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (this.pageKey === '道路') {
              deleteRoad(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (this.pageKey === '测点') {
              deleteMeasure(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (this.pageKey === '角色') {
              deleteRole(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (this.pageKey === '用户') {
              deleteUser(id)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }

            if (this.pageKey === '任务') {
              deleteTask([id])
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('删除成功')
                    this.fetchData()
                  }
                })
                .finally(() => {
                  resolve()
                })
            }
          })
        },
      })
    },

    async handleMenuClick(id, operate, record) {
      if (operate === '详情') {
        this.detailDrawerVisible = true
        this.recordId = id
        return
      }

      if (operate === '指派') {
        this.secondaryModalVisible = true
        this.modalKey = '指派'
        this.recordId = id
        return
      }

      if (operate === '审核') {
        this.secondaryModalVisible = true
        this.modalKey = '审核'
        this.recordId = id
        return
      }

      if (operate === '审核记录') {
        this.tableModalVisible = true
        this.modalKey = '审核记录'
        this.recordId = id
        return
      }

      if (operate === '操作记录') {
        this.tableModalVisible = true
        this.modalKey = '操作记录'
        this.recordId = id
        return
      }

      if (operate === '当前审核的子任务') {
        this.tableModalVisible = true
        this.modalKey = '当前审核的子任务'
        this.recordId = id
        return
      }

      let response
      if (operate === '发布') {
        response = await publishTask([id])
      }
      if (operate === '撤销') {
        response = await revokeTask([id])
      }

      if (operate === '拒绝') {
        response = await refuseTask(id)
      }

      if (operate === '接收') {
        response = await acceptTask(id)
      }

      if (operate === '领取') {
        response = await claimTask(id)
      }

      if (operate === '导出报表') {
        response = await exportReport(id)
        if (typeof response === 'string') {
          const url = window.URL.createObjectURL(new Blob([response]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${record.taskTitle}.doc`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }

      if (response.error.code === 0) {
        this.$message.success(operate + '成功')
        this.fetchData()
      }
    },
  },
}
</script>


<style lang="less" scoped>
/deep/ .ant-badge {
  transform: translateY(-2px);
}
</style>