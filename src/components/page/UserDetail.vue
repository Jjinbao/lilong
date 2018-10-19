<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" id="print">
            <el-table :data="userInfo" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="realName" label="姓名" width="120"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
                <el-table-column prop="totalSend" label="发货次数" width="120"></el-table-column>
                <el-table-column prop="totalAmount" label="消费金额" width="120"></el-table-column>
                <el-table-column prop="createDate" label="添加日期" width="150"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addVisible = true">新增发货地址</el-button>
            </div>
            <el-table :data="userSendAddressList" border style="width: 100%;margin-top: 10px;" ref="multipleTable">
                <el-table-column prop="address" label="发货地址" width="380"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
                <el-table-column prop="default" label="默认地址" width="120"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" v-show="!scope.row.common" @click="handleDefault(scope.$index, scope.row, scope)">设为默认地址</el-button>
                        <el-button size="small" type="danger" v-show="!scope.row.common" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--新增发货地址-->
        <el-dialog title="新增发货地址" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="80px">
                <!--<el-form-item label="日期">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="地址">
                    <el-input v-model="addForm.address"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="设为默认">
                    <el-switch v-model="addForm.common"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!--删除发货地址-->
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
                userCommonData: {},
                userInfo: [],
                userSendAddressList: [
                    {id:1, address: '北京市丰台区', mobile: '18210596067', common: true, default: '是', remark: '默认地址'},
                    {id:1, address: '北京市丰台区', mobile: '18210596067', common: false, default: '否',remark: '这个不是默认收货地址'},
                    {id:1, address: '北京市西城区', mobile: '18210596067', common: false, default: '否',remark: '这个也不是'}
                ],
                // 新增发货地址变量
                addVisible: false,
                // 删除发货地址变量
                delVisible: false,
                addForm: {
                    address: '',
                    mobile: '',
                    remark: '',
                    common: false
                },
                // 删除发货地址的参数
                deleteTarget: {}
            }
        },
        created() {
            this.$nextTick(() => {
                this.queryUser()
            })
        },
        computed: {
        },
        methods: {
            // 根据用户id获取用户详情信息
            queryUser () {
                this.$http({
                    url: this.baseUrl + '/identity/user/getDetail/' + this.$route.query.uid,
                    method: 'GET'
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.userCommonData = res.data.data
                        this.userInfo = []
                        this.userInfo.push(this.userCommonData)
                        this.userSendAddressList = res.data.data.userSendAddressList
                        this.userSendAddressList.forEach((item) => {
                            if (item.common) {
                                item.default = '是'
                            } else {
                                item.default = '否'
                            }
                        })
                    }
                })
            },
            // 删除用户信息
            handleDelete (index, item) {
                console.log(index, item)
                this.delVisible = true
                this.deleteTarget = item
            },
            // 保存用户发货地址信息
            saveAdd () {
                if (!this.addForm.address) {
                    this.$message.error('地址不能为空');
                    return
                }
                this.$http({
                    url: this.baseUrl + '/identity/user/saveSendAddress',
                    method: 'POST',
                    data: {
                        userId: this.userCommonData.id,
                        takedName: this.userCommonData.realName,
                        address: this.addForm.address,
                        mobile: this.addForm.mobile,
                        remark: this.addForm.remark,
                        common: this.addForm.common
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.addVisible = false
                        this.addForm.address = ''
                        this.addForm.mobile = ''
                        this.addForm.remark = ''
                        this.$message.success('地址添加成功');
                        this.queryUser()
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
                console.log(item)
                this.$http({
                    url: this.baseUrl + '/identity/user/updateSendAddressCommon/' + item.id,
                    method: 'GET'
                }).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                        this.$message.success('默认地址设置成功');
                        this.queryUser()
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            print () {
                let newstr = document.getElementById('print').innerHTML;
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
</style>
