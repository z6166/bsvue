<template>
    <a-modal
            :visible="visible"
            @cancel="() => { $emit('cancel') }"
            :footer="null"
    >
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
        </div>
    </a-modal>
</template>

<script>
    export default {
        name: "Othershow",
        props:["uid","visible"],
        data() {
            return {
                data: {
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
            init() {
                this.$axios
                    .get(this.baseurl + "/api/userinfo/" + this.$props.uid)
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
