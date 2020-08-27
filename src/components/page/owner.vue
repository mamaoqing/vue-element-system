<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 业主列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.compId" placeholder="请选择" @change="compChange">
                    <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                    <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                </el-select>
                <el-select v-model="query.commId" placeholder="请选择" @change="commChange">
                    <el-option key="qxz" label="请选择社区名称" value=""></el-option>
                    <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-top: 5px;">搜索
                </el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" style="margin-top: 5px;" v-if="ownerDisable">新增
                </el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="handleRefresh" style="margin-top: 5px;">重置
                </el-button>
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
                <el-table-column prop="compName" label="公司名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="ownerType" label="业主类型" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="name" label="业主名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="ownerAddr" label="业主地址" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certType" label="证件类型" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certNumber" label="证件号码" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="industry" label="行业" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="nativePlace" label="籍贯" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="education" label="学历" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="state" label="状态" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="linkName" label="联系人" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="linkTel" label="联系电话" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="linkAddr" label="联系人地址" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center" min-width="75"
                                 min-height="55"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"
                                 min-height="55"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center" min-width="75"
                                 min-height="55"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"
                                 min-height="55"></el-table-column>
                <el-table-column label="操作" width="320" align="center">
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
                                        icon="el-icon-lx-copy"
                                        @click.stop
                                        @click="handleCopy(scope.$index, scope.row)"
                                >复制
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-lx-homefill"
                                        @click.stop
                                        @click="handleRoom(scope.row)"
                                        v-if="ownerDisable"
                                >房间信息
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-lx-homefill"
                                        @click.stop
                                        @click="handlePl(scope.row)"
                                        v-if="ownerDisable"
                                >批量生成房间
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
        <el-dialog :title="title" :visible.sync="editVisible" width="55%">
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable" :inline="true">
                <div>
                    <el-form-item label="id" v-show="false">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="公司名称"  label-width="150px">
                        <el-input v-model="compName" disabled></el-input>
                    </el-form-item>

                    <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入状态', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.state"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="备注" label-width="150px">
                        <el-input v-model="form.remark"></el-input>
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
                    <el-form-item label="修改时间" prop="establishment_date" label-width="150px">
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
    </div>
</template>

<script scoped>
    import {
        getAllUnit,
        getComm,
        getArea,
        getComp,
        getBuild,
        getAllModel,
        addUnit,
        deleteUnit,
        updateData, PlAddRoom
    } from '../../api/unit';
    import room from './room'
    import { getOwenList } from '../../api/owner';
    import { listCompAll } from '../../api/role';
    import { getCommArea, getUserComm } from '../../api/building';
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    compId: '',
                    commId: '',
                    pageNo: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                roomModelList: [],
                usableList: [],
                editVisible: false,
                ownerDisable:true,
                pageTotal: 0,
                disable: false,
                cmpVisible: false,
                copyVisible:false,
                form: {},
                idx: -1,
                title: '',
                compName: '',
                commArr: [],
                areaArr: [],
                eleNum:'',
                compList:[],
                commList:[],
                modelArr: [],
                id: -1
            };
        },
        components:{
            room,
        },
        created() {
            this.getData();
            listCompAll(this.query).then(res => {
                // debugger
                this.compList = res.data.records;
                if(res.data.records.length==1){
                    this.query.compName=res.data.records[0].name;
                    getUserComm(res.data.records[0].id).then(res => {
                        if(res.data){
                            this.form.commId=undefined;
                            this.commList = res.data;
                        }
                    });
                }

            });
        },

        methods: {
            // 获取数据
            getData() {
                getOwenList(this.query).then(res => {
                    console.log(res)
                    this.tableData = res;
                    // this.pageTotal = res.data.pageTotal || 0;
                });
            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },

            // 删除操作
            handleDelete(id) {

                // 二次确认删除
                this.$confirm('该单元下的房间等信息会被一并删除,确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteUnit(id).then(res => {
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
                this.query = {
                    commId: '',
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
                console.log(typeof this.form.model)

                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                let that = this
                that.$set(that.form, 'model', this.form.model-0);
                this.modelArr.forEach(function(value,key,arr){

                    if(arr[key].id==that.form.model){
                        that.eleNum = arr[key].elevatorNum
                    }

                })
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
                let that = this
                that.$set(that.form, 'model', this.form.model-0);
                this.modelArr.forEach(function(value,key,arr){

                    if(arr[key].id==that.form.model){
                        that.eleNum = arr[key].elevatorNum
                    }

                })
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                this.title = '查看';

            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增'||title === '复制') {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            // this.$delete(this.form, 'createdName');
                            // this.$delete(this.form, 'createdAt');
                            // this.$delete(this.form, 'modifiedName');
                            // this.$delete(this.form, 'modifiedAt');
                            this.editVisible = false;
                            this.copyVisible = false;
                            addUnit(this.form).then(res => {
                                this.$message.success(`新增成功`);
                                this.getData();
                            });
                        }
                    });

                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
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
            compChange(val){
                if(this.form.compId!=undefined||val!=undefined){
                    var compId;
                    if(val==undefined){
                        compId = this.form.compId;
                    }else{
                        compId = val;
                        this.query.compName=compId;
                    }
                    getUserComm(compId).then(res => {
                        if(res.data){
                            this.form.commId=undefined;
                            this.query.commName="请选择社区名称";
                            this.commList = res.data;
                        }
                    });
                }
            },
            commChange(val){
                if(this.form.commId!=undefined||val!=undefined){
                    var commId;
                    if(this.form.commId!=undefined&&this.form.commId!=''){
                        commId = this.form.commId;
                    }else{
                        commId = val;
                        this.query.commName=commId;
                    }
                }
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            },
            //初始化数据
            dataInitialization(roomId) {
                this.query.roomId = roomId;
                /*this.$set(this.unitForm, 'compName', compId);
                this.$set(this.unitForm, 'commName', commId);
                this.$set(this.unitForm, 'commAreaName', areaId);
                this.$set(this.unitForm, 'buildingName', buildId);
                this.$set(this.unitForm, 'unitName', unitId);*/

                this.unitDisable = false
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

    .el-form {
        overflow: hidden;
    }

    .el-form-item {
        width: 45%;
        float: left;
    }

    .el-table--small td {
        padding: 1px 0;
    }
</style>
