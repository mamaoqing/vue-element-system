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
                    <el-input clearable v-model="query.menuName" placeholder="请输入姓名"
                              style="width: 200px"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add">新增</el-button>
            </div>
            <el-table
                    :data="menuData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" ></el-table-column>
                <el-table-column prop="name" label="菜单名"  align="center" ></el-table-column>
                <el-table-column prop="url" label="菜单连接"  align="center" ></el-table-column>
                <el-table-column prop="type" label="类型"  align="center" ></el-table-column>
                <el-table-column prop="icon" label="图标"  align="center" ></el-table-column>
                <el-table-column prop="state" label="状态"  align="center" ></el-table-column>
                <el-table-column prop="createAt" label="创建时间"  align="center"></el-table-column>
                <el-table-column prop="createName" label="创建人"  align="center" ></el-table-column>
                <el-table-column prop="modifiedAt" label="更新时间"  align="center" ></el-table-column>
                <el-table-column prop="modifiedName" label="更新人" align="center" ></el-table-column>
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
    import {getMenuList} from '../../api/menuList'

    export default {
        data() {
            return {
                pageTotal: '',
                menuData: [],
                query: {
                    pageNo:'1',
                    size:'10',
                    menuName:''
                }
            };
        },
        created() {
            this.init();
        },
        methods: {
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            init() {
                getMenuList(this.query).then(res => {
                    console.log(res);
                    // this.menuData = res.data.records;
                    this.pageTotal = res.data.total || 0;
                    console.log(this.menuData);
                });
            },
            handleSearch() {
                this.$set(this.query, 'pageNo', 1);
                this.init();
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