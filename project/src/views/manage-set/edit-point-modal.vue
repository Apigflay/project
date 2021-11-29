<template>
  <div>
    <a-modal
      title="设置测点"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable="false"
      style="top: 130px;"
      :bodyStyle="{paddingTop: 0, height: '480px'}"
      width="600px"
    >
      <a-tabs v-model="tabsKey" :animated="false">
        <a-tab-pane tab="基本信息" key="1" :forceRender="true">
          <a-form :form="form">
            <a-form-item label="测点编号" v-bind="formItemLayout">
              <a-input disabled v-decorator="['MeasureCode']" />
            </a-form-item>

            <a-form-item label="仪器编号" v-bind="formItemLayout">
              <a-input disabled v-decorator="['MeasureId']" />
            </a-form-item>

            <a-form-item label="仪器类型" v-bind="formItemLayout">
              <a-input disabled v-decorator="['MeasureType']" />
            </a-form-item>

            <a-form-item label="测点名称" v-bind="formItemLayout">
              <a-input
                placeholder="请输入测点名称"
                v-decorator="[
              'MeasureName',
              {
                rules: [
                  { 
                    required: true, message: '请输入测点名称', whitespace:true
                  },
                  {
                    max:32, message: '最多输入32个字符'
                  }
                ],
              }
            ]"
              />
            </a-form-item>

            <a-form-item label="测点地址" v-bind="formItemLayout">
              <a-input
                placeholder="请输入测点地址"
                v-decorator="[
              'MeasureAddress',
              {
                rules: [
                  {
                    max:256, message: '最多输入256个字符'
                  }
                ],
              }
            ]"
              />
            </a-form-item>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="经纬度" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input-number
                    style="width:100% "
                    placeholder="请输入经度"
                    v-decorator="[
                  'LONG',
                  {
                    rules: [
                      { required: true, message: '请输入测点经度'}
                    ],
                  }
                ]"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item :wrapper-col="{ span: 24 }">
                  <a-input-number
                    style="width:100% "
                    placeholder="请输入纬度"
                    v-decorator="[
                  'Latitude',
                  {
                    rules: [
                      { required: true, message: '请输入测点纬度' }
                    ],
                  }
                ]"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="4">
                <div class="map-choose" @click="clickMapSelectPoint">地图选点</div>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>

        <a-tab-pane v-if="is6218j" tab="高级信息" key="2" :forceRender="true">
          <a-form :form="form">
            <a-form-item label="功能区" v-bind="formItemLayout">
              <a-select
                style="width: 100%;"
                placeholder="请选择功能区"
                v-decorator="['funCode']"
                :defaultActiveFirstOption="false"
              >
                <a-select-option :value="0">0类</a-select-option>
                <a-select-option :value="1">1类</a-select-option>
                <a-select-option :value="2">2类</a-select-option>
                <a-select-option :value="3">3类</a-select-option>
                <a-select-option :value="4">4a类</a-select-option>
                <a-select-option :value="5">4b类</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="噪声类型" v-bind="formItemLayout">
              <a-select
                style="width: 100%;"
                placeholder="噪声类型"
                v-decorator="['mnoisetype']"
                :defaultActiveFirstOption="false"
              >
                <a-select-option :value="0">功能区噪声</a-select-option>
                <a-select-option :value="1">交通噪声</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane v-if="is6218j" tab="测点数据自动读取" key="3" :forceRender="true">
          <a-form :form="form">
            <a-form-item
              label="是否读取分钟统计"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readstai', {valuePropName: 'checked', initialValue: true  }]" disabled></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取小时统计"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readstah', {valuePropName: 'checked' , initialValue: true }]" disabled></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取天统计"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readstad', {valuePropName: 'checked', initialValue: true  }]" disabled></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取OCT"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readoct', {valuePropName: 'checked' }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取1/3OCT"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readoct13', {valuePropName: 'checked' }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取Lp"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readlp', {valuePropName: 'checked' }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取leq1s"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readleq1s', {valuePropName: 'checked' }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取车流量数据"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readcar', {valuePropName: 'checked' }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取气象数据"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readwea', {valuePropName: 'checked' }]"></a-checkbox>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <a-modal
      title="地图选点"
      :visible="showMap"
      @cancel="mapModalCancel"
      width="90%"
      :centered="true"
      :bodyStyle="{padding: 0}"
      :maskClosable="true"
      :wrapClassName="'notification-way'"
      :destroyOnClose="true"
      :footer="null"
    >
      <baidu-map class="map" :center="center" :zoom="12" :scroll-wheel-zoom="true" @click="clickMap">
        <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <bm-marker :position="position" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
      </baidu-map>
    </a-modal>
  </div>
</template>

<script>
import { GetMeaureInfo } from '@/api/manage-set'
import gcoord from 'gcoord'

export default {
  name: 'EditPointModal',

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
      confirmLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      form: this.$form.createForm(this),
      showMap: false,
      position: {},
      center: '',
      websocket: null,
      tabsKey: '1'
    }
  },

  computed: {
    is6218j() {
      if (this.pointInfo.MeasureType) {
        if (this.pointInfo.MeasureType.includes('6218J')) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
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
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          this.initSetPointWebSocket()
        }
      })
    },

    initSetPointWebSocket() {
      const wsurl = `${this.$websocket_url}/WebSocketSvr`
      this.websocket = new WebSocket(wsurl)

      this.websocket.onopen = () => {
        console.log('设置测点websocket连接成功')

        if (this.pointInfo.MeasureType.includes('6218J')) {
          this.websocket.send(
            JSON.stringify({
              Class: '105', //固定
              Flag: '20170516010101001', //指令唯一标识
              MeasureHJ661ID: this.form.getFieldValue('MeasureCode'), //测点编号
              DeviceAWAID: this.form.getFieldValue('MeasureId'), //仪器编号

              MeasureName: this.form.getFieldValue('MeasureName'),
              MeasureAddress: this.form.getFieldValue('MeasureAddress'),
              LONG: this.form.getFieldValue('LONG'),
              Latitude: this.form.getFieldValue('Latitude'),

              FunctionCode: this.form.getFieldValue('funCode'),
              MNoiseType: this.form.getFieldValue('mnoisetype'),

              AutoReadMinuteSTA: this.form.getFieldValue('readstai'),
              AutoReadHourSTA: this.form.getFieldValue('readstah'),
              AutoReadDaySTA: this.form.getFieldValue('readstad'),
              AutoReadOct: this.form.getFieldValue('readoct'),
              AutoReadOct13: this.form.getFieldValue('readoct13'),
              AutoReadLp: this.form.getFieldValue('readlp'),
              AutoReadLeq1S: this.form.getFieldValue('readleq1s'),
              AutoReadTraffic: this.form.getFieldValue('readcar'),
              AutoReadWeather: this.form.getFieldValue('readwea')
            })
          )
        } else {
          this.websocket.send(
            JSON.stringify({
              Class: '105', //固定
              Flag: '20170516010101001', //指令唯一标识
              MeasureHJ661ID: this.form.getFieldValue('MeasureCode'), //测点编号
              DeviceAWAID: this.form.getFieldValue('MeasureId'), //仪器编号

              MeasureName: this.form.getFieldValue('MeasureName'),
              MeasureAddress: this.form.getFieldValue('MeasureAddress'),
              LONG: this.form.getFieldValue('LONG'),
              Latitude: this.form.getFieldValue('Latitude'),

              FunctionCode: 0,
              MNoiseType: 0,

              AutoReadMinuteSTA: true,
              AutoReadHourSTA: true,
              AutoReadDaySTA: true,
              AutoReadOct: true,
              AutoReadOct13: true,
              AutoReadLp: true,
              AutoReadLeq1S: true,
              AutoReadTraffic: true,
              AutoReadWeather: true
            })
          )
        }
      }

      this.websocket.onmessage = e => {
        let result = JSON.parse(e.data) // 接收数据
        if (result.ErrorCode == 0) {
          this.$message.error('设置测点失败')
        } else {
          this.$message.success('设置测点成功')
          this.$store.dispatch('GetUserInfo')
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
    },

    handleCancel(e) {
      this.$emit('update:visible', false)
      this.confirmLoading = false
      this.form.resetFields()
      this.position = {}
      this.tabsKey = '1'
    },

    mapModalCancel() {
      this.showMap = false
    },

    clickMap({ type, target, point, pixel, overlay }) {
      this.position = point

      let result = gcoord.transform(
        [point.lng, point.lat], // 经纬度坐标
        gcoord.BD09, // 当前坐标系
        gcoord.WGS84 // 目标坐标系
      )
      this.form.setFieldsValue({
        LONG: result[0],
        Latitude: result[1]
      })
    },

    clickMapSelectPoint() {
      let result = gcoord.transform(
        [this.form.getFieldValue('LONG'), this.form.getFieldValue('Latitude')], // 经纬度坐标
        gcoord.WGS84, // 当前坐标系
        gcoord.BD09 // 目标坐标系
      )

      this.position = {
        lng: result[0],
        lat: result[1]
      }
      if (!this.position.lat || !this.position.lng) {
        this.center = '浙江'
      } else {
        this.center = this.position
      }
      this.showMap = true
    },

    getMeaureInfo() {
      GetMeaureInfo(this.pointInfo.MeasureId).then(res => {
        let result = JSON.parse(res.d) // 接收数据
        if (result.Error) {
          this.$message.error('读取测点信息失败')
        } else {
          this.$nextTick().then(() => {
            if (this.pointInfo.MeasureType.includes('6218J')) {
              this.form.setFieldsValue({
                MeasureCode: this.pointInfo.MeasureCode,
                MeasureId: this.pointInfo.MeasureId,
                MeasureType: this.pointInfo.MeasureType,
                MeasureName: this.pointInfo.MeasureName,
                MeasureAddress: this.pointInfo.MeasureAddress,
                LONG: this.pointInfo.LONG,
                Latitude: this.pointInfo.Latitude,

                funCode: result.FunctionCode, //功能区
                mnoisetype: result.MNoiseType, //噪声类型

                readstai: result.AutoReadMinuteSTA, //自动读取分钟
                readstah: result.AutoReadHourSTA,
                readstad: result.AutoReadDaySTA,
                readoct: result.AutoReadOct,
                readoct13: result.AutoReadOct13,
                readlp: result.AutoReadLp,
                readleq1s: result.AutoReadLeq1S,
                readcar: result.AutoReadTraffic,
                readwea: result.AutoReadWeather
              })
            } else {
              this.form.setFieldsValue({
                MeasureCode: this.pointInfo.MeasureCode,
                MeasureId: this.pointInfo.MeasureId,
                MeasureType: this.pointInfo.MeasureType,
                MeasureName: this.pointInfo.MeasureName,
                MeasureAddress: this.pointInfo.MeasureAddress,
                LONG: this.pointInfo.LONG,
                Latitude: this.pointInfo.Latitude
              })
            }
          })
        }
      })
    }
  }
}
</script>


<style lang="less" scoped>
.map-choose {
  color: #1bd39b;
  cursor: pointer;
  height: 39px;
  line-height: 39px;
  margin-left: 0px;
  user-select: none;
}

.map {
  width: 100%;
  height: calc(100vh - 156px);
}
</style>


<style lang="less">
.notification-way .ant-modal {
  padding-bottom: 0px;
}
</style>
