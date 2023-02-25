
import axios from '../utils/axios'

//首页价格走势
export function getPriceRecord(params) {
  return axios.post('/order/newPrice',params);
}

//当前可盈利订单
export function getListProfitOrder(params) {
  return axios.post('/order/listProfitOrder',params);
}

//当前需补单订单
export function getListLossOrder(params) {
  return axios.post('/order/listLossOrder',params);
}

//当前大额亏损玩家
export function listLossUser(params) {
  return axios.post('/order/listLossUser',params);
}

