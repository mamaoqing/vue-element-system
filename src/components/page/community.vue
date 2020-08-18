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
                    <el-select v-model="compValue" @clear="clearComp" clearable filterable placeholder="请选择物业公司"
                               @change="selectComp(compValue)">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-input clearable v-model="query.name" placeholder="请输入社区名"
                              style="width: 200px"></el-input>
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
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
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
        <el-dialog :title="title" :visible.sync="addVisible" width="60%">
            <el-form ref="addForm" :model="form" label-width="70px">
                <el-form-item label="公司名称" label-width="100px">
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

                <el-form-item label="用途类型" label-width="100px">
                    <child @child1="checkIn" :distId="useTypeDistId" :distName="useType"></child>
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
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="建造日期" label-width="100px">
                    <el-date-picker
                            v-model="form.buildedDate"
                            type="datetime"
                            format="yyyy-MM-dd"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交付日期" label-width="100px">
                    <el-date-picker
                            v-model="form.deliverDate"
                            type="datetime"
                            format="yyyy-MM-dd"
                            placeholder="选择日期时间">
                    </el-date-picker>
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
        <el-dialog :title="title" :visible.sync="editVisible" width="60%" :before-close="closeEdit">
            <el-form ref="editForm" :model="form" :disabled="disable" label-width="70px">
                <el-row>
                    <el-form-item label="服务类型" label-width="100px" v-show="false">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item label="公司名称" label-width="100px">
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
                </el-row>
                <el-row>
                    <el-form-item label="社区名" label-width="100px" prop="name"
                                  :rules="[
                    { required: true, message: '请输入社区名称', trigger: 'blur' },
                ]">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用途类型" label-width="100px">
                            <child @child1="checkIn" :distId="useTypeDistId" :distName="useType"
                                   :change="useTypeChange"></child>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态" label-width="100px">
                            <!--                    <el-input v-model="form.state"></el-input>-->
                            <child @child1="checkIn" :distId="commStateDistId" :distName="commState"
                                   :change="commStateChange"></child>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
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
                    </el-col>
                </el-row>
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
                    <el-input v-model="form.email"></el-input>
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
                <el-button @click="closeEdit">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="detailVisible" width="60%">
            <el-form ref="editForm" :model="form" :disabled="disable" label-width="70px">
                <el-form-item label="服务类型" label-width="100px" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" label-width="100px">
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
                    <el-input v-model="form.email"></el-input>
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
                <el-form-item label="修改人" label-width="100px">
                    <el-input v-model="form.modifiedName"></el-input>
                </el-form-item>
                <el-form-item label="修改时间" label-width="100px">
                    <el-input v-model="form.modifiedAt"></el-input>
                </el-form-item>
                <el-form-item label="创建人" label-width="100px">
                    <el-input v-model="form.createdName"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" label-width="100px">
                    <el-input v-model="form.createdAt"></el-input>
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
    import {listCommunity, addComm, updateComm, deleteComm} from '../../api/community'
    import {getComp} from "../../api/user";
    import {getCityDict, getProvinces} from "../../api/index";
    import {getCityList, getDistList} from "../../api/dist"
    import child from "./child"

    export default {
        components: {
            child
        },
        data() {
            return {
                commStateDistId: '20',
                commState: 'commState',
                commStateChange: '',
                useTypeChange: '',
                useType: 'usableType',
                useTypeDistId: '7',
                provinceValue: "",
                cityValue: '',
                districtValue: '',
                province: [],
                city: [],
                district: [],
                compValue: '',
                value: '',
                isAdmin: false,
                disable: false,
                cascaderData: [],
                partyOrganId: [],
                title: '',
                options: [],
                pageTotal: 0,
                editVisible: false,
                addVisible: false,
                detailVisible: false,
                compData: [],
                query: {
                    pageNo: 1,
                    size: 10,
                },
                form: {},

            };
        },
        created() {
            this.init();
            this.getComp();
            this.getProvince();
        },
        methods: {
            handleSearch() {
                this.init();
            },
            addComm() {
                this.addVisible = true;
                this.partyOrganId = [];
                this.form = {};
                this.title = "添加社区";
            },
            editComm(index, row) {
                this.form = {};
                this.disable = false;
                this.partyOrganId = [row.provinceId, row.cityId, row.districtId];
                this.editVisible = true;
                this.useTypeChange = row.usableTypeId;
                this.commStateChange = row.stateId;
                this.title = "修改社区";
                this.form = row;
                this.form.usableType = row.usableTypeId;
                this.form.state = row.stateId;
            },
            deleteComm(id) {
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
            init() {
                listCommunity(this.query).then(res => {
                    this.compData = res.data.records;
                    this.pageTotal = res.data.total;
                })
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            },
            clearComp() {
                this.query.compId = '';
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
            selectComp(value) {
                this.query.compId = value;
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
            submit() {
                if (this.title === '添加社区') {
                    this.$refs['addForm'].validate(valid => {
                        if (valid) {
                            addComm(this.form).then(res => {
                                this.$message.success(`新增成功`);
                                this.query.compId = '';
                                this.addVisible = false;
                                this.init();
                            });
                        }
                    });
                } else {
                    this.$refs['editForm'].validate(valid => {
                        if (valid) {
                            updateComm(this.form).then(res => {
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
                this.$set(this.form, 'compAddr', names[0] + names[1] + names[2]);
                this.$set(this.form, 'province', names[0]);
                this.$set(this.form, 'city', names[1]);
                this.$set(this.form, 'district', names[2]);
            },
            getProvince() {
                this.provinceList();
                getCityDict(this.query).then(res => {
                    this.cascaderData = res.data;
                });

            },
            provinceList() {
                getProvinces(this.query).then(res => {
                    this.province = res.data;
                });
            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.partyOrganId = [row.provinceId, row.cityId, row.districtId];
                this.disable = true;
                this.detailVisible = true;
                this.title = '查看';

            },
            checkIn(value, name) {
                if (name === 'usableType') {
                    this.form.usableType = value;
                }
                if (name === 'commState') {
                    this.form.state = value;
                }
            },
            closeEdit() {
                this.editVisible = false;
                this.init();
            }
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

    .el-form {
        overflow: hidden;
    }

    .el-form-item {
        width: 50%;
        float: left;
    }

    .el-table--small td {
        padding: 1px 0;
    }
</style>
