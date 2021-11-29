import Vue from 'vue'
import { login, getUserinfoById, getPointInstrumentList } from '@/api/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    userinfo: {},
    pointList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo
    },
    SET_POINTLIST: (state, pointList) => {
      state.pointList = pointList
    },


  },

  actions: {

    // 登录
    Login({ commit }, userinfo) {
      return new Promise((resolve, reject) => {
        login(userinfo).then(({ error, response }) => {
          if (error.code === 0) {
            if (userinfo.rememberMe) {
              Vue.ls.set(ACCESS_TOKEN, response.token, 1 * 24 * 60 * 60 * 1000)
            } else {
              sessionStorage.setItem(ACCESS_TOKEN, response.token)
            }
            commit('SET_TOKEN', response.token)
            resolve()
          } else {
            reject({ error, response })
          }
        })
      })
    },

    // 获取登录的用户信息
    GetUserinfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserinfoById().then(({ error, response }) => {
          if (error.code === 0) {
            commit('SET_USERINFO', response)
            getPointInstrumentList().then(({ error, response }) => {
              if (error.code === 0) {
                commit('SET_POINTLIST', response.dataList)
              }
              resolve()
            })
          } else {
            reject()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 退出登录
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        Vue.ls.remove(ACCESS_TOKEN)
        sessionStorage.removeItem(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
