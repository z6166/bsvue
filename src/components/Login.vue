<template>
    <div class="Login">
        <a-modal
                :visible="visible"
                title='登录'
                @cancel="() => { $emit('cancel') }"
                :footer="null"
        >

            <a-form
                    id="components-form-demo-normal-login"
                    layout="vertical"
                    :form="form"
                    @submit="handleSubmit"
                    class="login-form"
            >
                <a-form-item
                        :validate-status="userNameError() ? 'error' : ''"
                        :help="userNameError() || ''"
                >
                    <a-input
                            v-decorator="[
          'userName',
          {rules: [{ required: true, message: 'Please input your username!',min:4,max:20 }]}
        ]"
                            placeholder="Username"
                    >
                        <a-icon
                                slot="prefix"
                                type="user"
                                style="color:rgba(0,0,0,.25)"
                        />
                    </a-input>
                </a-form-item>
                <a-form-item
                        :validate-status="passwordError() ? 'error' : ''"
                        :help="passwordError() || ''"
                >
                    <a-input
                            v-decorator="[
          'password',
          {rules: [{ required: true, message: 'Please input your Password!',min:6,max:12 }]}
        ]"
                            type="password"
                            placeholder="Password"
                    >
                        <a-icon
                                slot="prefix"
                                type="lock"
                                style="color:rgba(0,0,0,.25)"
                        />
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button
                            type="primary"
                            html-type="submit"
                            class="login-form-button"
                    >
                        Log in
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
        name: "Login",
        props: ['visible'],
        beforeCreate() {
            this.form = this.$form.createForm(this);
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
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        let data = new FormData();
                        data.append("username", values.userName);
                        data.append("password", values.password);
                        this.$axios
                            .post(this.baseurl+"/api/login",data)
                            .then(
                                response => {
                                    if (response.data.code === 0) {
                                        let expireDays = 1000 * 60 * 60 * 24 * 15;
                                        this.$cookies.set('token', response.data.data.token, expireDays);
                                        this.$cookies.set("username", response.data.data.username, expireDays);
                                        this.$cookies.set("uid", response.data.data.uid, expireDays);
                                        //this.setCookie("token", response.data.data.token, expireDays);
                                        //this.setCookie("username", response.data.data.user_name, expireDays);
                                        //登录成功后
                                        this.$message.success("登录成功！");
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
    #components-form-demo-normal-login .login-form {
        max-width: 300px;
    }
    #components-form-demo-normal-login .login-form-forgot {
        float: right;
    }
    #components-form-demo-normal-login .login-form-button {
        width: 100%;
    }
</style>
