import { axios } from '@/utils/request'
import { api_c, api_java, api_javatest} from './urlConfig.js'

//登录
export function login(data) {
  return axios({
    baseURL: api_java,
    url: '/login',
    method: 'post',
    data,
  })
}

//获取省市区
export function getArea(adCode) {
  return axios({
    baseURL: api_java,
    url: '/area/get',
    method: 'post',
    data: {
      adCode,
    },
  })
}

//通过token查看 省市区
export function getAreaByToken(adCode) {
  return axios({
    baseURL: api_java,
    url: '/area/get/by/token',
    method: 'post',
    data: {
      token:adCode,
    },
  })
}
/*******************************部门管理*******************************/

//创建部门与部门负责人账户
export function addDepartmentAndPeople(data) {
  return axios({
    baseURL: api_java,
    url: '/department/user',
    method: 'post',
    data,
  })
}

//获取所有下级(包括自己)部门树（过滤禁用）
export function getDepartmentTree() {
  return axios({
    baseURL: api_java,
    url: '/department/allChildrenTree',
    method: 'post',
  })
}

//获取部门详情
export function getDepartment(id) {
  return axios({
    baseURL: api_java,
    url: '/department/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//删除部门
export function deleteDepartment(id) {
  return axios({
    baseURL: api_java,
    url: '/department/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

//修改部门
export function modifyDepartment(data) {
  return axios({
    baseURL: api_java,
    url: '/department/update',
    method: 'post',
    data,
  })
}

//启用禁用部门
export function banDepartment(data) {
  return axios({
    baseURL: api_java,
    url: '/department/valid',
    method: 'post',
    data,
  })
}

//更新部门负责人
export function updateDepartmentUser(data) {
  return axios({
    baseURL: api_java,
    url: '/department/update/user',
    method: 'post',
    data,
  })
}

/*******************************仪器管理*******************************/

//获取仪器列表
export function getInstrumentList(data) {
  return axios({
    baseURL: api_java,
    url: '/device/list',
    method: 'post',
    data,
  })
}

//新增仪器
export function addInstrument(data) {
  return axios({
    baseURL: api_java,
    url: '/device/save',
    method: 'post',
    data,
  })
}

//新增仪器2001
export function addInstrument2001(data) {
  return axios({
    baseURL: api_java,
    url: '/device/save2001',
    method: 'post',
    data,
  })
}

//删除仪器
export function deleteInstrument(id) {
  return axios({
    baseURL: api_java,
    url: '/device/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取仪器信息
export function getInstrument(id) {
  return axios({
    baseURL: api_java,
    url: '/device/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//修改仪器
export function modifyInstrument(data) {
  return axios({
    baseURL: api_java,
    url: '/device/update',
    method: 'post',
    data,
  })
}

//修改仪器2001
export function modifyInstrument2001(data) {
  return axios({
    baseURL: api_java,
    url: '/device/update2001',
    method: 'post',
    data,
  })
}

//获取仪器列表
export function getDeviceTypeList(data) {
  return axios({
    baseURL: api_java,
    url: '/device/type/list',
    method: 'post',
    data,
  })
}

/*******************************校准器管理*******************************/

//获取校准器列表
export function getCalibratorList(data) {
  return axios({
    baseURL: api_java,
    url: '/calibrationDevice/list',
    method: 'post',
    data,
  })
}

//新增校准器
export function addCalibrator(data) {
  return axios({
    baseURL: api_java,
    url: '/calibrationDevice/add',
    method: 'post',
    data,
  })
}

//删除校准器
export function deleteCalibrator(id) {
  return axios({
    baseURL: api_java,
    url: '/calibrationDevice/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取校准器信息
export function getCalibrator(id) {
  return axios({
    baseURL: api_java,
    url: '/calibrationDevice/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//修改校准器
export function modifyCalibrator(data) {
  return axios({
    baseURL: api_java,
    url: '/calibrationDevice/update',
    method: 'post',
    data,
  })
}

/*******************************道路管理*******************************/
//获取道路列表
export function getRoadList() {
  return axios({
    baseURL: api_java,
    url: '/road/list',
    method: 'post',
  })
}

//添加道路
export function addRoad(data) {
  return axios({
    baseURL: api_java,
    url: '/road/save',
    method: 'post',
    data,
  })
}

//删除道路
export function deleteRoad(id) {
  return axios({
    baseURL: api_java,
    url: '/road/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取道路详情
export function getRoad(id) {
  return axios({
    baseURL: api_java,
    url: '/road/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//修改道路
export function modifyRoad(data) {
  return axios({
    baseURL: api_java,
    url: '/road/update',
    method: 'post',
    data,
  })
}

/*******************************测点管理*******************************/
//获取测点管理列表
export function getMeasureManageList(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/manage/list',
    method: 'post',
    data,
  })
}

//获取测点列表
export function getMeasureList(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/list',
    method: 'post',
    data,
  })
}

//根据条件查询 获取测点列表
export function getConditionMeasureList(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/list',
    method: 'post',
    data,
  })
}

//根据测点id 获取测点列表
export function getPointListById(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/ids/list',
    method: 'post',
    data,
  })
}

//添加测点
export function addMeasure(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/save',
    method: 'post',
    data,
  })
}

//获取测点
export function getMeasure(id) {
  return axios({
    baseURL: api_java,
    url: '/measure/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//修改测点
export function modifyMeasure(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/update',
    method: 'post',
    data,
  })
}

//删除测点
export function deleteMeasure(id) {
  return axios({
    baseURL: api_java,
    url: '/measure/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

//绑定仪器
export function bindInstrument(data) {
  return axios({
    baseURL: api_java,
    url: '/measureDevice/bind',
    method: 'post',
    data,
  })
}

//查询测点历史仪器
export function getHistoryInstrumentList(data) {
  return axios({
    baseURL: api_java,
    url: '/measureDevice/deviceList',
    method: 'post',
    data,
  })
}

//查询测点历史仪器
export function getHistoryPointList(data) {
  return axios({
    baseURL: api_java,
    url: '/measureDevice/measureList',
    method: 'post',
    data,
  })
}

//查询测点仪器列表
export function getPointInstrumentList() {
  return axios({
    baseURL: api_java,
    url: '/measureDevice/bindList',
    method: 'post',
  })
}

//根据测点id查询仪器列表
export function getInstrumentListByPointId(id) {
  return axios({
    baseURL: api_java,
    url: '/measureDevice/get/device/list',
    method: 'post',
    data: {
      id,
    },
  })
}

/*******************************仪器维修记录管理*******************************/
//获取列表
export function getMaintainList(id) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取校准器维修记录列表
export function getMaintainCalibratorList(id) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/calibration/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取风速仪维修记录列表
export function getMaintainAnemographList(id) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/wind/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//添加或修改
export function addModifyMaintain(data) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/saveOrUpdate',
    method: 'post',
    data,
  })
}

//添加或修改校准器维修记录
export function addModifyMaintainCalibrator(data) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/calibration/saveOrUpdate',
    method: 'post',
    data,
  })
}

//添加风速仪维修记录
export function addMaintainAnemograph(data) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/wind/save',
    method: 'post',
    data,
  })
}

//修改风速仪维修记录
export function updateMaintainAnemograph(data) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/wind/update',
    method: 'post',
    data,
  })
}

//获取详情
export function getMaintain(id) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//删除
export function deleteMaintain(id) {
  return axios({
    baseURL: api_java,
    url: '/repairRecord/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

/*******************************仪器检定记录管理*******************************/
//获取列表
export function getInspectList(id) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取校准器检定记录列表
export function getInspectCalibratorList(id) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/calibration/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取风速仪检定记录列表
export function getInspectAnemographList(id) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/wind/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//添加风速仪检定记录
export function addAnemographInspect(data) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/wind/save',
    method: 'post',
    data,
  })
}

//修改风速仪检定记录
export function updateAnemographInspect(data) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/wind/update',
    method: 'post',
    data,
  })
}

//添加或修改
export function addModifyInspect(data) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/saveOrUpdate',
    method: 'post',
    data,
  })
}

//添加或修改校准器检定记录
export function addModifyInspectCalibrator(data) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/calibration/saveOrUpdate',
    method: 'post',
    data,
  })
}

//获取校准器默认精度
export function getCalibrationAccuracy(type) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/calibration/accuracy',
    method: 'post',
    data: {
      type,
    },
  })
}

//获取详情
export function getInspect(id) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//删除
export function deleteInspect(id) {
  return axios({
    baseURL: api_java,
    url: '/verificationRecord/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

/*******************************用户管理*******************************/
//根据id获取用户信息
export function getUserinfoById(id) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/get',
    method: 'post',
    data: { id },
  })
}

//获取用户列表分页
export function getUserList(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/page',
    method: 'post',
    data,
  })
}

//获取用户列表
export function getUsers() {
  return axios({
    baseURL: api_java,
    url: '/sys/user/list',
    method: 'post',
    data: {},
  })
}

//添加用户
export function addUser(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/save',
    method: 'post',
    data,
  })
}

//重置密码
export function resetPassword(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/pwd/reset',
    method: 'post',
    data,
  })
}

//删除用户
export function deleteUser(id) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

//编辑用户基础信息
export function modifyUser(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/update',
    method: 'post',
    data,
  })
}

//编辑用户角色
export function modifyUserRole(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/role/update',
    method: 'post',
    data,
  })
}

//编辑用户部门
export function modifyUserDepartment(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/dept/update',
    method: 'post',
    data,
  })
}

//修改密码(自身)
export function modifyPasswordSelf(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/pwd/update',
    method: 'post',
    data,
  })
}

//编辑用户基础信息(自身)
export function modifyUserSelf(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/myself/update',
    method: 'post',
    data,
  })
}

//用户编辑个人资质证书
export function modifyQualificationCertificate(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/cert/update',
    method: 'post',
    data,
  })
}

//获取个人资质证书及审核信息
export function getCert(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/cert/get',
    method: 'post',
    data,
  })
}

//查看证书文件
export function lookCert(data) {
  let index = data.lastIndexOf('/') + 1
  let fileName = data.substring(index)
  let date = data.substring(0, index)
  let url = date + encodeURIComponent(fileName)
  return axios({
    baseURL: api_java,
    url,
    method: 'get',
    responseType: 'arraybuffer',
  }).then(res => {
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

//获取部门操作员
export function getOperatorList(id) {
  return axios({
    baseURL: api_java,
    url: '/sys/user/operator/list',
    method: 'post',
    data: {
      id,
    },
  })
}
/*******************************权限管理*******************************/
//获取权限列表（用户）
export function getAuthList() {
  return axios({
    baseURL: api_java,
    url: '/sys/author/user/list',
    method: 'post',
  })
}

/*******************************角色管理*******************************/
//获取角色列表(按部门，全部)
export function getRoleList(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/role/list',
    method: 'post',
    data,
  })
}

//创建角色
export function addRole(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/role/save',
    method: 'post',
    data,
  })
}

//删除角色
export function deleteRole(id) {
  return axios({
    baseURL: api_java,
    url: '/sys/role/delete',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取详情角色
export function getRole(id) {
  return axios({
    baseURL: api_java,
    url: '/sys/role/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//修改角色
export function modifyRole(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/role/update',
    method: 'post',
    data,
  })
}

//禁用角色
export function banRole(data) {
  return axios({
    baseURL: api_java,
    url: '/sys/role/valid',
    method: 'post',
    data,
  })
}

/*******************************图表分析*******************************/
//功能区分析
export function funcodeAnalyse(data) {
  return axios({
    baseURL: api_java,
    url: '/analysis/function',
    method: 'post',
    data,
  })
}

//交通分析
export function trafficAnalyse(data) {
  return axios({
    baseURL: api_java,
    url: '/analysis/road',
    method: 'post',
    data,
  })
}

//区域分析
export function areaAnalyse(data) {
  return axios({
    baseURL: api_java,
    url: '/analysis/area',
    method: 'post',
    data,
  })
}

//区域显示(地图)
export function areaAnalyseMap(data) {
  return axios({
    baseURL: api_java,
    url: '/show/area',
    method: 'post',
    data,
  })
}

//交通显示(地图)
export function trafficAnalyseMap(data) {
  return axios({
    baseURL: api_java,
    url: '/show/road',
    method: 'post',
    data,
  })
}

/*******************************配置管理*******************************/
//
export function getConfigList(data) {
  return axios({
    baseURL: api_java,
    url: '/settings/get',
    method: 'post',
    data,
  })
}

//交通分析
export function modifyConfig(data) {
  return axios({
    baseURL: api_java,
    url: '/settings/update',
    method: 'post',
    data,
  })
}

/*******************************数据审核*******************************/
//数据审核
export function auditData(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/data/audit',
    method: 'post',
    data,
  })
}

//审核确认
export function confirmData(data) {
  return axios({
    baseURL: api_java,
    url: '/measure/data/confirm',
    method: 'post',
    data,
  })
}

//待审核确认列表
export function getConfirmList() {
  return axios({
    baseURL: api_java,
    url: '/measure/data/confirm/list',
    method: 'post',
  })
}

//审核历史列表
export function getAuditHistoryList() {
  return axios({
    baseURL: api_java,
    url: '/measure/data/audit/history/list',
    method: 'post',
  })
}

//获取甘特图数据
export function getGanttData(data) {
  return axios({
    baseURL: api_c,
    url: '/GetGantt',
    method: 'get',
    params: data,
  })
}

export function getHisData(params) {
  return axios({
    baseURL: api_c,
    url: '/GetHisData',
    method: 'get',
    params,
  })
}

export function GetHisDataForPic(params) {
  return axios({
    baseURL: api_c,
    url: '/GetHisDataForPic',
    method: 'get',
    params,
  })
}

// 32.	OCT三维瀑布图
export function GetHisOCTDataForPic(params) {
  return axios({
    baseURL: api_c,
    url: '/GetHisOCTDataForPic',
    method: 'get',
    params,
  })
}

// 33.	历史数据查询
export function GetHisDataForExcel(params) {
  return axios({
    baseURL: api_c,
    url: '/GetHisDataForExcel',
    method: 'get',
    params,
  })
}

// 24.	获取多测点统计数据
export function GetMulMeasureData(obj) {
  return axios({
    baseURL: api_c,
    url: `/GetMulMeasureData`,
    method: 'post',
    data: obj,
  })
}

// 35.	获取多测点数据
export function GetMulMeasureDateForPic(obj) {
  return axios({
    baseURL: api_c,
    url: `/GetMulMeasureDateForPic`,
    method: 'post',
    data: obj,
  })
}

/*******************************任务管理*******************************/
//任务列表
export function getTaskList(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/page',
    method: 'post',
    data,
  })
}

//15.	查询首页任务（分页）
export function getHomeTaskList(data,type) {
  if(type==7){
    return axios({
      baseURL: api_java,
      url: '/measureTask/home/page',
      method: 'post',
      data:{
        page: {
          size: 100000,
          current: 1,
        },
        keys: {
          type:1,
          taskType:1,//0是子任务，1是组任务
        }
      }
    })
  }else if(type==8){
    return axios({
      baseURL: api_java,
      url: '/measureTask/home/page',
      method: 'post',
      data:{
        page: {
          size: 100000,
          current: 1,
        },
        keys: {
          type:1,
          taskType:0,//0是子任务，1是组任务
        }
      }
    })
  }else{
    return axios({
      baseURL: api_java,
      url: '/measureTask/home/page',
      method: 'post',
      data,
    })
  }
}

//1.	创建常规任务单
export function createNormalTask(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/routine/create',
    method: 'post',
    data,
  })
}

//2.	创建非常规任务单
export function createUnnormalTask(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/nonroutine/create',
    method: 'post',
    data,
  })
}

//任务删除
export function deleteTask(ids) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/delete',
    method: 'post',
    data: {
      ids,
    },
  })
}

//子任务删除
export function deleteSonTask(obj) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/edit/sub',
    method: 'post',
    data: obj,
  })
}

//	查询任务详情
export function getTaskDetail(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//	任务编辑
export function updateTask(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/edit',
    method: 'post',
    data,
  })
}

//任务撤销
export function revokeTask(ids) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/revoke',
    method: 'post',
    data: {
      ids,
    },
  })
}

//任务发布
export function publishTask(ids) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/publish',
    method: 'post',
    data: {
      ids,
    },
  })
}

//任务拒绝
export function refuseTask(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/discard',
    method: 'post',
    data: {
      id,
    },
  })
}

//任务指派
export function assignTask(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/designate/operator',
    method: 'post',
    data,
  })
}

//任务审核
export function auditTask(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/audit/task',
    method: 'post',
    data,
  })
}

//任务接收
export function acceptTask(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/accept',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取审核记录列表
export function getAuditRecordList(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/audit/log/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//获取任务操作记录列表
export function getOperateRecordList(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/log/list',
    method: 'post',
    data: {
      taskId: id,
    },
  })
}

//查询组任务当前审核的子任务
export function getAuditSubTaskList(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/audit/group/list',
    method: 'post',
    data: {
      id,
    },
  })
}

//任务领取
export function claimTask(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/claim',
    method: 'post',
    data: {
      id,
    },
  })
}

//任务导出报表
export function exportReport(id) {
  return axios({
    baseURL: api_java,
    url: '/task/report',
    method: 'post',
    data: {
      id,
    },
    // responseType: 'arraybuffer',
    // responseType: 'blob',
  })
}

//任务单绑定仪器
export function taskBindDevice(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/device/bind',
    method: 'post',
    data,
  })
}

//任务声测量仪器控制
export function taskControlDevice(data) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/device/noise/control',
    method: 'post',
    data,
  })
}
//  待审批 非常规任务 查看已提交数据
export function taskGetDataAuditList(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/data/audit/list',
    method: 'post',
    data: {
      taskId:id,
    },
  })
}


//任务单历年数据查询 其他
export function taskGetYearsData(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/years',
    method: 'post',
    data: {
      id,
    },
  })
}
//任务单查看任务数据 非常规任务有 除待审批之外查
export function taskGetDataList(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/data/list',
    method: 'post',
    data: {
          "page": {
              "current": 1,
              "size": 500
          },
          "keys": {
              "deviceSerialNo": null,
              "taskId":id,

          }
    }
      
  })
}
//任务单查询任务单绑定仪器 
export function taskGetDeviceBinding(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/device/binding',
    method: 'post',
    data: {
      id:id,
      auditId:-2
    },
  })
}
//任务单查询全部数据 功能区
export function taskGetAuditList(id) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/data/funarea/audit/list',
    method: 'post',
    data: {
          taskId:id
    }
  })
}
//任务单查询全部数据 除功能区
export function taskGetAuditPage(id,deviceSerialNo) {
  return axios({
    baseURL: api_java,
    url: '/measureTask/data/audit/page',
    method: 'post',
    data: {
          "page": {
              "current": 1,
              "size": 500
          },
          "keys": {
              "taskId": id,
              "deviceSerialNo":deviceSerialNo,
  
          }
    }
      
  })
}

/*******************************风速仪管理*******************************/
//	新增风速仪
export function addAnemograph(data) {
  return axios({
    baseURL: api_java,
    url: '/windDevice/add',
    method: 'post',
    data,
  })
}

//	修改风速仪
export function updateAnemograph(data) {
  return axios({
    baseURL: api_java,
    url: '/windDevice/update',
    method: 'post',
    data,
  })
}
//	获取风速仪
export function getAnemograph(id) {
  return axios({
    baseURL: api_java,
    url: '/windDevice/get',
    method: 'post',
    data: {
      id,
    },
  })
}

//	获取风速仪列表
export function getAnemographList(data) {
  return axios({
    baseURL: api_java,
    url: '/windDevice/list',
    method: 'post',
    data,
  })
}

//	删除风速仪
export function deleteAnemograph(id) {
  return axios({
    baseURL: api_java,
    url: '/windDevice/delete',
    method: 'post',
    data: {
      id,
    },
  })
}




/*******************************运维管理*******************************/
//
export function getFlowTaskPage(data) {
  return axios({
    baseURL: api_java,//api_javatest  api_java
    url: '/flow/task/page',
    // url: 'http://192.168.0.101:18880/flow/task/page',
    method: 'post',
    data,
  })
}


// 分页查询运维计划列表
export function getFlowPlanList(data) {
  return axios({
    baseURL: api_java,//api_javatest  api_java
    url: '/flow/plan/page',
    method: 'post',
    data,
  })
}