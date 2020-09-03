<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 人员列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <el-input @clear="clearUserName" clearable v-model="query.userName" placeholder="请输入用户名"
                              style="width: 250px"></el-input>
                </template>
                <template>
                    <el-input @clear="clearName" clearable v-model="query.name" placeholder="请输入姓名"
                              style="width: 200px"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @row-click="chooseDetails"
            >
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="orgName" label="机构名称" align="center"></el-table-column>
                <el-table-column prop="name" label="用户姓名" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" width="130" align="center"></el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
                <el-table-column prop="createdName" label="录入人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="录入时间" align="center" width="200"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" width="200"></el-table-column>
                <el-table-column label="操作" width="320" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="openDetails(scope.$index, scope.row)">查看
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
        <el-dialog :title="title" :visible.sync="updateVisible" width="30%" append-to-body>
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable">
                <el-form-item label="id" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" label-width="100px" prop="compName"
                              :rules="[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.compName"></el-input>
                </el-form-item>
                <template v-if="true">
                    <el-form-item label="机构名称" label-width="100px" rop="compName"
                                  :rules="[
                    { required: true, message: '请输入机构名称', trigger: 'blur' },
                ]">
                        <el-cascader

                                v-model="form.orgId"
                                :model="form.ogrId"
                                :options="orgop"
                                :props="{ /*multiple: true,*/emitPath: false,emitPath:false,children:'childList',label: 'name',value:'id',checkStrictly:true }"
                                :clearable="true"
                                :show-all-levels="false"
                                @change="changeProvinceCity1"
                        ></el-cascader>
                    </el-form-item>
                </template>
                <el-form-item label="用户姓名" label-width="100px">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" label-width="100px" prop="userName"
                              :rules="[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ]">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px" prop="tel"
                              :rules="[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ]">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="类型" label-width="100px" prop="type"
                              :rules="[
                    { required: true, message: '请输入类型', trigger: 'blur' },
                ]">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="状态" label-width="100px" prop="state"
                              :rules="[
                    { required: true, message: '请输入状态', trigger: 'blur' },
                ]">
                    <el-input v-model="form.state"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false,baseOrg=[]">取 消</el-button>
                <el-button type="primary" v-if="false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        listUserComm,
        getComp,
        getOrg
    } from '../../api/user';
    import CitySelect from '../common/CitySelect';
    import {treeorg} from '../../api/treemenu';

    export default {
        name: 'basetable',
        data() {
            return {
                setPassword: {
                    id: '',
                    password: '',
                },
                passwordV: false,
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
                updateVisible:false,
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
            }, changeProvinceCity1(value) {
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
            //表格行点击事件
            openDetails (index, row) {
                //具体操作
                this.form = row;
                this.disable=true;
                this.updateVisible = true;
                this.title="查看用户"

            },
            chooseDetails (row) {
                //具体操作
                this.form = row;
                this.sendData(this.form);
            },
            sendData(list) {
                this.$emit('childByValue', list);
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
                console.log(value);
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
                listUserComm(this.query).then(res => {
                    this.tableData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.selectComp(row.compId);
                this.form.orgId = row.orgId;


                this.idx = index;
                this.form = row;
                this.editVisible = true;
                this.disable = false;
                this.title = "修改"
            },
            esc() {

                this.roleVisible = false;
            },
            checkRow(checked, value) {
                var data = `${checked}`;
                this.setUserRole.roleIds = data;
            },
            dataInitializationByAuditerCnf(compId, commId){
                this.query.compId = compId;
                this.query.commId = commId;
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
