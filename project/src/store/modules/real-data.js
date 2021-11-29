import ReconnectingWebSocket from 'reconnecting-websocket'

const realData = {
  state: {
    // websocket_url: 'ws://115.29.226.189:6030',//115.29.226.189  192.168.0.247
    // websocket_url: 'ws://192.168.0.247:6030',//115.29.226.189  192.168.0.247//
    websocket_url: 'ws://192.168.0.247:8000/moahzsjc/websocket',//115.29.226.189  192.168.0.247
    pointDataInfoModalShowed: false, //测点信息modal是否已经展示过了，true已经展示，false还未展示
    socket: null,
    realPointList: [],
    currentPointIndex: '',
    currentPointCodeMeasureCode: '',
    currentPointCodeAnd: '',
    historyPointCode: '',
    historyDateRange: '',
    realEventSocket: null,
    realEventList: [],
    displayType: 'list', //列表显示 or 图形显示
    isResponsed: false, // websocket 是否返回
    haveData: false, // websocket 是否有数据
    //测点列表里的列表配置
    checkedList: [
      'MeasureName',
      'MeasureCode',
      'MeasureId',
      'DateTime',
      'Lp',
      'Lmax',
      'MeasureAddress',
      'Funcode',
      'LinkMode',
      'linkState',
      'MeasureType'
    ],
    leqtype: 'LeqT' //测点列表里的列表配置
  },
  mutations: {
    SET_CURRENTPOINTCODEMEASURECODE: (state, currentPointCodeMeasureCode) => {
      state.currentPointCodeMeasureCode = currentPointCodeMeasureCode
    },
    SET_POINT_DATA_INFO_MODAL_SHOWED: (state, pointDataInfoModalShowed) => {
      state.pointDataInfoModalShowed = pointDataInfoModalShowed
    },
    SET_REALPOINTLIST: (state, realPointList) => {
      state.realPointList = realPointList
    },
    SET_CURRENTPOINTINDEX: (state, currentPointIndex) => {
      state.currentPointIndex = currentPointIndex
    },
    SET_CURRENTPOINTCODE: (state, currentPointCode) => {
      state.currentPointCode = currentPointCode
    },

    SET_HISTORYPOINTCODE: (state, historyPointCode) => {
      state.historyPointCode = historyPointCode
    },

    SET_HISTORYDATERANGE: (state, historyDateRange) => {
      state.historyDateRange = historyDateRange
    },

    SET_SOCKET: (state, socket) => {
      state.socket = socket
    },
    SET_SOCKET_OPEN: (state, open) => {
      state.socket.onopen = open
    },
    SET_SOCKET_SEND: (state, send) => {
      state.socket.send(send)
    },
    SET_SOCKET_MESSAGE: (state, message) => {
      state.socket.onmessage = message
    },
    SET_SOCKET_ERROR: (state, error) => {
      state.socket.onerror = error
    },
    SET_SOCKET_CLOSE: (state, close) => {
      state.socket.onclose = close
    },

    SET_REALEVENTLIST: (state, realEventList) => {
      state.realEventList = realEventList
    },
    SET_REALEVENTSOCKET: (state, socket) => {
      state.realEventSocket = socket
    },
    SET_REALEVENTSOCKET_OPEN: (state, open) => {
      state.realEventSocket.onopen = open
    },
    SET_REALEVENTSOCKET_SEND: (state, send) => {
      state.realEventSocket.send(send)
    },
    SET_REALEVENTSOCKET_MESSAGE: (state, message) => {
      state.realEventSocket.onmessage = message
    },
    SET_REALEVENTSOCKET_ERROR: (state, error) => {
      state.realEventSocket.onerror = error
    },
    SET_REALEVENTSOCKET_CLOSE: (state, close) => {
      state.realEventSocket.onclose = close
    },
    SET_DISPALYTYPE: (state, displayType) => {
      state.displayType = displayType
    },
    SET_ISRESPONSED: (state, isResponsed) => {
      state.isResponsed = isResponsed
    },
    SET_HAVEDATA: (state, haveData) => {
      state.haveData = haveData
    },
    SET_SHOWCOLUMNS: (state, showColumns) => {
      state.showColumns = showColumns
    },
    SET_LEQTYPE: (state, leqtype) => {
      state.leqtype = leqtype
    },
    SET_CHECKEDLIST: (state, checkedList) => {
      state.checkedList = checkedList
    }
  },
  actions: {
    SetPointDataInfoModalShowed({ commit }, pointDataInfoModalShowed) {
      commit('SET_POINT_DATA_INFO_MODAL_SHOWED', pointDataInfoModalShowed)
    },

    SetCurrentPointIndex({ commit }, currentPointIndex) {
      commit('SET_CURRENTPOINTINDEX', currentPointIndex)
    },

    SetCurrentPointCode({ commit }, currentPointCode) {
      commit('SET_CURRENTPOINTCODE', currentPointCode)
    },

    SetHistoryPointCode({ commit }, historyPointCode) {
      commit('SET_HISTORYPOINTCODE', historyPointCode)
    },

    SetHistoryDateRange({ commit }, historyDateRange) {
      commit('SET_HISTORYDATERANGE', historyDateRange)
    },

    SetSocketMessage: ({ commit }, message) => {
      commit('SET_SOCKET_MESSAGE', message)
    },

    SetRealPointList: ({ commit }, realPointList) => {
      commit('SET_REALPOINTLIST', realPointList)
    },

    SetRealEventSocketMessage: ({ commit }, message) => {
      commit('SET_REALEVENTSOCKET_MESSAGE', message)
    },

    SetRealEventList: ({ commit }, realEventList) => {
      commit('SET_REALEVENTLIST', realEventList)
    },

    SetDisplayType: ({ commit }, displayType) => {
      commit('SET_DISPALYTYPE', displayType)
    },

    SetShowColumns: ({ commit }, showColumns) => {
      commit('SET_SHOWCOLUMNS', showColumns)
    },

    // 实时数据
    GetRealPointList({ commit, state }) {
      let that = this

      function open() {
        console.log('测点列表websocket连接成功')
        commit(
          'SET_SOCKET_SEND',
          JSON.stringify({
            Class: '101', //固定101
            Token: that.state.user.token
          })
        )
      }

      function message(msg) {
        let list = JSON.parse(msg.data).Info.filter(item => item.MeasureCode) //未绑定测点的仪器不需要显示
        commit('SET_REALPOINTLIST', list)
        commit('SET_ISRESPONSED', true)
        if (list.length > 0) {
          commit('SET_HAVEDATA', true)
        } else {
          commit('SET_HAVEDATA', false)
        }
      }

      function error() {
        console.log('测点列表websocket error了')
      }

      function close() {
        console.log('测点列表websocket close了')
      }

      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        commit('SET_SOCKET', new ReconnectingWebSocket(`${that.state.realData.websocket_url}/WebSocktLp`))
        // commit('SET_SOCKET', new WebSocket(`ws://${location.host}/socket/WebSocktLp`))
        commit('SET_SOCKET_OPEN', open)
        commit('SET_SOCKET_MESSAGE', message)
        commit('SET_SOCKET_ERROR', error)
        commit('SET_SOCKET_CLOSE', close)
      }
    },

    // 事件
    GetRealEventList({ commit }) {
      let that = this
      function open2() {
        console.log('实时事件websocket连接成功')
        commit(
          'SET_REALEVENTSOCKET_SEND',
          JSON.stringify({
            Class: '101', //固定101
            Token: that.state.user.token
          })
        )
      }

      function message2(msg) {
        commit('SET_REALEVENTLIST', JSON.parse(msg.data).Info)
        // console.log(JSON.parse(msg.data).Info)
      }

      function error2() {
        console.log('实时事件websocket error了')
      }

      function close2() {
        console.log('实时事件websocket close了')
      }

      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        commit('SET_REALEVENTSOCKET', new ReconnectingWebSocket(`${that.state.realData.websocket_url}/WebSocktEvent`))
        commit('SET_REALEVENTSOCKET_OPEN', open2)
        commit('SET_REALEVENTSOCKET_MESSAGE', message2)
        commit('SET_REALEVENTSOCKET_ERROR', error2)
        commit('SET_REALEVENTSOCKET_CLOSE', close2)
      }
    }
  }
}

export default realData
