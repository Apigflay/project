import { axios } from '@/utils/request'


//46.	甘肃手工添加测点
export function AddMeasureByHand(params) {
  return axios({
    url: '/AddMeasureByHand',
    method: 'post',
    data: params
  })
}

//47.	查询甘肃手工测点
export function GetMeasureByHand(params) {
  return axios({
    url: '/GetMeasureByHand',
    method: 'post',
    data: params
  })
}


//45.	手工添加测量数据
export function AddMeasureDataByHand(params) {
  return axios({
    url: '/AddMeasureDataByHand',
    method: 'post',
    data: params
  })
}


//44.	对比分析(获取测点数据)
export function GetMeasureDataByHandList(params) {
  return axios({
    url: '/GetMeasureDataByHandList',
    method: 'post',
    data: params
  })
}


//38.	功能区长期变化趋势分析
export function GetFunctionLongTerm(params) {
  return axios({
    url: '/GetFunctionLongTerm',
    method: 'post',
    data: params
  })
}



//39.	区域或交通声环境长期变化趋势分析
export function GetAreaAndTrafficLongTerm(params) {
  return axios({
    url: '/GetAreaAndTrafficLongTerm',
    method: 'post',
    data: params
  })
}

//40.	功能区声环境同比环比分析
export function GetFunctionYOY(params) {
  return axios({
    url: '/GetFunctionYOY',
    method: 'post',
    data: params
  })
}

//41.	区域或交通声环境同比环比分析
export function GetAreaAndTrafficYOY(params) {
  return axios({
    url: '/GetAreaAndTrafficYOY',
    method: 'post',
    data: params
  })
}


//42.	功能区排名分析
export function GetFunctionRank(params) {
  return axios({
    url: '/GetFunctionRank',
    method: 'post',
    data: params
  })
}

//43.	区域或交通声环境排名分析
export function GetAreaAndTrafficRank(params) {
  return axios({
    url: '/GetAreaAndTrafficRank',
    method: 'post',
    data: params
  })
}

//48.	声功能区噪声超标分析
export function GetNoiseOver(params) {
  return axios({
    url: '/GetNoiseOver',
    method: 'post',
    data: params
  })
}

//49.	测点分布统计
export function GetMeasureDistribute(params) {
  return axios({
    url: '/GetMeasureDistribute',
    method: 'post',
    data: params
  })
}