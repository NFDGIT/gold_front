

import axios from '../utils/axios'


//创建订单
export function createOrder(params) {
  return axios.post('/order/addOrder', params);
}

//撤销预订订单
export function rollbackOrderBook(params) {
  return axios.post('/order/rollbackOrderBook', params);
}

//订单列表
export function listOrder(params) {
  return axios.post('/order/listOrder', params)
}

//用户订单列表
export function listUserOrder(params) {
  return axios.post('/order/listUserOrder', params)
}

//用户查询
export function listUser(params) {
  return axios.post('/order/allUser', params)
}
// export function listUser(params) {
//   return axios.post('/order/listUser', params)
// }

//结算订单
export function settleOrder(params) {
  return axios.post('/order/finishOrder', params)
}

//结算单笔玩家订单
export function settleOrderDetail(params) {
  return axios.post('/order/finishOrderByUser', params)
}

//撤销结算订单
export function settleOrderRollback(params) {
  return axios.post('/order/rollbackFinish', params)
}

//撤销结算单笔玩家订单
export function settleOrderDetailRollback(params) {
  return axios.post('/order/rollbackFinishUser', params)
}

//撤销拆分订单
export function settleSplitOrderRollback(params) {
  return axios.post('/order/rollbackSplitFinishUser', params)
}


//获取当前费率
export function getFee(params) {
  return axios.post("/order/getFee", params)
}

//获取当前费率
export function getDingJia(params) {
  return axios.post("/order/getDingJia", params)
}


//明细订单列表
export function listOrderDetail(params) {
  return axios.post("/order/listOrderDetail", params)
}

//获取拆分订单
export function getSplitOrder(params) {
  return axios.post("/order/getSplitOrder", params)
}

//修改上游价格
export function editUpstreamPrice(params) {
  return axios.post("/order/editUpstreamPrice", params)
}


//修改上游信息
export function editUpstreamInfo(params) {
  return axios.post("/order/editUpstreamInfo", params)
}




