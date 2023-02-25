<template>
    <div style="width:100%; text-align: center; padding-top: 15px;">
        <van-row>
            <van-col :span="8">
            </van-col>
            <van-col :span="8">
                <span style="font-size:18px; font-weight: 650;">{{ title }}</span>
            </van-col>
            <van-col :span="8">
                <span style="float:right; padding-right: 10px;" v-if="event" @click="event">
                    <van-icon v-if="eventIco" :name="eventIco" size="25px" />
                    <span v-if="eventText" style="font-size:15px">{{ eventText }}</span>
                </span>
            </van-col>
        </van-row>


    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
    props: {
        title: {
            type: String,
            default: '弹出框'
        },
        event: {
            type: Event,
            default: function () {
                console.log('event')
            }
        },
        eventIco: {
            type: String,
            default: null
        },
        eventText: { type: String, default: null }
    },
    emits: ['callback'],
    setup(props, ctx) {
        const isback = ref(props.noback)
        const router = useRouter()
        const goBack = () => {
            if (!props.back) {
                router.go(-1)
            } else {
                router.push({ path: props.back })
            }
            ctx.emit('callback')
        }
        return {
            goBack,
            isback
        }
    }
}
</script>
