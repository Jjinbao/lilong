<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 订单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="userCommonData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="createDate" label="创建日期" width="150"></el-table-column>
                <el-table-column prop="userName" label="客户姓名" width="120"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
                <el-table-column prop="payNum" label="购买数量" width="120"></el-table-column>
                <el-table-column prop="payAmount" label="支付金额" width="120"></el-table-column>
                <el-table-column prop="payType" label="支付方式" width="120"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <el-table :data="productList" border style="width: 100%;margin-top: 10px;" ref="multipleTable">
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="payNum" label="购买数量"></el-table-column>
                <el-table-column prop="sendNum" label="已发货数量"></el-table-column>
            </el-table>
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addSendVisible = true">新建发货</el-button>
                <el-button type="success" icon="search" @click="printVisible = true">打印发货单</el-button>
            </div>
            <el-table :data="sendInfo" border style="width: 100%;margin-top: 10px;" ref="multipleTable">
                <el-table-column prop="sendOrder.sendDate" label="发货时间"></el-table-column>
                <el-table-column prop="sendOrder.takedUserName" label="收货人姓名"></el-table-column>
                <el-table-column prop="sendOrder.takedUserMobile" label="收货人电话"></el-table-column>
                <el-table-column prop="sendOrder.takedUserAddress" label="收货人地址"></el-table-column>
                <el-table-column prop="sendOrder.sendProductInfo" label="发货商品/数量"></el-table-column>
                <el-table-column prop="sendOrder.sendName" label="快递名称"></el-table-column>
                <el-table-column prop="sendOrder.sendCode" label="快递单号"></el-table-column>
                <el-table-column prop="sendOrder.takedRemark" label="收货订单备注"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="printItem(scope.$index, scope.row)">打印</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--新增发货地址-->
        <el-dialog title="新增发货地址" :visible.sync="addSendVisible" width="40%">
            <el-form ref="form" :model="sendOrder" label-width="80px">
                <el-form-item label="订单编号">
                    <el-input v-model="sendOrder.transOrderId" disabled></el-input>
                </el-form-item>
                <el-form-item label="快递公司">
                    <el-input v-model="sendOrder.sendName"></el-input>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model="sendOrder.sendCode"></el-input>
                </el-form-item>
                <el-form-item label="邮寄地址" class="choice-address">
                    <el-select v-model="sendOrder.userSendAddressId" placeholder="请选择邮寄地址">
                        <el-option v-for="(item, index) in sendAddressList" :key="index" :label="item.address" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form v-for="(item, index) in sendOrderProductList" v-if="item.canSendNum != 0" :key="index" :inline="true" ref="form" label-width="70px">
                <el-form-item label="产品名称">
                    <el-input v-model="item.productName" disabled=""></el-input>
                </el-form-item>
                <el-input-number v-model="item.sendNum" :min="0" :max="item.canSendNum" label="描述文字"></el-input-number>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addSendVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!--打印发货订单-->
        <el-dialog title="客户订货单" :visible.sync="printVisible" width="600">
            <div class="container" id="print">
                <el-table :data="userCommonData" border style="width: 100%" ref="multipleTable">
                    <el-table-column prop="userName" label="客户姓名" width="120"></el-table-column>
                    <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
                    <el-table-column prop="payNum" label="购买数量" width="120"></el-table-column>
                    <el-table-column prop="payAmount" label="支付金额" width="140"></el-table-column>
                    <el-table-column prop="payType" label="支付方式"></el-table-column>
                </el-table>
                <el-table :data="productList" border style="width: 100%;margin-top: 10px;" ref="multipleTable">
                    <el-table-column prop="productName" label="产品名称"></el-table-column>
                    <el-table-column prop="payNum" label="购买数量"></el-table-column>
                    <el-table-column prop="sendNum" label="已发货数量"></el-table-column>
                </el-table>
                <el-table :data="sendInfo" border style="width: 100%;margin-top: 10px;" ref="multipleTable">
                    <el-table-column prop="sendOrder.sendDate" label="发货时间"></el-table-column>
                    <el-table-column prop="sendOrder.takedUserName" label="收货人姓名"></el-table-column>
                    <el-table-column prop="sendOrder.takedUserMobile" label="收货人电话"></el-table-column>
                    <el-table-column prop="sendOrder.takedUserAddress" label="收货人地址"></el-table-column>
                    <el-table-column prop="sendOrder.sendProductInfo" label="发货商品/数量"></el-table-column>
                    <!--<el-table-column prop="sendOrder.sendName" label="快递名称"></el-table-column>-->
                    <!--<el-table-column prop="sendOrder.sendCode" label="快递单号"></el-table-column>-->
                    <el-table-column prop="sendOrder.takedRemark" label="备注"></el-table-column>
                </el-table>
            </div>
            <div style="position: relative;height: 50px;">
                <el-button class="print-btn" type="default" icon="search" @click="print('print')">打印发货单</el-button>
            </div>
        </el-dialog>
        <!--打印单条信息-->
        <el-dialog title="客户订货单" :visible.sync="printItemVisible" width="600">
            <div class="container" id="printItem">
                <el-table :data="sendInfoItem" border style="width: 100%;margin-top: 10px;" ref="multipleTable">
                    <el-table-column prop="sendOrder.sendDate" label="发货时间"></el-table-column>
                    <el-table-column prop="sendOrder.takedUserName" label="收货人姓名"></el-table-column>
                    <el-table-column prop="sendOrder.takedUserMobile" label="收货人电话"></el-table-column>
                    <el-table-column prop="sendOrder.takedUserAddress" label="收货人地址"></el-table-column>
                    <el-table-column prop="sendOrder.sendProductInfo" label="发货商品/数量"></el-table-column>
                    <!--<el-table-column prop="sendOrder.sendName" label="快递名称"></el-table-column>-->
                    <!--<el-table-column prop="sendOrder.sendCode" label="快递单号"></el-table-column>-->
                    <el-table-column prop="sendOrder.takedRemark" label="备注"></el-table-column>
                </el-table>
            </div>
            <div style="position: relative;height: 50px;">
                <el-button class="print-btn" type="default" icon="search" @click="print('printItem')">打印发货单</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import OrderStatus from '../../plugin/maps'
    export default {
        name: 'basetable',
        data() {
            return {
                // 该订单对应的用户信息
                userCommonData: [],
                // 该订单对应的产品信息
                productList: [],
                // 该订单对应的发货信息
                sendInfo:[],
                userInfo: [],
                userSendAddressList: [
                    {id:1, address: '北京市丰台区', mobile: '18210596067', common: true, default: '是', remark: '默认地址'},
                    {id:1, address: '北京市丰台区', mobile: '18210596067', common: false, default: '否',remark: '这个不是默认收货地址'},
                    {id:1, address: '北京市西城区', mobile: '18210596067', common: false, default: '否',remark: '这个也不是'}
                ],
                // 新增发货
                addSendVisible: false,
                // 删除发货地址变量
                delVisible: false,
                // 交易订单对象
                sendOrder: {
                    transOrderId: '', // 交易订单id
                    sendCode: '', // 快递发货单号
                    sendName: '', // 快递公司名称
                    userSendAddressId: '', // 发货地址id
                    sendDate: '', // 发货时间
                    remark: '',
                    common: false
                },
                // 产品列表
                sendOrderProductList: [],
                // 用户发货地址
                sendAddressList: [],
                // 用户信息
                userInfo: {},
                // 删除发货地址的参数
                deleteTarget: {},
                printVisible: false,
                printItemVisible: false,
                sendInfoItem: []
            }
        },
        created() {
            this.$nextTick(() => {
                this.queryOrderDetail()
            })
        },
        computed: {
        },
        methods: {
            // 根据订单id获取订单详情
            queryOrderDetail () {
                this.$http({
                    url: this.baseUrl + '/identity/transOrder/getInfo/' + this.$route.query.id + '?userName=',
                    method: 'GET'
                }).then((res) => {
                    if (res.data.code === 0) {
                        res.data.data.transOrder.payStatus = OrderStatus.orderStatus.get(res.data.data.transOrder.status.toString()).payType
                        this.sendOrder.transOrderId = res.data.data.transOrder.id
                        this.userCommonData = []
                        this.sendOrderProductList = []
                        this.userCommonData.push(res.data.data.transOrder)
                        this.productList = res.data.data.transOrderProductList
                        this.productList.forEach((item) => {
                            let tempItem = {}
                            tempItem.productId = item.productId
                            tempItem.sendNum = 0
                            tempItem.canSendNum = item.payNum - item.sendNum
                            tempItem.payNum = item.payNum
                            tempItem.productName = item.productName
                            this.sendOrderProductList.push(tempItem)
                        })
                        this.sendInfo = res.data.data.sendOrderInfo
                        this.getUserInfo(res.data.data.transOrder.userId)
                    }
                })
            },
            // 获取用户信息
            getUserInfo (uid) {
                this.$http({
                    url: this.baseUrl + '/identity/user/getDetail/' + uid,
                    method: 'GET'
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.sendAddressList = res.data.data.userSendAddressList
                    }
                })
            },
            // 保存用户发货地址信息
            saveAdd () {
                if (!this.sendOrder.sendName) {
                    this.$message.error('快递公司不能为空');
                    return
                }
                if (!this.sendOrder.sendCode) {
                    this.$message.error('快递单号不能为空');
                    return
                }
                if (!this.sendOrder.userSendAddressId) {
                    this.$message.error('发货地址不能为空');
                    return
                }
                this.$http({
                    url: this.baseUrl + '/identity/sendOrder/insertSendOrder',
                    method: 'POST',
                    data: {
                        sendOrder: this.sendOrder,
                        sendOrderProductList: this.sendOrderProductList
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.addSendVisible = false
                        this.queryOrderDetail()
                        this.$message.success('提交成功');
                    } else {
                        this.$message.error(res.data.message);
                    }
                })

            },
            // 删除发货地址函数
            deleteRow () {
                this.delVisible = false
                this.$http({
                    url: this.baseUrl + '/identity/user/deleteSendAddress/' + this.deleteTarget.id,
                    method: 'GET'
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.deleteTarget = ''
                        this.$message.success('地址删除成功');
                        this.queryUser()
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            // 把某一个地址设置为默认收货地址
            handleDefault (index, item) {
                this.$http({
                    url: this.baseUrl + '/identity/user/updateSendAddressCommon/' + item.id,
                    method: 'GET'
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message.success('默认地址设置成功');
                        this.queryUser()
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            printItem (index, row) {
                this.printItemVisible = true
                this.sendInfoItem = []
                this.sendInfoItem.push(row)
            },
            print (val) {
                let newstr = document.getElementById(val).innerHTML;
                window.document.body.innerHTML = newstr;
                let oldstr = window.document.body.innerHTML;
                window.print();
                window.location.reload();   //解决打印之后按钮失效的问题
                window.document.body.innerHTML = oldstr;
                return false;
            }
        },
        mounted() {
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 10px;
        margin-top: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .choice-address .el-select{
        width: 100%;
    }
    .print-btn{
        position: absolute;
        top: 20px;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
    }
</style>
