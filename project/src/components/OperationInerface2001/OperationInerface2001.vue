<template>
  <div class="OperationInerface2001">
    <div class="title-container" v-if="showCount">
      当前在线操作人数：
      <span style="color:#1BD39B">{{count}}</span>
    </div>
    <div class="ui-container">
      <div class="my-canvas-container">
        <canvas ref="canvas" width="128" height="64"></canvas>
      </div>

      <div>
        <a-button class="btn-c btn-circle" type="primary" shape="circle" @click="clickBtn('NExit')">C</a-button>
        <a-button class="btn-enter btn-circle" type="primary" shape="circle" icon="enter" @click="clickBtn('NEnter')"></a-button>

        <a-button class="btn-up btn-rect" type="primary" icon="caret-up" @click="clickBtn('NUp')"></a-button>
        <a-button class="btn-down btn-rect" type="primary" icon="caret-down" @click="clickBtn('NDown')"></a-button>
        <a-button class="btn-left btn-rect" type="primary" icon="caret-left" @click="clickBtn('NLeft')"></a-button>
        <a-button class="btn-right btn-rect" type="primary" icon="caret-right" @click="clickBtn('NRight')"></a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationInerface2001',

  props: {
    power: {
      type: Boolean,
      default: false
    },

    mid: {
      type: String,
      default: ''
    },

    showCount: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      websocket: null,
      count: 0
    }
  },

  watch: {
    power(val) {
      val ? this.initWebSocket() : this.websocket.close()
    }
  },

  mounted() {
    this.initWebSocket()
  },

  methods: {
    clickBtn(action) {
      this.websocket.send(
        JSON.stringify({
          mid: this.mid,
          Class: action
        })
      )
    },

    initWebSocket() {
      const wsurl = `${this.$websocket_url}/WebSocktAWAH`
      this.websocket = new WebSocket(wsurl)

      //发送数据
      this.websocket.onopen = () => {
        console.log('操作界面websocket连接成功')

        this.websocket.send(
          JSON.stringify({
            mid: this.mid
          })
        )
      }

      // 接收数据
      this.websocket.onmessage = e => {
        if (typeof e.data === 'object') {
          let reader = new FileReader()
          reader.readAsArrayBuffer(e.data)
          reader.onload = () => {
            let binary = new Uint8Array(reader.result)
            this.$nextTick().then(() => {
              let canvas = this.$refs['canvas']
              let ctx = canvas.getContext('2d')
              let imgData = ctx.createImageData(128, 64)
              let arr = []

              for (let i = 0; i < binary.length; i++) {
                let byte = binary[i]
                  .toString(2)
                  .padStart(8, '0')
                  .split('')
                  .reverse()
                for (let j = 0; j < byte.length; j++) {
                  if (i < 128) {
                    arr[i + j * 128] = byte[j]
                  } else {
                    arr[(i % (128 * parseInt(i / 128))) + (j + 8 * parseInt(i / 128)) * 128] = byte[j]
                  }
                }
              }

              for (let k = 0; k < arr.length; k++) {
                let index = k * 4
                let [r, g, b] = [arr[k] === '0' ? 0 : 236, arr[k] === '0' ? 0 : 222, arr[k] === '0' ? 0 : 31]
                imgData.data[index + 0] = r
                imgData.data[index + 1] = g
                imgData.data[index + 2] = b
                imgData.data[index + 3] = 255
              }
              ctx.putImageData(imgData, 0, 0)
            })
          }
        } else if (typeof e.data === 'string') {
          let { count, mid } = JSON.parse(e.data)
          if (mid === this.mid) {
            this.count = count
          }
        }
      }

      this.websocket.onclose = () => {
        console.log('操作界面websocket关闭了')
      }

      this.websocket.onerror = () => {
        console.log('操作界面websocket连接发生错误')
      }
    }
  }
}
</script>

<style scoped lang="less">
.title-container {
  text-align: center;
  font-size: 18px;
  margin-bottom: 16px;
}
.btn-circle {
  font-size: 24px;
  width: 50px;
  height: 50px;
}

.btn-rect {
  width: 48px;
  height: 48px;
  font-size: 18px;
}
.ui-container {
  width: 320px;
  height: 455px;
  padding: 64px;
  border: 3px solid #999;
  display: inline-block;
  position: relative;
  border-radius: 4px;
  .my-canvas-container {
    display: flex;
    justify-content: center;
    canvas {
      transform: scale(2);
    }
  }

  .btn-c {
    position: absolute;
    top: 180px;
    left: 32px;
  }

  .btn-enter {
    position: absolute;
    top: 180px;
    right: 32px;
  }

  .btn-up {
    position: absolute;
    top: 263px;
    left: 50%;
    transform: translateX(-50%);
  }

  .btn-down {
    position: absolute;
    top: 377px;
    left: 50%;
    transform: translateX(-50%);
  }

  .btn-left {
    position: absolute;
    top: 320px;
    left: 75px;
  }

  .btn-right {
    position: absolute;
    top: 320px;
    right: 75px;
  }
}
</style>
