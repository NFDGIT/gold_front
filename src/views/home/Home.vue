<template>
  <div class="home">
    <header>
      <div class="header_bg">
        <div class="header_bg_img">
          <!-- <div class="header_title">
            <img class="header_ico" src="~@/static/images/home_header_ico.png" alt="" />
            <img class="header_logo" src="~@/static/images/home_header_logo.png" alt="" />
            <span class="header_span">板料销售 旧金回收 提纯兑换</span>
          </div> -->
          <van-row>
            <van-col span="12">
              <div class="header_content">
                <span>价格参考</span>
                <span style="float:right; padding-right: 10px; font-weight: 800; color:#d0753b;" @click="showChatClick">
                  查看趋势
                </span>
                <!-- <span style="float:right; padding-right: 10px;"> {{ nowTime }}
                  <van-tag round type="success" style="font-size: 9px;">营业</van-tag>
                </span> -->
                <!-- <div style="clear:both;"></div>
                <van-row gutter="20" class="header_table_title">
                  <van-col span="6">货料</van-col>
                  <van-col span="6">走向趋势</van-col>
                  <van-col span="6">回购</van-col>
                  <van-col span="6">销售</van-col>
                </van-row>
                <van-row gutter="20" class="header_table_content" v-for=" item in listRecord" :key="item">
                  <van-col span="6" class="header_table_content_name">{{ item.kind_name }}</van-col>
                  <van-col span="6" class="header_table_content_chat">
                    <van-icon name="chart-trending-o" />
                    查看
                  </van-col>
                  <van-col span="6" class="header_table_content_buy">{{ item.price_bid }}</van-col>
                  <van-col span="6" class="header_table_content_sale">{{ item.price_ask }}</van-col>
                </van-row> -->
                <div v-for=" item in listRecord" :key="item" style="padding: 10px;">
                  <van-row>
                    <van-col span="12" style="font-weight:800;font-size: 15px;">回购</van-col>
                    <van-col span="12" class="header_table_content_buy">{{ item.price_bid }}</van-col>
                  </van-row>
                  <van-row style="padding-top:15px">
                    <van-col span="12" style="font-weight:800;font-size: 15px;">销售</van-col>
                    <van-col span="12" class="header_table_content_sale">{{ item.price_ask }}</van-col>
                  </van-row>
                </div>
              </div>
            </van-col>
            <van-col span="12">
              <van-button round type="primary" @click="showCreate = true">创建订单</van-button>
              <van-button style="margin-top:15px" round type="primary" @click="showOrderList = true">订单记录</van-button>
            </van-col>
          </van-row>
        </div>
      </div>
    </header>
    <div>
      <!-- <van-row style="text-align: center; padding-top: 20px;">
        <van-col span="14">
          
        </van-col>
        <van-col span="10">
          
        </van-col>
      </van-row> -->
      <div class="home_card_content">
        <!-- <span style="font-size:13px;font-weight:650">当前可盈利订单</span> -->
        <van-tabs v-model:active="active" swipeable="true" @change="changeTable" line-width="0px" line-height="0">
          <van-tab title="当前可盈利订单">
            <van-pull-refresh v-model="loading" @refresh="refresh" class="van-pull-refresh-1">
              <van-list v-model:loading="loading" @load="listProfitOrder" :finished="finished" class="van-list-1"
                finished-text="没有更多了">
                <div class="home_card" v-for=" item in list" :key="item">
                  <div style="clear:both;"></div>
                  <van-row>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> {{ item.user_name }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="text-align:right">
                      <span style="color:red;" v-if="item.trade_type == 'buy'">{{ item.kind_name }} - 买料</span>
                      <span style="color:green;" v-if="item.trade_type == 'sell'">{{ item.kind_name }} - 卖料</span>
                    </van-col>
                  </van-row>
                  <van-row>
                    <van-col span="12" class="txt_blod card_buy">{{ item.book_price }}（{{ item.upstream_price }}）</van-col>
                    <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                      <span style="color:red;" v-if="item.profit_predict >= 1">差价:{{ item.profit_predict }}</span>
                      <span style="color:green;" v-if="item.profit_predict < 1">差价:{{ item.profit_predict }}</span>
                    </van-col>
                  </van-row>
                  <van-row>
                    <van-col span="12" class="txt_blod" style="font-size:12px;">
                      <span> {{ item.weight }}g,定金 {{ item.deposit }},手续费 {{ item.fee_price }}</span>
                      <span style="line-height:37px"  v-if="item.is_split">，未结算{{ item.weight - item.split_weight }}g</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="text-align:right">
                      <van-button round type="primary" size="mini" style="width:70px;z-index: 50;"
                        @click="showSettleClick(item)">结算
                      </van-button>
                    </van-col>
                  </van-row>
                  <van-row>
                    <van-col span="12" class="txt_blod">
                      <span style="font-weight: 700;font-style: normal;font-size: 11px;color: #D0753B;">
                        预订时间:{{ formatDate(item.book_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="text-align:right">
                      <span style="font-weight: 650;font-style: normal;font-size: 11px;color: #D0753B;"></span>
                    </van-col>
                  </van-row>
                </div>
              </van-list>
            </van-pull-refresh>
          </van-tab>
          <van-tab title="当前亏损玩家" :dot="isShowDot">
            <van-pull-refresh v-model="loadingLoss" @refresh="refreshLoss" class="van-pull-refresh-2">
              <van-list v-model:loading="loadingLoss" @load="listLossOrder" :finished="finishedLoss" class="van-list-2"
                finished-text="没有更多了">
                <div class="home_card" v-for=" item in listLoss" :key="item">
                  <div style="clear:both;"></div>
                  <van-row>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> {{ item.user_name }}</span>
                    </van-col>
                  </van-row>
                  <van-row>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> 余额：{{ item.balance }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span>总定金：{{ item.deposit }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> 亏损：{{ item.profit }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> 安全价：{{ item.safe_price }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> 卖料均价：{{ item.avg_sell_price }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> 卖料总克重：{{ item.total_sell_weight }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> 买料均价：{{ item.avg_buy_price }}</span>
                    </van-col>
                    <van-col span="12" class="txt_blod" style="font-size:16px;">
                      <span> 买料总克重：{{ item.total_buy_weight }}</span>
                    </van-col>
                  </van-row>
                </div>
              </van-list>
            </van-pull-refresh>
          </van-tab>
        </van-tabs>

      </div>
    </div>
  </div>
  <!-- <van-popup v-model:show="showCreate" closeable close-icon="arrow-left" close-icon-position="top-left" position="right"
    :style="{ height: '100%', width: '100%' }">
    <create-order @close="closeCreate"></create-order>
  </van-popup> -->
  <create-order v-if="showCreate" @close="closeCreate"></create-order>
  <order-list v-if="showOrderList" @close="closeOrder"></order-list>
  <!-- <van-popup v-model:show="showOrderList" closeable close-icon="arrow-left" close-icon-position="top-left"
    position="right" :style="{ height: '100%', width: '100%' }">
    
  </van-popup> -->
  <settle-order-detail v-if="showSettle" @close="closeSettle" :orderData="optOrder" />
  <nav-bar />
  <order-detail v-if="showOrderDetail" @close="closeOrderDetail" :order="optOrder" />
  <trend-chat v-if="showChat" @close="closeChat" />
  <!-- <van-popup v-model:show="showChat" closeable close-icon="arrow-left" @close="closeChat(false)"
    close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
    <trend-chat v-if="true" @close="closeChat" :data="lineData" />
  </van-popup> -->
</template>

<script>
import { reactive, onMounted, toRefs, nextTick } from 'vue'
// import { useRouter } from 'vue-router'
// import swiper from '@/components/Swiper'
import navBar from '@/components/NavBar'
// import { getLocal } from '@/common/js/utils'
import { Toast } from 'vant'
import { ref } from 'vue';
// import { listOrder } from '../service/order';
import { getPriceRecord, getListProfitOrder, listLossUser } from '../../service/home';
import orderList from './OrderList.vue';
import createOrder from './CreateOrder.vue';
import OrderDetail from './OrderDetail.vue'
import { formatDate } from '@/utils'
// 引入 moment 插件
import moment from 'moment'
import settleOrderDetail from './SettleOrderDetail.vue';
import TrendChat from './echat.vue';
// import { time } from 'console';
// import { useStore  } from 'vuex'
export default {
  name: 'home',
  components: {
    navBar,
    orderList,
    createOrder,
    settleOrderDetail,
    OrderDetail,
    TrendChat
  },
  setup() {
    //订单列表
    const list = ref([]);
    const listLoss = ref([]);
    //走向趋势
    const listRecord = ref([]);
    const loading = ref(false);
    const loadingLoss = ref(false);
    const finishedLoss = ref(false);
    const finished = ref(false);
    //创建订单
    const showCreate = ref(false)
    //订单列表
    const showOrderList = ref(false)
    //结算订单显示
    const showSettle = ref(false)
    //是否显示趋势图
    const showChat = ref(false)

    const isShowDot = ref(false)
    //当前操作订单
    const optOrder = ref({})
    //显示订单详情
    const showOrderDetail = ref(false)
    //tab当前选择index
    const active = ref(0)
    //当前时间
    const nowTime = ref(moment(new Date()).format('YYYY年MM月DD日 HH:mm:ss'));
    //查询条件
    const query = ref({
      page_size: 5,
      page_num: 0
    })
    const queryLoss = ref({
      page_size: 5,
      page_num: 0
    })
    const state = reactive({})
    const timer = ref({});
    onMounted(async () => {
      priceRecord()
      // console.log(timer)
      timer.value = setInterval(() => {
        let nowDate = new Date();
        // if (nowDate.getSeconds() % 5 == 0) {
        //   // refresh()
        //   // refreshLoss()

        // }
        priceRecord()
        nowTime.value = moment(nowDate).format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
    })

    nextTick(() => {
      window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
      }, true)
    })

    const closeChat = () => {
      setTimeout(() => {
        showChat.value = false
      }, 300)
    }

    const showChatClick = () => {
      showChat.value = true
    }

    const listProfitOrder = () => {
      loading.value = true;
      getListProfitOrder(query.value).then(rsp => {
        loading.value = false;
        if (rsp.data.data == null) {
          finished.value = true
          return;
        }
        query.value.page_num++
        for (let i = 0; i < rsp.data.data.length; i++) {
          list.value.push(rsp.data.data[i])
        }
        // 加载状态结束
        if (list.value.length >= rsp.data.count) {
          finished.value = true;
        }
      })
    }

    const listLossOrder = () => {
      loadingLoss.value = true;
      listLossUser(queryLoss.value).then(rsp => {
        loadingLoss.value = false;
        if (rsp.data.data == null) {
          finishedLoss.value = true
          return;
        }

        queryLoss.value.page_num++
        for (let i = 0; i < rsp.data.data.length; i++) {
          listLoss.value.push(rsp.data.data[i])
        }
        //显示徽标
        if (listLoss.value.length >= 1) {
          isShowDot.value = true
        } else {
          isShowDot.value = false
        }
        // 加载状态结束
        if (listLoss.value.length >= rsp.data.count) {
          finishedLoss.value = true;
        }
      })
    }

    const priceRecord = () => {
      // Toast.loading({ message: '加载中...', forbidClick: true, duration: 0 });
      // let endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      // let startTime = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      getPriceRecord({}).then(rsp => {
        listRecord.value = rsp.data.data
        // nextTick(() => { Toast.clear(); })
      })
    }

    const closeOrderDetail = () => {
      // optOrder.value = item
      setTimeout(() => {
        showOrderDetail.value = false
      }, 500)
    }

    const ShowOrderDetailClick = (item) => {
      console.log(item)
      optOrder.value = item
      showOrderDetail.value = true
    }

    const tips = () => {
      Toast('敬请期待');
    }

    const showSettleClick = (item) => {
      optOrder.value = item
      showSettle.value = true
    }

    const closeSettle = (isRefresh) => {
      if (isRefresh) {
        refresh()
      }
      showSettle.value = false;
    }

    const closeCreate = (refresh) => {
      setTimeout(() => { showCreate.value = false }, 300);

      if (refresh) {
        refresh()
        refreshLoss()
      }
    }

    const closeOrder = () => {
      setTimeout(() => { showOrderList.value = false }, 300);
    }

    const changeTable = (e) => {
      if (e == 0) {
        refresh()
      } else {
        refreshLoss()
      }
    }

    const refresh = () => {
      list.value = [];
      query.value.page_num = 0;
      finished.value = false;
      listProfitOrder();
    }

    const refreshLoss = () => {
      listLoss.value = [];
      queryLoss.value.page_num = 0;
      finishedLoss.value = false;
      listLossOrder();
    }

    return {
      ...toRefs(state),
      formatDate,
      tips,
      list,
      listLoss,
      listRecord,
      loading,
      loadingLoss,
      finished,
      finishedLoss,
      listProfitOrder,
      listLossOrder,
      priceRecord,
      refresh,
      refreshLoss,
      closeOrder,
      showCreate,
      showOrderList,
      showSettle,
      showSettleClick,
      changeTable,
      showOrderDetail,
      ShowOrderDetailClick,
      closeOrderDetail,
      closeSettle,
      closeCreate,
      showChat,
      showChatClick,
      closeChat,
      active,
      optOrder,
      isShowDot,
      timer,
      nowTime
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
}
</script>

<style lang="less">
.home {
  .txt_blod {
    font-weight: bold;
  }

  /* pull 和 list 冲突解决  盈利*/
  .van-pull-refresh-1 {
    height: calc(100vh - 250px) !important;
    overflow: auto !important;
  }

  .van-list-1 {
    height: auto !important;
  }

  /* pull 和 list 冲突解决  亏损 */
  .van-pull-refresh-2 {
    height: calc(100vh - 250px) !important;
    overflow: auto !important;
  }

  .van-list-2 {
    height: auto !important;
  }

  .header_bg {
    /*background: url("@/static/images/home_header_bg.png") no-repeat;*/
    /* height: 273px; */
    /* min-height: 273px; */
    // background: linear-gradient(133.170274567372deg, rgba(225, 175, 144, 1) 2%, rgba(208, 117, 59, 1) 98%);
    background: rgba(225, 175, 144, 1);
    border-radius: 0px 0px 10px 10px;
  }

  .header_bg .header_bg_img {
    /* min-height: 273px; */
    // background: url("~@/static/images/home_header_bg.png") no-repeat right 20px top 40px;
    background-size: 150px 220px;
    padding-top: 10px;
    padding-right: 5px;
    padding-bottom: 10px;
  }

  .header_title {
    padding-top: 52px;
    padding-left: 10px;
    height: 50px;
    /*line-height: 22px;*/
    /*vertical-align: bottom;*/
  }

  .header_ico {
    height: 22px;
    width: 22px;
    display: inline-block;
    vertical-align: middle;
  }

  .header_logo {
    padding-left: 5px;
    height: 22px;
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  .header_span {
    font-size: 14px;
    color: #fff;
    font-weight: bold;
    padding-left: 10px;
    vertical-align: bottom;
  }

  .header_content {
    /*padding-top: 25px;*/
    margin-left: 5px;
    margin-right: 5px;
    padding: 5px;
    /*margin:0 auto;*/
    /*width: 95%;*/
    min-height: 80px;
    color: #333333;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }

  .van-list {
    padding-left: 5px;
    padding-right: 5px;
  }

  .header_table_title {
    /* font-weight: bold; */
    text-align: center;
    font-size: 13px;
    font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif;
    font-weight: 650;
    padding-top: 20px;
  }

  .header_table_content {
    text-align: center;
    padding-top: 20px;
  }

  .header_table_content_name {
    text-align: center;
    font-size: 13px;
    /* font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif; */
    font-weight: 400;
  }

  .header_table_content_chat {
    text-align: center;
    font-size: 13px;
    color: rgb(255, 255, 255);
    /* font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif; */
    font-weight: 650;
  }

  .header_table_content_buy {
    // text-align: center;
    font-size: 13px;
    font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif;
    color: #2e810d;
    font-weight: 650;
  }

  .header_table_content_sale {
    font-size: 13px;
    font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif;
    color: #e80a19;
    font-weight: 650;
  }

  .van-button--primary {
    color: #fff;
    font-weight: 650;
    font-size: 15px;
    width: 100%;
    height: 40px;
    background-color: rgba(208, 117, 59, 1);
    border: 0.02667rem solid rgba(208, 117, 59, 1);
  }

  .home_card {
    box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
    font-size: 13px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
  }

  .home_card_content {
    /*padding-top: 25px;*/
    margin-left: 10px;
    margin-right: 10px;
    /* padding: 15px; */
    padding-top: 15px;
    /*margin:0 auto;*/
    /*width: 95%;*/
    min-height: 60px;
    color: #333333;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }

  .home_card .van-row {
    padding-top: 7px;
    padding-bottom: 5px;
  }

  .card_buy {
    color: #07B884;
    font-weight: 500;
    font-size: 18px;
    font-family: 'PingFang-SC-Medium', 'PingFang SC Medium', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif;
  }

  .card_sale {
    color: #E80A19;
    font-weight: 500;
    font-size: 13px;
    vertical-align: bottom;
    line-height: 25px;
    font-family: 'PingFang-SC-Medium', 'PingFang SC Medium', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif;
  }
}
</style>



