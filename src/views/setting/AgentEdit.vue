<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%' }">
        <van-sticky>
            <base-pop-header :title="title" />
        </van-sticky>
        <van-form @submit="onSubmit" :show-error-message="false" :show-error="true" style="padding-top:20px;">
            <van-cell-group inset>
                <van-field v-model="fromData.agent_name" name="agent_name" label="代理名称" placeholder="请输入代理名称"
                    :rules="[{ required: true, message: '请输入代理名称' }]" />

                <van-field v-model="fromData.agent_code" name="agent_code" label="代理编码" placeholder="请输入代理编码"
                    :rules="[{ required: true, message: '请输入代理编码' }]" />
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
import { addAgent, updateAgent } from '../../service/user'
export default {
    components: {
        basePopHeader
    },
    props: {
        agent: {
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
            title: this.agent.id > 0 ? '修改代理' : '添加代理',
            isShow: false,
            fromData: Object.assign({}, this.agent),
        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
        console.log(this.agent)
        if (this.agent.id == 0) {
            this.fromData.agent_name = ''
            this.fromData.agent_code = ''
        }
    },
    methods: {
        closed(isGetData) {
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh', isGetData); }, 300)
        },
        onSubmit(data) {
            if (this.fromData.id > 0) {
                updateAgent(this.fromData).then(() => {
                    this.closed(true, this.fromData);
                })
            } else {
                addAgent(data).then(() => {
                    this.closed(true);
                })
            }

        }
    }
}
</script>

<style>
</style>