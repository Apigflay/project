<template>
  <div>
    <a-modal
      title="设置仪器参数"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable="false"
      style="top:50px;"
      :bodyStyle="{padding: 0, height:'720px'}"
      width="600px"
    >
      <a-tabs defaultActiveKey="1" :animated="false">
        <a-tab-pane tab="参数设置" key="1" :forceRender="true">
          <a-form :form="form">
            <a-form-item label="采样间隔" v-bind="formItemLayout">
              <a-input-number style="width:80%" :min="0" v-decorator="[
                  'CollectionCyc'
                ]" />
              <span class="unit">/0.1秒</span>
            </a-form-item>

            <a-form-item label="积分时间" v-bind="formItemLayout">
              <a-input-number style="width:80%" :min="0" v-decorator="[
                  'IntegralTime'
                ]" />
              <span class="unit">秒</span>
            </a-form-item>

            <a-form-item label="上传间隔" v-bind="formItemLayout">
              <a-input-number style="width:80%" :min="0" v-decorator="[
                  'OutputCyc'
                ]" />
              <span class="unit">/0.1秒</span>
            </a-form-item>

            <a-form-item label="频率计权" v-bind="formItemLayout">
              <a-radio-group v-decorator="['F_Weighting' ]">
                <a-radio value="A">A</a-radio>
                <a-radio value="C">C</a-radio>
                <a-radio value="Z">Z</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="时间计权" v-bind="formItemLayout">
              <a-radio-group v-decorator="['T_Weighting']">
                <a-radio value="F" style="margin-right:11px;">F</a-radio>
                <a-radio value="S" style="margin-right:9px;">S</a-radio>
                <a-radio value="I">I</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item v-bind="formItemLayout" label="自动电校准时间">
              <!-- <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['AdjDateTime']" style="width:80%" placeholder :allowClear="false" /> -->
              <a-time-picker v-decorator="['AdjDateTime']" style="width:80%" :allowClear="false" />
            </a-form-item>

            <a-form-item label="自动电校准间隔" v-bind="formItemLayout">
              <a-select style="width: 80%;" v-decorator="['AdjInterval']">
                <a-select-option value="12">12</a-select-option>
                <a-select-option value="24">24</a-select-option>
              </a-select>
              <span class="unit">小时</span>
            </a-form-item>

            <a-form-item label="是否校准" v-bind="formItemLayout">
              <a-checkbox v-decorator="['AdjEnable', {valuePropName: 'checked'}]" />
            </a-form-item>

            <!-- <a-form-item label="是否录音" v-bind="formItemLayout">
              <a-checkbox v-decorator="['measurecod22e']" />
            </a-form-item>-->
          </a-form>
        </a-tab-pane>

        <a-tab-pane tab="超标事件" key="2" :forceRender="true">
          <a-form :form="form">
            <div class="title">超标设置</div>
            <a-row>
              <a-col :span="8" style="transform: translateX(100px);">
                <a-form-item label="白天" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['DayStdValue']" />
                  <span class="unit">dB</span>
                </a-form-item>
              </a-col>
              <a-col :span="8" style="transform: translateX(51px);">
                <a-form-item label="晚上" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['NightStdValue']" />
                  <span class="unit">dB</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="延时" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['OnTime']" :precision="0" />
                  <span class="unit">秒</span>
                </a-form-item>
              </a-col>
            </a-row>

            <div class="title">频谱超标设置</div>
            <a-row>
              <a-col :span="8" style="transform: translateX(100px);">
                <a-form-item label="白天" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['OctOverDay']" />
                  <span class="unit">dB</span>
                </a-form-item>
              </a-col>
              <a-col :span="8" style="transform: translateX(51px);">
                <a-form-item label="晚上" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['OctOverNight']" />
                  <span class="unit">dB</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="延时" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['OctOnTime']" :precision="0" />
                  <span class="unit">秒</span>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="自动上传" v-bind="formItemLayout">
              <a-checkbox v-decorator="['OctEnable', {valuePropName: 'checked'}]" />
            </a-form-item>

            <div class="title">超标录音设置</div>
            <a-row>
              <a-col :span="8" style="transform: translateX(100px);">
                <a-form-item label="白天" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['RecorderOverDay']" />
                  <span class="unit">dB</span>
                </a-form-item>
              </a-col>
              <a-col :span="8" style="transform: translateX(51px);">
                <a-form-item label="晚上" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['RecorderOverNight']" />
                  <span class="unit">dB</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="延时" v-bind="formItemLayout">
                  <a-input-number :min="0" style="width:50%" v-decorator="['RecorderOnTime']" :precision="0" />
                  <span class="unit">秒</span>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="是否录音" v-bind="formItemLayout">
              <a-checkbox v-decorator="['RecorderEnable', {valuePropName: 'checked'}]" />
            </a-form-item>
            <div class="title">录音上传设置</div>
            <a-form-item label="起始时间" v-bind="formItemLayout">
              <a-date-picker
                style="width: 83%"
                v-decorator="['RecorderUpBeginTime']"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                :disabledDate="disabledStartDate"
                @openChange="handleEndOpenChange"
                :open="endOpen"
                :allowClear="false"
              />
            </a-form-item>
            <a-form-item label="结束时间" v-bind="formItemLayout">
              <a-date-picker
                style="width: 83%"
                v-decorator="['RecorderUpEndTime']"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                :disabledDate="disabledEndDate"
                :allowClear="false"
              />
            </a-form-item>
            <a-form-item label="上传模式" v-bind="formItemLayout">
              <a-select style="width: 83%" v-decorator="['RecorderAuto_Up']">
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">串口</a-select-option>
                <a-select-option :value="2">网口</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane tab="事件参数" key="3" :forceRender="true">
          <a-form :form="form">
            <div class="event-params-wrapper">
              <a-row class="event-params-row">
                <a-col :span="9">事件类型</a-col>
                <a-col :span="9">自动上传</a-col>
                <a-col :span="6">自动保存</a-col>
              </a-row>
              <a-row class="event-params-row">
                <a-col :span="9">手动控制电校准</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_m_calibration', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="event-params-row">
                <a-col :span="9">自动电校准</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_a_calibration', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">加热</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_heating', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">噪声超标</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_noiseLimit', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">仪器启动</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_startup', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">仪器正常关机</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_close', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">停电</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_powerCut', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">机箱门被打开</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_openDoor', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">读声级计出错</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_noiseError', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">CF出错</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_memoryError', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">USB口出错</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_usbError', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">电池电压不足</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_voltageLow_b', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row class="event-params-row">
                <a-col :span="9">声校准</a-col>
                <a-col :span="9">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox v-decorator="['Event_s_calibration', {valuePropName: 'checked'}]"></a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item style="margin-bottom:0px">
                    <a-checkbox defaultChecked disabled></a-checkbox>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </a-tab-pane>

        <!-- <a-tab-pane tab="其他设置" key="4" :forceRender="true">
          <a-form :form="form">
            <a-form-item label="授权设置" v-bind="formItemLayout">
              <a-input style="width:80%" v-decorator="[]" />
            </a-form-item>

            <a-form-item label="通用协议版本" v-bind="formItemLayout">
              <a-input style="width:80%"  />
            </a-form-item>

            <a-form-item label="采集程序版本" v-bind="formItemLayout">
              <a-input style="width:80%"  />
            </a-form-item>

            <a-form-item label="界面程序版本" v-bind="formItemLayout">
              <a-input style="width:80%"  />
            </a-form-item>

            <a-form-item label="内核程序版本" v-bind="formItemLayout">
              <a-input style="width:80%"  />
            </a-form-item>

            <a-form-item label="硬件程序版本" v-bind="formItemLayout">
              <a-input style="width:80%"  />
            </a-form-item>
          </a-form>
        </a-tab-pane>-->
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
import { getUserInfo, getCaptcha, modifyPassword } from '@/api/login'
import { mapGetters } from 'vuex'
import { GetMeaureInfo } from '@/api/manage-set'
import moment from 'moment'

export default {
  name: 'SetParamsModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    pointInfo: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      confirmDirty: false,
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
      form: this.$form.createForm(this),
      websock: null,
      endOpen: false
    }
  },

  watch: {
    visible(val) {
      if (val === true) {
        this.getMeaureInfo()
      }
    }
  },

  beforeDestroy() {
    this.websock && this.websock.close()
  },

  methods: {
    moment,
    ...mapGetters(['userInfo', 'pointList']),

    disabledStartDate(startValue) {
      const endValue = this.form.getFieldValue('RecorderUpEndTime')
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.form.getFieldValue('RecorderUpBeginTime')
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },

    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          this.initSetPointWebSocket()
        }
      })
    },

    handleCancel(e) {
      this.$emit('update:visible', false)
      this.confirmLoading = false
      this.form.resetFields()
    },

    getMeaureInfo() {
      GetMeaureInfo(this.pointInfo.MeasureId).then(res => {
        let result = JSON.parse(res.d) // 接收数据
        if (result.Error) {
          this.$message.error('读取测点信息失败')
        } else {
          this.$nextTick().then(() => {
            this.form.setFieldsValue({
              CollectionCyc: result.CollectionCyc, //采样间隔
              IntegralTime: result.IntegralTime, //积分时间
              OutputCyc: result.OutputCyc, //上传间隔
              F_Weighting: result.F_Weighting, //频率计权
              T_Weighting: result.T_Weighting, //时间集权
              AdjDateTime: result.AdjDateTime ? moment(result.AdjDateTime, 'YYYY-MM-DD HH:mm:ss') : undefined, //自动电校准时间
              AdjInterval: result.AdjInterval == 0 ? undefined : result.AdjInterval, //自动点校准间隔
              AdjEnable: result.AdjEnable, //是否校准

              //超标设置
              DayStdValue: result.DayStdValue, //白天
              NightStdValue: result.NightStdValue, //晚上
              OnTime: result.OnTime, //延时

              //频谱超标设置
              OctOverDay: result.OctOverDay, //白天
              OctOverNight: result.OctOverNight, //晚上
              OctOnTime: result.OctOnTime, //延时
              OctEnable: result.OctEnable, //自动上传

              //超标录音设置
              RecorderOverDay: result.RecorderOverDay, //白天
              RecorderOverNight: result.RecorderOverNight, //晚上
              RecorderOnTime: result.RecorderOnTime, //延时
              RecorderEnable: result.RecorderEnable, //是否录音

              //录音上传设置
              RecorderUpBeginTime: result.RecorderUpBeginTime
                ? moment(result.RecorderUpBeginTime, 'YYYY-MM-DD HH:mm:ss')
                : undefined,
              RecorderUpEndTime: result.RecorderUpEndTime
                ? moment(result.RecorderUpEndTime, 'YYYY-MM-DD HH:mm:ss')
                : undefined,
              RecorderAuto_Up: result.RecorderAuto_Up,

              //事件参数
              Event_m_calibration: result.Event_m_calibration,
              Event_a_calibration: result.Event_a_calibration,
              Event_s_calibration: result.Event_s_calibration,
              Event_heating: result.Event_heating,
              Event_noiseLimit: result.Event_noiseLimit,
              Event_startup: result.Event_startup,
              Event_close: result.Event_close,
              Event_powerCut: result.Event_powerCut,
              Event_openDoor: result.Event_openDoor,
              Event_noiseError: result.Event_noiseError,
              Event_memoryError: result.Event_memoryError,
              Event_usbError: result.Event_usbError,
              Event_voltageLow_b: result.Event_voltageLow_b
            })
          })
        }
      })
    },

    initSetPointWebSocket() {
      const wsurl = `${this.$websocket_url}/WebSocketSvr`
      this.websocket = new WebSocket(wsurl)

      //发送数据
      this.websocket.onopen = () => {
        console.log('设置测点websocket连接成功')

        let fixedParams = {
          Class: '105', //固定
          Flag: '20170516010101001', //指令唯一标识
          MeasureHJ661ID: this.pointInfo.MeasureCode, //测点编号
          DeviceAWAID: this.pointInfo.MeasureId //仪器编号
        }

        let formParams = this.form.getFieldsValue()
        formParams.AdjDateTime = formParams.AdjDateTime.format('YYYYMMDDHHmmss')
        formParams.RecorderUpBeginTime = formParams.RecorderUpBeginTime.format('YYYYMMDDHHmmss')
        formParams.RecorderUpEndTime = formParams.RecorderUpEndTime.format('YYYYMMDDHHmmss')

        let params = Object.assign(fixedParams, formParams)
        this.websocket.send(JSON.stringify(params))
      }

      // 接收数据
      this.websocket.onmessage = e => {
        let result = JSON.parse(e.data)
        if (result.ErrorCode == 0) {
          this.$message.error('设置仪器参数失败')
        } else {
          this.$message.success('设置仪器参数成功')
          this.handleCancel()
        }
        this.confirmLoading = false
        this.websocket.close()
      }

      this.websocket.onclose = () => {
        console.log('设置测点websocket关闭了')
      }

      this.websocket.onerror = () => {
        console.log('设置测点websocket连接发生错误')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.unit {
  display: inline-block;
  margin-left: 4px;
}

.title {
  display: inline-block;
  margin-left: 24px;
  margin-bottom: 16px;
}

.title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 12px;
  background-color: #e4e4e4;
  transform: translateY(1px);
  margin-right: 6px;
  border-radius: 10px;
  user-select: none;
}

/deep/ .ant-tabs-tab {
  &:first-child {
    margin-left: 30px;
  }
}

.event-params-wrapper {
  width: 450px;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 auto;
  .event-params-row {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(46, 91, 255, 0.08);
    &:first-child {
      background: #fafafa;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
