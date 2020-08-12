<template>
    <el-row>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <el-tree ref="orgtree" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
        </el-col>
        <el-col :span="18">
            <div class="grid-content bg-purple-light">
                <el-button type="primary" icon="el-icon-search" @click="addOrg">添加机构</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addChildOrg">添加下级</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="deleteOrg(form.parentId)">删除机构</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="editParent(form.parentId,form.parentOrgName)">修改机构</el-button>
                <el-table
                        :data="orgList"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @row-click=""
                        @selection-change=""
                >
                    <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                    <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                    <el-table-column prop="compName" label="公司名称" align="center"></el-table-column>
                    <el-table-column prop="name" label="机构名称" align="center"></el-table-column>
                    <el-table-column prop="createdName" label="录入人" align="center"></el-table-column>
                    <el-table-column prop="modifiedAt" label="录入时间" align="center"></el-table-column>
                    <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                    <el-table-column prop="modifiedAt" label="修改时间" align="center"></el-table-column>
                    <el-table-column label="操作" width="160" align="center">

                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deleteOrg(scope.row.id)">删除
                            </el-button>
                            <el-button
                                    size="mini"
                                    @click="edit(scope.row)">修改
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>


            <el-dialog :title="title" :visible.sync="authVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px" :disabled="disable">
                    <el-form-item label="上级机构名称" prop="compAddr"
                                  :rules="[
                    { required: true, message: '请输入上级机构名称', trigger: 'blur' },
                ]">
                        <el-input v-model="form.parentOrgName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="机构名称" prop="compAddr"
                                  :rules="[
                    { required: true, message: '请输入机构名称', trigger: 'blur' },
                ]">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="authVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
            </el-dialog>
            <el-dialog :title="title" :visible.sync="addVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px" :disabled="disable">

                    <el-form-item label="机构名称" prop="compAddr"
                                  :rules="[
                    { required: true, message: '请输入机构名称', trigger: 'blur' },
                ]">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="authVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
            </el-dialog>
        </el-col>
    </el-row>


</template>

<script>
    import {treeorg} from '../../api/treemenu';
    import {addChildOrg, getChildOrg, deleteOrg, updateChildOrg} from '../../api/orgList';

    export default {
        data() {
            return {
                orgList: [],
                data: [],
                defaultProps: {
                    children: 'childList',
                    label: 'name'
                },
                authVisible: false,
                addVisible: false,
                title: '',
                disable: false,
                form: {
                    id: '',
                    parentId: '',
                    name: '',
                    parentIdList: '',
                    parentOrgName: ''
                },
                ids: {
                    id: ''
                }
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                treeorg(this.query).then(res => {
                    if (res.code === 0) {
                        this.data = res.data;
                    }
                });
            },
            handleNodeClick(e) {
                this.form.parentId = e.id;
                this.ids.id = e.id;
                this.form.parentOrgName = e.name;
                this.form.parentIdList = e.parentIdList + "," + e.id;
                this.getChildOrgList();
            },
            // 添加下级机构
            addChildOrg() {
                this.form.name = '';
                this.title = '添加机构';
                this.authVisible = true;
            },
            // 添加机构
            addOrg() {
                this.form.id = '';
                this.title = '添加机构';
                this.form.name = '';
                this.addVisible = true;
                this.form.parentIdList = 0;
                this.form.parentId = '';
            },
            // 提交保存
            submit() {
                if (this.title === '修改机构') {
                    updateChildOrg(this.form).then(res => {
                        this.$message.success(`修改机构成功`);
                        this.init();
                        this.getChildOrgList();
                        this.authVisible = false;
                        this.addVisible = false;
                    });
                }else{
                    addChildOrg(this.form).then(res => {
                        if (0 === res.code) {
                            this.$message.success(`添加机构成功`);
                            this.init();
                            this.getChildOrgList();
                            this.authVisible = false;
                            this.addVisible = false;
                        }
                    });
                }

            },
            // 修改
            edit(row) {
                this.title = '修改机构';
                this.authVisible = true;
                this.form.name = row.name;
                this.form.id = row.id;
            },
            // 删除
            deleteOrg(id) {
                deleteOrg(id).then(res => {
                    this.$message.success(`删除机构成功`);
                    this.init();
                    this.getChildOrgList();
                });
            },
            getChildOrgList() {
                getChildOrg(this.ids).then(res => {
                    if (0 === res.code) {
                        this.orgList = res.data;
                    }
                });
            },
            // 修改父机构
            editParent(id,name){
                this.title = "修改机构";
                this.form.parentId='';
                this.addVisible = true;
                this.form.name = name;
                this.form.id = id;
            }

        }
    };
</script>
<style>
    .el-row {
        margin-bottom: 20px;
        height: 800px;

    &
    :last-child {
        margin-bottom: 0;

    }

    }
    .grid-content {
        height: 850px;
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>