<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <van-sticky>
            <!-- <base-pop-header title="订单列表" :event="onClick" eventIco="edit" /> -->
            <base-pop-header title="订单列表" eventText="导出" :event="showExportOrderClick" />
        </van-sticky>
        <van-tabs v-model:active="active" @change="tabChange" line-width="0px" line-height="0" swipeable="true"
            title-style="text-align:center">
            <van-tab title="未结算">
                <van-pull-refresh v-model="loadingDown" @refresh="refresh" loading-text=" " class="van-pull-refresh-2">
                    <div style="overflow: hidden;">
                        <van-list @load="getList" v-model:loading="loadingNoFinish" :finished="noFinished"
                            class="van-list-2" finished-text="没有更多了">
                            <div class="home_card" v-for=" item in list" :key="item">
                                <div style="clear:both;"></div>
                                <van-row>
                                    <van-col span="12" class="txt_blod">
                                        <a href="#" @click="showOrderDetailClick(item)"><span
                                                style="font-size:9px;color:#BFBFBF">点击查看详情</span></a>
                                    </van-col>
                                    <van-col span="12" class="txt_blod" style="text-align:right">
                                        <span style="color:red;" v-if="item.trade_type == 'buy'">{{ item.kind_name }} -
                                            买料</span>
                                        <span style="color:green;" v-if="item.trade_type == 'sell'">{{ item.kind_name }}
                                            - 卖料</span>
                                    </van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod card_buy">
                                        预订价:{{ item.book_price }}（{{item.upstream_price}}）
                                    </van-col>
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
                                        <span style="line-height:37px"> {{ item.total_weight }}g,定金 {{
                                                item.total_deposit
                                        }}</span>
                                    </van-col>
                                    <!-- <van-col span="12" class="txt_blod" style="text-align:right">
                                        <van-button round type="primary" @click="setlleClick(item)" size="mini"
                                            style="width:70px">结算</van-button>
                                    </van-col> -->
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod">
                                        <van-button round type="primary" @click="rollbackCreateClick(item)" size="mini"
                                            style="width:100px">撤销预订</van-button>
                                    </van-col>
                                    <van-col span="12" class="txt_blod" style="text-align:right;">
                                        <van-button round type="primary" @click="editUpstreamClick(item)" size="mini"
                                            style="width:120px">修改上游价格</van-button>
                                    </van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod">
                                        <span
                                            style="font-weight: 700;font-style: normal;font-size: 11px;color: #D0753B;">
                                            预订时间:<br />{{ formatDate(item.book_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                                    </van-col>
                                    <van-col span="12" class="txt_blod" style="text-align:right">
                                        <span
                                            style="font-weight: 650;font-style: normal;font-size: 11px;color: #D0753B;">
                                        </span>
                                    </van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod" style="font-size:12px;">
                                        <span style="line-height:37px"> {{ item.user_group }}</span>
                                    </van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod" style="font-size:12px;">
                                        <span style="line-height:37px"> 上游信息：{{item.upstream_info}}</span>
                                        <van-button round type="primary" @click="editUpstreamInfoClick(item)" size="mini"
                                            >修改上游信息</van-button>
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
                                    <van-col span="12" class="txt_blod"><a href="#"
                                            @click="showOrderDetailClick(item)"><span
                                                style="font-size:9px;color:#BFBFBF">点击查看详情</span></a></van-col>
                                    <van-col span="12" class="txt_blod" style="text-align:right">
                                        <span style="color:red;" v-if="item.trade_type == 'buy'">{{ item.kind_name }} -
                                            买料</span>
                                        <span style="color:green;" v-if="item.trade_type == 'sell'">{{ item.kind_name }}
                                            - 卖料</span>
                                    </van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod card_buy">预订价:{{ item.book_price }}（{{ item.upstream_price }}）</van-col>
                                    <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                                    结算价:{{item.finish_price}}（{{item.upstream_finish_price}}）</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod" style="font-size:12px;">
                                        <span style="line-height:37px"> {{ item.total_weight }}g,定金 {{
                                                item.total_deposit
                                        }},手续费 {{ item.total_fee_price }}</span>
                                    </van-col>
                                    <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                                        <span style="color:red;" v-if="item.total_profit >= 1">
                                        盈利:{{ item.total_profit}}（{{item.upstream_profit}}）</span>
                                        <span style="color:green;" v-if="item.total_profit < 1">
                                        盈利:{{ item.total_profit}}（{{item.upstream_profit}}）</span>
                                    </van-col>
                                </van-row>
                                <!-- <van-row>
                                    <van-col span="12" class="txt_blod">
                                        <van-button round type="primary" @click="rollbackSetlleClick(item)" size="mini"
                                            style="width:100px">撤销结算</van-button>
                                    </van-col>
                                </van-row> -->
                                <van-row>
                                    <van-col span="12" class="txt_blod">
                                        <span
                                            style="font-weight: 700;font-style: normal;font-size: 11px;color: #D0753B;">
                                            预订时间:<br />{{ formatDate(item.book_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                                    </van-col>
                                    <van-col span="12" class="txt_blod" style="text-align:right">
                                        <span
                                            style="font-weight: 650;font-style: normal;font-size: 11px;color: #D0753B;">
                                            结算时间<br />{{ formatDate(item.finish_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                                    </van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod" style="font-size:12px;">
                                        <span style="line-height:37px"> {{ item.user_group }}</span>
                                    </van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="12" class="txt_blod" style="font-size:12px;">
                                        <span style="line-height:37px"> 上游信息：{{item.upstream_info}}</span>
                                        <van-button round type="primary" @click="editUpstreamInfoClick(item)" size="mini"
                                            >修改上游信息</van-button>
                                    </van-col>
                                </van-row>
                            </div>
                        </van-list>
                    </div>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
        <settle-order v-if="showSettle" @close="closeSettle" :orderData="optOrder" />
        <create-order-rollback v-if="showCrOrRo" @close="closeCrOrRo" :orderData="optOrder" />
        <settle-order-rollback v-if="showSeOrRo" @close="closeSeOrRo" :orderData="optOrder" />
        <export-order v-if="showExportOrder" @close="closeExportOrder" />
        <order-detail v-if="showOrderDetail" @close="closeOrderDetail" :order="optOrder" />
        <edit-upstream v-if="showEditUpstream" @refresh="closeEditUpstream" :flash_id="optOrder.flash_id" />
        <edit-upstream-info v-if="showEditUpstreamInfo" @refresh="closeEditUpstreamInfo" :flash_id="optOrder.flash_id" />
    </van-popup>
</template>

<script>
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import { listOrder } from '../../service/order.js'
import settleOrder from './SettleOrder.vue';
import createOrderRollback from './CreateOrderRollback.vue';
import settleOrderRollback from './SettleOrderRollback.vue';
import editUpstream from './EditUpstream.vue';
import editUpstreamInfo from './EditUpstreamInfo.vue';
import OrderDetail from './OrderDetail.vue'
import ExportOrder from './ExportOrder.vue';
import { formatDate } from '@/utils'
import XLSX from 'xlsx'
import EditUpstream from './EditUpstream.vue';
export default {
    components: {
        basePopHeader,
        settleOrder,
        OrderDetail,
        createOrderRollback,
        settleOrderRollback,
        editUpstream,
        editUpstreamInfo,
        ExportOrder,
        EditUpstream
    },
    data() {
        return {
            list: [],
            listFinish: [],
            query: {
                is_finish: "false",
                page_size: 10,
                page_num: 0
            },
            queryFinish: {
                is_finish: "true",
                page_size: 10,
                page_num: 0
            },
            isShow: false,
            loadingDown: false,
            loadingFinishedDown: false,
            loadingNoFinish: false,//未结算上滑加载中
            loadingFinished: false,//已结算上滑加载中
            noFinished: false, //为结算上滑是否完成
            Finished: false, //已结算上滑是否完成
            finishedPush: false,
            showSettle: false, //结算弹窗是否显示
            showCrOrRo: false, //撤销预订订单弹窗是否显示
            showSeOrRo: false, //撤销结算订单弹窗是否显示
            showOrderDetail: false,//是否显示订单详情窗口
            optOrder: {}, //结算弹窗数据
            showEditUpstream: false,//显示修改上游价格弹窗
            showEditUpstreamInfo:false,//显示修改上游信息弹窗
            showExportOrder: false, //导出订单弹窗
            active: 0,
            formatDate
        }
    },
    mounted: function () {
        // this.getList()
    },
    created: function () {
        nextTick(() => { this.isShow = true; })
    },
    methods: {
        onClick() {
            alert("测试事件")
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
        //已结算
        getFinishedList() {
            // let that = this
            this.loadingFinish = true
            this.loadingFinishedDown = true
            listOrder(this.queryFinish).then((rsp) => {
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
            listOrder(this.query).then((rsp) => {
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
        closed(isRefresh) {
            this.$emit('close', isRefresh)
        },
        tabChange() {
            if (this.active == 1) {
                this.refreshFinished()
            }
            if (this.active == 0) {
                this.refresh()
            }
        },
        closeSettle(isRefresh) {
            this.showSettle = false
            if (isRefresh) {
                this.tabChange()
            }
        },
        closeCrOrRo(isRefresh) {
            this.showCrOrRo = false
            if (isRefresh) {
                this.tabChange()
            }
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
        closeEditUpstreamInfo(isRefresh) {
            this.showEditUpstreamInfo = false
            if (isRefresh) {
                this.tabChange()
            }
        },
        exportExcel() {
            this.$toast("导出中...")
            if (this.active == 0) {
                //导出未结算
                let exportQuery = {
                    is_finish: "false",
                    page_size: 99999,
                    page_num: 0
                }
                listOrder(exportQuery).then((rsp) => {
                    // console.log(this.exportExcelModel(rsp.data.data))
                    const data = XLSX.utils.json_to_sheet(this.exportExcelModel(rsp.data.data))
                    const wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
                    XLSX.writeFile(wb, '未结算数据.xlsx')
                })
            } else {
                //导出已结算
                //导出未结算
                let exportQuery = {
                    is_finish: "true",
                    page_size: 99999,
                    page_num: 0
                }
                listOrder(exportQuery).then((rsp) => {
                    // console.log(this.exportExcelModel(rsp.data.data))
                    const data = XLSX.utils.json_to_sheet(this.exportExcelModel(rsp.data.data))
                    const wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
                    XLSX.writeFile(wb, '已结算数据.xlsx')
                })
            }
            setTimeout(() => {
                this.$toast("导出完成")
            }, 500)
        },
        exportExcelModel(data) {
            let modelData = []
            for (let i = 0; i < data.length; i++) {
                let model = {}
                model["名称"] = data[i].kind_name
                model["订单号"] = data[i].flash_id
                model["订单类型"] = data[i].trade_type
                model["定价"] = data[i].book_price
                model["结算价"] = data[i].finish_price
                model["盈利"] = data[i].total_profit
                model["差价"] = data[i].profit_predict
                model["是否结算"] = data[i].is_finish ? '已结算' : '未结算'
                model["重量"] = data[i].total_weight
                model["费率"] = data[i].fee
                model["总金额"] = data[i].total_deposit
                model["预订时间"] = formatDate(data[i].book_at, 'yyyy-MM-DD HH:mm:ss')
                modelData.push(model)
            }
            return modelData
        },
        showOrderDetailClick(order) {
            this.optOrder = order
            this.showOrderDetail = true
        },
        closeOrderDetail() {
            setTimeout(() => {
                this.showOrderDetail = false
            }, 500);
        },
        setlleClick(order) {
            this.optOrder = order
            this.showSettle = true
            // console.log(order)
        },
        rollbackCreateClick(order) {
            this.optOrder = order
            this.showCrOrRo = true
            // console.log(order)
        },
        editUpstreamClick(order) {
            this.optOrder = order
            this.showEditUpstream = true
            // console.log(order)
        },
        editUpstreamInfoClick(order) {
            this.optOrder = order
            this.showEditUpstreamInfo = true
            // console.log(order)
        },
        rollbackSetlleClick(order) {
            this.optOrder = order
            this.showSeOrRo = true
            // console.log(order)
        },
        showExportOrderClick() {
            this.showExportOrder = true
        },
        closeExportOrder() {
            setTimeout(() => {
                this.showExportOrder = false
            }, 500);
        }
    }
}
</script>

<style lang="less">
/* //pull 和 list 冲突解决 */
.van-pull-refresh-2 {
    height: calc(100vh - 83px) !important;
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
    padding-top: 2px;
    padding-bottom: 2px;
}

.card_buy {
    color: #07B884;
    font-weight: 500;
    font-size: 15px;
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
</style>