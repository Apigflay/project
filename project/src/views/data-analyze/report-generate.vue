<template>
  <div class="report-generate">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>数据分析</a-breadcrumb-item>
        <a-breadcrumb-item>报表生成</a-breadcrumb-item>
      </a-breadcrumb>

      <div class="title">报表生成</div>
    </div>

    <div class="input-btn-wrapper">
      <a-select
        v-model="pointCode"
        style="width: 300px;margin-right: 16px;margin-bottom:16px;"
        placeholder="请选择"
        @change="pointCodeChange"
      >
        <a-select-option
          v-for="point in pointList()"
          :value="point.measureCode + '-' + point.noiseMeasureID"
          :key="point.measureCode + '-' + point.noiseMeasureID"
        >{{`${point.measureName}(${point.noiseMeasureID})`}}</a-select-option>
      </a-select>

      <a-range-picker
        v-model="dateRange"
        style="margin-right: 16px;margin-bottom:16px;"
        :ranges="{
            '今天': [moment().startOf('day'), moment().endOf('day')], 
            '本周': [moment().startOf('week'), moment().endOf('week')], 
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '本年': [moment().startOf('year'), moment().endOf('year')],
          }"
        :allowClear="false"
        format="YYYY-MM-DD HH:mm:ss"
        :showTime="{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
          }"
      />

      <a-select
        v-model="pdfSrc"
        style="width: 270px;margin-right: 16px;margin-bottom:16px;"
      >
        <a-select-option
          v-for="item in pdfSrcArr"
          :value="item.name"
          :key="item.name"
        >{{item.name.split('.')[0].substring(1)}}</a-select-option>
      </a-select>

      <a-button
        type="primary"
        style="margin-right: 16px;margin-bottom:16px;"
        @click="clickGenerate"
        :loading="loading"
      >生成报表</a-button>
      <a-button icon="download" @click="clickExport">导出word</a-button>
    </div>

    <div class="pdf-wrapper">
      <iframe v-show="show" :src="pdfSrc" width="100%" height="100%"></iframe>
      <iframe
        v-show="showCreated"
        :src="createdPdfSrc"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  </div>
</template>


<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

const pdfSrcArr = [
  {
    name: '/功能区环境噪声成果(小时).pdf'
  },
  {
    name: '/功能区环境噪声成果(分钟).pdf'
  },
  {
    name: '/功能区环境噪声成果(天).pdf'
  },

  {
    name: '/功能区环境噪声成果_季表.pdf'
  },
  {
    name: '/功能区环境噪声成果_季表2.pdf'
  },
  {
    name: '/功能区环境噪声成果_年表.pdf'
  },
  {
    name: '/功能区环境噪声成果_日表.pdf'
  },
  {
    name: '/功能区环境噪声成果_月表.pdf'
  },
  {
    name: '/功能区环境噪声成果_月表2.pdf'
  },
  {
    name: '/功能区环境噪声成果_周表.pdf'
  },
  {
    name: '/功能区环境噪声汇总.pdf'
  },
  {
    name: '/功能区环境噪声汇总_年表.pdf'
  },
  {
    name: '/功能区环境噪声汇总_周表.pdf'
  }
]
export default {
  data() {
    return {
      pdfSrcArr,
      pdfSrc: '/功能区环境噪声成果(小时).pdf',
      createdPdfSrc: '',
      show: true,
      showCreated: false,

      pointCode: undefined,
      dateRange: [moment().startOf('day'), moment().endOf('day')],

      websocket: null,
      loading: false,
      message: null,

      reportname: undefined
    }
  },

  computed: {
    currPoint() {
      return this.pointList().find(item => item.measureCode + '-' + item.noiseMeasureID === this.pointCode)
    },
    mname() {
      return this.currPoint.measureName
    },

    maddress() {
      return this.currPoint.measureAddress
    },

    mfun() {
      return this.currPoint.funCode
    },

    devicetype() {
      return this.currPoint.deviceType
    }
  },

  watch: {
    pdfSrc() {
      this.show = false
      this.showCreated = false
      setTimeout(() => {
        this.show = true
      }, 100)
    }
  },

  created() {
    this.$store.dispatch('GetUserinfo')
  },

  beforeDestroy() {
    this.websocket && this.websocket.close()
    setTimeout(this.message, 0) //关闭$message提醒
  },

  methods: {
    moment,

    ...mapGetters(['pointList', 'userInfo']),
    ...mapActions([]),

    clickGenerate() {
      if (!this.pointCode) {
        this.$message.warning('请选择测点')
        return
      }
      this.loading = true
      this.message = this.$message.loading('报表生成中，请耐心等待', 0)
      this.initWebSocket()
    },

    initWebSocket() {
      const wsurl = `${this.$websocket_url}/WebSocketSvr`
      this.websocket = new WebSocket(wsurl)
      this.websocket.onopen = this.websocketonopen
      this.websocket.onerror = this.websocketonerror
      this.websocket.onmessage = this.websocketonmessage
      this.websocket.onclose = this.websocketclose
    },
    websocketonopen() {
      console.log('生成报表websocket连接成功')
      this.reportname = this.pdfSrc.replace('.pdf', '') + this.getCurrentDate()
      this.websocket.send(
        JSON.stringify({
          multi: {
            midnum: 0, //固定
            time: '2019-01-24' //固定
          },
          stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
          etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
          mid: this.pointCode.split('-')[1],
          mcode: this.pointCode.split('-')[0],
          class: '111', //固定
          state: 'no', //固定
          filename: this.pdfSrc.replace('.pdf', ''),
          table: 'StaData', //固定
          reportname: this.reportname,
          // username: this.userInfo().UserName,
          username: 'admin',
          mname: this.mname,
          maddress: this.maddress,
          mfun: this.mfun,
          mtype_id: this.devicetype + '-' + this.pointCode.split('-')[1],
          expand: '.doc', //固定
          ischeck: false, //固定
          citycode: '',
          sitename: '',
          fuzheren: '',
          shenheren: '',
          ceshiren: ''
        })
      )
    },
    websocketonerror(e) {
      console.log('生成报表websocket连接发生错误')
    },
    websocketonmessage(e) {
      let result = JSON.parse(e.data) // 接收数据
      this.loading = false
      setTimeout(this.message, 0) //关闭$message提醒
      if (result.ErrorCode === '1') {
        this.show = false
        this.showCreated = true
        this.createdPdfSrc = `/static-file/docs/res/${this.reportname}.pdf`
        this.$message.success('报表生成成功')
      } else {
        this.$message.error('生成报表出现错误')
      }
    },
    websocketclose(e) {
      console.log('生成报表websocket关闭了')
    },

    clickExport() {
      if (this.show) {
        window.open(this.pdfSrc.replace('.pdf', '') + '.doc', '_self')
      }

      if (this.showCreated) {
        window.open(`/static-file/docs/res/${this.reportname}.doc`, '_self')
      }
    },

    getCurrentDate() {
      var now = new Date()
      var year = now.getFullYear() //得到年份
      var month = now.getMonth() //得到月份
      var date = now.getDate() //得到日期
      var day = now.getDay() //得到周几
      var hour = now.getHours() //得到小时
      var minu = now.getMinutes() //得到分钟
      var sec = now.getSeconds() //得到秒
      month = month + 1
      if (month < 10) month = '0' + month
      if (date < 10) date = '0' + date
      if (hour < 10) hour = '0' + hour
      if (minu < 10) minu = '0' + minu
      if (sec < 10) sec = '0' + sec
      var time = ''
      time = '' + year + month + date + hour + minu + sec
      return time
    },

    pointCodeChange(value) {
      this.show = false
      this.showCreated = false
      setTimeout(() => {
        this.show = true
      }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
embed {
  transform: translateY(-50px) !important;
}
.report-generate {
  height: calc(100vh - 64px);
  overflow: auto;
  .input-btn-wrapper {
    background: #fff;
    margin: 24px;
    padding: 24px;
    padding-bottom: 8px;
  }

  .pdf-wrapper {
    margin: 24px;
    height: 1200px;
  }
}
</style>