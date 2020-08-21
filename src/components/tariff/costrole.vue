<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 物业费项目
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="add">新增</el-button>
            </div>
            <el-table
                    :data="itemData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >

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

        </el-dialog>
        <el-dialog :title="title" :visible.sync="editVisible" width="60%">

        </el-dialog>
    </div>
</template>

<script>
    import {listCostItem,insertCostItem,updateCostItem,deleteCostItem} from '../../api/tariff/costitem'
    export default {
        data() {
            return {
                itemData:[],
                form: {},
                query: {
                    pageNo: 1,
                    size: 10,
                },
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                listCostItem(this.query).then(res=>{
                    this.itemData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            edit(){},
            deleteItem(){},
            add() {
                this.addVisible = !this.addVisible;
            },
            search(){

            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
        }
    }
</script>