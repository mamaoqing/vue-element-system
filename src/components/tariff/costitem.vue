<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 物业费项目
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="value" @clear="clearCompQuery" clearable filterable placeholder="请选择物业公司"
                           @change="selectCompQuery(value)">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="typeNo" @clear="clearTypeQuery" clearable filterable placeholder="请选择费用类型"
                           @change="selectTypeQuery(typeNo)">
                    <el-option
                            v-for="item in costType"
                            :key="item.id"
                            :label="item.typeName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-input @clear="clearNo" clearable v-model="query.no" placeholder="请输入费用项目编号"
                          style="width: 250px"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="add">新增</el-button>
            </div>
            <el-table
                    :data="itemData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="costTypeName" label="费用类别" align="center"></el-table-column>
                <el-table-column prop="compName" label="公司" align="center"></el-table-column>
                <el-table-column prop="no" label="项目编号" align="center"></el-table-column>
                <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
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
                                @click="deleteCostItem(scope.row.id)">删除
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
                <el-form-item label="公司名称" label-width="100px" prop="compId"
                              :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                    <el-select v-model="form.compId" @clear="clearCompForm" clearable filterable placeholder="请选择物业公司"
                               @change="selectCompForm(form.compId)">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="费用类型" label-width="100px" prop="costTypeId"
                              :rules="[
                    { required: true, message: '请选择费用类型', trigger: 'blur' },
                ]">
                    <el-select v-model="form.costTypeId" @clear="clearTypeForm" clearable filterable placeholder="请选择费用类型"
                               @change="selectTypeForm(form.costTypeId)">
                        <el-option
                                v-for="item in costType"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="费用项目编号" label-width="100px" prop="no"
                              :rules="[
                    { required: true, message: '请输入费用项目编号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="费用项目名称" label-width="100px" prop="name"
                              :rules="[
                    { required: true, message: '请输入费用项目名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.name"></el-input>
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
                <el-form-item label="公司名称" label-width="100px" prop="compId"
                              :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                    <el-select v-model="form.compId" @clear="clearCompForm" clearable filterable placeholder="请选择物业公司"
                               @change="selectCompForm(form.compId)">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="费用类型" label-width="100px" prop="costTypeId"
                              :rules="[
                    { required: true, message: '请选择费用类型', trigger: 'blur' },
                ]">
                    <el-select v-model="form.costTypeId" @clear="clearTypeForm" clearable filterable placeholder="请选择费用类型"
                               @change="selectTypeForm(form.costTypeId)">
                        <el-option
                                v-for="item in costType"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="费用项目编号" label-width="100px" prop="no"
                              :rules="[
                    { required: true, message: '请输入费用项目编号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="费用项目名称" label-width="100px" prop="name"
                              :rules="[
                    { required: true, message: '请输入费用项目名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.name"></el-input>
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
    import {listCostItem, insertCostItem, updateCostItem, deleteCostItem, listCostType} from '../../api/tariff/costitem'
    import {getComp} from "../../api/user";

    export default {
        data() {
            return {
                typeNo: '',
                value: '',
                options: [],
                costType: [],
                itemData: [],
                title: '',
                form: {},
                query: {
                    pageNo: 1,
                    size: 10,
                },
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
            }
        },
        created() {
            this.init();
            this.getComp();
            this.getCostType();
        },
        methods: {
            init() {
                listCostItem(this.query).then(res => {
                    this.itemData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            edit(index, row) {
                this.form = row;
                this.editVisible = !this.editVisible;
                this.title = '修改费用项目';
            },
            deleteCostItem(id) {
                this.$confirm('删除后，该车位与业主关系也会删除。确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteCostItem(id).then(res=>{
                        if (res.code === 0 && res.data) {
                            this.$message.success(`删除成功！`);
                            this.init();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                });
            },
            add() {
                this.form = {};
                this.addVisible = !this.addVisible;
                this.title = '添加费用项目';
            },
            submit() {
                if (this.title === '添加费用项目') {
                    this.$refs['addForm'].validate(valid => {
                        if (valid) {
                            insertCostItem(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`添加成功！`);
                                    this.addVisible = !this.addVisible;
                                    this.init();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                        }
                    });
                } else {
                    this.$refs['editForm'].validate(valid => {
                        if (valid) {
                            updateCostItem(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`修改成功！`);
                                    this.editVisible = !this.editVisible;
                                    this.init();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                        }
                    });
                }
            },
            search() {
                this.init();
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            clearCompQuery() {
                this.query.compId = '';
            },
            clearTypeQuery() {
                this.query.costTypeId = '';
            },clearCompForm() {
                this.form.compId = '';
            },
            clearTypeForm() {
                this.form.costTypeId = '';
            },
            selectCompQuery(value) {
                this.query.compId = value;
            },
            selectTypeQuery(value) {
                console.log(value);
                this.query.costTypeId = value;
            },selectCompForm(value) {
                this.form.compId = value;
            },
            selectTypeForm(value) {
                console.log(value);
                this.form.costTypeId = value;
            },
            getComp() {
                getComp().then(res => {
                    this.options = res.data;
                });
            },
            getCostType() {
                listCostType().then(res => {
                    this.costType = res.data;
                });
            },
            clearNo() {
                this.query.no = '';
            }
        }
    }
</script>