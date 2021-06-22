import request from '@/utils/request'

// 查询数据源列表
export function listDatasource(query) {
  return request({
    url: '/stariver-server/datasource/list',
    method: 'get',
    params: query
  })
}


// 查询数据源详细
export function getDatasource(id) {
  return request({
    url: '/stariver/datasource/' + id,
    method: 'get'
  })
}

// 新增数据源
export function addDatasource(data) {
  return request({
    url: '/stariver/datasource',
    method: 'post',
    data: data
  })
}

// 修改数据源
export function updateDatasource(data) {
  return request({
    url: '/stariver/datasource',
    method: 'put',
    data: data
  })
}

// 删除数据源
export function delDatasource(id) {
  return request({
    url: '/stariver/datasource/' + id,
    method: 'delete'
  })
}
