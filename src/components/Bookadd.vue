<template>
    <a-form
            :form="form"
            @submit="handleSubmit">
        <a-form-item label="书名" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
            v-decorator="[
                'bookname',
                {
                    rules:
                        [
                            {
                                required: true,
                                message: '请正确输入书名！'
                            }
                        ]
                }
            ]"
            placeholder="填入书本名"
            />
        </a-form-item>
        <a-form-item label="原价" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
                    v-decorator="[
                'priceori',
                {
                    rules:
                        [
                            {
                                required: true,
                                message: '请正确输入原价！'
                            }
                        ]
                }
            ]"
                    placeholder="填入原价"
            />
        </a-form-item>
        <a-form-item label="出售价" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
                    v-decorator="[
                'pricenow',
                {
                    rules:
                        [
                            {
                                required: true,
                                message: '请正确输入出售价！'
                            }
                        ]
                }
            ]"
                    placeholder="填入出售价"
            />
        </a-form-item>
        <a-form-item label="类别" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
                    v-decorator="[
                'category',
                {
                    rules:
                        [
                            {
                                required: true,
                                message: '请正确输入类别！'
                            }
                        ]
                }
            ]"
                    placeholder="填入类别"
            />
        </a-form-item>
        <a-form-item label="内容介绍" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
                    v-decorator="[
                '_content',
                {
                    rules:
                        [
                            {
                                required: false,
                                message: '请正确输入内容介绍！（至多500个字）',
                                max:500
                            }
                        ]
                }
            ]"
                    placeholder="填入内容简介"></a-textarea>
        </a-form-item>
        <a-form-item label="外部链接" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
                    v-decorator="[
                'bookurl',
                {
                    rules:
                        [
                            {
                                required: false,
                            }
                        ]
                }
            ]"
                    placeholder="填入外部链接"
            />
        </a-form-item>
        <a-form-item
                :label-col="labelCol" :wrapper-col="wrapperCol"
                v-bind="formItemLayout"
                label="图片"
        >
            <a-upload
                    :data="this.formData"
                    name="file"
                    accept="image/*"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    action="https://upload.qiniup.com"
                    :beforeUpload="beforeUpload"
                    @change="handleChange"
            >
                <img v-if="imageUrl" style="height: 102px;width: 102px" :src="imageUrl" alt="avatar" />
                <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">Upload</div>
                </div>
            </a-upload>

        </a-form-item>
        <a-form-item style="text-align:center;">
            <a-button
                    type="primary"
                    html-type="submit"
                    style="width:200px"
            >
                提交
            </a-button>
        </a-form-item>

    </a-form>
</template>

<script>
    import qiniu from 'qiniu';
    import AFormItem from "ant-design-vue/es/form/FormItem";

    export default {
        name: "Bookadd",
        components: {AFormItem},
        beforeCreate() {
            this.form = this.$form.createForm(this);
            this.form.hideRequiredMark = true
        },
        created(){
            this.getToken();
        },
        data () {
            return {
                formData:{
                    token:'',
                    mac:'',
                    bucketManager:''
                },
                loading: false,
                imageUrl: '',
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 14 },
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 12 },
                },
            };
        },
        methods:{
            getToken(){
                this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
                var options = {
                    scope: this.bucket,
                };
                var putPolicy = new qiniu.rs.PutPolicy(options);
                var uploadToken=putPolicy.uploadToken(this.mac);
                console.log(uploadToken);
                this.formData.token = uploadToken;
                var config = new qiniu.conf.Config();
                this.bucketManager = new qiniu.rs.BucketManager(this.mac, config);
            },
            handleSubmit(e) {
                if(this.loading){
                    this.$message.error("请等待图片上传完毕！")
                    return
                }
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        let data = new FormData();
                        data.append("bookname", values.bookname);
                        data.append("priceori", values.priceori);
                        data.append("pricenow", values.pricenow);
                        data.append("category", values.category);
                        data.append("content", values._content);
                        data.append("bookurl", values.bookurl);
                        data.append("pic", this.imageUrl);
                        this.$axios
                            .post(this.baseurl+"/book/add", data)
                            .then(
                                response => {
                                    if (response.data.code === 0) {
                                        this.$message.success(response.data.data.msg);
                                        this.$router.push("/book/show/"+response.data.data.id)
                                    } else if(response.data.code === -10) {
                                    }else {
                                        this.$message.error(response.data.msg)
                                    }
                                }
                            )
                    }
                });
            },
            handleChange (info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return
                }
                if (info.file.status === 'done') {
                    this.getUrl(info.file.response.key);
                    this.loading = false;
                }
            },
            getUrl(key){
                this.imageUrl = "http://" + this.bucketManager.publicDownloadUrl(this.publicBucketDomain, key);
            },
            beforeUpload (file) {
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
