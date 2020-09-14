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
                <el-input v-model="query.billNo" placeholder="请输入账单号" style="width: 250px"></el-input>
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
                <dist-util @child1="checkIn" :distId="dist.paymentPropId" :distName="dist.paymentPropName"
                           :title="dist.paymentProp"></dist-util>
                <dist-util @child1="checkIn" :distId="dist.overduePropId" :distName="dist.overduePropName"
                           :title="dist.overdueProp"></dist-util>
                <!--                <dist-util @child1="checkIn" :distId="dist.printPropId" :distName="dist.printPropName" :title="dist.printProp"></dist-util>-->
                <!--                <dist-util @child1="checkIn" :distId="dist.invoicePropId" :distName="dist.invoicePropName" :title="dist.invoiceProp"></dist-util>-->
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="resetAll">重新生成账单</el-button>
                <el-button type="primary" icon="el-icon-search" @click="billSearch">账单查询</el-button>

            </div>
            <el-table
                    :data="billData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130" align="center"></el-table-column>
                <el-table-column prop="commName" label="社区" align="center"></el-table-column>
                <el-table-column prop="billNo" label="账单号" width="155" align="center"></el-table-column>
                <el-table-column prop="ruleName" label="费用标准" align="center"></el-table-column>
                <el-table-column prop="accountPeriod" label="账期" align="center"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型" align="center"></el-table-column>
                <el-table-column prop="no" label="物业编号" width="95" align="center"></el-table-column>
                <el-table-column prop="price" label="账单总金额" align="center"></el-table-column>
                <el-table-column prop="isPayment" label="是否付款" align="center"></el-table-column>
                <el-table-column prop="payPrice" label="付款金额" align="center"></el-table-column>
                <el-table-column prop="salePrice" label="减免金额" align="center"></el-table-column>
                <el-table-column prop="overdueCost" label="违约金" align="center"></el-table-column>
                <el-table-column prop="payEndTime" label="逾期时间" width="175" align="center"></el-table-column>
                <el-table-column prop="billTime" label="账单生成时间" width="175" align="center"></el-table-column>
                <el-table-column prop="createName" label="生成人" align="center"></el-table-column>
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

        <el-dialog :title="title" :visible.sync="addBillVisable" width="55%">
            <el-form ref="form" :model="form" label-width="70px" :inline="true">
                <div>
                    <el-form-item label="id" v-show="false">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="公司名称" label-width="150px">
                        <el-input class="item" v-model="compName" disabled v-if="!isAdmin"></el-input>
                        <el-select v-model="form.compId" placeholder="请选择公司" style="width: 200px" @change="compChange"
                                   v-if="isAdmin">
                            <el-option :value="types.id" :key="types.name" :label="types.name"
                                       v-for="types in compList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="分区名称" label-width="150px" prop="commId" :rules="[
                        { required: true, message: '请选择分区', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.commId" placeholder="请选择">
                            <el-option :value="types.id" :key="types.name" :label="types.name"
                                       v-for="types in commList">{{types.name}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="账单编号" label-width="150px" prop="billNo" :rules="[
                        { required: true, message: '请填写账单编号', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.billNo" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="费用标准名称" label-width="150px" prop="costRuleId" :rules="[
                        { required: true, message: '请选择费用标准', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.costRuleId" clearable placeholder="请选择费用标准" style="width: 200px">
                            <el-option
                                    v-for="item in ruleList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物业类型" label-width="150px" prop="propertyType" :rules="[
                        { required: true, message: '请选择物业类型', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.propertyType" placeholder="请选择" style="width: 200px">
                            <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in wyTypes">
                                {{types.name}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物业编号" prop="propertyId" label-width="150px" :disabled="false" :rules="[
                        { required: true, message: '请选择物业编号', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.propertyId" v-show="false" :disabled="true"
                                  style="width: 150px;"></el-input>
                        <el-input v-model="form.propertyName" :disabled="true" style="width: 150px;"></el-input>
                        <el-button
                                type="text"
                                icon="el-icon-search"
                                @click.stop
                                @click="roomParkingSearch()"
                        >选择
                        </el-button>
                    </el-form-item>
                    <el-form-item class="item" label="账单金额" label-width="150px" prop="price" :rules="[
                        { required: true, message: '请填写账单金额', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.price" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="状态" label-width="150px" prop="state" :rules="[
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.state" placeholder="请选择" style="width: 200px">
                            <el-option key="wfk" label="未付款" value="未付款"></el-option>
                            <el-option key="yfk" label="已付款" value="已付款"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="生成时间" label-width="150px" prop="billTime" :rules="[
                        { required: true, message: '请填写生成时间', trigger: 'blur' },
                    ]">
                        <el-date-picker
                                style="width: 200px"
                                v-model="form.billTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00"
                        />
                    </el-form-item>
                    <el-form-item class="item" label="逾期时间" label-width="150px" prop="payEndTime" :rules="[
                        { required: true, message: '请填写逾期时间', trigger: 'blur' },
                    ]">
                        <el-date-picker
                                style="width: 200px"
                                v-model="form.payEndTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00"
                        />
                    </el-form-item>
                    <el-form-item class="item" label="生成人" label-width="150px">
                        <el-input v-model.number="createName" :disabled="true" style="width: 200px"></el-input>
                    </el-form-item>
                </div>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertBill((title,'form'))">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="ownerBillTitle" :visible.sync="aaa" width="75%" @close='closeDialog'>
            <!--            <el-button type="primary" icon="el-icon-lx-add" @click="pay">缴费</el-button>-->
            <el-button type="primary" icon="el-icon-lx-add" @click="addBill">添加临时性费用</el-button>
            <el-table
                    :data="billData2"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130" align="center"></el-table-column>
                <el-table-column prop="commName" label="社区" align="center"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型" align="center"></el-table-column>
                <el-table-column prop="no" label="物业编号" width="95" align="center"></el-table-column>
                <el-table-column prop="billNo" label="账单号" width="155" align="center"></el-table-column>
                <el-table-column prop="ruleName" label="费用标准" align="center"></el-table-column>
                <el-table-column prop="accountPeriod" label="账期" align="center"></el-table-column>
                <el-table-column prop="price" label="账单总金额" width="95" align="center"></el-table-column>
                <el-table-column prop="isPayment" label="是否付款" align="center"></el-table-column>
                <el-table-column prop="payPrice" label="付款金额" align="center"></el-table-column>
                <el-table-column prop="salePrice" label="减免金额" align="center"></el-table-column>
                <el-table-column prop="overdueCost" label="违约金" align="center"></el-table-column>
                <el-table-column prop="payEndTime" label="逾期时间" width="175" align="center"></el-table-column>
                <el-table-column prop="billTime" label="账单生成时间" width="175" align="center"></el-table-column>
                <el-table-column prop="createName" label="生成人" align="center"></el-table-column>
            </el-table>

            <div>
                <div class="myTitle">收款</div>
                <el-divider></el-divider>
                <el-form ref="payForm" :model="payForm" label-width="125px" :inline="true">
                    <el-form-item label="业主ID" v-show="false">
                        <el-input v-model="payForm.ownerId"></el-input>
                    </el-form-item>
                    <el-form-item label="操作类型">
                        <el-select v-model="payForm.operType" placeholder="请选择" style="width: 200px" prop="operType"
                                   :rules="[
                        { required: true, message: '请选择操作类型', trigger: 'blur' },
                    ]">
                            <el-option key="zf" label="支付" value="支付"></el-option>
                            <el-option key="yc" label="预存" value="预存"></el-option>
                            <el-option key="qx" label="取现" value="取现"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="付款金额" prop="fukuan"
                                  :rules="[
                        { required: true, message: '请输入付款金额', trigger: 'blur' },
                    ]">
                        <el-input v-model="payForm.fukuan" @input="subtract"></el-input>
                    </el-form-item>
                    <el-form-item label="实收金额" prop="cost"
                                  :rules="[
                        { required: true, message: '请输入实收金额', trigger: 'blur' },
                    ]">
                        <el-input v-model="payForm.cost" @input="subtract"></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式" prop="paymentMethod"
                                  :rules="[
                        { required: true, message: '请选择支付方式', trigger: 'blur' },
                    ]">
                        <el-select v-model="payForm.paymentMethod" placeholder="请选择" style="width: 200px">
                            <el-option key="wx" label="微信" value="微信"></el-option>
                            <el-option key="zfb" label="支付宝" value="支付宝"></el-option>
                            <el-option key="xj" label="现金" value="现金"></el-option>
                            <el-option key="yhzz" label="银行转账" value="银行转账"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否转入预存账户">
                        <el-select v-model="payForm.isYc" placeholder="请选择" style="width: 200px" @change="getAccount">
                            <el-option key="true" label="是" value="true"></el-option>
                            <el-option key="false" label="否" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="预存账户" prop="accountId" v-if="accountVis"
                                  :rules="[
                        { required: true, message: '请选择预存账户', trigger: 'blur' },
                    ]">
                        <el-select v-model="payForm.accountId" placeholder="请选择" style="width: 200px">
                            <el-option :value="types.id" :key="types.id" :label="types.name" v-for="types in accounts">
                                {{types.name}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="payForm.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="pagination">
                <div class="cell myCell">账单合计：￥{{price}}</div>
                <div class="cell myCell">找零：￥{{subMoney}}</div>
                <el-button type="primary" @click="payPrice">确认缴费</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="payPriceVis" append-to-body width="20%">
            <el-form ref="payForm" :model="payForm" label-width="90px" :inline="true">
                <el-form-item label="业主ID" v-show="false">
                    <el-input v-model="payForm.ownerId"></el-input>
                </el-form-item>
                <el-form-item label="操作类型">
                    <el-select v-model="payForm.operType" placeholder="请选择" style="width: 200px">
                        <el-option key="zf" label="支付" value="支付"></el-option>
                        <el-option key="yc" label="预存" value="预存"></el-option>
                        <el-option key="qx" label="取现" value="取现"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金额">
                    <el-input v-model="payForm.cost"></el-input>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select v-model="payForm.paymentMethod" placeholder="请选择" style="width: 200px">
                        <el-option key="wx" label="微信" value="微信"></el-option>
                        <el-option key="zfb" label="支付宝" value="支付宝"></el-option>
                        <el-option key="xj" label="现金" value="现金"></el-option>
                        <el-option key="yhzz" label="银行转账" value="银行转账"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="payForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="payPriceVis = false">取 消</el-button>
                <el-button type="primary" @click="payPrice((title,'form'))">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="roomVisible" append-to-body width="55%">
            <el-table
                    :data="roomData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    elt
                    @row-click="chooseRoomDetails"
                    highlight-current-row
            >
                <el-table-column prop="commAreaName" label="社区分区名称" width="120"></el-table-column>
                <el-table-column prop="buildingName" label="建筑名称" width="120"></el-table-column>
                <el-table-column prop="unitName" label="单元名称" width="120"></el-table-column>
                <el-table-column prop="name" label="房间名称" width="120"></el-table-column>
                <el-table-column prop="roomNo" label="房间号"></el-table-column>
                <el-table-column prop="floor" label="楼层"></el-table-column>
                <el-table-column prop="floorNum" label="楼层数"></el-table-column>
                <el-table-column prop="elevatorNum" label="电梯数"></el-table-column>
                <el-table-column prop="roomNum" label="每层房间数"></el-table-column>
                <el-table-column prop="roomModel" label="房型"></el-table-column>
                <el-table-column prop="roomType" label="房屋类型"></el-table-column>
                <el-table-column prop="propertyRightNature" label="产权性质"></el-table-column>
                <el-table-column prop="direction" label="朝向"></el-table-column>
                <el-table-column prop="renovationLevel" label="装修程度"></el-table-column>
                <el-table-column prop="usable" label="用途"></el-table-column>
                <el-table-column prop="titleDeedNo" label="产权证号"></el-table-column>
                <el-table-column prop="landDeedNo" label="土地证号"></el-table-column>
                <el-table-column prop="contractNo" label="购房合同号"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column prop="createdName" label="创建人"></el-table-column>
                <el-table-column prop="createdAt" label="创建日期" width="155"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改日期" width="155"></el-table-column>
            </el-table>
        </el-dialog>

        <!--        <el-dialog :visible.sync="roomVisible" append-to-body width="55%">-->
        <!--            <roomVisible v-on:childByValue="childByValue" v-if="roomVisible" ref="roomVisible"></roomVisible>-->
        <!--        </el-dialog>-->
        <el-dialog :visible.sync="parkingVisible" append-to-body width="55%">
            <!--            <parkingVisible v-on:childByValueParking="childByValueParking" v-if="parkingVisible"-->
            <!--                            ref="parkingVisible"></parkingVisible>-->

            <el-table
                    :data="parkData"
                    border
                    class="table"
                    ref="multipleTable"
                    @row-click="openParkDetails"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="物业公司" align="center"></el-table-column>
                <el-table-column prop="commName" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="areaName" label="分区名称" align="center"></el-table-column>
                <el-table-column prop="no" label="编号" align="center"></el-table-column>
                <el-table-column prop="position" label="位置" align="center"></el-table-column>
                <el-table-column prop="buildingProperty" label="建筑属性" align="center"></el-table-column>
                <el-table-column prop="useProperty" label="使用属性" align="center"></el-table-column>
                <el-table-column prop="vehicleType" label="车辆类型" align="center"></el-table-column>
                <el-table-column prop="height" label="高度" align="center"></el-table-column>
                <el-table-column prop="size" label="尺寸" align="center"></el-table-column>
                <el-table-column prop="array" label="排列形式" align="center"></el-table-column>
                <el-table-column prop="usableTime" label="可用时间" align="center"></el-table-column>
                <el-table-column prop="occupyState" label="占用状态" align="center"></el-table-column>
                <el-table-column prop="inMode" label="入位方式" align="center"></el-table-column>
                <el-table-column prop="createdName" label="录入人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="录入时间" align="center"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog :visible.sync="ownerVisible" title="业主查询"  append-to-body width="55%">
            <el-input v-model="formSearch.ownerName" placeholder="业主名称" width="55" class="handle-input mr10"></el-input>
            <el-input v-model="formSearch.tel" placeholder="电话号码" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="getOwnerByName" style="margin-top: 5px;">搜索
            </el-button>
            <el-table
                    :data="ownerList"
                    border
                    class="table"
                    ref="multipleTable"
                    @row-click="queding"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="name" label="业主名称" min-width="90" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" min-width="75" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certType" label="证件类型" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certNumber" label="证件号码" min-width="155" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="education" label="学历" min-width="75" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="state" label="状态" min-width="55" min-height="55"
                                 align="center"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import {
        listBills,
        resetBill,
        resetBillAll,
        fCostRule,
        listOwner,
        getOwnerByName,
        getOwnerPropId, addBill, payPrice, listBillss, getAccountByOwnerId
    } from '../../api/tariff/bill';
    import compUtil from '../common/comp';
    import distUtil from '../common/distutil';
    import commUtil from '../common/commutil';
    import { insertRoom } from '../../api/room';
    import { getDictItemByDictId, getUserComm } from '../../api/building';
    import roomVisible from '../page/roomChoose';
    import parkingVisible from '../page/parkingChoose';
    import { listCompAll } from '../../api/role';
    import { getParkByOwnerId, getRoomByOwnerId } from '../../api/owner';

    export default {
        components: {
            compUtil, distUtil, commUtil, roomVisible, parkingVisible
        },
        data() {
            return {
                ruleList: [],
                ownerData: [],
                options: [{
                    value: '房产',
                    label: '房产'
                }, {
                    value: '停车位',
                    label: '停车位'
                }, {
                    value: '水表',
                    label: '水表'
                }, {
                    value: '电表',
                    label: '电表'
                }, {
                    value: '燃气表',
                    label: '燃气表'
                }
                ],
                queryRule: { pageNo: 1, size: 100 },
                compId: 0,
                billData: [],
                billData2: [],
                form: {},
                dist: {
                    paymentProp: '请选择是否付款',
                    paymentPropName: 'payment',
                    paymentPropId: '51',
                    overdueProp: '请选择是否逾期',
                    overduePropName: 'overdue',
                    overduePropId: '51',
                    printProp: '请选择是否打印收据',
                    printPropName: 'print',
                    printPropId: '51',
                    invoiceProp: '请选择是否开发票',
                    invoicePropName: 'invoice',
                    invoicePropId: '51'
                },
                query: {
                    pageNo: 1,
                    size: 10
                },
                addVisible: false,
                editVisible: false,
                billSearchVis: false,
                ownerListVis: false,
                addBillVisable: false,
                formSearch: {},
                ownerList: [],
                roomData: [],
                parkData: [],
                payForm: {
                    cost:0,
                    fukuan:0,
                },
                isAdmin: false,
                roomVisible: false,
                parkingVisible: false,
                aaa: false,
                payVisible: false,
                compList: [],
                commList: [],
                wyTypes: [],
                accounts: [],
                multipleSelection: [],
                payPriceVis: false,
                ownerVisible: false,
                accountVis: false,
                price:0,
                payprice: 0,
                ownerBillTitle: '',
                compName: '',
                createName: '',
                pageTotal: 0,
                subMoney:0,
                pageTotal2: 0,
                title: ''
            };
        },
        created() {
            this.init();
            this.costRuleSelect();
            this.ownerlist();

            listCompAll(this.query).then(res => {
                this.compList = res.data.records;
                if (res.data.records.length == 1) {
                    this.otherComp = true;
                    this.query.compName = res.data.records[0].id;
                    getUserComm(res.data.records[0].id).then(res => {
                        if (res.data) {
                            this.form.commId = undefined;
                            this.commList = res.data;
                        }
                    });
                }
            });
            getDictItemByDictId(45).then(res => {
                this.wyTypes = res.data;
            });
        },
        methods: {
            clearOwner() {

            },
            selectOwner(value) {
                this.query.owners = value;
            },
            ownerlist() {
                listOwner(this.query).then(res => {
                    this.ownerData = res.data;
                });
            },
            init() {
                listBillss(this.query).then(res => {
                    console.log(res);
                    this.billData = res.data.records;
                    this.pageTotal = res.data.total;
                });
                getDictItemByDictId(45).then(res => {
                    this.wyTypes = res.data;
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
            print() {

            },
            push() {

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
            reset(id) {
                resetBill(id).then(res => {
                    if (res.code === 0 && res.data) {
                        this.$message.success(`重新生成账单成功`);
                        this.init();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            resetAll() {
                if (this.query.costRuleId) {
                    resetBillAll({ ruleId: this.query.costRuleId }).then(res => {
                        if (res.code === 0 && res.data) {
                            this.$message.success(`重新生成账单成功`);
                            this.init();
                        } else {
                            ``;
                            this.$message.error(res.msg);
                            this.init();
                        }
                    });
                } else {
                    this.$message.error(`请选择费用标准！`);
                }
            },
            costRuleSelect() {
                fCostRule(this.queryRule).then(res => {
                    this.ruleList = res.data.records;
                });
            },
            billSearch() {
                this.ownerVisible = true;
            },
            getOwnerByName() {
                getOwnerByName(this.formSearch).then(res => {
                    console.log(res)
                    if (res.data.length == 0) {
                        this.$message.info('没有找到该业主，请重新核实');
                        this.formSearch = {};
                        this.ownerList = [];
                    } else {
                        this.ownerList = res.data;
                    }

                });
            },
            queding(val) {
                this.ownerListVis = true;
                this.formSearch.ownerId = val.id
                this.payForm.ownerId = val.id
                if (this.formSearch.ownerId) {
                    this.query.ownerId = this.formSearch.ownerId;
                    getOwnerPropId(this.query).then(res => {
                        console.log(res);
                        this.billSearchVis = false;
                        this.aaa = true;
                        this.billData2 = res.data.records;
                        this.pageTotal2 = res.data.total;
                    });
                } else {
                    this.$message.info('信息不完整');
                }
            },
            pay() {
                this.payPriceVis = true;

                this.payVisible = true;
            },
            addBill() {
                this.addBillVisable = true;
                if (localStorage.getItem('ms_username') === 'admin') {
                    this.isAdmin = true;
                }
                this.title = '新增账单';
                this.form = {};
                this.form.state = '未付款';
                this.createName = localStorage.getItem('ms_username');
            },
            compChange(val) {
                if (this.form.compId != undefined || val != undefined) {
                    var compId;
                    if (val == undefined) {
                        compId = this.form.compId;
                    } else {
                        compId = val;
                    }
                    getUserComm(compId).then(res => {
                        if (res.data) {
                            this.commList = res.data;
                        }
                    });
                }
            },
            roomParkingSearch() {
                if (this.form.propertyType != '' && this.form.propertyType != undefined) {
                    if (this.form.propertyType == '房产') {
                        this.roomDetail(this.form.compId, this.form.commId, this.form.commAreaId);
                    } else {
                        this.parkingDetail(this.form.compId, this.form.commId, this.form.commAreaId);
                    }
                } else {
                    this.$message.info('请先选择物业类型，再进行选择');
                }
            },
            roomDetail(compId, commId, commAreaId) {
                this.roomVisible = true;
                getRoomByOwnerId(this.formSearch.ownerId).then(res => {
                    this.roomData = res.data
                });

            },
            parkingDetail(compId, commId, commAreaId) {
                this.parkingVisible = true;
                // this.$nextTick(() => {
                //     this.$refs.parkingVisible.dataInitializationByMeter(compId, commId, commAreaId);
                // });
                getParkByOwnerId(this.formSearch.ownerId).then(res => {
                    this.parkData = res.data
                });

            }, childByValue(list) {
                console.log(list);
                this.roomVisible = false;
                this.form.propertyId = list.id;
                this.form.compId = list.compId;
                this.form.commId = list.commId;
                this.form.commAreaId = list.commAreaId;
                this.form.buildingId = list.buildingId;
                this.form.propertyName = list.buildingNo + '-' + list.unitNo + '-' + list.roomNo;
            },
            childByValueParking(list) {
                this.parkingVisible = false;
                this.form.propertyId = list.id;
                this.form.compId = list.compId;
                this.form.commId = list.commId;
                this.form.commAreaId = list.commAreaId;
                this.form.propertyName = list.no;
            },
            insertBill(title, form) {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        addBill(this.form).then(res => {
                            this.editVisible = false;
                            this.$message.success(`新增成功`);
                            this.init();
                            this.query.ownerId = this.formSearch.ownerId;
                            getOwnerPropId(this.query).then(res => {
                                console.log(res);
                                this.addBillVisable = false;
                                this.billData2 = res.data.records;
                                this.pageTotal2 = res.data.total;
                            });
                        });
                    }
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.payForm.payIds = '';
                this.price = 0;
                const length = this.multipleSelection.length;
                for (let i = 0; i < length; i++) {
                    if (i === length - 1) {
                        this.payForm.payIds += this.multipleSelection[i].id;
                    } else {
                        this.payForm.payIds += this.multipleSelection[i].id + ',';
                    }

                    this.price += this.multipleSelection[i].price-this.multipleSelection[i].payPrice;
                }
                this.payForm.cost = JSON.parse(JSON.stringify(this.price));
            },
            payPrice() {
                if (this.price===0){
                    this.$message({
                        type: 'info',
                        message: '请先选择账单'
                    });
                    return false
                }
                if (Number(this.payForm.cost)=="NaN"){
                    this.$message({
                        type: 'info',
                        message: '实收金额不是数字类型'
                    });
                    return false
                }
                if (this.payForm.cost===0){
                    this.$message({
                        type: 'info',
                        message: '实收金额不能是0'
                    });
                    return false
                }
                if (Number(this.payForm.fukuan)=="NaN"){
                    this.$message({
                        type: 'info',
                        message: '付款金额不是数字类型'
                    });
                    return false
                }
                if (this.payForm.fukuan===0){
                    this.$message({
                        type: 'info',
                        message: '付款金额不能是0'
                    });
                    return false
                }
                if(this.payForm.cost<this.price){
                    this.$confirm('支付的金额不够账单总金额，系统会自动分配金额结算账单，是否确定？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.payPriceVis = false
                        this.$refs['payForm'].validate((valid) => {
                            if (valid) {
                                payPrice(this.payForm).then(res => {
                                    this.editVisible = false;
                                    this.$message.success(`缴费成功`);
                                    getOwnerPropId(this.query).then(res => {
                                        console.log(res);
                                        this.billSearchVis = false;
                                        this.aaa = false;
                                        this.billData2 = res.data.records;
                                        this.pageTotal2 = res.data.total;
                                    });
                                });
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }else if(this.payForm.cost>this.price){
                    this.$confirm('将多余的金额存入预存账户，是否确定？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.payPriceVis = false
                        this.$refs['payForm'].validate((valid) => {
                            if (valid) {
                                payPrice(this.payForm).then(res => {
                                    this.editVisible = false;
                                    this.$message.success(`缴费成功`);
                                    getOwnerPropId(this.query).then(res => {
                                        console.log(res);
                                        this.billSearchVis = false;
                                        this.aaa = false;
                                        this.billData2 = res.data.records;
                                        this.pageTotal2 = res.data.total;
                                    });
                                });
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }else{
                    this.payPriceVis = false
                    this.$refs['payForm'].validate((valid) => {
                        if (valid) {
                            payPrice(this.payForm).then(res => {
                                this.editVisible = false;
                                this.$message.success(`缴费成功`);
                                getOwnerPropId(this.query).then(res => {
                                    console.log(res);
                                    this.billSearchVis = false;
                                    this.aaa = false;
                                    this.billData2 = res.data.records;
                                    this.pageTotal2 = res.data.total;
                                });
                            });
                        }
                    });
                }
            },
            subtract(){
                var re1, re2, m, n;
                try {
                    re1 = this.payForm.fukuan.toString().split(".")[1].length;
                } catch (e) {
                    re1 = 0;
                }
                try {
                    re2 = this.payForm.cost.toString().split(".")[1].length;
                } catch (e) {
                    re2 = 0;
                }
                m = Math.pow(10, Math.max(re1, re2));
                n = (re1 >= re2) ? re1 : re2;
                this.subMoney = ((this.payForm.fukuan * m - this.payForm.cost * m) / m).toFixed(n);
            },
            chooseRoomDetails(val){
                this.roomVisible = false;
                this.form.propertyId = val.id;
                this.form.propertyName = val.roomNo;
            },
            openParkDetails(val){
                this.parkingVisible = false
                this.form.propertyId = val.id;
                this.form.propertyName = val.no;
            },
            getAccount(val){
                if (val==="true"){
                    this.accountVis = true
                    getAccountByOwnerId(this.payForm.ownerId).then(res => {
                        console.log(res);
                        if (res.data.size!=0){
                            this.accounts = res.data
                        }else{
                            this.$message({
                                type: 'info',
                                message: '未查到账户信息，请先添加账户!'
                            });
                        }
                    });
                }else{
                    this.accountVis = false
                }
            },
            closeDialog(){
                this.payForm.accountId=null
                this.payForm.isYc = null
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

    .el-form {
        overflow: hidden;
    }

    .el-table--small td {
        padding: 1px 0;
    }

    .el-input--small .el-input__inner {
        height: 32px;
        width: 200px;
        line-height: 32px;
    }

    .el-dialog__wrapper >>> .el-table__body-wrapper {
        overflow-x: auto;
        overflow-y: auto;
        min-height: 400px;
        max-height: 700px;
    }
    .container >>> .el-table--scrollable-x >>> .el-table__body-wrapper {
        width: 100%;
        overflow: visible;
    }
    .container{
        width: 1845px;
    }
    .myInput{
        width: 75px;
        float: right;
    }
    .myTitle{
        font-size: 24px;

        margin: 10px 0;
    }
    .myCell{
        font-size: 18px;
    }
</style>
