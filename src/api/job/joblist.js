import request from '@/utils/request'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'

// 请求列表
  export function getJobList(query) {
    return request({
      url: '/stariver-flow/project/list',
      method: 'get',
      params: query,
      
    })
  }
  // 新建构建任务
  export function addJob(data) {
    return request({
      url: '/stariver-flow/project',
      method: 'post',
      data:data
    })
  }   

// 单条删除
export function delJob(jobid) {
  return request({
    url: '/stariver-flow/project/'+jobid,
    method: 'delete'
  })
}


//查询索引
export function getIndexname(indexid) {
  return request({
    url: '/stariver-server/datasource/listTable/'+indexid,
    method: 'get'
  })
}
//构建任务详情
export function getJobid(routerid) {
  return request({
    url: '/stariver-flow/project/'+routerid,
    method: 'get'
  })
}
//  查询本体下概念
export function getOntologyes(ontologyId) {
  return request({
    url: '/stariver-server/ontology/listClasses/'+ontologyId,
    method: 'get'
  })
}

//  查询概念下数据属性
export function getOntologydata(classesId) {
  return request({
    url: '/stariver-server/ontology/listClassesDataProperties/'+classesId,
    method: 'get'
  })
}
//查询表的所有字段

export function exportExcel(data) {
  return request({
    url: '/stariver-server/datasource/listTableColumn',
    method: 'post',
    data:data
  })
}  


//执行构建任务
export function excuteJob(projectId) {
  return request({
    url: '/stariver-flow/project/'+ projectId +'/excute',
    method: 'get'
  })
}

//  查询关系属性
export function getRelation(relationId) {
  return request({
    url: '/stariver-server/ontology/listObjectProperties/'+relationId,
    method: 'get'
  })
}
//  查询对象属性下源目标概念
export function getTarget(targetId) {
  return request({
    url: '/stariver-server/ontology/listDomainAndRangeClasses/'+targetId,
    method: 'get'
  })
}

// 保存至图谱
export function saveGraph(data) {
  return request({
    url: '/stariver-flow/project/build',
    method: 'put',
    data:data
  })
} 

