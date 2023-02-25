<template>
    <van-popup v-model:show="isShow" position="bottom" :close-on-click-overlay="false">
        <van-datetime-picker :formatter="formatDate" v-model="currentDate" type="datetime" @cancel="closed(false)"
            title="选择完整时间" @confirm="confirmSelect" />
    </van-popup>
</template>

<script>
import { formatDate } from '@/utils'
export default {
    props: {
        time: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            title: '时间选择',
            currentDate: this.time,
            isShow: true,
        }
    },
    methods: {
        closed(isGetData) {
            // console.log("关闭")
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh', isGetData); }, 300)
        },
        confirmSelect(value) {
            // console.log(":fff")
            this.currentDate = formatDate(value, 'yyyy-MM-DD HH:mm:ss');
            this.isShow = false;
            this.$emit('confirm', this.currentDate);
        }
    }
}
</script>

<style>
</style>