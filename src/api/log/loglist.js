import request from '@/utils/request'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'


// 请求记录列表
export function getLoglist(query) {
  return request({
    url: '/stariver-flow/project/flows',
    method: 'get',
    params: query,    
  })
}

// 图谱构建数据概览
export function getBuildOverview(graphId) {
  return request({
    url: '/stariver-flow/project/buildOverview/'+graphId,
    method: 'get'  
  })
}