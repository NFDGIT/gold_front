<template>
    <van-dialog v-model:show="isShow" title="订单结算" show-cancel-button @closed="closed(false)" @confirm="settleClick">
        <div class="settle_content">
            <div class="settle_card">
                <van-row>
                    <van-col span="8">
                        <span class="remark">类型</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <!-- <input v-model="formData.book_price"> -->
                        <span class="blod">{{ fromData.kind_name }}</span>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="remark">数量(克)</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <!-- <input v-model="formData.book_price"> -->
                        <span class="blod">{{ fromData.total_weight }}</span>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="remark">价格(豆)</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <!-- <input v-model="formData.book_price"> -->
                        <span class="blod">{{ fromData.book_price }}</span>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="remark">定金(豆)</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <!-- <input v-model="formData.book_price"> -->
                        <span class="blod">{{ fromData.total_deposit }}</span>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="remark">预定时间</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <!-- <input v-model="formData.book_price"> -->
                        <span class="blod">{{ formatDate(fromData.book_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                    </van-col>
                </van-row>

                <van-row>
                    <van-col span="8">
                        <span class="remark">录入时间:</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <span class="blod" @click="changeDateTimeClick">
                            {{ formatDate(fromData.opt_time, 'YYYY-MM-DD HH:mm:00') }}</span>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="12">
                        <span class="remark">请输入委托价格</span>
                    </van-col>
                    <van-col span="12" calss="right" style="text-align: right;padding-right: 10px;">
                        <input v-model="fromData.finish_price" @change="profitCipher" @keyup="profitCipher">
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="12">
                        <span class="remark">请输入上游结算价</span>
                    </van-col>
                    <van-col span="12" calss="right" style="text-align: right;padding-right: 10px;">
                        <input v-model="fromData.upstream_finish_price" @change="profitCipher" @keyup="profitCipher">
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="remark">差价款数额</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <!-- <input v-model="formData.book_price"> -->
                        <span class="blod" style="color:red;" v-if="fromData.profit >= 1">{{ fromData.profit }}</span>
                        <span class="blod" style="color:green;" v-if="fromData.profit < 1">{{ fromData.profit }}</span>
                    </van-col>
                </van-row>
            </div>
            <!-- <van-row style="padding-top:10px; text-align:center">
                <van-col span="12">
                    <van-button type="primary">取消</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="primary">确定</van-button>
                </van-col>
            </van-row> -->
        </div>
    </van-dialog>
    <select-date-time v-if="isShowSelectDateTime" :time="currentDate" @refresh="closeSelectTime"
        @confirm="confirmSelectDate" />
</template>

<script>
import { Toast } from 'vant';
import { nextTick } from 'vue'
import { formatDate } from '@/utils'
import { settleOrder } from '../../service/order.js'
import SelectDateTime from '@/components/SelectDateTime.vue'
import moment from 'moment';
// import { createOrder } from '../../service/order.js'
export default {
    components: {
        SelectDateTime
    },
    props: {
        orderData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isShow: false,
            isShowSelectDateTime: false,
            fromData: Object.assign(this.$props.orderData),
            formatDate: formatDate,
            currentDate: new Date(),
        }
    },
    setup() {

    },
    updated() { },
    created() {
        nextTick(() => { this.isShow = true; })
        this.fromData.finish_price = this.fromData.book_price
        this.fromData.opt_time = formatDate(this.currentDate, 'YYYY-MM-DD HH:mm:00')
        this.profitCipher()
        // console.log(this.fromData)
    },
    methods: {
        closed(isRefresh) {
            this.isShow = false;
            nextTick(() => { this.$emit("close", isRefresh) })
        },
        profitCipher() {
            this.fromData.profit = (this.fromData.finish_price * this.fromData.total_weight) - (this.fromData.book_price * this.fromData.total_weight)
        },
        settleClick() {
            settleOrder({
                flash_id: this.fromData.flash_id,
                opt_time: formatDate(this.currentDate, 'YYYY-MM-DD HH:mm:00'),
                finish_price: this.fromData.finish_price,
                upstream_finish_price: this.fromData.upstream_finish_price
            }).then(() => {
                Toast.success('结算成功');
                this.closed(true);
            })
        },
        changeDateTimeClick() {
            this.isShowSelectDateTime = true
            this.currentDate =new Date()            
        },
        closeSelectTime() {
            this.isShowSelectDateTime = false;
        },
        confirmSelectDate(date) {
            // console.log('ff')
            this.currentDate = moment(date).toDate()

            this.fromData.opt_time = formatDate(date, 'YYYY-MM-DD HH:mm:00')
            // console.log("--------------------" + this.fromData.opt_time) + "----------->" + date
            this.isShowSelectDateTime = false;
        }
    }
}
</script>

<style lang="less">
// .header {
//     height: 15px;
// }

.settle_content {
    // padding-left: 5px;
    // padding-right: 5px;
    // min-height: 90%;
    padding-left: 0px;
    padding-top: 0px;
    padding-right: 0px;
    background-color: rgba(249, 249, 249, 1);
}

.settle_card {
    background-color: #fff;
    box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
    font-size: 13px;
    // padding-left: 10px;
    // padding-top: 10px;
    // padding-right: 15px;
    // margin-top: 10px;

    .van-row .van-col {
        padding-left: 5px;
        padding-right: 0;
        padding-top: 7px;
        padding-bottom: 10px;
    }

    input {
        width: 80px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding-left: 10px;
        padding-right: 10px;
        // padding-top: 5px;
        // padding-bottom: 5px;
        font-size: 13px;
        color: #333;
    }

    .blod {
        font-weight: 650;
    }

    .remark {
        font-size: 12px;
        color: #999;
    }
}

.right {
    text-align: right;
    padding-right: 10px;
    width: 100%;
}

.blod {
    font-weight: 650;
}

.remark {
    font-size: 12px;
    color: #999;
}
</style>