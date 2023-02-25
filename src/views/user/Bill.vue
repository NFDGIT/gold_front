<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <van-sticky>
            <base-pop-header :title="title" :event="editUser" eventIco="edit" />
        </van-sticky>
        <div class="bill-content">
            <!-- <van-tabs v-model:active="active" shrink>
                <van-tab title="全部" class="bill-list"></van-tab>
                <van-tab title="订单收入" class="bill-list"></van-tab>
                <van-tab title="回款" class="bill-list"></van-tab>
                <van-tab title="充值" class="bill-list"></van-tab>
                <van-tab title="预定" class="bill-list"></van-tab>
            </van-tabs> -->
            <div class="bill-list">
                <van-pull-refresh v-model="loadingDown" @refresh="onRefresh">
                    <van-list v-model:loading="loading" @load="getBillList" :finished="finished" finished-text="没有更多了">
                        <van-cell v-for=" item in list" :key="item">
                            <van-row>
                                <van-col span="12" class="txt_blod">
                                    <span style="font-weight: 700;font-style: normal;font-size: 16px;">
                                        {{ formatDate(item.created_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8" style="font-size: 16px;">
                                    <span v-if="item.amount >= 0" style="color:red;">金额: +{{ item.amount
                                    }}</span>
                                    <span v-if="item.amount <= 0" style="color:green;">金额: -{{ item.amount
                                    }}</span>
                                </van-col>
                                <van-col span="16" style="text-align: right;padding-right: 10px;">余额:{{ item.balance }}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8" style="font-size: 16px;">{{ item.flash_id }}</van-col>
                                <van-col span="16" style="text-align: right;padding-right: 10px;">{{ item.recharge_name
                                }}</van-col>
                            </van-row>
                        </van-cell>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
    </van-popup>
</template>

<script>
// import { timeout } from 'q'
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import { listRecharge } from '../../service/user.js'
import { formatDate } from '@/utils'
// import { Toast } from 'vant'
export default {
    components: {
        basePopHeader,
    },
    props: {
        user: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            title: '账单',
            isShow: false,
            optUser: Object.assign({}, this.user),
            query: {
                id: this.user.id,
                page_num: 0,
                page_size: 10,
            },
            list: [],
            loadingDown: false,
            loading: false,
            finished: false,
            formatDate
        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
        // console.log(this.user)
    },
    methods: {
        getBillList() {
            this.loading = true
            listRecharge(this.query).then(rsp => {
                this.query.page_num++
                this.loading = false
                if (rsp.data.data == null || rsp.data.data.length <= 0) {
                    this.finished = true
                    return
                }
                for (let i = 0; i < rsp.data.data.length; i++) {
                    this.list.push(rsp.data.data[i])
                }
                if (rsp.data.count <= this.list.length) {
                    this.loading = false
                    this.finished = true
                }
            })
        },
        onRefresh() {
            this.finished = false
            this.query.page_num = 0
            this.list = []
            this.getBillList()
            this.loadingDown = false
        },
        closed(isGetData) {
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh', isGetData); }, 300)
        }
    }
}
</script>

<style lang="less">
.bill-content {
    height: calc(100vh - 40px) !important;
    overflow: auto !important;
    // overflow: hidden !important;
    background-color: #f9f9f9;

    .bill-list {
        padding: 5px;
    }
}
</style>