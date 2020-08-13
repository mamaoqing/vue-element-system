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
                <template>
                    <el-input clearable v-model="query.name" placeholder="请输入社区名"
                              style="width: 200px"></el-input>
                    <el-input clearable v-model="query.province" placeholder="请输入省份"
                              style="width: 200px"></el-input>
                    <el-input clearable v-model="query.city" placeholder="请输入市"
                              style="width: 200px"></el-input>
                    <el-input clearable v-model="query.district" placeholder="请输入县"
                              style="width: 200px"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addComm">新增</el-button>
            </div>
            <el-table
                    :data="compData"
                    border
                    class="table"
                    ref="multipleTable"
                    @row-click="openDetails"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="物业公司" align="center"></el-table-column>
                <el-table-column prop="name" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="serviceType" label="服务类型" align="center"></el-table-column>
                <el-table-column prop="usableType" label="用途类型" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
                <el-table-column prop="province" label="省" align="center"></el-table-column>
                <el-table-column prop="city" label="市" align="center"></el-table-column>
                <el-table-column prop="district" label="区/县" align="center"></el-table-column>
                <el-table-column prop="detailedAddress" label="地址" align="center"></el-table-column>
                <el-table-column prop="longitude" label="经度" align="center"></el-table-column>
                <el-table-column prop="latitude" label="纬度" align="center"></el-table-column>
                <el-table-column prop="mapAddress" label="地图地址" align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" align="center"></el-table-column>
                <el-table-column prop="eMail" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="createdName" label="录入人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="录入时间" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center"></el-table-column>
                <el-table-column label="操作" width="" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="editComm(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                @click.stop
                                @click="deleteComm(scope.row.id)">删除
                        </el-button>
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
        <el-dialog :title="title" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="form" label-width="70px">
                <el-form-item label="公司名称"  label-width="100px" >
                    <template>
                        <el-select v-model="form.compId" filterable placeholder="请选择"
                                   @change="selectComp1(form.compId)" clearable>
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="社区名" label-width="100px" prop="name"
                              :rules="[
                    { required: true, message: '请输入社区名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="服务类型" label-width="100px">
                    <el-input v-model="form.serviceType"></el-input>
                </el-form-item>
                <el-form-item label="用途类型" label-width="100px">
                    <el-input v-model="form.usableType"></el-input>
                </el-form-item>
                <el-form-item label="状态" label-width="100px">
                    <el-input v-model="form.state"></el-input>
                </el-form-item>
                <el-form-item label="地址" label-width="100px">
                    <el-cascader
                            v-model="partyOrganId"
                            ref="cascaderAddr"
                            :props="{
                                    value: 'id',
                                    label: 'name',
                                    children: 'childList'
                                  }"
                            :options="cascaderData"
                            placeholder="请选择省市区"
                            @change="handleChange"
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="详细地址" label-width="100px">
                    <el-input v-model="form.detailedAddress"></el-input>
                </el-form-item>
                <el-form-item label="经度" label-width="100px">
                    <el-input v-model="form.latitude"></el-input>
                </el-form-item>
                <el-form-item label="纬度" label-width="100px">
                    <el-input v-model="form.longitude"></el-input>
                </el-form-item>
                <el-form-item label="地图地址" label-width="100px">
                    <el-input v-model="form.mapAddress"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="100px">
                    <el-input v-model="form.eMail"></el-input>
                </el-form-item>
                <el-form-item label="建造日期" label-width="100px">
                    <el-input v-model="form.buildedDate"></el-input>
                </el-form-item>
                <el-form-item label="交付日期" label-width="100px">
                    <el-input v-model="form.deliverDate"></el-input>
                </el-form-item>
                <el-form-item label="社区简介" label-width="100px">
                    <el-input v-model="form.introduction"></el-input>
                </el-form-item>
                <el-form-item label="社区图标" label-width="100px">
                    <el-input v-model="form.iconPath"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="form" :disabled="disable" label-width="70px">
                <el-form-item label="服务类型" label-width="100px" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="公司名称"  label-width="100px" >
                    <template>
                        <el-select v-model="form.compId" filterable placeholder="请选择"
                                   @change="selectComp1(form.compId)" clearable disabled>
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="社区名" label-width="100px" prop="name"
                              :rules="[
                    { required: true, message: '请输入社区名称', trigger: 'blur' },
                ]">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="服务类型" label-width="100px">
                    <el-input v-model="form.serviceType"></el-input>
                </el-form-item>
                <el-form-item label="用途类型" label-width="100px">
                    <el-input v-model="form.usableType"></el-input>
                </el-form-item>
                <el-form-item label="状态" label-width="100px">
                    <el-input v-model="form.state"></el-input>
                </el-form-item>
                <el-form-item label="省" label-width="100px">
                    <el-cascader
                            v-model="partyOrganId"
                            ref="cascaderAddr"
                            :props="{
                                    value: 'id',
                                    label: 'name',
                                    children: 'childList'
                                  }"
                            :options="cascaderData"
                            placeholder="请选择省市区"
                            @change="handleChange"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" label-width="100px">
                    <el-input v-model="form.detailedAddress"></el-input>
                </el-form-item>
                <el-form-item label="经度" label-width="100px">
                    <el-input v-model="form.latitude"></el-input>
                </el-form-item>
                <el-form-item label="纬度" label-width="100px">
                    <el-input v-model="form.longitude"></el-input>
                </el-form-item>
                <el-form-item label="地图地址" label-width="100px">
                    <el-input v-model="form.mapAddress"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="100px">
                    <el-input v-model="form.eMail"></el-input>
                </el-form-item>
                <el-form-item label="建造日期" label-width="100px">
                    <el-input v-model="form.buildedDate"></el-input>
                </el-form-item>
                <el-form-item label="交付日期" label-width="100px">
                    <el-input v-model="form.deliverDate"></el-input>
                </el-form-item>
                <el-form-item label="社区简介" label-width="100px">
                    <el-input v-model="form.introduction"></el-input>
                </el-form-item>
                <el-form-item label="社区图标" label-width="100px">
                    <el-input v-model="form.iconPath"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {listCommunity,addComm,updateComm,deleteComm} from '../../api/community'
    import {deleteUser, getComp} from "../../api/user";
    import {getCityDict} from "../../api/index";
    export default {
        data (){
            return{
                disable:false,
                cascaderData:[],
                partyOrganId:[],
                title:'',
                options:[],
                pageTotal:'',
                editVisible :false,
                addVisible:false,
                compData:[],
                query:{
                    pageNo:1,
                    size:10,
                },
                form:{},

            };
        },
        created() {
            this.init();
            this.getComp();
            this.getProvince();
        },
        methods:{
            handleSearch(){
                this.init();
            },
            addComm(){
                this.form = {};
                this.addVisible = true;
                this.title = "添加社区";
            },
            editComm(index,row){
                this.disable = false;
                this.partyOrganId[0] = this.form.provinceId;
                this.partyOrganId[1] = this.form.cityId;
                this.partyOrganId[2] = this.form.districtId;
                this.editVisible = true;
                this.title = "修改社区";
                this.form = row;
            },
            deleteComm(id){
                this.$confirm('删除后，社区下的分区，角色数据权限都会删除。确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteComm(id).then(res => {
                            this.$message.success('删除成功');
                            this.init();
                        });
                    })
                    .catch(() => {
                    });
            },
            init(){
                listCommunity(this.query).then(res=>{
                    this.compData = res.data.records;
                })
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            },
            submit(){
                if(this.title === '添加社区'){
                    this.$refs['addForm'].validate(valid => {
                        if(valid) {
                            addComm(this.form).then(res=>{
                                console.log(res);
                                this.$message.success(`新增成功`);
                                this.addVisible = false;
                                this.init();
                            });
                        }
                    });
                }else{
                    this.$refs['editForm'].validate(valid => {
                        if(valid) {
                            updateComm(this.form).then(res=>{
                                console.log(res);
                                this.$message.success(`修改成功`);
                                this.editVisible = false;
                                this.init();
                            });
                        }
                    });
                }
            },
            selectComp1(value) {
                this.query.compId = value;
            },
            getComp() {
                getComp().then(res => {
                    this.options = res.data;
                });
            },
            handleChange(val) {
                //将省份名称设置到表单里
                let names = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels;
                this.$set(this.form, 'provinceId', val[0]);
                this.$set(this.form, 'cityId', val[1]);
                this.$set(this.form, 'districtId', val[2]);
                this.$set(this.form, 'compAddr', names[0]+names[1]+names[2]);
                this.$set(this.form, 'province', names[0]);
                this.$set(this.form, 'city', names[1]);
                this.$set(this.form, 'district', names[2]);
            },
            getProvince(){
                getCityDict(this.query).then(res => {
                    this.cascaderData = res.data;
                });
            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                this.title = '查看';

            },
        }
    }
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