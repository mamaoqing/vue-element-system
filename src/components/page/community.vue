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
                <el-table-column prop="compName" label="公司名称" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        data (){
            return{
                compData:[],
                query:{}
            };
        },
        created() {
            this.init();
        },
        methods:{
            handleSearch(){

            },
            addComm(){

            },
            init(){

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