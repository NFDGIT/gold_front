<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%' }">
        <van-sticky>
            <base-pop-header :title="title" />
        </van-sticky>
        <van-form @submit="onSubmit" :show-error-message="false" :show-error="true" style="padding-top:20px;">
            <van-cell-group inset>
                <van-field v-model="fromData.user_name" name="user_name" label="用户名" placeholder="输入用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]" />
                <van-field v-model="fromData.accept_bank_name" is-link readonly @click="showBankSelect = true"
                    name="accept_bank_name" label="开户银行" placeholder="选择开户银行"
                    :rules="[{ required: true, message: '请填写开户银行' }]" />
                <van-field v-model="fromData.accept_bank_num" name="accept_bank_num" label="回款账号" placeholder="输入回款账号"
                    :rules="[{ required: true, message: '请填写回款账号' }]" />

                <van-field v-model="fromData.user_tel" name="user_tel" label="联系方式" placeholder="输入联系方式"
                    :rules="[{ required: true, message: '请填写联系方式' }]" />
                <van-field v-model="fromData.user_name" name="user_name" label="用户姓名" placeholder="输入用户姓名"
                    :rules="[{ required: true, message: '请填写用户姓名' }]" />
                <van-field name="switch" label="开关" v-if="user.id > 0">
                    <template #input>
                        <van-switch v-model="fromData.enable" size="20" />
                    </template>
                </van-field>
                <van-field v-model="agent.agent_code" is-link readonly name="agent_code" label="所属代理" placeholder="点击选择代理"
                    @click="isShowSelectAgent = true" />
                <search-agent v-if="isShowSelectAgent" @select="selectAgent" />
            </van-cell-group>
            <div style="margin: 16px; text-align:center;">
                <van-button round inline-block type="primary" native-type="submit" style="width:90%">
                    提交
                </van-button>
            </div>
        </van-form>
        <van-popup to=".van-list" v-model:show="showBankSelect" position="bottom">
            <van-picker :columns="bankList" @confirm="BankSelectConfirm" @cancel="showBankSelect = false" />
        </van-popup>
    </van-popup>
</template>

<script>
// import { timeout } from 'q'
// import { tsThisType } from '@babel/types'
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import { addUser, updateUser } from '../../service/user'
import SearchAgent from './SearchAgent.vue'
export default {
    components: {
        basePopHeader,
        SearchAgent
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
            title: this.user.id > 0 ? '修改用户' : '添加用户',
            isShow: false,
            fromData: Object.assign({}, this.user),
            bankList: ['中国银行', '中国农业银行', '中国工商银行', '中国建设银行', '交通银行', '中国邮政银行', '中信银行', '招商银行', '浦发银行', '民生银行', '其他-自定义'],
            showBankSelect: false,
            agent: {
                agent_name: '',
                agent_code: ''
            },
            isShowSelectAgent: false,
        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
    },
    methods: {
        showBankSelectClick() {
            this.showBankSelect = !this.showBankSelect;
        },
        BankSelectConfirm(value) {
            this.fromData.accept_bank_name = value;
            this.showBankSelect = false;
        },
        closed(isGetData, user) {
            // this.isShow = false;
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh', isGetData, user); }, 300)
        },
        selectAgent(item) {
            this.agent = item
            this.fromData.agent_code = item.agent_code
            setTimeout(() => { this.isShowSelectAgent=false}, 300)
        },
        onSubmit(data) {
            if (this.fromData.id > 0) {
                this.fromData.enable = this.fromData.enable.toString();
                this.fromData.agent_code = this.agent.agent_code;
                updateUser(this.fromData).then(() => {
                    this.closed(true, this.fromData);
                })
            } else {
                addUser(data).then(() => {
                    this.closed(true);
                })
            }

        }
    }
}
</script>

<style>
</style>