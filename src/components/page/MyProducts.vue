<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 产品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true">
                    <el-form-item label="产品状态">
                        <el-select v-model="reqParams.status" @change="payTypeChange" placeholder="订单状态">
                            <el-option label="全部" value="-1"></el-option>
                            <el-option label="关闭" value="1"></el-option>
                            <el-option label="开放" value="2"></el-option>
                            <el-option label="新品" value="3"></el-option>
                            <el-option label="预售新品" value="4"></el-option>
                        </el-select>
                        <el-input v-model="reqParams.search" placeholder="请输入品牌/品名" class="handle-input"></el-input>
                        <!--<el-date-picker-->
                            <!--v-model="reqParams.startTime"-->
                            <!--align="right"-->
                            <!--type="datetime"-->
                            <!--placeholder="起始时间"-->
                            <!--format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">-->
                        <!--</el-date-picker>-->
                        <!--<el-date-picker-->
                            <!--v-model="reqParams.endTime"-->
                            <!--align="right"-->
                            <!--type="datetime"-->
                            <!--placeholder="结束时间"-->
                            <!--format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">-->
                        <!--</el-date-picker>-->
                        <el-button type="primary" icon="search" @click="searByName">搜索</el-button>
                    </el-form-item>
                    <el-button type="primary" style="float: right" icon="search" @click="addProduct">添加产品
                    </el-button>
                </el-form>
                <!--<el-form :inline="true">-->
                    <!--<el-form-item label="金额信息">-->
                        <!--<el-input style="width: 500px" disabled v-model="productMoney.amountContent"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="产品信息">-->
                        <!--<el-input style="width: 500px" disabled v-model="productMoney.countContent"></el-input>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55"></el-table-column>-->
                <el-table-column prop="brand" label="品牌">
                </el-table-column>
                <el-table-column prop="name" label="品名">
                </el-table-column>
                <el-table-column prop="model" label="型号">
                </el-table-column>
                <el-table-column prop="size" label="规格" width="120">
                </el-table-column>
                <el-table-column prop="material" label="材质">
                </el-table-column>
                <el-table-column prop="code" label="产品编号">
                </el-table-column>
                <el-table-column prop="productionDate" label="生产日期" width="150">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="150">
                </el-table-column>
                <el-table-column prop="lastModified" label="最后修改时间" width="150">
                </el-table-column>
                <el-table-column prop="payStatus" label="状态" width="120">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="scope.row.status != 0" @click="closePro(scope.$index, scope.row)">关闭</el-button>
                        <el-button type="text" size="small" v-if="scope.row.status == 0" @click="openPro(scope.$index, scope.row)">开放</el-button>
                        <el-button type="text" size="small" v-if="scope.row.status == 1" @click="newPro(scope.$index, scope.row)">新品</el-button>
                        <el-button type="text" size="small" v-if="scope.row.status == 1" @click="preNewPro(scope.$index, scope.row)">预售新品</el-button>
                        <el-button type="text" size="small" v-if="scope.row.status != 0" @click="upToTop(scope.$index, scope.row)">置顶</el-button>
                        <el-button type="text" size="small" @click="orderDetail(scope.$index, scope.row)">详情</el-button>
                        <el-button type="text" size="small" @click="proModify(scope.$index, scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalElement">
                </el-pagination>
            </div>

        </div>

        <!-- 添加订单弹出框 -->
        <el-dialog title="添加订单" @close="closeAddOrder" :visible.sync="addVisible" width="60%">
            <el-form :inline="true" :model="transOrder" ref="form" label-width="70px">
                <el-form-item label="客户姓名">
                    <!--<el-select v-model="transOrder.userId" placeholder="客户姓名">-->
                    <!--<el-option v-for="(userTab, index) in userList" :key="index" :label="userTab.realName" :value="userTab.id"></el-option>-->
                    <!--</el-select>-->

                    <el-autocomplete
                        v-model="transOrder.userName"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-input v-model="transOrder.payType" placeholder="支付方式"></el-input>
                </el-form-item>
                <el-form-item label="支付金额">
                    <el-input v-model="transOrder.payAmount" placeholder="支付金额"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="transOrder" ref="form" label-width="70px">
                <el-form-item label="备注">
                    <el-input v-model="transOrder.remark" placeholder="备注"></el-input>
                </el-form-item>
            </el-form>

            <el-form v-for="(item, index) in transOrderProductList" :key="index" :inline="true" ref="form"
                     label-width="70px">
                <el-form-item label="产品名称">
                    <el-select v-model="item.productId" placeholder="产品名称">
                        <el-option v-for="(proName, index) in proList" :key="index" :label="proName.name"
                                   :value="proName.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-input-number v-model="item.payNum" :min="1" label="描述文字"></el-input-number>
                <el-button style="margin-left: 20px;" icon="el-icon-plus" circle @click="addProduct(index)"></el-button>
                <el-button v-if="index != 0" type="danger" icon="el-icon-close" circle
                           @click="deleteProduct(index)"></el-button>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrder">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确认要取消该交易订单？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import OrderStatus from '../../plugin/maps'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
    export default {
        components: {ElForm}, name: 'basetable',
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
                    userName: '',
                    payAmount: '',
                    payType: '',
                    remark: '',
                },
                // 购买的产品列表
                transOrderProductList: [
                    {productId: '', payNum: 1}
                ],
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
                    status: '-1',
                    pageNum: 1,
                    pageSize: 10,
                    search: ''
                },
                idx: -1,
                productMoney: {}
            }
        },
        created() {
            this.$nextTick(() => {
                this.getData()
                // this.queryProList()
                // this.queryUserList()
                // this.queryTotalMoney()
            })
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.reqParams.pageNum = val;
                this.getData();
            },
            // 获取订单列表
            getData() {
                this.$http({
                    url: this.baseUrl + '/identity/product/pageInfo',
                    method: 'GET',
                    params: this.reqParams
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.collection || []
                        this.productMoney.amountContent = res.data.data.amountContent
                        this.productMoney.countContent = res.data.data.countContent
                        this.totalElement = res.data.data.count
                        this.tableData.forEach((item) => {
                            item.status = 1
                            item.payStatus = OrderStatus.orderStatus.get(item.status.toString()).payType
                        })
                    }
                })
            },
            // 置顶按钮
            upToTop(index, item) {

            },
            // 关闭按钮
            closePro(index, item) {

            },
            openPro(index, item) {

            },
            newPro(index, item) {

            },
            preNewPro(index, item) {

            },
            searByName () {
                this.reqParams.pageNum = 1;
                this.getData()
            },
            payTypeChange () {
                this.reqParams.pageNum = 1
                this.getData()
            },
            // 保存订单信息
            saveOrder () {
                this.$http({
                    url: this.baseUrl + '/identity/transOrder/insert',
                    method: 'POST',
                    data: {
                        transOrder: this.transOrder,
                        transOrderProductList: this.transOrderProductList
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.addVisible = false
                        this.$message.success('添加成功')
                        this.getData()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            // 添加产品信息
            addProduct (index) {
                this.transOrderProductList.push({productId: '', payNum: 1})
            },
            // 删除产品信息
            deleteProduct (index) {
                this.transOrderProductList.splice(index, 1)
            },
            closeAddOrder () {
                this.transOrder = {
                    userId: '',
                    payAmount: '',
                    payType: '',
                    remark: '',
                }
                this.transOrderProductList = [
                    {productId: '', payNum: 1}
                ]
            },
            // 获取产品列表
            queryProList () {
                this.$http({
                    url: this.baseUrl + '/identity/product/pageInfo',
                    method: 'GET',
                    params: {
                        search: '',
                        pageNum: 1,
                        sendDateStart: '',
                        sendDateEnd: '',
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
            //
            querySearchAsync (qrString, cb) {
                this.$http({
                    url: this.baseUrl + '/identity/user/pageInfo',
                    method: 'GET',
                    params: {
                        search: qrString,
                        pageNum: 1,
                        pageSize: 100
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let userList = res.data.data.collection
                        userList.forEach((res) => {
                            res.value = res.realName
                        })
                        cb(userList)
                        //console.log(this.userList)
                    }
                })
            },

            handleSelect (item) {
                this.transOrder.userId = item.id
            },

            // 获取入库 销售价格汇总
            queryTotalMoney () {
                this.$http({
                    url: this.baseUrl + '/identity/user/totalAmount',
                    method: 'GET'
                }).then((res) => {
                    this.productMoney = res.data.data
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            addProduct() {
                this.$router.push({
                    path: '/order-detail?type=add'
                })
            },
            proModify(index, item) {
                this.$router.push({
                    path: '/order-detail?type=modify&id=' + item.id
                })
            },
            orderDetail (index, item) {
                this.$router.push({
                    path: '/order-detail?type=detail&id=' + item.id
                })
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                console.log(this.idx)
                //this.tableData.splice(this.idx, 1);
                let id = this.tableData[this.idx].id
                // this.$message.success('删除成功');
                this.$http({
                    url: this.baseUrl + '/identity/transOrder/cancelTransOrder/' + id,
                    method: 'GET'
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.$message.success(`订单取消成功`);
                        this.reqParams.pageNum = 1
                        this.getData()
                    } else if (res.data.code == 51004){
                        this.$message.error(`订单取消失败`);
                    } else if (res.data.code == 51003) {
                        this.$message.error(`订单取消失败,订单已发货`);
                    }
                    this.delVisible = false;
                })

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

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }
</style>
