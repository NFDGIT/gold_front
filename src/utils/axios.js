
import axios from 'axios'
import { Toast } from 'vant'
// import { setLocal } from '@/common/js/utils'
import router from '../router'

axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/api' : '//gold.cncpdd.com'
// axios.defaults.baseURL = 'http://192.168.110.193:9999'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(config=> {
  return config;
}, err=> {
  Toast.fail({message: '请求超时!'});
  return Promise.resolve(err);
})

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.error_code != 10000) {
    if (res.data.error_code == 401) {
      Toast.fail('登录已过期，请重新登录！')
      router.push({ path: '/login' })
    }
    Toast.fail(res.data.msg)
    // if (res.data.data && window.location.hash == '#/login') {
      // setLocal('token', res.data.data)
      // axios.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    // }
    
    return Promise.reject(res.data)
  }

  return res.data
}, err=> {
  // console.log(JSON.stringify(err))
  // if (!err.response.status){
    Toast.fail({message: err.message})
    // return Promise.resolve(err);
  // }
  // if (err.response.status == 504||err.response.status == 404) {
  //   Toast.fail({message: '服务器被吃了⊙﹏⊙∥'});
  // } else if (err.response.status == 403) {
  //   Toast.fail({message: '权限不足,请联系管理员!'});
  // }else {
  //   Toast.fail({message: '未知错误!'});
  // }
  return Promise.resolve(err);
})

export default axios
