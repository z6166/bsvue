<template>
    <div class="home" :style="contentStyleObj">
        <Search></Search>
        <h1>最新上架</h1>
        <div style="background-color: #ececec; padding: 20px;">
            <a-row :gutter="{ xs: 8, sm: 16, md: 24}">
                <div v-for="(book,i) in books">
                    <a-col :span="6">
                        <router-link :to="'/book/show/'+ book.bookid" style="padding: 0 10px">
                            <a-card
                                    hoverable
                                    :bordered=false
                                    :hoverable=true
                            >
                                <img
                                        :alt="book.bookname"
                                        :src="book.pic"
                                        slot="cover"
                                        :style="imgStyle"
                                />
                                <a-card-meta
                                        :title="book.bookname">
                                    <template slot="description">价格：{{ book.pricenow }}￥</template>
                                </a-card-meta>
                            </a-card>
                        </router-link>
                    </a-col>
                </div>
            </a-row>
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
                imgStyle:{
                  height:""
                },
                contentStyleObj:{
                    width:'',
                    "margin":"auto"
                },
                books: "",
            }
        },
        component:{
            Search
        },
        created(){
            this.contentStyleObj.width=window.screen.width/2-200+'px';
            this.imgStyle.height=(window.screen.width/2)/5+'px';
        },
        mounted() {
            this.getbooklist();
        },
        methods: {
            getbooklist() {
                this.$axios
                    .get(this.baseurl+"/api/info", {
                        params: {
                            num: 10,
                            reserve:1
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
