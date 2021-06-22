import request from '@/utils/request'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'

// 请求列表
export function getOntologyList(query) {
  return request({
    url: '/stariver-server/ontology/list',
    method: 'get',
    params: query,

  })
}

//新增本体
export function addOntology(data) {
  return request({
    url: '/stariver-server/ontology',
    method: 'post',
    data: data
  })
}

// 单条删除
export function delOntology(ontologyid) {
  return request({
    url: '/stariver-server/ontology/' + ontologyid,
    method: 'delete'
  })
}
// 单条查询
export function queryOntology(ontologyid) {
  return request({
    url: '/stariver-server/ontology/' + ontologyid,
    method: 'get'
  })
}

//通过本体Id查询中间关系图
export function listNodesLinks(ontologyid) {
  return request({
    url: '/stariver-server/ontology/listNodesLinks/' + ontologyid,
    method: 'get'
  })
}


//通过本体Id查询左侧树
export function listClassesByLevel(ontologyid) {
  return request({
    url: '/stariver-server/ontology/listClassesByLevel/' + ontologyid,
    method: 'get'
  })
}

//通过本体Id查询左侧树
export function listClassesDataProperties(classesId) {
  return request({
    url: '/stariver-server/ontology/listClassesDataProperties/' + classesId,
    method: 'get'
  })
}
