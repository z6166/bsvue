<template>
    <a-modal
            :visible="visible"
            title='Chat'
            @cancel="() => { $emit('cancel') }"
            :footer="null"
    >
        <div v-for="(item,index) in msgList" :key="index" class="chat-box">{{item}}</div>
        <input type="text" v-model="msg"/>
        <button @click="send">发送</button>
    </a-modal>
</template>
<script>
    export default {
        name: "ChatBox",
        props:["aid","visible"],
        computed:{
          reversemsg(){
              return this.msgList.reverse();
          }
        },
        data() {
            return {
                msg: '',
                to:'',
                ws: '',
                msgList: []
            }
        },
        methods: {
            start(i){
                this.ws.send(
                    JSON.stringify({
                        action:"start",
                        aid:i.toString()
                    }));
            },
            send() {
                this.ws.send(
                    JSON.stringify({
                        action:"send",
                        msg: this.msg,
                        aid:this.$props.aid.toString()
                    }));
                this.msgList.push(this.msg);
                this.msg = ''
            }
        },
        mounted() {
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
                        action:"join",
                        uid:this.$cookies.get("uid"),
                        token:this.$cookies.get("token"),
                    }));
                this.start(this.$props.aid)
            };
            // 接收到消息时触发
            this.ws.onmessage = (evt) => {
                console.log(evt);
                var obj = JSON.parse(evt.data);
                if(obj.code === 0){
                    console.log(obj.data);
                    for(var j = obj.data.length-1; j >= 0; j--){
                        console.log(obj.data[j]);
                        this.msgList.push(obj.data[j].content)
                    }
                }

            };
            this.ws.onclose = () => {
                console.log('Connection close !!!')
            };
        },
        // 关闭连接
        beforeDestroy() {
            this.ws.close()
        }
    }
</script>

<style scoped>

</style>
