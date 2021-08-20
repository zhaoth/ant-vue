import request from '@/utils/request'

const api = {
  getOrgTree: '/prod-aps/org/getOrgTreeByPkAccount',
  saveOrg: '/prod-aps/org/saveOrg',
  getPage: '/prod-aps/org/page',
  deleteOrg: '/prod-aps/org/remove'
}
export function getOrgTreeSelect () {
  return request({
    url: api.getOrgTree,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function saveOrg (parameter) {
  return request({
    url: api.saveOrg,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getPage (parameter) {
  return request({
    url: api.getPage,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function deleteOrg (parameter) {
  return request({
    url: api.deleteOrg,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
