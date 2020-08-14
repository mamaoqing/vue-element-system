<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 分区列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form-item label="选择器">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option v-for="item in options" key="bbk" label="步步高" value="bbk"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-top: 5px;">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" style="margin-top: 5px;">新增</el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="handleRefresh" style="margin-top: 5px;">重置</el-button>
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
                <el-table-column prop="comp_name" label="公司名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="comm_name" label="社区名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="name" label="分区名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="detailed_address" label="详细地址" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="builded_date" label="建造日期" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="deliver_date" label="交付日期" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="latitude" label="经度" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="longitude" label="纬度" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155" min-height="55"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155" min-height="55"></el-table-column>
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
                                        icon="el-icon-lx-addressbook"
                                        class="green"
                                        @click.stop
                                        @click="handleCompanyLink(scope.row.id)"
                                >联系人
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
        <el-dialog :title="title" :visible.sync="editVisible" width="55%" >
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable" :inline="true">
                <div >
                    <el-form-item label="id" v-show="false" >
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="公司名称" label-width="150px">
                        <el-input v-model="compName" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="社区名称" label-width="150px">
                        <el-input v-model="commName" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="分区名称" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入分区名称', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.name" ></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="详细地址" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.detailed_address" ></el-input>
                    </el-form-item>
                    <el-form-item label="建造日期" prop="builded_date" label-width="150px"
                                  :rules="[
                    { required: true, message: '请选择建造日期', trigger: 'blur' },
                ]">
                        <el-date-picker
                                v-model="form.builded_date"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00"
                        />
                    </el-form-item><el-form-item label="交付日期" prop="deliver_date" label-width="150px"
                                                 :rules="[
                    { required: true, message: '请选择交付日期', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.deliver_date"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                    />
                </el-form-item>

                    <el-form-item class="item" label="经度" prop="latitude" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入经度', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.latitude" ></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="纬度" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入纬度', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.longitude" ></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="地图地址" prop="map_address" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入地图地址', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.map_address" ></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入状态', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.state" ></el-input>
                    </el-form-item>
                    <el-form-item label="录入人" label-width="150px">
                        <el-input v-model="form.createdName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="录入时间" prop="establishmentDate" label-width="150px" disabled>
                        <el-date-picker
                                v-model="form.createdAt"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00"
                                disabled
                        />
                    </el-form-item>
                    <el-form-item label="修改人" label-width="150px">
                        <el-input v-model="form.modifiedName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="修改时间" prop="establishmentDate" label-width="150px" >
                        <el-date-picker
                                v-model="form.modifiedAt"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00"
                                disabled
                        />
                    </el-form-item>
                </div>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 联系人弹出框   -->
        <el-dialog :visible.sync="cmpVisible" append-to-body>
            <companyLink v-if="cmpVisible" ref="companyLink"></companyLink>
        </el-dialog>
    </div>
</template>

<script scoped>
    import { getAllArea } from '../../api/comm_area';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    name: '',
                    pageNo: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                disable: false,
                cmpVisible: false,
                form: {},
                idx: -1,
                title: '',
                compName:'',
                commName:'',
                id: -1
            };
        },
        created() {
            this.getData();
        },

        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                getAllArea(this.query).then(res => {
                    console.log(res)
                    this.tableData = res;
                    this.compName = res[0].comp_name;
                    this.commName = res[0].comm_name;
                    this.pageTotal = res.length || 0;
                });
            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            handleChange(val) {
                //将省份名称设置到表单里
                let names = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels;
                this.$set(this.form, 'provinceId', val[0]);
                this.$set(this.form, 'cityId', val[1]);
                this.$set(this.form, 'districtId', val[2]);
                this.$set(this.form, 'compAddr', names[0]+names[1]+names[2]);
                this.$set(this.form, 'province', names[0]);
                this.$set(this.form, 'city', names[1]);
                this.$set(this.form, 'district', names[2]);
            },
            // 删除操作
            handleDelete(id) {
                console.log(id);
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteData(id).then(res => {
                            console.log(res);
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
            handleCompanyLink(id) {
                let linkID = id;
                this.cmpVisible = true;
                this.$nextTick(() => {
                    this.$refs.companyLink.dataInitialization(linkID);
                });

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
            handleRefresh() {
                this.query={
                    pageNo: 1,
                    size: 10
                };
                this.getData();
            },
            handleAdd() {
                this.editVisible = true;
                this.title = '新增';
                this.form = {};
                this.disable = false;
                this.$set(this.form, 'createdName', localStorage.getItem('ms_username'));
                this.$set(this.form, 'createdAt', new Date());
                this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                this.$set(this.form, 'modifiedAt', new Date());

            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                console.log(this.form)
                this.partyOrganId[0] = this.form.provinceId;
                this.partyOrganId[1] = this.form.cityId;
                this.partyOrganId[2] = this.form.districtId;
                this.editVisible = true;
                this.disable = false;
                this.title = '修改';
                this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                this.$set(this.form, 'modifiedAt', new Date());

            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                this.title = '查看';

            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增') {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            this.$delete(this.form, 'createdName');
                            this.$delete(this.form, 'createdAt');
                            this.$delete(this.form, 'modifiedName');
                            this.$delete(this.form, 'modifiedAt');
                            this.editVisible = false;
                            addData(this.form).then(res => {
                                this.$message.success(`新增成功`);
                                this.getData();
                            });
                        }
                    });

                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid){

                            this.editVisible = false;
                            this.$delete(this.form, 'modifiedName');
                            this.$delete(this.form, 'modifiedAt');
                            updateData(this.form).then(res => {
                                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                this.$set(this.tableData, this.idx, this.form);
                            });
                        }
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

<style>
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
    .el-form{
        overflow: hidden;
    }
    .el-form-item{
        width: 45%;
        float: left;
    }
    .el-table--small td{
        padding: 1px 0;
    }
</style>
