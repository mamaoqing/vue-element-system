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

            <el-select v-model="query.buildingName" placeholder="请选择" @change="buildingChange" >
                <el-option key="qxz" label="请选择建筑名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in buildingList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.unitName" placeholder="请选择" @change="select_status" >
                <el-option key="qxz" label="请选择单元名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in unitList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.roomNo" placeholder="房间编号" class="handle-input mr10" style="width: 130px;"></el-input>
            <el-input v-model="query.name" placeholder="房间名称" class="handle-input mr10" style="width: 150px;"></el-input>

            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                elt
                @row-click="chooseDetails"
                @selection-change="handleSelectionChange"
                highlight-current-row
            >
                <el-table-column prop="commAreaName" label="社区分区名称" width="120"></el-table-column>
                <el-table-column prop="buildingName" label="建筑名称" width="120"></el-table-column>
                <el-table-column prop="unitName" label="单元名称" width="120"></el-table-column>
                <el-table-column prop="name" label="房间名称" width="120"></el-table-column>
                <el-table-column prop="roomNo" label="房间号"></el-table-column>
                <el-table-column prop="floor" label="楼层"></el-table-column>
                <el-table-column prop="floorNum" label="楼层数"></el-table-column>
                <el-table-column prop="elevatorNum" label="电梯数"></el-table-column>
                <el-table-column prop="roomNum" label="每层房间数"></el-table-column>
                <el-table-column prop="roomModel" label="房型"></el-table-column>
                <el-table-column prop="roomType" label="房屋类型"></el-table-column>
                <el-table-column prop="propertyRightNature" label="产权性质"></el-table-column>
                <el-table-column prop="direction" label="朝向"></el-table-column>
                <el-table-column prop="renovationLevel" label="装修程度"></el-table-column>
                <el-table-column prop="usable" label="用途"></el-table-column>
                <el-table-column prop="titleDeedNo" label="产权证号"></el-table-column>
                <el-table-column prop="landDeedNo" label="土地证号"></el-table-column>
                <el-table-column prop="contractNo" label="购房合同号"></el-table-column>
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
                                @click="openDetails(scope.$index, scope.row)"
                        >查看</el-button>

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
                    <el-select v-model="form.roomModel" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in roomModelList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="房屋类型" prop="form.roomType">
                    <el-select v-model="form.roomType" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in roomTypeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产权性质" prop="form.propertyRightNature">
                    <el-select v-model="form.propertyRightNature" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in propertyRightNatureList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="朝向" prop="form.direction">
                    <el-select v-model="form.direction" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in directionList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="装修程度" prop="form.renovationLevel">
                    <el-select v-model="form.renovationLevel" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in renovationLevelList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用途" prop="form.usable">
                    <el-select v-model="form.usable" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in usableList" >{{types.name}}</el-option>
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
        <el-dialog  :visible.sync="cmpVisible" append-to-body>
            <menu1 v-if="cmpVisible" ref="menu1"></menu1>
        </el-dialog>
        <el-dialog  :visible.sync="ownerVisible" append-to-body width="75%" >
            <ownerVisible v-if="ownerVisible" ref="ownerVisible"></ownerVisible>
        </el-dialog>
    </div>
</template>

<script scope>

import { getUserComm,getCommArea,getCommAreaContent,getDictItemByDictId,getBuildingsByCommId,getUnits } from '../../api/building';
import { listCompAll } from '../../api/role';
import { insertRoom,deleteRoom,updateRoom,listRoom,listRoomNum,checkRoomOwer,upload,exportXlsByT} from '../../api/room';
import menu1 from './roomUpload';
import ownerVisible from './owner';
export default {
    name:"roomlistpage",
    props:{
        unitId:''
    },
    data() {
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
            meterDisable:false,
            pageTotal:0,
            disable:false,
            cmpVisible:false,
            ownerVisible:false,
            compList:[],
            commList:[],
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
            }
        };
    },
    created() {
        this.query.unitId = this.unitId
        this.getData();
    },
    components:{
        menu1,
        ownerVisible
     },
    methods: {
        getBuildings(){
            getBuildingsByCommId(this.query.commName).then(res => {
                if(res.data){
                    this.form.buildingId=undefined;
                    this.query.buildingName="请选择建筑名称";
                    this.query.unitName="请选择单元名称";
                    console.log(this.form.commId);
                    this.buildingList = res.data;
                }
            });
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
        },

        // 触发搜索按钮
        handleSearch() {
            this.query.pageNo=1;
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        openDetails (index, row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看仪表"

        },
        chooseDetails (row) {
            //具体操作
            this.form = row;
            //this.disable=true;
            this.updateVisible = true;
            this.title="查看房间";
            this.sendData(this.form);
        },
        sendData(list) {
            console.log(list+"-------------------------------------------------");
            /* 通过 父组件的appendData方法,父组件可以取到 list 值,以此 来添加值!!!这个事件最好全是小写的..否则有各种各样的问题出现... */
            this.$emit('childByValue', list);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNo', val);
            this.getData();
        },
        dataInitializationByMeter(compId,commId,commAreaId){
            this.query.compName = compId;
            this.query.commName = commId;
            this.query.commAreaName = commAreaId;
            this.meterDisable = false;
            this.getBuildings();
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
.el-table__body tr.current-row>td {
    background: #f57878 !important;
}
</style>
