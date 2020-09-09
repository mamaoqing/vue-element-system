<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 账单列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <comp-util @comp="compValue"></comp-util>
                <dist-util @child1="checkIn" :distId="dist.paymentPropId" :distName="dist.paymentPropName" :title="dist.paymentProp"></dist-util>
                <dist-util @child1="checkIn" :distId="dist.overduePropId" :distName="dist.overduePropName" :title="dist.overdueProp"></dist-util>
                <dist-util @child1="checkIn" :distId="dist.printPropId" :distName="dist.printPropName" :title="dist.printProp"></dist-util>
                <dist-util @child1="checkIn" :distId="dist.invoicePropId" :distName="dist.invoicePropName" :title="dist.invoiceProp"></dist-util>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table
                    :data="billData"
                    border
                    class="table"
                    ref="multipleTable"
                    @row-click="chooseDetails"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="billNo" label="账单号" align="center" width="150"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型" align="center"></el-table-column>
                <el-table-column prop="billTime" label="账单生成时间" align="center" width="150"></el-table-column>
                <el-table-column prop="isPayment" label="是否付款" align="center"></el-table-column>
                <el-table-column prop="price" label="账单总金额" align="center"></el-table-column>
                <el-table-column prop="payPrice" label="付款金额" align="center"></el-table-column>
                <el-table-column prop="payEndTime" label="付款结束时间" align="center" width="150"></el-table-column>
                <el-table-column prop="isOverdue" label="是否逾期" align="center"></el-table-column>
                <el-table-column prop="overdueCost" label="逾期费用" align="center"></el-table-column>
                <el-table-column prop="isInvoice" label="是否开发票" align="center"></el-table-column>
                <el-table-column prop="isPrint" label="是否打印收据" align="center"></el-table-column>
                <el-table-column label="操作" width="" align="center" width="250">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="print(scope.row.id)">打印发票
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="push(scope.row.id)">推送微信
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

        </el-dialog>
        <el-dialog :title="title" :visible.sync="editVisible" width="60%">

        </el-dialog>
    </div>
</template>

<script>
    import {listBills} from '../../api/tariff/bill'
    import compUtil from '../common/comp'
    import distUtil from "../common/distutil"
    export default {
        components: {
          compUtil,distUtil
        },
        data() {
            return {
                billData:[],
                form: {},
                dist:{
                    paymentProp:'请选择是否付款',
                    paymentPropName:'payment',
                    paymentPropId:'51',
                    overdueProp:'请选择是否逾期',
                    overduePropName:'overdue',
                    overduePropId:'51',
                    printProp:'请选择是否打印收据',
                    printPropName:'print',
                    printPropId:'51',
                    invoiceProp:'请选择是否开发票',
                    invoicePropName:'invoice',
                    invoicePropId:'51',
                },
                query: {
                    pageNo: 1,
                    size: 10,
                    state:'',
                    compId:'',
                    commId:''
                },
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
                title:'',
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                listBills(this.query).then(res=>{
                    this.billData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            search() {
                this.init();
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            compValue(value) {
                this.query.compId = value;
            },
            print(){

            },
            push(){

            },
            chooseDetails (row) {
                //具体操作
                this.form = row;
                //this.disable=true;
                this.updateVisible = true;
                this.title="查看房间";
                this.sendData(this.form);
            },
            sendData(list) {
                this.$emit('childByValue', list);
            },
            checkIn(value, name) {
                console.log(value+"<--->"+name);
                if(name === 'payment'){
                    this.query.isPayment = value;
                }
                if(name === 'overdue'){
                    this.query.isOverdue = value;
                }
                if(name === 'print'){
                    this.query.isPrint = value;
                }
                if(name === 'invoice'){
                    this.query.isInvoice = value;
                }
            },
            dataInitializationByByBillAlter(compId,commId){
                this.query.compId = compId;
                this.query.commId = commId;
                this.query.state = "已支付";
            }
        }
    }
</script>