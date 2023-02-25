<template>
    <van-dialog v-model:show="isShow" title="撤销订单预订" show-cancel-button @closed="closed(false)" @confirm="settleClick">
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
                    <van-col span="12">
                        <span class="remark">请输入数量(克)</span>
                    </van-col>
                    <van-col span="12" calss="right" style="text-align: right;padding-right: 10px;" >
                        <input v-model="fromData.weight" @change="profitCipher" @keyup="profitCipher">
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="12">
                        <span class="remark">请输入预订价(豆)</span>
                    </van-col>
                    <van-col span="12" calss="right" style="text-align: right;padding-right: 10px;">
                        <input v-model="fromData.book_price" @change="profitCipher" @keyup="profitCipher">
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
                    <van-col span="12">
                        <span class="remark">请输入预定时间</span>
                    </van-col>
                    <van-col span="12" calss="right" style="text-align: right;padding-right: 10px;">
                        <input v-model="fromData.book_at" @change="profitCipher" @keyup="profitCipher">
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="12">
                        <span class="remark">请输入撤销原因</span>
                    </van-col>
                    <van-col span="12" calss="right" style="text-align: right;padding-right: 10px;">
                        <input v-model="fromData.rollback_reason" @change="profitCipher" @keyup="profitCipher">
                    </van-col>
                </van-row>
            </div>
        </div>
    </van-dialog>
    <select-date-time v-if="isShowSelectDateTime" :time="currentDate" @refresh="closeSelectTime"
        @confirm="confirmSelectDate" />
</template>

<script>
import { Toast } from 'vant';
import { nextTick } from 'vue'
import { formatDate } from '@/utils'
import { rollbackOrderBook } from '../../service/order.js'
import SelectDateTime from '@/components/SelectDateTime.vue'
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
            rollbackOrderBook({
                flash_id: this.fromData.flash_id,
                weight: this.fromData.weight-0,
                book_price: this.fromData.book_price,
                book_at: this.fromData.book_at,
                rollback_reason: this.fromData.rollback_reason,                                
            }).then(() => {
                Toast.success('撤销成功');
                this.closed(true);
            })
        },
        changeDateTimeClick() {
            this.isShowSelectDateTime = true
        },
        closeSelectTime() {
            this.isShowSelectDateTime = false;
        },
        confirmSelectDate(date) {
            this.currentDate = date
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