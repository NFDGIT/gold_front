<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <van-sticky>
            <base-pop-header :title="title" :event="editUser" eventIco="edit" />
        </van-sticky>
        <div class="order-detail-content">
            <van-list>
                <van-cell v-for="item in list" :key="item">
                 <van-row>
                    </van-row>
                    <van-row>
                        <van-col span="12" class="txt_blod">
                            <span style="color:red;" v-if="item.trade_type == 'buy'">{{ item.kind_name }} - 买料</span>
                            <span style="color:green;" v-if="item.trade_type == 'sell'">{{ item.kind_name }} - 卖料</span>
                        </van-col>                       
                        <van-col span="12" class="txt_blod" style="text-align:right">
                            {{ item.user_name }}
                        </van-col>
                    </van-row>
                    <van-row>
                        <van-col span="12" class="txt_blod card_buy">预订:{{ item.book_price }}</van-col>
                        <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                            <span style="color:red;" v-if="item.book_price <= item.finish_price">结算:{{
                                    item.finish_price
                            }}</span>
                            <span style="color:green;" v-if="item.book_price > item.finish_price">结算:{{
                                    item.finish_price
                            }}</span>
                        </van-col>
                    </van-row>
                    <van-row>
                        <van-col span="12" class="txt_blod" style="font-size:12px;">
                            <span style="line-height:37px"> {{ item.weight }}g,定金 {{ item.deposit}},手续费 {{ item.fee_price}}</span>
                        </van-col>
                        <van-col span="12" class="txt_blod card_sale" style="text-align:right">
                            <span style="color:red;" v-if="item.profit >= 1 && item.is_finish">盈利:{{ item.profit}}</span>
                            <span style="color:green;" v-if="item.profit < 1 && item.is_finish">盈利:{{ item.profit}}</span>
                            <span style="color:red;" v-if="item.profit_predict >= 1 && !item.is_finish">差价:{{ item.profit_predict}}</span>
                            <span style="color:green;" v-if="item.profit_predict < 1 && !item.is_finish">差价:{{ item.profit_predict}}</span>
                        </van-col>
                    </van-row>
                    <van-row>
                        <van-col span="12" class="txt_blod">
                            <span style="font-weight: 700;font-style: normal;font-size: 11px;color: #D0753B;">
                                预订时间:{{ formatDate(item.book_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                        </van-col>
                        <van-col span="12" class="txt_blod" style="text-align:right">
                            <span style="font-weight: 700;font-style: normal;font-size: 11px;color: #D0753B;" v-if="item.is_finish">
                                结算时间:{{ formatDate(item.finish_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                        </van-col>
                    </van-row>
                </van-cell>
            </van-list>
        </div>
    </van-popup>
</template>

<script>
// import { timeout } from 'q'
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import { listOrderDetail } from '../../service/order.js'
import { formatDate } from '@/utils'
// import { Toast } from 'vant'
export default {
    components: {
        basePopHeader,
    },
    props: {
        order: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            title: '订单详情',
            isShow: false,
            query: {
                flash_id: this.order.flash_id
            },
            list: [],
            formatDate
        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
        this.getlistOrderDetail()
    },
    methods: {
        getlistOrderDetail() {
            listOrderDetail(this.query).then(res => {
                this.list = res.data
            })
        },
        closed(isGetData) {
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh', isGetData); }, 300)
        }
    }
}
</script>

<style lang="less">
.order-detail-content {
    height: calc(100vh - 40px) !important;
    overflow: auto !important;
    overflow: hidden !important;
    background-color: #f9f9f9;

    .bill-list {
        padding: 5px;
    }
}
</style>