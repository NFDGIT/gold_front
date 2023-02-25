<template>
    <van-popup v-model:show="isShow" closeable close-icon="arrow-left" @close="closed(false)"
        close-icon-position="top-left" position="right" :style="{ height: '100%', width: '100%', overflow: 'hidden' }">
        <div class="chat-content">
            <div ref="main" id="main" style="width: 100%;height:80vh;">加载中..</div>
        </div>
    </van-popup>
</template>

<script>
import * as echarts from 'echarts';
import { listPriceRecord } from '../../service/system';
import moment from 'moment';
import { Toast } from 'vant';
let myChart = {}
var timer1 = null;
var timer2 = null;
export default {
    props: {},
    data() {
        return {
            isShow: false,
            seriesData: [],
            xAxisData: [],
        }
    },
    created() {
        this.$nextTick(() => {
            this.isShow = true
        })
    },
    beforeUnmount() {
        clearInterval(timer1);
        clearInterval(timer2);
        timer1 = null;
        timer2 = null;
    },
    mounted() {
        var _this = this
        timer1 = setInterval(function () {
            // console.log(document.readyState)
            // 判断文档和所有子资源(图片、音视频等)已完成加载
            if (document.readyState === 'complete') {

                myChart = echarts.init(document.getElementById("main"), 'light')
                //执行方法
                _this.loadData()

                window.clearInterval(timer1)
            }
        }, 20)
        timer2 = setInterval(() => {
            this.refresh()
        }, 1000 * 10)
        // setTimeout(() => {
        //     myChart = echarts.init(document.getElementById("main"), 'light')
        //     //执行方法
        //     _this.loadData()
        // }, 2000)
    },

    methods: {
        loadData() {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                loadingType: 'spinner',
                duration: 0,
            });
            //获取最新数据
            listPriceRecord({
                begin_time: moment(new Date()).subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
            }).then(res => {
                let seriesAsk = {
                    name: '销售价',
                    type: 'line',
                    // smooth: true,
                    showSymbol: false,
                    data: res.data.data.map(item => {
                        return item.price_ask * 1
                    })
                }
                let seriesBid = {
                    name: '回购价',
                    type: 'line',
                    // smooth: true,
                    showSymbol: false,
                    data: res.data.data.map(item => {
                        return item.price_bid * 1
                    })
                }
                this.xAxisData.data = res.data.data.map((item) => {
                    return item.price_time
                })
                this.seriesData.push(seriesAsk)
                this.seriesData.push(seriesBid)
                this.initChart()
            })
        },
        refresh() {
            //获取最新数据
            listPriceRecord({
                begin_time: moment(new Date()).subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
            }).then(res => {
                let seriesAsk = {
                    name: '销售价',
                    type: 'line',
                    // smooth: true,
                    showSymbol: false,
                    data: res.data.data.map(item => {
                        return item.price_ask * 1
                    })
                }
                let seriesBid = {
                    name: '回购价',
                    type: 'line',
                    // smooth: true,
                    showSymbol: false,
                    data: res.data.data.map(item => {
                        return item.price_bid * 1
                    })
                }
                this.xAxisData.data = res.data.data.map((item) => {
                    return item.price_time
                })
                this.seriesData = []
                this.seriesData.push(seriesAsk)
                this.seriesData.push(seriesBid)
                this.initChart()
            })
        },
        //构建图表
        initChart() {
            var option = {
                title: {
                    text: '近24小时价格走势图',
                    textAlign: 'auto',
                    textStyle: {
                        color: '#000000',
                        fontSize: 18
                    },
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    data: this.xAxisData.data,
                },
                yAxis: {
                    min: function (value) {
                        return value.min - 1;
                    },
                    max: function (value) {
                        return value.max + 1;
                    },
                },
                series: this.seriesData
            }
            myChart.setOption(option)
            this.$nextTick(() => {
                Toast.clear()
            })
        },
        closed(isGetData) {
            this.isShow = false;
            setTimeout(() => { this.$emit('close', isGetData); }, 300)
        },
    },
}
</script>

<style lang="less" scoped>
.chat-content {
    margin-top: 50px;
    // background: #000;
}
</style>