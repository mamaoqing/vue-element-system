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
                    <child @child1="checkInQuery" :distId="useTypeDistId" :distName="useType"
                           :change="useTypeChange"></child>
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
                <el-table-column label="操作" width="250" align="center">
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
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="listUsers(scope.row.id)">下属用户
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="areaComm(scope.row.id)">协议
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
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="公司名称" label-width="100px" prop="compId"
                                      :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                            <template>
                                <el-select v-model="form.compId" style="width: 250px" filterable placeholder="请选择"
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
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="社区名" label-width="100px" prop="name"
                                      :rules="[
                    { required: true, message: '请输入社区名称', trigger: 'blur' },
                ]">
                            <el-input v-model="form.name" style="width: 250px"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="用途类型" label-width="100px">
                            <child style="width: 250px" @child1="checkInForm" :distId="useTypeDistId"
                                   :distName="useType"></child>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="状态" label-width="100px">
                            <child @child1="checkInForm" style="width: 250px" :distId="commStateDistId"
                                   :distName="commState"></child>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="经度" label-width="100px">
                            <el-input v-model="form.latitude" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="纬度" label-width="100px">
                            <el-input v-model="form.longitude" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="建造日期" label-width="100px">
                            <el-date-picker
                                    v-model="form.buildedDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    style="width: 250px"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="交付日期" label-width="100px">
                            <el-date-picker
                                    v-model="form.deliverDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    style="width: 250px"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="电话" label-width="100px">
                            <el-input v-model="form.tel" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" label-width="100px">
                            <el-input v-model="form.email" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
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
                                    style="width: 250px"
                                    @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="详细地址" label-width="100px">
                            <el-input v-model="form.detailedAddress" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="社区图标" label-width="100px">
                            <el-input v-model="form.iconPath" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="地图地址" label-width="100px">
                            <el-input v-model="form.mapAddress" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="社区简介" label-width="100px">
                            <el-input v-model="form.introduction" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="100px">
                            <el-input v-model="form.remark" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div style="border-top: solid 1px #ccc;width: 100%;height: 1px;margin-bottom: 15px;"></div>
                <commPage :form="form" :status="status" :editVisible="addVisible"></commPage>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="editVisible" width="60%" :before-close="closeEdit">
            <el-form ref="editForm" :model="form" style="text-align: center" label-width="70px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司名称" label-width="100px" prop="compId"
                                      :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                            <template>
                                <el-select v-model="form.compId" style="width: 250px" filterable placeholder="请选择"
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
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="社区名" label-width="100px" prop="name"
                                      :rules="[
                    { required: true, message: '请输入社区名称', trigger: 'blur' },
                ]">
                            <el-input v-model="form.name" style="width: 250px"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用途类型" label-width="100px">
                            <child style="width: 250px" @child1="checkInForm" :distId="useTypeDistId"
                                   :distName="useType" :change="useTypeChange"></child>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="状态" label-width="100px">
                            <child @child1="checkInForm" style="width: 250px" :distId="commStateDistId"
                                   :distName="commState" :change="commStateChange"></child>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="经度" label-width="100px">
                            <el-input v-model="form.latitude" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="纬度" label-width="100px">
                            <el-input v-model="form.longitude" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="建造日期" label-width="100px">
                            <el-date-picker
                                    v-model="form.buildedDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    style="width: 250px"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="交付日期" label-width="100px">
                            <el-date-picker
                                    v-model="form.deliverDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    style="width: 250px"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注" label-width="100px">
                            <el-input v-model="form.remark" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
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
                                    style="width: 250px"
                                    @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="详细地址" label-width="100px">
                            <el-input v-model="form.detailedAddress" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="社区图标" label-width="100px">
                            <el-input v-model="form.iconPath" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="地图地址" label-width="100px">
                            <el-input v-model="form.mapAddress" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="电话" label-width="100px">
                            <el-input v-model="form.tel" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" label-width="100px">
                            <el-input v-model="form.email" style="width: 450px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="社区简介" label-width="100px">
                            <el-input v-model="form.introduction"></el-input>
                            <!--                    <quill-editor ref="myTextEditor" v-model="form.introduction" :options="editorOption"></quill-editor>-->
                        </el-form-item>
                    </el-col>
                </el-row>


                <div style="border-top: solid 1px #ccc;width: 100%;height: 1px;margin-bottom: 15px;"></div>
                <commPage :form="form" :status="status" :editVisible="addVisible"></commPage>
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
                <el-button @click="detailVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="userVisible" width="30%">
            <el-table
                    :data="listUser"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="compName" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="areaName" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="orgName" label="所属机构" align="center"></el-table-column>
                <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="type" label="用户类型" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userVisible = false">确  定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="areaVisible" width="60%">
            <el-table
                    :data="listArea"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="compName" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="areaName" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
                <el-table-column prop="no" label="协议编号" align="center"></el-table-column>
                <el-table-column prop="begin_date" label="协议开始时间" align="center"></el-table-column>
                <el-table-column prop="end_date" label="协议结束时间" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="areaVisible = false">确  定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {listCommunity, addComm, updateComm, deleteComm, getListUser, getListArea} from '../../api/community'
    import {getComp} from "../../api/user";
    import {getCityDict, getProvinces} from "../../api/index";
    import {getCityList, getDistList} from "../../api/dist"
    import child from "./child"
    import commPage from '../common/commPage';
    import {quillEditor} from 'vue-quill-editor';

    export default {
        components: {
            child, commPage, quillEditor
        },
        data() {
            return {
                editorOption: {placeholder: 'Hello World'},
                status: 0,
                userVisible: false,
                areaVisible: false,
                listUser: [],
                listArea: [],
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
                this.status=0;
                this.addVisible = true;
                this.partyOrganId = [];
                this.form = {};
                this.title = "添加社区";
            },
            editComm(index, row) {
                this.status = 1;
                this.useTypeChange = '';
                this.commStateChange = '';
                this.form = {};
                this.disable = false;
                this.partyOrganId = [row.provinceId, row.cityId, row.districtId];
                this.editVisible = true;
                this.useTypeChange = row.usableType;
                this.commStateChange = row.state;
                this.title = "修改社区";
                this.form = row;
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
                console.log(value + "<---->" + name);
                if (name === 'usableType') {
                    this.form.usableType = value;
                }
                if (name === 'commState') {
                    this.form.state = value;
                }
            }, checkInForm(value, name) {
                if (name === 'usableType') {
                    this.form.usableType = value;
                }
                if (name === 'commState') {
                    this.form.state = value;
                }
            },
            checkInQuery(value, name) {
                this.query.usableType = value;
            },
            closeEdit() {
                this.editVisible = false;
                this.init();
            },
            listUsers(id) {
                this.userVisible = true;
                this.title = '下属用户';
                getListUser(id).then(res => {
                    this.listUser = res.data;
                });
            },
            areaComm(id) {
                this.areaVisible = true;
                this.title = '社区协议';
                getListArea(id).then(res => {
                    this.listArea = res.data;
                });
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

    .editor-btn {
        margin-top: 20px;
    }

</style>
