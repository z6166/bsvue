<template>
    <div class="Register">
        <a-modal
                :visible="visible"
                title='注册'
                @cancel="() => { $emit('cancel') }"
                :footer="null"
        >

            <a-form
                    layout="vertical"
                    :form="form"
                    @submit="handleSubmit"
            >
                <a-form-item
                        label="用户名"
                        :validate-status="userNameError() ? 'error' : ''"
                        :help="userNameError() || ''"
                >
                    <a-input
                            v-decorator="[
          'userName',
          {rules: [{ required: true, message: '请正确输入用户名!',min:6,max:20 }]}
        ]"
                            placeholder="Username"
                    >
                        <a-icon
                                slot="prefix"
                                type="user"
                        />
                    </a-input>
                </a-form-item>
                <a-form-item
                        label="邮箱"
                        :validate-status="emailError() ? 'error' : ''"
                        :help="emailError() || ''"
                >
                    <a-input
                            v-decorator="[
          'email',
          {rules: [{ required: true, message: '请正确输入邮箱!',pattern:'^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$'}]}
        ]"
                            placeholder="Email"
                    >
                        <a-icon
                                slot="prefix"
                                type="mail"
                        />
                    </a-input>
                </a-form-item>
                <a-form-item
                        label="密码"
                        :validate-status="passwordError() ? 'error' : ''"
                        :help="passwordError() || ''"
                >
                    <a-input
                            v-decorator="[
          'password',
          {rules: [{ required: true, message: '请正确输入密码!',min:6,max:20 }]}
        ]"
                            type="password"
                            placeholder="Password"
                    >
                        <a-icon
                                slot="prefix"
                                type="lock"
                        />
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button
                            type="primary"
                            html-type="submit"
                            :disabled="hasErrors(form.getFieldsError())"
                    >
                        注册
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>

    function hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }



    export default {
        name: "Register",
        props: ['visible'],
        beforeCreate() {
            this.form = this.$form.createForm(this);
            this.form.hideRequiredMark = true
        },
        data() {
            return {
                hasErrors,
                form: this.$form.createForm(this),
            };
        },
        mounted() {
            this.$nextTick(() => {
                // To disabled submit button at the beginning.
                this.form.validateFields();
            });
        },
        methods: {
            // Only show error after a field is touched.
            userNameError() {
                const {getFieldError, isFieldTouched} = this.form;
                return isFieldTouched('userName') && getFieldError('userName');
            },
            // Only show error after a field is touched.
            passwordError() {
                const {getFieldError, isFieldTouched} = this.form;
                return isFieldTouched('password') && getFieldError('password');
            },
            emailError(){
                const {getFieldError, isFieldTouched} = this.form;
                return isFieldTouched('email') && getFieldError('email');
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        let data = new FormData();
                        data.append("username", values.userName);
                        data.append("email", values.email);
                        data.append("password", values.password);
                        this.$axios
                            .post("http://"+this.baseurl+"/api/register", data)
                            .then(
                                response => {
                                    if (response.data.code === 0) {
                                        this.$message.success("注册成功！");
                                        this.$emit("cancel");
                                        this.$router.push('/');
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
