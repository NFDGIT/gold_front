<template>
    <van-dialog v-model:show="isShow" show-cancel-button @close="closed(false)" @confirm="onSubmit"
        :before-close="onBeforeClose">
        <van-sticky>
            <base-pop-header :title="title" />
        </van-sticky>
        <van-form ref="postForm" :show-error-message="false" :show-error="true" style="padding-top:20px;">
            <van-cell-group inset>
                <van-field label="订单号" readonly v-model="fromData.flash_id" />
                <van-field v-model="fromData.upstream_price" name="upstream_price" label="上游价格" placeholder="输入上游价格"
                    :rules="[{ required: true, message: '上游价格' }]" />
            </van-cell-group>
            <!-- <div style="margin: 16px; text-align:center;">
                <van-button round inline-block type="primary" native-type="submit" style="width:90%">
                    提交
                </van-button>
            </div> -->
        </van-form>
    </van-dialog>
</template>

<script>
// import { timeout } from 'q'
import { nextTick } from 'vue'
import { Toast } from 'vant';
import basePopHeader from '../../components/BasePopHeader.vue'
import { editUpstreamPrice } from '../../service/order'
export default {
    components: {
        basePopHeader
    },
    props: {
        flash_id: {
            type: String,
            default: () => {
                return ''
            }
        }
    },
    data() {
        return {
            title: '修改上游价格',
            isShow: false,
            fromData: {
                flash_id: this.flash_id,
                upstream_price: ''
            },

        }
    },
    created() {
        nextTick(() => { this.isShow = true; })
    },
    methods: {
        closed(isGetData) {
            this.isShow = false;
            setTimeout(() => { this.$emit('refresh', isGetData); }, 300)
        },
        onBeforeClose(action) {
            if (action === "confirm") {
                return false
            }
            return true
        },
        onSubmit() {
            if (this.fromData.flash_id == '') {
                Toast('请输入订单号')
                return
            }
            if (this.fromData.upstream_price == '') {
                Toast('请输入上游价格')
                return
            }
            editUpstreamPrice(this.fromData).then(() => {
                this.closed(true);
            })
        }
    }
}
</script>

<style>
</style>