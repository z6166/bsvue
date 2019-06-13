<template>
    <div class="Userinfo" style="font-size: medium;text-align:center;">
        <a-upload
                :data="this.formData"
                name="file"
                accept="image/*"
                listType="picture"
                class="avatar-uploader"
                :showUploadList="false"
                action="https://upload.qiniup.com"
                :beforeUpload="beforeUpload"
                @change="handleChange"
        >
            <a-avatar v-if="this.data.face===''" :size="128">点击上传头像</a-avatar>
            <a-avatar v-else :size=" 128" :src="this.data.face"/>
        </a-upload>
        <br/>
        <br/>
        <p>用户名：{{ this.data.username }}</p>
        <br/>
        <p>邮箱：{{ this.data.email }}</p>
        <br/>
        <div v-if="!editingname">
            <p style="display:inline;" v-if="this.data.name!==''">昵称：{{this.data.name}} </p>
            <p style="display:inline;" v-else>昵称：Undefined </p>
            <a-icon @click="editname" type="edit"/>
        </div>
        <div v-else>
            <a-input v-model="newname" @pressEnter="newnameevent" style="width: 30%">
                <a-icon slot="suffix" @click="newnameevent" style="color: green" type="check" />
                <a-icon slot="suffix" @click="cancelnewname" style="color: red;" type="close" />
            </a-input>
        </div>
    </div>
</template>

<script>
    import qiniu from 'qiniu';

    export default {
        name: "Userinfo",
        data() {
            return {
                newname:"",
                editingname: false,
                formData: {
                    token: '',
                    mac: '',
                    bucketManager: ''
                },
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
        created() {
            this.getToken();
        },
        methods: {
            newnameevent(){
                let data = new FormData();
                data.append("newname", this.newname);
                this.$axios
                    .post(this.baseurl + "/api/changename", data)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.$message.success("更换昵称成功！");
                                this.init();
                            } else {
                                this.$message.error(response.data.msg)
                            }
                        }
                    );
                this.editingname = false;
            },
            cancelnewname(){
                this.editingname = false;
            },
            editname() {
                this.editingname = true;
            },
            getToken() {
                this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
                var options = {
                    scope: this.bucket,
                };
                var putPolicy = new qiniu.rs.PutPolicy(options);
                var uploadToken = putPolicy.uploadToken(this.mac);
                console.log(uploadToken);
                this.formData.token = uploadToken;
                var config = new qiniu.conf.Config();
                this.bucketManager = new qiniu.rs.BucketManager(this.mac, config);
            },
            init() {
                this.$axios
                    .get(this.baseurl + "/api/userinfo/" + this.$cookies.get("uid"))
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
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    return
                }
                if (info.file.status === 'done') {
                    console.log(info.file.response);
                    this.getUrl(info.file.response.key);
                    let data = new FormData();
                    data.append("imageUrl", this.imageUrl);
                    this.$axios
                        .post(this.baseurl + "/api/changeface", data)
                        .then(
                            response => {
                                if (response.data.code === 0) {
                                    this.$message.success("更换头像成功！");
                                    this.init();
                                } else {
                                    this.$message.error(response.data.msg)
                                }
                            }
                        )
                }
                console.log(this.imageUrl);
            },
            getUrl(key) {
                this.imageUrl = "http://" + this.bucketManager.publicDownloadUrl(this.publicBucketDomain, key);
            },
            beforeUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                if (!isJPG) {
                    this.$message.error('You can only upload JPG file!')
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!')
                }
                return isJPG && isLt2M
            },
        }
    }
</script>

<style scoped>
</style>
