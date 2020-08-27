<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">添加</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    @row-click="openDetails"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="taxpayerType" label="纳税人类型"  align="center"></el-table-column>
                <el-table-column prop="name" label="开票名称" align="center"></el-table-column>
                <el-table-column prop="identificationNo" label="识别号" align="center"></el-table-column>
                <el-table-column prop="bank" label="开票银行" align="center"></el-table-column>
                <el-table-column prop="registerTel" label="注册电话" align="center" min-width=""></el-table-column>
                <el-table-column prop="registerAddr" label="注册地址" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">

                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click.stop
                                @click="handleDelete( scope.row.id)"
                        >删除
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNo"
                        :page-size="query.size"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="50%" append-to-body>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="ID" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="业主ID" v-show="false">
                    <el-input v-model="query.ownerId" ></el-input>
                </el-form-item>
                <el-form-item label="纳税人类型" prop="taxpayerType" label-width="150px"
                              :rules="[
                    { required: true, message: '请选择纳税人类型', trigger: 'blur' },
                ]">
                    <el-select v-model="form.taxpayerType" placeholder="请选择">
                        <el-option :value="types.name" :key="types.name" :label="types.name"
                                   v-for="types in taxpayerType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="识别号" prop="identificationNo" label-width="150px"
                              :rules="[
                    { required: true, message: '请输入识别号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.identificationNo" @input="getInfo"></el-input>
                </el-form-item>
                <el-form-item label="开票名称" prop="name" label-width="150px"
                              :rules="[
                    { required: true, message: '请输入开票名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="开票银行" prop="bank" label-width="150px"
                              :rules="[
                    { required: true, message: '请输入开票银行', trigger: 'blur' },
                ]">
                    <el-input v-model="form.bank"></el-input>
                </el-form-item>
                <el-form-item label="开票银行账户" prop="bankAccountNo" label-width="150px"
                              :rules="[
                    { required: true, message: '请输入开票银行账户', trigger: 'blur' },
                ]">
                    <el-input v-model="form.bankAccountNo"></el-input>
                </el-form-item>
                <el-form-item label="注册电话" prop="registerTel" label-width="150px"
                              :rules="[
                     { required: true, message: '请输入电话', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                ]">
                    <el-input v-model="form.registerTel"></el-input>
                </el-form-item>
                <el-form-item label="注册地址" prop="registerAddr" label-width="150px"
                              :rules="[
                    { required: true, message: '请输入注册地址', trigger: 'blur' },
                ]">
                    <el-input v-model="form.registerAddr"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="150px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>

                <el-form-item label="录入人" label-width="150px">
                    <el-input v-model="form.createdName"></el-input>
                </el-form-item>
                <el-form-item label="录入时间" prop="establishmentDate" label-width="150px">
                    <el-date-picker
                            v-model="form.createdAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                    />
                </el-form-item>
                <el-form-item label="修改人" label-width="150px">
                    <el-input v-model="form.modifiedName"></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="establishmentDate" label-width="150px">
                    <el-date-picker
                            v-model="form.modifiedAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { deleteLinkData, fetchLinkData, addLinkData, updateLinkData, getInfo } from '../../api/owner';
    import { getDictItemByDictId } from '../../api/building';
    export default {
        name: 'ownerInvoiceInfo',
        data() {
            return {
                query: {
                    ownerId: '',
                    pageNo: 1,
                    size: 10
                },
                title: '',
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                taxpayerType:[],
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        methods: {
            getData() {
                fetchLinkData(this.query).then(res => {
                    this.tableData = this.tableData = res.data;
                    this.pageTotal = res.data.pageTotal || 0;
                });
                getDictItemByDictId(8).then(res => {
                    this.taxpayerType = res.data;
                });
            },
            //初始化数据
            dataInitialization(id) {
                this.query.ownerId = id;
                this.getData();
            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                this.title = '查看';

            },
            //新增操作
            handleAdd() {
                this.editVisible = true;
                this.title = '新增';
                this.form = {};
                this.form.ownerId = this.query.ownerId;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(id) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteLinkData(id).then(res => {
                            this.$message.success('删除成功');
                            this.getData();
                        });
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            getInfo(){
                if (this.form.taxpayerType&&this.form.identificationNo){
                    getInfo(this.form).then(res =>{
                        if (res.data!=null){
                            this.$set(this.form, 'name', res.data.name);
                            this.$set(this.form, 'bank', res.data.bank);
                            this.$set(this.form, 'registerTel', res.data.registerTel);
                            this.$set(this.form, 'registerAddr', res.data.registerAddr);
                            this.$set(this.form, 'remark', res.data.remark);
                        }
                    })
                }
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.title = '编辑';
                this.editVisible = true;
            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增') {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            this.editVisible = false;
                            addLinkData(this.form).then(res => {
                                this.$message.success(`新增成功`);
                                this.getData();
                            });
                        }
                    });
                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            this.editVisible = false;
                            updateLinkData(this.form).then(res => {
                                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                this.$set(this.tableData, this.idx, this.form);
                            });
                        }
                    });
                }

            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    .el-input{
        width: 200px;
    }
    .el-input__inner{
        width: 200px;
    }
</style>
