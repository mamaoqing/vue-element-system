<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 审核人配置管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-select v-model="query.compName" placeholder="请选择" @change="compChange" :disabled="otherComp">
                <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commName" placeholder="请选择"  >
                <el-option key="qxz" label="请选择社区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.type" placeholder="请选择" >
                <el-option key="qxz" label="请选择审核人类型" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
            </el-select>
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                elt
                @row-click="openDetails"
            >

                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130"></el-table-column>
                <el-table-column prop="commName" label="社区" width="120"></el-table-column>
                <el-table-column prop="type" label="审核人类型"></el-table-column>
                <el-table-column prop="name" label="审核人"></el-table-column>
                <el-table-column prop="orderNo" label="排序号"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
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
        <!-- 新增弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                    <el-form-item label="物业公司" prop="compId" >
                        <el-select v-model="form.compId" placeholder="请选择" @change="compChange" :disabled="edit">
                            <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="社区名称" prop="commId" >
                        <el-select v-model="form.commId" placeholder="请选择"  @change="select_status" :disabled="edit">
                            <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核人类型" prop="type" >
                        <el-select v-model="form.type" placeholder="请选择" :disabled="edit">
                            <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核人" prop="name">
                        <el-input v-model="form.name" :disabled="true" style="width: 130px;"></el-input>
                            <el-button
                                    type="text"
                                    icon="el-icon-search"
                                    @click.stop
                                    @click="userSearch()"
                            >选择</el-button>
                    </el-form-item>
                    <el-form-item label="排序号" prop="orderNo">
                        <el-input v-model="form.orderNo"></el-input>
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
        <el-dialog :title="title" :visible.sync="updateVisible" width="45%" append-to-body>
            <el-form ref="form" :model="form" label-width="150px"  :rules="rules" :disabled="disable">
                <el-form-item label="物业公司" prop="compName" >
                    <el-select v-model="form.compName" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" prop="commName" >
                    <el-select v-model="form.commName" placeholder="请选择"  @change="select_status" :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核人类型" prop="type" >
                    <el-select v-model="form.type" placeholder="请选择" >
                        <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核人" prop="name">
                    <el-input v-model="form.name" :disabled="true" style="width: 130px;"></el-input>
                    <el-button
                            type="text"
                            icon="el-icon-search"
                            @click.stop
                            @click="userSearch()"
                    >选择</el-button>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNo">
                    <el-input v-model="form.orderNo"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <commPage :form="form" :status="status" :editVisible="updateVisible"></commPage>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')" v-if="edit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="userVisible" append-to-body width="55%" >
            <userVisible v-on:childByValue="childByValue"  ref="userVisible"></userVisible>
        </el-dialog>
    </div>
</template>

<script scope>
    import { getUserComm, getDictItemByDictId, } from '../../api/building';
import { listCompAll } from '../../api/role';
import {insertAuditerCnf,deleteAuditerCnf,updateAuditerCnf,checkAuditerCnf,listAuditerCnf,listAuditerCnfNum} from '../../api/auditerCnf';
import userVisible from './userChoose';
    import commPage from '../common/commPage';
export default {
    name:"roomlistpage",
    props:{
        unitId:''
    },
    data() {
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
        let checktype = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入仪表类型"));
            }else{
                return callback();
            }
        }
        let checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请选择审核人"));
            }else{
                return callback();
            }
        }
        return {
            query: {
                id:'',
                compId:'',
                compName:'',
                commId:'',
                commName:'',
                userId:'',
                name:'',
                orderNo:'',
                type:'',
                remark:'',
                pageNo: 1,
                size: 10
            },
            modifiedAt:'',
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible:false,
            updateVisible:false,
            edit:false,
            pageTotal:0,
            disable:false,
            otherComp:false,
            userVisible:false,
            status:0,
            detail:false,
            compList:[],
            commList:[],
            typeList:[],//审核人类型
            form: {},
            list:'',
            idx: -1,
            title:'',
            id: -1,
            rules:{
                compId:[{
                    validator:checkcompId,required: true,trigger:'blur'
                }],
                commId:[{
                    validator:checkcommId,required: true,trigger:'blur'
                }],
                type:[{
                    validator:checktype,required: true,trigger:'blur'
                }],
                name:[{
                    validator:checkname,required: true,trigger:'blur'
                }]
            }
        };
    },
    created() {
        this.query.unitId = this.unitId
        this.getData();

    },
    components:{
        userVisible,
        commPage
     },
    methods: {
        userSearch(){
            console.log(this.form.compId+'------'+this.form.commId+'------'+this.form.type);
            if(this.form.compId!=''&&this.form.compId!=undefined&&this.form.commId!=''&&this.form.commId!=undefined&&this.form.type!=''&&this.form.type!=undefined){
                this.userDetail(this.form.compId,this.form.commId,this.form.type);
            }else{
                this.$message.info("请先选择物业公司、社区和仪表类型，再进行选择");
            }
        },
        userDetail(compId, commId,type){
            this.userVisible = true;
            debugger
            this.$nextTick(()=>{
                this.$refs.userVisible.dataInitializationByAuditerCnf(compId, commId);
            })
        },
        childByValue(list){
            debugger
            this.userVisible = false;
            this.$set(this.form, 'userId', list.id);
            this.$set(this.form, 'name', list.name);
            //需要验证重复根据社区、审核人类型、审核人进行验证
            checkAuditerCnf(this.form).then(res => {
                if(!res.data==""){
                    //提示审核人重复
                    this.$message.info(res.data);
                    this.$set(this.form, 'userId', '');
                    this.$set(this.form, 'name', '');
                }
            });
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
        select_status(val){
            this.$forceUpdate();
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            listCompAll(this.query).then(res => {
                // debugger
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
                listAuditerCnf(this.query).then(res => {
                    // debugger
                    console.log(this.query.unitId)
                    this.tableData = res.data;
                });
                listAuditerCnfNum(this.query).then(res => {
                    // debugger
                    this.pageTotal = res.data || 0;
                    console.log(this.pageTotal+"__+++__");
                });
            });
            getDictItemByDictId(55).then(res => {//55是审核人类型
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
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteAuditerCnf(id).then(res => {
                        if(res.data){
                            this.$message.success("删除成功");
                        }else{
                            this.$message.info("删除失败");
                        }
                        this.getData();
                    });
                })
                .catch(() => {});
        },
        handleAdd() {
            debugger
            this.form = {};
            this.editVisible = true;
            this.title="新增审核人";
            this.status = 0;
            this.disable=false;
            this.edit=false;
            this.$refs.form.clearValidate();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateVisible = true;
            this.disable=false;
            this.detail=false;
            this.status = 1;
            this.edit=true;
            this.title="编辑审核人";
            this.$refs.form.clearValidate();

        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.status = 2;
            this.detail=true;
            this.updateVisible = true;
            this.title="查看审核人";
        },
        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增审核人'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid) {

                        insertAuditerCnf(this.form).then(res => {
                            this.editVisible = false;
                            this.$message.success(`新增成功`);
                            this.getData();
                        });

                    }
                });
            }else {
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        //需要验证重复根据社区、审核人类型、审核人进行验证
                        console.log(this.form.userId);
                        console.log(this.form.name);
                        checkAuditerCnf(this.form).then(res => {
                            if(!res.data==""){
                                //提示审核人重复
                                this.$message.info(res.data);
                                //this.$set(this.form, 'userId', '');
                                //this.$set(this.form, 'name', '');
                            }else{
                                updateAuditerCnf(this.form).then(res => {
                                    this.updateVisible = false;
                                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                    this.$set(this.tableData, this.idx, this.form);
                                    this.getData();
                                });
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
