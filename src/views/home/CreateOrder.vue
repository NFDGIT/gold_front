<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <base-pop-header title="我要预定" />
        <div class="header"></div>
        <div style="clear:both;"></div>
        <div class="content">

            <div class="card">
                <span class="blod top">预定类型</span>
                <van-row>
                    <van-col span="24">
                        <van-radio-group v-model="this.formData.trade_type" direction="horizontal">
                            <van-radio name="buy">买料</van-radio>
                            <van-radio name="sell">卖料</van-radio>
                        </van-radio-group>
                    </van-col>
                </van-row>
            </div>
            <div class="card">
                <van-row>
                    <van-col span="8">
                        <span class="blod">克重</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <span class="blod"> {{ dingjia }} 豆/克</span>
                        <van-stepper v-model="formData.total_weight" @change="weightChange" input-width="60px"
                            step="1000" default-value="1000" integer="true" />
                    </van-col>
                </van-row>
            </div>
            <div class="card">
                <van-row>
                    <van-col span="8">
                        <span class="blod">预定价</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <input v-model="formData.book_price">
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="blod">上游价格</span>
                    </van-col>
                    <van-col span="16" calss="right" style="text-align: right;padding-right: 10px;">
                        <input v-model="formData.upstream_price">
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="blod">手续费</span>
                    </van-col>
                    <van-col span="16" style="text-align: right;padding-right: 10px;">
                        <span class="blod"> {{ fee }} 豆/克/天</span>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="blod">定价</span>
                    </van-col>
                    <van-col span="16" style="text-align: right;padding-right: 10px;">
                        <span class="blod"> {{ formData.total_deposit }} 豆</span>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">
                        <span class="blod">操作时间</span>
                    </van-col>
                    <van-col span="16" style="text-align: right;padding-right: 10px;">
                        <span class="blod" @click="selectDateTimeClick">
                            {{ formatDate(formData.opt_time, "YYYY-MM-DD HH: mm: 00") }}</span>
                    </van-col>
                </van-row>
            </div>
            <span class="blod right" style="color:red; font-size: 13px; line-height: 30px;">当前可剩余可分配为:{{ shenyu
            }}g</span>
            <van-row style="padding-top:4px; text-align:center">
                <van-col span="12">
                    <van-button type="primary" size="mini" style="background-color:rgba(191, 191, 191, 1); border-color: #bfbfbf;"
                        @click="addUserClick">增加分配</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="primary" size="mini" @click="addOrder">提交</van-button>
                </van-col>
            </van-row>
            <div class="card" ref="messageContent" v-if="this.formData.detail.length > 0"
                style="overflow: scroll;height: 200px;">
                <van-row v-for=" (item, index) in formData.detail" :key="item">
                    <van-col span="6">
                        <span class="blod">{{ item.user_name }}</span>
                    </van-col>
                    <van-col span="12" style="text-align: right;padding-right: 10px;">
                        <input v-model="item.weight" @change="detailChange(item)" style="width:80px;" />
                        <van-button type="button"
                            style="margin-left:5px; height: 20px; background-color:crimson; color:#fff" size="mini"
                            icon="cross" @click="deleteDetail(index)">
                        </van-button>
                        <!-- <van-icon name="cross" @click="deleteDetail(index)" /> -->
                    </van-col>
                </van-row>
            </div>

        </div>
        <search-user v-if="searchUsesrShow" @close="close" @select="selectUser" />
        <select-date-time v-if="isShowSelectDateTime" :time="currentDate" @refresh="closeSelectTime"
            @confirm="confirmSelectDate" />
    </van-popup>
</template>

<script>
import { Toast } from 'vant';
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import SearchUser from './SearchUser.vue';
import { createOrder, getFee, getDingJia } from '../../service/order.js'
import SelectDateTime from '@/components/SelectDateTime.vue'
import { formatDate } from '@/utils'
export default {
    components: {
        basePopHeader,
        SearchUser,
        SelectDateTime
    },
    data() {
        return {
            formData: {
                trade_type: "buy",
                book_price: "",
                upstream_price: "",
                total_weight: 1000,
                fee: "0.01",
                dingjia: "10",
                opt_time: new Date(),
                total_deposit: 1000 * 10 + "",
                detail: []
            },
            isShow: false,
            isShowSelectDateTime: false,
            searchUsesrShow: false,
            currentDate: new Date(),
            shenyu: 0,
            fee: 0.1,
            dingjia: 10
        }
    },
    setup() {
        // console.log("加载了")
    },
    updated() {
        // console.log("加载了")
    },
    created() {
        nextTick(() => { this.isShow = true; })
        this.getFeeRate()
        this.getDingJiaRate()
        // console.log("加载了")
    },
    methods: {
        weightChange() {
            this.formData.total_deposit = this.formData.total_weight * this.dingjia + "";
            this.fenpei();
        },
        addUserClick() {
            this.searchUsesrShow = true
            this.fenpei();
        },
        detailChange(e) {
            e.deposit = e.weight * this.dingjia
            this.fenpei();
        },
        fenpei() {
            this.shenyu = this.formData.total_weight;
            this.formData.detail.forEach(item => {
                this.shenyu -= item.weight;
                item.weight = item.weight * 1
                item.deposit = item.weight * this.dingjia + "";
            })
        },
        addOrder() {
            // console.log(this.formData)
            if (this.formData.book_price === "" || this.formData.book_price == 0) {
                Toast.fail("请输入预定价");
                return
            }
            // console.log(this.formData)
            if (this.formData.detail.length <= 0) {
                Toast.fail("还未分配用户");
                return
            }
            if (this.shenyu != 0) {
                Toast.fail("分配错误，请核对分配信息");
                return
            }
            this.formData.dingjia = this.dingjia
            this.formData.total_deposit = this.formData.total_weight * this.dingjia + "";
            this.formData.opt_time = formatDate(this.currentDate, "YYYY-MM-DD HH:mm:00")
            createOrder(this.formData).then(() => {
                Toast.success("创建订单成功");
                this.formData = {
                    trade_type: "buy",
                    book_price: "",
                    upstream_price: "",
                    total_weight: 1000,
                    fee: "0.01",
                    opt_time: formatDate(new Date(), "yyyy-MM-DD HH:mm:ss"),
                    total_deposit: 1000 * this.dingjia + "",
                    detail: []
                }
                this.$emit("close", true)
            })
            // this.$emit('close')
        },
        deleteDetail(index) {
            this.formData.detail.splice(index, 1)
            this.fenpei();
        },
        selectUser(user) {
            this.formData.detail.push({
                user_id: user.id,
                user_name: user.user_name,
                weight: this.shenyu > 0 ? this.shenyu : 0,
                deposit: this.formData.total_weight * this.dingjia + ""
            })
            // 让滚动条始终在最底部
            this.$nextTick(() => {
                this.$refs.messageContent.scrollTop = this.$refs.messageContent.scrollHeight
            })
            this.fenpei();
            this.searchUsesrShow = false;
        },
        getFeeRate() {
            getFee({
                kind_code: "gold"
            }).then(res => {
                this.fee = res.data.fee;
            })
        },
        getDingJiaRate() {
            getDingJia({
                kind_code: "gold"
            }).then(res => {
                this.dingjia = res.data.price;
            })
        },
        close() {
            this.searchUsesrShow = false
        },
        selectDateTimeClick() {
            this.currentDate = new Date();
            this.isShowSelectDateTime = true
        },
        closeSelectTime() {
            this.isShowSelectDateTime = false
        },
        confirmSelectDate(time) {
            this.currentDate = time;
            this.formData.opt_time = time;
            this.isShowSelectDateTime = false;
        },
        closed(isRefresh) {
            this.isShow = false
            // if (isRefresh) { console.log('ff') }
            this.$emit("close", isRefresh)
        },
        formatDate
    }
}
</script>

<style lang="less">
.header {
    height: 15px;
}

/* pull 和 list 冲突解决  盈利*/
.van-pull-refresh-create {
    height: calc(100vh - 250px) !important;
    overflow: auto !important;
}

.content {
    // padding-left: 5px;
    // padding-right: 5px;
    min-height: 90%;
    padding-left: 5px;
    padding-top: 1px;
    padding-right: 5px;
    background-color: rgba(249, 249, 249, 1);
}

.card {
    background-color: #fff;
    box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
    font-size: 13px;
    padding-left: 10px;
    padding-top: 10px;
    // padding-right: 15px;
    margin-top: 10px;

    .van-row .van-col {
        padding-left: 25px;
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