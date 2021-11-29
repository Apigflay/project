import api from './index'
import { axios } from '@/utils/request'


//登录
export function login(parameter) {
  return axios({
    baseURL: api1,
    url: `/LoginIn`,
    method: 'get',
    params: parameter,
  })
}


//获取用户信息
export function getUserInfo(username) {
  return axios({
    baseURL: api1,
    url: '/GetMeasureListByUserName?username=' + username,
    method: 'get',
  })
}

export function getCaptcha(phonenum) {
  return axios({
    baseURL: api1,
    url: '/SendSMVC?phonenum=' + phonenum,
    method: 'get',
  })
}

export function logout() {
  return axios({
    baseURL: api1,
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//修改密码
export function modifyPassword(username, password) {
  return axios({
    baseURL: api1,
    url: `ModifyPassword?username=${username}&password=${password}`,
    method: 'get',
  })
}



//激活设备
export function activeDevice(obj) {
  return axios({
    baseURL: api1,
    url: `AddMeasure`,
    method: 'post',
    data: obj
  })
}



//根据设备编号获取设备类型
export function GetDeviceTypeById(measureid) {
  return axios({
    baseURL: api1,
    url: `GetDeviceTypeById?measureid=${measureid}`,
    method: 'get',
  })
}



//校验登录名
export function CheckAUserName(ausername) {
  return axios({
    baseURL: api1,
    url: `CheckAUserName?ausername=${ausername}`,
    method: 'get',
  })
}


// 34.	生成二维码
export function CreateQRCodeByMid(urltype, mid, mtype) {
  return axios({
    baseURL: api1,
    url: `CreateQRCodeByMid`,
    method: 'post',
    data: {
      urltype,
      mid,
      mtype
    }
  })
}
