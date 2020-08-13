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
            </el-table>
        </div>
    </div>
</template>
<script>
    import {listCommunity} from '../../api/community.js'
    export default {
        data (){
            return{
                compData:[],
                query:{
                    pageNo:1,
                    size:10,
                }
            };
        },
        created() {
            this.init();
        },
        methods:{
            handleSearch(){
                this.init();
            },
            addComm(){

            },
            init(){
                listCommunity(this.query).then(res=>{
                    console.log(res.data.records);
                    this.compData = res.data.records;
                })
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