<template>
  <div>
    <a-modal
      title="添加测点"
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
              <a-select
                style="width: 100%;"
                showSearch
                placeholder="请输入测点编号"
                :showArrow="false"
                v-decorator="[
                  'measurecode',
                  {
                    rules: [{
                      required: true, message: '请输入测点编号', whitespace:true
                    },{
                       pattern: /^\d{12}$/, message: '请输入12位数字'
                    }],
                  }
                ]"
                @search="inputMcode"
                @dropdownVisibleChange="initMcodeList"
              >
                <a-select-option v-for="item in mcodeList" :value="item" :key="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="仪器编号" v-bind="formItemLayout">
              <a-select
                @change="deviceCodeChange"
                placeholder="请选择仪器编号"
                v-decorator="[
                    'noisemeasureid',
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
            </a-form-item>

            <a-form-item label="仪器类型" v-bind="formItemLayout">
              <a-input v-model="deviceType" :disabled="true" />
            </a-form-item>

            <a-form-item label="测点名称" v-bind="formItemLayout">
              <a-input
                placeholder="请输入测点名称"
                v-decorator="[
                  'measurename',
                  {
                    rules: [{
                      required: true, message: '请输入测点名称' , whitespace:true
                    },{
                      max:32, message: '最多输入32个字符'
                    },{
                       pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: '只能输入中文，英文，数字'
                    }],
                  }
                ]"
              />
            </a-form-item>

            <a-form-item label="测点地址" v-bind="formItemLayout">
              <a-input
                placeholder="请输入测点地址"
                v-decorator="[
                  'measureaddress',
                  {
                    rules: [
                      {
                        required: false, message: '请输入测点地址' 
                      },
                      {
                        max:256, message: '最多输入256个字符'
                      }
                    ],
                    initialValue:''
                  }
                ]"
              />
            </a-form-item>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="经纬度" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input-number
                    style="width:100%"
                    placeholder="请输入经度"
                    v-decorator="[
                      'lng',
                      {
                        rules: [{
                          required: true, message: '请输入经度' 
                        }],
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item :wrapper-col="{ span: 24 }">
                  <a-input-number
                    style="width: 100%"
                    placeholder="请输入纬度"
                    v-decorator="[
                      'lat',
                      {
                        rules: [{
                          required: true, message: '请输入纬度'
                        }],
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

        <a-tab-pane tab="高级信息" key="2" :forceRender="true" v-if="deviceType.includes('6218J')">
          <a-form :form="form">
            <a-form-item label="功能区" v-bind="formItemLayout">
              <a-select style="width: 100%;" placeholder="请选择功能区" v-decorator="['funCode',{initialValue: 0}]">
                <a-select-option :value="0">0类</a-select-option>
                <a-select-option :value="1">1类</a-select-option>
                <a-select-option :value="2">2类</a-select-option>
                <a-select-option :value="3">3类</a-select-option>
                <a-select-option :value="4">4a类</a-select-option>
                <a-select-option :value="5">4b类</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="噪声类型" v-bind="formItemLayout">
              <a-select style="width: 100%;" placeholder="噪声类型" v-decorator="['mnoisetype',{initialValue: 0}]">
                <a-select-option :value="0">功能区噪声</a-select-option>
                <a-select-option :value="1">交通噪声</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="测点数据自动读取" key="3" :forceRender="true" v-if="deviceType.includes('6218')">
          <a-form :form="form">
            <a-form-item
              label="是否读取分钟统计"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readstai', {valuePropName: 'checked', initialValue: true }]" disabled></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取小时统计"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readstah', {valuePropName: 'checked', initialValue: true }]" disabled></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取天统计"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readstad', {valuePropName: 'checked', initialValue: true }]" disabled></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取OCT"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readoct', {valuePropName: 'checked', initialValue: false }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取1/3OCT"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readoct13', {valuePropName: 'checked', initialValue: false }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取Lp"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readlp', {valuePropName: 'checked', initialValue: false }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取leq1s"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readleq1s', {valuePropName: 'checked', initialValue: false }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取车流量数据"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readcar', {valuePropName: 'checked', initialValue: false }]"></a-checkbox>
            </a-form-item>

            <a-form-item
              label="是否读取气象数据"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 7 }"
              style="margin-bottom: 2px;"
              :colon="false"
            >
              <a-checkbox v-decorator="['readwea', {valuePropName: 'checked', initialValue: false }]"></a-checkbox>
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
import { mapGetters } from 'vuex'
import { addPoint, GetDeviceAndTypeByUserName } from '@/api/manage-set'
import debounce from 'lodash/debounce' // 防抖函数
import gcoord from 'gcoord'

export default {
  name: 'AddPointModal',

  props: {
    visible: {
      type: Boolean,
      default: false
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
      disabled: false,
      deviceType: '',
      showMap: false,
      position: {},
      center: '',
      tabsKey: '1',
      deviceList: [],
      mcodeList: []
    }
  },

  watch: {
    visible(val) {
      if (val === true) {
        this.GetDeviceAndTypeByUserName()
      }
    }
  },

  mounted() {
    this.inputMcode = debounce(this.inputMcode, 500)
  },

  methods: {
    ...mapGetters(['pointList', 'userInfo', 'currentPointList', 'role', 'socket']),

    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let obj = {}

          if (this.deviceType.includes('6218J')) {
            obj = {
              username: this.userInfo().UserName,
              noisemeasureid: values.noisemeasureid,
              measurename: values.measurename,
              measurecode: values.measurecode,
              measureaddress: values.measureaddress,
              gps: values.lng + ',' + values.lat,

              funCode: values.funCode,
              mnoisetype: values.mnoisetype,
              readstai: values.readstai ? 1 : 0,
              readstah: values.readstah ? 1 : 0,
              readstad: values.readstad ? 1 : 0,
              readoct: values.readoct ? 1 : 0,
              readoct13: values.readoct13 ? 1 : 0,
              readlp: values.readlp ? 1 : 0,
              readleq1s: values.readleq1s ? 1 : 0,
              readcar: values.readcar ? 1 : 0,
              readwea: values.readwea ? 1 : 0
            }
          } else {
            obj = {
              username: this.userInfo().UserName,
              noisemeasureid: values.noisemeasureid,
              measurename: values.measurename,
              measurecode: values.measurecode,
              measureaddress: values.measureaddress,
              gps: values.lng + ',' + values.lat,

              funCode: 0,
              mnoisetype: 0,
              readstai: 1,
              readstah: 1,
              readstad: 1,
              readoct: 1,
              readoct13: 1,
              readlp: 1,
              readleq1s: 1,
              readcar: 1,
              readwea: 1
            }
          }
          addPoint(obj).then(res => {
            let response = JSON.parse(res.d)
            if (response.Error) {
              // this.$message.error('系统错误')
              this.handleCancel()
            } else {
              this.$message.success('测点添加成功')
              this.$store.dispatch('GetUserInfo')
              this.socket().close()
              this.$store.dispatch('GetRealPointList')
              this.handleCancel()
            }
          })
        } else {
          this.tabsKey = '1'
        }
      })
    },

    handleCancel(e) {
      this.$emit('update:visible', false)
      this.confirmLoading = false
      this.form.resetFields()
      this.deviceType = ''
      this.position = {}
      this.tabsKey = '1'
    },

    deviceCodeChange(value) {
      this.deviceList.forEach(item => {
        if (item.NoiseMeasureID == value) {
          this.deviceType = item.MeasureType
        }
      })
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

    GetDeviceAndTypeByUserName() {
      GetDeviceAndTypeByUserName(this.userInfo().UserName).then(res => {
        let result = JSON.parse(res.d) // 接收数据
        this.deviceList = result
        console.log(this.deviceList)
      })
    },

    initMcodeList() {
      let arr = this.pointList().map(item => item.MeasureCode)
      this.mcodeList = Array.from(new Set(arr))
    },

    inputMcode(value) {
      if (value === '') {
        this.initMcodeList()
      } else {
        this.mcodeList.push(value)
        this.mcodeList = Array.from(new Set(this.mcodeList))
      }
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
  // height: 300px;
}
</style>


<style lang="less">
.notification-way .ant-modal {
  padding-bottom: 0px;
}
</style>
