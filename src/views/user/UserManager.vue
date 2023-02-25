<template>
    <div class="user-manger-content">
        <header>
            <div class="header_bg">
                <div class="header_bg_img">
                    <div class="header_top">
                        <van-row>
                            <van-col span="12"><img class="header_ico" src="~@/static/images/home_header_ico.png"
                                    alt="" />
                                <img class="header_logo" src="~@/static/images/home_header_logo.png" alt="" />
                            </van-col>
                            <van-col span="10" style="text-align:right">
                                <van-search v-model="query.user_name" shape="round" left-icon right-icon="search"
                                    style="width:130px;" @search="refresh" size="mini" placeholder="搜索" />

                            </van-col>
                            <van-col span="2" style="text-align:center">
                                <van-icon name="add-o" size="25" color="#ffffff" @click="addUserClick" />
                            </van-col>
                        </van-row>
                    </div>
                    <div style="padding:15px;">
                        <van-pull-refresh v-model="loadingDown" @refresh="refresh" loading-text=" " style="">
                            <van-list v-model:loading="loading" :finished="finished" @load="onLoad"
                                finished-text="没有更多了" offset="100">
                                <div class="card-manager" v-for=" item in list" :key="item">
                                    <van-row gutter="20">
                                        <van-col span="12" class="left">
                                            <img width="35" height="35" src="~@/static/images/default.png" />
                                            <span style="padding-left: 5px; font-weight: 650;">
                                            {{item.user_name}}（{{item.agent_name}}）</span>
                                        </van-col>
                                        <van-col span="12" style="text-align:right">
                                            <van-row gutter="20">
                                                <van-col span="12">
                                                    <span class="txt_blod">笔数:{{ item.deposit_count }}</span>
                                                </van-col>
                                                <van-col span="12" @click="showUserInfoClick(item)">
                                                    <span style="color:dimgrey">查看更多</span>
                                                </van-col>
                                            </van-row>
                                        </van-col>
                                    </van-row>
                                </div>
                            </van-list>
                        </van-pull-refresh>
                    </div>
                </div>
            </div>
        </header>
    </div>
    <nav-bar />
    <add-user @refresh="close" v-if="showEditUser" />
    <user-info @refresh="close" v-if="showUserInfo" :user="optUser" />
</template>

<script>
import { reactive, toRefs } from 'vue'
// import { useRouter } from 'vue-router'
// import swiper from '@/components/Swiper'
import navBar from '@/components/NavBar'
import { listUser } from '../../service/user'
// import { getLocal } from '@/common/js/utils'
// import { Toast } from 'vant'
import { ref } from 'vue';
import AddUser from './EditUser.vue'
import UserInfo from './UserInfo.vue'
// import { timeout } from 'q';
// import { useStore  } from 'vuex'
export default {
    name: 'userManager',
    components: {
        navBar,
        AddUser,
        UserInfo
    },
    setup() {
        const query = ref({
            user_name: '',
            page_num: 0,
            enable: 'true',
            page_size: 10
        })
        const list = ref([]);
        const loading = ref(false);
        const loadingDown = ref(false);
        const finished = ref(false);
        const showEditUser = ref(false);
        const showUserInfo = ref(false);
        //当前操作的用户
        const optUser = ref({});
        const refresh = () => {
            loadingDown.value = true;
            // loading.value = false;
            finished.value = false;
            query.value.page_num = 0;
            list.value = []
            getUserList();

        }
        const onLoad = () => {
            getUserList();
        };
        const state = reactive({})
        // const goToDetail = (item) => {
        //   router.push({ path: `/product/${item.goodsId}` })
        // }
        const addUserClick = () => {
            showEditUser.value = true
            // console.log('addUserClick')
        }
        const getUserList = () => {
            loading.value = true
            listUser(query.value).then(rsp => {
                loading.value = false
                loadingDown.value = false;
                query.value.page_num++
                if (rsp.data.data == null) {
                    finished.value = true
                    return;
                }
                for (let i = 0; i < rsp.data.data.length; i++) {
                    list.value.push(rsp.data.data[i])
                }
                if (rsp.data.count <= list.value.length) {
                    finished.value = true
                }
            })
        }

        const showUserInfoClick = (item) => {
            optUser.value = item
            showUserInfo.value = true
        }

        const close = (isRefresh) => {
            showEditUser.value = false
            showUserInfo.value = false
            if (isRefresh)
                refresh()
        }

        return {
            ...toRefs(state),
            close,
            list,
            onLoad,
            loading,
            loadingDown,
            showEditUser,
            showUserInfo,
            query,
            refresh,
            finished,
            addUserClick,
            showUserInfoClick,
            optUser,
            created: {}
        }
    },
}
</script>

<style lang="less">
.user-manger-content {
    .txt_blod {
        font-weight: bold;
    }

    /* //pull 和 list 冲突解决 */
    .van-pull-refresh {
        height: calc(100vh - 120px) !important;
        overflow: auto !important;
    }

    .van-list {
        height: auto !important;
    }


    .header_bg {
        /*background: url("@/static/images/home_header_bg.png") no-repeat;*/
        /* height: 273px; */
        min-height: 273px;
        background: linear-gradient(133.170274567372deg, rgba(225, 175, 144, 1) 1%, rgba(208, 117, 59, 1) 98%);
        /* border-radius: 0px 0px 10px 10px; */
    }

    .header_bg .header_bg_img {
        min-height: 273px;
        background: url("~@/static/images/home_header_bg.png") no-repeat right 20px top 40px;
        background-size: 150px 220px;
        padding-bottom: 10px;
    }

    .header_top {
        padding-top: 52px;
        padding-left: 10px;
        /* height: 50px; */
        /*line-height: 22px;*/
        /*vertical-align: bottom;*/
    }

    .header_ico {
        height: 22px;
        width: 22px;
        display: inline-block;
        vertical-align: middle;
    }

    .header_logo {
        padding-left: 5px;
        height: 22px;
        display: inline-block;
        width: auto;
        vertical-align: middle;
    }

    .header_span {
        font-size: 14px;
        color: #fff;
        font-weight: bold;
        padding-left: 10px;
        vertical-align: bottom;
    }

    .van-search {
        background: transparent;
        height: 23px;
        float: right;
    }

    .van-search__content--round {
        height: 25px;
    }

    .card-manager {
        text-align: center;
        background-color: #fff;
        box-shadow: 1px 1px 5px rgb(155 155 155 / 20%);
        font-size: 13px;
        padding-left: 15px;
        height: 64px;
        /*flex 布局*/
        display: flex;
        /*实现垂直居中*/
        align-items: center;
        border-radius: 5px;
        margin-top: 5px;
    }

    .card-manager .left {
        /* padding: 15px; */
        text-align: left;
    }

    .card-manager .van-row {
        width: 100%;
        /*实现垂直居中*/
        /* align-items: center; */
    }

    .card-manager .van-row .van-col {
        /*实现垂直居中*/
        align-items: center;
        /*flex 布局*/
        display: flex;
        width: 100%;
    }
}
</style>



