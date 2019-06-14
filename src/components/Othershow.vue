<template>
    <a-modal
            :visible="visible"
            @cancel="() => { $emit('cancel') }"
            :footer="null"
    >
        <ChatBox
            v-if="this.chatvisible"
            :aid="this.nowid"
            :visible="chatvisible"
            @cancel="closechat"></ChatBox>
        <div class="Othershow" style="font-size: medium;text-align:center;">
            <a-avatar v-if="this.data.face===''" :size="128">Undefined</a-avatar>
            <a-avatar v-else :size=" 128" :src="this.data.face"/>
            <br/>
            <br/>
            <p>用户名：{{ this.data.username }}</p>
            <br/>
            <p>邮箱：{{ this.data.email }}</p>
            <br/>
            <p style="display:inline;" v-if="this.data.name!==''">昵称：{{this.data.name}} </p>
            <p style="display:inline;" v-else>昵称：Undefined </p>
            <a-button @click="showchat($props.uid)">聊天</a-button>
        </div>
    </a-modal>
</template>

<script>
    import ChatBox from "@/components/ChatBox"
    export default {
        name: "Othershow",
        components:{ChatBox},
        props:["uid","visible"],
        data() {
            return {
                chatvisible:false,
                data: {
                    nowid:"",
                    email: null,
                    username: null,
                    name: null,
                },
                imageUrl: '',
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            showchat(id) {
                this.nowid = id;
                this.chatvisible = true;
            },
            closechat() {
                this.chatvisible = false;
            },
            init() {
                this.$axios
                    .get("http://" + this.baseurl + "/api/userinfo/" + this.$props.uid)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.data = response.data.data
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            },
        }
    }
</script>

<style scoped>
</style>
