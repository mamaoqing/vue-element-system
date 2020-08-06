<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 公司列表
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
                <!--<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-input v-model="query.name" placeholder="公司名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.abbreviation" placeholder="公司简称" class="handle-input mr10"></el-input>
<!--                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>-->
                <CitySelect @addlist="getCity" :addList="addList"></CitySelect>
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
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="name" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="abbreviation" label="公司简称" align="center"></el-table-column>
                <el-table-column prop="establishmentDate" label="成立日期" align="center"></el-table-column>
                <el-table-column prop="compAddr" label="公司地址" align="center"></el-table-column>
                <el-table-column prop="registeredAddr" label="注册地址" align="center"></el-table-column>
                <el-table-column prop="legal_person" label="法人" align="center"></el-table-column>
                <el-table-column prop="registeredCapital" label="注册资本" align="center"></el-table-column>
                <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" align="center"></el-table-column>
                <el-table-column prop="taxpayerIdentificationNo" label="纳税人识别号" align="center"></el-table-column>
                <el-table-column prop="registeredNo" label="工商注册号" align="center"></el-table-column>
                <el-table-column prop="compType" label="公司类型" align="center"></el-table-column>
                <el-table-column prop="compType" label="电话" align="center"></el-table-column>
                <el-table-column prop="tel" label="公司类型" align="center"></el-table-column>
                <el-table-column prop="eMail" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button-group>

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
                                <el-button
                                        type="text"
                                        icon="el-icon-lx-addressbook"
                                        class="green"
                                        @click.stop
                                        @click="handleCompanyLink(scope.row.id)"
                                >联系人</el-button>
                            </el-button-group>
                        </el-row>
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
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable">
                <el-form-item label="id" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="name"
                              :rules="[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="公司简称">
                    <el-input v-model="form.abbreviation"></el-input>
                </el-form-item>
                <el-form-item label="成立日期" prop="establishmentDate"
                              :rules="[
                    { required: true, message: '请选择成立日期', trigger: 'blur' },
                ]">
                    <el-date-picker
                            v-model="form.establishmentDate"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                    />
                </el-form-item>
                <el-form-item label="公司地址" prop="compAddr"
                              :rules="[
                    { required: true, message: '请输入公司地址', trigger: 'blur' },
                ]">
                    <el-input v-model="form.compAddr"></el-input>
                </el-form-item>
                <el-form-item label="注册地址" prop="registeredAddr"
                              :rules="[
                    { required: true, message: '请输入注册地址', trigger: 'blur' },
                ]">
                    <el-input v-model="form.registeredAddr"></el-input>
                </el-form-item>
                <el-form-item label="注册资本" prop="registeredAddr"
                              :rules="[
                    { required: true, message: '请输入注册地址', trigger: 'blur' },
                ]">
                    <el-input v-model="form.registeredCapital"></el-input>
                </el-form-item>
                <el-form-item label="法人" prop="registeredAddr"
                              :rules="[
                    { required: true, message: '请输入法人', trigger: 'blur' },
                ]">
                    <el-input v-model="form.legal_person"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号" prop="taxpayerIdentificationNo"
                              :rules="[
                    { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.registeredCapital"></el-input>
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode"
                              :rules="[
                    { required: true, message: '请输入工商注册号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.unifiedSocialCreditCode"></el-input>
                </el-form-item>
                <el-form-item label="工商注册号" prop="registeredNo"
                              :rules="{
                        required: true, message: '工商注册号', trigger: 'blur' }">
                    <el-input :model="form.registeredNo"></el-input>
                </el-form-item>
                <el-form-item label="公司类型" prop="compType"
                              :rules="[
                    { required: true, message: '请选择公司类型', trigger: 'blur' },
                ]">
                    <el-input v-model="form.compType"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state"
                              :rules="[
                    { required: true, message: '请输入公司状态', trigger: 'blur' },

                ]">
                    <el-input v-model="form.state"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel"
                              :rules="[
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                ]"
                >
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 联系人弹出框   -->
        <el-dialog  :visible.sync="cmpVisible" append-to-body>
            <companyLink v-if="cmpVisible" ref="companyLink"></companyLink>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData,updateData,deleteData,addData,getCityDict } from '../../api/index';
import companyLink from './companyLink';
import CitySelect from '../common/CitySelect';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name:'',
                abbreviation:'',
                pageNo: 1,
                size: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            disable:false,
            cmpVisible:false,
            form: {},
            idx: -1,
            title:'',
            addList: {
                province: "",
                city: "",
                area: ""
            },
            id: -1
        };
    },
    created() {
        this.getData();
    },
    components:{
        companyLink,
        CitySelect
    }
    ,
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.data.records;
                this.pageTotal = res.data.total || 0;
            });
        },
        //从子组件获取省市区
        getCity(data) {
            this.addList.province = data.province;
            this.addList.city = data.city;
            this.addList.area = data.area;
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
                    deleteData(id).then(res => {
                        console.log(res);
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
        handleCompanyLink(id){
            let linkID = id;
            this.cmpVisible = true;
            this.$nextTick(()=>{
                this.$refs.companyLink.dataInitialization(linkID);
            })

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
            this.title="新增"
            this.form = {}
            this.disable=false;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            this.disable=false;
            this.title="修改"
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
        saveEditOrAdd(title) {

            if(title==='新增'){
                this.$refs['form'].validate(valid => {
                    this.editVisible = false;
                    addData(this.form).then(res => {
                        this.$message.success(`新增成功`);
                        this.getData()
                    });
                });

            }else {
                this.$refs['form'].validate(valid => {
                    this.editVisible = false;
                    updateData(this.form).then(res => {
                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                        this.$set(this.tableData, this.idx, this.form);
                    });
                });
            }

        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
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
