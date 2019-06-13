<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <Register
                :visible="visible1"
                @cancel="handleCancel1"></Register>
        <Login
                :visible="visible2"
                @cancel="handleCancel2"></Login>
        <a-layout-header>
            <a-menu
                    theme="dark"
                    mode="horizontal"
                    :defaultSelectedKeys="['1']"
                    :style="{ lineHeight: '64px' }"
            >
                <a-menu-item key="1">
                    <router-link to="/">首页</router-link>
                </a-menu-item>
                <a-dropdown style="float: right;">
                    <a class="ant-dropdown-link" href="#">
                        <a-icon style="font-size: 20px" type="user" />
                    </a>
                    <a-menu slot="overlay" style="width: 100px">
                        <a-menu-item v-if="!this.$cookies.isKey('token')" key="0">
                            <a @click="showModal2">登录</a>
                        </a-menu-item>
                        <a-menu-item v-if="this.$cookies.isKey('token')" key="1"><router-link to="/user" style="color: rgba(0, 0, 0, 0.65)">
                            个人中心</router-link>
                        </a-menu-item>
                        <a-menu-item key="2">
                            <a v-if="!this.$cookies.isKey('token')" @click="showModal1">注册</a>
                            <a v-else @click="alogout">退出</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <br/>
            <br/>
            <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
                <router-view></router-view>
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            bs ©2018 Created by ZSJ
        </a-layout-footer>
    </a-layout>
</template>
<script>
    import Register from "@/components/Register.vue";
    import Login from "@/components/Login.vue";

    export default {
        name: "App",
        components: {Register,Login},
        data() {
            return {
                visible1: false,
                visible2: false,
            };
        },
        methods: {
            alogout(){
                this.logout();
            },
            showModal1() {
                this.visible1 = true;
            },
            handleCancel1() {
                this.visible1 = false;
            },
            showModal2() {
                this.visible2 = true;
            },
            handleCancel2() {
                this.visible2 = false;
            },
        }
    }
</script>
<style>
    #components-layout-demo-top .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, .2);
        margin: 16px 24px 16px 0;
        float: left;
    }
</style>
