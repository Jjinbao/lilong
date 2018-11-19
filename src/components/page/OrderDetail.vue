<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-if="dealType == 'add'"><i class="el-icon-tickets"></i> 新增产品</el-breadcrumb-item>
                <el-breadcrumb-item v-if="dealType != 'add'"><i class="el-icon-tickets"></i> 产品详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="productEntity" :rules="rules" label-width="80px">
                <el-form-item prop="name" label="产品名称">
                    <el-input class="input-width" v-model="productEntity.name" :disabled="isModify"></el-input>
                </el-form-item>
                <el-form-item prop="brand" label="产品品牌">
                    <el-input class="input-width" v-model="productEntity.brand" :disabled="isModify"></el-input>
                </el-form-item>
                <el-form-item prop="model" label="产品型号">
                    <el-input class="input-width" v-model="productEntity.model" :disabled="isModify"></el-input>
                </el-form-item>
                <el-form-item prop="size" label="产品规格">
                    <el-input class="input-width" v-model="productEntity.size" :disabled="isModify"></el-input>
                </el-form-item>
                <el-form-item prop="material" label="产品材质">
                    <el-input class="input-width" v-model="productEntity.material" :disabled="isModify"></el-input>
                </el-form-item>
                <el-form-item prop="code" label="产品编号">
                    <el-input class="input-width" v-model="productEntity.code" :disabled="isModify"></el-input>
                </el-form-item>
                <el-form-item prop="productionDate" label="生产日期">
                    <el-date-picker class="input-width" v-model="productEntity.productionDate" value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd" type="date" placeholder="生产日期" :disabled="isModify"></el-date-picker>
                </el-form-item>
                <el-form-item label="产品状态" prop="status">
                    <el-select class="input-width" v-model="productEntity.status" :disabled="isModify">
                        <el-option label="关闭" value="0"></el-option>
                        <el-option label="开放" value="1"></el-option>
                        <el-option label="新品" value="2"></el-option>
                        <el-option label="预售新品" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注意事项">
                    <quill-editor class="input-width-area"
                                  ref="myTextEditor"
                                  :disabled="isModify"
                                  v-model="productEntity.notice"
                                  :options="editorNoticeOption" @change="onEditorChange($event)"></quill-editor>
                </el-form-item>
                <el-form-item label="产品描述">
                    <quill-editor class="input-width-area"
                                  ref="myTextEditor"
                                  :disabled="isModify"
                                  v-model="productEntity.desp"
                                  :options="editorDescOption" @change="onEditorChange($event)"></quill-editor>
                </el-form-item>
                <el-form-item label="列表图片">
                    <el-upload
                        :limit="imgNumber"
                        :disabled="isModify"
                        class="input-width"
                        :headers="headers"
                        :action="actionUrl"
                        :on-preview="handleListPreview"
                        :on-remove="handleListRemove"
                        :on-success="handleListSuccess"
                        :on-error="handleListError"
                        :file-list="fileListPics"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, 只能上传一张图片！</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="轮播图片">
                    <el-upload
                        :limit="switchImgNumber"
                        :disabled="isModify"
                        class="input-width"
                        :headers="headers"
                        :action="actionUrl"
                        :on-preview="handleSwitchPreview"
                        :on-remove="handleSwitchRemove"
                        :on-success="handleSwitchSuccess"
                        :on-error="handleSwitchError"
                        :file-list="fileSwitchPics"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, 最多上传9张图片！</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-if="dealType == 'add'" @click="onSubmit">保存产品</el-button>
                    <el-button type="primary" v-if="dealType == 'modify'" @click="upDate">保存修改</el-button>
                </el-form-item>
            </el-form>
        </div>


    </div>
</template>

<script>
    import OrderStatus from '../../plugin/maps'
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
    export default {
        name: 'basetable',
        components: {
            ElFormItem, quillEditor
        },
        data() {
            return {
                dealType: '',
                productEntity: {
                    brand: '', // 品牌
                    name: '',   // 品名
                    model: '',
                    size: '',
                    material: '',
                    code: '',
                    productionDate: '',
                    status: '0',
                    notice: '',
                    desp: '',
                    listPicId: '',
                    detailPicId: []
                },
                rules: {
                    brand: [{required: true, message: '请输入产品品牌', trigger: 'blur'}],
                    name: [{required: true, message: '请输入产品名称', trigger: 'blur'}],   // 品名
                    model: [{required: true, message: '请输入产品型号', trigger: 'blur'}],
                    size: [{required: true, message: '请输入产品规格', trigger: 'blur'}],
                    material: [{required: true, message: '请输入产品材质', trigger: 'blur'}],
                    code: [{required: true, message: '请输入产品编号', trigger: 'blur'}],
                    productionDate: [{required: true, message: '请选择产品生产日期', trigger: 'blur'}],
                    status: [{required: true, message: '请选择产品状态', trigger: 'blur'}],
                    notice: [{required: true, message: '请输入产品注意事项', trigger: 'blur'}],
                    desp: [{required: true, message: '请输入产品描述', trigger: 'blur'}],
                },
                statusList: [
                    {id: 0, name: '关闭'},
                    {id: 1, name: '开放'},
                    {id: 2, name: '新品'},
                    {id: 3, name: '预售新品'}
                ],
                actionUrl: this.baseUrl + '/manager/identify/picture/savePic',
                fileListPics: [],
                headers: {
                    token: localStorage.getItem('ms_token')
                },
                imgNumber: 1,
                isModify: false,
                // 轮播图图片参数
                switchImgNumber: 9,
                fileSwitchPics: [],
                editorNoticeOption: {
                    placeholder: '请输入注意事项'
                },
                editorDescOption: {
                    placeholder: '请输入产品描述'
                }

            }
        },
        created() {
            this.dealType = this.$route.query.type
            if(this.dealType == 'detail') {
                this.isModify = true
            }
            this.$nextTick(() => {
                if(this.dealType != 'add') {
                    this.queryOrderDetail()
                }
            })
        },
        computed: {},
        methods: {
            onEditorChange({ editor, html, text }) {
            },
            // 预览列表页图片
            handleListPreview(file) {

            },
            // 移除列表页图片
            handleListRemove(file, fileList) {
                this.productEntity.listPicId = ''
            },
            // 列表页图片上传能成功
            handleListSuccess(response, file, fileList) {
                this.productEntity.listPicId = response.data.picId
            },
            handleListError(err, file, fileList) {

            },
            // 预览轮播图页图片
            handleSwitchPreview(file) {

            },
            // 移除列表页图片
            handleSwitchRemove(file, fileList) {
                if(this.dealType == 'add') {
                    let index = this.productEntity.detailPicId.indexOf(file.response.data.picId)
                    this.productEntity.detailPicId.splice(index, 1)
                } else if((this.dealType == 'modify')) {
                    this.productEntity.detailPicId.forEach((item, idx) => {
                        if(file.url.indexOf(item) >= 0) {
                            this.productEntity.detailPicId.splice(idx, 1)
                        }
                    })
                }
            },
            // 列表页图片上传能成功
            handleSwitchSuccess(response, file, fileList) {
                this.productEntity.detailPicId.push(response.data.picId)
            },
            handleSwitchError(err, file, fileList) {

            },
            // 根据订单id获取订单详情
            queryOrderDetail () {
                let _that = this
                this.$http({
                    url: this.baseUrl + '/identity/product/productDetail/' + this.$route.query.id,
                    method: 'GET'
                }).then(res => {
                    if(res.data.code == 0) {
                        this.productEntity = res.data.data.productEntity
                        this.productEntity.status = this.productEntity.status.toString()
                        res.data.data.listPicUrl = res.data.data.listPicUrl.replace(/null/g, this.baseUrl)
                        this.fileListPics = [{name: '', url: res.data.data.listPicUrl}]
                        this.productEntity.detailPicId = []
                        res.data.data.detailPicUrl.forEach((item) => {
                            item = item.replace(/null/g, this.baseUrl)
                            this.fileSwitchPics.push({name: '', url: item})
                            let tempSwitchArr = item.split('/')
                            this.productEntity.detailPicId.push(tempSwitchArr[tempSwitchArr.length - 1])
                        })
                        let tempListArr = res.data.data.listPicUrl.split('/')
                        this.productEntity.listPicId = tempListArr[tempListArr.length - 1]
                        console.log(this.productEntity)
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            // 获取用户信息
            getUserInfo (uid) {
            },
            // 保存用户发货地址信息
            saveAdd () {
            },
            // 删除发货地址函数
            deleteRow () {
            },
            // 把某一个地址设置为默认收货地址
            handleDefault (index, item) {

            },
            // 保存新产品
            onSubmit(val) {
                this.$http({
                    url: this.baseUrl + '/identity/product/saveProduct',
                    method: 'POST',
                    data: {
                        productEntity: this.productEntity,
                        listPicId: this.productEntity.listPicId,
                        detailPicId: this.productEntity.detailPicId
                    }
                }).then((res) => {
                    if(res.data.code == 0) {
                        this.$router.go(-1)
                        this.$message.success('保存成功')
                    }else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            upDate() {
                this.productEntity.id = this.$route.query.id
                this.$http({
                    url: this.baseUrl + '/identity/product/update',
                    method: 'POST',
                    data: {
                        productEntity: this.productEntity,
                        listPicId: this.productEntity.listPicId,
                        detailPicId: this.productEntity.detailPicId
                    }
                }).then((res) => {
                    if(res.data.code == 0) {
                        this.$router.go(-1)
                        this.$message.success('保存成功')
                    }else {
                        this.$message.error(res.data.message)
                    }
                })
            }
        },
        mounted() {
        }
    }

</script>

<style scoped>
    .input-width {
        width: 400px;
    }
    .el-upload__tip{
        color: #E6A23C;
    }
    .input-width-area{
        width: 800px;
    }
</style>
