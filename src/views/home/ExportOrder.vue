<template>
    <van-dialog v-model:show="isShow" :title="title" show-cancel-button @closed="closed(false)" @confirm="exportClick">
        <div class="export_content">
            <van-form ref="postForm" :show-error-message="false" :show-error="true" style="padding-top:20px;">
                <van-cell-group inset>
                    <van-field label="类型">
                        <template #input>
                            <van-radio-group v-model="exportType" direction="horizontal">
                                <van-radio name="true">已结算</van-radio>
                                <van-radio name="false">未结算</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field v-model="startTime" is-link readonly name="startTime" label="开始时间" placeholder="点击选择时间"
                        @click="showStartClick" />
                    <van-field v-model="endTime" is-link readonly name="endTime" label="结束时间" placeholder="点击选择时间"
                        @click="showEndClick" />
                </van-cell-group>
                <!-- <div style="margin: 16px; text-align:center;">
                <van-button round inline-block type="primary" native-type="submit" style="width:90%">
                    提交
                </van-button>
            </div> -->
            </van-form>
        </div>
    </van-dialog>
    <select-date-time v-if="isShowStartDateTime" :time="currentDate" @refresh="closeSelectTime"
        @confirm="confirmStartDate" />
    <select-date-time v-if="isShowEndDateTime" :time="currentDate" @refresh="closeSelectTime"
        @confirm="confirmEndDate" />
</template>

<script>
// import { Toast } from 'vant';
import { nextTick } from 'vue'
import { formatDate } from '@/utils'
import { listOrder, listUserOrder } from '../../service/order.js'
import SelectDateTime from '@/components/SelectDateTime.vue'
import moment from 'moment';
import XLSX from 'xlsx'
// import { createOrder } from '../../service/order.js'
export default {
    components: {
        SelectDateTime
    },
    props: {
        type: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            title: this.type === 0 ? '全部订单导出' : '用户订单导出',
            isShow: false,
            isShowStartDateTime: false,
            isShowEndDateTime: false,
            formatDate: formatDate,
            currentDate: new Date(),
            startTime: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
            endTime: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
            exportType: 'true',
            query: {

            }
        }
    },
    setup() {

    },
    updated() { },
    created() {
        nextTick(() => { this.isShow = true; })
        // this.fromData.finish_price = this.fromData.book_price
        // this.fromData.opt_time = formatDate(this.currentDate, 'YYYY-MM-DD HH:mm:00')
        // this.profitCipher()
        // console.log(this.fromData)
    },
    methods: {
        closed(isRefresh) {
            this.isShow = false;
            nextTick(() => { this.$emit("close", isRefresh) })
        },
        exportClick() {
            if (this.type === 0) {
                this.exportAll()
            } else {
                this.exportUser()
            }

        },
        //导出系统全部订单
        exportAll() {
            listOrder({
                begin_time: this.startTime,
                end_time: this.endTime,
                is_finish: this.exportType,
                page_size: 99999,
            }).then((rsp) => {
                if (rsp.data.count == 0) {
                    this.$toast('当前选择时间范围无订单数据')
                    return
                }
                const data = XLSX.utils.json_to_sheet(this.exportExcelModel(rsp.data.data))
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, data, 'Sheet1')
                XLSX.writeFile(wb, this.exportType == 'true' ? '已结算数据.xlsx' : '未结算数据.xlsx')
                this.closed(true);
            })
        },
        //导出指定用户订单
        exportUser() {
            listUserOrder({
                id: this.type,
                begin_time: this.startTime,
                end_time: this.endTime,
                is_finish: this.exportType,
                page_size: 99999,
                page_num: 0
            }).then((rsp) => {
                if (rsp.data.count == 0) {
                    this.$toast('当前选择时间范围无订单数据')
                    return
                }
                const data = XLSX.utils.json_to_sheet(this.exportExcelModel(rsp.data.data))
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, data, 'Sheet1')
                XLSX.writeFile(wb, this.exportType == 'true' ? '用户[' + this.type + ']已结算数据.xlsx' : '用户[' + this.type + ']未结算数据.xlsx')
                this.closed(true);
            })
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
        showStartClick() {
            this.isShowStartDateTime = true
            if (this.startTime != '')
                this.currentDate = moment(this.startTime).toDate()
        },
        showEndClick() {
            this.isShowEndDateTime = true
            if (this.endTime != '')
                this.currentDate = moment(this.endTime).toDate()
        },
        closeSelectTime() {
            this.isShowStartDateTime = false;
            this.isShowEndDateTime = false;
        },
        confirmStartDate(date) {
            this.startTime = date
            // this.fromData.opt_time = formatDate(date, 'YYYY-MM-DD HH:mm:00')
            // console.log("--------------------" + this.fromData.opt_time) + "----------->" + date
            this.isShowStartDateTime = false;
        },
        confirmEndDate(date) {
            this.endTime = date
            this.isShowEndDateTime = false;
        }
    }
}
</script>

<style lang="less">
.export_content {
    padding-top: 5px;
}
</style>