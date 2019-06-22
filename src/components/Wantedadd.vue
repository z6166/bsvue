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
        <a-form-item label="期望价格" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
                    v-decorator="[
                'pricewanted',
                {
                    rules:
                        [
                            {
                                required: true,
                                message: '请正确输入期望价格！'
                            }
                        ]
                }
            ]"
                    placeholder="填入期望价格"
            />
        </a-form-item>
        <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-textarea
                    v-decorator="[
                'moreinfo',
                {
                    rules:
                        [
                            {
                                required: false,
                                message: '请正确输入备注信息！（至多500个字）',
                                max:500
                            }
                        ]
                }
            ]"
                    placeholder="填入备注信息"></a-textarea>
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
    import AFormItem from "ant-design-vue/es/form/FormItem";

    export default {
        name: "Wantedadd",
        components: {AFormItem},
        beforeCreate() {
            this.form = this.$form.createForm(this);
            this.form.hideRequiredMark = true
        },
        data () {
            return {
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
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        let data = new FormData();
                        data.append("bookname", values.bookname);
                        data.append("pricewanted", values.pricewanted);
                        data.append("moreinfo", values.moreinfo);
                        this.$axios
                            .post("http://" + this.baseurl+"/book/want", data)
                            .then(
                                response => {
                                    if (response.data.code === 0) {
                                        this.$message.success(response.data.data.msg);
                                        this.$router.push("/")
                                    } else if(response.data.code === -10) {
                                    }else {
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
