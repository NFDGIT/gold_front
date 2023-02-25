<template>
    <div style="" class="main">
        <header>
            <div class="header_center">
                <span>管理面板</span>
            </div>
        </header>
        <div class="content">
            <div class="body_card" style="height:107px;">
                <van-row>
                    <van-col span="12" class="left">
                        <img width="64" height="64" src="~@/static/images/default.png" />
                        <span style="padding-left: 5px; font-weight: 650;">管理员</span>
                    </van-col>
                    <van-col span="12" style="text-align:right">
                        <van-row>
                            <van-col span="12">
                                <div class="vcenter"></div>
                            </van-col>
                            <van-col span="12" style="text-align:right">
                                <van-button type="primary" size="mini" style="width:60px;" @click="logout">登出
                                </van-button>
                            </van-col>
                        </van-row>
                    </van-col>
                </van-row>
            </div>
            <div class="setting_card">
                <span style="padding-left:10px;font-weight: 650;">常用功能</span>
                <van-grid :border="false" clickable style="width:100%;">
                    <van-grid-item @click="setFee">
                        <!-- <van-image src="~@/static/images/u903.png" /> -->
                        <img class="ico_img" src="~@/static/images/u903.png" alt="" />
                        <span>手续费调整</span>
                    </van-grid-item>
                    <van-grid-item @click="setDingjia">
                        <!-- <van-image src="~@/static/images/u903.png" /> -->
                        <img class="ico_img" src="~@/static/images/u907.png" alt="" />
                        <span>定价调整</span>
                    </van-grid-item>
                    <van-grid-item icon="pause-circle-o" @click="showStatClick">
                        <van-icon name="chart-trending-o" size="50px" style="color:#d0753b" />
                        <span>统计</span>
                    </van-grid-item>
                    <van-grid-item icon="replay" @click="showAgentClick">
                        <van-icon name="cluster-o" size="50px" style="color:#d0753b" />
                        <span>代理管理</span>
                    </van-grid-item>
                    <!--<van-grid-item icon="replay" @click="reset">
                        <img class="ico_img" src="~@/static/images/u911.png" alt="" />
                        <span>访问电脑版</span>
                    </van-grid-item>
                    <van-grid-item icon="replay" @click="reset">
                        <img class="ico_img" src="~@/static/images/u916.png" alt="" />
                        <span>修改密码</span>
                    </van-grid-item> -->
                </van-grid>
            </div>
        </div>
    </div>
    <van-dialog v-model:show="showSetFee" :before-close="beforeCloseFee" @confirm="updateFeeClick"
        show-cancel-button="true">
        <van-cell-group>
            <van-cell title="当前手续费">
                <span>{{ goldFee }}豆/1000g/天</span>
            </van-cell>
            <van-cell title="修改后手续费" value="请输入手续费" v-model:value="newGoldFee">
                <input v-model="newGoldFee" type="number" placeholder="请输入手续费" />
            </van-cell>
        </van-cell-group>
    </van-dialog>
    <van-dialog v-model:show="showSetDingjia" :before-close="beforeCloseFee" @confirm="updateDingjiaClick"
        show-cancel-button="true">
        <van-cell-group>
            <van-cell title="修改定价" value="请输入定价" v-model:value="setDingjiaForm.price">
                <input v-model="setDingjiaForm.price" type="number" placeholder="请输入定价" />
            </van-cell>
        </van-cell-group>
    </van-dialog>
    <nav-bar />
    <stat v-if="isShowStat" @refresh="closeStat"></stat>
    <agent v-if="isShowAgent" @refresh="closeAgent"></agent>
</template>

<script>
import { reactive, toRefs } from 'vue'
import router from '../../router'
// import swiper from '@/components/Swiper'
import navBar from '@/components/NavBar'
// import sHeader from '@/components/SimpleHeader'
// import { getLocal } from '@/common/js/utils'
import { Toast } from 'vant'
import { ref } from 'vue';
import { setLocal } from '../../common/js/utils';
import { getFee, updateFee, updateDingJia } from '../../service/user.js'
import Stat from './Stat.vue'
import Agent from './Agent.vue'
// import { useStore  } from 'vuex'
export default {
    name: 'home',
    components: {
        navBar,
        Agent,
        Stat
    },
    setup() {
        const showSetFee = ref(false)
        const showSetDingjia = ref(false)
        const isShowAgent = ref(false)
        const isShowStat = ref(false)
        const state = reactive({})
        const goldFee = ref(0)
        const setDingjiaForm = ref({
            kind_code: 'gold',
            price: ''
        })
        const newGoldFee = ref(goldFee.value)
        const logout = () => {
            Toast.loading({
                duration: 0,
                forbidClick: true,
                message: '退出中...'
            });
            setLocal('token', '');
            setTimeout(() => {
                Toast.clear();
                router.push({ path: `/login` })
            }, 1000);
        }

        const getGoldFee = () => {
            getFee({ kind_code: "gold" }).then((rsp) => {
                // console.log(rsp.datafee)
                goldFee.value = rsp.data.fee

            })
        }

        const showStatClick = () => {
            isShowStat.value = true
        }
        const closeStat = () => {
            setTimeout(isShowStat.value = false, 300)
        }

        const setFee = () => {
            showSetFee.value = true
        }

        const setDingjia = () => {
            showSetDingjia.value = true
        }

        const showAgentClick = () => {
            isShowAgent.value = true
        }

        const closeAgent = () => {
            isShowAgent.value = false
        }

        const updateFeeClick = () => {
            if (newGoldFee.value == '' || newGoldFee.value <= 0) {
                Toast.success('请输入费率')
                return
            }
            updateFee({ kind_code: "gold", "fee": newGoldFee.value }).then(() => {
                Toast.success('修改成功')
                goldFee.value = newGoldFee.value
                showSetFee.value = false
            })
        }
        const updateDingjiaClick = () => {
            if (setDingjiaForm.value == '' || setDingjiaForm.value <= 0) {
                Toast.success('请输入定价')
                return
            }
            updateDingJia(setDingjiaForm.value).then(() => {
                Toast.success('修改成功')
                showSetDingjia.value = false
            })
        }
        const beforeCloseFee = (event) => {
            if (event == "confirm") {
                return false
            }
            return true
        }

        const tips = () => {
            Toast('敬请期待');
        }

        return {
            ...toRefs(state),
            tips,
            logout,
            showSetFee,
            showSetDingjia,
            isShowStat,
            setDingjiaForm,
            setDingjia,
            updateDingjiaClick,
            showStatClick,
            showAgentClick,
            isShowAgent,
            closeAgent,
            closeStat,
            setFee,
            goldFee,
            newGoldFee,
            beforeCloseFee,
            getGoldFee,
            updateFeeClick
        }
    },
    created() {
        this.getGoldFee()
    }

}
</script>

<style>
.txt_blod {
    font-weight: bold;
}

.main {
    height: 100%;
    background-color: rgba(249, 249, 249, 1);
}

.content {
    padding: 0.5rem;
}

.header_center {
    font-weight: 650;
    font-style: normal;
    font-size: 18px;
    color: black;
    font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC ExtraLight', 'PingFang SC', sans-serif;
    width: 100%;
    text-align: center;
    padding-top: 44px;
    /* height: 20px; */
}

.body_card {
    text-align: center;
    background-color: #fff;
    box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
    font-size: 13px;
    padding-left: 15px;
    /* height: 64px; */
    /*flex 布局*/
    display: flex;
    /*实现垂直居中*/
    align-items: center;
    border-radius: 5px;
    margin-top: 5px;
}

.setting_card {
    /* text-align: center; */
    background-color: #fff;
    box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
    font-size: 13px;
    /* padding-left: 15px; */
    border-radius: 5px;
    margin-top: 5px;
}

.setting_card .ico_img {
    width: 40px;
    height: 40px;
    /* border-radius: 50%; */
}

.setting_card span {
    font-weight: 650;
    font-size: 9px;
    padding-top: 5px;
    /* height: 64px; */
    /* border-radius: 50%; */
}

.body_card .van-row {
    width: 100%;
    /*实现垂直居中*/
    /* align-items: center; */
}

.body_card .van-row .van-col {
    /*实现垂直居中*/
    align-items: center;
    /*flex 布局*/
    display: flex;
    width: 100%;
}

.body_card button {
    background-color: rgba(208, 117, 59, 1);
    border: 0.02667rem solid rgba(208, 117, 59, 1);
}
</style>



