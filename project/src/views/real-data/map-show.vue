<template>
  <div class="map-show">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>实时数据</a-breadcrumb-item>
        <a-breadcrumb-item>地图展示</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">地图展示</div>
    </div>
    <div class="page-common-content" v-if="realPointListNotNull">
      <div class="map-show-search-row">
        <span class="filter-row-item-label">测点名称：</span>
        <a-input
          class="search-row-input"
          v-model="pointName_filter"
          placeholder="搜索测点名称"
          allowClear
        ></a-input>

        <!-- <a-input
          class="search-row-input"
          v-model="measureCode_filter"
          placeholder="搜索仪器编号"
          allowClear
        ></a-input>-->
      </div>
      <div class="swiper">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide
            v-for="(point)  in displayList"
            :key="point.MeasureCode+'-'+point.MeasureId"
            @click.native="clickSwiperItem({lng:point.LONG,lat:point.Latitude}, point.MeasureCode+'-'+point.MeasureId)"
            :class="{active :(point.MeasureCode+'-'+point.MeasureId ===currentPointCodeMeasureCode())}"
          >
            <div class="swiper-slide-item">
              <div class="swiper-slide-item-top">
                <div class="swiper-slide-item-top-left">
                  <span
                    class="dot"
                    :class="{'success-dot':point.linkState === '2', 'warning-dot':point.linkState === '1', 'disabled-dot':point.linkState === '0'}"
                  ></span>
                  <span class="place">{{point.MeasureName}}</span>
                </div>
                <div class="swiper-slide-item-top-right">瞬时值：{{point.Lp}}</div>
              </div>
              <div class="bottom">
                <span>经纬度：{{point.LONG}}，{{point.Latitude}}</span>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev" slot="button-prev" style="border:0"></div>
        <div
          class="swiper-button-next"
          slot="button-next"
          style="user-select: none;"
        ></div>
      </div>

      <div class="map-and-real-content">
        <baidu-map
          class="map"
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          @dragend="dragend"
          @zoomend="zoomend"
        >
          <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          <!-- <bm-marker
            v-for="(point, index) in realPointList()"
            :key="index"
            :position="{lng: point.LONG, lat: point.Latitude}"
            :title="point.MeasureName"
            @click="clickMarker(index)"
            :icon="{url: point.linkState === '2' ? `/marker-success.png`:`/marker-warning.png`, size: {width: 24, height: 24}}"
            :animation="(index === currentPointIndex()) ?'BMAP_ANIMATION_BOUNCE':''"
          >-->
          <bm-marker
            v-for="(point, index) in displayList"
            :key="index"
            :position="{lng: point.lngBD, lat: point.latBD}"
            :title="point.MeasureName"
            @click="clickMarker(point.MeasureCode+'-'+point.MeasureId)"
            :animation="(point.MeasureCode+'-'+point.MeasureId === currentPointCodeMeasureCode()) ?'BMAP_ANIMATION_BOUNCE':''"
            :icon="{url: point.linkState === '2' ? `/marker-success.png`:`/marker-warning.png`, size: {width: 24, height: 24}}"
            :zIndex="(point.MeasureCode+'-'+point.MeasureId === currentPointCodeMeasureCode()) ? 1000 : 0"
          >
            <bm-label
              :content="`${point.Lp}dB(A)`"
              :labelStyle="point.linkState === '2' ? mapLabelSuccessStyle : mapLabelWarngingStyle"
              :offset="{width: -19, height: 28}"
            />
          </bm-marker>
        </baidu-map>

        <div class="real-data">
          <div class="real-data-header">实时数据</div>
          <div class="real-data-content">
            <div
              class="title"
              style="margin-bottom: 0px;"
            >{{ haveWeatherModule ? '气象数据' : '气象数据（无气象模块）'}}</div>
            <span
              class="weather-number"
              v-if="haveWeatherModule"
            >{{currentPoint['A-Temp']}}</span>
            <span class="weather-text" v-if="haveWeatherModule">℃</span>
            <div class="row" v-if="haveWeatherModule">
              <div class="row-item">
                <div class="row-item-header">湿度(%)</div>
                <div class="row-item-content">
                  <img
                    src="../../assets/temperature.png"
                    style="margin-right:8px"
                  />
                  <span>{{currentPoint['Humi-R']}}</span>
                </div>
              </div>
              <div class="row-item">
                <div class="row-item-header">风向(度)</div>
                <div class="row-item-content">
                  <img src="../../assets/wind-direction.png" />
                  <span>{{currentPoint['Humi-R']}}</span>
                </div>
              </div>
            </div>
            <div class="row" v-if="haveWeatherModule">
              <div class="row-item">
                <div class="row-item-header">雨量(mm)</div>
                <div class="row-item-content">
                  <img src="../../assets/rainfall.png" />
                  <span>{{currentPoint['PRF']}}</span>
                </div>
              </div>
              <div class="row-item">
                <div class="row-item-header">气压(hPa)</div>
                <div class="row-item-content">
                  <img src="../../assets/air-pressure.png" />
                  <span>{{currentPoint['Ari-P']}}</span>
                </div>
              </div>
            </div>
            <div class="row" v-if="haveWeatherModule">
              <div class="row-item">
                <div class="row-item-header">风速(m/s)</div>
                <div class="row-item-content">
                  <img src="../../assets/wind-speed.png" />
                  <span>{{currentPoint['W-Speed']}}</span>
                </div>
              </div>
            </div>
            <div class="title">仪器状态</div>
            <div class="row">
              <div class="row-item">
                <div class="row-item-header">工作电压(v)</div>
                <div class="row-item-content">{{currentPoint['W-Vol']}}</div>
              </div>
              <div class="row-item">
                <div class="row-item-header">电池电压(v)</div>
                <div class="row-item-content">{{currentPoint['S-Vol']}}</div>
              </div>
            </div>
            <div class="row">
              <div class="row-item">
                <div class="row-item-header">剩余容量</div>
                <div class="row-item-content">{{currentPoint['Free-M']}}</div>
              </div>
            </div>
            <div class="row">
              <mini-progress
                v-if="currentPoint['Free-M']==0&&currentPoint['Used-M']==0"
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="0"
                height="8px"
              />
              <mini-progress
                v-else
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="freeKBpercent"
                height="8px"
              />
            </div>
            <!-- <div class="title">数据甘特图</div>
            <div id="gantt" :style="{width: '100%', height: '339px',overflow:'hidden'}"></div>-->
            <div class="title">设备采集率</div>
            <div class="rate-row">
              <div class="rate-row-text">设备运转率(上月)</div>
              <div class="rate-row-number">{{currentPoint.HardRate+'%'}}</div>
              <mini-progress
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="currentPoint.HardRate"
                height="8px"
              />
            </div>
            <div class="rate-row">
              <div class="rate-row-text">数据传输率(上月)</div>
              <div class="rate-row-number">{{currentPoint.UpRate+'%'}}</div>
              <mini-progress
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="currentPoint.UpRate"
                height="8px"
              />
            </div>
            <div class="rate-row">
              <div class="rate-row-text">月采集率</div>
              <div class="rate-row-number">{{currentPoint.DevCapRate+'%'}}</div>
              <mini-progress
                color="rgb(19, 194, 194)"
                :target="100"
                :percentage="currentPoint.DevCapRate"
                height="8px"
              />
            </div>
            <div
              class="title"
              style="margin-bottom:-4px;"
            >{{haveCarModule ? '车流数据' : '车流数据（无交通模块）'}}</div>
            <div v-show="haveCarModule" class="traffic-content">
              <div id="pie" style="height: 240px;width:284px;padding-top:10px;"></div>
              <div
                class="average-speed"
              >平均车速：{{currentPoint.AvgCarSpeed?currentPoint.AvgCarSpeed:0+'km/h'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-empty v-else style="margin-top:30vh">
      <span slot="description">暂无实时数据</span>
    </a-empty>
  </div>
</template>


<script>
import { MiniProgress } from '@/components'
import { mapActions, mapGetters } from 'vuex'
import gcoord from 'gcoord'

//swiper配置
const swiperOption = {
  slidesPerView: 4,
  spaceBetween: 0,
  slidesPerGroup: 4,
  loop: false,
  loopFillGroupWithBlank: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
}

export default {
  name: 'map-show',

  components: {
    MiniProgress
  },

  data() {
    return {
      swiperOption,
      center: '浙江',
      zoom: 12,
      mapLabelWarngingStyle: {
        color: '#fa8c16',
        fontSize: '12px',
        padding: '1px',
        width: '62px',
        textAlign: 'center',
        border: '1px solid #fa8c16'
      },
      mapLabelSuccessStyle: {
        color: '#52c41a',
        fontSize: '12px',
        padding: '1px',
        width: '62px',
        textAlign: 'center',
        border: '1px solid #52c41a'
      },
      interval: null,

      pointName_filter: undefined,
      measureCode_filter: undefined,

      chart: null
    }
  },

  computed: {
    displayList() {
      let arr = []
      if (this.pointName_filter !== undefined && this.measureCode_filter === undefined) {
        arr = this.realPointList().filter(item => {
          return item.MeasureName.includes(this.pointName_filter)
        })
      }
      if (this.pointName_filter === undefined && this.measureCode_filter !== undefined) {
        arr = this.realPointList().filter(item => {
          return item.MeasureId.includes(this.measureCode_filter)
        })
      }

      if (this.pointName_filter !== undefined && this.measureCode_filter !== undefined) {
        arr = this.realPointList().filter(item => {
          return item.MeasureId.includes(this.measureCode_filter) && item.MeasureName.includes(this.pointName_filter)
        })
      }

      if (this.pointName_filter === undefined && this.measureCode_filter === undefined) {
        arr = this.realPointList()
      }

      arr.forEach(item => {
        let result = gcoord.transform(
          [item.LONG, item.Latitude], // 经纬度坐标
          gcoord.WGS84, // 当前坐标系
          gcoord.BD09 // 目标坐标系
        )
        item.lngBD = result[0]
        item.latBD = result[1]
      })

      return arr
    },

    currentPoint() {
      if (this.realPointListNotNull) {
        if (this.currentPointCodeMeasureCode() === '') {
          this.$store.commit(
            'SET_CURRENTPOINTCODEMEASURECODE',
            this.realPointList()[0].MeasureCode + '-' + this.realPointList()[0].MeasureId
          )
          return this.realPointList()[0]
        } else {
          let point = this.realPointList().find(
            item => item.MeasureCode + '-' + item.MeasureId === this.currentPointCodeMeasureCode()
          )

          if (point) {
            return point
          } else {
            this.$store.commit(
              'SET_CURRENTPOINTCODEMEASURECODE',
              this.realPointList()[0].MeasureCode + '-' + this.realPointList()[0].MeasureId
            )
            return this.realPointList()[0]
          }
        }
      } else {
        return {}
      }
    },

    realPointListNotNull() {
      return this.realPointList().length > 0 ? true : false
    },

    freeKBpercent() {
      return (
        (parseInt(this.currentPoint['Free-M']) /
          (parseInt(this.currentPoint['Free-M']) + parseInt(this.currentPoint['Used-M']))) *
        100
      )
    },

    haveWeatherModule() {
      return this.currentPoint.isReadWeather
    },

    haveCarModule() {
      return this.currentPoint.isReadCarflow
    }
  },

  watch: {
    realPointListNotNull(curVal) {
      if (curVal === true) {
        this.chart = this.$echarts.init(document.getElementById('pie'))
        let i = this.currentPointCodeMeasureCode()
        let swiperItemIndex = this.realPointList().findIndex(item => {
          return item.MeasureCode + '-' + item.MeasureId === i
        })
        this.$refs.mySwiper.swiper.slideTo(swiperItemIndex, 500, false)
        this.clickSwiperItem(
          { lng: this.currentPoint.LONG, lat: this.currentPoint.Latitude },
          this.currentPointCodeMeasureCode()
        )
      }
    },

    pointName_filter(value) {
      if (value === '') {
        let i = this.currentPointCodeMeasureCode()
        let swiperItemIndex = this.realPointList().findIndex(item => {
          return item.MeasureCode + '-' + item.MeasureId === i
        })
        setTimeout(() => {
          this.$refs.mySwiper.swiper.slideTo(swiperItemIndex, 500, false)
        }, 300)
      }
    }
  },

  created() {
    this.$store.getters.socket.close()
    this.$store.dispatch('GetRealPointList')
  },

  mounted() {
    this.chart = this.$echarts.init(document.getElementById('pie'))
    let i = this.currentPointCodeMeasureCode()
    let swiperItemIndex = this.realPointList().findIndex(item => {
      return item.MeasureCode + '-' + item.MeasureId === i
    })
    this.$refs.mySwiper.swiper.slideTo(swiperItemIndex, 500, false)
    this.clickSwiperItem(
      { lng: this.currentPoint.LONG, lat: this.currentPoint.Latitude },
      this.currentPointCodeMeasureCode()
    )
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  methods: {
    ...mapGetters(['realPointList', 'currentPointCodeMeasureCode', 'currentPointList']),
    ...mapActions(['SetSocketMessage', 'SetRealPointList']),

    dragend({ type, target }) {
      this.center = target.getCenter()
    },

    zoomend({ type, target }) {
      this.zoom = target.getZoom()
    },

    clickSwiperItem(center, MeasureCodeMeasureId) {
      this.center = center
      this.$store.commit('SET_CURRENTPOINTCODEMEASURECODE', MeasureCodeMeasureId)
      // if (this.haveCarModule) {
      this.drawPie()
      // }
    },

    clickMarker(MeasureCodeMeasureId) {
      this.$store.commit('SET_CURRENTPOINTCODEMEASURECODE', MeasureCodeMeasureId)
      this.$router.push({ name: 'point-data' })
    },

    drawPie() {
      // var myChart = this.$echarts.init(document.getElementById('pie'))
      var colorList = ['#0a4291', '#0a57b6', '#1373db', '#2295ff', '#48adff']

      var total = {
        value: this.currentPoint.TotalCarFlux ? this.currentPoint.TotalCarFlux : 0,
        name: '总车流量'
      }

      var originalData = [
        {
          value: this.currentPoint.BigCarNums ? this.currentPoint.BigCarNums : 0,
          name: '大车流量'
        },
        {
          value: this.currentPoint.MidCarNums ? this.currentPoint.MidCarNums : 0,
          name: '中车流量'
        },
        {
          value: this.currentPoint.ShortCarNums ? this.currentPoint.ShortCarNums : 0,
          name: '小车流量'
        }
      ]

      this.$echarts.util.each(originalData, function(item, index) {
        item.itemStyle = {
          normal: {
            color: colorList[index]
          }
        }
      })

      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 12
          }
        },

        backgroundColor: '#ffffff',

        title: [
          {
            text: total.name,
            left: '49%',
            top: '43%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
              color: '#999',
              fontWeight: 'normal',
              fontSize: 14
            }
          },
          {
            text: total.value,
            left: '49%',
            top: '54%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
              color: '#666',
              fontWeight: 'normal',
              fontSize: 20
            }
          }
        ],

        series: [
          {
            hoverAnimation: false, //设置饼图默认的展开样式
            radius: [60, 100],
            name: 'pie',
            type: 'pie',
            selectedMode: 'single',
            selectedOffset: 16, //选中是扇区偏移量
            clockwise: true,
            startAngle: 90,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 3,
                borderColor: '#ffffff'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
              }
            },
            data: originalData
          }
        ]
      }
      this.chart.clear()
      this.chart.setOption(option, true)
    }
  }
}
</script>


<style lang="less">
.map-show {
  position: relative;
  height: calc(100vh - 64px);
  overflow: auto;
  .active {
    background: rgba(24, 144, 255, 0.1);
  }
  .page-common-content {
    .map-show-search-row {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      .search-row-label {
        margin-right: 8px;
      }
      .search-row-input {
        width: 240px;
        margin-right: 16px;
      }
    }
    .swiper {
      position: relative;
      padding: 0px 40px;
      .left {
        font-size: 30px;
        position: absolute;
        left: 10px;
        top: 18px;
      }
      .swiper-button-prev {
        left: 0px;
        outline: none;
      }
      .swiper-button-next {
        right: 0px;
        outline: none;
      }
      .swiper-container {
        width: 100%;
        height: 62px;
        margin-bottom: 24px;
        .swiper-slide {
          cursor: pointer;
          border-radius: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0px 10px;
          .swiper-slide-item {
            user-select: none;
            width: 100%;
            .swiper-slide-item-top {
              margin-bottom: 3px;
              display: flex;
              justify-content: flex-start;
              .swiper-slide-item-top-left {
                margin-right: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .place {
                  font-family: PingFangSC-Medium;
                  font-size: 14px;
                  color: rgba(0, 0, 0, 0.85);
                  line-height: 22px;
                  font-weight: bold;
                }
              }
              .swiper-slide-item-top-right {
                min-width: 100px;
              }
            }
            .bottom {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding-left: 16px;
            }
          }

          // &:hover {
          //   background: rgba(24, 144, 255, 0.1);
          // }
        }
      }
    }
  }

  .map-and-real-content {
    display: flex;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .map {
      width: 100%;
      height: 690px;
      flex: 1;
    }
    .real-data {
      width: 300px;
      .real-data-header {
        display: flex;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #e9e9e9;
        padding: 0px 24px;
        height: 56px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
      }
      .real-data-content {
        background: #fff;
        height: 634px;
        overflow: auto;
        padding: 24px 0px;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 22px;
          margin: 16px 0px;
          margin-top: 48px;
          padding: 0px 24px;
          &:first-child {
            margin-top: 0px;
          }
        }
        .weather-number {
          font-family: PingFangSC-Regular;
          font-size: 46px;
          color: rgba(0, 0, 0, 0.85);
          margin-left: 24px;
          margin-right: 5px;
        }
        .weather-text {
          font-family: PingFangSC-Regular;
          font-size: 20px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 38px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 0px 24px;
          .row-item {
            width: 50%;
            .row-item-header {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.45);
            }
            .row-item-content {
              font-family: PingFangSC-Regular;
              font-size: 24px;
              color: rgba(0, 0, 0, 0.85);
              img {
                transform: translateY(-3px);
                margin-right: 5px;
              }
            }
          }
        }
        .rate-row {
          padding: 0 24px;
          margin-bottom: 10px;
          .rate-row-text {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
          }
          .rate-row-number {
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: rgba(0, 0, 0, 0.85);
          }
        }
        .traffic-content {
          background: #fff;
          height: 289px;
          position: relative;
          overflow: hidden;
          .g2-guide-html {
            width: 100px;
            height: 80px;
            vertical-align: middle;
            text-align: center;
            line-height: 0.4;
          }

          .g2-guide-html .title {
            font-size: 12px;
            color: #8c8c8c;
            font-weight: 300;
          }

          .g2-guide-html .value {
            font-size: 30px;
            color: #000;
            font-weight: bold;
          }
          .average-speed {
            position: absolute;
            bottom: 24px;
            width: 100%;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
  }
}
</style>
