<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 单元列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model.number="query.commId" placeholder="请选择社区" @change="handleGetComm">
                    <el-option v-for="item in commArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>

                <el-select v-model.number="query.commAreaId" placeholder="请选择分区" @change="handleGetArea" ref="areaselect">
                    <el-option v-for="item in areaArr" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>

                <el-select v-model.number="query.buildingId" placeholder="请选择建筑" ref="buildselect"
                           @change="handleGetBuild">
                    <el-option v-for="item in buidlArr" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
                <el-input v-model="query.no" placeholder="单元编号" class="handle-input mr10"></el-input>
                <el-input v-model="query.name" placeholder="单元名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-top: 5px;">搜索
                </el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" style="margin-top: 5px;">新增
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
                <el-table-column prop="commName" label="社区名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="areaName" label="分区名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="buildingName" label="建筑名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="no" label="单元编号" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="name" label="单元名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="floorNum" label="楼层数" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="modelName" label="型号" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="eleNum" label="电梯数" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="rmNum" label="每层房间数" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="state" label="状态" min-width="125" min-height="55"
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
                                >房间信息
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-lx-homefill"
                                        @click.stop
                                        @click="handlePl(scope.row)"
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
                    <el-form-item class="item" label="楼栋名称" v-if="editshow" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入建筑名称', trigger: 'blur' },
                    ]">
                        <el-select v-model.number="form.buildingId" placeholder="请选择" ref="buildselect"
                                   @change="handleGetBuild">
                            <el-option v-for="item in buidlArr" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="单元编号" prop="no" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入单元编号', trigger: 'blur'}

                    ]">
                        <el-input v-model.number="form.no"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="单元名称" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入单元名称', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="单元类型" prop="modelId" label-width="150px"
                                  :rules="[
                        { required: true, message: '请选择单元类型', trigger: 'blur' },
                    ]">
                        <el-select v-model.number="form.modelId" placeholder="请选择" ref="modelse" @change="handleChangeModel" >
                            <el-option v-for="item in modelArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="item" label="电梯数" prop="" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入电梯数', trigger: 'blur' },
                    ]">
                        <el-input v-model="eleNum" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="每层房间数" prop="" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入每层房间数', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.roomNum" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="楼层数" prop="floorNum" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入楼层数', trigger: 'blur'},
                        { type: 'number', message: '必须是数字'},
                    ]">
                        <el-input v-model.number="form.floorNum"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                  :rules="[
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.state" placeholder="请选择" >
                            <el-option key="bbk" label="在用" value="在用"></el-option>
                            <el-option key="xtc" label="不在用" value="不在用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="备注" label-width="150px">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                    <commPage :form="form" :status="status" :editVisible="editVisible"></commPage>
                </div>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 复制弹出框 -->
        <el-dialog :title="title" :visible.sync="copyVisible" width="55%">
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable" :inline="true">
                <div>
                    <el-form-item label="id" v-show="false">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="公司名称"  label-width="150px">
                        <el-input v-model="compName" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" v-show="false" label-width="150px">
                        <el-input v-model="form.compId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="社区名称" v-show="false" label-width="150px" prop="commId" :rules="[
                        { required: true, message: '请输入单元名称', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.commId" placeholder="请选择" @change="handleGetComm">
                            <el-option v-for="item in commArr" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="分区名称" v-show="false" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入分区名称', trigger: 'blur' },
                    ]">
                        <el-select v-model.number="form.commAreaId" placeholder="请选择" @change="handleGetArea" ref="areaselect">
                            <el-option v-for="item in areaArr" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="楼栋名称" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入楼栋名称', trigger: 'blur' },
                    ]">
                        <el-select v-model.number="form.buildingId" placeholder="请选择" ref="buildselect"
                                   @change="handleGetBuild">
                            <el-option v-for="item in buidlArr" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="单元编号" prop="no" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入单元编号', trigger: 'blur'},

                    ]">
                        <el-input v-model.number="form.no"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="单元名称" prop="name" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入单元名称', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="单元类型" prop="model" label-width="150px"
                                  :rules="[
                        { required: true, message: '请选择单元类型', trigger: 'blur' },
                    ]">
                        <el-select v-model.number="form.model" placeholder="请选择" ref="modelse" @change="handleChangeModel" >
                            <el-option v-for="item in modelArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="item" label="电梯数" prop="" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入电梯数', trigger: 'blur' },
                    ]">
                        <el-input v-model="eleNum" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="每层房间数" prop="" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入每层房间数', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.roomNum" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="楼层数" prop="floorNum" label-width="150px"
                                  :rules="[
                        { required: true, message: '请输入楼层数' , trigger: 'blur'},
                        { type: 'number', message: '必须是数字'},
                    ]">
                        <el-input v-model.number="form.floorNum"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                  :rules="[
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.state" placeholder="请选择" >
                            <el-option key="bbk" label="在用" value="在用"></el-option>
                            <el-option key="xtc" label="不在用" value="不在用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="备注" label-width="150px">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>

                    <commPage :form="form" :status="status" :editVisible="editVisible"></commPage>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="copyVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 房间弹出框   -->
        <el-dialog :visible.sync="cmpVisible" width="55%" append-to-body>
            <room v-if="cmpVisible" ref="room"></room>
        </el-dialog>
        <!--批量生成房间-->
        <el-dialog :title="title" :visible.sync="formCpoyVisable" width="35%" append-to-body>
            <el-form ref="formCopy" :model="formPl" label-width="120px"  :disabled="disable">
                <el-form-item label="房型" prop="roomModelName" :rules="[
                        { required: true, message: '请选择房型', trigger: 'blur' },
                    ]">
                    <el-select v-model="formPl.roomModelName" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in roomModelList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用途" prop="usableName" :rules="[
                        { required: true, message: '请选择用途', trigger: 'blur' },
                    ]">
                    <el-select v-model="formPl.usableName" placeholder="请选择"  >
                        <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in usableList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="建筑面积" prop="buildingArea" :rules="[
                        { required: true, message: '请输入建筑面积', trigger: 'blur' },
                    ]">
                    <el-input v-model="formPl.buildingArea" ></el-input>
                </el-form-item>
                <el-form-item label="使用面积" prop="usableArea" :rules="[
                        { required: true, message: '请输入使用面积', trigger: 'blur' },
                    ]">
                    <el-input v-model="formPl.usableArea" ></el-input>
                </el-form-item>
                <el-form-item label="楼层"  >
                    <el-col :span="10">
                        <el-input v-model.number="formPl.start" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                  maxLength='2'></el-input>
                    </el-col>
                    <el-col :span="4" align='center'>
                        -
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model.number="formPl.end" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                  maxLength='2'></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="分割符"  >
                    <el-input v-model="formPl.separator" placeholder="楼层与后缀分割符"></el-input>
                </el-form-item>
                <el-form-item label="房间号后缀" prop="suffix" :rules="[
                        { required: true, message: '请输入后缀', trigger: 'blur' },
                    ]">
                    <el-input v-model="formPl.suffix" ></el-input>
                </el-form-item>



                <el-form-item label="状态">
                    <el-select v-model="formPl.state" placeholder="请选择" >
                        <el-option key="bbk" label="在用" value="在用" ></el-option>
                        <el-option key="xtc" label="不在用" value="不在用"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="formCpoyVisable = false">取 消</el-button>
                <el-button type="primary" @click="PlAdd">确 定</el-button>
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
        updateData, PlAddRoom, copyUnit
    } from '../../api/unit';
    import room from './room'
    import { getDictItemByDictId } from '../../api/building';
    import commPage from '../common/commPage';
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    commId: '',
                    commAreaId: '',
                    buildingId: '',
                    no: '',
                    name: '',
                    pageNo: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                roomModelList: [],
                usableList: [],
                formCpoy: {},
                editVisible: false,
                pageTotal: 0,
                disable: false,
                cmpVisible: false,
                editshow:true,
                copyVisible:false,
                formCpoyVisable:false,
                status:0,
                form: {},
                formPl: {},
                idx: -1,
                title: '',
                compName: '',
                commArr: [],
                areaArr: [],
                buidlArr: [],
                eleNum:'',
                modelArr: [],
                id: -1
            };
        },
        components:{
            room,
            commPage
        },
        created() {
            this.getData();
            getComm(this.query).then(res => {
                this.commArr = res.data;
            });

            getDictItemByDictId(44).then(res => {//44是房型的id
                // debugger
                this.roomModelList = res.data;
            });
            getDictItemByDictId(7).then(res => {//7是用途的id
                this.usableList = res.data;
            });
        },

        methods: {
            // 获取数据
            getData() {
                getAllUnit(this.query).then(res => {
                    console.log(res)
                    this.tableData = res.data.data;
                    this.pageTotal = res.data.pageTotal || 0;
                });
                getAllModel(this.query).then(res => {
                    this.modelArr = res.data;
                });
            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
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
            handleChangeModel(val) {
                let that = this
                this.modelArr.forEach(function(value,key,arr){
                   if(arr[key].id==val){
                       that.$set(that.form, 'roomNum', arr[key].roomNum);
                       that.eleNum = arr[key].elevatorNum
                   }

                })
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
            handleRoom(val) {
                console.log(val)
                let compId = val.compId;
                let commId = val.commId;
                let areaId = val.commAreaId;
                let buildId = val.buildingId;
                let unitId = val.id;
                this.cmpVisible = true;
                this.$nextTick(() => {
                    this.$refs.room.dataInitialization(compId,commId,areaId,buildId,unitId);
                });

            },
            handlePl(val) {
                this.$set(this.formPl, 'compId', val.compId);
                this.$set(this.formPl, 'commId', val.commId);
                this.$set(this.formPl, 'commAreaId', val.commAreaId);
                this.$set(this.formPl, 'buildId', val.buildingId);
                this.$set(this.formPl, 'unitId', val.id);
                this.$set(this.formPl, 'state', "在用");
                this.formCpoyVisable = true;

            },
            PlAdd(){
                PlAddRoom(this.formPl).then(res => {
                    console.log(res)
                    if (res.code===1){
                        this.$message.error(res.msg);
                    }
                    if (res.code===0){
                        this.formCpoyVisable = false;
                        this.$message.success("添加成功");
                    }
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
                this.query = {
                    commId: '',
                    pageNo: 1,
                    size: 10
                };
                this.getData();
            },
            handleAdd() {
                this.editVisible = true;
                this.title = '新增单元';
                this.form = {};
                this.editshow = true
                this.status = 0
                this.disable = false;
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });

            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editshow = false;
                this.status = 1;
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                let that = this
                this.modelArr.forEach(function(value,key,arr){

                    if(arr[key].name==that.form.model){
                        that.eleNum = arr[key].elevatorNum
                    }

                })
                this.editVisible = true;
                this.disable = false;
                this.title = '编辑单元';
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());

            },
            // 复制操作
            handleCopy(index, row) {
                this.idx = index;
                this.form = row;
                console.log(row)
                this.form.no = '';
                this.form.name = '';
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                getBuild(row.commAreaId).then(res => {
                    this.buidlArr = res.data;
                });
                let that = this
                this.modelArr.forEach(function(value,key,arr){

                    if(arr[key].name==that.form.model){
                        that.eleNum = arr[key].elevatorNum
                    }

                })
                this.copyVisible = true;
                this.disable = false;
                this.title = '复制单元';
            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                let that = this
                this.status = 2;
                this.editshow = false
               /* that.$set(that.form, 'modelId', this.form.model-0);
                this.modelArr.forEach(function(value,key,arr){

                    if(arr[key].id==that.form.model){
                        that.eleNum = arr[key].elevatorNum
                    }

                })*/
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                this.title = '查看单元';

            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增单元') {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            // this.$delete(this.form, 'createdName');
                            // this.$delete(this.form, 'createdAt');
                            // this.$delete(this.form, 'modifiedName');
                            // this.$delete(this.form, 'modifiedAt');

                            addUnit(this.form).then(res => {
                                if(res.code===0){
                                    this.editVisible = false;
                                    this.copyVisible = false;
                                    this.$message.success(`新增单元成功`);
                                    this.getData();
                                }else{
                                    this.$message.error(res.msg);
                                }

                            });
                        }
                    });

                }else if(title === '复制单元'){
                    this.$refs['form'].validate(valid => {
                        if (valid) {

                            copyUnit(this.form).then(res => {
                                if (res.code===0){
                                    this.editVisible = false;
                                    this.copyVisible = false;
                                    this.$message.success(`复制单元成功`);
                                    this.getData();
                                }else{
                                    this.$message.error(res.msg);
                                }
                            });
                        }
                    });
                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid) {

                            // this.$delete(this.form, 'modifiedName');
                            // this.$delete(this.form, 'modifiedAt');
                            updateData(this.form).then(res => {
                                if (res.code===0){
                                    this.editVisible = false;
                                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                    this.getData();
                                }else{
                                    this.$message.error(res.msg);
                                }

                            });
                        }
                    });
                }

            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
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
