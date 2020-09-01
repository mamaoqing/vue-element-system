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
            <el-select v-model="query.compName" placeholder="请选择" @change="compChange" >
                <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commName" placeholder="请选择"  @change="commChange">
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
            <el-select v-model="query.type" placeholder="请选择" >
                <el-option key="qxz" label="请选择仪表类型" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.no" placeholder="仪表编号" class="handle-input mr10" ></el-input>
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">新增</el-button>
                <!--<el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>-->
                <el-button type="primary" icon="el-icon-lx-add" @click="upload" >导入</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="exportXls">导出</el-button>
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

                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130"></el-table-column>
                <el-table-column prop="commName" label="社区" width="120"></el-table-column>
                <el-table-column prop="commAreaName" label="社区分区" width="120"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型"></el-table-column>
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
        <el-dialog :title="title" :visible.sync="editVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-form-item label="物业公司" prop="compId" >
                    <el-select v-model="form.compId" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" prop="commId" >
                    <el-select v-model="form.commId" placeholder="请选择"  @change="commChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区分区名称" prop="commAreaId" >
                    <el-select v-model="form.commAreaId" placeholder="请选择" @change="select_status" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commAreaList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物业类型" prop="commId">
                    <el-select v-model="form.propertyType" placeholder="请选择" :disabled="edit" @blur="propertyTypeChage">
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in propertyTypeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物业编号"  prop="propertyId" :disabled="false">
                    <el-input v-model="form.propertyName" :disabled="true"></el-input>
                    <el-button
                            type="text"
                            icon="el-icon-search"
                            @click.stop
                            @click="roomParkingSearch()"
                    >选择</el-button>
                </el-form-item>
                <el-form-item label="仪表类型" prop="type" >
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
               <el-form-item label="抄表刻度" >
                    <el-input v-model="form.newNum" ></el-input>
                </el-form-item>
                <el-form-item label="抄表时间" prop="meterReadTime">
                    <el-date-picker
                            v-model="form.meterReadTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-d HH:mm:ss"
                            :disabled="edit"
                    />
                </el-form-item>
                <el-form-item label="账单刻度" >
                    <el-input v-model="form.billNum" ></el-input>
                </el-form-item>
                <el-form-item label="账单日期" prop="billDate">
                    <el-date-picker
                            v-model="form.billDate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-d HH:mm:ss"
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="updateVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-form-item label="物业公司"  >
                    <el-select v-model="form.compName" placeholder="请选择" @change="compChange" :disabled="edit">
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
        <el-dialog  :visible.sync="cmpVisible" append-to-body>
            <menu1 v-on:childByValueUpload="childByValueUpload" ref="menu1"></menu1>
        </el-dialog>
        <el-dialog  :visible.sync="roomVisible" append-to-body width="55%" >
            <roomVisible v-on:childByValue="childByValue" v-if="roomVisible" ref="roomVisible"></roomVisible>
        </el-dialog>
        <el-dialog  :visible.sync="parkingVisible" append-to-body width="55%" >
            <parkingVisible v-on:childByValueParking="childByValueParking" v-if="parkingVisible" ref="parkingVisible"></parkingVisible>
        </el-dialog>
    </div>
</template>

<script scope>

    import { getUserComm, getDictItemByDictId, getCommArea, checkBulidingNameNo } from '../../api/building';
import { listCompAll } from '../../api/role';
import { insertMeter,deleteMeter,updateMeter,listMeter,listMeterNum,upload,exportXlsByT,checkMeterNo} from '../../api/meter';
import menu1 from './roomUpload';
import roomVisible from './roomChoose';
import parkingVisible from './parkingChoose';
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
        let checkpropertyType = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业类型"));
            }else{
                return callback();
            }
        }
        let checkpropertyId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业编号"));
            }else{
                return callback();
            }
        }
        let checktype = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入仪表类型"));
            }else{
                return callback();
            }
        }
        let checkno = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入仪表编号"));
            }else{
                return callback();
            }
        }
        let checknewNum = (rule,value,callback) =>{
            if (!value) {
                return callback(new Error("请输入抄表刻度"));
            } else {
                var reg = /^-?\d{1,16}(?:\.\d{1,3})?$/;//小数点左边最高16位，小数点右边最多2位
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error("输入正确的数字,小数点后可1到3位"));
                }
            }
        }
        let checkmeterReadTime = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入抄表时间"));
            }else{
                return callback();
            }
        }
        let checkbillDate = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入账单日期"));
            }else{
                return callback();
            }
        }
        let checkbillNum = (rule,value,callback) =>{
            if (!value) {
                return callback(new Error("请输入账单刻度"));
            } else {
                var reg = /^-?\d{1,16}(?:\.\d{1,3})?$/;//小数点左边最高16位，小数点右边最多2位
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error("输入正确的数字,小数点后可1到3位"));
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
                propertyType:[{
                    validator:checkpropertyType,required: true,trigger:'blur'
                }],
                propertyId:[{
                    validator:checkpropertyId,required: true,trigger:'blur'
                }],
                type:[{
                    validator:checktype,required: true,trigger:'blur'
                }],
                no:[{
                    validator:checkno,required: true,trigger:'blur'
                }],
                state:[{
                    validator:checkstate,required: true,trigger:'blur'
                }],
                newNum:[{
                    validator:checknewNum,required: true,trigger:'blur'
                }],
                meterReadTime:[{
                    validator:checkmeterReadTime,required: true,trigger:'blur'
                }],
                billNum:[{
                    validator:checkbillNum,required: true,trigger:'blur'
                }],
                billDate:[{
                    validator:checkbillDate,required: true,trigger:'blur'
                }]
            }
        };
    },
    created() {
        this.query.unitId = this.unitId
        this.getData();

    },
    components:{
        menu1,
        roomVisible,
        parkingVisible,
     },
    methods: {
        childByValueUpload(){
            this.cmpVisible=false;
            this.getData();
        },
        compChange(val){
            debugger
            if(this.form.compId!=undefined||val!=undefined){
                var compId;
                if(val==undefined){
                    compId = this.form.compId;
                }else{
                    compId = val;
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
            if(this.form.commId!=undefined||val!=undefined){
                var commId;
                if(this.form.commId!=undefined&&this.form.commId!=''){
                    commId = this.form.commId;
                }else{
                    commId = val;
                }
                getCommArea(commId).then(res => {
                    if(res.data){
                        this.form.commAreaId=undefined;
                        this.commAreaList = res.data;
                    }
                });
            }
        },
        exportXls(){
            exportXlsByT(this.query).then(res => {
                var blob = new Blob([res],{type:'application/octet-stream'},'sheet.xlsx')
                if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                    window.navigator.msSaveBlob(blob, unescape(res.headers.filename.replace(/\\u/g, '%u')));
                } else {
                    var downloadElement = document.createElement('a');
                    var href = window.URL.createObjectURL(blob); //创建下载的链接

                    downloadElement.href = href;
                    downloadElement.download = unescape('仪表信息'+this.getTime()+'.xls'); //下载后文件名

                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //点击下载

                    document.body.removeChild(downloadElement); //下载完成移除元素

                    window.URL.revokeObjectURL(href); //释放掉blob对象
                }
            });
        },
        getTime(){
            let date = new Date();
            let yy = date.getFullYear();
            let mm = date.getMonth() + 1;
            if(mm<10){
                mm = '0'+mm;
            }
            let dd = date.getDate();
            if(dd<10){
                dd = '0'+dd;
            }
            let h = date.getHours();
            if(h<10){
                h = '0'+h;
            }
            let m = date.getMinutes();
            if(m<10){
                m = '0'+m;
            }
            let s = date.getSeconds();
            if(s<10){
                s = '0'+s;
            }
            let ms = date.getMilliseconds();
            let time = yy+""+mm+""+dd+""+h+""+m+""+s+""+ms;
            return time;
        },
        select_status(val){
            this.$forceUpdate();
        },
        // 获取 easy-mock 的模拟数据
        getData() {
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
        delAllSelection() {
            debugger
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
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteMeter(id).then(res => {
                        //debugger
                        //console.log(res);
                        this.$message.success(res.data);
                        this.getData();
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleAdd() {
            debugger
            this.form = {};
            this.editVisible = true;
            this.title="新增仪表";
            this.disable=false;
            this.form.state='在用';

            let date = new Date();
            let yy = date.getFullYear();
            let mm = date.getMonth();
            let dd = date.getDate();
            let h = date.getHours();
            let m = date.getMinutes();
            let s = date.getSeconds();
            this.$set(this.form, "meterReadTime", new Date(yy, mm, dd, h, m,s));
            this.$set(this.form, "billDate", new Date(yy, mm, dd, h, m,s));
            this.edit=false;
            this.$refs.form.clearValidate();
        },
        uploadFile(){
            this.uploadVisible = true;
            this.title="导入";
        },
        childByValue(list){
            this.roomVisible = false;
            this.form.propertyId = list.id;
            this.form.propertyName = list.buildingNo+"-"+list.unitNo+"-"+list.roomNo;
            console.log(list+"_______________________________");
        },
        childByValueParking(list){
            this.parkingVisible = false;
            this.form.propertyId = list.id;
            this.form.propertyName = list.no;
            console.log(list.id+"_______________________________"+list.no);
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
        upload(){
            //let linkID = id;
            this.cmpVisible = true;
            this.$nextTick(()=>{
                this.$refs.menu1.dataInitializationUpload("http://localhost:8900/api/fMeter/upload");
            })

        },
        roomParkingSearch(){
            console.log(this.form.compId+'------'+this.form.commId+'------'+this.form.propertyType);
            if(this.form.compId!=''&&this.form.compId!=undefined&&this.form.commId!=''&&this.form.commId!=undefined&&this.form.commAreaId!=''&&this.form.commAreaId!=undefined&&this.form.propertyType!=''&&this.form.propertyType!=undefined){
                if(this.form.propertyType=='房产'){
                    this.roomDetail(this.form.compId,this.form.commId,this.form.commAreaId);
                }else{
                    this.parkingDetail(this.form.compId,this.form.commId,this.form.commAreaId);
                }
            }else{
                this.$message.info("请先选择物业公司、社区、社区分区和物业类型，再进行选择");
            }
        },
        roomDetail(compId, commId,commAreaId){
            this.roomVisible = true;
            this.$nextTick(()=>{
                this.$refs.roomVisible.dataInitializationByMeter(compId,commId,commAreaId);
            })

        },
        parkingDetail(compId, commId,commAreaId){
            this.parkingVisible = true;
            this.$nextTick(()=>{
                this.$refs.parkingVisible.dataInitializationByMeter(compId,commId,commAreaId);
            })

        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看仪表";
        },
        format(val){
            let read = new Date(val);
            let yy = read.getFullYear();
            let mm = read.getMonth()+1;
            let dd = read.getDate();
            let h = read.getHours();
            let m = read.getMinutes();
            let s = read.getSeconds();
            return yy+"-"+mm+"-"+dd+" "+h+":"+m+":"+s;
        },

        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增仪表'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        this.form.meterReadTime = this.format(this.form.meterReadTime);
                        this.form.billDate = this.format(this.form.billDate);
                        checkMeterNo(this.form).then(res => {
                            if(res.data==''||res.data==null){
                                insertMeter(this.form).then(res => {
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
                        if(this.no != this.form.no){
                            checkMeterNo(this.form).then(res => {
                                if(res.data==''){
                                    updateMeter(this.form).then(res => {
                                        this.updateVisible = false;
                                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                        this.$set(this.tableData, this.idx, this.form);
                                        this.getData();
                                    });
                                }else{
                                    this.$message.info(res.data);
                                }
                            });
                        }else{
                            updateMeter(this.form).then(res => {
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
