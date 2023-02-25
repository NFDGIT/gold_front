import axios from '../utils/axios'
export function login(params) {
  return axios.post('/order/login', params);
}
//查询用户列表
export function listUser(params) {
  return axios.post('/order/listUser', params)
}

//获取单个用户信息
export function userInfo(params) {
  return axios.post('/order/infoUser', params)
}

//添加用户
export function addUser(params) {
  return axios.post('/order/addUser', params)
}

//添加用户
export function updateUser(params) {
  return axios.post('/order/updateUser', params)
}

//用户充值
export function inRecharge(params) {
  return axios.post('/order/inRecharge', params)
}

//用户回款
export function outRecharge(params) {
  return axios.post('/order/outRecharge', params)
}

//用户账单列表
export function listRecharge(params) {
  return axios.post('/order/listRecharge', params)
}

//获取费率
export function getFee(params) {
  return axios.post('/order/getFee', params)
}

//修改费率
export function updateFee(params) {
  return axios.post('/order/updateFee', params)
}

//修改定价
export function updateDingJia(params) {
  return axios.post('/order/updateDingJia', params)
}

/*  代理 */

//获取代理
export function listAgent(params) {
  return axios.post('/order/listAgent', params)
}

export function addAgent(params) {
  return axios.post('/order/addAgent', params)
}

export function updateAgent(params) {
  return axios.post('/order/updateAgent', params)
}