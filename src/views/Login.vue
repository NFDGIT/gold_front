

<template>
  <div class="login">
    <!-- <s-header :name="type == 'login' ? '登录' : '注册'" :back="'/home'"></s-header> -->
    <!-- <img class="logo" src="https://s.yezgea02.com/1604045825972/newbee-mall-vue3-app-logo.png" alt=""> -->
    <div style="margin:0 auto; text-align: center; margin-top: 50px;">
      <img class="logo header_ico" src="~@/static/images/home_header_ico.png" alt="" />
      <img class="logo header_logo" src="~@/static/images/home_header_logo.png" alt="" />
    </div>
    <div v-if="type == 'login'" class="login-body login">
      <van-form @submit="onSubmit">
        <div class="login-main">
          <van-field v-model="account" label-width="4em" name="account" label="用户名:" placeholder="请输入用户名"
            :rules="[{ required: true }]" />
          <van-field v-model="password" label-width="4em" type="password" name="password" placeholder="请输入密码"
            label="密&nbsp;&nbsp;&nbsp;&nbsp;码:" :rules="[{ required: true, }]" />
          <van-field v-model="captcha" label-width="4em" name="captcha" label="验证码:" placeholder="请输入验证码"
            :rules="[{ required: true }]" />

          <div style="margin: 16px;">
            <!-- <div class="link-register" @click="toggle('register')">立即注册</div> -->
            <van-button round block native-type="submit">登录</van-button>
          </div>
        </div>
      </van-form>
    </div>
    <div v-else class="login-body register">
      <van-form @submit="onSubmit">
        <van-field v-model="username1" name="username1" label="用户名" placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="password1" type="password" name="password1" label="密码" placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]" />
        <van-field center clearable label="验证码" placeholder="输入验证码" v-model="verify">
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <div class="link-login" @click="toggle('login')">已有登录账号</div>
          <!-- <van-button round block color="#1baeae" native-type="submit">注册</van-button> -->
        </div>
      </van-form>
    </div>
    <div>
      <div class="login-footer">
        <div class="login-footer-text">
          <div>
            <span class="footer_span">板料销售 旧金回收 提纯兑换</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import vueImgVerify from '@/components/VueImageVerify'
import { login } from '@/service/user'
import { setLocal } from '@/common/js/utils'
import { Toast } from 'vant'
export default {
  setup() {
    const verifyRef = ref(null)
    const state = reactive({
      account: '',
      password: '',
      captcha:'',
      type: 'login',
      imgCode: '',
      verify: ''
    })

    // 切换登录和注册两种模式
    const toggle = (v) => {
      state.type = v
      state.verify = ''
    }

    // 提交登录或注册表单
    const onSubmit = async (values) => {
      // console.log('verifyRef.value.imgCode', verifyRef.value.imgCode)
      // state.imgCode = verifyRef.value.imgCode || ''
      // if (state.verify.toLowerCase() != state.imgCode.toLowerCase()) {
      //   Toast.fail('验证码有误')
      //   return
      // }
      if (state.type == 'login') {
        const { data } = await login({
          "account": values.account,
          "password": values.password,
          "captcha":values.captcha
        })
        setLocal('token', data)
        // 需要刷新页面，否则 axios.js 文件里的 token 不会被重置
        window.location.href = '/'
      } else {
        // await register({
        //   "account": values.account,
        //   "password": values.password1
        // })
        Toast.success('注册成功')
        state.type = 'login'
        state.verify = ''
      }
    }

    return {
      ...toRefs(state),
      toggle,
      onSubmit,
      verifyRef
    }
  },
  components: {
    vueImgVerify
  }
}
</script>

<style lang="less">
.login {
  background-color: rgba(208, 117, 59, 1);

  .logo {
    // width: 200px;
    // height: 120px;
    display: block;
    margin: 80px auto 20px;
    text-align: center;
  }

  .header_ico {
    height: 42px;
    width: 42px;
    display: inline-block;
    vertical-align: middle;
  }

  .header_logo {
    padding-left: 5px;
    height: 42px;
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  .login-body {
    padding: 0 20px;
  }

  .login-main {
    border-radius: 5px;
    background-color: #fff;
    padding: 15px;
  }

  .van-button {
    background-color: rgba(208, 117, 59, 1);
    color: #fff;
    border: 0.02667rem solid rgba(208, 117, 59, 1);
  }


  .login {
    .link-register {
      font-size: 14px;
      margin-bottom: 20px;
      color: #1989fa;
      display: inline-block;
    }
  }

  .register {
    .link-login {
      font-size: 14px;
      margin-bottom: 20px;
      color: #1989fa;
      display: inline-block;
    }
  }

  .verify-bar-area {
    margin-top: 24px;

    .verify-left-bar {
      border-color: #1baeae;
    }

    .verify-move-block {
      background-color: #1baeae;
      color: #fff;
    }
  }

  .verify {
    >div {
      width: 100%;
    }

    display: flex;
    justify-content: center;

    .cerify-code-panel {
      margin-top: 16px;
    }

    .verify-code {
      width: 40% !important;
      float: left !important;
    }

    .verify-code-area {
      float: left !important;
      width: 54% !important;
      margin-left: 14px !important;

      .varify-input-code {
        width: 90px;
        height: 38px !important;
        border: 1px solid #e9e9e9;
        padding-left: 10px;
        font-size: 16px;
      }

      .verify-change-area {
        line-height: 44px;
      }
    }
  }
}

.login-footer {
  text-align: center;
  margin: 0 auto;
  padding-bottom: 20px;
  width: 100%;
  position: absolute;
  bottom: 0;

  .footer_span {
    font-size: 14px;
    color: #fff;
    font-weight: bold;
    // padding-left: 10px;
    vertical-align: bottom;
  }
}
</style>
