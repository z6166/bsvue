<template>
    <a-table :columns="columns" :dataSource="data">
        <div slot="state" slot-scope="text">
            <a-icon v-if="text===1" style="color: green" type="check-circle" />
            <a-icon v-else style="color: red" type="clock-circle" />
        </div>
        <div slot="bcom" slot-scope="text,record">
            <a-icon v-if="text===1" style="color: green" type="check-circle" />
            <a v-else v-on:click='handlebcom(record.orderid)'>确认收货</a>
        </div>
        <div slot="scom" slot-scope="text">
            <a-icon v-if="text===1" style="color: green" type="check-circle" />
            <a-icon v-else style="color: red" type="clock-circle" />
        </div>
        <div slot="bookid" slot-scope="text">
            <router-link :to="'/book/show/'+ text">前往</router-link>
        </div>
    </a-table>
</template>

<script>
    const columns = [{
        title: '订单号',
        dataIndex: 'orderid',
        key: 'orderid',
    }, {
        title: '链接',
        dataIndex: 'bookid',
        key: 'bookid',
        scopedSlots: {customRender: 'bookid'},
    }, {
        title: '书名',
        dataIndex: 'bookname',
        key: 'bookname',
    }, {
        title: '卖家id',
        dataIndex: 'salerid',
        key: 'salerid',
    }, {
        title: '下单时间',
        dataIndex: 'ordertime',
        key: 'ordertime',
    }, {
        title: '买家确认收货',
        dataIndex: 'bcom',
        key: 'bcom',
        scopedSlots: {customRender: 'bcom'},
    }, {
        title: '卖家确认收货',
        dataIndex: 'scom',
        key: 'scom',
        scopedSlots: {customRender: 'scom'},
    }, {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: {customRender: 'state'},
    }];
    export default {
        name: 'ordershow',
        data() {
            return {
                data: [],
                columns,
            }
        },
        mounted() {
            this.binit();
        },
        methods: {
            handlebcom(orderid){
                let data = new FormData();
                data.append("orderid", orderid);
                this.$axios
                    .post(this.baseurl+"/api/bcom",data)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.$message.success(response.data.data.msg);
                                this.binit();
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )

            },
            binit() {
                this.$axios
                    .get(this.baseurl+"/api/myorder")
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.data = response.data.data
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            }
        }
    }
</script>
