<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider
                :trigger="null"
                collapsible
                v-model="collapsed"
        >
            <a-menu
                    :defaultSelectedKeys="['1']"
                    :defaultOpenKeys="['sub1']"
                    mode="inline"
                    theme="dark"
                    :selectedKeys="[current]"
                    @click="handleClick"
            >
                <a-menu-item key="0">
                    <a-icon type="user"/>
                    <span>个人信息</span>
                </a-menu-item>
                <a-menu-item key="1">
                    <a-icon type="message"/>
                    <span>消息</span>
                    <a-badge :count="this.unread">
                    </a-badge>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <span slot="title"><a-icon type="bars"/><span>菜单</span></span>
                    <a-menu-item key="2">
                        <a-icon type="wallet" />
                        <span>我买到的</span>
                    </a-menu-item>
                    <a-menu-item key="3">
                        <a-icon type="wallet" />
                        <span>我卖出的</span>
                    </a-menu-item>
                    <a-menu-item key="6">
                        <a-icon type="wallet" />
                        <span>我的求购</span>
                    </a-menu-item>
                    <a-menu-item key="4">
                        <a-icon type="book" />
                        <span>发布图书</span>
                    </a-menu-item>
                    <a-menu-item key="5">
                        <a-icon type="search"/>
                        <span>发布求购</span>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item key="7">
                    <a-icon type="setting"/>
                    <span>设置</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-icon
                        class="trigger"
                        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                        @click="()=> collapsed = !collapsed"
                />
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
                <component @readed="changeunread" @changeview="changeview" :is="currentView"></component>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
    import Userinfo from "../components/Userinfo.vue";
    import Bookadd from "../components/Bookadd.vue";
    import Websetting from "../components/Websetting.vue";
    import Ordershow from "../components/Ordershow"
    import Sellshow from "../components/Sellshow"
    import Message from "../components/Message"
    import Wantedadd from "../components/Wantedadd"
    import Wantedshow from "../components/Wantedshow"

    export default {
        name: 'user',
        components: {
            Userinfo,
            Message,
            Ordershow,
            Sellshow,
            Bookadd,
            Wantedadd,
            Wantedshow,
            Websetting,
        },
        data() {
            return {
                collapsed: false,
                unread:null,
                stockid:null,
                current: '0',
                arr: [
                    'Userinfo',
                    'Message',
                    "Ordershow",
                    "Sellshow",
                    'Bookadd',
                    "Wantedadd",
                    "Wantedshow",
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
    #components-layout-demo-custom-trigger .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color .3s;
    }

    #components-layout-demo-custom-trigger .trigger:hover {
        color: #1890ff;
    }

    #components-layout-demo-custom-trigger .logo {
        height: 32px;
        background: rgba(255,255,255,.2);
        margin: 16px;
    }
</style>
