<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 建筑管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-input v-model="query.name" placeholder="建筑名称" class="handle-input mr10"></el-input>
            <el-select v-model="query.compName" placeholder="请选择" @change="compChange" :disabled="otherComp">
                <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commName" placeholder="请选择" @change="commChange" >
                <el-option key="qxz" label="请选择社区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commAreaName" placeholder="请选择" @change="commAreaChange" >
                <el-option key="qxz" label="请选择社区分区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.no" placeholder="建筑编号" class="handle-input mr10"></el-input>
            <el-select v-model="query.type" placeholder="请选择" >
                <el-option key="qxz" label="请选择建筑类型" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
            </el-select>
            <div class="handle-box">
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
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130"></el-table-column>
                <el-table-column prop="compId" label="社区名称" v-if="false"></el-table-column>
                <el-table-column prop="commName" label="社区名称" width="120"></el-table-column>
                <el-table-column prop="commId" label="社区名称" v-if="false"></el-table-column>
                <el-table-column prop="commAreaName" label="社区分区名称" width="120"></el-table-column>
                <el-table-column prop="commAreaId" label="社区名称" v-if="false"></el-table-column>
                <el-table-column prop="type" label="建筑类型"></el-table-column>
                <el-table-column prop="no" label="建筑编号"></el-table-column>
                <el-table-column prop="buildedDate" label="建造日期" width="100"></el-table-column>
                <el-table-column prop="deliverDate" label="交付日期" width="100"></el-table-column>
                <el-table-column prop="floorNum" label="楼层数"></el-table-column>
                <el-table-column prop="unitNum" label="单元数"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column prop="createdName" label="创建人"></el-table-column>
                <el-table-column prop="createdAt" label="创建日期" width="155"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改日期" width="155"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click.stop
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="copyEdit(scope.$index, scope.row)"
                        >复制</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click.stop
                            @click="handleDelete(scope.row.id)"
                        >删除</el-button>

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

        <!-- 新增弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-form-item label="建筑编号" prop="no" >
                    <el-input v-model="form.no"  ></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="物业公司" prop="compId">
                    <el-select v-model="form.compId" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" prop="commId">
                    <el-select v-model="form.commId" placeholder="请选择" @change="commChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区分区名称" prop="commAreaId" >
                    <el-select v-model="form.commAreaId" placeholder="请选择" @change="commAreaChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建筑类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建造日期" prop="buildedDate">
                    <el-date-picker
                            v-model="form.buildedDate"
                            type="datetime"
                            placeholder="默认分区的建造日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                    />
                </el-form-item>
                <el-form-item label="交付日期" prop="deliverDate">
                    <el-date-picker
                            v-model="form.deliverDate"
                            type="datetime"
                            placeholder="默认分区的交付日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                    />
                </el-form-item>
                <el-form-item label="楼层数" prop="floorNum" >
                    <el-input v-model="form.floorNum" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="单元数" prop="unitNum" >
                    <el-input v-model="form.unitNum" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="form.state" placeholder="请选择" >
                        <el-option key="bbk" label="在用" value="在用"></el-option>
                        <el-option key="xtc" label="不在用" value="不在用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="updateVisible" width="40%">
            <el-form ref="form" :model="form" label-width="150px" :rules="rules" :disabled="disable">
                <el-form-item label="建筑编号" prop="no" >
                    <el-input v-model="form.no"  ></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="物业公司" prop="compId">
                    <el-select v-model="form.compName" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" prop="commId">
                    <el-select v-model="form.commName" placeholder="请选择" @change="commChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区分区名称" prop="commAreaId">
                    <el-select v-model="form.commAreaName" placeholder="请选择" @change="commAreaChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建筑类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="建造日期" prop="buildedDate">
                    <el-date-picker
                            v-model="form.buildedDate"
                            type="datetime"
                            placeholder="默认分区的建造日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                    />
                </el-form-item>
                <el-form-item label="交付日期" prop="deliverDate">
                    <el-date-picker
                            v-model="form.deliverDate"
                            type="datetime"
                            placeholder="默认分区的交付日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                    />
                </el-form-item>
                <el-form-item label="楼层数" prop="floorNum" >
                    <el-input v-model="form.floorNum" ></el-input>
                </el-form-item>
                <el-form-item label="单元数" prop="unitNum" >
                    <el-input v-model="form.unitNum" ></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="form.state" placeholder="请选择" >
                        <el-option key="bbk" label="在用" value="在用"></el-option>
                        <el-option key="xtc" label="不在用" value="不在用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <commPage :form="form" :status="status" :editVisible="updateVisible"></commPage>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')" v-if="detail">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 复制弹出框 -->
        <el-dialog :title="title" :visible.sync="copyVisible" width="40%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules" :disabled="disable">
                <el-form-item label="建筑编号" prop="no" >
                    <el-input v-model="form.no"  ></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="物业公司" >
                    <el-select v-model="form.compName" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" >
                    <el-select v-model="form.commName" placeholder="请选择" @change="commChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区分区名称" prop="commAreaName">
                    <el-select v-model="form.commAreaName" placeholder="请选择" @change="commAreaChange" >
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建筑类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建造日期" prop="buildedDate">
                    <el-date-picker
                            v-model="form.buildedDate"
                            type="datetime"
                            placeholder="默认分区的建造日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                            :disabled="edit"
                    />
                </el-form-item>
                <el-form-item label="交付日期" prop="deliverDate">
                    <el-date-picker
                            v-model="form.deliverDate"
                            type="datetime"
                            placeholder="默认分区的交付日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                            :disabled="edit"
                    />
                </el-form-item>
                <el-form-item label="楼层数" prop="floorNum" >
                    <el-input v-model="form.floorNum" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="单元数" prop="unitNum" >
                    <el-input v-model="form.unitNum" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="form.state" placeholder="请选择" :disabled="edit">
                        <el-option key="bbk" label="在用" value="在用"></el-option>
                        <el-option key="xtc" label="不在用" value="不在用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="copyVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCopy(title,buildingName,buildingNo,'form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { insertBuilding,deleteBuilding,updateBuilding,listBuilding,getUserComm,getCommArea,getCommAreaContent,
    getDictItemByDictId,listBuildingNum,checkBuildingRoomUnit,copyBuilding,checkBulidingNameNo,checkBulidingNameNoCopy } from '../../api/building';
import { checkRoleMenuUser, deleteRole, listCompAll } from '../../api/role';
import commPage from '../common/commPage';
import userVisible from './userChoose';

export default {
    data() {
        let checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入名称"));
            }else{
                return callback();
            }
        }
        let checkcompId = (rule,value,callback) =>{
            if(this.title!='编辑建筑'){
                if(!value){
                    return callback(new Error("请输入物业公司名称"));
                }else{
                    return callback();
                }
            }else{
                return callback();
            }
        }
        let checkcommId= (rule,value,callback) =>{
            if(this.title!='编辑建筑'){
                if(!value){
                    return callback(new Error("请输入社区名称"));
                }else{
                    return callback();
                }
            }else{
                return callback();
            }
        }
        let checkcommAreaId = (rule,value,callback) =>{
                if(this.title!='编辑建筑') {
                    if (!value) {
                        return callback(new Error("请输入社区分区名称"));
                    } else {
                        return callback();
                    }
                }else{
                    return callback();
                }
        }
        let checktype = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入建筑类型"));
            }else{
                return callback();
            }
        }
        let checkno = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入建筑编号"));
            }else{
                return callback();
            }
        }
        let checkbuildedDate = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入建造日期"));
            }else{
                return callback();
            }
        }
        let checkdeliverDate = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入交付日期"));
            }else{
                return callback();
            }
        }
        let checkfloorNum = (rule,value,callback) =>{
            const num= /^[0-9]*$/;
            if(!value){
                return callback(new Error("请输入楼层数"));
            }else{
                if (!num.test(value)) {
                    return callback(new Error('楼层数只能为数字'))
                }else{
                    return callback();
                }
            }
        }
        let checkunitNum = (rule,value,callback) =>{
            const num= /^[0-9]*$/;
            if(!value){
                return callback(new Error("请输入单元数"));
            }else{
                if (!num.test(value)) {
                    return callback(new Error('单元数只能为数字'))
                }else{
                    return callback();
                }
            }
        }
        let checkstate = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入状态"));
            }else{
                return callback();
            }
        }
        return {
            query: {
                name:'',
                compId:'',
                commId:'',
                commAreaId:'',
                type:'',
                no:'',
                buildedDate:'',
                deliverDate:'',
                floorNum:'',
                unitNum:'',
                state:'',
                remark:'',
                pageNo: 1,
                size: 10,
                commAreaName:'',
                compName:'',
                commName:''
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            updateVisible:false,
            copyVisible:false,
            edit:false,
            pageTotal:0,
            disable:false,
            cmpVisible:false,
            otherComp:false,
            commAreaName:'',
            commAreaId:'',
            compList:[],
            commList:[],
            status:0,
            commAreaList:[],
            typeList:[],
            form: {},
            formCopy:{},
            idx: -1,
            title:'',
            buildingName:'',
            buildingNo:'',
            detail:'',
            id: -1,
            rules:{
                name:[{
                    validator:checkname,required: true,trigger:'blur'
                }],
                compId:[{
                    validator:checkcompId,required: true,trigger:'blur'
                }],
                commId:[{
                    validator:checkcommId,required: true,trigger:'blur'
                }],
                commAreaId:[{
                    validator:checkcommAreaId,required: true,trigger:'blur'
                }],
                type:[{
                    validator:checktype,required: true,trigger:'blur'
                }],
                no:[{
                    validator:checkno,required: true,trigger:'blur'
                }],
                buildedDate:[{
                    validator:checkbuildedDate,required: true,trigger:'blur'
                }],
                deliverDate:[{
                    validator:checkdeliverDate,required: true,trigger:'blur'
                }],
                floorNum:[{
                    validator:checkfloorNum,required: true,trigger:'blur'
                }],
                unitNum:[{
                    validator:checkunitNum,required: true,trigger:'blur'
                }],
                state:[{
                    validator:checkstate,required: true,trigger:'blur'
                }]
            }
        };
    },
    created() {
        this.getData();
    },
    components:{
        commPage
    },
    methods: {
        compChange(val){
            //debugger
            if(this.form.compId!=undefined||val!=undefined){
                var compId;
                if(val==undefined){
                    compId = this.form.compId;
                }else{
                    compId = val;
                    //this.query.compName=compId;
                }
                getUserComm(compId).then(res => {
                    if(res.data){
                        this.form.commId=undefined;
                        this.commList = res.data;
                    }
                });
            }
        },
        commChange(val){
            debugger
            if(this.form.commId!=undefined||val!=undefined){
                var commId;
                if(this.form.commId!=undefined&&this.form.commId!=''){
                    commId = this.form.commId;
                }else{
                    commId = val;
                    //this.query.commName=commId;
                }
                getCommArea(commId).then(res => {
                    if(res.data){
                        this.form.commAreaId=undefined;
                        //console.log(this.form.commId);
                        this.commAreaList = res.data;
                    }
                });
            }
        },
        commAreaChange(val){
            this.$forceUpdate();
            if(this.form.commAreaId!=undefined||val!=undefined){
                var commAreaId ;
                if(this.form.commAreaId!=undefined&&this.form.commAreaId!=''){
                    commAreaId = this.form.commAreaId;
                }else{
                    commAreaId = val;
                    //this.query.commAreaName=commAreaId;
                }
                getCommAreaContent(commAreaId).then(res => {
                    if(res.data){
                        //debugger
                        //this.buildedDate = res.data.buildedDate;
                        //this.deliverDate = res.data.deliverDate;
                        this.$set(this.form,"buildedDate",res.data.buildedDate);
                        this.$set(this.form,"deliverDate",res.data.deliverDate);
                    }
                });
            }
        },
        /*buildingNo(){

        },*/
        // 获取 easy-mock 的模拟数据
        getData() {
            this.form={};
            listCompAll(this.query).then(res => {
                this.compList = res.data.records;
                if(res.data.records.length==1){
                    this.otherComp = true;
                    this.query.compName=res.data.records[0].id;
                    getUserComm(res.data.records[0].id).then(res => {
                        if(res.data){
                            this.form.commId=undefined;
                            this.commList = res.data;
                        }
                    });
                }
                listBuilding(this.query).then(res => {
                    this.tableData = res.data;
                });
                listBuildingNum(this.query).then(res => {
                    this.pageTotal = res.data || 0;
                    console.log(this.pageTotal+"__+++__");
                });
            });
            getDictItemByDictId(10).then(res => {//10是建筑类型的id
                this.typeList = res.data;
            });
        },

        // 触发搜索按钮
        handleSearch() {
            this.query.pageNo=1;
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(id) {
            checkBuildingRoomUnit(id).then(res => {
                //console.log(res);
                if(res.data==''){
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            deleteBuilding(id).then(res => {
                                //console.log(res);
                                this.$message.success('删除成功');
                                this.getData();
                            });
                        })
                        .catch(() => {});
                }else{//
                    this.$confirm(res.data, '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            deleteBuilding(id).then(res => {
                                //console.log(res);
                                this.$message.success('删除成功');
                                this.getData();
                            });
                        })
                        .catch(() => {});
                }
            });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleAdd() {
            this.editVisible = true;
            this.disable = false;
            this.title="新增建筑";
            this.status = 0;
            this.edit=false;
            this.form={state:'在用'}
            this.$refs.form.clearValidate();
        },
        // 编辑操作
        handleEdit(index, row) {
            //this.$refs.form.clearValidate();
            this.idx = index;
            this.form = row;
            this.buildingName = row.name;
            this.buildingNo = row.no;
            this.updateVisible = true;
            this.status = 1;
            this.disable=false;
            this.edit=true;
            this.title="编辑建筑"
            this.detail=true;

        },
        copyEdit(index, row) {
            debugger
            this.idx = index;
            this.form = row;
            this.buildingName = row.name;
            this.buildingNo = row.no;
            this.commAreaName = row.commAreaName;
            this.commAreaId = row.commAreaId;
            this.copyVisible = true;
            this.disable=false;
            this.edit=true;
            this.title="复制建筑"
            this.commChange(row.commId);
            this.$refs.form.clearValidate();
        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看建筑"
            this.status = 2;
            this.detail=false;
        },
        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增建筑'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        //提交前验证建筑名称和编号是否重复
                        checkBulidingNameNo(this.form).then(res => {
                            if(res.data==''){
                                insertBuilding(this.form).then(res => {
                                    this.editVisible = false;
                                    this.$message.success(`新增成功`);
                                    this.getData();
                                });
                            }else{
                                this.$message.info(res.data);
                            }
                        });

                    }
                });
            }else {
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        //需要判断是否修改了建筑的名称和编号
                        if(this.buildingNo != this.form.no&&this.buildingName != this.form.name) {
                            checkBulidingNameNo(this.form).then(res => {
                                if(res.data==''){
                                    updateBuilding(this.form).then(res => {
                                        this.updateVisible = false;
                                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                        this.$set(this.tableData, this.idx, this.form);
                                        this.getData();
                                    });
                                }else{
                                    this.$message.info(res.data);
                                }
                            });
                        }else if(this.buildingName == this.form.name){
                            this.$message.info("请修改建筑名称");
                        }else if(this.buildingNo == this.form.no){
                            this.$message.info("请修改建筑编号");
                        }else{//建筑名称和建筑编号都没有改变，无需查询是否重复，直接update
                            updateBuilding(this.form).then(res => {
                                this.updateVisible = false;
                                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                this.$set(this.tableData, this.idx, this.form);
                                this.getData();
                            });
                        }
                    }
                });
            }

        },
        saveCopy(title,buildingName,buildingNo,form){
            //需要判断是否修改了建筑的名称和编号
            if(this.buildingName != this.form.name&&this.buildingNo != this.form.no||this.commAreaName!=this.form.commAreaName){
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        debugger
                        console.log(this.commAreaName);
                        console.log(this.form.commAreaName);
                        if(this.commAreaName==this.form.commAreaName){
                            this.form.commAreaId = this.commAreaId;
                        }else{
                            this.form.commAreaId = this.form.commAreaName;
                        }
                        checkBulidingNameNoCopy(this.form).then(res => {
                            if (res.data == '') {
                                copyBuilding(this.form).then(res => {
                                    this.copyVisible = false;
                                    this.$message.success(res.data);
                                    this.$set(this.tableData, this.idx, this.form);
                                    this.getData();
                                });
                            }else{
                                this.$message.info(res.data);
                            }
                        });
                    }
                });
            }else if(this.buildingName == this.form.name){
                this.$message.info("请修改建筑名称");
            }else{
                this.$message.info("请修改建筑编号");
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
