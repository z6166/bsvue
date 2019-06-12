//登录

<template>
    <div class="Search" id="Search">
        <a-input-group compact>
            <a-select v-model="searchselect" defaultValue="0">
                <a-select-option value="0">书名</a-select-option>
                <a-select-option value="1">编号</a-select-option>
                <a-select-option value="2">类别</a-select-option>
            </a-select>
            <a-input v-model="searchcontent" @pressEnter="searchevent" style="width: 90%">
                <a-icon slot="suffix" type="search" @click="searchevent"></a-icon>
            </a-input>
        </a-input-group>
        <br/>
        <a-table :columns="columns" :dataSource="data" :pagination="pagination">
            <div slot="pic" slot-scope="text">
                <a-avatar size="large" shape="square" :src="text" />
            </div>
            <div slot="state" slot-scope="text,record">
                <router-link v-if="text===0" :to="'/book/buy/' + record.bookid">
                    <a style="color: green" type="check-circle">前往购买</a>
                </router-link>
                <p v-else style="color: red">已售出</p>
            </div>
        </a-table>
    </div>
</template>

<script>
    const columns = [ {
        title: "编号",
        dataIndex: 'bookid',
        key: 'bookid',
    }, {
        title: '缩略图',
        dataIndex: 'pic',
        key: 'pic',
        scopedSlots: {customRender: 'pic'},
    }, {
        title: '书名',
        dataIndex: 'bookname',
        key: 'bookname',
    }, {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
    },{
        title: '',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: {customRender: 'state'},
    }];
    var Searchresult = [];
    export default {
        name: "Search",
        data() {
            return {
                searchselect: '0',
                columns,
                data:[],
                searchcontent: '',
                pagination: {
                    pageSize: 6, // 默认每页显示数量
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['5', '10', '20', '30'], // 每页数量选项
                    showTotal: total => `Total ${total} items`, // 显示总数
                    showSizeChange: (current, pageSize) => this.pageSize = pageSize, // 改变每页数量时更新显示
                }
            };
        },
        components: {},
        methods: {
            searchevent() {
                if (this.searchcontent !== "") {
                    this.tosearch();
                } else {
                    this.$message.error("请输入搜索内容！")
                }
            },
            tosearch() {
                console.log("begin");
                console.log(this.searchselect);

                this.$axios
                    .get(this.baseurl+"/api/search", {
                        params: {
                            type: this.searchselect,
                            content:this.searchcontent
                        }
                    })
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.data = response.data.data
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    );
            },
        }
    };
</script>

<style scoped>
</style>
