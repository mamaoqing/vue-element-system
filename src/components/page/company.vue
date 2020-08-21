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
                <el-input v-model="query.name" placeholder="公司名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.abbreviation" placeholder="公司简称" class="handle-input mr10"></el-input>

                <el-select v-model="provinceValue" @clear="clearProvince" clearable filterable placeholder="请选择省份"
                           @change="selectProvince(provinceValue)">
                    <el-option
                            v-for="item in province"
                            :key="item.provinceName"
                            :label="item.provinceName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <template v-if="city.length &gt; 0">
                    <el-select v-model="cityValue" @clear="clearCity" clearable filterable
                               placeholder="请选择市"
                               @change="selectCity(cityValue)">
                        <el-option
                                v-for="item in city"
                                :key="item.cityName"
                                :label="item.cityName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="district.length &gt; 0">
                    <el-select v-model="districtValue" @clear="clearDistrict" clearable filterable
                               placeholder="请选择县/区"
                               @change="selectDistrict(districtValue)">
                        <el-option
                                v-for="item in district"
                                :key="item.districtName"
                                :label="item.districtName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-top: 5px;">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" style="margin-top: 5px;">新增</el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="handleRefresh" style="margin-top: 5px;">重置</el-button>
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
                <el-table-column prop="name" label="公司名称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="abbreviation" label="公司简称" min-width="125" min-height="55" align="center"></el-table-column>
                <el-table-column prop="establishmentDate" label="成立日期" min-width="155" min-height="55" align="center"></el-table-column>
                <el-table-column prop="province" label="省" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="city" label="市" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="district" label="区" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="compAddr" label="公司地址" align="center" min-width="205" min-height="55"></el-table-column>
                <el-table-column prop="registeredAddr" label="注册地址" align="center" min-width="205" min-height="55"></el-table-column>
                <el-table-column prop="legal_person" label="法人" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="registeredCapital" label="注册资本" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="taxpayerIdentificationNo" label="纳税人识别号" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="registeredNo" label="工商注册号" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="compType" label="公司类型" align="center" min-width="55" min-height="55"></el-table-column>
                <el-table-column prop="tel" label="电话" align="center" min-width="110" min-height="55"></el-table-column>
                <el-table-column prop="eMail" label="邮箱" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="state" label="状态" align="center" min-width="55" min-height="55"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155" min-height="55"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center" min-width="75" min-height="55"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155" min-height="55"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button-group>
                                <el-button
                                        type="text"
                                        icon="el-icon-edit"
                                        @click.stop
                                        @click="handleEdit(scope.$index, scope.row)"
                                >编辑
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        class="red"
                                        @click.stop
                                        @click="handleDelete(scope.row.id)"
                                >删除
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-lx-addressbook"
                                        class="green"
                                        @click.stop
                                        @click="handleCompanyLink(scope.row.id)"
                                >联系人
                                </el-button>
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
        <el-dialog :title="title" :visible.sync="editVisible" width="55%" >
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable" :inline="true">
                <div >
                    <el-form-item label="id" v-show="false">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="公司名称" prop="name" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ]">
                        <el-input v-model="form.name" ></el-input>
                    </el-form-item>
                    <el-form-item label="公司简称" label-width="150px">
                        <el-input v-model="form.abbreviation"></el-input>
                    </el-form-item>
                    <el-form-item label="成立日期" prop="establishmentDate" label-width="150px"
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
                    <el-form-item label="公司地址" label-width="150px">
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

                    <el-form-item label="注册地址" prop="registeredAddr" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入注册地址', trigger: 'blur' },
                ]">
                        <el-input v-model="form.registeredAddr"></el-input>
                    </el-form-item>
                    <el-form-item label=" " prop="compAddr" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入公司地址', trigger: 'blur' },
                ]">

                        <el-input v-model="form.compAddr" prop="compAddr" placeholder="请输入详细公司地址"></el-input>
                    </el-form-item>
                    <el-form-item label="注册资本" prop="registeredCapital" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入注册地址', trigger: 'blur' },
                ]">
                        <el-input v-model="form.registeredCapital"></el-input>
                    </el-form-item>
                    <el-form-item label="法人" prop="legal_person" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入法人', trigger: 'blur' },
                ]">
                        <el-input v-model="form.legal_person"></el-input>
                    </el-form-item>
                    <el-form-item label="纳税人识别号" prop="taxpayerIdentificationNo" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
                ]">
                        <el-input v-model="form.taxpayerIdentificationNo"></el-input>
                    </el-form-item>
                    <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
                ]">
                        <el-input v-model="form.unifiedSocialCreditCode"></el-input>
                    </el-form-item>
                    <el-form-item label="工商注册号" prop="registeredNo" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入工商注册号', trigger: 'blur' },
                ]">
                        <el-input v-model="form.registeredNo"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="公司类型" prop="compType" label-width="150px"
                                  :rules="[
                    { required: true, message: '请选择公司类型', trigger: 'blur' },
                ]">
                        <el-input v-model="form.compType"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="state" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入公司状态', trigger: 'blur' },

                ]">
                        <el-input v-model="form.state"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" label-width="150px">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="tel" label-width="150px"
                                  :rules="[
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                ]"
                    >
                        <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="录入人" label-width="150px">
                        <el-input v-model="form.createdName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="录入时间" prop="establishmentDate" label-width="150px" disabled>
                        <el-date-picker
                                v-model="form.createdAt"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00"
                                disabled
                        />
                    </el-form-item>
                    <el-form-item label="修改人" label-width="150px">
                        <el-input v-model="form.modifiedName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="修改时间" prop="establishmentDate" label-width="150px" >
                        <el-date-picker
                                v-model="form.modifiedAt"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00"
                                disabled
                        />
                    </el-form-item>
                </div>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 联系人弹出框   -->
        <el-dialog :visible.sync="cmpVisible" append-to-body>
            <companyLink v-if="cmpVisible" ref="companyLink"></companyLink>
        </el-dialog>
    </div>
</template>

<script scoped>
    import { fetchData, updateData, deleteData, addData, getCityDict, getProvinces } from '../../api/index';
    import companyLink from './companyLink';
    import CitySelect from '../common/CitySelect';
    import { getCityList, getDistList } from '../../api/dist';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    name: '',
                    abbreviation: '',
                    province: '',
                    city: '',
                    district: '',
                    pageNo: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                provinceValue: "",
                cityValue: '',
                districtValue: '',
                disable: false,
                cmpVisible: false,
                form: {},
                idx: -1,
                title: '',
                province: [],
                city: [],
                district: [],
                partyOrganId: [],
                cascaderData: [],
                id: -1
            };
        },
        created() {
            this.getData();
            getProvinces(this.query).then(res => {this.province = res.data;});
            getCityDict(this.query).then(res => {
                this.cascaderData = res.data;
            });
        },
        components: {
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

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
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
            // 删除操作
            handleDelete(id) {
                console.log(id);
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
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCompanyLink(id) {
                let linkID = id;
                this.cmpVisible = true;
                this.$nextTick(() => {
                    this.$refs.companyLink.dataInitialization(linkID);
                });

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
            handleRefresh() {
                this.query={
                    pageNo: 1,
                    size: 10
                };
                this.getData();
            },
            handleAdd() {
                this.editVisible = true;
                this.title = '新增';
                this.form = {};
                this.partyOrganId = [];
                this.disable = false;
                // this.$set(this.form, 'createdName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'createdAt', new Date());
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = {};
                this.form = row;
                console.log(this.form)
                this.partyOrganId = [row.provinceId,row.cityId,row.districtId]
                console.log(this.partyOrganId)
                this.editVisible = true;
                this.disable = false;
                this.title = '修改';
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());

            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                this.title = '查看';

            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增') {
                    this.$refs['form'].validate(valid => {
                        if (valid){
                            this.$delete(this.form, 'createdName');
                            this.$delete(this.form, 'createdAt');
                            this.$delete(this.form, 'modifiedName');
                            this.$delete(this.form, 'modifiedAt');
                            this.editVisible = false;
                            addData(this.form).then(res => {
                                this.$message.success(`新增成功`);
                                this.getData();
                            });
                        }
                    });

                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid){

                            this.editVisible = false;
                            this.$delete(this.form, 'modifiedName');
                            this.$delete(this.form, 'modifiedAt');
                            updateData(this.form).then(res => {
                                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                this.$set(this.tableData, this.idx, this.form);
                            });
                        }
                    });
                }

            },
            selectProvince(value) {
                this.query.provinceId = value;
                getCityList({provinceId: value}).then(res => {
                    if (res.code === 0) {
                        this.city = res.data
                    }
                });

            },
            selectCity(value) {
                this.query.cityId = value;
                getDistList({cityId: value}).then(res => {
                    if (res.code === 0) {
                        this.district = res.data;
                    }
                });
            },
            selectDistrict(value) {
                this.query.districtId = value;
            },
            clearProvince() {
                this.query.provinceId = '';
                this.query.cityId = '';
                this.query.district = '';
                this.city = [];
                this.district = [];
            },
            clearCity() {
                this.query.cityId = '';
                this.query.district = '';
                this.district = [];
            },
            clearDistrict() {
                this.query.district = '';
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
        }
    };
</script>

<style>
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
