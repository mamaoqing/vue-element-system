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
                <el-select v-model="query.commId" placeholder="请选择社区">
                    <el-option v-for="item in commArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
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
                <el-table-column prop="compName" label="公司名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="commName" label="社区名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="name" label="分区名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="commId" label="分区名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="detailedAddress" label="详细地址" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="buildedDate" label="建造日期" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="deliverDate" label="交付日期" min-width="125" min-height="55" align="center"></el-table-column>
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
                                        icon="el-icon-lx-homefill"
                                        class="green"
                                        @click.stop
                                        @click="handleCompanyLink(scope.row.id)"
                                >房间列表
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
                    <el-form-item class="item" v-show="false" label-width="150px">
                        <el-input v-model="form.compId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="社区名称" label-width="150px">
                        <el-select v-model="form.commId" placeholder="请选择" @change="handleGetComm">
                            <el-option v-for="item in commArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="分区名称" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入分区名称', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.name" ></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="详细地址" prop="detailedAddress" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.detailedAddress" ></el-input>
                    </el-form-item>
                    <el-form-item label="建造日期" prop="buildedDate" label-width="150px"
                                  :rules="[
                    { required: true, message: '请选择建造日期', trigger: 'blur' },
                ]">
                        <el-date-picker
                                v-model="form.buildedDate"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="交付日期" prop="deliverDate" label-width="150px"
                                                 :rules="[
                    { required: true, message: '请选择交付日期', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.deliverDate"
                            type="date"
                            placeholder="选择日期"
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
                    <el-form-item class="item" label="地图地址" prop="mapAddress" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入地图地址', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.mapAddress" ></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入状态', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.state" ></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="备注" label-width="150px">
                        <el-input v-model="form.remark" ></el-input>
                    </el-form-item>
                    <el-form-item label="录入人" label-width="150px">
                        <el-input v-model="form.created_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="录入时间" prop="establishment_date" label-width="150px" disabled>
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
                        <el-input v-model="form.modified_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="修改时间" prop="establishment_date" label-width="150px" >
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
    import { addArea, getAllArea, getComm, getCommById, getComp,updateData,deleteData } from '../../api/comm_area';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    name: '',
                    commId:'',
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
                commArr:[],
                id: -1
            };
        },
        created() {
            this.getData();
            getComm(this.query).then(res => {
                this.commArr = res.data;
            });

        },

        methods: {
            // 获取数据
            getData() {
                getAllArea(this.query).then(res => {
                    console.log(res)
                    this.tableData = res.data.data;
                    this.pageTotal = res.data.pageTotal || 0;
                });
            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            handleGetComm(val){
                getCommById(val).then(res => {
                    console.log(res.data)
                    this.$set(this.form, 'detailedAddress', "");
                    this.$set(this.form, 'builded_date', "");
                    this.$set(this.form, 'builded_date', "");
                    this.$set(this.form, 'latitude', "");
                    this.$set(this.form, 'longitude', "");
                    this.$set(this.form, 'map_address', "");

                    this.$set(this.form, 'detailedAddress', res.data.detailedAddress);
                    this.$set(this.form, 'builded_date', res.data.buildedDate);
                    this.$set(this.form, 'builded_date', res.data.buildedDate);
                    this.$set(this.form, 'latitude', res.data.latitude);
                    this.$set(this.form, 'longitude', res.data.longitude);
                    this.$set(this.form, 'map_address', res.data.mapAddress);
                });
            },
            // 删除操作
            handleDelete(id) {

                // 二次确认删除
                this.$confirm('该分区下的建筑等会被一并删除,确定要删除吗？', '提示', {
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
                    commId:'',
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
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                // this.$set(this.form, 'createdName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'createdAt', new Date());
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());

            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                console.log(this.form)

                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                this.editVisible = true;
                this.disable = false;
                this.title = '修改';
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());

            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                this.title = '查看';

            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增') {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            // this.$delete(this.form, 'createdName');
                            // this.$delete(this.form, 'createdAt');
                            // this.$delete(this.form, 'modifiedName');
                            // this.$delete(this.form, 'modifiedAt');
                            this.editVisible = false;
                            addArea(this.form).then(res => {
                                this.$message.success(`新增成功`);
                                this.getData();
                            });
                        }
                    });

                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            this.editVisible = false;
                            // this.$delete(this.form, 'modifiedName');
                            // this.$delete(this.form, 'modifiedAt');
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
                this.$set(this.query, 'pageNo', val);
                console.log(this.query)
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
