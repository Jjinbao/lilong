<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form>
                    <el-form-item label="订单状态">
                        <el-select v-model="transOrder.payType" @change="payTypeChange" placeholder="订单状态">
                            <el-option label="未发货" value="1"></el-option>
                            <el-option label="部分发货" value="2"></el-option>
                            <el-option label="全部发货" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!--<el-button type="primary" style="float: right" icon="search" @click="addVisible = true">新增订单</el-button>-->
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55"></el-table-column>-->
                <el-table-column prop="createDate" label="日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="userName" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="payNum" label="购买总数" width="120">
                </el-table-column>
                <el-table-column prop="unSendNum" label="未发货数量" width="120">
                </el-table-column>
                <el-table-column prop="payAmount" label="支付金额" width="120">
                </el-table-column>
                <el-table-column prop="payStatus" label="支付状态" width="120">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="handleOrderDetail(scope.$index, scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalElement">
                </el-pagination>
            </div>
        </div>

        <!-- 添加订单弹出框 -->
        <!--<el-dialog title="添加订单" :visible.sync="addVisible" width="60%">-->
            <!--<el-form :inline="true" :model="transOrder" ref="form" label-width="70px">-->
                <!--<el-form-item label="客户姓名">-->
                    <!--<el-select v-model="transOrder.userId" placeholder="客户姓名">-->
                        <!--<el-option v-for="(userTab, index) in userList" :key="index" :label="userTab.realName" :value="userTab.id"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="支付方式">-->
                    <!--<el-select v-model="transOrder.payType" placeholder="支付方式">-->
                        <!--<el-option label="现金支付" value="0"></el-option>-->
                        <!--<el-option label="微信支付" value="1"></el-option>-->
                        <!--<el-option label="支付宝支付" value="2"></el-option>-->
                        <!--<el-option label="银行卡支付" value="3"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="支付金额">-->
                    <!--<el-input v-model="transOrder.payAmount" placeholder="支付金额"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<el-form :model="transOrder" ref="form" label-width="70px">-->
                <!--<el-form-item label="备注">-->
                    <!--<el-input v-model="transOrder.remark" placeholder="备注"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->

            <!--<el-form v-for="(item, index) in transOrder.transOrderProductList" :key="index" :inline="true" ref="form" label-width="70px">-->
                <!--<el-form-item label="产品名称">-->
                    <!--<el-select v-model="item.productId" placeholder="产品名称">-->
                        <!--<el-option v-for="(proName, index) in proList" :key="index" :label="proName.name" :value="proName.id"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-input-number v-model="item.payNum" :min="1" :max="10" label="描述文字"></el-input-number>-->
            <!--</el-form>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="addVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="saveOrder">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import OrderStatus from '../../plugin/maps'
    export default {
        name: 'basetable',
        data() {
            return {
                // 订单数据
                tableData: [],
                // 订单总数
                totalElement: 0,
                addVisible: false,
                // 交易订单对象
                transOrder: {
                    userId: '',
                    payAmount: '',
                    payType: '',
                    remark: '',
                    transOrderProductList: [
                        {productId: '', payNum: 1}
                    ]
                },
                // 产品列表
                proList: [],
                // 用户列表
                userList: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                delVisible: false,
                reqParams: {
                    userId: '',
                    status: '',
                    pageNum: 1,
                    pageSize: 10
                },
                idx: -1
            }
        },
        created() {
            this.$nextTick(() => {
                this.reqParams.userId = this.$route.query.id
                this.getData()
                // this.queryProList()
                // this.queryUserList()
            })
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取订单列表
            getData() {
                this.$http({
                    url: this.baseUrl + '/identity/transOrder/list',
                    method: 'GET',
                    params: this.reqParams
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.collection || []
                        this.totalElement = res.data.data.count
                        this.tableData.forEach((item) => {
                            item.payStatus = OrderStatus.orderStatus.get(item.status.toString()).payType
                        })
                    }
                })
            },
            addOrder () {
                console.log('-------')
            },
            // 获取产品列表
            queryProList () {
                this.$http({
                    url: this.baseUrl + '/identity/product/pageInfo',
                    method: 'GET',
                    params: {
                        search: '',
                        pageNum: 1,
                        pageSize: 100
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.proList = res.data.data.collection
                    }
                })
            },
            // 获取用户信息
            queryUserList () {
                this.$http({
                    url: this.baseUrl + '/identity/user/pageInfo',
                    method: 'GET',
                    params: {
                        search: '',
                        pageNum: 1,
                        pageSize: 100
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.userList = res.data.data.collection
                    }
                })
            },
            search() {
                this.is_search = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            },
            // 跳转订单详情界面
            handleOrderDetail (index, item) {
                this.$router.push({
                    path: '/order-detail?id=' + item.id
                })
            },
            // 筛选订单状态
            payTypeChange (val) {
                this.reqParams.status = val
                this.getData()
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
