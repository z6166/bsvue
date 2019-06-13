<template>
    <div :style="contentStyleObj">
        <a-row>
            <a-col :span="8">
                <a-card
                        hoverable
                        :bordered=true
                        :hoverable=false
                >
                    <img
                            v-if="this.pic_tmp"
                            :alt="this.bookname_tmp"
                            :src="this.pic_tmp"
                            slot="cover"
                            :style="imgStyle"
                    />
                    <img
                            v-else
                            alt="暂无图片"
                            src="http://psx59ycao.bkt.clouddn.com/35574339ab3c813.jpg"
                            slot="cover"
                            :style="imgStyle"
                    />
                    <a-card-meta
                            :title="this.bookname_tmp">
                        <template slot="description">价格：{{ this.pricenow_tmp }}￥</template>
                    </a-card-meta>
                </a-card>
            </a-col>
            <a-col :span="16">
                <a-form
                        :form="form"
                        @submit="handleSubmit">
                    <a-form-item label="书编号" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-input :disabled=true
                                 v-model="this.bookid_tmp"
                        />
                    </a-form-item>
                    <a-form-item label="交易方式" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-select v-model="ordertype" style='width: 120px'>
                            <a-select-option disabled value="">请选择</a-select-option>
                            <a-select-option value="0">邮寄</a-select-option>
                            <a-select-option value="1">线下交易</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item v-if="ordertype==='0'" label="收货地址" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-input
                                v-decorator="[
                'address',
                {
                    rules:
                        [
                            {
                                message: '请正确输入收货地址！',
                                min:6
                            }
                        ]
                }
            ]"
                                placeholder="填入收货地址"
                        />
                    </a-form-item>
                    <a-form-item style="text-align:center;">
                        <a-button
                                type="primary"
                                html-type="submit"
                                class="login-form-button"
                        >
                            提交订单
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import qiniu from 'qiniu';
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ARow from "ant-design-vue/es/grid/Row";

    export default {
        name: "OrderCreate",
        components: {ARow, AFormItem},
        beforeCreate() {
            this.form = this.$form.createForm(this);
            this.form.hideRequiredMark = true
        },
        mounted(){
            if (!this.$cookies.isKey('token')) {
                this.$message.error("请先登录系统！");
                this.$router.push('/');
            }
            this.bookinfo();
        },
        created(){
            this.contentStyleObj.width=window.screen.width/2-200+'px';
            this.imgStyle.height = (window.screen.width / 2) / 4 + 'px';
        },
        data() {
            return {
                imgStyle: {
                    height: ""
                },
                contentStyleObj:{
                    width:'',
                    "margin":"auto"
                },
                bookid_tmp:"",
                bookname_tmp:"",
                pic_tmp:"",
                pricenow_tmp:"",
                ordertype:"",
                formItemLayout: {
                    labelCol: {span: 6},
                    wrapperCol: {span: 14},
                },
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 12},
                },
            };
        },
        methods: {
            bookinfo() {
                this.bookid_tmp = this.$route.params.id;
                this.$axios
                    .get(this.baseurl+"/book/show/" + this.$route.params.id)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.bookname_tmp = response.data.data.bookname;
                                this.pic_tmp = response.data.data.pic;
                                this.pricenow_tmp = response.data.data.pricenow;
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        if(this.ordertype === '0' && values.address.length<6){
                            this.$message.error("请正确填写收货地址！");
                            return;
                        }
                        console.log('Received values of form: ', values);
                        let data = new FormData();
                        data.append("bookid", this.$route.params.id);
                        data.append("ordertype", this.ordertype);
                        if(this.ordertype === '0'){
                            data.append("address", values.address);
                        }
                        this.$axios
                            .post(this.baseurl+"/api/createorder", data)
                            .then(
                                response => {
                                    if (response.data.code === 0) {
                                        this.$message.success(response.data.data.msg);
                                        this.$router.push("/")
                                    } else if (response.data.code === -10) {
                                    } else {
                                        this.$message.error(response.data.msg)
                                    }
                                }
                            )
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
