<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 仪表管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--comp_id comm_id property_type property_id propertyName  type no name new_num old_num state remark created_at created_name  modified_at modified_name-->
        <div class="container">
            <el-select v-model="query.compName" placeholder="请选择"  v-show="false">
                <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commName" placeholder="请选择"  @change="commChange" v-show="false">
                <el-option key="qxz" label="请选择社区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commAreaName" placeholder="请选择"  >
                <el-option key="qxz" label="请选择社区分区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.propertyType" placeholder="请选择" >
                <el-option key="qxz" label="请选择物业类型" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in propertyTypeList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.propertyName" placeholder="物业编号" class="handle-input mr10" ></el-input>
            <el-select v-model="query.type" placeholder="请选择" v-show="false">
                <el-option key="qxz" label="请选择仪表类型" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.no" placeholder="仪表编号" class="handle-input mr10" ></el-input>
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                elt
                @row-click="chooseDetails"
            >

                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130"></el-table-column>
                <el-table-column prop="commName" label="社区" width="120"></el-table-column>
                <el-table-column prop="commAreaName" label="社区分区" width="120"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型"></el-table-column>
                <el-table-column prop="propertyId" label="物业id" v-if="false"></el-table-column>
                <el-table-column prop="propertyName" label="物业编号"></el-table-column>
                <el-table-column prop="type" label="仪表类型"></el-table-column>
                <el-table-column prop="no" label="仪表编号"></el-table-column>
                <el-table-column prop="name" label="仪表名称"></el-table-column>

                <el-table-column prop="newNum" label="抄表刻度"></el-table-column>
                <el-table-column prop="meterReadTime" label="抄表时间" width="155"></el-table-column>
                <el-table-column prop="billNum" label="账单刻度"></el-table-column>
                <el-table-column prop="billDate" label="账单日期" width="155"></el-table-column>

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
        <el-dialog :title="title" :visible.sync="updateVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-form-item label="物业公司"  >
                    <el-select v-model="form.compName" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" >
                    <el-select v-model="form.commName" placeholder="请选择"  :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区分区名称" >
                    <el-select v-model="form.commAreaName" placeholder="请选择"  :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物业类型">
                    <el-select v-model="form.propertyType" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in propertyTypeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物业编号" >
                    <el-input v-model="form.propertyName" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="仪表类型">
                    <el-select v-model="form.type" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仪表编号" prop="no" >
                    <el-input v-model="form.no" ></el-input>
                </el-form-item>
                <el-form-item label="仪表名称"  prop="name">
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="抄表刻度">
                    <el-input v-model="form.newNum" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="抄表时间">
                    <el-date-picker
                            v-model="form.meterReadTime"
                            type="datetime"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                            :disabled="edit"
                    />
                </el-form-item>
                <el-form-item label="账单刻度" >
                    <el-input v-model="form.billNum" :disabled="edit"></el-input>
                </el-form-item>
                <el-form-item label="账单日期">
                    <el-date-picker
                            v-model="form.billDate"
                            type="datetime"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-d"
                            :disabled="edit"
                    />
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
                <el-button type="primary" @click="saveEditOrAdd(title,'form')" v-if="edit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script scope>

    import { getUserComm, getDictItemByDictId, getCommArea } from '../../api/building';
import { listCompAll } from '../../api/role';
import { listMeter,listMeterNum} from '../../api/meter';
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
                commAreaName:'',
                propertyType:'',
                propertyId:'',
                propertyName:'',
                type:'',
                no:'',
                name:'',
                newNum:'',
                meterReadTime:'',
                billNum:'',
                billDate:'',
                remark:'',
                state:'',
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
            pageTotal:0,
            disable:false,
            cmpVisible:false,
            roomVisible:false,
            parkingVisible:false,
            compList:[],
            commList:[],
            commAreaList:[],
            propertyTypeList:[],//物业类型
            typeList:[],//仪表类型
            form: {},
            no:'',
            formCopy:{},
            unitForm:{},
            state:'',
            meterReadTime:'',
            billDate:'',
            list:'',
            idx: -1,
            title:'',
            buildingName:'',
            buildingNo:'',
            id: -1,
            rules:{}
        };
    },
    /*created() {
        this.query.unitId = this.unitId
        this.getData();

    },*/
    components:{

     },
    methods: {

        commChange(val){
            getCommArea(val).then(res => {
                if(res.data){
                    this.form.commAreaId=undefined;
                    this.commAreaList = res.data;
                }
            });
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            debugger
            listMeter(this.query).then(res => {
                // debugger
                console.log(this.query.unitId)
                this.tableData = res.data;
            });
            listMeterNum(this.query).then(res => {
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
            getDictItemByDictId(45).then(res => {//45是物业类型
                this.propertyTypeList = res.data;
            });
            getDictItemByDictId(48).then(res => {//48是仪表类型
                this.typeList = res.data;
            });
        },

        // 触发搜索按钮
        handleSearch() {
            this.query.pageNo=1;
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        propertyTypeChage(){
            this.form.propertyId = '';
            this.form.propertyName = '';
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateVisible = true;
            this.disable=false;
            this.no = row.no;
            this.edit=true;
            this.title="编辑仪表";
            this.$refs.form.clearValidate();
        },
        roomDetail(compId, commId,commAreaId){
            this.roomVisible = true;
            this.$nextTick(()=>{
                this.$refs.roomVisible.dataInitializationByMeter(compId,commId,commAreaId);
            })

        },
        chooseDetails (row) {
            //具体操作
            this.form = row;
            this.title="选择仪表";
            this.sendData(this.form);
        },
        sendData(list) {
            console.log(list+"-------------------------------------------------");
            /* 通过 父组件的appendData方法,父组件可以取到 list 值,以此 来添加值!!!这个事件最好全是小写的..否则有各种各样的问题出现... */
            this.$emit('childByValue', list);
        },
        //表格行点击事件
        openDetails (index, row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看仪表";
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNo', val);
            this.getData();
        },
        dataInitializationByMeterRecord(compId,commId,type){
            debugger
            this.query.compName = compId;
            this.query.commName = commId;
            this.query.type = type;
            this.commChange(commId);
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
