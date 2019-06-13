<template>
    <div>
        <Othershow
                v-if="this.visible"
                :uid="this.nowid"
                :visible="visible"
                @cancel="closeother"></Othershow>
        <a-table :columns="columns" :dataSource="data">
            <div slot="buyerid" slot-scope="text">
                <a @click="showModal(text)">买家</a>
            </div>
            <div slot="ordertime" slot-scope="text">
                <p>{{getTime(text)}}</p>
            </div>
            <div slot="state" slot-scope="text">
                <a-icon v-if="text===1" style="color: green" type="check-circle"/>
                <a-icon v-else style="color: red" type="clock-circle"/>
            </div>
            <div slot="bcom" slot-scope="text">
                <a-icon v-if="text===1" style="color: green" type="check-circle"/>
                <a-icon v-else style="color: red" type="clock-circle"/>
            </div>
            <div slot="scom" slot-scope="text,record">
                <a-icon v-if="text===1" style="color: green" type="check-circle"/>
                <a v-else v-on:click='handlescom(record.orderid)'>确认发货</a>
            </div>
            <div slot="bookid" slot-scope="text">
                <router-link :to="'/book/show/'+ text">前往</router-link>
            </div>
        </a-table>
    </div>
</template>

<script>
    import Othershow from "@/components/Othershow";

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
        title: '买家',
        dataIndex: 'buyerid',
        key: 'buyerid',
        scopedSlots: {customRender: 'buyerid'},
    }, {
        title: '下单时间',
        dataIndex: 'ordertime',
        key: 'ordertime',
        scopedSlots: {customRender: 'ordertime'},
    }, {
        title: '买家确认收货',
        dataIndex: 'bcom',
        key: 'bcom',
        scopedSlots: {customRender: 'bcom'},
    }, {
        title: '卖家确认发货',
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
        name: 'sellshow',
        components: {Othershow},
        data() {
            return {
                nowid: "",
                visible: false,
                data: [],
                columns,
            }
        },
        mounted() {
            this.sinit();
        },
        methods: {
            showModal(id) {
                this.nowid = id;
                console.log(this.nowid);
                this.visible = true;
            },
            closeother() {
                this.visible = false;
            },
            handlescom(orderid) {
                let data = new FormData();
                data.append("orderid", orderid);
                this.$axios
                    .post(this.baseurl + "/api/scom", data)
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.$message.success(response.data.data.msg);
                                this.sinit();
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )

            },
            sinit() {
                this.$axios
                    .get(this.baseurl + "/api/mysell")
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
