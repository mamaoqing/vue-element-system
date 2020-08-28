<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 业主与物业关系对应
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
                <el-table-column prop="compName" label="物业公司"  align="center"></el-table-column>
                <el-table-column prop="commName" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="commAreaName" label="分区名称" align="center"></el-table-column>
                <el-table-column prop="buildingName" label="楼栋名称" align="center"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"></el-table-column>
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
                                @click="handleDelete(scope.row.id)"
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
        <el-dialog :title="title" :visible.sync="editVisible" width="50%" append-to-body>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="ID" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="业主ID" v-show="false">
                    <el-input v-model="query.ownerId" ></el-input>
                </el-form-item>
                <el-form-item class="item" label="公司名称"  label-width="150px">
                    <el-input v-model="compName" disabled></el-input>
                </el-form-item>
                <el-form-item class="item" v-show="false" label-width="150px">
                    <el-input v-model="form.compId" disabled></el-input>
                </el-form-item>
                <el-form-item class="item" label="社区名称" v-if="editshow" label-width="150px" prop="commId" :rules="[
                        { required: true, message: '请输入单元名称', trigger: 'blur' },
                    ]">
                    <el-select v-model="form.commId" placeholder="请选择" @change="handleGetComm">
                        <el-option v-for="item in commArr" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="item" label="分区名称" v-if="editshow" prop="name" label-width="150px"
                              :rules="[
                        { required: true, message: '请输入分区名称', trigger: 'blur' },
                    ]">
                    <el-select v-model.number="form.commAreaId" placeholder="请选择" @change="handleGetArea" ref="areaselect">
                        <el-option v-for="item in areaArr" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="item" label="建筑名称" v-if="editshow" prop="name" label-width="150px"
                              :rules="[
                        { required: true, message: '请输入建筑名称', trigger: 'blur' },
                    ]">
                    <el-select v-model.number="form.buildingId" placeholder="请选择" ref="buildselect"
                               @change="handleGetBuild">
                        <el-option v-for="item in buidlArr" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物业类型" label-width="150px">
                    <el-input v-model="form.propertyType"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="150px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="150px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>

                <el-form-item label="录入人" label-width="150px">
                    <el-input v-model="form.createdName"></el-input>
                </el-form-item>
                <el-form-item label="录入时间" prop="establishmentDate" label-width="150px">
                    <el-date-picker
                            v-model="form.createdAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                    />
                </el-form-item>
                <el-form-item label="修改人" label-width="150px">
                    <el-input v-model="form.modifiedName"></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="establishmentDate" label-width="150px">
                    <el-date-picker
                            v-model="form.modifiedAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                    />
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

    import { getOwnerProp, addLinkData, updateLinkData, getInfo } from '../../api/owner';
    import { getDictItemByDictId } from '../../api/building';
    import { getArea, getBuild, getComm, getComp } from '../../api/unit';
    export default {
        name: 'ownerProperty',
        data() {
            return {
                query: {
                    ownerId: '',
                    pageNo: 1,
                    size: 10
                },
                title: '',
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                editshow:true,
                taxpayerType:[],
                pageTotal: 0,
                compName: '',
                commArr: [],
                areaArr: [],
                buidlArr: [],
                form: {},
                idx: -1,
                id: -1
            };
        },
        methods: {
            getData() {
                getComm(this.query).then(res => {
                    this.commArr = res.data;
                });
                getOwnerProp(this.query.ownerId).then(res => {
                    console.log(res)
                    this.tableData = this.tableData = res.data;
                    this.pageTotal = res.data.pageTotal || 0;
                });
                getDictItemByDictId(8).then(res => {
                    this.taxpayerType = res.data;
                });
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
            },
            //初始化数据
            dataInitialization(id) {
                this.query.ownerId = id;
                this.getData();
            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                this.title = '查看物业对应信息';

            },
            //新增操作
            handleAdd() {
                this.editVisible = true;
                this.title = '新增物业对应信息';
                this.form = {};
                this.editshow=true;
                this.form.ownerId = this.query.ownerId;
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
            getInfo(){
                if (this.form.taxpayerType&&this.form.identificationNo){
                    getInfo(this.form).then(res =>{
                        if (res.data!=null){
                            this.$set(this.form, 'name', res.data.name);
                            this.$set(this.form, 'bank', res.data.bank);
                            this.$set(this.form, 'registerTel', res.data.registerTel);
                            this.$set(this.form, 'registerAddr', res.data.registerAddr);
                            this.$set(this.form, 'remark', res.data.remark);
                        }
                    })
                }
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.title = '编辑物业对应信息';
                this.editVisible = true;
                this.editshow=false;
            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增物业对应信息') {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            this.editVisible = false;
                            addLinkData(this.form).then(res => {
                                this.$message.success(`新增物业对应信息成功`);
                                this.getData();
                            });
                        }
                    });
                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            this.editVisible = false;
                            updateLinkData(this.form).then(res => {
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
                this.getData();
            },
            handleGetComm(val) {
                getArea(val).then(res => {
                    this.areaArr = [];
                    this.buidlArr = [];
                    this.form.commAreaId = '';
                    this.form.buildingId = '';
                    this.query.commAreaId = '';
                    this.query.buildingId = '';
                    this.areaArr = res.data;
                });
            },
            handleGetArea(val) {

                getBuild(val).then(res => {
                    this.buidlArr = [];
                    this.form.buildingId = '';
                    this.query.buildingId = '';
                    this.buidlArr = res.data;
                });
            },
            handleGetBuild(val) {
                this.$forceUpdate();
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
    .el-form {
        overflow: hidden;
    }

    .el-form-item {
        width: 45%;
        float: left;
    }
    .el-input{
        width: 200px;
    }
    .el-input__inner{
        width: 200px;
    }
</style>
