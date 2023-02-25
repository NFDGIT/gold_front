<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <van-sticky>
            <base-pop-header :title="title" eventIco="plus" :event="addAgentClick" />
        </van-sticky>
        <div class="agent-content">
            <div class="agent-list">
                <van-pull-refresh v-model="loadingDown" @refresh="onRefresh">
                    <van-list v-model:loading="loading" @load="getList" :finished="finished" finished-text="没有更多了">
                        <!-- <van-cell-group inset>
                            <van-field v-model="query.user_name" name="user_name" label="用户名" placeholder="输入用户名" />
                            <van-field v-model="query.date" is-link readonly name="date" label="时间选择"
                                placeholder="点击选择时间" @click="showPicker = true" />

                        </van-cell-group>
                        <div style="margin: 16px; text-align:center;">
                            <van-button round inline-block type="primary" native-type="submit" style="width:90%"
                                @click="onRefresh">
                                查询
                            </van-button>
                        </div> -->
                        <div v-for=" item in list" :key="item" class="content-card">
                            <van-cell title="代理名" :value="item.agent_name" />
                            <van-cell title="代理编码" :value="item.agent_code" />
                            <div style="margin: 16px;">
                                <van-button round block type="primary" @click="editAgentClick(item)">
                                    修改
                                </van-button>
                            </div>
                            <!-- <van-cell title="总利润" :value="item.sum_profit" />
                            <van-cell title="总差价" :value="item.sum_upstream_profit - item.sum_profit" />
                            <van-cell title="类型" :value="item.type_name" /> -->
                        </div>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
    </van-popup>
    <!-- <van-popup v-model:show="" position="bottom">
        <van-datetime-picker type="time" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup> -->
    <agent-edit v-if="isShowEdit" :agent=optAgent @refresh="closeEdit" />
</template>

<script>
// import { timeout } from 'q'
import { nextTick } from 'vue'
import basePopHeader from '../../components/BasePopHeader.vue'
import { listAgent } from '../../service/user.js'
import { formatDate } from '../../utils'
import AgentEdit from './AgentEdit.vue'
// import { Toast } from 'vant'
export default {
    components: {
        basePopHeader,
        AgentEdit
    },
    props: {},
    data() {
        return {
            title: '代理管理',
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
            isShowEdit: false,
            optAgent: {
                id: 0,
            },
            finished: false,
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

            listAgent().then(res => {
                if (res.data.count <= 0 || res.data.data == null) {
                    this.finished = true
                    this.loading = false
                    return
                }
                // this.finished = true
                for (let i = 0; i < res.data.data.length; i++) {
                    this.list.push(res.data.data[i])
                }
                // console.log(this.list.length)
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
        addAgentClick() {
            this.isShowEdit = true
            this.optAgent = {
                id: 0,
            }
        },
        closeEdit(isRefresh) {

            this.isShowEdit = false
            // this.loadingDown = false
            // this.list = []
            if (isRefresh) {
                this.onRefresh()
            }
        },
        editAgentClick(agent) {
            this.optAgent = agent
            this.isShowEdit = true
        },
        closed() {
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh'); }, 300)
        }
    }
}
</script>

<style lang="less">
.agent-content {
    height: calc(100vh - 40px) !important;
    overflow: auto !important;
    // overflow: hidden !important;
    margin-top: 10px;
    background-color: #f9f9f9;

    .agent-list {
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