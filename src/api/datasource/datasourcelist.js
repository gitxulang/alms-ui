import request from '@/utils/request'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'

// 请求列表
export function getDatasourceList(query) {
    return request({
      url: '/stariver-server/datasource/list',
      method: 'get',
      params: query
    })
  }
//新增本体
export function addDatasourceList(data) {
  return request({
    url: '/stariver-server/datasource',
    method: 'post',
    data:data
  })
}
//修改数据源
export function updateDatasource(data) {
  return request({
    url: '/stariver-server/datasource',
    method: 'put',
    data:data
  })
}
// 测试连接
export function testDatasource(data) {
  return request({
    url: '/stariver-server/datasource/ping',
    method: 'post',
    data: data
  })
}
// 删除数据源
export function delDatasourceList(datasourceListid) {
  return request({
    url: '/stariver-server/datasource/'+datasourceListid,
    method: 'delete'
  })
}

