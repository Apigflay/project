import { axios } from '@/utils/request'

//modify用户信息
export function modifyUserInfo(username, ausername, phone) {
  return axios({
    url: `/ModifyUserInfo`,
    method: 'post',
    data:{
      username,
      ausername,
      phone
    }
  })
}



//get通知方式list
export function getNoticeWayList(username) {
  return axios({
    url: `/GetEventExpandList?username=${username}`,
    method: 'get',
  })
}


//add通知方式
export function addNoticeWay(eid, mid, phone) {
  return axios({
    url: `/UpdateEventExpand`,
    method: 'post',
    data: JSON.stringify({
      eid,
      mid,
      phone
    }),
    headers:
    {
      'Content-Type': 'application/json'
    }
  })
}




//delete通知方式
export function deleteNotice(eid, mid) {
  return axios({
    url: `/DeleteEventExpand?eventid=${eid}&mid=${mid}`,
    method: 'get',
  })
}



//添加测点
export function addPoint(obj) {
  return axios({
    url: `/AddInstrument`,
    method: 'post',
    data:obj
  })
}



//读取测点参数
export function GetMeaureInfo(MeasureId) {
  return axios({
    url: `/GetMeaureInfo?deviceawaid=${MeasureId}`,
    method: 'get',
  })
}



//根据仪器编号获得历史测点
export function getHistoryPointList(measureid, username) {
  return axios({
    url: `/GetMeasureListById?measureid=${measureid}&username=${username}`,
    method: 'get',
  })
}


//管理员删除管理的仪器
export function deleteDevice(username, noisemeasureid) {
  return axios({
    url: `/DelMeasure?username=${username}&noisemeasureid=${noisemeasureid}`,
    method: 'get',
  })
}


//23.	管理员添加设备
export function AddDeviceByManager(username, doausername,password) {
  return axios({
    url: `/AddDeviceByManager?username=${username}&doausername=${doausername}&password=${password}`,
    method: 'get',
  })
}




//25.	管理员获取用户列表
export function GetOpListByUserName(username) {
  return axios({
    url: `/GetOpListByUserName?username=${username}`,
    method: 'get',
  })
}


// 3.	申请管理员账户
export function RegisterManager(username, office, linker, tel, reFile, phone, email) {
  let params = new FormData()
  params.append('reFile', reFile.file)
  params.append('username', username)
  params.append('office', office)
  params.append('linker', linker)
  params.append('tel', tel)
  params.append('phone', phone)
  params.append('email', email)
  return axios({
    url: `/RegisterManager`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}




//25.	管理员获取用户列表
export function GetManagerList() {
  return axios({
    url: `/GetManagerList`,
    method: 'get',
  })
}


//27.	超级管理员审核管理员账户
export function ModifyUserState(username, userstate, phone) {
  return axios({
    url: `/ModifyUserState?username=${username}&userstate=${userstate}&phone=${phone}`,
    method: 'get',
  })
}


//31.	根据用户名查询所有仪器编号和类型
export function GetDeviceAndTypeByUserName(username) {
  return axios({
    url: `/GetDeviceAndTypeByUserName?username=${username}`,
    method: 'get',
  })
}
