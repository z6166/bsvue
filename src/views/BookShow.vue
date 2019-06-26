<template>
    <div class="bookshow" :style="contentStyleObj">
        <Othershow
                v-if="this.visible"
                :uid = "this.uid"
                :visible="visible"
                @cancel="closeother"></Othershow>
        <a-row>
            <a-col :span="8">
                <a-card
                        :bordered=true
                        :hoverable=false
                >
                    <img
                            v-if="this.pic !== ''"
                            :alt="this.bookname"
                            :src="this.pic"
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
                            style="text-align:center;"
                            :title="this.bookname">
                        <template slot="description">
                            原价：{{ this.priceori }}￥
                            <br/>
                            现价：{{ this.pricenow }}￥
                            <br/>
                            类型：{{ this.category }}
                            <p v-if="this.state === 0">可购买</p>
                            <p v-else>已售出</p>
                            <p style="display: inline">卖家:</p>
                            <a v-if="this.name !== ''"  @click="showModal()">{{this.name}}</a>
                            <a v-else  @click="showModal()">用户：{{this.username}}</a>
                            <br/>
                            <a :href="this.bookurl">外部链接</a>
                        </template>
                    </a-card-meta>
                </a-card>
            </a-col>
            <a-col :span="3"></a-col>
            <a-col :span="13">
                内容简介：
                <div style="background-color: #ececec; padding: 20px;font-size: medium">
                    <p>{{ this.content }}</p>
                </div>
                <br>
                <div style="text-align:center;">
                <router-link :to="'/book/buy/' + this.$route.params.id">
                    <a-button
                            v-if="this.state === 0"
                            type="primary"
                            size="large"
                    >
                        购买
                    </a-button>
                    <a-button
                            v-else
                            type="primary"
                            :disabled=true
                            size="large"
                    >
                        售罄
                    </a-button>
                </router-link>
                </div>
            </a-col>
        </a-row>

    </div>
</template>

<script>
    import Othershow from "@/components/Othershow";
    export default {
        name: "BookShow",
        components:{Othershow},
        data() {
            return {
                visible:false,
                imgStyle: {
                    height: ""
                },
                contentStyleObj:{
                    width:'',
                    "margin":"auto",
                    "padding-top":"40px",
                    "padding-bottom":"40px"
                },
                bookname: "",
                bookurl: "",
                category: "",
                content: "",
                pic: "",
                priceori: "",
                pricenow: "",
                uid: "",
                state: "",
                username:"",
                name:""
            }
        },
        created(){
            this.contentStyleObj.width=window.screen.width/3+'px';
            this.imgStyle.height = (window.screen.width / 2) / 4 + 'px';
        },
        mounted() {
            this.getbookinfo();
        },
        methods: {
            showModal() {
                console.log(this.nowid);
                this.visible = true;
            },
            closeother() {
                this.visible = false;
            },
            getbookinfo() {
                this.$axios
                    .get("http://" + this.baseurl+"/book/show/" + this.$route.params.id)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.uid = response.data.data.uid;
                                this.state = response.data.data.state;
                                this.bookname = response.data.data.bookname;
                                this.bookurl = response.data.data.bookurl;
                                this.category = response.data.data.category;
                                this.content = response.data.data.content;
                                this.pic = response.data.data.pic;
                                this.priceori = response.data.data.priceori;
                                this.pricenow = response.data.data.pricenow;
                                this.username = response.data.data.username;
                                this.name = response.data.data.name;
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            }
        }
    }
</script>

<style scoped>

</style>
