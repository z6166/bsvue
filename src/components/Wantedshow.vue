<template>
    <div>
        <a-table :columns="columns" :dataSource="data">
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
                    <a>查看详情</a>
                </a-popover>
            </div>
            <div slot="state" slot-scope="text">
                <a-icon v-if="text===1" style="color: green" type="check-circle"/>
                <a-icon v-else style="color: red" type="clock-circle"/>
            </div>
        </a-table>
    </div>
</template>

<script>
    import Othershow from "@/components/Othershow";

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
    }, {
        title: '订单号',
        dataIndex: 'orderid',
        key: 'orderid',
        scopedSlots: {customRender: 'orderid'},
    }
    ];
    export default {
        name: 'wantedshow',
        components:{Othershow},
        data() {
            return {
                nowid:"",
                data: [],
                columns,
            }
        },
        mounted() {
            this.binit();
        },
        methods: {
            handlebcom(orderid) {
                let data = new FormData();
                data.append("orderid", orderid);
                this.$axios
                    .post("http://" + this.baseurl + "/api/bcom", data)
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
                    .get("http://" + this.baseurl + "/api/mywanted")
                    .then(
                        response => {
                            if (response.data.code === 0) {
                                this.data = response.data.data;
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        }
                    )
            },
        }
    }
</script>
