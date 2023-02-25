<template>

    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(true)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <van-sticky>
            <base-pop-header :title="title" :event="editUser" eventIco="edit" />
            <span @click="showExportOrderClick"
                style="position: absolute;right: 60px; top: 17px;font-size:15px; font-weight: 600;">导出</span>
        </van-sticky>

        <div class="userinfo-content">
            <div class="content-card" @click="showWalletClick">
                <van-row>
                    <van-col span="17">
                        <div style="margin-top: 20px; display:flex;align-items: center;">
                            <img width="45" height="45" src="~@/static/images/default.png" />
                            <span style="padding-left: 5px; font-weight: 650;">{{ optUser.user_name }}（{{ optUser.agent_name }}）</span>
                        </div>
                        <span>账户余额 ¥{{ optUser.balance }}豆 已用定金 ¥{{ optUser.deposit_use }}
                        </span>
                        <p>本月买料克重: {{ optUser.now_buy_month_weight }}</p>
                        <p>本月卖料克重: {{ optUser.now_sell_month_weight }}</p>
                        <p>上月买料克重: {{ optUser.last_buy_month_weight }}</p>
                        <p>上月卖料克重: {{ optUser.last_sell_month_weight }}</p>
                    </van-col>
                    <van-col span="7">
                        <div style="text-align:center; height: 100%;">
                            <div style="height:60px"></div>
                            <p style="width:100%;">累计盈利</p>
                            <p>¥ {{ optUser.total_profit }}</p>
                            <p style="width:100%;">安全价</p>
                            <p>¥ {{ optUser.safe_price }}</p>
                        </div>
                    </van-col>
                </van-row>
            </div>

            <van-tabs v-model:active="active" @change="tabChange" line-width="0px" line-height="0" swipeable="true"
                title-style="text-align:center">
                <van-tab title="未结算">
                    <van-pull-refresh v-model="loadingDown" @refresh="refresh" loading-text=" "
                        class="van-pull-refresh-2">
                        <div style="overflow: hidden;">
                            <van-list @load="getList" v-model:loading="loadingNoFinish" :finished="noFinished"
                                class="van-list-2" finished-text="没有更多了">
                                <div class="home_card" v-for=" item in list" :key="item">
                                    <div style="clear:both;"></div>
                                    <van-row>
                                        <van-col span="12" class="txt_blod">
                                            <a href="#" @click="showSplitOrderDetail(item)"><span
                                                style="font-size:9px;color:#BFBFBF"   v-if="item.is_split">点击查看拆分订单</span></a>
                                        </van-col>
                                        <van-col span="12" class="txt_blod">
                                            <span style="color:red;" v-if="item.trade_type == 'buy'">{{ item.kind_name
                                            }}买料</span>
                                            <span style="color:green;" v-if="item.trade_type == 'sell'">{{
                                                    item.kind_name
                                            }}卖料</span>
                                        </van-col>
                                        <!-- <van-col span="12" class="txt_blod" style="text-align:right">
                                            <span style="color:red;" v-if="item.trade_type == 'buy'">买料</span>
                                            <span style="color:green;" v-if="item.trade_type == 'sell'">卖料</span>
                                        </van-col> -->
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod card_buy">预订价:{{ item.book_price }}（{{
                                                item.upstream_price
                                        }}）</van-col>
                                        <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                                            <!-- 差价:{{item.profit_predict}} -->
                                            <span style="color:red;" v-if="item.profit_predict >= 1">差价:{{
                                                    item.profit_predict
                                            }}</span>
                                            <span style="color:green;" v-if="item.profit_predict < 1">差价:{{
                                                    item.profit_predict
                                            }}</span>
                                        </van-col>
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod" style="font-size:12px;">
                                            <span style="line-height:37px"> {{ item.weight }}g,定金 {{
                                                    item.deposit
                                            }}</span>
                                            <span style="line-height:37px"  v-if="item.is_split">，未结算{{ item.weight - item.split_weight }}g</span>
                                        </van-col>

                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod">
                                            <van-button round type="primary" @click="editUpstreamClick(item)"
                                                size="mini" style="width:120px">修改上游价格</van-button>
                                        </van-col>
                                        <van-col span="12" class="txt_blod" style="text-align:right">
                                            <van-button round type="primary" @click="setlleClick(item)" size="mini"
                                                style="width:70px">结算</van-button>
                                        </van-col>
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod">
                                            <span
                                                style="font-weight: 700;font-style: normal;font-size: 11px;color: #D0753B;">
                                                预订时间:{{ formatDate(item.book_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                                        </van-col>
                                        <van-col span="12" class="txt_blod" style="text-align:right">
                                            <span
                                                style="font-weight: 650;font-style: normal;font-size: 11px;color: #D0753B;"></span>
                                        </van-col>
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod" style="font-size:12px;">
                                            <span style="line-height:37px"> 上游信息：{{item.upstream_info}}</span>
                                        </van-col>
                                    </van-row>
                                </div>
                            </van-list>
                        </div>
                    </van-pull-refresh>
                </van-tab>
                <van-tab title="已结算">
                    <van-pull-refresh v-model="loadingFinishedDown" @refresh="refreshFinished" loading-text=" "
                        class="van-pull-refresh-2">
                        <div>
                            <van-list @load="getFinishedList" v-model:loading="loadingFinish" :finished="Finished"
                                finished-text="没有更多了" class="van-list-2">
                                <div class="home_card" v-for=" item in listFinish" :key="item">
                                    <div style="clear:both;"></div>
                                    <van-row>
                                        <van-col span="12" class="txt_blod">
                                            <a href="#" @click="showSplitOrderDetail(item)"><span
                                                style="font-size:9px;color:#BFBFBF"   v-if="item.is_split">点击查看拆分订单</span></a>
                                        </van-col>
                                        <van-col span="12" class="txt_blod">
                                            <span style="color:red;" v-if="item.trade_type == 'buy'">{{ item.kind_name
                                            }} - 买料</span>
                                            <span style="color:green;" v-if="item.trade_type == 'sell'">{{
                                                    item.kind_name
                                            }} - 卖料</span>
                                        </van-col>
                                        <!-- <van-col span="12" class="txt_blod">{{ item.kind_name }}</van-col> -->
                                        <!-- <van-col span="12" class="txt_blod" style="text-align:right">
                                            <span style="color:red;" v-if="item.trade_type == 'buy'">买料</span>
                                            <span style="color:green;" v-if="item.trade_type == 'sell'">卖料</span>
                                        </van-col> -->
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod card_buy">预订:{{ item.book_price }}（{{ item.upstream_price }}）</van-col>
                                        <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                                            <span style="color:red;" v-if="item.book_price <= item.finish_price">
                                            结算:{{item.finish_price}}（{{item.upstream_finish_price}}）</span>
                                            <span style="color:green;" v-if="item.book_price > item.finish_price">
                                            结算:{{item.finish_price}}（{{item.upstream_finish_price}}）</span>
                                        </van-col>
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod" style="font-size:12px;">
                                            <span style="line-height:37px"> {{ item.weight }}g,定金 {{ item.deposit }},手续费
                                                {{ item.fee_price }}</span>
                                        </van-col>
                                        <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                                            <span style="color:red;" v-if="item.profit >= 1">
                                            盈利:{{item.profit}}（{{item.upstream_profit}}）</span>
                                            <span style="color:green;" v-if="item.profit < 1">
                                            盈利:{{item.profit}}（{{item.upstream_profit}}）</span>
                                        </van-col>
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod" style="text-align:right">
                                            <van-button  v-if="item.is_split == false" round type="primary" @click="rollbackSetlleClick(item)"
                                                size="mini" style="width:140px">撤销结算</van-button>
                                        </van-col>
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod">
                                            <span
                                                style="font-weight: 700;font-style: normal;font-size: 11px;color: #D0753B;">
                                                预订时间:{{ formatDate(item.book_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                                        </van-col>
                                        <van-col span="12" class="txt_blod" style="text-align:right">
                                            <span
                                                style="font-weight: 650;font-style: normal;font-size: 11px;color: #D0753B;">
                                                结算时间:{{ formatDate(item.finish_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                                        </van-col>
                                    </van-row>
                                    <van-row>
                                        <van-col span="12" class="txt_blod" style="font-size:12px;">
                                            <span style="line-height:37px"> 上游信息：{{item.upstream_info}}</span>
                                        </van-col>
                                    </van-row>
                                </div>
                            </van-list>
                        </div>
                    </van-pull-refresh>
                </van-tab>
            </van-tabs>

            <settle-order-detail v-if="showSettle" @close="closeSettle" :orderData="optOrder" />
            <settle-order-rollback v-if="showSeOrRo" @close="closeSeOrRo" :orderData="optOrder" />
            <edit-user @refresh="closeSettle" v-if="showEdit" :user="optUser" />
            <user-wallet @refresh="closeSettle" v-if="showWallet" :user="optUser" />
            <split-order v-if="showSplitOrder" @close="closeSplitOrder" :order="optOrder" />
            <edit-upstream v-if="showEditUpstream" @refresh="closeEditUpstream" :flash_id="optOrder.flash_id" />
            <export-order v-if="showExportOrder" @close="closeExportOrder" :type="user.id" />
        </div>
    </van-popup>
</template>

<script>
// import { timeout } from 'q'
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import { listUserOrder } from '../../service/order.js'
import settleOrderDetail from '../home/SettleOrderDetail.vue';
import settleOrderRollback from './SettleUserOrderRollback.vue';
import EditUser from './EditUser.vue';
import UserWallet from './Wallet.vue';
import editUpstream from '../home/EditUpstream.vue';
import { userInfo } from '../../service/user.js';
import { formatDate } from '@/utils'
import splitOrder from '../home/SplitOrder.vue'
import ExportOrder from '../home/ExportOrder.vue';
export default {
    components: {
        basePopHeader,
        EditUser,
        UserWallet,
        settleOrderDetail,
        settleOrderRollback,
        editUpstream,
        ExportOrder,
        splitOrder
    },
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                    id: 0,
                    user_name: '',
                    kind_name: '',
                    total_weight: '',
                    book_price: '',
                    total_deposit: '',
                    created_at: ''
                }
            }
        }
    },
    data() {
        return {
            title: '用户管理',
            isShow: false,
            showWallet: false,
            showEdit: false,
            optUser: Object.assign({}, this.user),
            showExportOrder: false,//显示导出订单
            list: [],
            listFinish: [],
            query: {
                id: this.user.id,
                is_finish: "false",
                page_size: 10,
                page_num: 0
            },
            queryFinish: {
                id: this.user.id,
                is_finish: "true",
                page_size: 10,
                page_num: 0
            },
            loadingDown: false,
            loadingFinishedDown: false,
            loadingNoFinish: false,//未结算上滑加载中
            loadingFinished: false,//已结算上滑加载中
            noFinished: false, //为结算上滑是否完成
            Finished: false, //已结算上滑是否完成
            finishedPush: false,
            showSettle: false, //结算弹窗是否显示
            showSeOrRo: false, //撤销结算弹窗是否显示
            showEditUpstream: false,//显示修改上游价弹窗 
            showSplitOrder:false,//拆分订单列表展示    
            optOrder: {}, //结算弹窗数据
            active: 0,
            formatDate
        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
        this.getUserInfo();
        // console.log(this.user)
    },
    methods: {
        showWalletClick() {
            this.showWallet = true
        },
        showSplitOrderDetail(order) {
            this.optOrder = order
            this.showSplitOrder = true
        },
        editUser() {
            this.showEdit = true
        },
        getUserInfo() {
            userInfo({ id: this.optUser.id }).then(rsp => {
                this.optUser = rsp.data
            })
        },
        refresh() {
            this.query.page_num = 0
            this.noFinished = false
            this.list = []
            this.getList()
        },
        refreshFinished() {
            this.queryFinish.page_num = 0
            this.Finished = false
            this.listFinish = []
            this.getFinishedList()
        },
        closeExportOrder() {
            this.showExportOrder = false
        },
        showExportOrderClick() {
            this.showExportOrder = true
        },
        //已结算
        getFinishedList() {
            // let that = this
            this.loadingFinish = true
            this.loadingFinishedDown = true
            listUserOrder(this.queryFinish).then((rsp) => {
                this.loadingFinish = false
                this.loadingFinishedDown = false
                this.queryFinish.page_num++
                //已结算
                if (rsp.data.data == null) {
                    this.Finished = true
                    return;
                }
                for (let i = 0; i < rsp.data.data.length; i++) {
                    this.listFinish.push(rsp.data.data[i])
                }
                if (rsp.data.count <= this.listFinish.length) {
                    this.Finished = true
                }
            })
        },
        //未结算
        getList() {
            this.loadingNoFinish = true
            this.loadingDown = true
            // let that = this
            listUserOrder(this.query).then((rsp) => {
                this.loadingNoFinish = false
                this.loadingDown = false
                this.query.page_num++
                if (rsp.data.data == null) {
                    this.noFinished = true
                    return;
                }
                for (let i = 0; i < rsp.data.data.length; i++) {
                    this.list.push(rsp.data.data[i])
                }
                if (rsp.data.count <= this.list.length) {
                    this.noFinished = true
                }
            })
        },
        tabChange() {
            if (this.active == 1) {
                this.refreshFinished()
            }
            if (this.active == 0) {
                this.refresh()
            }
        },
        closeSettle(isRefresh, user) {
            this.showSettle = false
            this.showEdit = false
            this.showWallet = false
            if (user) {
                // console.log(this.$props.set('user', user))
                this.optUser = user
                // this.props['user'] = user
            }
            if (isRefresh) {
                this.getUserInfo()
                this.tabChange()
            }
        },
        closeSplitOrder() {
            this.getUserInfo()
            this.refresh()
            this.refreshFinished()
            setTimeout(() => {
                this.showSplitOrder = false
            }, 500);
        },
        closeSeOrRo(isRefresh) {
            this.showSeOrRo = false
            if (isRefresh) {
                this.tabChange()
            }
        },
        closeEditUpstream(isRefresh) {
            this.showEditUpstream = false
            if (isRefresh) {
                this.tabChange()
            }
        },
        setlleClick(order) {
            this.optOrder = order
            this.showSettle = true
            // console.log(order)
        },
        rollbackSetlleClick(order) {
            this.optOrder = order
            this.showSeOrRo = true
            // console.log(order)
        },
        editUpstreamClick(order) {
            this.optOrder = order
            this.showEditUpstream = true
            // console.log(order)
        },
        closed(isGetData) {
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh', isGetData); }, 300)
        }
    }
}
</script>

<style lang="less">
.userinfo-content {
    height: calc(100vh - 80px) !important;
    overflow: auto !important;
    overflow: hidden !important;
    background-color: #f9f9f9;
    margin-top: 5px;
    padding-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 10px;


    .content-card {
        // height: 100%;
        // width: 100%;
        background-color: #d0753b;
        // margin-top: 5px;
        box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
        border-radius: 5px;
        font-size: 10px;
        font-weight: 600;
        padding: 5px;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
        // padding-left: 15px;
        // padding-right: 15px;
    }

    /* //pull 和 list 冲突解决 */
    .van-pull-refresh-2 {
        height: calc(100vh - 320px) !important;
        overflow: auto !important;
    }

    .van-list-2 {
        height: auto !important;
    }

    .van-tabs {
        // height: 100%;
        // display: inline;
        // margin-bottom: -400px;

        .van-tabs__content {
            // height: 100%;
            // padding-top: 25px;
            padding-left: 5px;
            padding-right: 5px;
            background-color: rgba(249, 249, 249, 1);
        }


    }

    .home_card {
        background-color: #fff;
        box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
        font-size: 13px;
        padding-left: 15px;
        padding-right: 15px;
        margin-top: 30px;
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

    .van-list {
        padding-left: 5px;
        padding-right: 5px;
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