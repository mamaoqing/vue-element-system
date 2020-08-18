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
                    <dist-util @child1="checkIn" :distId="dist.buildPropId" :distName="dist.buildPropName" :title="dist.buildProp"></dist-util>
                    <dist-util @child1="checkIn" :distId="dist.usePropId" :distName="dist.usePropName" :title="dist.useProp"></dist-util>
                    <dist-util @child1="checkIn" :distId="dist.occupyPropId" :distName="dist.occupyPropName" :title="dist.occupyProp"></dist-util>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="add">新增</el-button>
            </div>
            <el-table
                    :data="parkData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >

            </el-table>
        </div>
    </div>
</template>

<script>
    import distUtil from "../common/distutil"
    import compUtil from '../common/comp'
    import commUtil from '../common/commutil'
    export default {
        components: {
            distUtil,compUtil,commUtil
        },
        data (){
            return {
                addVisible:false,
                editVisible:false,
                showComm: false,
                child:{
                    compId:'',
                    commChange:'',
                },
                parkData:[],
                form:{},
                query:{},
                dist:{
                    buildProp:'请选择建筑属性',
                    buildPropName:'build',
                    buildPropId:'34',
                    useProp:'请选择使用属性',
                    usePropId:'35',
                    usePropName:'use',
                    carProp:'请选择车辆类型',
                    carPropId:'36',
                    carPropName:'car',
                    height:'请选择高度',
                    heightId:'38',
                    heightName:'height',
                    sizeProp:'请选择尺寸',
                    sizePropId:'37',
                    sizePropName:'size',
                    lineProp:'请选择排列形式',
                    linePropId:'39',
                    linePropName:'line',
                    timeProp:'请选择可用时间',
                    timePropId:'40',
                    timePropName:'time',
                    occupyProp:'请选择占用状态',
                    occupyPropId:'41',
                    occupyPropName:'occupy',
                    intoProp:'请选择入位方式',
                    intoPropId:'42',
                    intoPropName:'into',
                }
            }
        },
        created() {

        },
        methods:{
            init(){},
            search(){},
            add(){},
            checkIn(value,name){
                console.log(value+"<>"+name);
            },
            compValue(value){
                if(value){
                    this.showComm = true;
                }else{
                    this.showComm = false;
                }
                if(window.localStorage.getItem('commId')){
                    this.child.commChange = parseInt(window.localStorage.getItem('commId'));
                }
                this.child.compId = value;
                this.query.compId = value;
            },
            commValue(value){
              console.log(value);
              this.query.commId = value;
            },

        }
    }
</script>