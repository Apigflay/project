import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { VueAxios } from './axios'
import message from 'ant-design-vue/es/message'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const service = axios.create({
  // baseURL: '/api',
  timeout: 60000 // 请求超时时间
})

const err = error => {
  console.log('err' + error)
  message.error(error.message)
  return Promise.reject(error)
}

service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, err)

service.interceptors.response.use(res => {
  if (typeof res.data.d === 'string') {
    let result = JSON.parse(res.data.d)
    if (result.Error) {
      message.error(result.Msg)
    }
    return res.data
  } else {
    if (res.data.error) {
      let { code, msg } = res.data.error
      if (code !== 0) {
        if (code === 103) {
          message.error(`${msg}，请重新登录`)
          store.commit('SET_TOKEN', '')
          store.commit('SET_USERINFO', {})
          Vue.ls.remove(ACCESS_TOKEN)
          sessionStorage.removeItem(ACCESS_TOKEN)
          router.push({ name: 'login' })
        } else {
          message.error(msg)
        }
      }
    } else {//若果是文件流
      return res.data
    }

    return res.data
  }
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
