<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 物业费类型
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="add">新增</el-button>
            </div>
            <el-table
                    :data="costData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="typeNo" label="费用编号" align="center"></el-table-column>
                <el-table-column prop="typeName" label="费用类型" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createdName" label="录入人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="录入时间" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center"></el-table-column>
                <el-table-column label="操作" width="320" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="edit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                @click.stop
                                @click="deleteCostType(scope.row.id)">删除
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
        <el-dialog :title="title" :visible.sync="addVisible" width="60%">
            <el-form ref="addForm" :model="form" label-width="70px">
                <el-form-item label="费用类型编号" label-width="100px" prop="typeNo"
                              :rules="[
                    { required: true, message: '请输入费用类型编号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.typeNo"></el-input>
                </el-form-item>
                <el-form-item label="费用类型名称" label-width="100px" prop="typeName"
                              :rules="[
                    { required: true, message: '请输入费用类型名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.typeName"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="editVisible" width="60%">
            <el-form ref="editForm" :model="form" label-width="70px">
                <el-form-item label="费用类型编号" label-width="100px" prop="typeNo"
                              :rules="[
                    { required: true, message: '请输入费用类型编号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.typeNo"></el-input>
                </el-form-item>
                <el-form-item label="费用类型名称" label-width="100px" prop="typeName"
                              :rules="[
                    { required: true, message: '请输入费用类型名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.typeName"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {listCostType, insertCostType, updateCostType, deleteCostType} from '../../api/tariff/costtype'

    export default {
        data() {
            return {
                costData: [],
                form: {},
                query: {
                    pageNo: 1,
                    size: 10,
                },
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
                title: '',
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                listCostType(this.query).then(res => {
                    this.costData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            add() {
                this.form = {};
                this.addVisible = !this.addVisible;
                this.title = '添加物业费类型';
            },
            edit(index, row) {
                this.editVisible = !this.editVisible;
                this.title = '修改物业费类型';
                this.form = row;
            },
            deleteCostType(id) {
                this.$confirm('删除后，该车位与业主关系也会删除。确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteCostType(id).then(res => {
                        if (res.code === 0 && res.data) {
                            this.$message.success(`删除成功！`);
                            this.init();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
            },
            submit() {
                if (this.title === '添加物业费类型') {
                    this.$refs['addForm'].validate(valid => {
                        if (valid) {
                            insertCostType(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`添加成功！`);
                                    this.addVisible = !this.addVisible;
                                    this.init();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['editForm'].validate(valid => {
                        if (valid) {
                            updateCostType(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`添加成功！`);
                                    this.editVisible = !this.editVisible;
                                    this.init();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            })
                        }
                    });
                }
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
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
</style>