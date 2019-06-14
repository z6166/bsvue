<template>
    <div>
        <ChatBox
                v-if="this.chatvisible"
                :aid="this.nowid"
                :visible="chatvisible"
                @cancel="closechat"></ChatBox>
        <a-list
                :bordered="true"
                itemLayout="horizontal"
                :dataSource="data"
        >
            <a-list-item slot="renderItem" slot-scope="item, index" class="chatbutton">
                    <a-list-item-meta
                            @click="showchat(item.another_id,item.unread)"
                            :description="'未读记录:'+item.unread"
                    >
                        <a slot="title">用户:{{item.another_id}}</a>
                    </a-list-item-meta>
            </a-list-item>
        </a-list>
    </div>
</template>

<script>
    import ChatBox from "@/components/ChatBox"

    export default {
        name: "Message",
        components: {ChatBox},
        data() {
            return {
                chatvisible: false,
                nowid: "",
                data: [],
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            showchat(id,readed) {
                this.nowid = id;
                this.chatvisible = true;
                this.$emit("readed",readed)
            },
            closechat() {
                this.chatvisible = false;
            },
            init() {
                this.$axios
                    .get("http://" + this.baseurl + "/api/msglist")
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.data = response.data.data;
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
    .chatbutton {
        font-weight: bold;
        padding: 10px;
        background: lightskyblue;
        cursor: pointer;
        transition: box-shadow 0.5s;
        -webkit-transition: box-shadow 0.5s;
    }

    .chatbutton:hover {
        box-shadow:5px 5px 10px gray;
    }
</style>
