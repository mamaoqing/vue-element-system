<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 车位列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <dist-util @child1="checkIn" :distId="dist.buildPropId" :distName="dist.buildPropName"
                               :title="dist.buildProp"></dist-util>
                    <el-input v-model="query.no" placeholder="车位编号" class="handle-input mr10" ></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table
                    :data="parkData"
                    border
                    class="table"
                    @select="selectRow"
                    @selection-change="selectChange"
                    ref="multipleTable"
                    @row-click="chooseDetails"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="areaName" label="分区名称" align="center"></el-table-column>
                <el-table-column prop="no" label="编号" align="center"></el-table-column>
                <el-table-column prop="position" label="位置" align="center"></el-table-column>
                <el-table-column prop="buildingProperty" label="建筑属性" align="center"></el-table-column>
                <el-table-column prop="useProperty" label="使用属性" align="center"></el-table-column>
                <el-table-column prop="vehicleType" label="车辆类型" align="center"></el-table-column>
                <el-table-column prop="height" label="高度" align="center"></el-table-column>
                <el-table-column prop="size" label="尺寸" align="center"></el-table-column>
                <el-table-column prop="array" label="排列形式" align="center"></el-table-column>
                <el-table-column prop="usableTime" label="可用时间" align="center"></el-table-column>
                <el-table-column prop="occupyState" label="占用状态" align="center"></el-table-column>
                <el-table-column prop="inMode" label="入位方式" align="center"></el-table-column>
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
                                @click="openDetails(scope.$index, scope.row)">查看
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
        <el-dialog :title="title" :visible.sync="detailVisible" width="60%">
            <el-form ref="editForm" :model="form" label-width="70px" :disabled="true">
                <el-form-item label="公司名称" label-width="100px">
                    <el-input v-model="form.compName" disabled></el-input>
                </el-form-item>
                <el-form-item label="社区名称" label-width="100px">
                    <el-input v-model="form.commName" disabled></el-input>
                </el-form-item>
                <el-form-item label="分区名称" label-width="100px">
                    <el-input v-model="form.areaName" disabled></el-input>
                </el-form-item>
                <el-form-item label="编号" label-width="100px" prop="no"
                              :rules="[
                    { required: true, message: '请输入编号', trigger: 'blur' },
                ]">
                    <el-input v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="位置" label-width="100px" prop="no"
                              :rules="[
                    { required: true, message: '请输入位置', trigger: 'blur' },
                ]">
                    <el-input v-model="form.position"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="建筑类型" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.buildPropId" :distName="dist.buildPropName"
                                       :title="dist.buildProp" :change="form.buildingProperty"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用属性" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.usePropId" :distName="dist.usePropName"
                                       :title="dist.useProp" :change="form.useProperty"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆类型" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.carPropId" :distName="dist.carPropName"
                                       :title="dist.carProp" :change="form.vehicleType"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="高度" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.heightId" :distName="dist.heightName"
                                       :title="dist.height"
                                       :change="form.height"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="尺寸" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.sizePropId" :distName="dist.sizePropName"
                                       :title="dist.sizeProp" :change="form.size"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排列方式" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.linePropId" :distName="dist.linePropName"
                                       :title="dist.lineProp" :change="form.array"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="使用时间" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.timePropId" :distName="dist.timePropName"
                                       :title="dist.timeProp" :change="form.usableTime"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="重用状态" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.occupyPropId" :distName="dist.occupyPropName"
                                       :title="dist.occupyProp" :change="form.occupyState"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="入位方式" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.intoPropId" :distName="dist.intoPropName"
                                       :title="dist.intoProp" :change="form.inMode"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script scope>
    // 引入下拉框组件
    import distUtil from "../common/distutil"
    import compUtil from '../common/comp'
    import commUtil from '../common/commutil'
    import areaUtil from "../common/areautil";

    import {
        listPark,
        updatePark,
        insertPark,
        deletePark,
        upload,
        exportExcel,
        listOwner,
        deleteAllPark
    } from "../../api/asstes/parkingspace";
    import axios from 'axios'

    export default {
        components: {
            distUtil, compUtil, commUtil, areaUtil
        },
        data() {
            return {
                header: {
                    'Authentication-Token': localStorage.getItem('token')
                },
                listOwner: [],
                deleteIds: [],
                ownerVisible: false,
                detailVisible: false,
                showComm: false,
                inputVusible: false,
                title: '',
                child: {
                    compId: 0,
                    commChange: 0,
                    commId: 0,
                },
                parkData: [],
                options: [],
                form: {
                    child: {}
                },
                query: {pageNo: 1, size: 10,className: 'com.estate.sdzy.asstes.entity.RParkingSpace',pageTotal:0,},
                dist: {
                    buildProp: '请选择建筑属性',
                    buildPropName: 'build',
                    buildPropId: '34',
                    useProp: '请选择使用属性',
                    usePropId: '35',
                    usePropName: 'use',
                    carProp: '请选择车辆类型',
                    carPropId: '36',
                    carPropName: 'car',
                    height: '请选择高度',
                    heightId: '38',
                    heightName: 'height',
                    sizeProp: '请选择尺寸',
                    sizePropId: '37',
                    sizePropName: 'size',
                    lineProp: '请选择排列形式',
                    linePropId: '39',
                    linePropName: 'line',
                    timeProp: '请选择可用时间',
                    timePropId: '40',
                    timePropName: 'time',
                    occupyProp: '请选择占用状态',
                    occupyPropId: '41',
                    occupyPropName: 'occupy',
                    intoProp: '请选择入位方式',
                    intoPropId: '42',
                    intoPropName: 'into',
                },
                pageTotal: 0,

            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                listPark(this.query).then(res => {
                    this.parkData = res.data.records;
                    this.pageTotal = res.data.total;
                    this.query.pageTotal = res.data.total;
                })
            },
            search() {
                this.init();
            },
            submit() {
                if (!this.form.commAreaId) {
                    this.$message.error(`请选择社区分区！`);
                    return false;
                }
                if (!this.form.commId) {
                    this.$message.error(`请选择社区！`);
                    return false;
                }
                if (this.title === '修改车位信息') {
                    this.$refs['editForm'].validate(valid => {
                        if (valid) {
                            updatePark(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`修改成功`);
                                } else {
                                    this.$message.error(`修改失败！`);
                                }
                                this.editVisible = !this.editVisible;
                                this.init();
                            });
                        }
                    });
                } else {
                    this.$refs['addForm'].validate(valid => {
                        if (valid) {
                            insertPark(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`添加成功`);
                                } else {
                                    this.$message.success(`添加失败`);
                                }
                                this.addVisible = !this.addVisible;
                                this.init();
                            });
                        }
                    });
                }
            },
            checkIn(value, name) {
                /*buildProp,useProp,occupyProp*/
                if (name === 'build') {
                    this.query.buildProp = value;
                }
                if (name === 'use') {
                    this.query.useProp = value;
                }
                if (name === 'occupy') {
                    this.query.occupyProp = value;
                }
            },
            checkForm(value, name) {
                if (name === 'build') {
                    this.form.buildingProperty = value;
                }
                if (name === 'use') {
                    this.form.useProperty = value;
                }
                if (name === 'car') {
                    this.form.vehicleType = value;
                }
                if (name === 'height') {
                    this.form.height = value;
                }
                if (name === 'size') {
                    this.form.size = value;
                }
                if (name === 'line') {
                    this.form.array = value;
                }
                if (name === 'time') {
                    this.form.usableTime = value;
                }
                if (name === 'occupy') {
                    this.form.occupyState = value;
                }
                if (name === 'into') {
                    this.form.inMode = value;
                }
            },
            formCompValue(value) {
                if (value) {
                    this.form.compId = value;
                    this.child.compId = value;
                    this.form.commId = '';
                    this.child.commId = null;
                } else {
                    this.form.compId = null;
                    this.form.commId = 0;
                    this.child.compId = 0;
                }
            },
            formCommValue(value) {
                if (value) {
                    this.child.commId = parseInt(value);
                    this.form.commId = parseInt(value);
                } else {
                    this.child.commId = 0;
                    this.form.commId = 0;
                }
                this.form.commAreaId = '';
            },
            compValue(value) {
                if (value) {
                    this.showComm = true;
                } else {
                    this.showComm = false;
                }
                if (window.localStorage.getItem('commId')) {
                    this.child.commChange = parseInt(window.localStorage.getItem('commId'));
                    this.query.commId = parseInt(window.localStorage.getItem('commId'));
                }
                this.child.compId = value;
                this.query.compId = value;
            },
            commValue(value) {
                this.query.commId = value;
            },
            areaValue(value) {
                this.form.commAreaId = value;
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            openDetails (index, row) {
                this.form = row;
                this.disable=true;
                this.detailVisible = true;
                this.title="查看停车位"
            },
            chooseDetails(row) {
                this.form = row;
                this.sendData(this.form);
            },
            sendData(list) {
                console.log(list+"-------------------------------------------------");
                /* 通过 父组件的appendData方法,父组件可以取到 list 值,以此 来添加值!!!这个事件最好全是小写的..否则有各种各样的问题出现... */
                this.$emit('childByValueParking', list);
            },
            owner(id) {
                listOwner(id).then(res => {
                    this.listOwner = res.data;
                    this.ownerVisible = !this.ownerVisible;
                });
            },
            selectRow(selection, row) {
            },
            selectChange(selection) {
                this.deleteIds = [];
                for (var i = 0; i < selection.length; i++) {
                    this.deleteIds.push(selection[i].id);
                }
            },
            dataInitializationByMeter(compId,commId){
                this.query.compId = compId;
                this.query.commId = commId;
                this.meterDisable = false;
                this.getBuildings();
            }
        }
    }
</script>