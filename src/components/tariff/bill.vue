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
                <el-button type="primary" icon="el-icon-search" @click="add">添加账单</el-button>
                <el-button type="primary" icon="el-icon-search" @click="resetAll"  :disabled="flag">{{content}}</el-button>
            </div>
            <el-table
                    :data="billData"
                    border
                    class="table"
                    ref="multipleTable"
                    @row-click="openDetails"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="ruleName" label="费用标准" align="center"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型" align="center"></el-table-column>
                <el-table-column prop="no" label="物业编号" align="center"></el-table-column>
                <el-table-column prop="billNo" label="账单号" align="center"  width="150"></el-table-column>
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
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="reset(scope.row.id)">重新生成
                        </el-button>
                        <!--<el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="pay(scope.row)">现金付款
                        </el-button>-->
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
        <el-dialog :title="title" :visible.sync="payVisible" width="60%">
            <el-form ref="editForm" label-width="70px">
                <el-form-item label="付款金额" label-width="100px" style="width: 200px;">
                    <el-input v-model="payPrice" type="number"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="payVisible = false">取 消</el-button>
                <el-button type="primary" @click="payment()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="detailVisible" width="80%">
            <template>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="费用标准" name="first">
                        <el-table
                                :data="ruleData"
                                border
                                class="table"
                                ref="multipleTable"
                                header-cell-class-name="table-header"
                        >
                            <el-table-column prop="name" label="标准名称" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="billingMethod" label="计费方式" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="price" label="价格" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="priceUnit" label="价格单位" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="beginDate" label="开始时间" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="endDate" label="结束时间" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="isLiquidatedDamages" label="是否有违约金" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="liquidatedDamagesMethod" label="违约金计算方式" min-width="125"
                                             min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="billCycle" label="账单周期" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="billDay" label="出账天" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="payTime" label="付款天" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="业主信息" name="second">
                        <el-table
                                :data="ownersData"
                                border
                                class="table"
                                ref="multipleTable"
                                header-cell-class-name="table-header"
                        >
                            <el-table-column prop="name" label="业主名称" min-width="90" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="ownerAddr" label="业主地址" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                            <el-table-column prop="tel" label="电话" min-width="125" min-height="55"
                                             align="center"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="账单信息" name="third">
                        <el-form  :model="form" label-width="70px" disabled>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="账单号" label-width="100px">
                                        <el-input v-model="form.billNo"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="账单生成时间" label-width="100px">
                                        <el-input v-model="form.billTime"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="账期" label-width="100px">
                                        <el-input v-model="form.accountPeriod"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>


                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="账单总金额" label-width="100px">
                                        <el-input v-model="form.price"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="是否付款" label-width="100px">
                                        <el-input v-model="form.isPayment" style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="付款金额" label-width="100px">
                                        <el-input v-model="form.payPrice"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="是否逾期" label-width="100px">
                                        <el-input v-model="form.isOverdue"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="逾期费用" label-width="100px">
                                        <el-input v-model="form.overdueCost"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="逾期计费方式" label-width="100px">
                                        <el-input v-model="form.overdueRule"  style="width: 250px;"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="账单周期" name="four">
                        <el-table
                                :data="billDateList"
                                border
                                class="table"
                                ref="multipleTable"
                                header-cell-class-name="table-header"
                        >
                            <el-table-column prop="id" label="ID" min-width="125" v-if="false" min-height="55" align="center"></el-table-column>
                            <el-table-column prop="createBillDate" label="账单自动生成日期" min-width="125" min-height="55" align="center"></el-table-column>
                            <el-table-column prop="accountPeriod" label="账期" min-width="125" min-height="55" align="center"></el-table-column>
                            <el-table-column prop="endTime" label="账单结束日期" min-width="125" min-height="55" align="center"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="账单流水" name="five">
                        <el-table
                                :data="billRecordData"
                                border
                                class="table"
                                ref="multipleTable"
                                header-cell-class-name="table-header"
                        >
                            <el-table-column prop="id" label="ID" min-width="125" v-if="false" min-height="55" align="center"></el-table-column>
                            <el-table-column prop="no" label="流水单号" min-width="125" min-height="55" align="center"></el-table-column>
                            <el-table-column prop="oper_type" label="操作类型" min-width="125" min-height="55" align="center"></el-table-column>
                            <el-table-column prop="payment_method" label="支付方式" min-width="125" min-height="55" align="center"></el-table-column>
                            <el-table-column prop="cost" label="流水金额" min-width="125" min-height="55" align="center"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="addVisible" width="60%">
            <el-form ref="addForm" :model="form" label-width="70px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司名称" label-width="100px">
                            <comp-util @comp="compValue1" style="width: 250px;"></comp-util>

                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="社区名称" label-width="100px">
                            <comm-util @comm="formCommValue1" style="width: 250px" :comp-ids="compId"></comm-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="费用标准" label-width="100px">
                            <el-select v-model="form.costRuleId" clearable placeholder="请选择费用标准">
                                <el-option
                                        v-for="item in ruleList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="数量" label-width="100px">
                            <el-input v-model="form.count" type="number" style="width: 250px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否付款" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.paymentPropId" :distName="dist.paymentPropName"
                                       :title="dist.paymentProp" :change="form.billingMethod" style="width: 250px;"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="付款金额" label-width="100px">
                            <el-input v-model="form.payPrice" type="number" style="width: 250px;"></el-input>
                        </el-form-item>
                    </el-col>


                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="是否打印收据" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.printPropId" :distName="dist.printPropName"
                                       :title="dist.printProp" :change="form.billingMethod"></dist-util>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否开发票" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.invoicePropId" :distName="dist.invoicePropName"
                                       :title="dist.invoiceProp" :change="form.billingMethod"></dist-util>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                    </el-col>
                    <el-col :span="8">
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {listBillss, resetBill, resetBillAll, fCostRule, listOwner, doPay, getOwnerList,insertBill,billRecord} from '../../api/tariff/bill'
    import compUtil from '../common/comp'
    import distUtil from "../common/distutil"
    import commUtil from '../common/commutil'
    import {getCostRule,listBills} from '../../api/tariff/costrule'
    export default {
        components: {
            compUtil, distUtil, commUtil
        },
        data() {
            return {
                billRecordData:[],
                billDateList:[],
                ownersData: [],
                ruleData: [],
                activeName: 'first',
                name: 'mmq',
                content: '重新生成账单',
                flag: false,
                payId: 0,
                payPrice: 0,
                ruleList: [],
                ownerData: [],
                options: [{
                    value: '房产',
                    label: '房产',
                }, {
                    value: '停车位',
                    label: '停车位',
                }, {
                    value: '水表',
                    label: '水表',
                }, {
                    value: '电表',
                    label: '电表',
                }, {
                    value: '燃气表',
                    label: '燃气表',
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
                    state:'',
                    compId:'',
                    commId:''
                },
                payVisible: false,
                detailVisible: false,
                addVisible: false,
                pageTotal: 0,
                title: '',
                totalTime: 3,
            }
        },
        created() {
            this.init();
            this.costRuleSelect();
            this.ownerlist();
        },
        methods: {
            add() {
                this.title = '添加账单';
                this.addVisible = !this.addVisible;
            },
            handleClick(tab, event) {

            },
            openDetails(row) {
                this.form = row;
                getCostRule(row.costRuleId).then(res => {
                    this.ruleData = [];
                    this.ruleData.push(res.data);
                });

                getOwnerList({propertyId: row.propertyId, propertyType: row.propertyType}).then(res => {
                    this.ownersData = res.data;
                });

                listBills(row.costRuleId).then(res => {
                    this.billDateList = res.data;
                });
                billRecord(row.id).then(res=>{
                    this.billRecordData = res.data;
                });

                this.title = '账单详情';
                this.detailVisible = !this.detailVisible;
            },
            clearOwner() {

            },
            selectOwner(value) {
                this.query.owners = value;
            },
            submit() {
                insertBill(this.form).then(res=>{
                    if (res.code === 0 && res.data) {
                        this.$message.success(`账单添加成功`);
                    } else {
                        this.$message.error(`添加失败`);
                    }
                    this.addVisible = !this.addVisible;
                });
            },
            ownerlist() {
                listOwner(this.query).then(res => {
                    this.ownerData = res.data;
                });
            },
            init() {
                listBillss(this.query).then(res => {
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
            compValue1(value) {
                this.form.compId = value;
                this.compId = value;
            },
            print() {

            },
            push(){

            },
            pay(row) {
                this.payId = 0;
                if (row.price > row.payPrice) {
                    this.payVisible = !this.payVisible;
                    this.payId = row.id;
                } else {
                    this.$message.error(`订单已完成，请勿重复付款！`);
                }
            },
            payment() {
                doPay({id: this.payId, price: this.payPrice}).then(res => {
                    if (res.code === 0 && res.data) {
                        this.$message.success(`付款成功`);
                        this.payVisible = !this.payVisible;
                        this.init();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            checkIn(value, name) {
                if (name === 'payment') {
                    this.query.isPayment = value;
                }
                if (name === 'overdue') {
                    this.query.isOverdue = value;
                }
                if (name === 'print') {
                    this.query.isPrint = value;
                }
                if (name === 'invoice') {
                    this.query.isInvoice = value;
                }
            },
            formCommValue(value) {
                this.query.commId = value;
            },
            formCommValue1(value) {
                this.form.commId = value;
            },
            reset(id) {
                resetBill(id).then(res => {
                    if (res.code === 0 && res.data) {
                        this.$message.success(`重新生成账单成功`);
                        this.init();
                    }else {
                        this.$message.error(res.msg);
                    }
                });
            },
            resetAll() {
                if (this.query.costRuleId) {
                    this.flag = !this.flag;
                    resetBillAll({ruleId: this.query.costRuleId}).then(res => {
                        if (res.code === 0 && res.data) {
                            this.$message.success(`重新生成账单成功`);
                            this.init();
                            this.content = this.totalTime + '秒后可用';
                            let clock = window.setInterval(() => {
                                this.totalTime--;
                                this.content = this.totalTime + "s后可用";
                                if (this.totalTime < 0) {
                                    window.clearInterval(clock);
                                    this.content = "重新生成账单";
                                    this.totalTime = 3;
                                    this.flag = !this.flag;
                                }
                            }, 1000);
                        } else {
                            this.flag = !this.flag;
                            this.$message.error(res.msg);
                            this.init();
                        }
                    })
                } else {
                    this.$message.error(`请选择费用标准！`);
                }
            },
            costRuleSelect() {
                fCostRule(this.queryRule).then(res => {
                    this.ruleList = res.data.records;
                });
            },
            checkForm(value, name){
                if(name === 'print'){
                    this.form.isPrint = value;
                }
                if(name === 'invoice'){
                    this.form.isInvoice = value;
                }
                if(name === 'payment'){
                    this.form.isPayment = value;
                }
            },
        }
    }
</script>
