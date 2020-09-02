<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 房间业主
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="propId" label="propId" min-width="90" min-height="55" v-if="false"
                                 align="center"></el-table-column>
                <el-table-column prop="propTypes" label="关系" min-width="90" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="ownerType" label="业主类型" min-width="90" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="name" label="业主名称" min-width="90" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="ownerAddr" label="业主地址" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certType" label="证件类型" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certNumber" label="证件号码" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="industry" label="行业" min-width="75" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" min-width="75" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="nativePlace" label="籍贯" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="education" label="学历" min-width="75" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="state" label="状态" min-width="55" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="linkName" label="联系人" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="linkTel" label="联系电话" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="linkAddr" label="联系人地址" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center" min-width="75"
                                 min-height="55"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"
                                 min-height="55"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center" min-width="75"
                                 min-height="55"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"
                                 min-height="55"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click.stop
                                @click="handleDelete(scope.row.propId)"
                        >移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog  :visible.sync="cmpVisible" append-to-body>
            <div class="container">
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-cascades"></i> 点击选择业主
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-table
                        :data="tableData2"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @row-click="test"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                    <el-table-column prop="ownerType" label="业主类型" min-width="90" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="propId" label="propId" min-width="90" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="name" label="业主名称" min-width="90" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="ownerAddr" label="业主地址" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="tel" label="电话" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="email" label="邮箱" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="certType" label="证件类型" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="certNumber" label="证件号码" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="industry" label="行业" min-width="75" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="sex" label="性别" min-width="75" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="nativePlace" label="籍贯" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="education" label="学历" min-width="75" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="state" label="状态" min-width="55" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="linkName" label="联系人" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="linkTel" label="联系电话" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="linkAddr" label="联系人地址" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="createdName" label="创建人" align="center" min-width="75"
                                     min-height="55"></el-table-column>
                    <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"
                                     min-height="55"></el-table-column>
                    <el-table-column prop="modifiedName" label="修改人" align="center" min-width="75"
                                     min-height="55"></el-table-column>
                    <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"
                                     min-height="55"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query2.pageNo"
                            :page-size="query2.size"
                            :total="pageTotal2"
                            @current-change="handlePageChange"
                    ></el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script scoped>
    import {

        getComp

    } from '../../api/unit';
    import {
        listProvincesAndCity, getOwenerByRoom, getOwenList, deleteOwner, deleteOwnerProp
    } from '../../api/owner';
    import { listCompAll } from '../../api/role';
    import { getDictItemByDictId, getUserComm } from '../../api/building';
    import ownerInvoiceInfo from './ownerInvoiceInfo';
    import ownerProperty from './ownerProperty';
    import { getCityDict } from '../../api';
    import commPage from '../common/commPage';
    import { upload } from '../../api/owner';
    import menu1 from './roomUpload';
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    compId: '',
                    commId: '',
                    roomId:'',
                    delIds:'',
                    pageNo: 1,
                    size: 10
                },
                query2: {
                    compId: '',
                    commId: '',
                    roomId:'',
                    delIds:'',
                    pageNo: 1,
                    size: 10
                },
                tableData: [],
                tableData2: [],
                multipleSelection: [],
                delList: [],
                usableList: [],
                editVisible: false,
                pageTotal: 0,
                pageTotal2: 0,
                disable: false,
                oiiVisible: false,
                form: {},
                idx: -1,
                title: '',
                compName: '',
                commArr: [],
                ownerTypes: [],
                nativePlace:'',
                sexTypes: [],
                propTypes: [],
                cmpVisible:false,
                certTypes: [],
                hys: [],
                areaArr: [],
                eleNum: '',
                status:0,
                provinces:[],
                propVisible:false,
                compList: [],

                commList: [],
                modelArr: [],
                row:{},
                id: -1
            };
        },
        created() {
            this.getData();
            listCompAll(this.query).then(res => {
                // debugger
                this.compList = res.data.records;
                if (res.data.records.length == 1) {
                    this.query.compName = res.data.records[0].name;
                    getUserComm(res.data.records[0].id).then(res => {
                        if (res.data) {
                            this.form.commId = undefined;
                            this.commList = res.data;
                        }
                    });
                }

            });

        },
        components: {
            ownerInvoiceInfo,
            commPage,
            menu1,
            ownerProperty
        }
        ,
        methods: {
            // 获取数据
            getData() {
                getOwenerByRoom(this.query).then(res => {
                    console.log(res);
                    this.tableData = res;
                    // this.pageTotal = res.data.pageTotal || 0;
                });
                listProvincesAndCity(this.query).then(res => {
                    this.provinces = res.data;
                    console.log(this.provinces)
                });

            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            addOwner(){
                this.cmpVisible = true
                getOwenList(this.query2).then(res => {
                    console.log(res);
                    this.tableData2 = res.data.data;
                    this.pageTotal2 = res.data.pageTotal || 0;
                });
            },
            handleDelete(val){
                // 二次确认删除
                this.$confirm('确认要将该业主从房间下移除？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteOwnerProp(val).then(res => {
                            this.tableData2 = res.data.data;
                            this.pageTotal2 = res.data.pageTotal || 0;
                        });
                    })
                    .catch(() => {
                    });
            },
            compChange(val) {
                if (this.form.compId != undefined || val != undefined) {
                    var compId;
                    if (val == undefined) {
                        compId = this.form.compId;
                    } else {
                        compId = val;
                        this.query.compName = compId;
                    }
                    getUserComm(compId).then(res => {
                        if (res.data) {
                            this.form.commId = undefined;
                            this.commList = res.data;
                        }
                    });
                }
            },
            commChange(val) {
                if (this.form.commId != undefined || val != undefined) {
                    var commId;
                    if (this.form.commId != undefined && this.form.commId != '') {
                        commId = this.form.commId;
                    } else {
                        commId = val;
                        this.query.commName = commId;
                    }
                }
            },

            handleRefresh() {
                this.query = {
                    commId: '',
                    pageNo: 1,
                    size: 10
                };
                this.getData();
            },

            //表格行点击事件
            test(row) {
                console.log(row)
                console.log(this.row)
                this.form.commId = this.row.commId
                this.form.commAreaId = this.row.commAreaId
                this.form.buildingId = this.row.commAreaId
                this.form.propertyId = this.row.id
                this.form.compId = this.row.compId
                this.form.ownerId = row.id
                this.form.type = row.propTypes
            },

            dataInitialization(row){
                this.query.roomId = row.id
                this.row = row

            },

            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            }
        }
    };
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
    .el-input--small .el-input__inner {
        height: 32px;
        width: 200px;
        line-height: 32px;
    }
</style>
