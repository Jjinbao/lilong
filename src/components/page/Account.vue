<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 记账管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker v-model="reqListParams.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="起始时间"></el-date-picker>
                <el-date-picker v-model="reqListParams.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束时间"></el-date-picker>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" style="float: right" icon="search" @click="addVisible = true">新增记账</el-button>
            </div>
            <el-table :data="product.list" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="名称" width="120"></el-table-column>
                <el-table-column prop="amount" label="支付金额" width="120"></el-table-column>
                <el-table-column prop="detail" label="产品详情" width="120"></el-table-column>
                <el-table-column prop="payType" label="支付方式" width="120"></el-table-column>
                <el-table-column prop="createDate" label="创建日期" width="150"></el-table-column>
                <el-table-column prop="lastModified" label="最后修改日期" width="150"></el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <!--<el-button size="small" type="success" @click="handleStorage(scope.$index, scope.row, scope)">入库产品</el-button>-->
                        <el-button size="small" type="primary" @click="handleStoreDetail(scope.$index, scope.row, scope)">修改</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <!--<el-button size="small" type="default" @click="handleAddTop(scope.$index, scope.row)">置顶</el-button>-->
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
        <el-dialog title="新增记账" :visible.sync="addVisible" width="30%">
            <el-form :model="addProParams" label-width="80px">
                <!--<el-form-item label="日期">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="客户姓名">
                    <el-input v-model="addProParams.name"></el-input>
                </el-form-item>
                <el-form-item label="商品详情">
                    <el-input v-model="addProParams.detail"></el-input>
                </el-form-item>
                <el-form-item label="支付金额">
                    <el-input v-model="addProParams.amount"></el-input>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-input v-model="addProParams.payType"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addProParams.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="账目修改" :visible.sync="modifyAccount" width="30%">
            <el-form :model="modifyParams" label-width="80px">
                <!--<el-form-item label="日期">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="客户姓名">
                    <el-input v-model="modifyParams.name"></el-input>
                </el-form-item>
                <el-form-item label="商品详情">
                    <el-input v-model="modifyParams.detail"></el-input>
                </el-form-item>
                <el-form-item label="支付金额">
                    <el-input v-model="modifyParams.amount"></el-input>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-input v-model="modifyParams.payType"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="modifyParams.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyAccount = false">取 消</el-button>
                <el-button type="primary" @click="saveModify">确 定</el-button>
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
                tableData: [],
                modifyAccount: false,
                // 添加产品窗口
                addVisible: false,
                // 入库产品按钮
                addStorage: false,
                delVisible: false,
                // 入库产品参数
                modifyParams: {
                    id: '',
                    name: '',
                    detail: '',
                    amount: '',
                    payType: '',
                    remark: ''
                },
                addProParams: {
                    name: '',
                    detail: '',
                    amount: '',
                    payType: '',
                    remark: ''
                },
                reqListParams: {
                    pageNum: 1,
                    pageSize: 10,
                    startTime: '',
                    endTime: ''
                },
                selectIndex: '',
                // 产品列表和产品总数
                product: {
                    count: 0,
                    list: []
                }
            }
        },
        created () {
            this.$nextTick(() => {
                this.queryProList()
            })
        },
        methods: {
            // 保存产品信息
            saveAdd () {
                if (!this.addProParams.name) {
                    this.$message.error('用户姓名不能为空');
                    return
                }
                if (!this.addProParams.amount) {
                    this.$message.error('支付金额不能为空');
                    return
                }
                this.$http({
                    url: this.baseUrl + '/identity/accountRecord/insert',
                    method: 'POST',
                    data: this.addProParams
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.addVisible = false
                        this.addProParams.name = ''
                        this.addProParams.amount = ''
                        this.addProParams.payType = ''
                        this.addProParams.detail = ''
                        this.addProParams.remark = ''
                        this.$message.success('记录成功');
                        this.queryProList()
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            saveModify () {
                if (!this.modifyParams.name) {
                    this.$message.error('用户姓名不能为空');
                    return
                }
                if (!this.modifyParams.amount) {
                    this.$message.error('支付金额不能为空');
                    return
                }
                this.$http({
                    url: this.baseUrl + '/identity/accountRecord/update',
                    method: 'POST',
                    data: this.modifyParams
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.modifyAccount = false
                        this.$message.success('修改成功');
                        this.queryProList()
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            queryProList () {
                this.$http({
                    url: this.baseUrl + '/identity/accountRecord/pageInfo',
                    method: 'GET',
                    params: this.reqListParams
                }).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                        this.product.list = res.data.data.collection
                        this.product.count = res.data.data.count
                    }
                })
            },
            search () {
                this.reqListParams.pageNum = 1
                this.queryProList()
            },
            // 入库产品函数
            handleStorage (index, item) {
                this.inStorePro.productId = item.id
                this.inStorePro.name = item.name
                this.inStorePro.code = item.code
                this.addStorage = true
            },
            // 入库产品详情
            handleStoreDetail (index,item) {
                this.modifyParams.name = item.name
                this.modifyParams.detail = item.detail
                this.modifyParams.id = item.id
                this.modifyParams.payType = item.payType
                this.modifyParams.amount = item.amount
                this.modifyParams.remark = item.remark
                this.modifyAccount = true
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
                this.selectIndex = index
                this.delVisible = true

            },
            handleAddTop(index, row) {
                console.log(row)
                this.$http({
                    url: this.baseUrl + '/identity/product/setUp/' + row.id,
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
            },
            deleteRow () {
                this.delVisible = false
                this.$http({
                    url: this.baseUrl + '/identity/accountRecord/delete/' + this.product.list[this.selectIndex].id,
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
        width: 200px !important;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>

