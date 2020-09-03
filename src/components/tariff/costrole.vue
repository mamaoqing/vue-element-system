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
                <comp-util @comp="compValue"></comp-util>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="add">新增</el-button>
            </div>
            <el-table
                    :data="ruleData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="公司名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="costTypeName" label="费用类型" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="costItemName" label="费用明细" min-width="125" min-height="55"
                                 align="center"></el-table-column>
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
                <el-table-column prop="liquidatedDamagesMethod" label="违约金计算方式" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="billCycle" label="账单周期" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="billDay" label="出账天" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="payTime" label="付款天" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center" min-width="75"
                                 min-height="55"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"
                                 min-height="55"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center" min-width="75"
                                 min-height="55"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"
                                 min-height="55"></el-table-column>
                <el-table-column label="操作" width="" align="center" width="325">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="edit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                @click.stop
                                @click="deleted(scope.row.id)">删除
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="addUnit(scope.row.id,scope.row.commId)">添加住宅
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="addPark(scope.row.id,scope.row.commId)">添加车位
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
            <el-form ref="addForm" :model="form" label-width="70px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公司名称" label-width="100px" prop="compId"
                                      :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                            <el-select v-model="form.compId" @clear="clearCompForm" style="width: 250px" clearable filterable
                                       placeholder="请选择物业公司"
                                       @change="selectCompForm(form.compId)">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <template v-if="true">
                            <el-form-item label="社区名称" label-width="100px" prop="commId"
                                          :rules="[
                    { required: true, message: '请选择社区名称', trigger: 'blur' },
                ]">
                                <comm-util @comm="formCommValue" style="width: 250px" :comp-ids="child.compId"
                                           :change="child.commId"></comm-util>
                            </el-form-item>
                        </template>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="标准名称" label-width="100px" prop="name"
                                      :rules="[
                    { required: true, message: '请输入标准名称', trigger: 'blur' },
                ]">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="费用明细" label-width="100px" prop="costItemId"
                                      :rules="[
                    { required: true, message: '请选择费用明细', trigger: 'blur' },
                ]">
                            <el-select v-model="form.costItemId" style="width: 250px" @clear="clearItemForm" clearable filterable
                                       placeholder="请选择费用明细"
                                       @change="selectItemForm(form.costItemId)">
                                <el-option
                                        v-for="item in itemData"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="开始日期" label-width="100px" prop="beginDate"
                                      :rules="[
                    { required: true, message: '请选择开始日期', trigger: 'blur' },
                ]">
                            <el-date-picker
                                    v-model="form.beginDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择开始日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期" label-width="100px" prop="endDate"
                                      :rules="[
                    { required: true, message: '请选择结束日期', trigger: 'blur' },
                ]">
                            <el-date-picker
                                    v-model="form.endDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="计费方式" label-width="100px" prop="billingMethod"
                                      :rules="[
                                        { required: true, message: '请选择计费方式', trigger: 'blur' },
                                    ]">
                            <dist-util @child1="checkForm" :distId="dist.estateId" :distName="dist.estateName"
                                       :title="dist.estateProp" :change="form.billingMethod"></dist-util>
                        </el-form-item>
                        <el-form-item label="价格" label-width="100px" prop="price"
                                      :rules="[
                    { required: true, message: '请输入价格', trigger: 'blur' },
                ]">
                            <el-input v-model="form.price" type='number' style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="违约金" label-width="100px" prop="isLiquidatedDamages"
                                      :rules="[
                    { required: true, message: '请选择是否有违约金', trigger: 'blur' },
                ]">
                            <dist-util @child1="checkForm" :distId="dist.isTrueId" :distName="dist.isTrueName"
                                       :title="dist.isTrueProp" :change="form.isLiquidatedDamages"></dist-util>
                        </el-form-item>
                        <el-form-item label="违约金计费" label-width="100px">
                            <dist-util @child1="checkForm" :distId="dist.deditId" :distName="dist.deditName"
                                       :title="dist.deditProp" :change="form.liquidatedDamagesMethod"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="价格单位" label-width="100px" prop="priceUnit"
                                      :rules="[
                                        { required: true, message: '请选择结束日期', trigger: 'blur' },
                                    ]">
                            <dist-util @child1="checkForm" :distId="dist.priceId" :distName="dist.priceName"
                                       :title="dist.priceProp" :change="form.priceUnit"></dist-util>
                        </el-form-item>
                        <el-form-item label="账单周期" label-width="100px" prop="billCycle"
                                      :rules="[
                    { required: true, message: '请输入账单周期', trigger: 'blur' },
                ]">
                            <dist-util @child1="checkForm" :distId="dist.billId" :distName="dist.billName"
                                       :title="dist.billProp" :change="form.billCycle"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="账单天数" label-width="100px" prop="billDay"
                                      :rules="[
                                        { required: true, message: '请输入账单天数', trigger: 'blur' },
                                    ]">
                            <el-input v-model="form.billDay" placeholder="有正负之分，+表示之后，-表示之前"
                                      style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="付款期" label-width="100px" prop="billCycle"
                                      :rules="[
                    { required: true, message: '请输入付款期', trigger: 'blur' },
                ]">
                            <el-input type="Integer" v-model="form.payTime" placeholder=""
                                      style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="备注" label-width="100px">
                            <el-input v-model="form.remark" placeholder="" style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="editVisible" width="60%">
            <el-form ref="editForm" :model="form" label-width="70px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公司名称" label-width="100px" prop="compId"
                                      :rules="[
                    { required: true, message: '请选择公司名称', trigger: 'blur' },
                ]">
                            <el-select v-model="form.compId" @clear="clearCompForm" clearable filterable
                                       placeholder="请选择物业公司"
                                       @change="selectCompForm(form.compId)">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <template v-if="true">
                            <el-form-item label="社区名称" label-width="100px" prop="commId"
                                          :rules="[
                    { required: true, message: '请选择社区名称', trigger: 'blur' },
                ]">
                                <comm-util @comm="formCommValue" style="width: 250px" :comp-ids="child.compId"
                                           :change="child.commId"></comm-util>
                            </el-form-item>
                        </template>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="标准名称" label-width="100px" prop="name"
                                      :rules="[
                    { required: true, message: '请输入标准名称', trigger: 'blur' },
                ]">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="费用明细" label-width="100px" prop="costItemId"
                                      :rules="[
                    { required: true, message: '请选择费用明细', trigger: 'blur' },
                ]">
                            <el-select v-model="form.costItemId" @clear="clearItemForm" clearable filterable
                                       placeholder="请选择费用明细"
                                       @change="selectItemForm(form.costItemId)">
                                <el-option
                                        v-for="item in itemData"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="开始日期" label-width="100px" prop="beginDate"
                                      :rules="[
                    { required: true, message: '请选择开始日期', trigger: 'blur' },
                ]">
                            <el-date-picker
                                    v-model="form.beginDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    placeholder="选择开始日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期" label-width="100px" prop="endDate"
                                      :rules="[
                    { required: true, message: '请选择结束日期', trigger: 'blur' },
                ]">
                            <el-date-picker
                                    v-model="form.endDate"
                                    type="datetime"
                                    format="yyyy-MM-dd"
                                    placeholder="选择结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="价格" label-width="100px" prop="price"
                                      :rules="[
                    { required: true, message: '请输入价格', trigger: 'blur' },
                ]">
                            <el-input v-model="form.price" type='number' style="width: 150px"></el-input>
                        </el-form-item>
                        <el-form-item label="价格单位" label-width="100px" prop="priceUnit"
                                      :rules="[
                    { required: true, message: '请选择结束日期', trigger: 'blur' },
                ]">
                            <dist-util @child1="checkForm" :distId="dist.priceId" :distName="dist.priceName"
                                       :title="dist.priceProp" :change="form.priceUnit"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="违约金" label-width="100px" prop="isLiquidatedDamages"
                                      :rules="[
                    { required: true, message: '请选择是否有违约金', trigger: 'blur' },
                ]">
                            <dist-util @child1="checkForm" :distId="dist.isTrueId" :distName="dist.isTrueName"
                                       :title="dist.isTrueProp" :change="form.isLiquidatedDamages"></dist-util>
                        </el-form-item>
                        <el-form-item label="违约金计费" label-width="100px" prop="liquidatedDamagesMethod"
                                      :rules="[
                    { required: true, message: '请输入违约金计费方式', trigger: 'blur' },
                ]">
                            <dist-util @child1="checkForm" :distId="dist.deditId" :distName="dist.deditName"
                                       :title="dist.deditProp" :change="form.liquidatedDamagesMethod"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="账单周期" label-width="100px" prop="billCycle"
                                      :rules="[
                    { required: true, message: '请输入账单周期', trigger: 'blur' },
                ]">
                            <dist-util @child1="checkForm" :distId="dist.billId" :distName="dist.billName"
                                       :title="dist.billProp" :change="form.billCycle"></dist-util>
                        </el-form-item>
                        <el-form-item label="账单天数" label-width="100px" prop="billDay"
                                      :rules="[
                    { required: true, message: '请输入账单天数', trigger: 'blur' },
                ]">
                            <el-input v-model="form.billDay" placeholder="有正负之分，+表示之后，-表示之前"
                                      style="width: 250px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="付款期" label-width="100px" prop="billCycle"
                                      :rules="[
                    { required: true, message: '请输入付款期', trigger: 'blur' },
                ]">
                            <el-input type="Integer" v-model="form.payTime" placeholder=""
                                      style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="计费方式" label-width="100px" prop="billingMethod"
                                      :rules="[
                    { required: true, message: '请选择计费方式', trigger: 'blur' },
                ]">
                            <dist-util @child1="checkForm" :distId="dist.estateId" :distName="dist.estateName"
                                       :title="dist.estateProp" :change="form.billingMethod"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="title" :visible.sync="addUnitVisible" width="40%">
            <trees @child1="setRoom" :comm-id="commId" :arr="changeRoom"></trees>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUnitVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUnit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="addParkVisible" width="80%">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="addParks">新增</el-button>
                <el-button type="primary" icon="el-icon-lx-delete" @click="deleteParksAll">批量删除</el-button>
            </div>
            <!--            <parkingSpace v-if="addParkVisible" @park="park" :shows="false" ref="parkingSpace" :change="[1,10]"></parkingSpace>-->
            <el-table
                    :data="parkData"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="selectChange"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="true"></el-table-column>
                <el-table-column prop="ids" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="commName" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="commAreaName" label="分区名称" align="center"></el-table-column>
                <el-table-column prop="no" label="编号" align="center"></el-table-column>
                <el-table-column prop="position" label="位置" align="center"></el-table-column>
                <el-table-column prop="building_property" label="建筑属性" align="center"></el-table-column>
                <el-table-column prop="use_property" label="使用属性" align="center"></el-table-column>
                <el-table-column prop="vehicle_type" label="车辆类型" align="center"></el-table-column>
                <el-table-column prop="height" label="高度" align="center"></el-table-column>
                <el-table-column prop="size" label="尺寸" align="center"></el-table-column>
                <el-table-column prop="array" label="排列形式" align="center"></el-table-column>
                <el-table-column prop="usable_time" label="可用时间" align="center"></el-table-column>
                <el-table-column prop="occupy_state" label="占用状态" align="center"></el-table-column>
                <el-table-column prop="in_mode" label="入位方式" align="center"></el-table-column>
                <el-table-column label="操作" width="" align="center" width="325">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                @click.stop
                                @click="deletpark(scope.row.ids)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">

                <el-button @click="addParkVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="pv" width="80%">
             <span slot="footer" class="dialog-footer">
                <parkingSpace :comm-id="commId"  @park="park"  :shows="false" ref="parkingSpace"></parkingSpace>
                <el-button @click="pv = false">取 消</el-button>
                <el-button type="primary" @click="submitPark()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        listCostRule,
        insertCostRule,
        updateCostRule,
        deleteCostRule,
        listCostItem,
        insertRuleRoom,
        getRoomIds,
        insertRulePark,
        getParkIds,
        getCostPark,
        deletparkById,
        deleteAllPark
    } from '../../api/tariff/costrule'
    import commUtil from '../common/commutil'
    import compUtil from '../common/comp'
    import {getComp} from "../../api/user";
    import distUtil from "../common/distutil"
    import trees from '../common/unitroom'
    import parkingSpace from '../asstes/changepark'

    export default {
        components: {
            distUtil, trees, parkingSpace, compUtil,commUtil
        },
        data() {
            return {
                commId:0,
                parkData: [],
                dist: {
                    priceProp: '请选择价格单位',
                    priceId: '50',
                    priceName: 'priceUnit',
                    isTrueProp: '请选择是或否',
                    isTrueId: '51',
                    isTrueName: 'isTrue',
                    deditProp: '请选择违约金计算方式',
                    deditId: '52',
                    deditName: 'dedit',
                    billProp: '请选择账单周期',
                    billId: '53',
                    billName: 'bill',
                    estateProp: '请选择物业费计费方式',
                    estateId: '54',
                    estateName: 'estate',
                },
                child:{},
                title: '',
                addForm: {
                    rooms: '',
                    ruleId: '',
                    parks: '',
                },
                ruleData: [],
                changeRoom: [],
                options: [],
                itemData: [],
                form: {},
                query: {
                    pageNo: 1,
                    size: 10,
                },
                addVisible: false,
                addParkVisible: false,
                pv: false,
                editVisible: false,
                addUnitVisible: false,
                addParksVisible: false,
                pageTotal: 0,
                parkIds: '',
                ruleId:'',
                deleteParkIds:[],
            }
        },
        created() {
            this.init();
            this.getComp();
        },
        methods: {
            init() {
                listCostRule(this.query).then(res => {
                    this.ruleData = res.data.records;
                    this.pageTotal = res.data.total;
                });
            },
            edit(index, row) {
                this.form = row;
                this.setItemData();
                this.child.compId = row.compId;
                this.editVisible = !this.editVisible;
                this.child.commId = row.commId;
                this.title = '修改费用类型';
            },
            deleted(id) {
                this.$confirm('确定要删除该费用标准吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteCostRule(id).then(res => {
                        if (res.code === 0 && res.data) {
                            this.$message.success(`删除成功！`);
                            this.init();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
            },
            addUnit(id,commId) {
                this.commId = commId;
                getRoomIds(id).then(res => {
                    this.changeRoom = res.data;
                    this.addUnitVisible = !this.addUnitVisible;
                });
                this.addForm.ruleId = id;
                this.title = '选择物业单位';

            },
            addPark(id,commId) {
                this.commId = commId;
                this.title = '请选择车位';
                this.ruleId = id;
                getCostPark(id).then(res => {
                    this.parkData = res.data;
                    this.addParkVisible = !this.addParkVisible;
                });
            },
            submitUnit() {
                insertRuleRoom(this.addForm).then(res => {
                    if (res.code === 0 && res.data) {

                        this.addUnitVisible = !this.addUnitVisible;
                        this.changeRoom = [];
                    } else {
                        this.$message.error(`设置失败！`);
                    }
                });
            },
            submitPark() {
                insertRulePark(this.addForm).then(res => {
                    if (res.code === 0 && res.data) {
                        this.$message.success(`设置成功`);
                        getCostPark(this.ruleId).then(res => {
                            this.parkData = res.data;
                        });
                        this.pv = !this.pv;
                    } else {
                        this.$message.error(`设置失败！`);
                    }
                });
            },
            add() {
                this.addVisible = !this.addVisible;
                this.title = '添加费用标准';
                this.form = {};
            },
            search() {
                this.init();
            },
            getComp() {
                getComp().then(res => {
                    this.options = res.data;
                });
            },
            submit() {
                if (this.title === '添加费用标准') {
                    this.$refs['addForm'].validate(valid => {
                        if (valid) {
                            insertCostRule(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`修改成功`);

                                } else {
                                    this.$message.error(`修改失败！`);
                                }
                                this.addVisible = !this.addVisible;
                                this.init();
                            });
                        }
                    });
                } else {
                    this.$refs['editForm'].validate(valid => {
                        if (valid) {
                            updateCostRule(this.form).then(res => {
                                if (res.code === 0 && res.data) {
                                    this.$message.success(`修改成功`);
                                } else {
                                    this.$message.error(`修改失败！`);
                                }
                                this.editVisible = !this.editVisible;
                                this.init();
                            });
                        }
                    });
                }
            },
            selectCompForm(value) {
                if (value) {
                    this.child.compId = parseInt(value);
                    this.form.compId = parseInt(value);
                } else {
                    console.log(123)
                    this.child.compId = 0;
                    this.form.compId = '';
                }
                this.form.compId = value;
                this.itemData = [];
                if (value) {
                    this.setItemData();
                }
            },
            clearCompForm() {
                this.form.compId = '';
                this.form.costItemId = '';
                this.itemData = [];
            },
            selectItemForm(value) {
                this.form.costItemId = value;
            },
            clearItemForm() {
                this.form.costItemId = '';
            },
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            setItemData() {
                listCostItem(this.form.compId).then(res => {
                    this.itemData = res.data;
                });
            },
            checkForm(value, name) {
                if (name === 'priceUnit') {
                    this.form.priceUnit = value;
                }
                if (name === 'isTrue') {
                    this.form.isLiquidatedDamages = value;
                }
                if (name === 'dedit') {
                    this.form.liquidatedDamagesMethod = value;
                }
                if (name === 'bill') {
                    this.form.billCycle = value;
                }
                if (name === 'estate') {
                    this.form.billingMethod = value;
                }
            },
            setRoom(value, name) {
                if (value) {
                    this.addForm.rooms = value;
                } else {
                    this.addForm.rooms = '';
                }
            },
            park(value) {
                console.log(value);
                this.unique(value);
            },
            unique(arr) {
                this.addForm.parks = '';
                var arrs = [];    //定义一个临时数组
                for (var i = 0; i < arr.length; i++) {    //循环遍历当前数组
                    if (arrs.indexOf(arr[i]) == -1) {
                        arrs.push(arr[i]);
                    }
                }
                for (var i = 0; i < arrs.length; i++) {
                    this.addForm.parks += arrs[i] + ',';
                }
            },
            compValue(value) {
                this.query.compId = value;
            },
            addParks() {
                this.pv = !this.pv;
                let ids = '';
                this.addForm.ruleId = this.ruleId;
                // 查询费用标准下的停车位信息
                getParkIds(this.ruleId).then(res=>{
                    ids=res.data;
                    this.$nextTick(() => {
                        this.$refs.parkingSpace.init(ids);
                    });
                });
            },
            deletpark(id){
                console.log(id);
                this.$confirm('确定要删除该车位吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deletparkById(id).then(res => {
                        if (res.code === 0 && res.data) {
                            this.$message.success(`删除成功！`);
                            getCostPark(this.ruleId).then(res => {
                                this.parkData = res.data;
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
            },
            deleteParksAll(){
                console.log(123);
                if(this.deleteParkIds.length > 0){
                console.log(321);
                    var d = this.deleteParkIds;
                    var s = "";
                    for (var i=0;i<d.length;i++){
                        s += d[i]+",";
                    }
                    this.$confirm('确认删除吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        var json = {
                            ids:s,
                            ruleId : this.ruleId
                        };
                        deleteAllPark(json).then(res => {
                            if (res.code === 0 && res.data) {
                                this.$message.success(`批量删除成功！`);
                                getCostPark(this.ruleId).then(res => {
                                    this.parkData = res.data;
                                });
                            }else {
                                this.$message.success(`批量删除失败！`);
                            }
                        });
                    });
                }
            },
            selectChange(selection) {
                this.deleteParkIds = [];
                for (var i = 0; i < selection.length; i++) {
                    this.deleteParkIds.push(selection[i].id);
                }
                console.log(this.deleteParkIds);
            },
            formCommValue(value){
                if (value){
                    this.form.commId = value;
                }
            },

        }
    }
</script>
<style>
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

    .el-form {
        overflow: hidden;
    }

    .el-form-item {
        width: 45%;
        float: left;
    }

    .el-table--small td {
        padding: 1px 0;
    }
</style>