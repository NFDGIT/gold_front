<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(true)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <van-sticky>
            <base-pop-header :title="title" :event="showBillClick" eventText="账单" />
        </van-sticky>
        <div class="wallet-content">
            <div class="content-card">
                <van-row>
                    <van-col span="17">
                        <div style="margin-top: 20px; display:flex;align-items: center;">
                            <img width="45" height="45" src="~@/static/images/default.png" />
                            <span style="padding-left: 5px; font-weight: 650;">{{ optUser.user_name }}</span>
                        </div>
                        <span>账户余额 ¥{{ optUser.balance }}豆 已用定金 ¥{{ optUser.deposit_use }}</span>
                        <p>开户银行: {{ optUser.accept_bank_name }}</p>
                        <p>回款账号: {{ optUser.accept_bank_num }}</p>
                        <p>联系方式: {{ optUser.user_tel }}</p>
                    </van-col>
                    <van-col span="7">
                        <div style="text-align:center; height: 100%;">
                            <div style="height:60px"></div>
                            <p style="width:100%;">累计盈利</p>
                            <p>¥ {{ optUser.total_profit }}</p>
                        </div>
                    </van-col>
                </van-row>
            </div>
            <div style="text-align: center;position: absolute;top: 70%;line-height: 5;width: 100%;">
                <van-row>
                    <van-col span="24">
                        <van-button type="primary" class="wallet-button" @click="rechargeClick">充值登记</van-button>
                    </van-col>
                    <van-col span="24">
                        <van-button type="success" class="wallet-button" @click="outRechargeClick">回款登记</van-button>
                    </van-col>
                </van-row>
            </div>
        </div>
        <user-bill v-if="showBill" :user="user" @close="closeBill" />
    </van-popup>
    <van-dialog v-model:show="showRechargeEnter" show-cancel-button="true" title="充值登记" @confirm="RechargeConfirm"
        :before-close="onClose">
        <van-cell-group>
            <van-cell title="当前累计余额">
                {{ user.balance }}
            </van-cell>
            <van-cell title="当前冻结余额">
                {{ user.deposit_use }}
            </van-cell>

            <van-cell title="当前可用余额">
                {{ user.balance - user.deposit_use }}
            </van-cell>
            <van-cell title="本次充值">
                <input v-model="rechargeForm.amount" placeholder="请输入充值金额" style="border:1px blod;" />
            </van-cell>
            <!-- <van-cell title="充值截图">
                <van-uploader v-model="fileList" preview-size="30" />
            </van-cell> -->
        </van-cell-group>
    </van-dialog>
    <van-dialog v-model:show="showOutRechargeEnter" show-cancel-button="true" title="回款登记" @confirm="OutRechargeConfirm"
        :before-close="onClose">
        <van-cell-group>
            <van-cell title="当前累计余额">
                {{ user.balance }}
            </van-cell>
            <van-cell title="当前冻结余额">
                {{ user.deposit_use }}
            </van-cell>

            <van-cell title="当前可用余额">
                {{ user.balance - user.deposit_use }}
            </van-cell>
            <van-cell title="回款金额">
                <input v-model="outRechargeForm.amount" placeholder="请输入回款金额" style="border:1px blod;" />
            </van-cell>
            <!-- <van-cell title="回款截图">
                <van-uploader v-model="fileList" preview-size="30" />
            </van-cell> -->
        </van-cell-group>
    </van-dialog>
</template>

<script>
// import { timeout } from 'q'
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import UserBill from './Bill.vue'
import { inRecharge, outRecharge } from '../../service/user.js'
import { Toast } from 'vant'
import { userInfo } from '../../service/user.js';
export default {
    components: {
        basePopHeader,
        UserBill
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
            title: '钱包管理',
            isShow: false,
            optUser: Object.assign({}, this.user),
            showRechargeEnter: false,
            showOutRechargeEnter: false,
            showBill: false,
            rechargeForm: {
                amount: '',
                id: this.user.id,
                image_data: []
            },
            outRechargeForm: {
                amount: '',
                id: this.user.id,
                image_data: []
            },
            fileList: [],
        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
        // console.log(this.user)
    },
    methods: {
        rechargeClick() {
            this.showRechargeEnter = true
        },
        outRechargeClick() {
            this.showOutRechargeEnter = true
        },
        getUserInfo() {
            userInfo({ id: this.optUser.id }).then(rsp => {
                this.optUser = rsp.data
            })
        },
        RechargeConfirm() {
            if (this.rechargeForm.amount == '') {
                Toast('请输入充值金额')
                return false
            }
            Toast.loading({
                message: '加载中...',
                forbidClick: false,
                duration: 0,
            });
            // for (let i = 0; i < this.fileList.length; i++) {
            //     this.rechargeForm.image_data.push(this.fileList[i].content.replace(/^data:image\/\w+;base64,/, ""))
            // }
            inRecharge(this.rechargeForm).then(() => {
                this.rechargeForm.amount = ''
                this.fileList = []
                //刷新用户信息
                this.getUserInfo()
                this.showRechargeEnter = false
                Toast.success('充值成功')
                setTimeout(() => {
                    Toast.clear()
                }, 500)
            })
        },
        OutRechargeConfirm() {
            if (this.outRechargeForm.amount == '') {
                Toast('请输入回款金额')
                return false
            }
            Toast.loading({
                message: '加载中...',
                forbidClick: false,
                duration: 0,
            });
            // for (let i = 0; i < this.fileList.length; i++) {
            //     this.outRechargeForm.image_data.push(this.fileList[i].content.replace(/^data:image\/\w+;base64,/, ""))
            // }
            outRecharge(this.outRechargeForm).then(() => {
                this.outRechargeForm.amount = ''
                this.fileList = []
                this.showOutRechargeEnter = false
                //刷新用户信息
                this.getUserInfo()
                Toast.success('回款成功')
                setTimeout(() => {
                    Toast.clear()
                }, 500)
            })
        },
        onClose(action) {
            if (action == 'confirm') {
                return false
            }
            return true
        },
        showBillClick() {
            this.showBill = true
        },
        closeBill() {
            setTimeout(() => { this.showBill = false }, 500)
        },
        closed(isGetData) {
            this.isShow = false;
            // if (isGetData) {
            //     this.getUserInfo()
            // }
            setTimeout(() => { this.$emit('refresh', isGetData); }, 300)
        }
    }
}
</script>

<style lang="less">
.wallet-content {
    height: calc(100vh - 60px) !important;
    overflow: auto !important;
    overflow: hidden !important;
    background-color: #ffffff;
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
        height: calc(100vh - 600px) !important;
        overflow: auto !important;
    }

    .wallet-button {
        color: #fff;
        font-weight: 650;
        font-size: 15px;
        width: 80%;
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