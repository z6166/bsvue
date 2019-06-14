<template>
    <div class="User">
        <div class="left">
            <a-menu
                    style="width: 350px"
                    :defaultSelectedKeys="['1']"
                    :defaultOpenKeys="['sub1']"
                    mode="inline"
                    theme="light"
                    :selectedKeys="[current]"
                    @click="handleClick"
            >
                <a-menu-item key="0">
                    <a-icon type="user"/>
                    个人信息
                </a-menu-item>
                <a-menu-item key="1">
                    <a-icon type="message"/>
                    消息
                    <a-badge :count="this.unread">
                    </a-badge>
                </a-menu-item>
                <a-menu-item key="2">
                    <a-icon type="wallet" />
                    我买到的
                </a-menu-item>
                <a-menu-item key="3">
                    <a-icon type="wallet" />
                    我卖出的
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <span slot="title"><a-icon type="bars"/><span>菜单</span></span>
                    <a-menu-item key="4">
                        <a-icon type="search"/>
                        发布图书
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item key="5">
                    <a-icon type="setting"/>
                    设置
                </a-menu-item>
            </a-menu>
        </div>
        <div class="right">
            <br/>
            <br/>
            <component @readed="changeunread" @changeview="changeview" :is="currentView"></component>
        </div>
    </div>
</template>
<script>
    import Userinfo from "../components/Userinfo.vue";
    import Bookadd from "../components/Bookadd.vue";
    import Websetting from "../components/Websetting.vue";
    import Ordershow from "../components/Ordershow"
    import Sellshow from "../components/Sellshow"
    import Message from "../components/Message"

    export default {
        name: 'user',
        components: {
            Userinfo,
            Message,
            Ordershow,
            Sellshow,
            Bookadd,
            Websetting,
        },
        data() {
            return {
                unread:null,
                stockid:null,
                current: '0',
                arr: [
                    'Userinfo',
                    'Message',
                    "Ordershow",
                    "Sellshow",
                    'Bookadd',
                    'Websetting',
                ],
            }
        },
        mounted() {
            if (!this.$cookies.isKey('token')) {
                this.$message.error("请先登录系统！");
                this.$router.push('/');
            }
            this.getmesasge()
        },
        computed: {
            currentView() {
                return this.arr[parseInt(this.current)];
            }
        },
        methods: {
            changeunread(data){
                this.unread-=data
            },
            getmesasge(){
                this.$axios
                    .get("http://"+this.baseurl+"/api/msgcount")
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.unread = response.data.data.unread
                            } else {
                                this.$message.error(response.data.msg)
                            }
                        }
                    )
            },
            handleClick(e) {
                console.log('click ', e);
                this.stockid = null;
                this.current = e.key;
            },
            changeview(data){
                this.current = data.page;
                this.stockid = data.id;
            }
        },
    }

</script>

<style>
    .User {
        display: flex;
    }

    .right {
        padding: 0 30px;
        flex: 1;
    }
</style>
