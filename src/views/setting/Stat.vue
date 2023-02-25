<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <van-sticky>
            <base-pop-header :title="title" />
        </van-sticky>
        <div class="stat-content">
            <div class="stat-list">
                <van-tabs v-model:active="active" swipeable="true" line-width="0px" line-height="0">
                    <van-tab title="用户统计">
                        <van-pull-refresh v-model="loadingDown" @refresh="onRefresh">
                            <van-list v-model:loading="loading" @load="getList" :finished="finished"
                                finished-text="没有更多了">
                                <van-cell-group inset>
                                    <van-field v-model="query.user_name" name="user_name" label="用户名"
                                        placeholder="输入用户名" />
                                    <van-field v-model="query.date" is-link readonly name="date" label="时间选择"
                                        placeholder="点击选择时间" @click="showPicker = true" />

                                </van-cell-group>
                                <div style="margin: 16px; text-align:center;">
                                    <van-button round inline-block type="primary" native-type="submit" style="width:90%"
                                        @click="onRefresh">
                                        查询
                                    </van-button>
                                </div>
                                <div v-for=" item in list" :key="item" class="content-card">
                                    <van-cell title="用户名" :value="item.user_name" />
                                    <van-cell title="总克重" :value="item.sum_weight" />
                                    <van-cell title="总利润" :value="item.sum_profit" />
                                    <van-cell title="总差价" :value="item.sum_upstream_profit-item.sum_profit" />
                                    <van-cell title="类型" :value="item.type_name" />
                                </div>
                            </van-list>
                        </van-pull-refresh>
                    </van-tab>
                    <van-tab title="代理统计">
                        <van-pull-refresh v-model="loadingAgentDown" @refresh="onAgentRefresh">
                            <van-list v-model:loading="loadingAgent" @load="getAgentList" :finished="finishedAgent"
                                finished-text="没有更多了">
                                <van-cell-group inset>
                                    <van-field v-model="queryAgent.date" is-link readonly name="date" label="时间选择"
                                        placeholder="点击选择时间" @click="showPickerAgent = true" />

                                </van-cell-group>
                                <div v-for=" item in listAgent" :key="item" class="content-card">
                                    <van-cell title="代理" :value="item.agent_name" />
                                    <van-cell title="当日总克重" :value="item.date_weight" />
                                    <van-cell title="当日总利润" :value="item.date_profit" />
                                    <van-cell title="当日总差价" :value="item.date_upstream_profit-item.date_profit" />
                                    <van-cell title="当月总克重" :value="item.now_month_weight" />
                                    <van-cell title="当月总利润" :value="item.now_month_profit" />
                                    <van-cell title="当月总差价" :value="item.now_month_upstream_profit-item.now_month_profit" />
                                    <van-cell title="上月总克重" :value="item.last_month_weight" />
                                    <van-cell title="上月总利润" :value="item.last_month_profit" />
                                    <van-cell title="上月总差价" :value="item.last_month_upstream_profit-item.last_month_profit" />
                                </div>
                            </van-list>
                        </van-pull-refresh>
                    </van-tab>
                    <van-tab title="平台统计">
                        <van-pull-refresh v-model="loadingSysDown" @refresh="onSysRefresh">
                            <van-list v-model:loading="loadingSys" @load="getSysList" :finished="finishedSys"
                                finished-text="没有更多了">
                                <van-cell-group inset>
                                    <van-field v-model="querySys.date" is-link readonly name="date" label="时间选择"
                                        placeholder="点击选择时间" @click="showPickerSys = true" />

                                </van-cell-group>
                                <div v-for=" item in listSys" :key="item" class="content-card">
                                    <van-cell title="类型" :value="item.type_name" />
                                    <van-cell title="当日总克重" :value="item.date_weight" />
                                    <van-cell title="当日总利润" :value="item.date_profit" />
                                    <van-cell title="当日总差价" :value="item.date_upstream_profit-item.date_profit" />
                                    <van-cell title="当月总克重" :value="item.now_month_weight" />
                                    <van-cell title="当月总利润" :value="item.now_month_profit" />
                                    <van-cell title="当月总差价" :value="item.now_month_upstream_profit-item.now_month_profit" />
                                    <van-cell title="上月总克重" :value="item.last_month_weight" />
                                    <van-cell title="上月总利润" :value="item.last_month_profit" />
                                    <van-cell title="上月总差价" :value="item.last_month_upstream_profit-item.last_month_profit" />
                                </div>
                            </van-list>
                        </van-pull-refresh>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </van-popup>
    <!-- <van-popup v-model:show="" position="bottom">
        <van-datetime-picker type="time" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup> -->
    <van-calendar v-model:show="showPicker" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
    <van-calendar v-model:show="showPickerSys" :min-date="minDate" :max-date="maxDate" @confirm="onConfirmSys" />
</template>

<script>
// import { timeout } from 'q'
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import { userStat, sysStat,agentStat } from '../../service/system.js'
import { formatDate } from '../../utils'
import moment from 'moment'
// import { Toast } from 'vant'
export default {
    components: {
        basePopHeader,
    },
    props: {},
    data() {
        return {
            title: '统计',
            isShow: false,
            query: {
                user_name: '',
                date: formatDate(new Date(), 'yyyy-MM-DD'),
                page_size: 10,
                page_num: 0
            },
            list: [],
            loadingDown: false,
            loading: false,
            finished: false,
            showPicker: false,
            minDate: moment(new Date()).subtract(1, 'months').toDate(),
            maxDate: new Date(),
            //平台查询数据
            showPickerSys: false,
            querySys: {
                date: formatDate(new Date(), 'yyyy-MM-DD'),
            },
            listSys: [],
            loadingSysDown: false,
            loadingSys: false,
            finishedSys: false,
            //平台查询数据
            showPickerAgent: false,
            queryAgent: {
                date: formatDate(new Date(), 'yyyy-MM-DD'),
            },
            listAgent: [],
            loadingAgentDown: false,
            loadingAgent: false,
            finishedAgent: false,
            formatDate
        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
        // this.minDate = moment(new Date()).subtract(1, 'months').toDate()
        // console.log(this.minDate)
    },
    methods: {
        getList() {
            this.loading = true
            userStat(this.query).then(res => {
                if (res.data.count <= 0 || res.data.data == null) {
                    this.finished = true
                    this.loading = false
                    return
                }
                for (let i = 0; i < res.data.data.length; i++) {
                    this.list.push(res.data.data[i])
                }
                if (res.data.count <= this.list.length) {
                    this.finished = true
                }
                this.query.page_num++;
                this.loading = false
            })
        },
        onRefresh() {
            this.query.page_num = 0
            this.list = []
            this.getList()
            this.loadingDown = false
        },
        getSysList() {
            this.loadingSys = true
            sysStat(this.querySys).then(res => {
                if (res.data == null || res.data.length <= 0) {
                    this.finishedSys = true
                    this.loadingSys = false
                    return
                }
                for (let i = 0; i < res.data.length; i++) {
                    this.listSys.push(res.data[i])
                }
                // if (res.data.count <= this.list.length) {

                // }
                this.finishedSys = true
                this.querySys.page_num++;
                this.loadingSys = false
            })
        },
         getAgentList() {
            this.loadingAgent = true
            agentStat(this.queryAgent).then(res => {
                if (res.data == null || res.data.length <= 0) {
                    this.finishedAgent = true
                    this.loadingAgent = false
                    return
                }
                for (let i = 0; i < res.data.length; i++) {
                    this.listAgent.push(res.data[i])
                }
                // if (res.data.count <= this.list.length) {

                // }
                this.finishedAgent = true
                this.queryAgent.page_num++;
                this.loadingAgent = false
            })
        },
        onSysRefresh() {
            this.querySys.page_num = 0
            this.listSys = []
            this.getSysList()
            this.loadingSysDown = false
        },
        onAgentRefresh() {
            this.queryAgent.page_num = 0
            this.listAgent = []
            this.getAgentList()
            this.loadingAgentDown = false
        },
        onConfirm(value) {
            this.query.date = formatDate(value, "yyyy-MM-DD");
            this.showPicker = false;
            this.onRefresh();
        },
        onConfirmSys(value) {
            this.querySys.date = formatDate(value, "yyyy-MM-DD");
            this.showPickerSys = false;
            this.onSysRefresh();
        },
        onConfirmAgent(value) {
            this.queryAgent.date = formatDate(value, "yyyy-MM-DD");
            this.showPickerAgent = false;
            this.onAgentRefresh();
        },
        closed() {
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh'); }, 300)
        }
    }
}
</script>

<style lang="less">
.stat-content {
    height: calc(100vh - 40px) !important;
    overflow: auto !important;
    // overflow: hidden !important;
    background-color: #f9f9f9;

    .stat-list {
        padding: 5px;
    }

    .content-card {
        // height: 100%;
        // width: 100%;
        background-color: #ffffff;
        margin-top: 15px;
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
}
</style>