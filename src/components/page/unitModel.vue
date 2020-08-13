<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 单元型号列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
                <el-table-column prop="roomNum" label="房间数"></el-table-column>
                <el-table-column prop="elevatorNum" label="电梯数"></el-table-column>
                <el-table-column prop="orderBy" label="序号"></el-table-column>
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
                    :current-page="1"
                    :page-size="pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules" :disabled="disable">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="房间数" prop="roomNum">
                    <el-input v-model="form.roomNum"  ></el-input>
                </el-form-item>
                <el-form-item label="电梯数" prop="elevatorNum">
                    <el-input v-model="form.elevatorNum"  ></el-input>
                </el-form-item>
                <el-form-item label="序号" prop="orderBy">
                    <el-input v-model="form.orderBy"  ></el-input>
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
        <el-dialog :title="title" :visible.sync="updateVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules" :disabled="disable">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="房间数" prop="roomNum">
                    <el-input v-model="form.roomNum"  ></el-input>
                </el-form-item>
                <el-form-item label="电梯数" prop="elevatorNum">
                    <el-input v-model="form.elevatorNum"  ></el-input>
                </el-form-item>
                <el-form-item label="序号" prop="orderBy">
                    <el-input v-model="form.orderBy"  ></el-input>
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { listUnitModel,updateUnitModel,deleteUnitModel,addUnitModel } from '../../api/unitModel';

export default {
    data() {
        let checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入名称"));
            }else{
                return callback();
            }
        }
        let checkroomNum = (rule,value,callback) =>{
            const num= /^[0-9]*$/;
            if(!value){
                return callback(new Error("请输入房间数"));
            }else{
                if (!num.test(value)) {
                    return callback(new Error('房间数只能为数字'))
                }else{
                    return callback();
                }
            }
        }
        let checkelevatorNum = (rule,value,callback) =>{
            const num= /^[0-9]*$/;
            if(!value){
                return callback(new Error("请输入电梯数"));
            }else{
                if (!num.test(value)) {
                    return callback(new Error('电梯数只能为数字'))
                }else{
                    return callback();
                }
            }
        }
        let checkorderBy = (rule,value,callback) =>{
            const num= /^[0-9]*$/;
            if(!value){
                return callback(new Error("请输入序号"));
            }else{
                if (!num.test(value)) {
                    return callback(new Error('序号只能为数字'))
                }else{
                    return callback();
                }
            }
        }
        return {
            query: {
                name:''
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            updateVisible:false;
            edit:false,
            pageSize:0,
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
                roomNum:[{
                    validator:checkroomNum,required: true,trigger:'blur'
                }],
                elevatorNum:[{
                    validator:checkelevatorNum,required: true,trigger:'blur'
                }],
                orderBy:[{
                    validator:checkorderBy,required: true,trigger:'blur'
                }]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            listUnitModel(this.query).then(res => {
                //console.log(res);
                this.pageSize=res.data.length || 0;
                //console.log(this.pageSize);
                this.tableData = res.data;
                this.pageTotal = res.data.length || 0;
                //console.log(this.pageTotal);
            });
        },

        // 触发搜索按钮
        handleSearch() {
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
                    deleteUnitModel(id).then(res => {
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
        handleAdd() {
            this.editVisible = true;
            this.title="新增单元型号";
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
            this.title="修改单元型号"
            this.$refs.form.clearValidate();
        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.updateVisible = true;
            this.title="查看单元型号"

        },
        // 保存编辑
        saveEditOrAdd(title,form) {
            if(title==='新增单元型号'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        addUnitModel(this.form).then(res => {
                            this.editVisible = false;
                            this.$message.success(`新增成功`);
                            this.getData();
                        });
                    }
                });
            }else {
                this.updateVisible = false;
                updateUnitModel(this.form).then(res => {
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
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
