<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 公司列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <el-select v-model="value" filterable placeholder="请选择" @change="selectComp(value)">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>

                <template v-if="baseOrg.length &gt; 0">
                    <el-cascader
                            :model="value1"
                            :options="orgop"
                            :props="{ /*multiple: true,*/emitPath: false,emitPath:false,children:'childList',label: 'name',value:'id',checkStrictly:true }"
                            :clearable="true"
                            :show-all-levels="false"
                            @change="aa"
                    ></el-cascader>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @row-click="openDetails"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="orgName" label="机构名称" align="center"></el-table-column>
                <el-table-column prop="name" label="用户姓名" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" align="center"></el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
                <el-table-column prop="createdName" label="录入人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="录入时间" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button-group>

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
                                        @click="handleDelete(scope.row.id)"
                                >删除
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        class="red"
                                        @click.stop
                                        @click="handleAuth(scope.$index, scope.row)"
                                >权限
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        class="red"
                                        @click.stop
                                        @click="userRole(scope.$index, scope.row)"
                                >角色
                                </el-button>

                            </el-button-group>
                        </el-row>
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
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable">
                <el-form-item label="id" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="compName"
                              :rules="[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.compName"></el-input>
                </el-form-item>
                <el-form-item label="机构名称">
                    <el-input v-model="form.orgName"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="compAddr"
                              :rules="[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ]">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="registeredAddr"
                              :rules="[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ]">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="registeredAddr"
                              :rules="[
                    { required: true, message: '请输入类型', trigger: 'blur' },
                ]">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="registeredAddr"
                              :rules="[
                    { required: true, message: '请输入状态', trigger: 'blur' },
                ]">
                    <el-input v-model="form.state"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 用户权限弹出框 -->
        <el-dialog :title="title" :visible.sync="authVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable">
                <template>
                    <el-checkbox-group
                            v-model="checked"
                            @change="selectall"
                    >
                        <el-checkbox v-for="comm in checks" :label="comm.id" :key="comm.id">{{comm.name}}</el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="authVisible = false">取 消</el-button>
                <el-button type="primary" @click="setUserComms">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 用户j角色弹出框 -->
        <el-dialog :title="title" :visible.sync="roleVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable">
                <template>
                    <el-checkbox-group
                            v-model="roleChecked"
                            @change="selectRole"
                    >
                        <el-checkbox v-for="comm in roleChecks" :label="comm.id" :key="comm.id">{{comm.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="setUserRoles">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        userList,
        addUser,
        updateUser,
        deleteUser,
        getComp,
        getOrg,
        getUserComm,
        setUserComm,
        getUserRole,
        setUserRole
    } from '../../api/user';
    import CitySelect from '../common/CitySelect';
    import {treeorg} from '../../api/treemenu';

    export default {
        name: 'basetable',
        data() {
            return {
                setUserComm: {
                    commIds: '',
                    userId: '',
                },
                setUserRole: {
                    userId: '',
                    roleIds: '',
                    compId: ''
                },
                checks: [],
                checked: [],
                roleChecks: [],
                roleChecked: [],
                orgop: [],
                baseOrg: [],
                options: [],
                value: '',
                value1: '',
                query: {
                    id: '',
                    compId: '',
                    abbreviation: '',
                    pageNo: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                authVisible: false,
                roleVisible: false,
                pageTotal: 0,
                disable: false,
                cmpVisible: false,
                form: {},
                idx: -1,
                title: '',
                addList: {
                    province: "",
                    city: "",
                    area: ""
                },
                id: -1
            };
        },
        created() {
            this.getData();
            this.getComp();
            this.initOrg();
        },
        components: {
            CitySelect
        }
        ,
        methods: {
            aa() {
            },
            initOrg() {
                treeorg(this.query).then(res => {
                    if (res.code === 0) {
                        this.orgop = res.data;
                    }
                });
            },

            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                this.title = "查看"

            },
            handleAdd() {
                this.editVisible = true;
                this.title = "新增"
                this.form = {}
                this.disable = false;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            selectComp(value) {
                this.query.compId = value;
                getOrg(this.query).then(res => {
                    this.baseOrg = res.data;
                })

            },
            getComp() {
                getComp().then(res => {
                    this.options = res.data;
                });
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                userList(this.query).then(res => {
                    this.tableData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
                this.disable = false;
                this.title = "修改"
            },
            // 数据权限
            handleAuth(index, row) {
                this.setUserComm.userId = row.id;
                getUserComm(row).then(res => {
                    var data = res.data;
                    if (res.code === 0) {
                        this.checks = res.data;
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].flag === 1) {
                            this.checked.push(data[i].id);
                        }
                    }

                });
                this.idx = index;
                this.form = row;
                this.authVisible = true;
                this.disable = false;
                this.title = "设置数据权限"
            },
            // 用户角色
            userRole(index, row) {
                this.setUserRole.userId = row.id;
                this.setUserRole.compId = row.compId;
                getUserRole(row).then(res => {
                    var data = res.data;
                    if (res.code === 0) {
                        this.roleChecks = res.data;
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].flag === 1) {
                            this.roleChecked.push(data[i].id);
                            this.setUserRole.roleIds += data[i].id + data
                            ',';
                        }
                    }
                });
                this.idx = index;
                this.form = row;
                this.roleVisible = true;
                this.disable = false;
                this.title = "设置角色"
            },
            // 删除操作
            handleDelete(id) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteUser(id).then(res => {
                            this.$message.success('删除成功');
                            this.getData();
                        });
                    })
                    .catch(() => {
                    });
            },
            // 保存编辑
            saveEditOrAdd(title) {

                if (title === '新增') {
                    this.$refs['form'].validate(valid => {
                        this.editVisible = false;
                        addUser(this.form).then(res => {
                            this.$message.success(`新增成功`);
                            this.getData()
                        });
                    });

                } else {
                    this.$refs['form'].validate(valid => {
                        this.editVisible = false;
                        updateUser(this.form).then(res => {
                            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.$set(this.tableData, this.idx, this.form);
                        });
                    });
                }

            },
            // 将选中的权限封装
            selectall(value) {
                this.setUserComm.commIds = '';
                for (var i = 0; i < value.length; i++) {
                    this.setUserComm.commIds += value[i] + ',';
                }
            },
            // 设置用户数据权限
            setUserComms() {
                setUserComm(this.setUserComm).then(res => {
                });
                this.authVisible = false;
                window.location.reload();
            },
            // 设置用户角色
            setUserRoles() {
                setUserRole(this.setUserRole).then(res => {
                    if (res.data) {
                        console.log("success");
                    }
                    console.log("error");
                    this.roleVisible = false;
                });
            },
            selectRole(value) {
                this.setUserRole.roleIds = '';
                for (var i = 0; i < value.length; i++) {
                    this.setUserRole.roleIds += value[i] + ',';
                }
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
</style>
