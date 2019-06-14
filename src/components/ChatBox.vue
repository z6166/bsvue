<template>
    <a-modal
            :visible="visible"
            :title='"Chat to " + data.name'
            @cancel="() => { $emit('cancel') }"
            :footer="null"
    >
        <div id="msgarea" class="chat-box">
            <div v-for="(item,index) in msgList" :key="index">
                <a-comment v-if="item.uid.toString() !== $cookies.get('uid')">
                    <a slot="author">{{data.name}}</a>
                    <a-avatar
                            :src="data.face"
                            :alt="data.name"
                            slot="avatar"
                    />
                    <p slot="content" style="float:left;background-color:lightcyan;padding:0 5px;">{{item.content}}</p>
                    <a-tooltip slot="datetime">
                        <span>{{item.time}}</span>
                    </a-tooltip>
                </a-comment>
                <a-comment v-else>
                    <a-tooltip slot="datetime">
                        <span>{{item.time}}</span>
                    </a-tooltip>
                    <p slot="content" style="float:right;background-color:lightcyan;padding:0 5px;">{{item.content}}</p>
                </a-comment>
            </div>
        </div>
        <a-input type="text" @pressEnter="send" v-model="msg">
            <a-icon slot="suffix" @click="send" style="font-size:x-large;color: blue" type="caret-right"/>
        </a-input>
    </a-modal>
</template>
<script>
    function tobottom() {
        var div = document.getElementById('msgarea');
        div.scrollTop = div.scrollHeight;
    }

    export default {
        name: "ChatBox",
        props: ["aid", "visible"],
        data() {
            return {
                data: {
                    email: null,
                    username: null,
                    name: null,
                    face:null,
                },
                msg: '',
                to: '',
                ws: '',
                msgList: [],
            }
        },
        watch: {
            msgList: 'scrollToBottom'
        },
        mounted() {
            if(this.$props.aid.toString() === this.$cookies.get("uid"))
            {
                this.$message.error("你不能和自己聊天！");
                this.$emit("cancel")
            }
            this.init();
            if (!this.$cookies.isKey('token')) {
                this.$message.error("请先登录系统！");
                this.$emit('cancel')
            }
            this.ws = new WebSocket("ws://" + this.baseurl + "/api/chat");

            // 连接打开时触发
            this.ws.onopen = () => {
                console.log("Connection open ...");
                this.ws.send(
                    JSON.stringify({
                        action: "join",
                        uid: this.$cookies.get("uid"),
                        token: this.$cookies.get("token"),
                    }));
                this.start(this.$props.aid);
                tobottom();
            };
            // 接收到消息时触发
            this.ws.onmessage = (evt) => {
                console.log(evt.data);
                var obj = JSON.parse(evt.data);
                if (obj.code === 0) {
                    for (var j = obj.data.length - 1; j >= 0; j--) {
                        var unit = {
                            content: obj.data[j].content,
                            uid: obj.data[j].user_id,
                            time: this.getTime(obj.data[j].time)
                        };
                        this.msgList.push(unit)
                    }
                }
            };
            this.ws.onclose = () => {
                console.log('Connection close !!!')
            };
        },
        methods: {
            init() {
                this.$axios
                    .get("http://" + this.baseurl + "/api/userinfo/" + this.$props.aid)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.data = response.data.data;
                                if(this.data.name === ""){
                                    this.data.name = "用户:" + this.data.username
                                }
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            },
            scrollToBottom() {
                this.$nextTick(() => {
                    var div = document.getElementById('msgarea');
                    div.scrollTop = div.scrollHeight
                })
            },
            start(i) {
                this.ws.send(
                    JSON.stringify({
                        action: "start",
                        aid: i.toString()
                    }));
            },
            send() {
                if(this.msg === ""){
                    this.$message.error("请填写内容");
                    return
                }
                this.ws.send(
                    JSON.stringify({
                        action: "send",
                        msg: this.msg,
                        aid: this.$props.aid.toString()
                    }));
                this.msg = '';
            }
        },
        // 关闭连接
        beforeDestroy() {
            this.ws.close()
        }
    }
</script>

<style scoped>
    .chat-box {
        height: 500px;
        overflow: scroll;
    }
</style>
