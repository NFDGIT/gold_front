<template>
    <van-dialog v-model:show="show" @canplay="close" :showConfirmButton="false" title="代理查询" showCancelButton="true">
        <div class="search-user-content">
            <van-search v-model="query.agent_name" @update="txtChange" placeholder="请输入代理名称" @search="onSearch" />
            <van-list style="height:200px;overflow-y:scroll;">
                <van-cell v-for="(item) in list" :key="item.id" :title="item.agent_name" :desc="item.agent_code"
                    @click="onClick(item)">
                    <span>{{ item.agent_code }}</span>
                </van-cell>
            </van-list>
        </div>
    </van-dialog>
</template>
<script>
import { listAgent } from '../../service/user.js'
export default {
    components: {},
    data() {
        return {
            show: true,
            query: {
                user_name: '',
                enable: '',
                page_size: 10,
                page_num: 0
            },
            list: [],
            allList: []
        }
    },
    created() {
        this.search();
    },
    methods: {
        search() {
            listAgent(this.query).then(res => {
                this.list = res.data.data
                this.allList = res.data.data
            })
        },
        txtChange(txt) {
            console.log(txt)
        },
        onClick(item) {
            this.$emit('select', item)
        },
        onSearch() {
            this.query.page_num = 0
            this.search()
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>