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
                    <comp-util @comp="compValue"></comp-util>
                    <template v-if="showComm">
                        <comm-util @comm="commValue" :comp-ids="child.compId" :change="child.commChange"></comm-util>
                    </template>
                    <dist-util @child1="checkIn" :distId="dist.buildPropId" :distName="dist.buildPropName"
                               :title="dist.buildProp"></dist-util>
                    <dist-util @child1="checkIn" :distId="dist.usePropId" :distName="dist.usePropName"
                               :title="dist.useProp"></dist-util>
                    <dist-util @child1="checkIn" :distId="dist.occupyPropId" :distName="dist.occupyPropName"
                               :title="dist.occupyProp"></dist-util>
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
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="true"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="物业公司" align="center"></el-table-column>
                <el-table-column prop="commName" label="社区名称" align="center"></el-table-column>
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
    </div>
</template>

<script>
    // 引入下拉框组件
    import distUtil from "../common/distutil"
    import compUtil from '../common/comp'
    import commUtil from '../common/commutil'
    import areaUtil from "../common/areautil";
    import commPage from '../common/commPage';

    import {
        listPark,
        upload,
        exportExcel,
        listOwner,
    } from "../../api/asstes/parkingspace";

    export default {
        components: {
            distUtil, compUtil, commUtil, areaUtil, commPage
        },
        data() {
            return {
                changepark : [],
                header: {
                    'Authentication-Token': localStorage.getItem('token')
                },
                listOwner: [],
                deleteIds: [],
                parentuse: [],
                status:0,
                ownerVisible: false,
                addVisible: false,
                editVisible: false,
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
                query: {pageNo: 1, size: 50, className: 'com.estate.sdzy.asstes.entity.RParkingSpace', pageTotal: 0,},
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
                    nos:'',
                },
                pageTotal: 0,

            }
        },
        created() {
            this.init();
        },
        props:{
            shows : Boolean,
            change : Array,
        },
        watch:{
            shows : {
                immediate: true,
                handler: function (newVal) {
                }
            },
            change : {
                immediate: true,
                handler: function (newVal) {
                    this.changepark = newVal;
                }
            }
        },
        methods: {
            init(ids) {
                if(ids){
                    this.query.parkIds = ids;
                }
                listPark(this.query).then(res => {
                    this.parkData = res.data.records;
                    this.pageTotal = res.data.total;
                    this.query.pageTotal = res.data.total;
                });
            },
            search() {
                this.init();
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

            owner(id) {
                listOwner(id).then(res => {
                    this.listOwner = res.data;
                    this.ownerVisible = !this.ownerVisible;
                });
            },

            selectRow(selection, row) {
            },
            selectChange(selection) {
                console.log(123);
                this.deleteIds = [];
                this.parentuse = [];
                for (var i = 0; i < selection.length; i++) {
                    this.deleteIds.push(selection[i].id);
                    this.parentuse.push(selection[i].id)
                }

                this.$emit("park", this.parentuse);
            },
        }
    }
</script>
<style scoped>
    .show-par{
        display: block;
    }
</style>