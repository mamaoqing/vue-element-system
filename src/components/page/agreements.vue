<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 协议列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="compValue" @clear="clearComp" clearable filterable placeholder="请选择物业公司"
                           @change="selectComp(compValue)">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <child @child1="checkInQuery" :distId="agreementId" :distName="agreementType"></child>
                <el-select v-model="roleValue" @clear="clearRole" clearable filterable placeholder="请选择角色"
                           @change="selectRole(roleValue)">
                    <el-option
                            v-for="item in roles"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="agreeValue" @clear="clearAgree" clearable filterable placeholder="请选择协议期限"
                           @change="selectAgree(agreeValue)">
                    <el-option
                            v-for="item in agrees"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addAgreement">新增</el-button>
            </div>
            <el-table
                    :data="agreementData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="180" align="center"></el-table-column>
                <el-table-column prop="compId" label="物业公司id" align="center" v-if="false"></el-table-column>
                <el-table-column prop="commName" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="commId" label="社区id" align="center" v-if="false"></el-table-column>
                <el-table-column prop="no" label="协议编号" align="center"></el-table-column>
                <el-table-column prop="roleName" label="协议类型" align="center"></el-table-column>
                <el-table-column prop="roleId" label="角色id" align="center" v-if="false"></el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
                <el-table-column prop="beginDate" label="协议开始时间" align="center"></el-table-column>
                <el-table-column prop="endDate" label="协议结束时间" align="center"></el-table-column>
                <el-table-column prop="createdName" label="录入人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="录入时间" width="180" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" width="180" align="center"></el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="editAgree(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                @click.stop
                                @click="deleteAgree(scope.row.id)">删除
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
        <el-dialog :title="title" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="form" label-width="70px" :disabled="disable">
                <el-form-item label="公司名称" label-width="100px" prop="compId"
                              :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                    <template>
                        <el-select v-model="form.compId" filterable placeholder="请选择公司"
                                   @change="selectComp1(form.compId)">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>

                </el-form-item>
                <template v-if="commList.length &gt; 0">
                    <el-form-item label="社区名称" label-width="100px" prop="commId"
                                  :rules="[
                    { required: true, message: '请选择社区', trigger: 'blur' },
                ]">

                        <el-select v-model="form.commId" filterable placeholder="请选择社区"
                                   @change="selectComm(form.commId)">
                            <el-option
                                    v-for="item in commList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item label="协议角色" label-width="100px">
                    <el-select v-model="form.roleValue" @clear="clearRole" clearable filterable placeholder="请选择角色"
                               @change="selectRoleForm(form.roleValue)">
                        <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="协议编号" label-width="100px" prop="beginDate"
                              :rules="[
                    { required: true, message: '请输入协议编号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="协议类型" label-width="100px">
                    <child @child1="checkInForm" :distId="agreementId" :distName="agreementType"></child>
                </el-form-item>
                <el-form-item label="协议开始时间" label-width="100px" prop="beginDate"
                              :rules="[
                    { required: true, message: '请选择协议开始时间', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.beginDate"
                            type="datetime"
                            format="yyyy-MM-dd"
                            placeholder="选择协议开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="协议结束时间" label-width="100px" prop="endDate"
                              :rules="[
                    { required: true, message: '请选择协议结束时间', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.endDate"
                            type="datetime"
                            format="yyyy-MM-dd"
                            placeholder="选择协议结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="form" label-width="70px" :disabled="disable">
                <el-input v-model="form.id" v-show="false"></el-input>
                <el-form-item label="公司名称" label-width="100px" prop="compId"
                              :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                    <template>
                        <el-select v-model="form.compId" filterable placeholder="请选择公司"
                                   @change="selectComp1(form.compId)">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>

                </el-form-item>
                <template v-if="commList.length &gt; 0">
                    <el-form-item label="社区名称" label-width="100px" prop="commId"
                                  :rules="[
                    { required: true, message: '请选择社区', trigger: 'blur' },
                ]">

                        <el-select v-model="form.commId" filterable placeholder="请选择社区"
                                   @change="selectComm(form.commId)">
                            <el-option
                                    v-for="item in commList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item label="协议角色" label-width="100px">
                    <el-select v-model="form.roleId" @clear="clearRoleUpdate" clearable filterable placeholder="请选择角色"
                               @change="selectRoleUpdate(form.roleId)">
                        <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="协议编号" label-width="100px" prop="no"
                              :rules="[
                    { required: true, message: '请输入协议编号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="协议类型" label-width="100px">
                    <child @child1="checkInForm" :distId="agreementId" :distName="agreementType" :change="agreementChange"></child>
                </el-form-item>
                <el-form-item label="协议开始时间" label-width="100px" prop="beginDate"
                              :rules="[
                    { required: true, message: '请选择协议开始时间', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.beginDate"
                            type="datetime"
                            format="yyyy-MM-dd"
                            placeholder="选择协议开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="协议结束时间" label-width="100px" prop="endDate"
                              :rules="[
                    { required: true, message: '请选择协议结束时间', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.endDate"
                            type="datetime"
                            format="yyyy-MM-dd"
                            placeholder="选择协议结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        insertAgreement,
        listAgreement,
        updateAgreement,
        deleteAgreement,
        allRoleList,
        getCommList
    } from '../../api/agreements'
    import {getComp} from "../../api/user";
    import child from "./child"

    export default {
        components: {
            child
        },
        data() {
            return {
                agreementId: '46',
                agreementType: 'type',
                agreementChange: '',
                agrees: [{
                    id: 'over',
                    name: '已过期'
                }, {
                    id: 'effect',
                    name: '未过期'
                }, {
                    id: 'danger',
                    name: '快过期'
                }],
                query: {
                    pageNo: 1,
                    size: 10,
                    state: '',
                    roleId: '',
                    compId: '',
                },
                agreementData: [],
                pageTotal: 0,
                roleValue: '',
                roles: [],
                agreeValue: '',
                options: [],
                compValue: '',
                addVisible: false,
                editVisible: false,
                detailVisible: false,
                title: '',
                form: {},
                disable: false,
                commList: [],
            }
        },
        created() {
            this.init();
            this.loadRoles();
            this.getComp();
        },
        methods: {
            init() {
                listAgreement(this.query).then(res => {
                    this.agreementData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            handleSearch() {
                this.init();
            },
            loadRoles() {
                allRoleList(null).then(res => {
                    this.roles = res.data.records;
                });
            },
            addAgreement() {
                this.form = {};
                this.title = '新增协议';
                this.addVisible = true;
            },
            editAgree(index, row) {
                this.selectComp1(row.compId);
                this.form = row;
                this.agreementChange = Number(row.type);
                this.form.roleValue = row.roleId;
                this.title = '修改协议';
                this.editVisible = true;
            },
            deleteAgree(id) {
                this.$confirm('删除后有些功能将不能使用。确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteAgreement(id).then(res => {
                        if (res.code === 0 && res.data) {
                            this.$message.success('协议删除成功！！');
                            this.init();
                        }
                    });
                });
            },
            submit() {
                if (this.title === '新增协议') {
                    this.$refs['addForm'].validate(valid => {
                        if (valid) {
                            insertAgreement(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success('协议添加成功！！');
                                    this.addVisible = false;
                                    this.form = {};
                                    this.init();
                                }
                            });
                        }
                    });
                } else {
                    this.$refs['editForm'].validate(valid => {
                        if (valid) {
                            updateAgreement(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success('协议修改成功！！');
                                    this.editVisible = false;
                                    this.init();
                                }
                            });
                        }
                    });
                }
            },
            selectAgree(value) {
                this.query.state = value;
            },
            selectRole(value) {
                this.query.roleId = value;
            },
            selectRoleForm(value) {
                this.form.roleId = value;
            },
            selectRoleUpdate(value) {
                this.form.roleId = value;
            },
            clearAgree(value) {
                this.query.state = '';
            },
            clearRole() {
                this.query.roleId = '';
            },
            clearRoleUpdate() {
                this.form.roleId = '';
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            selectComp(value) {
                this.query.compId = value;
            },
            selectComp1(value) {
                getCommList(value).then(res => {
                    this.commList = res.data;
                });
                this.form.compId = value;
            },
            selectComm(value) {
                this.form.commId = value;
            },
            clearComp() {
                this.query.compId = '';
            },
            getComp() {
                getComp().then(res => {
                    this.options = res.data;
                });
            },
            checkInQuery(value, name) {
                this.query.type = value;
            },
            checkInForm(value, name) {
                this.form.type = value;
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