<template>
  <div class="AMapDisplay">
    <a-form-model :model="formArea" ref="refForm">
      <a-row v-if="type === '区域'" :gutter="24">
        <a-col :span="4">
          <a-form-model-item label="年份">
            <YearSelect v-model="formArea.year" @change="fetchData" />
          </a-form-model-item>
        </a-col>

        <a-col :span="4">
          <a-form-model-item label="时间段">
            <DayNigntSelect v-model="formArea.type" @change="fetchData" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row v-if="type === '交通'" :gutter="24">
        <a-col :span="4">
          <a-form-model-item label="年份">
            <YearSelect v-model="formTraffic.year" @change="fetchData" />
          </a-form-model-item>
        </a-col>

        <a-col :span="4">
          <a-form-model-item label="时间段">
            <DayNigntSelect v-model="formTraffic.type" @change="fetchData" />
          </a-form-model-item>
        </a-col>

        <a-col :span="4">
          <a-form-model-item label="道路类型">
            <a-select v-model="formTraffic.roadType" @change="fetchData">
              <a-select-option :value="1">城市快速路</a-select-option>
              <a-select-option :value="2">城市主干路</a-select-option>
              <a-select-option :value="3">城市次干路</a-select-option>
              <a-select-option :value="4">含轨道交通走廊的道路</a-select-option>
              <a-select-option :value="5">穿过城市的高速公路</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <div v-show="data.length>0" id="map-container"></div>
    <a-empty v-show="data.length===0" style="margin:100px 0px">
      <span slot="description">暂无数据</span>
    </a-empty>
  </div>
</template>

<script>
import { transform, WGS84, GCJ02 } from 'gcoord'
import { areaAnalyseMap, trafficAnalyseMap } from '@/api/api'
import DayNigntSelect from './DayNigntSelect'
import YearSelect from './YearSelect'
export default {
  name: 'AMapDisplay',

  props: ['type'],

  components: {
    DayNigntSelect,
    YearSelect
  },

  data() {
    return {
      map: undefined,

      roadElement: {},
      textElement: {},

      data: [],
      formArea: {
        year: new Date().getFullYear(),
        type: 1
      },

      formTraffic: {
        year: new Date().getFullYear(),
        type: 1,
        roadType: 1
      }
    }
  },

  mounted() {
    this.map = new AMap.Map('map-container', {
      zoom: 11
    })

    AMapUI.loadUI(['control/BasicControl'], BasicControl => {
      //图层切换控件
      this.map.addControl(
        new BasicControl.LayerSwitcher({
          position: 'rt'
        })
      )
    })

    AMap.plugin(
      [
        'AMap.Scale',
        'AMap.MapType',
        'AMap.PlaceSearch',
        'AMap.Autocomplete',
        'AMap.Geocoder',
        'AMap.DistrictLayer',
        'AMap.DistrictSearch'
      ],
      () => {
        this.map.addControl(new AMap.Scale())

        this.fetchData()
      }
    )
  },

  methods: {
    fetchData() {
      this.map.clearMap()
      if (this.type === '区域')
        areaAnalyseMap(this.formArea).then(({ error, response }) => {
          if (error.code === 0) {
            this.data = response.dataList

            // this.data = [
            //   {
            //     year: 2020,
            //     site: '340203',
            //     siteName: '弋江区',
            //     data: 100,
            //     rate: null,
            //     level: '一级',
            //     evaluation: '好'
            //   },
            //   {
            //     year: 2020,
            //     site: '340207',
            //     siteName: '鸠江区',
            //     data: 20,
            //     rate: null,
            //     level: '一级',
            //     evaluation: '好'
            //   }
            // ]
            this.renderArea(this.data)
          }
        })

      if (this.type === '交通')
        trafficAnalyseMap(this.formTraffic).then(({ error, response }) => {
          if (error.code === 0) {
            this.data = response.dataList

            // this.data = [
            //   {
            //     year: 2020,
            //     site:
            //       '[{"latitude": 30.273923,"longitude": 119.985586,"orderNum": 0},{"latitude": 30.275832,"longitude": 120.003739,"orderNum": 1}]',
            //     siteName: '文一西路',
            //     data: 111,
            //     rate: null,
            //     level: '一级',
            //     evaluation: '好'
            //   },
            //   {
            //     year: 2020,
            //     site:
            //       '[{"latitude": 30.278852,"longitude": 119.994448,"orderNum": 0},{"latitude": 30.275832,"longitude": 120.003739,"orderNum": 1}]',
            //     siteName: '文二西路',
            //     data: 11,
            //     rate: null,
            //     level: '一级',
            //     evaluation: '好'
            //   }
            // ]

            this.data.forEach(item => {
              let roadPosition = JSON.parse(item.site)
              if (roadPosition.length > 0) {
                let path = roadPosition
                  .sort((a, b) => a.orderNum - b.orderNum)
                  .map(item => {
                    return transform([item.longitude, item.latitude], WGS84, GCJ02) //gps转为高德
                  })

                let color = ''
                if (item.data < 50) {
                  color = '#6a6aff'
                } else if (item.data < 100) {
                  color = '#4a4aff'
                } else if (item.data < 150) {
                  color = '#2828ff'
                } else if (item.data < 200) {
                  color = '#0000e3'
                } else {
                  color = '#0000c6'
                }

                let polyline = new AMap.Polyline({
                  path: path,
                  strokeColor: color,
                  strokeOpacity: 1,
                  strokeWeight: 10,
                  strokeStyle: 'solid'
                })

                let pathArr = polyline.getPath()
                let distance = Math.round(polyline.getLength())
                let lastPoint = pathArr[pathArr.length - 1]

                // let textElement = new AMap.Text({
                //   position: new AMap.LngLat(lastPoint.lng, lastPoint.lat),
                //   text: `名称:${item.siteName}<br/>
                //   长度:${distance}米<br/>
                //   年份:${item.year}年<br/>
                //   数值:${item.data}<br/>
                //   等级:${item.level}<br/>
                //   评价:${item.evaluation}<br/>`,
                //   draggable: true
                // })
                // this.map.add(textElement)
                polyline.on('click', () => {
                  this.$message.info(`${item.siteName}，
                  长度:${distance}米，
                  数值:${item.data}，
                  等级:${item.level}，
                  评价:${item.evaluation}`)
                })

                this.map.add(polyline)
              }
            })

            this.map.setFitView() //根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
          }
        })
    },

    renderArea(data) {
      let district = null
      let polygons = []
      //加载行政区划插件
      if (!district) {
        //实例化DistrictSearch
        let opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: 'all', //返回行政区边界坐标组等具体信息
          level: 'district' //查询行政级别为 市
        }
        district = new AMap.DistrictSearch(opts)
      }
      //行政区查询
      district.setLevel('district')
      data.forEach(item => {
        district.search(item.site, (status, result) => {
          let bounds = result.districtList[0].boundaries
          if (bounds) {
            for (let i = 0, l = bounds.length; i < l; i++) {
              //生成行政区划polygon
              let color = ''
              if (item.data < 50) {
                color = '#6a6aff'
              } else if (item.data < 100) {
                color = '#4a4aff'
              } else if (item.data < 150) {
                color = '#2828ff'
              } else if (item.data < 200) {
                color = '#0000e3'
              } else {
                color = '#0000c6'
              }

              let polygon = new AMap.Polygon({
                strokeWeight: 1,
                path: bounds[i],
                fillOpacity: 0.9,
                // fillColor: '#80d8ff',
                fillColor: color,
                // strokeColor: '#0091ea'
                strokeColor: 'black'
              })
              polygon.on('click', () => {
                this.$message.info(`${item.siteName}，
                  数值:${item.data}，
                  等级:${item.level}，
                  评价:${item.evaluation}`)
              })
              polygons.push(polygon)
            }
          }
          this.map.add(polygons)
          this.map.setFitView() //视口自适应
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.AMapDisplay {
  position: relative;

  #map-container {
    width: 100%;
    height: calc(100vh - 155px);
  }
  .search-input {
    position: absolute;
    top: 24px;
    left: 24px;
    width: 300px;
  }
}
</style>

<style>
.amap-icon img {
  width: 25px;
  height: 34px;
}

.amap-marker-label {
  border: 0;
  background-color: transparent;
}

.info-a {
  padding: 12px;
  position: relative;
  top: 0;
  left: 8px;
  border-radius: 2px;
  background-color: white;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  line-height: 1.5;
  font-size: 14px;
}
</style>
