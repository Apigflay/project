import { axios } from '@/utils/request'

export function getHisData(params) {
  return axios({
    url: '/GetHisData',
    method: 'get',
    params
  })
}




export function GetHisDataForPic(params) {
  return axios({
    url: '/GetHisDataForPic',
    method: 'get',
    params
  })
}

// 32.	OCT三维瀑布图
export function GetHisOCTDataForPic(params) {
  return axios({
    url: '/GetHisOCTDataForPic',
    method: 'get',
    params
  })
}


// 33.	历史数据查询
export function GetHisDataForExcel(params) {
  return axios({
    url: '/GetHisDataForExcel',
    method: 'get',
    params
  })
}