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
                <el-input v-model="query.name" placeholder="字典名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="name" label=字典></el-table-column>
                <el-table-column prop="state" label=状态></el-table-column>
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

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules" :disabled="disable">
                <!--<el-form-item label="id">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>-->
                <el-form-item label="字典名称" prop="name">
                    <el-input v-model="form.name" :disabled="edit" @blur="checkName"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="form.state" placeholder="请选择" :disabled="edit">
                        <el-option key="bbk" label="在用" value="在用" ></el-option>
                        <el-option key="xtc" label="不在用" value="不在用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <!--<el-form-item label="公司简称">
                    <el-input v-model="form.abbreviation"></el-input>
                </el-form-item>-->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="updateVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules" :disabled="disable">
                <!--<el-form-item label="id">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>-->
                <el-form-item label="字典名称" prop="name">
                    <el-input v-model="form.name" :disabled="edit" @blur="checkName"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="form.state" placeholder="请选择" :disabled="edit">
                        <el-option key="bbk" label="在用" value="在用" ></el-option>
                        <el-option key="xtc" label="不在用" value="不在用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <!--<el-form-item label="公司简称">
                    <el-input v-model="form.abbreviation"></el-input>
                </el-form-item>-->
                <el-form-item label="创建人" prop="createdName">
                    <el-input v-model="form.createdName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="创建日期" prop="createdAt">
                    <el-input v-model="form.createdAt" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改人" prop="modifiedName">
                    <el-input v-model="form.modifiedName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改日期" prop="modifiedAt">
                    <el-input v-model="form.modifiedAt" :disabled="true"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 联系人弹出框   -->
        <!--<el-dialog  :visible.sync="cmpVisible" append-to-body>
            <companyLink v-if="cmpVisible" ref="companyLink"></companyLink>
        </el-dialog>-->
    </div>
</template>

<script>
import { listDict,updateDict,deleteDict,addDict,checkDictName } from '../../api/dict';
import { checkDictItemName } from '../../api/dictItem';

export default {
    name: 'basetable',

    data() {
        let checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入字典名称"));
            }else{
                return callback();
            }
        }
        let checkstate = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请选择状态"));
            }else{
                return callback();
            }
        }
        return {
            query: {
                name:'',
                pageNo: 1,
                size: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            updateVisible:false,
            edit:false,
            pageTotal: 0,
            disable:false,
            cmpVisible:false,
            form: {},
            idx: -1,
            title:'',
            id: -1,
            rules:{
                name:[{
                    validator:checkname,required: true,trigger:'blur'
                }],
                state:[{
                    validator:checkstate,required: true,trigger:'blur'
                }]
            }
        };
    },
    created() {
        this.getData();
    }/*,
    components:{
        companyLink
    }*/
    ,
    methods: {
        checkName(){
            if(this.title==='新增'&&this.form.name!=undefined){
                //console.log(this.form.name);
                checkDictName(this.form.name).then(res => {
                    if(res.data){
                        this.$message.error("字典名称"+this.form.name+"重复，不可重复录入");
                        this.form.name='';
                    }
                });
            }
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            listDict(this.query).then(res => {
                //console.log(res);
                //debugger
                this.tableData = res.data.records;
                this.pageTotal = res.data.total || 0;
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
            console.log(id)
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteDict(id).then(res => {
                        //console.log(res);
                        this.$message.success('删除成功');
                        this.getData();
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /*handleCompanyLink(id){
            let linkID = id;
            this.cmpVisible = true;
            this.$nextTick(()=>{
                this.$refs.companyLink.dataInitialization(linkID);
            })

        },*/
        /*delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },*/
        handleAdd() {
            this.editVisible = true;
            this.title="新增字典";
            this.disable=false;
            this.edit=false;
            this.form={state:'在用'}
            this.$refs.form.clearValidate();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateVisible = true;
            this.disable=false;
            this.edit=true;
            this.title="编辑字典"
            this.$refs.form.clearValidate();
        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看字典"

        },
        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增字典'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        addDict(this.form).then(res => {
                            this.$message.success(`新增成功`);
                            this.editVisible = false;
                            this.getData()
                        });
                    }
                });
            }else {
                this.editVisible = false;
                updateDict(this.form).then(res => {
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.updateVisible = false;
                    this.$set(this.tableData, this.idx, this.form);
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
