import request from '@/utils/request'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'

// 请求列表
export function getGraphList(query) {
    return request({
      url: '/stariver-server/graph/list',
      method: 'get',
      params: query
    })
  }
//新增图谱
export function addGraph(data) {
  return request({
    url: '/stariver-server/graph',
    method: 'post',
    data:data
  })
}
//修改图谱
export function updateGraph(data) {
  return request({
    url: '/stariver-server/graph',
    method: 'put',
    data:data
  })
}
// 删除图谱
export function delGraph(garphid) {
  return request({
    url: '/stariver-server/graph/'+garphid,
    method: 'delete'
  })
}
// 图谱详情
export function getGraph(garphid) {
  return request({
    url: '/stariver-server/graph/'+garphid,
    method: 'get'
  })
}
// 清空图谱
export function clearGraph(garphid) {
  return request({
    url: '/stariver-server/graph/'+garphid+"/clearAction",
    method: 'delete'
  })
}
// 图谱编码列表
export function getGraphCodes() {
  return request({
    url: '/stariver-server/graph/selectCodes',
    method: 'get'
  })
}