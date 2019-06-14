<template>
    <div class="home" :style="contentStyleObj">
        <Search></Search>
        <h1>最新上架</h1>
        <div style="background-color: #ececec; padding: 20px;">
            <div v-for="(book,i) in books">
                <router-link :to="'/book/show/'+ book.bookid" style="padding: 0 10px">
                    <a-card
                            hoverable
                            :bordered=false
                            :hoverable=true
                    >
                        <div class="mycard">
                            <div style="overflow: hidden;width: 220px;height: 270px">
                                <img
                                        v-if="book.pic"
                                        :alt="book.bookname"
                                        :src="book.pic"
                                        style="width: 100%"
                                />
                                <img
                                        v-else
                                        alt="暂无图片"
                                        src="http://psx59ycao.bkt.clouddn.com/35574339ab3c813.jpg"
                                        style="width: 100%"
                                />
                            </div>
                            <div class="right">
                                <a-card-meta>
                                    <h1 slot="title" style="display:inline;">{{ book.bookname }}</h1>
                                    <template slot="description">价格：{{ book.pricenow }}￥</template>
                                </a-card-meta>
                                <a-divider/>
                                <h3>内容简介：</h3>
                                <p v-if="book.content !== ''">发布者未填写内容简介</p>
                                <p v-else>{{book.content}}</p>
                            </div>
                        </div>
                    </a-card>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import Search from "@/components/Search";

    export default {
        name: 'home',
        components: {Search},
        data() {
            return {
                imgStyle: {
                    height: ""
                },
                contentStyleObj: {
                    width: '',
                    "margin": "auto",
                    "padding-top": "40px",
                    "padding-bottom": "40px"
                },
                books: "",
            }
        },
        component: {
            Search
        },
        created() {
            this.contentStyleObj.width = window.screen.width / 2 - 200 + 'px';
            this.imgStyle.height = (window.screen.width / 2) / 5 + 'px';
        },
        mounted() {
            this.getbooklist();
        },
        methods: {
            getbooklist() {
                this.$axios
                    .get("http://" + this.baseurl + "/api/info", {
                        params: {
                            num: 10,
                            reserve: 1
                        }
                    })
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.books = response.data.data
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            }
        }
    }
</script>

<style>
    .mycard {
        display: flex;
    }

    .right {
        padding: 0 30px;
        flex: 1;
    }
</style>
