<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 字典列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>-->
                <el-input v-model="query.dictId" placeholder="字典类型" class="handle-input mr10"></el-input>
                <el-input v-model="query.name" placeholder="字典项名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="dictName" label="字典类型"></el-table-column>
                <el-table-column prop="name" label="字典项名称"></el-table-column>
                <el-table-column prop="compName" label="所属公司"></el-table-column>
                <el-table-column prop="orderBy" label="排序序号"></el-table-column>
                <el-table-column prop="createdName" label="创建人"></el-table-column>
                <el-table-column prop="createdAt" label="创建日期" ></el-table-column>
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

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules" :disabled="disable">
                <template >
                    <el-form-item label="字典类型" prop="dictId">
                        <el-select v-model="form.dictId" placeholder="请选择" :disabled="edit">
                            <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="字典项名称" prop="name" >
                        <el-input v-model="form.name" @blur="abc" :disabled="edit"></el-input>
                    </el-form-item>
                    <el-form-item label="排序序号" prop="orderBy">
                        <el-input v-model="form.orderBy"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { listDictItem,updateDictItem,deleteDictItem,addDictItem,checkDictItemName,findDictItemList } from '../../api/dictItem';
import { listDictAll } from '../../api/dict';

export default {
    name: 'basetable',
    data() {
        var checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入字典项名称"));
            }else{
                return callback();
            }
        }
        var checkDict = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请选择字典类型"));
            }else{
                return callback();
            }
        }
        var checkOrder = (rule,value,callback) =>{
            const age= /^[0-9]*$/;
            if(!value){
                return callback(new Error("请输入排序序号"));
            }else{
                if (!age.test(value)) {
                    return callback(new Error('排序序号只能为数字'))
                }else{
                    return callback();
                }
            }
        }
        return {
            query: {
                dictId:'',
                name:'',
                pageNo: 1,
                size: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            disable:false,
            edit:false,
            cmpVisible:false,
            form: {name:''},
            idx: -1,
            title:'',
            id: -1,
            typeList:[],
            rules:{
                name:[{
                    validator:checkname,required: true,trigger:'blur'
                }],
                dictId:[{
                    validator:checkDict,required: true,trigger:'blur'
                }],
                orderBy:[{
                    validator:checkOrder,required: true,trigger:'blur'
                }]
            }
        };

    },
    created() {
        this.getData();
        this.getDict();
    }/*,
    components:{
        companyLink
    }*/
    ,
    methods: {
        abc(){
            if(this.title==='新增'&&this.form.dictId!=undefined&&this.form.name!=undefined){
                checkDictItemName(this.form.dictId,this.form.name).then(res => {
                    if(res.data){
                        this.$message.error("字典项名称"+this.form.name+"重复，不可重复录入");
                        this.form.name='';
                    }
                });
            }
        },
        getDict(){
            listDictAll(this.query).then(res => {
                this.typeList = res.data;
            });
        },
        // 获取 easy-mock 的模拟数据
        /*getData() {
            listDictItem(this.query).then(res => {
                console.log(res);

                //this.tableData = res.data.records;
                this.pageTotal = res.data.total || 0;
            });
        },*/
        getData() {
            findDictItemList(this.query).then(res => {
                console.log(res);

                this.tableData = res.data;
                //this.pageTotal = res.data.total || 0;
            });
            listDictItem(this.query).then(res => {
                console.log(res);

                //this.tableData = res.data;
                this.pageTotal = res.data.length || 0;
            });
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(id) {
            console.log(id);
            localStorage.getItem("ms_comp_id");
            if(localStorage.getItem("ms_comp_id")==0){
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteDictItem(id).then(res => {
                            console.log(res);
                            this.$message.success('删除成功');
                            this.getData();
                        });
                    })
                    .catch(() => {});
            }else{
                this.$message.success('您没有权限，无法删除，请联系管理员');
            }

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
        handleAdd() {
            this.editVisible = true;
            this.title="新增";
            this.disable=false;
            this.edit=false;
            this.form={};
            this.$refs.form.clearValidate();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            this.disable=false;
            this.edit=true;
            this.title="修改";
            this.$refs.form.clearValidate();
        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.editVisible = true;
            this.title="查看"

        },
        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=> {
                    if (valid) {
                        addDictItem(this.form).then(res => {
                            this.$message.success(`新增成功`);
                            this.getData()
                        });
                    }
                });
            }else {
                //this.editVisible = false;
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        updateDictItem(this.form).then(res => {
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
</style>
