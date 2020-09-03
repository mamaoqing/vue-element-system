<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
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
                <el-input v-model="query.name" placeholder="角色名称" class="handle-input mr10"></el-input>
                <!--<el-input v-model="query.type" placeholder="角色类型" class="handle-input mr10"></el-input>-->

                <el-select v-model="query.type" placeholder="角色类型" >
                    <el-option key="qxz" label="请选择角色类型" value=""></el-option>
                    <el-option key="bbk" label="全局角色" value="全局角色"></el-option>
                    <el-option key="xtc" label="物业公司角色" value="物业公司角色"></el-option>
                </el-select>

                <!--<el-input v-model="query.compId" placeholder="物业公司名称" class="handle-input mr10"></el-input>-->
                <!--<el-form-item label="物业公司名称" prop="dictId">-->
                    <el-select v-model="query.compId" placeholder="物业公司名称" :disabled="edit">
                        <el-option key="qxz" label="请选择物业公司名称" value=""></el-option>
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                <!--</el-form-item>-->
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
                角色名称、角色类型、所属公司、状态、创建人、创建日期、修改人、修改日期
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="type" label="角色类型"></el-table-column>
                <el-table-column prop="compName" label="所属公司"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
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
                                icon="el-icon-lx-addressbook"
                                class="green"
                                @click.stop
                                @click="menuEdit(scope.row.id)"
                        >菜单权限</el-button>
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
                <template >
                    <el-form-item label="角色名称" prop="name" >
                        <el-input v-model="form.name" ></el-input>
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
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="updateVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules" :disabled="disable">
                <template >
                    <el-form-item label="角色名称" prop="name" >
                        <el-input v-model="form.name" ></el-input>
                    </el-form-item>
                    <el-form-item label="角色类型" prop="name" >
                        <el-input v-model="form.type" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属公司" prop="compName" >
                        <el-input v-model="form.compName" :disabled="true"></el-input>
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

                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="cmpVisible" append-to-body>
            <menu1 v-if="cmpVisible" ref="menu1"></menu1>
        </el-dialog>
    </div>
</template>

<script>
import { addRole,deleteRole,updateRole,listRole,checkRoleMenuUser,setUserRole,listRoleNum,listCompAll } from '../../api/role';
import menu1 from './menuTree';
import { listDictAll } from '../../api/dict';

export default {
    name: 'basetable',
    data() {
        let checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入角色名称"));
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
                type:'',
                compId:'',
                pageNo: 1,
                size: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            updateVisible:false,
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
                state:[{
                    validator:checkstate,required: true,trigger:'blur'
                }]
            }
        };

    },
    created() {
        this.getData();
        this.getDict();
    },
    components:{
        menu1
    }
    ,
    methods: {
        getData() {
            listRole(this.query).then(res => {
                debugger
                console.log(res);
                this.tableData = res.data;

            });
            listRoleNum(this.query).then(res => {
                this.pageTotal = res.data|| 0;
                console.log(this.pageTotal);
            });
        },
        getDict(){
            listCompAll(this.query).then(res => {
                this.typeList = res.data.records;
                console.log(this.typeList);
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
            console.log(id);

            checkRoleMenuUser(id).then(res => {
                //debugger
                //console.log(res);
                if(res.data==''){
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            deleteRole(id).then(res => {
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
                            deleteRole(id).then(res => {
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
            this.title="新增角色";
            this.disable=false;
            this.edit=false;
            this.form={state:'在用'};
            this.$refs.form.clearValidate();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateVisible = true;
            this.disable=false;
            this.edit=true;
            this.title="修改角色";
            this.$refs.form.clearValidate();
        },
        menuEdit(id){
            let linkID = id;
            this.cmpVisible = true;
            this.$nextTick(()=>{
                this.$refs.menu1.dataInitialization(linkID);
            })

        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看角色"

        },
        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增角色'){
                // this.editVisible = false;
                this.$refs[form].validate((valid)=>{

                    if(valid){
                        addRole(this.form).then(res => {
                            this.editVisible = false;
                            this.$message.success(`新增角色成功`);
                            this.getData()
                        });
                    }
                });

            }else {
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid){
                        updateRole(this.form).then(res => {
                            this.updateVisible = false;
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
