
<template>
  <div class="nav-bar van-hairline--top">
    <ul class="nav-list">
      <router-link class="nav-list-item active" to="home">
        <!--        <i class="nbicon nblvsefenkaicankaoxianban-1"></i>-->
        <van-icon name="stop-circle" />
        <span>首页</span>
      </router-link>
      <router-link class="nav-list-item" to="manager">
        <!--        <i class="nbicon nbfenlei"></i>-->
        <van-icon name="manager" />
        <span>用户管理</span>
      </router-link>
      <!--      <router-link  class="nav-list-item" to="cart">-->
      <!--        <van-icon  name="shopping-cart-o" :badge="!count ? '' : count" />-->
      <!--        <span>购物车</span>-->
      <!--      </router-link>-->
      <router-link class="nav-list-item" to="setting">
        <!--        <i class="nbicon nblvsefenkaicankaoxianban-"></i>-->
        <van-icon name="smile" />
        <span>我的</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
// import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// import { getLocal } from '@/common/js/utils'
export default {
  setup() {
    // const route = useRoute()
    const store = useStore()
    onMounted(() => {
      // const token = getLocal('token')
      // const path = route.path
      // if (token && !['/home', '/category'].includes(path)) {
      //   store.dispatch('updateCart')
      // }
    })
    const count = computed(() => {
      return store.state.cartCount
    })

    return {
      count
    }
  }
}
</script>

<style lang="less" scoped >
@import '../common/style/mixin';

.nav-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 15px 0 5px;
  z-index: 1000;
  background: #fff;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);

  .nav-list {
    width: 100%;
    .fj();
    flex-direction: row;
    padding: 0;

    .nav-list-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      text-align: center;
      //color: #666;
      color: #959595;

      &.router-link-active {
        //color: @primary;
        color: rgba(208, 117, 59, 1);
      }

      i {
        text-align: center;
        font-size: 35px;
      }

      span {
        font-size: 12px;
      }

      .van-icon-shopping-cart-o {
        margin: 0 auto 2px;
      }
    }
  }
}
</style>
