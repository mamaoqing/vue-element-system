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
                <comm-util @comm="formCommValue" style="width: 250px" :comp-ids="compId"></comm-util>
                <el-select v-model="query.costRuleId" clearable placeholder="请选择费用标准">
                    <el-option
                            v-for="item in ruleList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="query.type" clearable placeholder="请选择物业类型">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="query.owners" @clear="clearOwner" clearable filterable placeholder="请选择业主姓名"
                           @change="selectOwner">
                    <el-option
                            v-for="item in ownerData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.name">
                    </el-option>
                </el-select>
                <el-input v-model="query.no" placeholder="请输入房间号" style="width: 250px"></el-input>
                <dist-util @child1="checkIn" :distId="dist.paymentPropId" :distName="dist.paymentPropName" :title="dist.paymentProp"></dist-util>
                <dist-util @child1="checkIn" :distId="dist.overduePropId" :distName="dist.overduePropName" :title="dist.overdueProp"></dist-util>
<!--                <dist-util @child1="checkIn" :distId="dist.printPropId" :distName="dist.printPropName" :title="dist.printProp"></dist-util>-->
<!--                <dist-util @child1="checkIn" :distId="dist.invoicePropId" :distName="dist.invoicePropName" :title="dist.invoiceProp"></dist-util>-->
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="resetAll">重新生成账单</el-button>
            </div>
            <el-table
                    :data="billData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="ruleName" label="费用标准" align="center"></el-table-column>
                <el-table-column prop="no" label="物业编号" align="center"></el-table-column>
                <el-table-column prop="billNo" label="账单号" align="center"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型" align="center"></el-table-column>
                <el-table-column prop="billTime" label="账单生成时间" align="center"></el-table-column>
                <el-table-column prop="isPayment" label="是否付款" align="center"></el-table-column>
                <el-table-column prop="price" label="账单总金额" align="center"></el-table-column>
                <el-table-column prop="payPrice" label="付款金额" align="center"></el-table-column>
                <el-table-column prop="payEndTime" label="付款结束时间" align="center"></el-table-column>
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
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="reset(scope.row.id)">重新生成
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
    import {listBills,resetBill,resetBillAll,fCostRule,listOwner} from '../../api/tariff/bill'
    import compUtil from '../common/comp'
    import distUtil from "../common/distutil"
    import commUtil from '../common/commutil'
    export default {
        components: {
          compUtil,distUtil,commUtil
        },
        data() {
            return {
                ruleList:[],
                ownerData:[],
                options:[{
                    value:'房产',
                    label:'房产',
                },{
                    value:'停车位',
                    label:'停车位',
                },{
                    value:'水表',
                    label:'水表',
                },{
                    value:'电表',
                    label:'电表',
                },{
                    value:'燃气表',
                    label:'燃气表',
                }
                ],
                queryRule:{pageNo:1,size:100},
                compId:0,
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
                },
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
                title:'',
            }
        },
        created() {
            this.init();
            this.costRuleSelect();
            this.ownerlist();
        },
        methods: {
            clearOwner(){

            },
            selectOwner(value){
                this.query.owners = value;
            },
            ownerlist(){
                listOwner(this.query).then(res=>{
                   this.ownerData = res.data;
                });
            },
            init() {
                listBills(this.query).then(res=>{
                    console.log(res)
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
                this.compId = value;
            },
            print(){

            },
            push(){

            },
            checkIn(value, name) {
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
            formCommValue(value){
                this.query.commId = value;
            },
            reset(id){
                resetBill(id).then(res=>{
                    if(res.code === 0 && res.data){
                        this.$message.success(`重新生成账单成功`);
                        this.init();
                    }else {
                        this.$message.error(res.msg);
                    }
                });
            },
            resetAll(){
                if(this.query.costRuleId){
                    resetBillAll({ruleId :this.query.costRuleId }).then(res=>{
                        if(res.code === 0 && res.data){
                            this.$message.success(`重新生成账单成功`);
                            this.init();
                        }else {``
                            this.$message.error(res.msg);
                            this.init();
                        }
                    })
                }else {
                    this.$message.error(`请选择费用标准！`);
                }
            },
            costRuleSelect(){
                fCostRule(this.queryRule).then(res=>{
                    this.ruleList = res.data.records;
                });
            }
        }
    }
</script>