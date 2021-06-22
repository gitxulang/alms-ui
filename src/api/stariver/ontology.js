import request from '@/utils/request'

// 查询本体列表
export function listOntology(query) {
  return request({
    url: '/stariver/ontology/list',
    method: 'get',
    params: query
  })
}

// 查询本体详细
export function getOntology(id) {
  return request({
    url: '/stariver/ontology/' + id,
    method: 'get'
  })
}

// 新增本体
export function addOntology(data) {
  return request({
    url: '/stariver/ontology',
    method: 'post',
    data: data
  })
}

// 修改本体
export function updateOntology(data) {
  return request({
    url: '/stariver/ontology',
    method: 'put',
    data: data
  })
}

// 删除本体
export function delOntology(id) {
  return request({
    url: '/stariver/ontology/' + id,
    method: 'delete'
  })
}
