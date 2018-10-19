<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 产品组合</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="reqListParams.search" placeholder="请输入产品组合/编号" class="handle-input"></el-input>
                <!--<el-date-picker v-model="reqListParams.sendDateStart" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="发货时间始"></el-date-picker>-->
                <!--<el-date-picker v-model="reqListParams.sendDateEnd" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="发货时间末"></el-date-picker>-->
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" style="float: right" icon="search" @click="addVisible = true">新增产品组合</el-button>
            </div>
            <el-table :data="product.list" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="名称" width="120"></el-table-column>
                <el-table-column prop="code" label="编码" width="120"></el-table-column>
                <el-table-column prop="productContent" label="产品包内容"></el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="350">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" @click="handleStorage(scope.$index, scope.row, scope)">新增订单</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button size="small" type="default" @click="handleAddTop(scope.$index, scope.row)">置顶</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange"
                               layout="prev, pager, next"
                               :total="product.count">
                </el-pagination>
            </div>
        </div>
        <!--新增用户-->
        <el-dialog title="新增产品组合" :visible.sync="addVisible" width="50%">
            <el-form :model="addProParams" label-width="100px">
                <!--<el-form-item label="日期">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="产品组合名称">
                    <el-input v-model="addProParams.name"></el-input>
                </el-form-item>
                <el-form-item label="产品组合编号">
                    <el-input v-model="addProParams.code"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addProParams.remark"></el-input>
                </el-form-item>
            </el-form>
            <el-form v-for="(item, index) in productPackageContentList" :key="index" :inline="true" ref="form" label-width="70px">
                <el-form-item label="产品名称">
                    <el-select v-model="item.productId" placeholder="产品名称">
                        <el-option v-for="(proName, index) in proList" :key="index" :label="proName.name" :value="proName.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-input-number v-model="item.number" :min="1" label="描述文字"></el-input-number>
                <el-button style="margin-left: 20px;" icon="el-icon-plus" circle @click="addProduct(index)"></el-button>
                <el-button v-if="index != 0" type="danger" icon="el-icon-close" circle @click="deleteProduct(index)"></el-button>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="产品入库" @close="closeAddStore" :visible.sync="addStorage" width="30%">
            <el-form :model="inStorePro" label-width="80px">
                <el-form-item label="产品名称">
                    <el-input v-model="inStorePro.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="产品编号">
                    <el-input v-model="inStorePro.productId" disabled></el-input>
                </el-form-item>
                <el-form-item label="入库数量">
                    <el-input v-model="inStorePro.storeNum" placeholder="请输入入库数量"></el-input>
                </el-form-item>
                <el-form-item label="入库价格">
                    <el-input v-model="inStorePro.price" placeholder="请输入入库价格"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="inStorePro.remark" placeholder="请输入入库备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addStorage = false">取 消</el-button>
                <el-button type="primary" @click="saveStorage">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <!--添加组合产品订单-->
        <el-dialog title="添加订单" @close="closeAddOrder" :visible.sync="addOrderVisible" width="60%">
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
            <el-form :inline="false" ref="form" label-width="70px">
                <el-form-item style="width: 400px;" v-for="(pro, index) in transOrderProductList" :key="index" :label="pro.label">
                    <el-input v-model="pro.pName" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addOrderVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrder">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'tabs',
        data() {
            return {
                searchWords: {
                    productName: ''
                },
                tableData: [
                    {productId: 1, name: '急支糖浆', code: '201812098934', stock: 193, totalSale: 7, remark: '介个是备注'},
                    {productId: 1, name: '急支糖浆', code: '201812098934', stock: 193, totalSale: 7, remark: '介个是备注'},
                    {productId: 1, name: '急支糖浆', code: '201812098934', stock: 193, totalSale: 7, remark: '介个是备注'},
                    {productId: 1, name: '急支糖浆', code: '201812098934', stock: 193, totalSale: 7, remark: '介个是备注'},
                    {productId: 1, name: '急支糖浆', code: '201812098934', stock: 193, totalSale: 7, remark: '介个是备注'},
                    {productId: 1, name: '急支糖浆', code: '201812098934', stock: 193, totalSale: 7, remark: '介个是备注'},
                    {productId: 1, name: '急支糖浆', code: '201812098934', stock: 193, totalSale: 7, remark: '介个是备注'}
                ],
                // 添加产品窗口
                addVisible: false,
                // 添加组合产品订单
                addOrderVisible: false,
                // 入库产品按钮
                addStorage: false,
                delVisible: false,
                // 入库产品参数
                inStorePro: {
                    name: '',
                    productId: '',
                    price: '',
                    storeNum: '',
                    remark: ''
                },
                addProParams: {
                    name: '',
                    code: '',
                    remark: ''
                },
                reqListParams: {
                    search: '',
                    pageNum: 1,
                    pageSize: 10
                },
                selectIndex: '',
                // 产品列表和产品总数
                product: {
                    count: 0,
                    list: []
                },
                proList: [],
                // 产品包包含的产品
                productPackageContentList: [{
                    productId: '',
                    number: 1
                }],
                transOrder: {
                    userId: '',
                    userName: '',
                    payAmount: '',
                    payType: '',
                    remark: '',
                },
                // 产品包列表
                transOrderProductList: []
            }
        },
        created () {
            this.$nextTick(() => {
                this.queryProList()
                this.getProList()
            })
        },
        methods: {
            // 保存产品信息
            saveAdd () {
                if (!this.addProParams.name) {
                    this.$message.error('产品组合名称不能为空');
                    return
                }
                this.$http({
                    url: this.baseUrl + '/identity/product/savePackage',
                    method: 'POST',
                    data: {
                        productPackage: this.addProParams,
                        productPackageContentList: this.productPackageContentList
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.addVisible = false
                        this.addProParams.name = ''
                        this.addProParams.code = ''
                        this.addProParams.remark = ''
                        this.$message.success('产品添加成功');
                        this.queryProList()
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            // 获取产品包列表
            queryProList () {
                this.$http({
                    url: this.baseUrl + '/identity/product/packagePage',
                    method: 'GET',
                    params: this.reqListParams
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.product.list = res.data.data.collection
                        this.product.count = res.data.data.count
                    }
                })
            },

            // 获取产品列表
            getProList () {
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
                        console.log(this.proList)
                    }
                })
            },

            // 添加产品信息
            addProduct (index) {
                this.productPackageContentList.push({productId: '', number: 1})
            },
            // 删除产品信息
            deleteProduct (index) {
                this.productPackageContentList.splice(index, 1)
            },

            search () {
                this.reqListParams.pageNum = 1
                this.queryProList()
            },
            // 添加订单
            handleStorage (index, item) {
                this.addOrderVisible = true
                console.log(item)
                this.queryPackageProduct(item.id)
//                this.inStorePro.name = item.name
//                this.inStorePro.productId = item.id
//                this.addStorage = true
            },
            // 获取产品包对应的产品列表
            queryPackageProduct (id) {
                this.$http({
                    url: this.baseUrl + '/identity/product/packageContent/listByPackageId/' + id,
                    method: 'GET'
                }).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                        this.transOrderProductList = res.data.data
                        this.transOrderProductList.forEach((item, index) => {
                            item.payNum = item.number
                            item.label = '产品' + (index + 1)
                            item.pName = item.productName + ' x ' + item.number
                        })
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            // 入库产品详情
            handleStoreDetail (index,item) {
                console.log(item)
                this.$router.push({
                    path: '/store-detail?pid=' + item.id + '&pName=' + item.name
                })
            },
            closeAddStore () {
                this.inStorePro.storeNum = ''
                this.inStorePro.price = ''
                this.inStorePro.remark = ''
            },
            saveStorage () {
                if (!this.inStorePro.storeNum) {
                    this.$message.error('产品数量不能为空');
                    return
                }
                this.$http({
                    url: this.baseUrl + '/identity/storeProduct/storeProduct',
                    method: 'POST',
                    data: this.inStorePro
                }).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                        this.addStorage = false
                        this.$message.success('入库成功')
                        this.queryProList()
                    } else {
                        this.$message.success(res.data.message)
                    }
                })
            },
            handleCurrentChange (val) {
                this.reqListParams.pageNum = val
                this.queryProList()
            },
            handleDelete (index, row) {
                console.log(row)
                console.log(index)
                this.selectIndex = index
                this.delVisible = true

            },
            // 保存订单信息
            saveOrder () {
                let tempOrderList = []
                this.transOrderProductList.forEach((item) => {
                    tempOrderList.push({
                        payNum: item.number,
                        productId: item.productId
                    })
                })
                this.$http({
                    url: this.baseUrl + '/identity/transOrder/insert',
                    method: 'POST',
                    data: {
                        transOrder: this.transOrder,
                        transOrderProductList: tempOrderList
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.addOrderVisible = false
                        this.$message.success('添加成功')
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            closeAddOrder () {
                this.transOrder = {
                    userId: '',
                    payAmount: '',
                    payType: '',
                    remark: '',
                }
                this.transOrderProductList = [
                ]
            },
            handleAddTop(index, row) {
                console.log(row)
                this.$http({
                    url: this.baseUrl + '/identity/product/packageSetUp/' + row.id,
                    method: 'GET'
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.reqListParams.pageNum = 1
                        this.$message.success('置顶成功');
                        this.queryProList()
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                // 0000000064efada701650323fe370097
            },
            deleteRow () {
                console.log(this.product.list[this.selectIndex])
                this.delVisible = false
                this.$http({
                    url: this.baseUrl + '/identity/product/deletePackage/' + this.product.list[this.selectIndex].id,
                    method: 'GET'
                }).then((res) => {
                    if(res.data.code === 0) {
                        this.queryProList()
                        this.$message.success('删除成功');
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
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
                        let userList = res.data.data.collection || []
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
        }
    }

</script>

<style>
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
