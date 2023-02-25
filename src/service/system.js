import axios from '../utils/axios'
//某一个用户统计
export function userStat(params) {
  return axios.post('/order/sumUserDay', params);
}

//平台统计
export function sysStat(params) {
    return axios.post('/order/sumSysDay', params);
}

//代理统计
export function agentStat(params) {
  return axios.post('/order/sumAgentDay', params);
}


//价格趋势
export function listPriceRecord(params) {
  return axios.post('/order/listPriceRecord', params);
}