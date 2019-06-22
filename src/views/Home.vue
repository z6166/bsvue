<template>
    <div class="home" :style="contentStyleObj">

        <a-modal
                title="确认提供"
                :visible="isshow"
                @ok="handleOK"
                @cancel="closeModal"
        >
            <p style="color: red">您确定要提供该求购吗？</p>
        </a-modal>

        <Search></Search>

        <h1 id="Recentwant">近期求购</h1>
        <div style="background-color: #ececec; padding: 20px;overflow: hidden">
            <a-table :columns="columns" :dataSource="wanted" :pagination="pagination">
                <div slot="time" slot-scope="text">
                    <p>{{getTime(text)}}</p>
                </div>
                <div slot="orderid" slot-scope="text">
                    <p v-if="text === 0">暂无订单号</p>
                    <p v-else>{{text}}</p>
                </div>
                <div slot="moreinfo" slot-scope="text">
                    <a-popover>
                        <template slot="content">
                            <p>{{text}}</p>
                        </template>
                        <a>查看</a>
                    </a-popover>
                </div>
                <div slot="state" slot-scope="text">
                    <a-icon v-if="text===1" style="color: green" type="check-circle"/>
                    <a-icon v-else style="color: red" type="clock-circle"/>
                </div>
                <div slot="action" slot-scope="text,record">
                    <a v-if="record.state === 0" @click="showModal(record.wantedid)">前往提供</a>
                    <p v-else>求购已完成</p>
                </div>
            </a-table>
        </div>
        <a-divider/>

        <h1 id="Recentbook">最新上架</h1>
        <div style="background-color: #ececec; padding: 20px;overflow: hidden">
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
                                <p v-if="book.content === 'undefined'">发布者未填写内容简介</p>
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

    const columns = [{
        title: '求购号',
        dataIndex: 'wantedid',
        key: 'wantedid',
    }, {
        title: '书名',
        dataIndex: 'bookname',
        key: 'bookname',
    }, {
        title: '期望价格',
        dataIndex: 'pricewanted',
        key: 'pricewanted',
    }, {
        title: '备注',
        dataIndex: 'moreinfo',
        key: 'moreinfo',
        scopedSlots: {customRender: 'moreinfo'},
    }, {
        title: '提交时间',
        dataIndex: 'time',
        key: 'time',
        scopedSlots: {customRender: 'time'},
    }, {
        title: '求购状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: {customRender: 'state'},
    },{
        title: '',
        scopedSlots: {customRender: 'action'},
    }
    ];

    export default {
        name: 'home',
        components: {Search},
        data() {
            return {
                isshow:false,
                wantedid:null,
                pagination: {
                    pageSize: 5, // 默认每页显示数量
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['5', '10', '20', '30'], // 每页数量选项
                    showTotal: total => `Total ${total} items`, // 显示总数
                    showSizeChange: (current, pageSize) => this.pageSize = pageSize, // 改变每页数量时更新显示
                },
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
                wanted:[],
                columns,
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
            this.init();
        },
        methods: {
            init(){
                this.getbooklist();
                this.getwantlist();
            },
            showModal(id){
                this.wantedid = id;
                this.isshow = true;
            },
            handleOK(){
                let data = new FormData();
                data.append("wantedid", this.wantedid);
                this.$axios
                    .post("http://" + this.baseurl + "/api/handlewant", data)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.$message.success(response.data.data.msg);
                                this.closeModal();
                                this.init();
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            },
            closeModal(){
              this.isshow = false;
              this.wantedid = 0;
            },
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
            },
            getwantlist() {
                this.$axios
                    .get("http://" + this.baseurl + "/api/wantlist", {
                        params: {
                            num: 10,
                            reserve: 1
                        }
                    })
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.wanted = response.data.data
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
