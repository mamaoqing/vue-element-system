<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 房间管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-select v-model="query.compName" placeholder="请选择" @change="compChange" v-if="unitDisable">
                <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commName" placeholder="请选择" @change="commChange" v-if="unitDisable">
                <el-option key="qxz" label="请选择社区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commAreaName" placeholder="请选择" @change="commAreaChange" v-if="unitDisable">
                <el-option key="qxz" label="请选择社区分区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.buildingName" placeholder="请选择" @change="buildingChange" v-if="unitDisable">
                <el-option key="qxz" label="请选择建筑名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in buildingList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.unitName" placeholder="请选择" @change="select_status" v-if="unitDisable">
                <el-option key="qxz" label="请选择单元名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in unitList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.roomNo" placeholder="房间编号" class="handle-input mr10" v-if="unitDisable"></el-input>

            <el-select v-model="query.roomModel" placeholder="请选择" v-if="unitDisable">
                <el-option key="qxz" label="请选择房型" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in roomModelList" >{{types.name}}</el-option>
            </el-select>

            <el-select v-model="query.usable" placeholder="请选择" v-if="unitDisable">
                <el-option key="qxz" label="请选择用途" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in usableList" >{{types.name}}</el-option>
            </el-select>
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" v-if="unitDisable">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">新增</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="upload" v-if="unitDisable">导入1</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="uploadFile" v-if="unitDisable">导入</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                elt
                @row-click="openDetails"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="compName" label="物业公司"></el-table-column>
                <el-table-column prop="commName" label="社区名称"></el-table-column>
                <el-table-column prop="commAreaName" label="社区分区名称"></el-table-column>
                <el-table-column prop="buildingName" label="建筑名称"></el-table-column>
                <el-table-column prop="unitName" label="单元名称"></el-table-column>
                <el-table-column prop="name" label="房间名称"></el-table-column>
                <el-table-column prop="roomNo" label="房间号"></el-table-column>
                <el-table-column prop="floor" label="楼层"></el-table-column>
                <el-table-column prop="floorNum" label="楼层数"></el-table-column>
                <el-table-column prop="elevatorNum" label="电梯数"></el-table-column>
                <el-table-column prop="roomNum" label="每层房间数"></el-table-column>
                <el-table-column prop="roomModelName" label="房型"></el-table-column>
                <el-table-column prop="roomTypeName" label="房屋类型"></el-table-column>
                <el-table-column prop="propertyRightNatureName" label="产权性质"></el-table-column>
                <el-table-column prop="directionName" label="朝向"></el-table-column>
                <el-table-column prop="renovationLevelName" label="装修程度"></el-table-column>
                <el-table-column prop="usableName" label="用途"></el-table-column>
                <el-table-column prop="titleDeedNo" label="产权证号"></el-table-column>
                <el-table-column prop="landDeedNo" label="土地证号"></el-table-column>
                <el-table-column prop="contractNo" label="购房合同号"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column prop="createdName" label="创建人"></el-table-column>
                <el-table-column prop="createdAt" label="创建日期"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改日期"></el-table-column>
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
        <el-dialog :title="title" :visible.sync="uploadVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" enctype="multipart/form-data" :rules="rules" :disabled="disable">
                <el-form-item label="名称" prop="file">
                    <el-input v-model="form.file"  type="file"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadDr(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-form-item label="物业公司" prop="compId" v-show="unitDisable">
                    <el-select v-model="form.compId" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" prop="commId" >
                    <el-select v-model="form.commId" placeholder="请选择" @change="commChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区分区名称" prop="commAreaId" v-show="unitDisable">
                    <el-select v-model="form.commAreaId" placeholder="请选择" @change="commAreaChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建筑名称" prop="buildingId" v-show="unitDisable">
                    <el-select v-model="form.buildingId" placeholder="请选择" @change="buildingChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in buildingList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单元名称" prop="unitId" v-show="unitDisable">
                    <el-select v-model="form.unitId" placeholder="请选择" @change="select_status" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in unitList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="房间号" prop="roomNo" >
                    <el-input v-model="form.roomNo" ></el-input>
                </el-form-item>
                <el-form-item label="楼层" prop="floor" >
                    <el-input v-model="form.floor" ></el-input>
                </el-form-item>
                <el-form-item label="房型" >
                    <el-select v-model="form.roomModel" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in roomModelList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="房屋类型" >
                    <el-select v-model="form.roomType" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in roomTypeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产权性质" >
                    <el-select v-model="form.propertyRightNature" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in propertyRightNatureList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="朝向" >
                    <el-select v-model="form.direction" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in directionList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="装修程度" >
                    <el-select v-model="form.renovationLevel" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in renovationLevelList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用途" >
                    <el-select v-model="form.usable" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in usableList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产权证号"  >
                    <el-input v-model="form.titleDeedNo" ></el-input>
                </el-form-item>
                <el-form-item label="土地证号"  >
                    <el-input v-model="form.landDeedNo" ></el-input>
                </el-form-item>
                <el-form-item label="购房合同号"  >
                    <el-input v-model="form.contractNo" ></el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop="buildingArea" >
                    <el-input v-model="form.buildingArea" ></el-input>
                </el-form-item>
                <el-form-item label="使用面积" prop="usableArea" >
                    <el-input v-model="form.usableArea" ></el-input>
                </el-form-item>
                <el-form-item label="花园面积"  >
                    <el-input v-model="form.gardenArea" ></el-input>
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
        <el-dialog :title="title" :visible.sync="updateVisible" width="30%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
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
                <el-form-item label="社区分区名称" prop="commAreaId" >
                    <el-select v-model="form.commAreaName" placeholder="请选择" @change="commAreaChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建筑名称" prop="buildingId" >
                    <el-select v-model="form.buildingName" placeholder="请选择" @change="buildingChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in buildingList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单元名称" prop="unitId" >
                    <el-select v-model="form.unitName" placeholder="请选择" @change="select_status" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in unitList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="房间号" prop="roomNo" >
                    <el-input v-model="form.roomNo" ></el-input>
                </el-form-item>
                <el-form-item label="楼层" prop="floor" >
                    <el-input v-model="form.floor" ></el-input>
                </el-form-item>
                <el-form-item label="房型" prop="form.roomModel">
                    <el-select v-model="form.roomModelName" placeholder="请选择" >
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in roomModelList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="房屋类型" prop="form.roomType">
                    <el-select v-model="form.roomTypeName" placeholder="请选择" >
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in roomTypeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产权性质" prop="form.propertyRightNature">
                    <el-select v-model="form.propertyRightNatureName" placeholder="请选择" >
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in propertyRightNatureList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="朝向" prop="form.direction">
                    <el-select v-model="form.directionName" placeholder="请选择" >
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in directionList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="装修程度" prop="form.renovationLevel">
                    <el-select v-model="form.renovationLevelName" placeholder="请选择" >
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in renovationLevelList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用途" prop="form.usable">
                    <el-select v-model="form.usableName" placeholder="请选择" >
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in usableList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产权证号"  >
                    <el-input v-model="form.titleDeedNo" ></el-input>
                </el-form-item>
                <el-form-item label="土地证号"  >
                    <el-input v-model="form.landDeedNo" ></el-input>
                </el-form-item>
                <el-form-item label="购房合同号"  >
                    <el-input v-model="form.contractNo" ></el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop="buildingArea" >
                    <el-input v-model="form.buildingArea" ></el-input>
                </el-form-item>
                <el-form-item label="使用面积" prop="usableArea" >
                    <el-input v-model="form.usableArea" ></el-input>
                </el-form-item>
                <el-form-item label="花园面积"  >
                    <el-input v-model="form.gardenArea" ></el-input>
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
                <el-form-item label="创建人" >
                    <el-input v-model="form.createdName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="创建日期" >
                    <el-input v-model="form.createdAt" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改人" >
                    <el-input v-model="form.modifiedName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改日期" >
                    <el-input v-model="form.modifiedAt" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
<!--        <el-dialog  :visible.sync="cmpVisible" append-to-body>-->
<!--            <menu1 v-if="cmpVisible" ref="menu1"></menu1>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>

import { getUserComm,getCommArea,getCommAreaContent,getDictItemByDictId,getBuildings,getUnits } from '../../api/building';
import { listCompAll } from '../../api/role';
import { insertRoom,deleteRoom,updateRoom,listRoom,listRoomNum,checkRoomOwer,upload} from '../../api/room';
// import menu1 from './roomUpload';
export default {
    name:"roomlistpage",
    props:{
        unitId:''
    },
    data() {
        let checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入名称"));
            }else{
                return callback();
            }
        }
        let checkcompId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业公司名称"));
            }else{
                return callback();
            }
        }
        let checkcommId= (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入社区名称"));
            }else{
                return callback();
            }
        }
        let checkcommAreaId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入社区分区名称"));
            }else{
                return callback();
            }
        }
        let checkbuildingId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入建筑名称"));
            }else{
                return callback();
            }
        }
        let checkunitId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入单元名称"));
            }else{
                return callback();
            }
        }
        let checkroomNo = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入房间编号"));
            }else{
                return callback();
            }
        }
        let checkfloor = (rule,value,callback) =>{
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
        var checkbuildingArea = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入建筑面积"));
            } else {
                var reg = /^-?\d{1,16}(?:\.\d{1,2})?$/;//小数点左边最高16位，小数点右边最多2位
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error("输入正确的数字,小数点后可1到2位"));
                }
            }
        }
        var checkusableArea = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入使用面积"));
            } else {
                var reg = /^-?\d{1,16}(?:\.\d{1,2})?$/;//小数点左边最高16位，小数点右边最多2位
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error("输入正确的数字,小数点后可1到2位"));
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
                compId:'',
                compName:'',
                commId:'',
                commName:'',
                commAreaId:'',
                file:'',
                commAreaName:'',
                buildingId:'',
                buildingName:'',
                unitId:'',
                unitName:'',
                name:'',
                roomNo:'',
                floor :'',
                floorNum:'',
                elevatorNum:'',
                roomNum:'',
                roomModel:'',
                roomType:'',
                propertyRightNature:'',
                direction:'',
                renovationLevel:'',
                usable:'',
                titleDeedNo:'',
                landDeedNo:'',
                contractNo:'',
                state:'',
                buildingArea:'',//建筑面积
                usableArea:'',//使用面积
                gardenArea:'',//花园面积
                pageNo: 1,
                size: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            updateVisible:false,
            uploadVisible:false,
            copyVisible:false,
            edit:false,
            unitDisable:true,
            pageTotal:0,
            disable:false,
            cmpVisible:false,
            compList:[],
            commList:[],
            commAreaList:[],
            roomModelList:[],//房型
            usableList:[],//用途类型
            roomTypeList:[],// 房屋类型
            propertyRightNatureList:[],// 产权性质
            directionList:[],//朝向
            renovationLevelList:[],// 装修程度
            buildingList:[],
            unitList:[],
            form: {},
            formCopy:{},
            unitForm:{},
            idx: -1,
            title:'',
            buildingName:'',
            buildingNo:'',
            id: -1,
            rules:{
                name:[{
                    validator:checkname,required: true,trigger:'blur'
                }],
                compId:[{
                    validator:checkcompId,required: true,trigger:'change'
                }],
                commId:[{
                    validator:checkcommId,required: true,trigger:'change'
                }],
                commAreaId:[{
                    validator:checkcommAreaId,required: true,trigger:'change'
                }],
                buildingId:[{
                    validator:checkbuildingId,required: true,trigger:'change'
                }],
                unitId:[{
                    validator:checkunitId,required: true,trigger:'change'
                }],
                roomNo:[{
                    validator:checkroomNo,required: true,trigger:'blur'
                }],
                floor:[{
                    validator:checkfloor,required: true,trigger:'blur'
                }],
                buildingArea:[{
                    validator:checkbuildingArea,required: true,trigger:'blur'
                }],
                usableArea:[{
                    validator:checkusableArea,required: true,trigger:'blur'
                }],
                state:[{
                    validator:checkstate,required: true,trigger:'blur'
                }]
            }
        };
    },
    created() {
        this.query.unitId = this.unitId
        this.getData();
    },
    // components:{
    //     menu1
    // },
    methods: {

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
                        this.query.commAreaName="请选择社区分区名称";
                        this.query.buildingName="请选择建筑名称";
                        this.query.unitName="请选择单元名称";
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
                getCommArea(commId).then(res => {
                    if(res.data){
                        this.form.commAreaId=undefined;
                        this.query.commAreaName="请选择社区分区名称";
                        this.query.buildingName="请选择建筑名称";
                        this.query.unitName="请选择单元名称";
                        console.log(this.form.commId);
                        this.commAreaList = res.data;
                    }
                });
            }
        },
        commAreaChange(val){
            if(this.form.commAreaId!=undefined||val!=undefined){
                var commAreaId ;
                if(this.form.commAreaId!=undefined&&this.form.commAreaId!=''){
                    commAreaId = this.form.commAreaId;
                }else{
                    commAreaId = val;
                    this.query.commAreaName=commAreaId;
                }
                getCommAreaContent(commAreaId).then(res => {
                    if(res.data){
                        //this.buildedDate = res.data.buildedDate;
                        //this.deliverDate = res.data.deliverDate;
                        this.$set(this.form,"buildedDate",res.data.buildedDate);
                        this.$set(this.form,"deliverDate",res.data.deliverDate);
                    }
                });
                getBuildings(commAreaId).then(res => {
                    if(res.data){
                        this.form.buildingId=undefined;
                        this.query.buildingName="请选择建筑名称";
                        this.query.unitName="请选择单元名称";
                        console.log(this.form.commId);
                        this.buildingList = res.data;
                    }
                });
            }
        },
        buildingChange(val){
            if(this.form.buildingId!=undefined||val!=undefined){
                var buildingId ;
                if(this.form.buildingId!=undefined&&this.form.buildingId!=''){
                    buildingId = this.form.buildingId;
                }else{
                    buildingId = val;
                    this.query.buildingName=buildingId;
                }
                getUnits(buildingId).then(res => {
                    if(res.data){
                        this.form.unitId=undefined;
                        this.query.unitName="请选择单元名称";
                        this.unitList = res.data;
                    }
                });
            }
        },
        select_status(val){
            this.$forceUpdate();
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            listRoom(this.query).then(res => {
                // debugger
                console.log(this.query.unitId)
                this.tableData = res.data;
            });
            listRoomNum(this.query).then(res => {
                // debugger
                this.pageTotal = res.data || 0;
                console.log(this.pageTotal+"__+++__");
            });
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
            getDictItemByDictId(44).then(res => {//44是房型的id
                // debugger
                this.roomModelList = res.data;
            });
            getDictItemByDictId(7).then(res => {//7是用途的id
                this.usableList = res.data;
            });
            getDictItemByDictId(1).then(res => {//1是建筑类型的id
                this.roomTypeList = res.data;
            });
            getDictItemByDictId(27).then(res => {//7是产权性质的id
                this.propertyRightNatureList = res.data;
            });
            getDictItemByDictId(30).then(res => {//7是朝向的id
                this.directionList = res.data;
            });
            getDictItemByDictId(31).then(res => {//7是装修程度的id
                this.renovationLevelList = res.data;
            });
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        delAllSelection() {
            // debugger
            const length = this.multipleSelection.length;
            let str = '';
            let ids = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
                ids += this.multipleSelection[i].id + ',';
            }
            /*deleteRoom(ids).then(res => {
                //console.log(res);
                this.$message.success(`删除了${str}`);
                this.multipleSelection = [];
                this.getData();
            });*/
            this.handleDelete(ids);
        },
        // 删除操作
        handleDelete(id) {
            checkRoomOwer(id).then(res => {
                //console.log(res);
                if(res.data==''){
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            deleteRoom(id).then(res => {
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
                            deleteRoom(id).then(res => {
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
            this.title="新增房间";
            this.edit=false;
            this.form={state:'在用'}
            if(this.unitDisable ===false){
                this.$set(this.form, 'compId', this.unitForm.compName);
                this.$set(this.form, 'commId', this.unitForm.commName);
                this.$set(this.form, 'commAreaId', this.unitForm.commAreaName);
                this.$set(this.form, 'buildingId', this.unitForm.buildingName);
                this.$set(this.form, 'unitId', this.unitForm.unitName);
            }
            this.$refs.form.clearValidate();

        },
        uploadFile(){
            this.uploadVisible = true;
            this.title="导入";
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateVisible = true;
            this.disable=false;
            this.edit=true;
            this.title="修改房间"
            this.$refs.form.clearValidate();
        },
        upload(){
            //let linkID = id;
            this.cmpVisible = true;
            this.$nextTick(()=>{
                //this.$refs.menu1.dataInitialization(linkID);
            })

        },
        copyEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.buildingName = row.name;
            this.buildingNo = row.no;
            this.copyVisible = true;
            this.disable=false;
            this.edit=true;
            this.title="复制房间"
            this.$refs.form.clearValidate();
        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看房间"

        },
        uploadDr(title,form){
            console.log(this.form);
            upload(this.form.file,{
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {

            })
        },
        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增房间'){
                //this.editVisible = false;
                console.log(this.form)
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        insertRoom(this.form).then(res => {
                            this.editVisible = false;
                            this.$message.success(`新增成功`);
                            this.getData();
                        });
                    }
                });
            }else {
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        updateRoom(this.form).then(res => {
                            this.updateVisible = false;
                            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.$set(this.tableData, this.idx, this.form);
                            this.getData();
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
        //初始化数据
        dataInitialization(compId,commId,areaId,buildId,unitId) {
            this.query.compName = compId;
            this.query.commName = commId;
            this.query.commAreaName = areaId;
            this.query.buildingName = buildId;
            this.query.unitName = unitId;
            this.$set(this.unitForm, 'compName', compId);
            this.$set(this.unitForm, 'commName', commId);
            this.$set(this.unitForm, 'commAreaName', areaId);
            this.$set(this.unitForm, 'buildingName', buildId);
            this.$set(this.unitForm, 'unitName', unitId);

            this.unitDisable = false
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
