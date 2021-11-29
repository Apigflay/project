import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function(value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('timeFormat', function(date) {
  const year = date.slice(0, 4)
  const month = date.slice(4, 6)
  const day = date.slice(6, 8)
  const hour = date.slice(8, 10)
  const min = date.slice(10, 12)
  const sec = date.slice(12, 14)
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`
})

Vue.filter('linkStateFormat', function(linkState) {
  let result = ''
  if (linkState == 0) {
    result = '未连接'
  } else if (linkState == 1) {
    result = '正在连接'
  } else if (linkState == 2) {
    result = '连接成功'
  }
  return result
})

Vue.filter('eventLevelFormat', function(eventLevel) {
  let result = ''
  if (eventLevel == 1) {
    result = '信息'
  } else if (eventLevel == 2) {
    result = '警告'
  } else if (eventLevel == 3) {
    result = '错误'
  } else if (eventLevel == 4) {
    result = '噪声超标'
  }
  return result
})

Vue.filter('eventIDFormat', function(eventID) {
  let result = ''
  if (eventID == 'E0001') {
    result = '手动控制电校准'
  } else if (eventID == 'E0002') {
    result = '自动电校准'
  } else if (eventID == 'E0003') {
    result = '加热'
  } else if (eventID == 'E0004') {
    result = '噪声超标'
  } else if (eventID == 'E0005') {
    result = '仪器启动'
  } else if (eventID == 'E0006') {
    result = '仪器正常关机'
  } else if (eventID == 'E0007') {
    result = '停电'
  } else if (eventID == 'E0008') {
    result = '机箱门被打开'
  } else if (eventID == 'E0009') {
    result = '读声级计出错'
  } else if (eventID == 'E0010') {
    result = 'CF出错'
  } else if (eventID == 'E0011') {
    result = 'USB口出错'
  } else if (eventID == 'E0012') {
    result = '电池电压不足'
  } else if (eventID == 'E0013') {
    result = '声校准'
  }
  return result
})

Vue.filter('roleFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '超级管理员'
  } else if (val == 1) {
    result = '管理员'
  } else if (val == 2) {
    result = '操作员'
  }
  return result
})

Vue.filter('userStateFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '未审核'
  } else if (val == 1) {
    result = '审核通过'
  } else if (val == 2) {
    result = '审核不通过'
  }
  return result
})

Vue.filter('decimalsFormat', function(value) {
  if (value) {
    if (!value.toString().includes('.')) {
      return `${value}.0`
    } else {
      return value
    }
  } else {
    return value
  }
})

Vue.filter('funcodeFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '0'
  } else if (val == 1) {
    result = '1'
  } else if (val == 2) {
    result = '2'
  } else if (val == 3) {
    result = '3'
  } else if (val == 4) {
    result = '4a'
  } else if (val == 5) {
    result = '4b'
  }
  return result
})

Vue.filter('gansuFormat', function(val) {
  let result = ''
  if (val == 1) {
    result = '区域声环境'
  } else if (val == 2) {
    result = '声功能区'
  } else if (val == 3) {
    result = '道路交通声环境'
  }
  return result
})

Vue.filter('unix2String', function(val) {
  if (val) {
    return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return ''
  }
})

Vue.filter('toAllLp', function(val) {
  if (val.lasp) {
    return Number(val.lasp).toFixed(1);
  }else if(val.lafp){
    return Number(val.lafp).toFixed(1);
  }else if(val.laip){
    return Number(val.laip).toFixed(1);
  }else if(val.lcsp){
    return Number(val.lcsp).toFixed(1);
  }else if(val.lcfp){
    return Number(val.lcfp).toFixed(1);
  }else if(val.lcip){
    return Number(val.lcip).toFixed(1);
  }else if(val.lzsp){
    return Number(val.lzsp).toFixed(1);
  }else if(val.lzfp){
    return Number(val.lzfp).toFixed(1);
  }else if(val.lzip){
    return Number(val.lzip).toFixed(1);
  }else{
    return '';
  }
})

Vue.filter('toAllLEq', function(val) {
  if (val.lzeqt) {
    return Number(val.lzeqt).toFixed(1);
  }else if(val.lceqt){
    return Number(val.lceqt).toFixed(1);
  }else if(val.laeqt){
    return Number(val.laeqt).toFixed(1);
  }else {
    return ''
  }
})

Vue.filter('toFixed1', function(val) {
  return Number(val).toFixed(1);
})

Vue.filter('deviceTypeFormat', function(val) {
  if (val == 0) {
    return 'AWA6270'
  } else if (val == 1) {
    return 'AWA6291'
  } else if (val == 2) {
    return 'AWA5636'
  } else if (val == 3) {
    return 'AWA6228'
  } else if (val == 4) {
    return 'AWA6218J'
  } else if (val == 5) {
    return 'AWA6218S'
  } else if (val == 6) {
    return 'ASV111'
  } else if (val == 7) {
    return 'AWA6256B_T'
  } else if (val == 8) {
    return 'AWA6228+'
  } else if (val == 9) {
    return 'AWA5688'
  } else if (val == 11) {
    return 'ASV1102'
  } else if (val == 12) {
    return 'AWA8578G'
  } else if (val == 13) {
    return 'AHAI2001'
  } else if (val == 14) {
    return 'AHAI3001'
  } else {
    return ''
  }
})

Vue.filter('booleanFormat', function(val) {
  if (val === true) {
    return '是'
  } else if (val === false) {
    return '否'
  } else {
    return ''
  }
})

Vue.filter('stateFormat', function(val) {
  if (val == 0) {
    return '禁用'
  } else if (val == 1) {
    return '启用'
  }
})

Vue.filter('roadTypeFormat', function(val) {
  if (val == 1) {
    return '城市快速路'
  } else if (val == 2) {
    return '城市主干路'
  } else if (val == 3) {
    return '城市次干路'
  } else if (val == 4) {
    return '含轨道交通走廊的道路'
  } else if (val == 5) {
    return '穿过城市的高速公路'
  } else {
    return ''
  }
})

Vue.filter('noiseTypeFormat', function(val) {
  if (val == 0) {
    return '功能区噪声'
  } else if (val == 1) {
    return '区域噪声'
  } else if (val == 2) {
    return '交通噪声'
  } else {
    return ''
  }
})

Vue.filter('deviceClassifyFormat', function(val) {
  if (val == 1) {
    return '噪声测量仪器'
  } else if (val == 2) {
    return '振动测量仪器'
  } else {
    return ''
  }
})

Vue.filter('auditFormat', function(val) {
  if (val === true) {
    return '通过'
  } else if (val === false) {
    return '拒绝 '
  } else {
    return ''
  }
})

Vue.filter('CheckStateFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '未审核'
  } else if (val == 1) {
    result = '审核通过'
  } else if (val == 2) {
    result = '审核不通过'
  }
  return result
})

Vue.filter('OkStateFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '未确认'
  } else if (val == 1) {
    result = '确认通过'
  } else if (val == 2) {
    result = '确认不通过'
  }
  return result
})

Vue.filter('routineTypeFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '功能区噪声测量'
  } else if (val == 1) {
    result = '区域噪声测量'
  } else if (val == 2) {
    result = '交通噪声测量'
  }
  return result
})

Vue.filter('dataSubmitTypeFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '瞬时'
  } else if (val == 1) {
    result = '分钟'
  }
  return result
})

Vue.filter('taskStatusFormat', function(val) {
  let result = ''
  switch (val) {
    case 'CREATED':
      result = '待发布'
      break
    case 'PUBLISHED':
      result = '已发布'
      break
    case 'WAIT_RECEIVING':
      result = '待接收'
      break
    case 'WAIT_DESIGNATING':
      result = '待指派'
      break
    case 'EXECUTING':
      result = '待提交'
      break
    case 'AUDITING':
      result = '待审批'
      break
    case 'COMPLETED':
      result = '已完成'
      break
    case 'REFUSED':
      result = '已拒绝'
      break
    case 'REVOKED':
      result = '已撤销'
      break
    case 'OVERDUE':
      result = '已过期'
      break
    default:
      result = ''
      break
  }
  return result
})

Vue.filter('deviceUsageFormat', function(val) {
  let result = ''
  if (val == 1) {
    result = '手持'
  } else if (val == 2) {
    result = '在线'
  }
  return result
})

Vue.filter('taskTypeFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '可执行任务'
  } else if (val == 1) {
    result = '组任务'
  }
  return result
})


Vue.filter('operateFormat', function(val) {
  let result = ''
  if (val == 0) {
    result = '不通过'
  } else if (val == 1) {
    result = '通过'
  }
  return result
})

Vue.filter('urlFormat', function(val) {
  if (val) {
    var index = val.lastIndexOf("\/");
    return val.substring(index + 14,val.length)
  } else {
    return ''
  }
})

Vue.filter('cycleFormat', function(val) {//MONTH, QUARTER ,YEAR
  if (val=='MONTH') {
    return '月';
  }else if(val=='QUARTER'){
    return '季'
  }else if(val=='YEAR'){
    return '年'
  }
})

Vue.filter('userType1Format', function(val) {
  var userType1 = '';//1 主要运维人员
  val.forEach((item,index) => {
    if(item.userType==1){
      userType1=userType1+item.nickName+',';
    }
  });
  return userType1.substring(0, userType1.length -1);
})

Vue.filter('userType2Format', function(val) {
  var userType2 = '';//2 备选运维人员
  val.forEach((item,index) => {
    if(item.userType==2){
      userType2=userType2+item.nickName+',';
    }
  });
  return userType2.substring(0, userType2.length -1);
})
