<template>
    <van-dialog v-model:show="show" @canplay="close" :showConfirmButton="false" title="用户查询" showCancelButton="true">
        <div class="search-user-content">
            <van-search v-model="query.user_name" @update="txtChange" placeholder="请输入用户名" @search="onSearch" />
            <van-list style="height:200px;overflow-y:scroll;">
                <van-cell v-for="(item) in list" :key="item.id" :title="item.user_name" :desc="item.user_tel"
                    @click="onClick(item)">
                    <span>{{ item.user_tel }}</span>
                </van-cell>
            </van-list>
        </div>
    </van-dialog>
</template>
<script>
import { listUser } from '../../service/order.js'
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
            listUser(this.query).then(res => {
                this.list = res.data
                this.allList = res.data
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