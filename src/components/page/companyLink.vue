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
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="job" label="职务" align="center"></el-table-column>
                <el-table-column prop="likes" label="爱好" align="center"></el-table-column>
                <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
                <el-table-column prop="addr" label="地址" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center"></el-table-column>
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
        <el-dialog :title="title" :visible.sync="editVisible" width="30%" append-to-body>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="ID" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="公司ID" v-show="false">
                    <el-input v-model="query.id"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name"
                              :rules="[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ]">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="爱好">
                    <el-input v-model="form.likes"></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="birthday"
                              :rules="[
                    { required: true, message: '请选择出生日期', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.birthday"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            default-time="00:00:00"
                    />
                </el-form-item>
                <el-form-item label="工作" prop="job"
                              :rules="[
                    { required: true, message: '请输入工作', trigger: 'blur' },
                ]">
                    <el-input v-model="form.job"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="addr"
                              :rules="[
                    { required: true, message: '请输入地址', trigger: 'blur' },
                ]">
                    <el-input v-model="form.addr"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state"
                              :rules="[
                    { required: true, message: '请输入状态', trigger: 'blur' },
                ]">
                    <el-input v-model="form.state"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel"
                              :rules="[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                ]">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email"
                              :rules="[
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ]">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
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
    import { deleteLinkData, fetchLinkData, addLinkData, updateLinkData } from '../../api/index';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    id: '',
                    pageNo: 1,
                    size: 10
                },
                title: '',
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                fetchLinkData(this.query).then(res => {
                    this.tableData = this.tableData = res.data.records;
                    this.pageTotal = res.data.total || 0;
                });
            },
            //初始化数据
            dataInitialization(id) {
                this.query.id = id;
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
                        console.log(123);
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
                        this.editVisible = false;
                        addLinkData(this.form).then(res => {
                            this.$message.success(`新增成功`);
                            this.getData();
                        });
                    });
                } else {
                    this.$refs['form'].validate(valid => {
                        this.editVisible = false;
                        updateLinkData(this.form).then(res => {
                            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.$set(this.tableData, this.idx, this.form);
                        });
                    });
                }

            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
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
</style>
