<template>
  <div class="AMap">
    <div id="map-container"></div>

    <a-input
      v-model="searchText"
      id="tipinput"
      class="search-input"
      placeholder="搜索地点，位置"
      allowClear
      @change="inputChange"
    ></a-input>

    <a-button v-if="type==='道路'" class="clear-btn" @click="clearLine">
      清除绘制
      <a-icon type="close" />
    </a-button>
  </div>
</template>

<script>
import { transform, WGS84, GCJ02 } from 'gcoord'
export default {
  name: 'AMap',

  props: ['type', 'roadLength', 'roadPosition', 'province', 'city', 'district', 'adCode', 'address', 'lon', 'lat'],

  data() {
    return {
      map: undefined,
      mouseTool: undefined,

      roadElement: {},
      textElement: {},
      markerElement: {},
      searchText: undefined
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
      ['AMap.Scale', 'AMap.MapType', 'AMap.MouseTool', 'AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.Geocoder'],
      () => {
        this.map.addControl(new AMap.Scale())
        // this.map.addControl(new AMap.MapType())

        //搜索
        let placeSearch = new AMap.PlaceSearch({
          map: this.map
        })

        //关键词提示
        let autocomplete = new AMap.Autocomplete({
          input: 'tipinput'
        })
        autocomplete.on('select', function(e) {
          placeSearch.setCity(e.poi.adcode)
          placeSearch.search(e.poi.name)
        })

        //绘制道路
        if (this.type === '道路') {
          this.mouseTool = new AMap.MouseTool(this.map)
          this.mouseTool.on('draw', ({ type, obj }) => {
            this.clearLine()

            this.roadElement = obj
            let pathArr = obj.getPath()
            let distance = Math.round(obj.getLength())
            let lastPoint = pathArr[pathArr.length - 1]

            this.textElement = new AMap.Text({
              position: new AMap.LngLat(lastPoint.lng, lastPoint.lat),
              text: `道路长${distance}米`,
              draggable: true
            })
            this.map.add(this.textElement)

            this.$emit('update:roadLength', distance)
            this.$emit(
              'update:roadPosition',
              pathArr.map((item, index) => {
                let result = transform([item.lng, item.lat], GCJ02, WGS84) //高德经纬度转为gps
                return {
                  longitude: result[0].toFixed(6),
                  latitude: result[1].toFixed(6),
                  orderNum: index
                }
              })
            )
          })
          this.startLine()
        } else if (this.type === '选点') {
          this.startMarker()
        }
      }
    )

    //有数据之后打开地图
    if (this.type === '道路') {
      if (this.roadPosition.length > 0) {
        let path = this.roadPosition
          .sort((a, b) => a.orderNum - b.orderNum)
          .map(item => {
            return transform([item.longitude, item.latitude], WGS84, GCJ02) //gps转为高德
          })

        let polyline = new AMap.Polyline({
          path: path,
          strokeColor: '#3366FF',
          strokeOpacity: 1,
          strokeWeight: 10,
          strokeStyle: 'solid'
        })
        this.roadElement = polyline

        let pathArr = polyline.getPath()
        let distance = Math.round(polyline.getLength())
        let lastPoint = pathArr[pathArr.length - 1]

        this.textElement = new AMap.Text({
          position: new AMap.LngLat(lastPoint.lng, lastPoint.lat),
          text: `道路长${distance}米`,
          draggable: true
        })
        this.map.add(this.textElement)
        this.map.add(polyline)
      }
      this.map.setFitView() //根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
    } else if (this.type === '选点') {
      if (this.lon && this.lat) {
        let result = transform([this.lon, this.lat], WGS84, GCJ02) //gps转为高德
        let lngGD = result[0]
        let latGD = result[1]

        let geocoder = new AMap.Geocoder({ radius: 0 })
        geocoder.getAddress([lngGD, latGD], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            let { province, city, district, adcode } = result.regeocode.addressComponent
            let address = result.regeocode.formattedAddress
            this.$emit('update:province', province)
            this.$emit('update:city', city)
            this.$emit('update:district', district)
            this.$emit('update:adCode', adcode)
            this.$emit('update:address', address)

            this.markerElement = new AMap.Marker({
              position: new AMap.LngLat(lngGD, latGD),
              icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
              offset: new AMap.Pixel(-13, -30),
              zIndex: 1000
            })
            this.markerElement.setLabel({
              content: `<div class='info-a'>
                经度:${this.lon}<br />
                纬度:${this.lat}<br />
                区域:${province}${city}${district}<br />
                编码:${adcode}<br />
                地址:${address}
                </div>`,
              direction: 'right'
            })

            this.map.add(this.markerElement)
            this.map.setFitView() //根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
          }
        })
      }
    }
  },

  methods: {
    clearLine() {
      this.map.remove(this.roadElement)
      this.map.remove(this.textElement)
      this.map.remove(this.markerElement)
      this.roadElement = {}
      this.markerElement = {}
      this.textElement = {}

      this.$emit('update:roadLength', undefined)
      this.$emit('update:roadPosition', [])
    },

    clearMarker() {
      this.map.remove(this.markerElement)
      this.markerElement = {}

      this.$emit('update:roadLength', undefined)
      this.$emit('update:roadPosition', [])
    },

    // 开启绘制折线
    startLine() {
      this.mouseTool.polyline({
        strokeColor: '#3366FF',
        strokeOpacity: 1,
        strokeWeight: 10,
        strokeStyle: 'solid'
      })
    },

    // 开启选点
    startMarker() {
      this.map.on('click', e => {
        this.clearMarker()

        let lng = e.lnglat.getLng()
        let lat = e.lnglat.getLat()

        let result = transform([lng, lat], GCJ02, WGS84) //高德经纬度转为gps
        let lngGPS = result[0].toFixed(6)
        let latGPS = result[1].toFixed(6)
        this.$emit('update:lon', lngGPS)
        this.$emit('update:lat', latGPS)

        let geocoder = new AMap.Geocoder({ radius: 0 })
        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            let { province, city, district, adcode } = result.regeocode.addressComponent
            let address = result.regeocode.formattedAddress
            this.$emit('update:province', province)
            this.$emit('update:city', city)
            this.$emit('update:district', district)
            this.$emit('update:adCode', adcode)
            this.$emit('update:address', address)

            this.markerElement = new AMap.Marker({
              position: new AMap.LngLat(lng, lat),
              icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
              offset: new AMap.Pixel(-13, -30),
              zIndex: 1000
            })
            this.markerElement.setLabel({
              content: `<div class='info-a'>
                经度:${lngGPS}<br />
                纬度:${latGPS}<br />
                区域:${province}${city}${district}<br />
                编码:${adcode}<br />
                地址:${address}
                </div>`,
              direction: 'right'
            })

            this.map.add(this.markerElement)
          }
        })
      })
    },

    inputChange() {
      if (this.searchText === '' || this.searchText === undefined) {
        this.map.remove(this.map.getAllOverlays('marker'))
        if (this.type === '选点') {
          this.map.add(this.markerElement)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
#map-container {
  width: 100%;
  height: calc(100vh - 55px);
}
.clear-btn {
  position: fixed;
  top: 71px;
  left: 350px;
}
.search-input {
  position: fixed;
  top: 71px;
  left: 24px;
  width: 300px;
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
