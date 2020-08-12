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
                    <el-select v-model="value" @clear="clearComp" clearable filterable placeholder="请选择"
                               @change="selectComp(value)">
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
                            @change="changeProvinceCity"
                    ></el-cascader>
                </template>
                <template>
                    <el-input @clear="clearUserName" clearable v-model="query.userName" placeholder="请输入用户名"
                              style="width: 250px"></el-input>
                </template>
                <template>
                    <el-input @clear="clearName" clearable v-model="query.name" placeholder="请输入姓名"
                              style="width: 200px"></el-input>
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
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="text"
                                @click.stop
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="text"
                                @click.stop
                                @click="handleAuth(scope.$index, scope.row)">权限
                        </el-button>
                        <el-button
                                size="mini"
                                type="text"
                                @click.stop
                                @click="userRole(scope.$index, scope.row)">角色
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)">删除
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
                    <template v-if="addBaseOrg.length &gt; 0">
                        <el-form-item label="机构名称" rop="compName"
                                      :rules="[
                    { required: true, message: '请输入机构名称', trigger: 'blur' },
                ]">
                            <el-cascader
                                    :model="form.orgId"
                                    :options="orgop"
                                    :props="{ /*multiple: true,*/emitPath: false,emitPath:false,children:'childList',label: 'name',value:'id',checkStrictly:true }"
                                    :clearable="true"
                                    :show-all-levels="false"
                                    @change="changeProvinceCity1"
                            ></el-cascader>
                        </el-form-item>
                    </template>
                <el-form-item label="用户姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName"
                              :rules="[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ]">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel"
                              :rules="[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ]">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type"
                              :rules="[
                    { required: true, message: '请输入类型', trigger: 'blur' },
                ]">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state"
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
        <!-- t添加弹出框 -->
        <el-dialog :title="title" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable">
                <el-form-item label="id" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="compName"
                              :rules="[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ]">
                    <template>
                        <el-select v-model="form.compId" filterable placeholder="请选择"
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
                <template v-if="addBaseOrg.length &gt; 0">
                    <el-form-item label="机构名称" rop="orgId"
                                  :rules="[
                    { required: true, message: '请输入机构名称', trigger: 'blur' },
                ]">
                        <el-cascader
                                :model="form.orgId"
                                :options="orgop"
                                :props="{ /*multiple: true,*/emitPath: false,emitPath:false,children:'childList',label: 'name',value:'id',checkStrictly:true }"
                                :clearable="true"
                                :show-all-levels="false"
                                @change="changeProvinceCity1"
                        ></el-cascader>
                    </el-form-item>
                </template>
                <el-form-item label="用户姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName"
                              :rules="[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ]">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password"
                              :rules="[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="repassword"
                              :rules="[
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                ]">
                    <el-input v-model="form.repassword"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel"
                              :rules="[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ]">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type"
                              :rules="[
                    { required: true, message: '请输入类型', trigger: 'blur' },
                ]">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state"
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
                            @change="checked=>checkRow(checked, value)"
                    >
                        <el-checkbox v-for="comm in roleChecks" :label="comm.id" :key="comm.id">{{comm.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="esc">取 消</el-button>
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
                addBaseOrg: [],
                options: [],
                value: '',
                value1: '',
                compName: '',
                query: {
                    id: '',
                    compId: '',
                    orgId: '',
                    abbreviation: '',
                    pageNo: 1,
                    size: 10,
                    userName: '',
                    name: ''
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
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
            changeProvinceCity(value) {
                this.query.orgId = value;
            },changeProvinceCity1(value) {
                this.form.orgId = value;
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
                this.$set(this.query, 'pageNo', val);
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
                this.getComp();
                this.addVisible = true;
                this.title = "新增"
                this.form = {}
                this.disable = false;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            clearComp() {
                this.query.compId = '';
                this.baseOrg = [];
            }, clearUserName() {
                this.query.userName = '';

            }, clearName() {
                this.query.name = '';
            },
            selectComp(value) {
                this.query.compId = value;
                getOrg(this.query).then(res => {
                    if (res.code === 0) {

                        this.baseOrg = res.data;
                    }
                })

            }, selectComp1(value) {
                this.query.compId = value;
                getOrg(this.query).then(res => {
                    if (res.code === 0) {

                        this.addBaseOrg = res.data;
                    }
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
                this.selectComp(row.compId);
                console.log(this.baseOrg);
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
                    this.setUserRole.roleIds = '';
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].flag === 1) {
                            this.roleChecked.push(data[i].id);
                            this.setUserRole.roleIds += data[i].id + ',';
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
                        if(valid){
                            this.addVisible = false;
                            addUser(this.form).then(res => {
                                this.$message.success(`新增成功`);
                                this.getData()
                            });
                        }
                    });

                } else {
                    this.$refs['form'].validate(valid => {
                       if(valid){
                           this.editVisible = false;
                           updateUser(this.form).then(res => {
                               this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                               this.$set(this.tableData, this.idx, this.form);
                           });
                       }
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
                        this.$message.success(`设置成功`);
                    } else {
                        this.$message.error(`设置失败`);
                    }
                    this.roleVisible = false;
                });
            },/*
            selectRole(item) {
                var set = Array.from(new Set(item));
                this.setUserRole.roleIds = '';
                for (var i = 0; i < set.length; i++) {
                    this.setUserRole.roleIds += set[i] + ',';
                }
            },*/
            esc() {

                this.roleVisible = false;
            },
            checkRow(checked, value) {
                var data = `${checked}`;
                this.setUserRole.roleIds = data;
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
