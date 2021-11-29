<template>
  <div class="ExecuteTaskDrawer">
    <a-drawer
      width="1000"
      title="执行任务"
      :visible="visible"
      :closable="true"
      :maskClosable="true"
      @close="handleClose"
    >
      <a-steps
        :current="currentStep"
        :style="{
          width: '300px',
          margin: '0px auto 24px',
        }"
      >
        <a-step title="绑定仪器" />
        <a-step title="测量任务" />
      </a-steps>

      <a-form-model
        v-if="currentStep === 0"
        ref="refForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="仪器" prop="instrumentId">
          <InstrumentSelect v-model="form.instrumentId" @change="handleInstrumentSelectChange" />
        </a-form-model-item>
        <a-descriptions>
          <a-descriptions-item label="仪器类型">
            {{ instrumentDetail.deviceClassify | deviceClassifyFormat }}
          </a-descriptions-item>

          <a-descriptions-item label="仪器型号">
            {{ instrumentDetail.deviceType | deviceTypeFormat }}
          </a-descriptions-item>

          <a-descriptions-item label="仪器编号">
            {{ instrumentDetail.noiseMeasureID }}
          </a-descriptions-item>

          <a-descriptions-item label="使用方式">
            {{ instrumentDetail.deviceUsage | deviceUsageFormat }}
          </a-descriptions-item>

          <a-descriptions-item label="生产厂家">
            {{ instrumentDetail.producer }}
          </a-descriptions-item>

          <a-descriptions-item label="出厂日期">
            {{ instrumentDetail.productionDate | unix2String }}
          </a-descriptions-item>

          <a-descriptions-item label="精度">
            {{ instrumentDetail.verificationRecord.accuracy }}
          </a-descriptions-item>

          <a-descriptions-item label="检定日期">
            {{ instrumentDetail.verificationRecord.validDate | unix2String }}
          </a-descriptions-item>
        </a-descriptions>

        <div v-if="instrumentDetail.deviceUsage === 1">
          <a-form-model-item label="校准器" prop="calibratorId">
            <CalibratorSelect v-model="form.calibratorId" @change="handleCalibratorSelectChange" />
          </a-form-model-item>
          <a-descriptions>
            <a-descriptions-item label="仪器型号">
              {{ calibratorDetail.calibrationDeviceTypeName }}
            </a-descriptions-item>

            <a-descriptions-item label="仪器编号">
              {{ calibratorDetail.calibrationDeviceNo }}
            </a-descriptions-item>

            <a-descriptions-item label="生产厂家">
              {{ calibratorDetail.producer }}
            </a-descriptions-item>

            <a-descriptions-item label="出厂日期">
              {{ calibratorDetail.productionDate | unix2String }}
            </a-descriptions-item>

            <a-descriptions-item label="检定示值(dB)">
              {{ calibratorDetail.verificationRecord.value }}
            </a-descriptions-item>

            <a-descriptions-item label="检定日期">
              {{ calibratorDetail.verificationRecord.validDate | unix2String }}
            </a-descriptions-item>

            <a-descriptions-item label="精度">
              {{ calibratorDetail.verificationRecord.accuracy }}
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <div v-if="instrumentDetail.deviceUsage === 1">
          <a-form-model-item label="风速仪" prop="anemographId">
            <AnemographSelect v-model="form.anemographId" @change="handleAnemographSelectChange" />
          </a-form-model-item>
          <a-descriptions>
            <a-descriptions-item label="仪器型号">
              {{ anemographDetail.windDeviceType }}
            </a-descriptions-item>

            <a-descriptions-item label="仪器编号">
              {{ anemographDetail.windDeviceNo }}
            </a-descriptions-item>

            <a-descriptions-item label="生产厂家">
              {{ anemographDetail.producer }}
            </a-descriptions-item>

            <a-descriptions-item label="出厂日期">
              {{ anemographDetail.productionDate | unix2String }}
            </a-descriptions-item>

            <a-descriptions-item label="检定示值">
              {{ anemographDetail.verificationRecord.value }}
            </a-descriptions-item>

            <a-descriptions-item label="检定日期">
              {{ anemographDetail.verificationRecord.validDate | unix2String }}
            </a-descriptions-item>

            <a-descriptions-item label="精度">
              {{ anemographDetail.verificationRecord.accuracy }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </a-form-model>

      <section v-if="currentStep === 1">
        <div v-if="instrumentDetail.deviceUsage === 1" :style="{ marginBottom: '50px' }">
          <h1>1.测量前校准</h1>
          <a-form-model ref="refForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="校准器">
              <a-switch />
            </a-form-model-item>

            <div class="calibrator-value-container">
              <span class="calibrator-value"> 123 dB </span>
              <a-button type="primary">记录</a-button>
            </div>

            <a-form-model-item label="校准器示值">
              <a-input disabled></a-input>
            </a-form-model-item>

            <a-form-model-item label="目标值">
              <a-input></a-input>
            </a-form-model-item>
          </a-form-model>
        </div>

        <div :style="{ marginBottom: '50px' }">
          <h1>{{ instrumentDetail.deviceUsage === 1 ? '2' : '1' }}.测量数据</h1>
          <div :style="{ margin: '24px 0px', paddingLeft: '24px' }">
            <a-space :size="200">
              <a-statistic title="Lp" :value="displayData.Lp">
                <template #formatter="{ value }">
                  <span v-if="value !== -1">{{ value }}</span>
                  <span v-else>-</span>
                </template>
              </a-statistic>
              <a-statistic title="仪器时间" :value="displayData.MeasureTime">
                <template #formatter="{ value }">
                  <span v-if="value !== -1">{{ value | unix2String }}</span>
                  <span v-else>-</span>
                </template>
              </a-statistic>

              <CountUp v-if="measureStartTime !== -1" :value="measureStartTime"></CountUp>
              <a-statistic v-else title="测量时长" :value="'-'">
                <template #formatter="{ value }">
                  {{ value }}
                </template>
              </a-statistic>
            </a-space>
            <a-button
              v-if="!measuring"
              type="primary"
              :style="{ display: 'block', marginTop: '24px' }"
              @click="handleStartMeasure"
            >
              开始测量
            </a-button>

            <a-button
              v-if="measuring"
              type="danger"
              :style="{ display: 'block', marginTop: '24px' }"
              @click="handleStopMeasure"
            >
              停止测量
            </a-button>
          </div>
        </div>

        <div :style="{ marginBottom: '50px' }">
          <h1>{{ instrumentDetail.deviceUsage === 1 ? '3' : '2' }}.选择数据</h1>
          <a-form-model ref="refForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="声仪器数据">
              <a-button>选择数据</a-button>
            </a-form-model-item>

            <a-form-model-item label="风速仪数据">
              <a-input></a-input>
            </a-form-model-item>
          </a-form-model>
        </div>

        <div v-if="instrumentDetail.deviceUsage === 1" :style="{ marginBottom: '50px' }">
          <h1>4.测量后校准</h1>
          <a-form-model ref="refForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="校准器">
              <a-switch />
            </a-form-model-item>
            <div class="calibrator-value-container">
              <span class="calibrator-value"> 123 dB </span>
              <a-button type="primary">记录</a-button>
            </div>
          </a-form-model>
        </div>
      </section>

      <!-- 尾部按钮 -->
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1,
        }"
      >
        <a-button> 重新测量 </a-button>
        <div>
          <a-button v-if="currentStep === 1" :style="{ marginRight: '8px' }" @click="currentStep--"> 上一步 </a-button>
          <a-button type="primary" :loading="btnLoading" @click="handleNextStep"> 下一步 </a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getInstrument, getCalibrator, getAnemograph, taskBindDevice, taskControlDevice } from '@/api/api'
import InstrumentSelect from './InstrumentSelect'
import CalibratorSelect from './CalibratorSelect'
import AnemographSelect from './AnemographSelect'
import CountUp from './CountUp'

const rules = {
  instrumentId: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  calibratorId: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  anemographId: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
}
export default {
  name: 'ExecuteTaskDrawer',

  components: {
    InstrumentSelect,
    CalibratorSelect,
    AnemographSelect,
    CountUp,
  },

  props: ['visible', 'recordId', 'record'],

  data() {
    return {
      currentStep: 0,
      form: {
        instrumentId: undefined,
        calibratorId: undefined,
        anemographId: undefined,
      },
      rules,
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },

      instrumentDetail: { verificationRecord: {} },
      calibratorDetail: { verificationRecord: {} },
      anemographDetail: { verificationRecord: {} },

      btnLoading: false,

      instrumentRealDataWebsocket: null,
      displayData: {
        Lp: -1,
        MeasureTime: -1,
      },
      instrumentRealData: {},
      measuring: false,
      measureStartTime: -1,
    }
  },

  watch: {
    currentStep(value) {
      if (value === 1) {
        this.initInstrumentRealDataWebSocket()
      }
    },
  },

  beforeDestroy() {
    this.instrumentRealDataWebsocket && this.instrumentRealDataWebsocket.close()
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.form = {
        instrumentId: undefined,
        calibratorId: undefined,
        anemographId: undefined,
      }
      this.instrumentDetail = { verificationRecord: {} }
      this.calibratorDetail = { verificationRecord: {} }
      this.anemographDetail = { verificationRecord: {} }
      this.currentStep = 0
    },

    handleNextStep() {
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true
          let res1, res2, res3
          res1 = await taskBindDevice({
            id: this.recordId,
            deviceSerialNo: this.instrumentDetail.noiseMeasureID,
            deviceClassify: 1, //1：声测量仪器
          })

          if (this.instrumentDetail.deviceUsage === 1) {
            //手持
            res2 = await taskBindDevice({
              id: this.recordId,
              deviceSerialNo: this.calibratorDetail.calibrationDeviceNo,
              deviceClassify: 3, //3：校准器
            })

            res3 = await taskBindDevice({
              id: this.recordId,
              deviceSerialNo: this.anemographDetail.windDeviceNo,
              deviceClassify: 4, //4：风速仪
            })
          }

          if (this.instrumentDetail.deviceUsage === 1) {
            if (res1.error.code === 0 && res2.error.code === 0 && res3.error.code === 0) {
              this.currentStep++
            }
          } else {
            if (res1.error.code === 0) {
              this.currentStep++
            }
          }

          this.btnLoading = false
        }
      })
    },

    handleInstrumentSelectChange(id) {
      getInstrument(id).then(({ error, response }) => {
        if (error.code === 0) {
          this.instrumentDetail = response
          if (!this.instrumentDetail.verificationRecord) {
            this.instrumentDetail.verificationRecord = {}
          }
        }
      })
    },

    handleCalibratorSelectChange(id) {
      getCalibrator(id).then(({ error, response }) => {
        if (error.code === 0) {
          this.calibratorDetail = response
          if (!this.calibratorDetail.verificationRecord) {
            this.calibratorDetail.verificationRecord = {}
          }
        }
      })
    },

    handleAnemographSelectChange(id) {
      getAnemograph(id).then(({ error, response }) => {
        if (error.code === 0) {
          this.anemographDetail = response
          if (!this.anemographDetail.verificationRecord) {
            this.anemographDetail.verificationRecord = {}
          }
        }
      })
    },

    initInstrumentRealDataWebSocket() {
      const wsurl = `${this.$websocket_url}/WebSocketLpApp`
      this.instrumentRealDataWebsocket = new WebSocket(wsurl)

      this.instrumentRealDataWebsocket.onopen = () => {
        console.log('app实时数据websocket连接成功')
        this.instrumentRealDataWebsocket.send(
          JSON.stringify({
            Class: '901',
            Token: this.$store.state.user.token,
            DeviceId: this.instrumentDetail.noiseMeasureID,
            TaskType: this.record.routineType,
          }),
        )
      }

      this.instrumentRealDataWebsocket.onmessage = (e) => {
        let result = JSON.parse(e.data) // 接收数据
        if (result.ErrorCode == 0) {
          this.$message.error('获取app实时数据失败')
        } else {
          this.instrumentRealData = result
        }
      }

      this.instrumentRealDataWebsocket.onclose = () => {
        console.log('app实时数据websocket关闭了')
      }

      this.instrumentRealDataWebsocket.onerror = () => {
        console.log('app实时数据websocket连接发生错误')
      }
    },

    handleStartMeasure() {
      taskControlDevice({
        id: this.recordId,
        deviceSerialNo: this.instrumentDetail.noiseMeasureID,
        control: 0,
      }).then((res) => {
        if (res.error.code === 0) {
          this.displayData = this.instrumentRealData
          this.measuring = true
          this.measureStartTime = Number(res.response.time)
        }
      })
    },

    handleStopMeasure() {
      taskControlDevice({
        id: this.recordId,
        deviceSerialNo: this.instrumentDetail.noiseMeasureID,
        control: 1,
      }).then((res) => {
        if (res.error.code === 0) {
          this.displayData = {
            Lp: -1,
            MeasureTime: -1,
          }
          this.measuring = false
          this.measureStartTime = -1
        }
      })
    },
  },
}
</script>


<style lang="less" scoped>
/deep/ .ant-descriptions {
  padding: 20px 20px 8px;
  margin-bottom: 48px;
  background-color: #eeeeee;
}
</style>

<style lang="less" >
.calibrator-value-container {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-left: 117px;
  .calibrator-value {
    font-size: 24px;
    margin-right: 24px;
  }
}
</style>