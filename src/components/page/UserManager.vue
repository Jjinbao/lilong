<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="reqParams.search" placeholder="请输入客户姓名/手机号" class="handle-input"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" style="float: right" icon="search" @click="addVisible = true">新增客户</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="createDate" label="添加日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="realName" label="姓名" width="120"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
                <el-table-column prop="memberNo" label="PM编码" width="120"></el-table-column>
                <el-table-column prop="totalSend" label="发货次数" width="120"></el-table-column>
                <el-table-column prop="totalAmount" label="消费金额" width="120"></el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleDetail(scope.$index, scope.row, scope)">详情</el-button>
                        <el-button size="small" type="success" @click="handleOrder(scope.$index, scope.row, scope)">订单</el-button>
                        <el-button size="small" type="default" @click="handleEdit(scope.$index, scope.row, scope)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalElement">
                </el-pagination>
            </div>
        </div>

        <!--新增用户-->
        <el-dialog title="新增客户" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="80px">
                <!--<el-form-item label="日期">-->
                    <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="姓名">
                    <el-input v-model="addForm.realName"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号">
                    <el-input v-model="addForm.memberNo"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑用户信息-->
        <el-dialog title="编辑客户" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="editForm" label-width="80px">
                <!--<el-form-item label="日期">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="姓名">
                    <el-input v-model="editForm.realName" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="editForm.mobile" disabled></el-input>
                </el-form-item>
                <el-form-item label="会员卡号">
                    <el-input v-model="editForm.memberNo"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                totalElement: 0,
                cur_page: 1,
                multipleSelection: [],
                searchWords: {
                    mobile: '',
                    realName: ''
                },
                delVisible: false, // 显示隐藏删除弹窗
                addVisible: false, // 显示隐藏新增弹窗
                editVisible: false, // 显示隐藏编辑窗口
                holdDoubleClick: false,
                // 新增用户信息对象
                addForm: {
                    realName: '',
                    mobile: '',
                    memberNo: '',
                    remark: ''
                },
                editForm: {
                    realName: '',
                    mobile: '',
                    memberNo: '',
                    remark: '',
                    id: ''
                },
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1,
                reqParams: {
                    search: '',
                    pageNum: 1,
                    pageSize: 10
                }
            }
        },
        created() {
            console.log('-------===')
            this.$nextTick(() => {
                this.getData();
            })
        },
        computed: {
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.reqParams.pageNum = this.cur_page
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$http({
                    url: this.baseUrl + '/identity/user/pageInfo',
                    method: 'GET',
                    params: this.reqParams
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.collection
                        this.totalElement = res.data.data.count
                    }
                })
            },
            search() {
                this.reqParams.pageNum = this.cur_page = 1
                this.getData();
                // this.is_search = true;
            },
            // 编辑用户信息
            handleEdit (index, row) {
                console.log(row)
                this.editForm.realName = row.realName
                this.editForm.memberNo = row.memberNo
                this.editForm.mobile = row.mobile
                this.editForm.remark = row.remark
                this.editForm.id = row.id
                this.editVisible = true
            },

            saveEdit () {
                this.$http({
                    url: this.baseUrl + '/identity/user/updateUser',
                    method: 'POST',
                    data: {
                        realName: this.editForm.realName,
                        mobile: this.editForm.mobile,
                        remark: this.editForm.remark,
                        memberNo: this.editForm.memberNo,
                        id: this.editForm.id
                    }
                }).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                        this.editForm = {
                            realName: '',
                            mobile: '',
                            remark: '',
                            memberNo: ''
                        }
                        this.editVisible = false
                        this.$message.success('添加成功')
                        this.reqParams.pageNum = 1
                        this.getData()
                    } else {
                        this.$message.success(res.data.message)
                    }
                })
            },
            handleDetail (index, row, scope) {
                this.$router.push({
                    path: '/user-detail?uid='+row.id
                })
            },
            handleDelete(index, row) {
                console.log(row)
                this.idx = index;
                this.delVisible = true;
            },
            handleOrder (index, row) {
                this.$router.push({
                    path: '/user-order?id=' +row.id
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                // this.tableData.splice(this.idx, 1);
                console.log(this.tableData[this.idx])

                this.$http({
                    url: this.baseUrl + '/identity/user/deleteUser/' + this.tableData[this.idx].id,
                    method: 'GET'
                }).then((res) => {
                    if(res.data.code === 0) {
                        this.getData()
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            // 确定保存用户
            saveAdd () {
                if (!this.addForm.realName) {
                    this.$message.error('请填写客户姓名')
                    return

                }
                this.$http({
                    url: this.baseUrl + '/identity/user/saveUser',
                    method: 'POST',
                    data: {
                        realName: this.addForm.realName,
                        mobile: this.addForm.mobile,
                        remark: this.addForm.remark,
                        memberNo: this.addForm.memberNo
                    }
                }).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                        this.addForm = {
                            realName: '',
                            mobile: '',
                            remark: '',
                            memberNo: ''
                        }
                        this.addVisible = false
                        this.$message.success('添加成功')
                        this.reqParams.pageNum = 1
                        this.getData()
                    } else {
                        this.$message.success(res.data.message)
                    }
                })
                // this.addVisible = false
            }
        },
        mounted() {

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
