<template>
  <div class="CommonModal">
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
      <!-- 部门表单 -->
      <a-form-model v-if="pageKey.includes('部门')" :model="formDepartment" :rules="rulesDepartment" ref="refForm">
        <div v-if="pageKey === '部门'">
          <a-divider dashed>部门</a-divider>
          <a-form-model-item label="部门名称" prop="departmentName">
            <a-input v-model="formDepartment.departmentName" placeholder="请输入" />
          </a-form-model-item>

          <a-form-model-item label="部门所在区域" prop="area">
            <AreaSelectAsync :operate="operate" v-model="formDepartment.area" :adCode.sync="formDepartment.adCode" />
          </a-form-model-item>

          <a-form-model-item label="区域编码" prop="adCode">
            <a-input v-model="formDepartment.adCode" placeholder="请选择部门所在区域" disabled />
          </a-form-model-item>

          <a-form-model-item label="部门详细地址" prop="address">
            <a-input v-model="formDepartment.address" placeholder="请输入" />
          </a-form-model-item>

          <a-form-model-item label="备注" prop="remark1">
            <a-input v-model="formDepartment.remark1" />
          </a-form-model-item>
        </div>

        <div v-if="operate === '创建' || (operate === '修改' && pageKey === '部门负责人')">
          <a-divider dashed>部门负责人</a-divider>
          <a-form-model-item label="部门负责人" prop="userId">
            <UserSelect v-model="formDepartment.userId" />
          </a-form-model-item>
        </div>
      </a-form-model>

      <!-- 仪器表单 -->
      <a-form-model v-if="pageKey === '仪器'" :model="formInstrument" :rules="rulesInstrument" ref="refForm">
        <a-form-model-item label="仪器类型" prop="deviceClassify">
          <a-select
            v-model="formInstrument.deviceClassify"
            :defaultActiveFirstOption="false"
            placeholder="请选择"
            :disabled="operate === '修改'"
            @change="formInstrument.deviceType = undefined"
          >
            <a-select-option :value="1">噪声测量仪器</a-select-option>
            <a-select-option :value="2">振动测量仪器</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="仪器型号" prop="deviceType">
          <DeviceTypeSelect
            v-model="formInstrument.deviceType"
            :deviceClassify="formInstrument.deviceClassify"
            :firstFetchData="operate === '修改'"
            :disabled="operate === '修改'"
          />
        </a-form-model-item>

        <template v-if="formInstrument.deviceType !== undefined">
          <a-form-model-item label="仪器串号" prop="noiseMeasureID">
            <a-input v-model="formInstrument.noiseMeasureID" placeholder="请输入" :disabled="operate === '修改'" />
          </a-form-model-item>

          <a-form-model-item label="端口" prop="linkPort">
            <a-input-number v-model="formInstrument.linkPort" :min="0" placeholder="请输入" />
          </a-form-model-item>

          <a-form-model-item label="使用方式" prop="deviceUsage">
            <a-select v-model="formInstrument.deviceUsage" :defaultActiveFirstOption="false" placeholder="请选择">
              <a-select-option :value="1">手持</a-select-option>
              <a-select-option :value="2">在线</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item v-if="formInstrument.deviceType !== 13" label="密码" prop="password">
            <a-input-password v-model="formInstrument.password" placeholder="请输入" />
          </a-form-model-item>

          <a-form-model-item label="生产厂家" prop="producer">
            <a-input v-model="formInstrument.producer" placeholder="请输入" />
          </a-form-model-item>

          <a-form-model-item label="出厂日期">
            <a-date-picker v-model="formInstrument.productionDate" placeholder="请选择" showTime />
          </a-form-model-item>

          <!-- AHAI2001的deviceType为13 -->
          <a-row v-if="formInstrument.deviceType !== 13">
            <a-col :span="12">
              <a-form-model-item label="是否读取oct">
                <a-checkbox v-model="formInstrument.readOct" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="是否读取oct13">
                <a-checkbox v-model="formInstrument.readOct13" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="是否读取sta">
                <a-checkbox v-model="formInstrument.readSta" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="是否读取leq1s">
                <a-checkbox v-model="formInstrument.readLeq1s" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="是否读取lp">
                <a-checkbox v-model="formInstrument.readLp" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="是否读取气象">
                <a-checkbox v-model="formInstrument.readWeather" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="是否读取车流量">
                <a-checkbox v-model="formInstrument.readCar" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="是否读取粉尘">
                <a-checkbox v-model="formInstrument.readDust" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>

      <!-- 校准器表单 -->
      <a-form-model v-if="pageKey === '校准器'" :model="formCalibrator" :rules="rulesCalibrator" ref="refForm">
        <a-form-model-item label="校准器编号" prop="calibrationDeviceNo">
          <a-input v-model="formCalibrator.calibrationDeviceNo" placeholder="请输入" :disabled="operate === '修改'" />
        </a-form-model-item>

        <a-form-model-item label="校准器型号" prop="calibrationDeviceType">
          <a-input v-model="formCalibrator.calibrationDeviceType" placeholder="请输入" />
          <!-- <DeviceTypeSelect
            v-model="formCalibrator.calibrationDeviceType"
            :deviceClassify="3"
            :disabled="operate === '修改'"
          /> -->
        </a-form-model-item>

        <a-form-model-item label="生产厂家" prop="producer">
          <a-input v-model="formCalibrator.producer" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="出厂日期" prop="productionDate">
          <a-date-picker v-model="formCalibrator.productionDate" placeholder="请选择" showTime :allowClear="true" />
        </a-form-model-item>
      </a-form-model>

      <!-- 道路表单 -->
      <a-form-model v-if="pageKey === '道路'" :model="formRoad" :rules="rulesRoad" ref="refForm">
        <a-form-model-item label="道路名称" prop="roadName">
          <a-input v-model="formRoad.roadName" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="道路类型" prop="roadType">
          <a-select v-model="formRoad.roadType" :defaultActiveFirstOption="false" placeholder="请选择">
            <a-select-option :value="1">城市快速路</a-select-option>
            <a-select-option :value="2">城市主干路</a-select-option>
            <a-select-option :value="3">城市次干路</a-select-option>
            <a-select-option :value="4">含轨道交通走廊的道路</a-select-option>
            <a-select-option :value="5">穿过城市的高速公路</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-divider dashed>
          绘制道路
          <a-button type="link" @click="showMap = true">打开地图</a-button>

          <!-- 地图modal -->
          <a-modal
            title="绘制道路(鼠标左键单击地图任意位置,右键结束绘制)"
            :visible="showMap"
            @cancel="showMap = false"
            width="100%"
            :bodyStyle="{
              padding: 0,
            }"
            :footer="null"
            dialogClass="amap-modal"
            destroyOnClose
          >
            <AMap type="道路" :roadLength.sync="formRoad.roadLength" :roadPosition.sync="formRoad.roadPosition" />
          </a-modal>
        </a-divider>

        <a-form-model-item label="道路长度" prop="roadLength">
          <a-space>
            <a-input-number v-model="formRoad.roadLength" disabled />
            <span>米</span>
          </a-space>
        </a-form-model-item>
      </a-form-model>

      <!-- 测点表单 -->
      <a-form-model v-if="pageKey === '测点'" :model="formPoint" :rules="rulesPoint" ref="refForm">
        <a-form-model-item label="测点编号" prop="measureCode" >
          <a-input v-model="formPoint.measureCode" placeholder="请输入" :disabled="operate === '修改'"/>
        </a-form-model-item>

        <a-form-model-item label="测点名称" prop="measureName">
          <a-input v-model="formPoint.measureName" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="噪声类型" prop="noiseType">
          <NoiseTypeSelect :operate="operate" v-model="formPoint.noiseType" />
        </a-form-model-item>

        <a-form-model-item v-if="formPoint.noiseType!=3" label="功能区代码" prop="funCode">
          <FunCodeSelect :operate="operate" v-model="formPoint.funCode" />
        </a-form-model-item>

        <a-form-model-item v-if="formPoint.noiseType === 2" label="道路" prop="roadId">
          <RoadSelect :operate="operate" v-model="formPoint.roadId" />
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="formPoint.remark" />
        </a-form-model-item>

        <a-divider dashed>
          地图选点
          <a-button :disabled="operate === '修改'" type="link" @click="showMap = true">打开地图</a-button>
          <!-- 地图modal -->
          <a-modal
            title="地图选点(鼠标左键单击地图任意位置)"
            :visible="showMap"
            @cancel="showMap = false"
            width="100%"
            :bodyStyle="{
              padding: 0,
            }"
            :footer="null"
            dialogClass="amap-modal"
            destroyOnClose
          >
            <AMap
              type="选点"
              :lon.sync="formPoint.lon"
              :lat.sync="formPoint.lat"
              :province.sync="formPoint.province"
              :city.sync="formPoint.city"
              :district.sync="formPoint.district"
              :adCode.sync="formPoint.adCode"
              :address.sync="formPoint.address"
            />
          </a-modal>
        </a-divider>

        <a-form-model-item label="经度" prop="lon">
          <a-input v-model="formPoint.lon" disabled />
        </a-form-model-item>

        <a-form-model-item label="纬度" prop="lat">
          <a-input v-model="formPoint.lat" disabled />
        </a-form-model-item>

        <a-form-model-item label="区域" prop="province">
          <a-input :value="`${formPoint.province}${formPoint.city}${formPoint.district}`" disabled />
        </a-form-model-item>

        <a-form-model-item label="区域编码" prop="adCode">
          <a-input v-model="formPoint.adCode" disabled />
        </a-form-model-item>

        <a-form-model-item label="详细地址" prop="address" placeholder="请输入">
          <a-textarea v-model="formPoint.address" />
        </a-form-model-item>

        <a-divider dashed>测点参数</a-divider>

        <a-row>
          <a-col :span="12">
            <a-form-model-item label="是否读取oct">
              <a-checkbox v-model="formPoint.readOct" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否读取oct13">
              <a-checkbox v-model="formPoint.readOct13" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="是否读取sta">
              <a-checkbox v-model="formPoint.readSta" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="是否读取leq1s">
              <a-checkbox v-model="formPoint.readLeq1s" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="是否读取lp">
              <a-checkbox v-model="formPoint.readLp" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="是否读取气象">
              <a-checkbox v-model="formPoint.readWeather" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="是否读取车流量">
              <a-checkbox v-model="formPoint.readCar" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="是否读取粉尘">
              <a-checkbox v-model="formPoint.readDust" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- 仪器维修记录表单 -->
      <a-form-model
        v-if="pageKey === '仪器维修记录' || pageKey === '校准器维修记录' || pageKey === '风速仪维修记录'"
        :model="formMaintain"
        :rules="rulesMaintain"
        ref="refForm"
      >
        <a-form-model-item label="维修原因" prop="reason">
          <a-input v-model="formMaintain.reason" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="维修日期" prop="repairDate">
          <a-date-picker v-model="formMaintain.repairDate" placeholder="请选择" showTime />
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="formMaintain.remark" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>

      <!-- 仪器检定记录表单 -->
      <a-form-model
        v-if="pageKey === '仪器检定记录' || pageKey === '校准器检定记录' || pageKey === '风速仪检定记录'"
        :model="formInspect"
        :rules="rulesInspect"
        ref="refForm"
      >
        <a-form-model-item label="检定有效期" prop="validity">
          <!-- <a-date-picker v-model="formInspect.validDate" placeholder="请选择" showTime /> -->
          <a-input-number v-model="formInspect.validity" placeholder="请输入" /> 月
        </a-form-model-item>

        <a-form-model-item label="检定日期" prop="verificationDate">
          <a-date-picker v-model="formInspect.verificationDate" placeholder="请选择" showTime />
        </a-form-model-item>

        <a-form-model-item v-if="pageKey === '校准器检定记录'" label="检定示值" prop="value">
          <a-input-number v-model="formInspect.value" placeholder="请输入" /> dB
        </a-form-model-item>

        <a-form-model-item label="精度" prop="accuracy">
          <a-select v-model="formInspect.accuracy"   placeholder="请选择">
            <a-select-option :value="0">0</a-select-option>
            <a-select-option :value="1">1</a-select-option>
            <a-select-option :value="2">2</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="文件" prop="certUrl">
          <!-- <a-upload
            action="/api_java/verificationRecord/cert/upload"
            :headers="{
              Authorization: $store.state.user.token,
            }"
            :showUploadList="true"
            :file-list="fileListInspect"
            @change="uploadChangeInspect"
            @preview="uploadPreview"
          >
            <a-button> <a-icon type="upload" />上传检定证书</a-button>
          </a-upload>  -->

          <a-upload
            action="/api_java/verificationRecord/cert/upload"
            :headers="{
              Authorization: $store.state.user.token,
            }"
            list-type="picture"
            :file-list="fileListInspect"
            @change="uploadChangeInspect"
          >
            <a-button> <a-icon type="upload" /> 上传检定证书 </a-button>
          </a-upload>
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="formInspect.remark" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>

      <!-- 角色表单 -->
      <a-form-model v-if="pageKey === '角色'" :model="formRole" :rules="rulesRole" ref="refForm">
        <a-form-model-item label="角色名称" prop="roleName">
          <a-input v-model="formRole.roleName" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="角色权限" prop="authors">
          <AuthCheckBoxGroup v-model="formRole.authors" :operate="operate" />
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="formRole.remark" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>

      <!-- 用户表单 -->
      <a-form-model v-if="pageKey === '用户'" :model="formUser" :rules="rulesUser" ref="refForm">
        <a-form-model-item v-if="operate === '创建'" label="账号" prop="username">
          <a-input v-model="formUser.username" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建' || (operate === '修改' && keyword === '基本信息')"
          label="昵称"
          prop="nickname"
        >
          <a-input v-model="formUser.nickname" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建'"
          label="密码"
          prop="password"
          extra="如果不填，则使用默认密码AH789@prd#"
        >
          <a-input-password v-model="formUser.password" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建' || (operate === '修改' && keyword === '基本信息')"
          label="身份证号"
          prop="identityCardNo"
        >
          <a-input v-model="formUser.identityCardNo" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建' || (operate === '修改' && keyword === '基本信息')"
          label="从业资格说明"
          prop="qualificationCertificate"
        >
          <a-input v-model="formUser.qualificationCertificate" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建' || (operate === '修改' && keyword === '基本信息')"
          label="文件"
          prop="qualificationCertificateUrl"
        >

          <a-upload
            action="/api_java/sys/user/cert/upload"
            :headers="{
              Authorization: $store.state.user.token,
            }"
            list-type="picture"
            :file-list="fileListUser"
            @change="uploadChangeUser"
          >
            <a-button> <a-icon type="upload" /> 上传从业资格证书 </a-button>
          </a-upload>
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建' || (operate === '修改' && keyword === '基本信息')"
          label="证书有效期"
          prop="certificateValidDate"
        >
          <a-date-picker v-model="formUser.certificateValidDate" placeholder="请选择" :allowClear="false" />
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建' || (operate === '修改' && keyword === '角色')"
          label="角色"
          prop="roles"
        >
          <RoleSelect v-model="formUser.roles" />
        </a-form-model-item>

        <a-form-model-item
          v-if="operate === '创建' || (operate === '修改' && keyword === '基本信息')"
          label="备注"
          prop="remark"
        >
          <a-input v-model="formUser.remark" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>

      <!-- 配置表单 -->
      <a-form-model v-if="pageKey === '配置'" :model="formConfig" :rules="rulesConfig" ref="refForm">        
        <a-form-model-item label="描述" prop="keys">
          <span>{{formConfig.remark}}</span>
        </a-form-model-item>
        
        <a-form-model-item label="值" prop="value">
          <a-input v-model="formConfig.value" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>

      <!-- 任务表单 -->
      <a-form-model v-if="pageKey === '任务'" :model="formTask" :rules="rulesTask" ref="refForm">
        <a-form-model-item label="任务类型" prop="taskType">
          <a-radio-group v-if="this.operate === '创建'" v-model="formTask.taskType">
            <a-radio-button :value="0"> 常规任务 </a-radio-button>
            <a-radio-button :value="1"> 非常规任务 </a-radio-button>
          </a-radio-group>
          <span v-if="this.operate === '修改'">{{ formTask.taskType === 0 ? '常规任务' : '非常规任务' }}</span>
        </a-form-model-item>

        <a-form-model-item label="任务标题" prop="taskTitle">
          <a-input v-model="formTask.taskTitle" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="时间" prop="rangeDate">
          <a-range-picker v-model="formTask.rangeDate" :disabled-date="disabledDate" />
        </a-form-model-item>

        <!-- 常规任务 -->
        <div v-if="formTask.taskType === 0">
          <a-form-model-item label="监测数据类型" prop="routineType">
            <a-select v-model="formTask.routineType" placeholder="请选择">
              <a-select-option :value="0"> 功能区噪声测量 </a-select-option>
              <a-select-option :value="1"> 区域噪声测量 </a-select-option>
              <a-select-option :value="2"> 交通噪声测量 </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="formTask.routineType === 1 || formTask.routineType === 2"
            label="测量时间段"
            extra="结束时间必须大于开始时间"
          >
            <a-space>
              <a-time-picker
                v-model="formTask.rangeStart1"
                :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                valueFormat="HH:mm:ss"
                placeholder="开始时间"
              />
              <span>~</span>
              <a-time-picker
                v-model="formTask.rangeEnd1"
                :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                valueFormat="HH:mm:ss"
                placeholder="结束时间"
              />
            </a-space>

            <a-space>
              <a-time-picker
                v-model="formTask.rangeStart2"
                :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                valueFormat="HH:mm:ss"
                placeholder="开始时间"
              />
              <span>~</span>
              <a-time-picker
                v-model="formTask.rangeEnd2"
                :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                valueFormat="HH:mm:ss"
                placeholder="结束时间"
              />
            </a-space>

            <a-space>
              <a-time-picker
                v-model="formTask.rangeStart3"
                :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                valueFormat="HH:mm:ss"
                placeholder="开始时间"
              />
              <span>~</span>
              <a-time-picker
                v-model="formTask.rangeEnd3"
                :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                valueFormat="HH:mm:ss"
                placeholder="结束时间"
              />
            </a-space>
          </a-form-model-item>
        </div>

        <!-- 非常规任务 -->
        <div v-if="formTask.taskType === 1">
          <a-form-model-item label="监测数据类型名称" prop="nonroutineName">
            <a-input v-model="formTask.nonroutineName" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="数据提交类型" prop="dataSubmitType">
            <a-select v-model="formTask.dataSubmitType" placeholder="请选择">
              <a-select-option :value="0"> 瞬时 </a-select-option>
              <a-select-option :value="1"> 分钟 </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>

        <a-form-model-item label="测点" prop="measuresList">
          <PointSelect v-model="formTask.measuresList" />
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="formTask.remark" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>

      <!-- 风速仪表单 -->
      <a-form-model v-if="pageKey === '风速仪'" :model="formAnemograph" :rules="rulesAnemograph" ref="refForm">
        <a-form-model-item label="风速仪编号" prop="windDeviceNo">
          <a-input v-model="formAnemograph.windDeviceNo" placeholder="请输入" :disabled="operate === '修改'" />
        </a-form-model-item>

        <a-form-model-item label="风速仪型号" prop="windDeviceType">
          <a-input v-model="formAnemograph.windDeviceType" placeholder="请输入" :disabled="operate === '修改'" />
        </a-form-model-item>

        <a-form-model-item label="生产厂家" prop="producer">
          <a-input v-model="formAnemograph.producer" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="出厂日期" prop="productionDate">
          <a-date-picker v-model="formAnemograph.productionDate" placeholder="请选择" showTime :allowClear="true" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import AMap from '@/views/manage-set-nb/components/AMap'

import AreaSelect from '@/views/manual-import/AreaSelect'
import AreaSelectAsync from '@/views/manage-set-nb/components/AreaSelectAsync'
import DeviceTypeSelect from '@/views/manage-set-nb/components/DeviceTypeSelect'
import FunCodeSelect from '@/views/manage-set-nb/components/FunCodeSelect'
import RoadSelect from '@/views/manage-set-nb/components/RoadSelect'
import NoiseTypeSelect from '@/views/manage-set-nb/components/NoiseTypeSelect'
import AuthCheckBoxGroup from '@/views/manage-set-nb/components/AuthCheckBoxGroup'
import RoleSelect from '@/views/manage-set-nb/components/RoleSelect'
import PointSelect from '@/views/manage-set-nb/components/PointSelect'
import UserSelect from '@/views/manage-set-nb/components/UserSelect'

import {
  addDepartmentAndPeople,
  modifyDepartment,
  addInstrument,
  addInstrument2001,
  modifyInstrument,
  modifyInstrument2001,
  addCalibrator,
  modifyCalibrator,
  addRoad,
  modifyRoad,
  addMeasure,
  modifyMeasure,
  addModifyMaintain,
  addModifyInspect,
  addRole,
  modifyRole,
  addUser,
  modifyUser,
  modifyUserRole,
  modifyConfig,
  addModifyMaintainCalibrator,
  addModifyInspectCalibrator,
  lookCert,
  createNormalTask,
  createUnnormalTask,
  updateTask,
  addAnemograph,
  updateAnemograph,
  addMaintainAnemograph,
  updateMaintainAnemograph,
  addAnemographInspect,
  updateAnemographInspect,
  updateDepartmentUser,
} from '@/api/api'
import { api_java } from '@/api/urlConfig'

//部门rules
const rulesDepartment = {
  departmentName: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 30,
      message: '长度3~30个字符',
      trigger: 'blur',
    },
  ],
  area: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  adCode: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  address: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 100,
      message: '长度3~100个字符',
      trigger: 'blur',
    },
  ],
  remark1: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
  username: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 30,
      message: '长度3~30个字符',
      trigger: 'blur',
    },
  ],
  nickname: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 30,
      message: '长度3~30个字符',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: false,
      message: '请输入',
      trigger: 'blur',
    },
    {
      min: 4,
      max: 30,
      message: '长度4~30个字符',
      trigger: 'blur',
    },
  ],
  remark2: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
  qualificationCertificateUrl: [
    {
      required: false,
      message: '请上传文件',
      trigger: 'change',
    },
  ],
  certificateValidDate: [
    {
      required: false,
      message: '请选择',
      trigger: 'change',
    },
  ],
  userId: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
}

//仪器rules
const rulesInstrument = {
  noiseMeasureID: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 14,
      message: '最大长度14个字符',
      trigger: 'blur',
    },
  ],
  linkPort: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  deviceClassify: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  deviceType: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      min: 4,
      max: 30,
      message: '长度4~30个字符',
      trigger: 'blur',
    },
  ],
  producer: [
    {
      max: 60,
      message: '最大长度60个字符',
      trigger: 'blur',
    },
  ],
  deviceUsage: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
}

//校准器rules
const rulesCalibrator = {
  calibrationDeviceNo: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 14,
      message: '最大长度14个字符',
      trigger: 'blur',
    },
  ],
  calibrationDeviceType: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  producer: [
    {
      required: false,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 60,
      message: '最大长度60个字符',
      trigger: 'blur',
    },
  ],
  productionDate: [
    {
      required: false,
      message: '请选择',
      trigger: 'blur',
    },
  ],
}

//风速仪rules
const rulesAnemograph = {
  windDeviceNo: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 14,
      message: '最大长度14个字符',
      trigger: 'blur',
    },
  ],
  windDeviceType: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 64,
      message: '最大长度14个字符',
      trigger: 'blur',
    },
  ],
  producer: [
    {
      required: false,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 60,
      message: '最大长度60个字符',
      trigger: 'blur',
    },
  ],
  productionDate: [
    {
      required: false,
      message: '请选择',
      trigger: 'blur',
    },
  ],
}

//道路rules
const rulesRoad = {
  roadName: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 30,
      message: '最大长度30个字符',
      trigger: 'blur',
    },
  ],
  roadType: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  roadLength: [
    {
      required: true,
      message: '请绘制道路',
      trigger: 'blur',
    },
  ],
}

//测点rules
const rulesPoint = {
  measureCode: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      // min: 12,
      max: 12,
      message: '长度必须12个字符',
      trigger: 'blur',
    },
  ],
  measureName: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 14,
      message: '最大长度14个字符',
      trigger: 'blur',
    },
  ],
  province: [
    {
      required: true,
      message: '请地图选点',
      trigger: 'blur',
    },
  ],
  lon: [
    {
      required: true,
      message: '请地图选点',
      trigger: 'blur',
    },
  ],
  lat: [
    {
      required: true,
      message: '请地图选点',
      trigger: 'blur',
    },
  ],
  adCode: [
    {
      required: true,
      message: '请地图选点',
      trigger: 'blur',
    },
  ],
  address: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
  funCode: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  roadId: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  remark: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
  noiseType: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
}

//仪器维修记录rules
const rulesMaintain = {
  reason: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
  repairDate: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  remark: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
}

//仪器检定记录rules
const rulesInspect = {
  validity: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  accuracy: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  value: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  verificationDate: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  remark: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
  certUrl: [
    {
      required: true,
      message: '请上传证书',
      trigger: 'change',
    },
  ],
}

//用户rules
const rulesUser = {
  username: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 30,
      message: '最大长度30个字符',
      trigger: 'blur',
    },
  ],
  nickname: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 30,
      message: '最大长度30个字符',
      trigger: 'blur',
    },
  ],
  password: [
    {
      min: 4,
      max: 30,
      message: '长度4~30个字符',
      trigger: 'blur',
    },
  ],
  identityCardNo: [
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/g,
      message: '身份证格式错误',
      trigger: 'blur',
    },
  ],
  qualificationCertificate: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
  remark: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
}

//角色rules
const rulesRole = {
  roleName: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 30,
      message: '最大长度30个字符',
      trigger: 'blur',
    },
  ],
  authors: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  remark: [
    {
      max: 100,
      message: '最大长度100个字符',
      trigger: 'blur',
    },
  ],
}

//配置rules
const rulesConfig = {
  keys: [
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
  value: [
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

//任务rules
const rulesTask = {
  taskType: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  taskTitle: [
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
  remark: [
    {
      required: false,
      message: '请输入',
      trigger: 'blur',
    },
    {
      max: 60,
      message: '最大长度60个字符',
      trigger: 'blur',
    },
  ],
  rangeDate: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  routineType: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  measuresList: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  nonroutineName: [
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
  dataSubmitType: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
}

export default {
  name: 'CommonModal',

  props: ['visible', 'pageKey', 'operate', 'modalData', 'recordId', 'keyword'],

  components: {
    AMap,

    AreaSelect,
    AreaSelectAsync,
    DeviceTypeSelect,
    FunCodeSelect,
    RoadSelect,
    NoiseTypeSelect,
    AuthCheckBoxGroup,
    RoleSelect,
    PointSelect,
    UserSelect,
  },

  data() {
    return {
      loading: false,
      showMap: false,

      formDepartment: {
        departmentName: undefined,
        area: [],
        adCode: undefined,
        address: undefined,
        remark1: undefined,
        username: undefined,
        nickname: undefined,
        password: undefined,
        remark2: undefined,
        qualificationCertificateUrl: undefined,
        certificateValidDate: undefined,
        userId: undefined,
      },
      formInstrument: {
        noiseMeasureID: undefined,
        linkPort: undefined,
        deviceClassify: undefined,
        deviceType: undefined,
        password: undefined,
        producer: undefined,
        nickname: undefined,
        productionDate: undefined,
        readOct: true,
        readOct13: true,
        readSta: true,
        readLeq1s: true,
        readLp: true,
        readWeather: true,
        readCar: true,
        readDust: true,
        deviceUsage: undefined,
      },
      formCalibrator: {
        calibrationDeviceNo: undefined,
        calibrationDeviceType: undefined,
        producer: undefined,
        productionDate: undefined,
      },
      formAnemograph: {
        windDeviceNo: undefined,
        windDeviceType: undefined,
        producer: undefined,
        productionDate: undefined,
      },
      formRoad: {
        roadName: undefined,
        roadType: undefined,
        roadLength: undefined,
        roadPosition: [],
      },
      formPoint: {
        measureCode: undefined,
        measureName: undefined,
        province: '',
        city: '',
        district: '',
        adCode: undefined,
        address: undefined,
        funCode: undefined,
        lon: undefined,
        lat: undefined,
        noiseType: undefined,
        roadId: undefined,
        remark: undefined,
        readOct: true,
        readOct13: true,
        readSta: true,
        readLeq1s: true,
        readLp: true,
        readWeather: true,
        readCar: true,
        readDust: true,
      },
      formMaintain: {
        deviceId: undefined,
        reason: undefined,
        repairDate: undefined,
        remark: undefined,
      },
      formInspect: {
        deviceId: undefined,
        validity: undefined,
        verificationDate: undefined,
        accuracy: undefined,
        value: undefined,
        remark: undefined,
        certUrl: undefined,
      },
      formRole: {
        roleName: undefined,
        authors: [],
        remark: undefined,
      },
      formUser: {
        username: undefined,
        nickname: undefined,
        password: undefined,
        identityCardNo: undefined,
        qualificationCertificate: undefined,
        remark: undefined,
        roles: [],
        qualificationCertificateUrl: undefined,
        certificateValidDate: undefined,
      },
      formConfig: {
        keys: undefined,
        remark: undefined,
        value: undefined,
      },
      formTask: {
        taskType: 0,
        taskTitle: '',
        remark: '',
        rangeDate: [],
        routineType: undefined, //监测数据类型
        rangeStart1: '',
        rangeEnd1: '',
        rangeStart2: '',
        rangeEnd2: '',
        rangeStart3: '',
        rangeEnd3: '',
        measuresList: [],
        nonroutineName: '',
        dataSubmitType: undefined,
      },

      rulesDepartment,
      rulesInstrument,
      rulesCalibrator,
      rulesRoad,
      rulesPoint,
      rulesMaintain,
      rulesInspect,
      rulesRole,
      rulesUser,
      rulesConfig,
      rulesTask,
      rulesAnemograph,

      fileListDepartment: [],
      fileListUser: [],
      fileListInspect: [],
    }
  },

  watch: {
    visible(value) {
      if (value === true) {
        if (this.operate === '修改') {
          if (this.pageKey === '仪器') {
            this.formInstrument = {
              ...this.modalData,
            }
            this.formInstrument.productionDate = this.formInstrument.productionDate
              ? moment(Number(this.formInstrument.productionDate))
              : undefined
          }

          if (this.pageKey === '校准器') {
            this.formCalibrator = {
              ...this.modalData,
            }
            this.formCalibrator.productionDate = this.formCalibrator.productionDate
              ? moment(Number(this.formCalibrator.productionDate))
              : undefined
          }

          if (this.pageKey === '风速仪') {
            this.formAnemograph = {
              ...this.modalData,
            }
            this.formAnemograph.productionDate = this.formAnemograph.productionDate
              ? moment(Number(this.formAnemograph.productionDate))
              : undefined
          }

          if (this.pageKey.includes('部门')) {
            let obj = {
              ...this.modalData,
            }
            this.formDepartment.id = obj.department.id
            this.formDepartment.departmentName = obj.department.departmentName
            this.formDepartment.address = obj.department.address
            this.formDepartment.remark1 = obj.department.remark
            this.formDepartment.adCode = obj.department.adCode
            this.formDepartment.userId = obj.user.id
            this.formDepartment.area = []
            if (obj.department.provinceName) {
              this.formDepartment.area.push(obj.department.provinceName)
            }
            if (obj.department.cityName) {
              this.formDepartment.area.push(obj.department.cityName)
            }
            if (obj.department.districtName) {
              this.formDepartment.area.push(obj.department.districtName)
            }
          }

          if (this.pageKey === '道路') {
            this.formRoad = {
              ...this.modalData,
            }
            this.formRoad.roadPosition = JSON.parse(this.formRoad.roadPosition)
          }

          if (this.pageKey === '测点') {
            let { measure, noiseMeasure } = {
              ...this.modalData,
            }

            this.formPoint.measureId = measure.id
            this.formPoint.measureCode = measure.measureCode
            this.formPoint.measureName = measure.measureName
            this.formPoint.province = measure.provinceName
            this.formPoint.city = measure.cityName
            this.formPoint.district = measure.districtName
            this.formPoint.adCode = measure.adCode
            this.formPoint.address = measure.address
            this.formPoint.funCode = measure.funCode
            this.formPoint.lon = measure.lon
            this.formPoint.lat = measure.lat
            this.formPoint.noiseType = measure.noiseType
            this.formPoint.roadId = measure.roadId
            this.formPoint.remark = measure.remark

            this.formPoint.noiseMeasureId = noiseMeasure.id
            this.formPoint.readCar = noiseMeasure.readCar
            this.formPoint.readDust = noiseMeasure.readDust
            this.formPoint.readLeq1s = noiseMeasure.readLeq1s
            this.formPoint.readLp = noiseMeasure.readLp
            this.formPoint.readOct = noiseMeasure.readOct
            this.formPoint.readOct13 = noiseMeasure.readOct13
            this.formPoint.readSta = noiseMeasure.readSta
            this.formPoint.readWeather = noiseMeasure.readWeather
          }

          if (
            this.pageKey === '仪器维修记录' ||
            this.pageKey === '校准器维修记录' ||
            this.pageKey === '风速仪维修记录'
          ) {
            this.formMaintain = {
              ...this.modalData,
            }
            this.formMaintain.repairDate = moment(Number(this.formMaintain.repairDate))
          }

          if (
            this.pageKey === '仪器检定记录' ||
            this.pageKey === '校准器检定记录' ||
            this.pageKey === '风速仪检定记录'
          ) {
            this.formInspect = {
              ...this.modalData,
            }
            // this.formInspect.validDate = moment(Number(this.formInspect.validDate))
            this.formInspect.verificationDate = moment(Number(this.formInspect.verificationDate))
            let showUrl = this.$options.filters["urlFormat"](this.formInspect.certUrl)
            this.fileListInspect = [
              {
                uid: 'uid',
                name: showUrl,
                status: 'done',
                url: `${api_java}${this.formInspect.certUrl}?token=${this.$store.state.user.token}`,
              },
            ]
          }

          if (this.pageKey === '角色') {
            this.formRole = {
              ...this.modalData,
            }
            this.formRole.authors = this.formRole.authors.map((item) => item.id)
          }

          if (this.pageKey === '用户') {
            this.formUser = {
              ...this.modalData,
            }
            this.formUser.roles = this.formUser.roles.map((item) => item.id)
            let showUrl = this.$options.filters["urlFormat"](this.formUser.qualificationCertificateUrl)
            this.fileListUser = [
              {
                uid: 'uid',
                name: showUrl,
                status: 'done',
                url: `${api_java}${this.formUser.qualificationCertificateUrl}?token=${this.$store.state.user.token}`,
              },
            ]
          }

          if (this.pageKey === '配置') {
            let { settingKey, settingValue } = {
              ...this.modalData,
            }
            this.formConfig.keys = settingKey
            this.formConfig.remark = this.modalData.remark
            this.formConfig.value = settingValue
          }

          if (this.pageKey === '任务') {
            // this.formTask = {
            //   ...this.modalData,
            // }
            this.modalData.routineType == null ? (this.formTask.taskType = 1) : (this.formTask.taskType = 0)
            this.formTask.taskTitle = this.modalData.taskTitle
            this.formTask.routineType = this.modalData.routineType
            this.formTask.dataSubmitType = this.modalData.dataSubmitType
            this.formTask.remark = this.modalData.remark
            this.formTask.rangeDate = [
              moment(Number(this.modalData.startTime)),
              moment(Number(this.modalData.stopTime)),
            ]
            this.formTask.nonroutineName = this.modalData.nonRoutineName

            if (this.modalData.timeRanges != null) {
              if (this.modalData.timeRanges.length > 0) {
                this.formTask.rangeStart1 = this.modalData.timeRanges[0].rangeStart
                this.formTask.rangeEnd1 = this.modalData.timeRanges[0].rangeEnd
              }
              if (this.modalData.timeRanges.length > 1) {
                this.formTask.rangeStart2 = this.modalData.timeRanges[1].rangeStart
                this.formTask.rangeEnd2 = this.modalData.timeRanges[1].rangeEnd
              }
              if (this.modalData.timeRanges.length > 2) {
                this.formTask.rangeStart3 = this.modalData.timeRanges[2].rangeStart
                this.formTask.rangeEnd3 = this.modalData.timeRanges[2].rangeEnd
              }
            }

            if (this.modalData.measurePoints != null) {
              this.formTask.measuresList = this.modalData.measurePoints
            } else {
              this.formTask.measuresList = [this.modalData.measure.id]
            }
            this.formTask.id = this.modalData.id
          }
        } else if (this.operate === '创建') {
          if (this.pageKey === '校准器检定记录') {
            this.formInspect.accuracy = this.modalData.accuracy
          }
          this.fileListInspect = []
        }
      }
    },
    'formPoint.noiseType':{
      handler(newName, oldName) {
          if(newName==0){
            this.rulesPoint={
                measureCode: [
                  {
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                  },
                  {
                    // min: 12,
                    max: 12,
                    message: '长度必须12个字符',
                    trigger: 'blur',
                  },
                ],
                measureName: [
                  {
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                  },
                  {
                    max: 14,
                    message: '最大长度14个字符',
                    trigger: 'blur',
                  },
                ],
                province: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                lon: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                lat: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                adCode: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                address: [
                  {
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                  },
                  {
                    max: 100,
                    message: '最大长度100个字符',
                    trigger: 'blur',
                  },
                ],
                funCode: [
                  {
                    required: true,
                    message: '请选择',
                    trigger: 'change',
                  },
                ],
                roadId: [
                  {
                    required: true,
                    message: '请选择',
                    trigger: 'change',
                  },
                ],
                remark: [
                  {
                    max: 100,
                    message: '最大长度100个字符',
                    trigger: 'blur',
                  },
                ],
                noiseType: [
                  {
                    required: true,
                    message: '请选择',
                    trigger: 'change',
                  },
                ],
              }
          }else if(newName==1||newName==2){
            this.rulesPoint={
                measureCode: [
                  {
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                  },
                  {
                    // min: 12,
                    max: 12,
                    message: '长度必须12个字符',
                    trigger: 'blur',
                  },
                ],
                measureName: [
                  {
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                  },
                  {
                    max: 14,
                    message: '最大长度14个字符',
                    trigger: 'blur',
                  },
                ],
                province: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                lon: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                lat: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                adCode: [
                  {
                    required: true,
                    message: '请地图选点',
                    trigger: 'blur',
                  },
                ],
                address: [
                  {
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                  },
                  {
                    max: 100,
                    message: '最大长度100个字符',
                    trigger: 'blur',
                  },
                ],
                roadId: [
                  {
                    required: true,
                    message: '请选择',
                    trigger: 'change',
                  },
                ],
                remark: [
                  {
                    max: 100,
                    message: '最大长度100个字符',
                    trigger: 'blur',
                  },
                ],
                noiseType: [
                  {
                    required: true,
                    message: '请选择',
                    trigger: 'change',
                  },
                ],
              }
          }
      },
      // immediate: true,
      deep:true,
    }
  },

  methods: {
    moment,

    handleOk() {
      this.$refs.refForm.validate((valid) => {
        if (valid) {
          this.loading = true

          if (this.pageKey.includes('部门')) {
            if (this.operate === '创建') {
              let { departmentName, area, adCode, address, remark1, userId } = this.formDepartment

              let param = {
                department: {
                  departmentName,
                  provinceName: area[0] ? area[0] : undefined,
                  cityName: area[1] ? area[1] : undefined,
                  districtName: area[2] ? area[2] : undefined,
                  adCode,
                  address,
                  remark: remark1,
                },
                user: {
                  userId,
                },
              }

              addDepartmentAndPeople(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('创建成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              let { id, departmentName, area, address, remark1, adCode } = this.formDepartment
              let param = {
                id,
                departmentName,
                provinceName: area[0] ? area[0] : undefined,
                cityName: area[1] ? area[1] : undefined,
                districtName: area[2] ? area[2] : undefined,
                address,
                remark: remark1,
                adCode,
              }

              if (this.pageKey === '部门') {
                modifyDepartment(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }

              if (this.pageKey === '部门负责人') {
                updateDepartmentUser({
                  id: this.formDepartment.userId,
                  deptId: this.formDepartment.id,
                })
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            }
          }

          if (this.pageKey === '仪器') {
            let param = {
              ...this.formInstrument,
            }
            param.productionDate = param.productionDate ? param.productionDate.valueOf() : null

            if (this.operate === '创建') {
              if (param.deviceType === 13) {
                addInstrument2001(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('创建成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              } else {
                addInstrument(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('创建成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            } else if (this.operate === '修改') {
              if (param.deviceType === 13) {
                delete param.deviceType
                delete param.deviceClassify
                modifyInstrument2001(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              } else {
                delete param.deviceType
                delete param.deviceClassify
                modifyInstrument(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            }
          }

          if (this.pageKey === '校准器') {
            let param = {
              ...this.formCalibrator,
            }
            param.productionDate = param.productionDate ? param.productionDate.valueOf() : null
            if (this.operate === '创建') {
              addCalibrator(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('创建成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              modifyCalibrator(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('修改成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            }
          }

          if (this.pageKey === '风速仪') {
            let param = {
              ...this.formAnemograph,
            }
            param.productionDate = param.productionDate ? param.productionDate.valueOf() : null
            if (this.operate === '创建') {
              addAnemograph(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('创建成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              updateAnemograph(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('修改成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            }
          }

          if (this.pageKey === '道路') {
            let param = {
              ...this.formRoad,
            }
            param.roadPosition = JSON.stringify(param.roadPosition)

            if (this.operate === '创建') {
              addRoad(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('创建成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              modifyRoad(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('修改成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            }
          }

          if (this.pageKey === '测点') {
            let {
              measureCode,
              measureName,
              province,
              city,
              district,
              adCode,
              address,
              funCode,
              lon,
              lat,
              noiseType,
              roadId,
              remark,
              readOct,
              readOct13,
              readSta,
              readLeq1s,
              readLp,
              readWeather,
              readCar,
              readDust,
              measureId,
              noiseMeasureId,
            } = this.formPoint
            let param = {
              measure: {
                id: measureId,
                measureCode,
                measureName,
                provinceName: province,
                cityName: city,
                districtName: district,
                adCode,
                address,
                funCode: noiseType === 0 ? funCode : undefined,
                lon,
                lat,
                noiseType,
                roadId: noiseType === 2 ? roadId : undefined,
                remark,
              },
              noiseMeasure: {
                id: noiseMeasureId,
                readOct,
                readOct13,
                readSta,
                readLeq1s,
                readLp,
                readWeather,
                readCar,
                readDust,
              },
            }
            if (this.operate === '创建') {
              addMeasure(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('创建成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              modifyMeasure(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('修改成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            }
          }

          if (this.pageKey === '仪器维修记录') {
            let param = {
              ...this.formMaintain,
            }
            param.repairDate = param.repairDate.valueOf()
            param.deviceId = this.recordId

            addModifyMaintain(param)
              .then(({ error, response }) => {
                if (error.code === 0) {
                  this.$message.success(`${this.operate}成功`)
                  this.handleCancel()
                  this.$emit('fetchData')
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.loading = false
                }, 500)
              })
          }

          if (this.pageKey === '校准器维修记录') {
            let param = {
              ...this.formMaintain,
            }
            param.repairDate = param.repairDate.valueOf()
            param.deviceId = this.recordId

            addModifyMaintainCalibrator(param)
              .then(({ error, response }) => {
                if (error.code === 0) {
                  this.$message.success(`${this.operate}成功`)
                  this.handleCancel()
                  this.$emit('fetchData')
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.loading = false
                }, 500)
              })
          }

          if (this.pageKey === '风速仪维修记录') {
            let param = {
              ...this.formMaintain,
            }
            param.repairDate = param.repairDate.valueOf()
            param.deviceId = this.recordId

            if (this.operate === '创建') {
              addMaintainAnemograph(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success(`${this.operate}成功`)
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              updateMaintainAnemograph(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success(`${this.operate}成功`)
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            }
          }

          if (this.pageKey === '风速仪检定记录') {
            let param = {
              ...this.formInspect,
            }
            // param.validDate = param.validDate.valueOf()
            param.verificationDate = param.verificationDate.valueOf()
            param.deviceId = this.recordId

            if (this.operate === '创建') {
              addAnemographInspect(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success(`${this.operate}成功`)
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              updateAnemographInspect(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success(`${this.operate}成功`)
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            }
          }

          if (this.pageKey === '仪器检定记录') {
            let param = {
              ...this.formInspect,
            }
            // param.validDate = param.validDate.valueOf()
            param.verificationDate = param.verificationDate.valueOf()
            param.deviceId = this.recordId

            addModifyInspect(param)
              .then(({ error, response }) => {
                if (error.code === 0) {
                  this.$message.success(`${this.operate}成功`)
                  this.handleCancel()
                  this.$emit('fetchData')
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.loading = false
                }, 500)
              })
          }

          if (this.pageKey === '校准器检定记录') {
            let param = {
              ...this.formInspect,
            }
            // param.validDate = param.validDate.valueOf()
            console.log(param.verificationDate)
            param.verificationDate = param.verificationDate.valueOf()
            param.deviceId = this.recordId

            addModifyInspectCalibrator(param)
              .then(({ error, response }) => {
                if (error.code === 0) {
                  this.$message.success(`${this.operate}成功`)
                  this.handleCancel()
                  this.$emit('fetchData')
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.loading = false
                }, 500)
              })
          }

          if (this.pageKey === '用户') {
            let param = {
              ...this.formUser,
            }
            param.roles = param.roles.map((item) => {
              return {
                id: item,
              }
            })
            param.certificateValidDate = param.certificateValidDate ? param.certificateValidDate.valueOf() : null
            if (this.operate === '创建') {
              addUser(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('创建成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              if (this.keyword === '基本信息') {
                let param2 = {}
                param2.id = param.id
                param2.nickname = param.nickname
                param2.identityCardNo = param.identityCardNo
                param2.qualificationCertificate = param.qualificationCertificate
                param2.status = param.status
                param2.remark = param.remark
                param2.certificateValidDate = param.certificateValidDate
                param2.qualificationCertificateUrl = param.qualificationCertificateUrl
                modifyUser(param2)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              } else if (this.keyword === '角色') {
                let param3 = {}
                param3.id = param.id
                param3.ids = param.roles
                modifyUserRole(param3)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            }
          }

          if (this.pageKey === '角色') {
            let param = {
              ...this.formRole,
            }
            param.authors = param.authors.map((item) => {
              return {
                id: item,
              }
            })

            if (this.operate === '创建') {
              addRole(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('创建成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            } else if (this.operate === '修改') {
              modifyRole(param)
                .then(({ error, response }) => {
                  if (error.code === 0) {
                    this.$message.success('修改成功')
                    this.handleCancel()
                    this.$emit('fetchData')
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                })
            }
          }

          if (this.pageKey === '配置') {
            let param = {
              ...this.formConfig,
            }

            modifyConfig(param)
              .then(({ error, response }) => {
                if (error.code === 0) {
                  this.$message.success(`${this.operate}成功`)
                  this.handleCancel()
                  this.$emit('fetchData')
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.loading = false
                }, 500)
              })
          }

          if (this.pageKey === '任务') {
            let param = {
              taskTitle: this.formTask.taskTitle,
              remark: this.formTask.remark,
              startTime: this.formTask.rangeDate[0].valueOf(),
              stopTime: this.formTask.rangeDate[1].valueOf(),
              measuresList: this.formTask.measuresList,
            }
            //常规任务
            if (this.formTask.taskType === 0) {
              param.routineType = this.formTask.routineType
              param.timeRanges = []
              if (this.formTask.rangeStart1 && this.formTask.rangeEnd1) {
                param.timeRanges.push({
                  rangeStart: this.formTask.rangeStart1,
                  rangeEnd: this.formTask.rangeEnd1,
                })
              }
              if (this.formTask.rangeStart2 && this.formTask.rangeEnd2) {
                param.timeRanges.push({
                  rangeStart: this.formTask.rangeStart2,
                  rangeEnd: this.formTask.rangeEnd2,
                })
              }
              if (this.formTask.rangeStart3 && this.formTask.rangeEnd3) {
                param.timeRanges.push({
                  rangeStart: this.formTask.rangeStart3,
                  rangeEnd: this.formTask.rangeEnd3,
                })
              }
              param.routineType === 0 && delete param.timeRanges
              if (this.operate === '创建') {
                createNormalTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('创建成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              } else if (this.operate === '修改') {
                param.id = this.formTask.id
                updateTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            }

            //非常规任务
            if (this.formTask.taskType === 1) {
              param.nonroutineName = this.formTask.nonroutineName
              param.dataSubmitType = this.formTask.dataSubmitType
              if (this.operate === '创建') {
                createUnnormalTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('创建成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              } else if (this.operate === '修改') {
                param.id = this.formTask.id
                updateTask(param)
                  .then(({ error, response }) => {
                    if (error.code === 0) {
                      this.$message.success('修改成功')
                      this.handleCancel()
                      this.$emit('fetchData')
                    }
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.loading = false
                    }, 500)
                  })
              }
            }
          }
        }
      })
    },

    handleCancel() {
      this.$emit('update:visible', false)
      this.init()
    },

    init() {
      this.formInstrument = {
        noiseMeasureID: undefined,
        linkPort: undefined,
        deviceClassify: undefined,
        deviceType: undefined,
        password: undefined,
        producer: undefined,
        nickname: undefined,
        productionDate: undefined,
        readOct: true,
        readOct13: true,
        readSta: true,
        readLeq1s: true,
        readLp: true,
        readWeather: true,
        readCar: true,
        readDust: true,
        deviceUsage: undefined,
      }

      this.formDepartment = {
        departmentName: undefined,
        area: [],
        adCode: undefined,
        address: undefined,
        remark1: undefined,
        username: undefined,
        nickname: undefined,
        password: undefined,
        remark2: undefined,
        qualificationCertificateUrl: undefined,
        certificateValidDate: undefined,
        userId: undefined,
      }

      this.formRoad = {
        roadName: undefined,
        roadType: undefined,
        roadLength: undefined,
        roadPosition: [],
      }

      this.formPoint = {
        measureCode: undefined,
        measureName: undefined,
        province: '',
        city: '',
        district: '',
        adCode: undefined,
        address: undefined,
        funCode: undefined,
        lon: undefined,
        lat: undefined,
        noiseType: undefined,
        roadId: undefined,
        remark: undefined,
        readOct: true,
        readOct13: true,
        readSta: true,
        readLeq1s: true,
        readLp: true,
        readWeather: true,
        readCar: true,
        readDust: true,
      }

      this.formMaintain = {
        deviceId: undefined,
        reason: undefined,
        repairDate: undefined,
        remark: undefined,
      }
      this.formInspect = {
        deviceId: undefined,
        validity: undefined,
        verificationDate: undefined,
        accuracy: undefined,
        value: undefined,
        remark: undefined,
        certUrl: undefined,
      }

      this.formRole = {
        roleName: undefined,
        authors: [],
        remark: undefined,
      }

      this.formUser = {
        username: undefined,
        nickname: undefined,
        password: undefined,
        identityCardNo: undefined,
        qualificationCertificate: undefined,
        remark: undefined,
        roles: [],
        qualificationCertificateUrl: undefined,
        certificateValidDate: undefined,
      }

      this.formCalibrator = {
        calibrationDeviceNo: undefined,
        calibrationDeviceType: undefined,
        producer: undefined,
        productionDate: undefined,
      }

      this.formAnemograph = {
        windDeviceNo: undefined,
        windDeviceType: undefined,
        producer: undefined,
        productionDate: undefined,
      }

      this.fileListDepartment = []
      this.fileListUser = []

      this.formTask = {
        taskType: 0,
        taskTitle: '',
        remark: '',
        rangeDate: [],
        routineType: undefined, //监测数据类型
        rangeStart1: '',
        rangeEnd1: '',
        rangeStart2: '',
        rangeEnd2: '',
        rangeStart3: '',
        rangeEnd3: '',
        measuresList: [],
        nonroutineName: '',
        dataSubmitType: undefined,
      }
    },

    uploadChange(info) {
      this.fileListDepartment = [info.file]
      if (info.file.status === 'removed') {
        this.fileListDepartment = []
        this.formDepartment.qualificationCertificateUrl = undefined
      }
      if (info.file.status === 'done') {
        if (info.file.response.error.code === 0) {
          this.$message.success(`${info.file.name} 上传成功`)
          this.formDepartment.qualificationCertificateUrl = info.file.response.response.qualificationCertificateUrl
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },

    uploadChangeUser(info) {
      if (info.file.status === 'removed') {
        this.fileListUser = []
        this.formUser.qualificationCertificateUrl = undefined
      } else if (this.beforeUpload(info.file)) {
        let fileListIinfo = [info.file]
        if (info.file.status === 'done') {
          if (info.file.response.error.code === 0) {
            this.$message.success(`${info.file.name} 上传成功`)
            this.formUser.qualificationCertificateUrl = info.file.response.response.qualificationCertificateUrl
            fileListIinfo = fileListIinfo.map(file => {
              file.url = `${api_java}${this.formUser.qualificationCertificateUrl}?token=${this.$store.state.user.token}`
              return file;
            });
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`)
        }
        this.fileListUser = fileListIinfo
      }
    },

    uploadChangeInspect(info) {
      if (info.file.status === 'removed') {
        this.fileListInspect = []
        this.formInspect.certUrl = undefined
      } else if (this.beforeUpload(info.file)) {
        let fileListIinfo = [info.file]
        if (info.file.status === 'done') {
          if (info.file.response.error.code === 0) {
            this.$message.success(`${info.file.name} 上传成功`)
            this.formInspect.certUrl = info.file.response.response.qualificationCertificateUrl
            fileListIinfo = fileListIinfo.map(file => {
              file.url = `${api_java}${this.formInspect.certUrl}?token=${this.$store.state.user.token}`
              return file;
            });
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`)
        }
        this.fileListInspect = fileListIinfo
      }
    },

    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg和png格式的文件!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('只能上传最大10M的文件');
      }
      return isJpgOrPng && isLt10M;
    },

    uploadPreview(file) {
      lookCert(file.name)
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days')
    },
  },
}
</script>
