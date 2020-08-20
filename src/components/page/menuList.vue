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
                    <el-input clearable v-model="query.menuName" placeholder="请输入菜单名"
                              style="width: 200px"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addParentMenu">新增</el-button>
            </div>
            <el-table
                    :data="menuData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="菜单名" align="center"></el-table-column>
                <el-table-column prop="url" label="菜单连接" align="center"></el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="icon" label="图标" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
                <el-table-column prop="createAt" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="更新时间" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="更新人" align="center"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="text"
                                @click.stop
                                @click="editMenu(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="text"
                                @click.stop
                                @click="addMenu(scope.row)">添加下级
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="deleteMenu(scope.row.id)">删除
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
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="updateForm" :model="updateForm" label-width="70px" :disabled="disable">
                <template>
                    <el-form-item label="父菜单id" v-show="false">
                        <el-input v-model="updateForm.id" @input="change($event)"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单名称" label-width="100px" prop="name"
                                  :rules="[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ]">
                        <el-input v-model="updateForm.name" @input="change($event)"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单连接" label-width="100px">
                        <el-input v-model="updateForm.url" @input="change($event)"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标" label-width="100px">
                        <el-input v-model="updateForm.icon" @input="change($event)"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" label-width="100px">
                        <el-input v-model="updateForm.type" @input="change($event)"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" label-width="100px">
                        <el-input v-model="updateForm.state" @input="change($event)"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px" :disabled="disable">
                <template>
                    <el-form-item label="父菜单id" label-width="100px" v-show="false">
                        <el-input v-model="form.parentId"></el-input>
                    </el-form-item>
                    <el-form-item label="父菜单名称"label-width="100px"  disabled="true" v-show="hidden" >
                        <el-input v-model="form.fcd"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单名称" label-width="100px" prop="name"
                                  :rules="[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ]">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单连接" label-width="100px">
                        <el-input v-model="form.url"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标" label-width="100px">
                        <el-input v-model="form.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" label-width="100px">
                        <el-input v-model="form.type"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" label-width="100px">
                        <el-input v-model="form.state"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getMenuList, updateMenu, addMenu, deleteMenu} from '../../api/menuList'

    export default {
        data() {
            return {
                disable:false,
                hidden: true,
                title: '',
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
                menuData: [],
                query: {
                    pageNo: 1,
                    size: 10,
                    menuName: ''
                },
                form: {},
                updateForm: {},
            };
        },
        created() {
            this.init();
        },
        methods: {
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            init() {
                getMenuList(this.query).then(res => {
                    this.menuData = res.data.records;
                    this.pageTotal = res.data.total || 0;
                });
            },
            handleSearch() {
                this.$set(this.query, 'pageNo', 1);
                this.init();
            },
            editMenu(index, row) {
                this.title = '编辑菜单'
                this.updateForm.name = row.name;
                this.updateForm.url = row.url;
                this.updateForm.type = row.type;
                this.updateForm.state = row.state;
                this.updateForm.icon = row.icon;
                this.updateForm.id = row.id;
                this.editVisible = true;
            },
            addMenu(row) {
                this.hidden = true;
                this.form = {};
                this.form.fcd = row.name;
                this.form.parentId = row.id;
                this.form.parentIdList = row.parentIdList + "," + row.id;
                this.title = '添加菜单'
                this.addVisible = true;
            },
            addParentMenu() {
                this.hidden = false;
                this.form = {};
                this.form.parentIdList = 0;
                this.title = '添加菜单'
                this.addVisible = true;
            },
            deleteMenu(id) {
                this.$confirm('删除后该菜单下的子菜单也会删除，确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(()=>{
                    deleteMenu(id).then(res => {
                        if (res.code === 0 && res.data) {
                            this.$message.success('删除成功');
                            this.init();
                        }
                    });
                });
            },
            submit() {
                if (this.title === "编辑菜单") {
                    this.$refs['updateForm'].validate(valid => {
                        if(valid){
                            updateMenu(this.updateForm).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success('修改成功');
                                    this.editVisible = false;
                                }
                            });
                        }
                    });
                } else {
                    this.$refs['form'].validate(valid => {
                        if(valid){
                            addMenu(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success('添加成功');
                                    this.addVisible = false;
                                }

                            });
                        }
                    });
                }
                this.init();
            },
            change(e) {
                this.$forceUpdate();
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