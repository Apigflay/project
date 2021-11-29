<template>
  <div class="add-point">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>手工导入</a-breadcrumb-item>
        <a-breadcrumb-item>添加测点</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">添加测点</div>
    </div>

    <div class="page-common-content">
      <a-form-model ref="form" :model="form" :rules="rules">
        <a-form-model-item label="测点编号" prop="MeasureCode">
          <a-input v-model="form.MeasureCode" placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="测点名称" prop="MeasureName">
          <a-input v-model="form.MeasureName" placeholder="请输入" />
        </a-form-model-item>

        <a-divider dashed></a-divider>

        <a-form-model-item>
          <a-button style="margin-left:100px" @click="clickMapSelectPoint">地图选点</a-button>
        </a-form-model-item>

        <a-form-model-item label="测点地址" prop="MeasureAddress">
          <a-input v-model="form.MeasureAddress" placeholder="请输入" />
        </a-form-model-item>

        <!-- <a-form-model-item label="省" prop="Province">
          <a-input v-model="form.Province" disabled />
        </a-form-model-item>

        <a-form-model-item label="市" prop="City">
          <a-input v-model="form.City" disabled />
        </a-form-model-item>

        <a-form-model-item label="区" prop="District">
          <a-input v-model="form.District" disabled />
        </a-form-model-item>-->

        <a-form-model-item label="省市区" prop="ssq">
          <AreaSelect v-model="form.ssq" placeholder="请选择"></AreaSelect>
        </a-form-model-item>

        <a-form-model-item label="纬度" prop="Lat">
          <a-input v-model="form.Lat" disabled />
        </a-form-model-item>

        <a-form-model-item label="经度" prop="Lon">
          <a-input v-model="form.Lon" disabled />
        </a-form-model-item>

        <a-divider dashed></a-divider>

        <a-form-model-item label="功能区编号" prop="FunCode">
          <a-select v-model="form.FunCode" placeholder="请选择">
            <a-select-option value="0">0类</a-select-option>
            <a-select-option value="1">1类</a-select-option>
            <a-select-option value="2">2类</a-select-option>
            <a-select-option value="3">3类</a-select-option>
            <a-select-option value="4a">4a类</a-select-option>
            <a-select-option value="4b">4b类</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="道路长度" prop="L">
          <a-input-number v-model="form.L" :min="0" :max="9999" />
          <span style="margin-left:8px;">m</span>
        </a-form-model-item>

        <a-button type="primary" style="margin-left:100px" @click="submitForm">添加测点</a-button>
      </a-form-model>
    </div>

    <a-modal
      title="地图选点"
      :visible="showMap"
      @cancel="showMap=false;keyword=undefined"
      width="100%"
      :bodyStyle="{padding: 0}"
      :maskClosable="true"
      :wrapClassName="'notification-way'"
      :destroyOnClose="true"
      :footer="null"
    >
      <div class="search-container">
        <a-input v-model="keyword" allowClear placeholder="搜地点，搜位置" />
      </div>

      <baidu-map class="map" :center="center" :zoom="12" :scroll-wheel-zoom="true" @click="clickMap">
        <bm-marker :position="position" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <bm-local-search class="map-dropdown" :keyword="keyword" :auto-viewport="true"></bm-local-search>
      </baidu-map>
    </a-modal>
  </div>
</template>

<script>
import { AddMeasureByHand } from '@/api/manual-import'
import AreaSelect from './AreaSelect'
const rules = {
  MeasureCode: [
    {
      required: true,
      message: '请输入',
      whitespace: true
    },
    {
      pattern: /^\d{12}$/,
      message: '请输入12位数字'
    }
  ],

  MeasureName: [
    {
      required: true,
      message: '请输入',
      whitespace: true
    },
    {
      max: 64,
      message: '最大64个字符'
    }
  ],

  MeasureAddress: [
    {
      required: false,
      message: '请输入',
      whitespace: true
    }
  ],

  MeasureAddress: [
    {
      required: false,
      message: '请输入',
      whitespace: true
    },
    {
      max: 64,
      message: '最大128个字符'
    }
  ],

  Province: [
    {
      required: true,
      message: '请地图选点'
    }
  ],
  City: [
    {
      required: true,
      message: '请地图选点'
    }
  ],
  District: [
    {
      required: true,
      message: '请地图选点'
    }
  ],
  Lat: [
    {
      required: true,
      message: '请地图选点'
    }
  ],
  Lon: [
    {
      required: true,
      message: '请地图选点'
    }
  ],
  ssq: [
    {
      required: true,
      message: '请选择'
    }
  ],
  FunCode: [
    {
      required: true,
      message: '请选择'
    }
  ]
}
export default {
  name: 'add-point',

  components: {
    AreaSelect
  },

  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      rules,
      form: {
        MeasureCode: undefined,
        MeasureName: undefined,
        MeasureAddress: undefined,
        Province: undefined,
        City: undefined,
        District: undefined,
        Lat: undefined,
        Lon: undefined,
        FunCode: undefined,
        L: undefined,
        ssq: []
      },

      showMap: false,
      center: '',
      position: {},
      keyword: undefined
    }
  },

  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.Province = this.form.ssq[0] ? this.form.ssq[0] : undefined
          this.form.City = this.form.ssq[1] ? this.form.ssq[1] : undefined
          this.form.District = this.form.ssq[2] ? this.form.ssq[2] : undefined
          AddMeasureByHand(this.form).then(res => {
            let { Error, Msg } = JSON.parse(res.d)
            if (Error === 0) {
              this.$message.success(Msg)
            } else {
              this.$message.error(Msg)
            }
          })
        }
      })
    },

    clickMap({ type, target, point, pixel, overlay }) {
      this.position = point
      this.form.Lon = point.lng
      this.form.Lat = point.lat
      this.$message.success('选点成功！可点击右上角关闭')

      // fetch(
      //   `/baidu/geocoder?location=${point.lat},${point.lng}&output=json&key=4CynGL2PGF0rylfAHeEbaxfCPcetSdHw`
      // )
      //   .then(res => {
      //     return res.json()
      //   })
      //   .then(data => {
      //     const { province, city, district } = { ...data.result.addressComponent }
      //     this.form.Province = province
      //     this.form.City = city
      //     this.form.District = district
      //     this.form.MeasureAddress = data.result.formatted_address
      //   })
    },

    clickMapSelectPoint() {
      this.position = {
        lat: this.form.Lat,
        lng: this.form.Lon
      }
      if (!this.position.lat || !this.position.lng) {
        this.center = '甘肃'
      } else {
        this.center = this.position
      }
      this.showMap = true
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-form {
  width: 500px;
  .ant-form-item {
    display: flex;
    .ant-form-item-label {
      width: 100px;
    }
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
.map {
  width: 100%;
  height: calc(100vh - 55px);
}

.search-container {
  position: absolute;
  top: 65px;
  left: 16px;
  z-index: 1111;
  width: 320px;
}

/deep/ .ant-modal {
  top: 0px;
  padding: 0;
}

.map-dropdown {
  position: absolute;
  top: 100px;
  left: 16px;
  min-width: 320px;
  max-width: 320px;
  max-height: 80vh;
  overflow: auto;
}
</style>
