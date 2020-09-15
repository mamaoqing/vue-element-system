<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 仪表管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-select v-model="query.compId" placeholder="请选择" @change="compChange" :disabled="otherComp">
                <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.commId" placeholder="请选择"  @change="commChange">
                <el-option key="qxz" label="请选择社区名称" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.ruleId" placeholder="请选择"  >
                <el-option key="qxz" label="请选择费用标准" value=""></el-option>
                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in ruleList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.accountPeriod" placeholder="账期" class="handle-input mr10" ></el-input>
            <el-select v-model="query.propertyType" placeholder="请选择" >
                <el-option key="qxz" label="请选择物业类型" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in propertyTypeList" >{{types.name}}</el-option>
            </el-select>
            <el-input v-model="query.propertyName" placeholder="物业编号" class="handle-input mr10" ></el-input>
            <el-date-picker
                    v-model="query.alterTimeBegin"
                    placeholder="调整时间开始日期"
                    name="modifiedAt"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <el-date-picker
                    v-model="query.alterTimeEnd"
                    placeholder="调整时间结束日期"
                    name="modifiedAt"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
            <el-input v-model="query.alterBy" placeholder="调整人" class="handle-input mr10" ></el-input>
            <el-select v-model="query.auditor" placeholder="请选择" >
                <el-option key="qxz" label="请选择审核人" value=""></el-option>
                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in auditorList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.state" placeholder="请选择" >
                <el-option key="qxz" label="请选择调整状态" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in stateList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.billState" placeholder="请选择" >
                <el-option key="qxz" label="请选择账单状态" value=""></el-option>
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in billStateList" >{{types.name}}</el-option>
            </el-select>
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">新增</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="exportXls">导出</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                elt
                @row-click="openDetails"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130"></el-table-column>
                <el-table-column prop="compId" label="物业公司id" width="130" v-if="false"></el-table-column>
                <el-table-column prop="commName" label="社区" width="120"></el-table-column>
                <el-table-column prop="commId" label="社区id" width="120" v-if="false"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型"></el-table-column>
                <el-table-column prop="propertyName" label="物业编号"></el-table-column>

                <el-table-column prop="costRuleName" label="费用标准"></el-table-column>
                <el-table-column prop="accountPeriod" label="账期"></el-table-column>
                <el-table-column prop="price" label="费用金额"></el-table-column>
                <el-table-column prop="billState" label="账单状态"></el-table-column>
                <el-table-column prop="state" label="调整状态"></el-table-column>
                <el-table-column prop="alterFee" label="调整金额"></el-table-column>
                <el-table-column prop="alterReason" label="调整理由" width="150"></el-table-column>
                <el-table-column prop="alterByName" label="调整人" width="100"></el-table-column>
                <el-table-column prop="alterTime" label="调整时间" width="155"></el-table-column>
                <el-table-column prop="audiReason" label="审核意见"></el-table-column>
                <el-table-column prop="auditorName" label="审核人" width="100"></el-table-column>
                <el-table-column prop="userName" label="审核人账号" v-if="false"></el-table-column>
                <el-table-column prop="auditTime" label="审核时间" width="155"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click.stop
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="verifyEdit(scope.$index, scope.row)"
                        >审核</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click.stop
                            @click="handleDelete(scope.row)"
                        >删除</el-button>

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
        <!-- 新增弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                    <el-form-item label="物业公司" prop="compId" >
                        <el-select v-model="form.compId" placeholder="请选择" @change="compChange" :disabled="edit">
                            <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="社区名称" prop="commId" >
                        <el-select v-model="form.commId" placeholder="请选择"  @change="commChange" :disabled="edit">
                            <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="费用标准"  prop="costRuleName" :disabled="false" >
                        <el-input v-model="form.costRuleName" :disabled="true" style="width: 130px;"></el-input>
                        <el-button
                                type="text"
                                icon="el-icon-search"
                                @click.stop
                                @click="billSearch()"
                        >选择账单</el-button>
                    </el-form-item>
                    <el-form-item label="账期" prop="accountPeriod">
                        <el-input v-model="form.accountPeriod" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="物业类型" prop="propertyType">
                        <el-input v-model="form.propertyType" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="物业编号"  prop="propertyName">
                        <el-input v-model="form.propertyName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="费用金额"  prop="price">
                        <el-input v-model="form.price" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="账单状态"  prop="billState">
                        <el-input v-model="form.billState" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="调整金额" prop="alterFee">
                        <el-input v-model="form.alterFee"></el-input>
                    </el-form-item>
                    <el-form-item label="调整原因" prop="alterFee">
                        <el-input v-model="form.alterReason"></el-input>
                    </el-form-item>
                    <el-form-item label="调整人" prop="alterBy">
                        <el-input v-model="form.alterBy" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="调整时间" prop="alterTime">
                        <el-date-picker
                                v-model="form.alterTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                disabled
                                style="width: 205px;"
                        />
                    </el-form-item>
                    <el-form-item label="审核人" prop="auditor" >
                        <el-select v-model="form.auditor" placeholder="请选择" @change="select_status">
                            <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in auditorList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','')">提 交</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="updateVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-form-item label="物业公司" prop="compId" >
                    <el-select v-model="form.compId" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" prop="commId" >
                    <el-select v-model="form.commName" placeholder="请选择"  :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物业类型" prop="propertyType">
                    <el-input v-model="form.propertyType" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="物业编号"  prop="propertyName" >
                    <el-input v-model="form.propertyName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="费用标准"  prop="costRuleName" >
                    <el-input v-model="form.costRuleName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账期" prop="accountPeriod">
                    <el-input v-model="form.accountPeriod" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="费用金额"  prop="price" >
                    <el-input v-model="form.price" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="账单状态"  prop="billState" >
                    <el-input v-model="form.billState" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="调整状态"  prop="state" >
                    <el-input v-model="form.state" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="调整金额" prop="alterFee">
                    <el-input v-model="form.alterFee"></el-input>
                </el-form-item>
                <el-form-item label="调整原因" prop="alterFee">
                    <el-input v-model="form.alterReason"></el-input>
                </el-form-item>
                <el-form-item label="调整人" prop="alterByName">
                    <el-input v-model="form.alterByName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="调整时间" prop="alterTime">
                    <el-date-picker
                            v-model="form.alterTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            disabled
                            style="width: 205px;"
                            :disabled="true"
                    />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>

                <el-form-item label="审核人" prop="type" >
                    <el-select v-model="form.auditor" placeholder="请选择" @change="select_status">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in auditorList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核时间" prop="auditTime">
                    <el-input v-model="form.auditTime" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="审核意见" prop="audiReason">
                    <el-input v-model="form.audiReason" style="width: 400px;" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','')" v-if="edit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 审核弹出框 -->
        <el-dialog :title="title" :visible.sync="verifyVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-form-item label="物业公司" prop="compId" >
                    <el-select v-model="form.compId" placeholder="请选择" @change="compChange" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区名称" prop="commName" >
                    <el-select v-model="form.commName" placeholder="请选择"  :disabled="edit">
                        <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物业类型" prop="propertyType">
                    <el-input v-model="form.propertyType" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="物业编号"  prop="propertyName" >
                    <el-input v-model="form.propertyName" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="费用标准"  prop="costRuleName" >
                    <el-input v-model="form.costRuleName" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="账期" prop="accountPeriod">
                    <el-input v-model="form.accountPeriod" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="费用金额"  prop="price">
                    <el-input v-model="form.price" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账单状态"  prop="billState" :disabled="false" >
                    <el-input v-model="form.billState" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="调整状态"  prop="state" :disabled="false" >
                    <el-input v-model="form.state" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="调整金额" prop="alterFee">
                    <el-input v-model="form.alterFee" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="调整原因" prop="alterFee">
                    <el-input v-model="form.alterReason" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="调整人" prop="alterBy">
                    <el-input v-model="form.alterBy" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="调整时间" prop="alterTime">
                    <el-input v-model="form.alterTime" :disabled="true" style="width: 205px;"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="审核人" prop="type" >
                    <el-select v-model="form.auditor" placeholder="请选择" :disabled="edit">
                        <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in auditorList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核时间" prop="auditTime">
                    <el-date-picker
                            v-model="form.auditTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            disabled
                            style="width: 205px;"
                    />
                </el-form-item>
                <el-form-item label="审核意见" prop="audiReason">
                    <el-input v-model="form.audiReason" style="width: 400px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEditOrAdd(title,'form','同意')">同意</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','不同意')">不同意</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="detailVisible" width="50%" append-to-body>
            <el-form ref="form" :model="form"   :rules="rules" :disabled="disable">
                <h2 style="padding-bottom: 2px;">&nbsp;&nbsp;账单详情</h2>
                <div class="link-top"></div>
                <div class="link-bottom"></div>
                <el-row>
                    <el-col :span="6" style="width: 250px;">
                        <el-form-item label="物业公司" label-width="80px">
                            <el-select v-model="form.compId" placeholder="请选择" style="width: 140px;"  :disabled="edit">
                                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 220px;">
                        <el-form-item label="社区名称" label-width="80px">
                            <el-select v-model="form.commName" placeholder="请选择" style="width: 140px;" :disabled="edit">
                                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 220px;">
                        <el-form-item label="账单号" label-width="90px">
                            <el-input :value="billDetail.billNo" :disabled="true" style="width: 140px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 220px;">
                        <el-form-item label="费用标准"label-width="100px">
                            <el-input :value="billDetail.ruleName" :disabled="true" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" style="width: 150px;">
                        <el-form-item label="物业类型" label-width="80px">
                            <el-input :value="billDetail.propertyType" :disabled="true" style="width: 70px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="width: 165px;">
                        <el-form-item label="物业编号" label-width="75px">
                            <el-input :value="billDetail.no" :disabled="true" style="width: 90px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="width: 205px;">
                        <el-form-item label="账单生成时间" label-width="100px">
                            <el-input :value="billDetail.billTime" :disabled="true" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="width: 205px;" >
                        <el-form-item label="付款结束时间" label-width="100px">
                            <el-input :value="billDetail.payEndTime" :disabled="true" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 80px;">
                        <el-form-item label="账单状态" label-width="75px">
                            <el-input :value="billDetail.state" :disabled="true" style="width: 90px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" style="width: 190px;">
                        <el-form-item label="账单总金额" label-width="95px">
                            <el-input :value="billDetail.price" :disabled="true" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" style="width: 265px;">
                        <el-form-item label="逾期费用计费规则" label-width="135px">
                            <el-input :value="billDetail.overdueRule" :disabled="true" style="width: 120px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 140px;">
                        <el-form-item label="费用调整" label-width="75px">
                            <el-input :value="billDetail.salePrice" :disabled="true" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 155px;">
                        <el-form-item label="账期" label-width="45px">
                            <el-input :value="billDetail.accountPeriod" :disabled="true" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 110px;">
                        <el-form-item label="是否开发票" label-width="90px">
                            <el-input :value="billDetail.isInvoice" :disabled="true" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" style="width: 125px;" v-if="billDetail.state=='未付款'">
                        <el-form-item label="是否付款" label-width="80px">
                            <el-input :value="billDetail.isPayment" :disabled="true" style="width: 45px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 120px;" v-if="billDetail.state=='未付款'">
                        <el-form-item label="付款金额" label-width="75px">
                            <el-input :value="billDetail.payPrice" :disabled="true" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 120px;" v-if="billDetail.state=='未付款'">
                        <el-form-item label="是否逾期" label-width="75px">
                            <el-input :value="billDetail.isOverdue" :disabled="true" style="width: 45px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 125px;" v-if="billDetail.state=='未付款'">
                        <el-form-item label="逾期费用" label-width="75px">
                            <el-input :value="billDetail.overdueCost" :disabled="true" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 125px;">
                        <el-form-item label="起始刻度" label-width="80px">
                            <el-input :value="billDetail.beginScale" :disabled="true" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 125px;">
                        <el-form-item label="结束刻度" label-width="75px">
                            <el-input :value="billDetail.endScale" :disabled="true" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 150px;">
                        <el-form-item label="是否打印收据" label-width="100px">
                            <el-input :value="billDetail.isPrint" :disabled="true" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form ref="form" :model="form"  :rules="rules" :disabled="disable">
                <h2 style="padding-bottom: 2px;">&nbsp;&nbsp;费用调整</h2>
                <div class="link-top"></div>
                <div class="link-bottom"></div>
                <el-row>
                    <el-col :span="6" style="width: 130px;">
                        <el-form-item label="调整金额" label-width="80px" >
                            <el-input v-model="form.alterFee" style="width: 50px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 580px;">
                        <el-form-item label="调整原因" label-width="80px">
                            <el-input v-model="form.alterReason" style="width: 500px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 180px;">
                        <el-form-item label="调整状态" label-width="80px" >
                            <el-input v-model="form.state" :disabled="true" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" style="width: 180px;">
                        <el-form-item label="调整人" label-width="65px" >
                            <el-input v-model="form.alterByName" :disabled="true" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 235px;">
                        <el-form-item label="调整时间" label-width="80px">
                            <el-input v-model="form.alterTime" :disabled="true" style="width: 155px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 490px;">
                        <el-form-item label="备注" prop="remark" label-width="45px" >
                            <el-input v-model="form.remark" style="width: 430px;"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="6" style="width: 510px;">
                        <el-form-item label="审核意见" label-width="80px">
                            <el-input v-model="form.audiReason" style="width: 430px;" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 155px;">
                        <el-form-item label="审核人" label-width="65px">
                            <el-select v-model="form.auditor" placeholder="请选择" style="width: 90px;" @change="select_status">
                                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in auditorList" >{{types.name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 225px;">
                        <el-form-item label="审核时间" label-width="80px">
                            <el-input v-model="form.auditTime" :disabled="true" style="width: 145px;"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','')" v-if="edit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="billVisible" append-to-body width="55%" >
            <billVisible v-on:childByValue="childByValue" v-if="billVisible" ref="billVisible"></billVisible>
        </el-dialog>
    </div>
</template>

<script scope>
import { getUserComm, getDictItemByDictId, getCommArea } from '../../api/building';
import { listCompAll } from '../../api/role';
import { insertBillAlter,deleteBillAlter,updateBillAlter,listBillAlter,getRuleList,getAuditorList,getPropertyName,getCostRuleName,exportXlsByT} from '../../api/tariff/billAlter';
import { listBills } from '../../api/tariff/bill';
import billVisible from './bill';
export default {
    name:"roomlistpage",
    props:{
        unitId:''
    },
    data() {
        let checkcompId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业公司名称"));
            }else{
                return callback();
            }
        }
        let checkcommId= (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入社区名称"));
            }else{
                return callback();
            }
        }
        let checkcostRuleName = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入费用标准"));
            }else{
                return callback();
            }
        }
        let checkpropertyType = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业类型"));
            }else{
                return callback();
            }
        }
        let checkaccountPeriod = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入账期"));
            }else{
                return callback();
            }
        }
        let checkpropertyName = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业编号"));
            }else{
                return callback();
            }
        }
        let checkprice = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入费用金额"));
            }else{
                return callback();
            }
        }
        let checkbillState = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入账单状态"));
            }else{
                return callback();
            }
        }
        let checkalterFee = (rule,value,callback) =>{
            if (!value) {
                return callback(new Error("请输入调整金额"));
            } else {
                var reg = /^-?\d{1,16}(?:\.\d{1,3})?$/;//小数点左边最高16位，小数点右边最多3位
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error("输入正确的数字,小数点后可1到3位"));
                }
            }
        }
        let checkalterReason = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入调整原因"));
            }else{
                return callback();
            }
        }
        let checkauditor = (rule,value,callback) =>{
            value = this.form.auditor;
            if(!value){
                return callback(new Error("请输入审核人"));
            }else{
                return callback();
            }
        }
        let checkaudiReason = (rule,value,callback) =>{
            debugger
            if(!value){
                return callback(new Error("请输入审核意见"));
            }else{
                return callback();
            }
        }
        return {
            query: {
                compId:'',
                commId:'',
                ruleId:'',
                accountPeriod:'',
                propertyType:'',
                propertyName:'',
                alterTimeBegin:'',
                alterTimeEnd:'',
                alterBy:'',
                auditor:'',
                alterByName:'',
                state:'',
                billState:'',
                costRuleName:'',
                price:'',
                audiReason:'',
                auditTime:'',
                alterFee:'',
                alterReason:'',
                alterTime:'',
                type:'费用调整审核人',
                pageNo: 1,
                size: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            updateVisible:false,
            verifyVisible:false,
            detailVisible:false,
            edit:false,
            otherComp:false,
            pageTotal:0,
            disable:false,
            compList:[],
            commList:[],
            billVisible:false,
            propertyTypeList:[],//物业类型
            ruleList:[],//费用标准
            auditorList:[],//审核人
            stateList:[],//调整状态
            billStateList:[],//账单状态
            updateChoose:false,
            form: {},
            billDetail:{},
            no:'',
            formCopy:{},
            unitForm:{},
            priceCul:'',
            alterFee:'',
            state:'',
            status:0,
            meterReadTime:'',
            billDate:'',
            list:'',
            idx: -1,
            title:'',
            buildingName:'',
            buildingNo:'',
            id: -1,
            rules:{
                compId:[{
                    validator:checkcompId,required: true,trigger:'blur'
                }],
                commId:[{
                    validator:checkcommId,required: true,trigger:'blur'
                }],
                costRuleName:[{
                    validator:checkcostRuleName,required: true,trigger:'blur'
                }],//费用标准
                accountPeriod:[{
                    validator:checkaccountPeriod,required: true,trigger:'blur'
                }],//账期
                propertyType:[{
                    validator:checkpropertyType,required: true,trigger:'blur'
                }],//物业类型
                propertyName:[{
                    validator:checkpropertyName,required: true,trigger:'blur'
                }],//物业编号
                price:[{
                    validator:checkprice,required: true,trigger:'blur'
                }],//费用金额
                billState:[{
                    validator:checkbillState,required: true,trigger:'blur'
                }],//账单状态
                alterFee:[{
                    validator:checkalterFee,required: true,trigger:'blur'
                }],// 调整金额
                alterReason:[{
                    validator:checkalterReason,required: true,trigger:'blur'
                }],// 调整原因
                auditor:[{
                    validator:checkauditor,required: true,trigger:'blur'
                }],// 审核人
                audiReason:[{
                    validator:checkaudiReason,required: true,trigger:'blur'
                }]
            }
        };
    },
    created() {
        this.query.unitId = this.unitId
        this.getData();

    },
    components:{
        billVisible
     },
    methods: {
        childByValueUpload(){
            this.cmpVisible=false;
            this.getData();
        },
        compChange(val){
            debugger
            if(this.form.compId!=undefined||val!=undefined){
                var compId;
                if(val==undefined){
                    compId = this.form.compId;
                }else{
                    compId = val;
                }
                getUserComm(compId).then(res => {
                    if(res.data){
                        this.form.commId=undefined;
                        this.commList = res.data;
                    }
                });
            }
        },
        commChange(val){
            if(this.form.commId!=undefined||val!=undefined){
                var commId;
                if(this.form.commId!=undefined&&this.form.commId!=''){
                    commId = this.form.commId;
                }else{
                    commId = val;
                }
                this.form.auditor = undefined;
                getAuditorList({commName:commId,type:'费用调整审核人'}).then(res => {//审核人
                    if(res.data){
                        this.auditorList = res.data;
                    }
                });
            }
        },
        exportXls(){
            exportXlsByT(this.query).then(res => {
                var blob = new Blob([res],{type:'application/octet-stream'},'sheet.xlsx')
                if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                    window.navigator.msSaveBlob(blob, unescape(res.headers.filename.replace(/\\u/g, '%u')));
                } else {
                    var downloadElement = document.createElement('a');
                    var href = window.URL.createObjectURL(blob); //创建下载的链接

                    downloadElement.href = href;
                    downloadElement.download = unescape('费用调整信息'+this.getTime()+'.xls'); //下载后文件名

                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //点击下载

                    document.body.removeChild(downloadElement); //下载完成移除元素

                    window.URL.revokeObjectURL(href); //释放掉blob对象
                }
            });
        },
        getTime(){
            let date = new Date();
            let yy = date.getFullYear();
            let mm = date.getMonth() + 1;
            if(mm<10){
                mm = '0'+mm;
            }
            let dd = date.getDate();
            if(dd<10){
                dd = '0'+dd;
            }
            let h = date.getHours();
            if(h<10){
                h = '0'+h;
            }
            let m = date.getMinutes();
            if(m<10){
                m = '0'+m;
            }
            let s = date.getSeconds();
            if(s<10){
                s = '0'+s;
            }
            let ms = date.getMilliseconds();
            let time = yy+""+mm+""+dd+""+h+""+m+""+s+""+ms;
            return time;
        },
        select_status(val){
            this.$forceUpdate();
            this.$set(this.form, "auditor", val);
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            listCompAll(this.query).then(res => {
                // debugger
                this.compList = res.data.records;
                if(res.data.records.length==1){
                    this.otherComp = true;
                    this.query.compId=res.data.records[0].id;
                    getUserComm(res.data.records[0].id).then(res => {
                        if(res.data){
                            this.form.commId=undefined;
                            this.commList = res.data;
                        }
                    });
                }
                listBillAlter(this.query).then(res => {
                    // debugger
                    console.log(this.query.unitId)
                    this.tableData = res.data.records;
                    this.pageTotal = res.data.total || 0;
                });
            });
            getDictItemByDictId(45).then(res => {//45是物业类型
                this.propertyTypeList = res.data;
            });
            getRuleList('').then(res => {//费用标准
                if(res.data){
                    this.ruleList = res.data;
                }
            });
            getAuditorList(this.query).then(res => {//审核人
                if(res.data){
                    this.auditorList = res.data;
                }
            });
            getDictItemByDictId(56).then(res => {//56调整状态
                this.stateList = res.data;
            });
            getDictItemByDictId(57).then(res => {//57账单状态
                this.billStateList = res.data;
            });
        },

        // 触发搜索按钮
        handleSearch() {
            this.query.pageNo=1;
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        delAllSelection() {
            debugger
            const length = this.multipleSelection.length;
            let str = '';
            let ids = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
                ids += this.multipleSelection[i].id + ',';
            }
            /*deleteRoom(ids).then(res => {
                //console.log(res);
                this.$message.success(`删除了${str}`);
                this.multipleSelection = [];
                this.getData();
            });*/
            this.handleDelete(ids);
        },
        // 删除操作
        handleDelete(row) {
            if(row.state=='不同意'){
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteBillAlter(row.id).then(res => {
                            if(res.data){
                                this.$message.success("删除成功");
                                this.getData();
                            }else{
                                this.$message.success("删除失败");
                            }
                        });
                    })
                    .catch(() => {});
            }else{
                this.$message.info("已提交和同意的费用调整不可删除");
            }
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleAdd() {
            debugger
            this.form = {};
            this.editVisible = true;
            this.title="新增费用调整";
            this.disable=false;
            this.form.state='在用';
            this.status = 0;
            this.$set(this.form, "alterBy", localStorage.getItem('ms_username'));
            this.$set(this.form, "alterTime", this.nowTime());
            this.edit=false;
            this.$refs.form.clearValidate();
        },
        nowTime(){
            let date = new Date();
            let yy = date.getFullYear();
            let mm = date.getMonth();
            let dd = date.getDate();
            let h = date.getHours();
            let m = date.getMinutes();
            let s = date.getSeconds();
            return new Date(yy, mm, dd, h, m,s);
        },
        uploadFile(){
            this.uploadVisible = true;
            this.title="导入";
        },
        childByValue(list){
            debugger
            this.billVisible = false;
            this.$set(this.form, "costRuleName", list.ruleName);//费用标准
            this.$set(this.form, "billId", list.id);//账期
            this.$set(this.form, "accountPeriod", list.accountPeriod);//账期
            this.$set(this.form, "propertyType", list.propertyType);//物业类型
            this.$set(this.form, "propertyName", list.no);//物业编号
            this.$set(this.form, "price", list.price);//费用金额
            //调整金额的负值不能大于（账单总价格-已经付的钱+逾期产生的费用+费用调整）
            this.priceCul = list.price-list.payPrice+list.overdueCost+list.salePrice;
            this.$set(this.form, "billState", list.state);//账单状态
        },
        propertyTypeChage(){
            this.form.propertyId = '';
            this.form.propertyName = '';
        },
        // 编辑操作
        handleEdit(index, row) {
            if(row.state=='不同意'){
                this.idx = index;
                this.form = row;
                this.updateVisible = true;
                this.disable=false;
                this.no = row.no;
                this.status = 1;
                this.alterFee = row.alterFee;
                this.edit=true;
                this.title="编辑费用调整";
                this.$set(this.form, "alterBy", localStorage.getItem('ms_username'));
                this.$set(this.form, "alterTime", this.nowTime());
                this.$refs.form.clearValidate();
            }else if(row.state=='同意'){
                this.$message.info(`该费用调整已审核通过，不可编辑`);
            }else{
                this.$message.info(`该费用调整已提交，不可编辑`);
            }

        },
        verifyEdit(index, row) {
            if(row.userName==localStorage.getItem('ms_username')&&row.state=='已提交'){
                this.idx = index;
                this.form = row;
                this.verifyVisible = true;
                this.disable=false;
                this.no = row.no;
                this.status = 1;
                this.alterFee = row.alterFee;
                this.edit=true;
                this.title="审核费用调整";
                this.$set(this.form, "auditTime", this.nowTime());
                this.$refs.form.clearValidate();
            }else if(row.state=='不同意'){
                this.$message.info(`该费用调整状态为不同意，不可审核`);
            }else{
                this.$message.info(`您没有审核权限，不可审核`);
            }

        },
        upload(){
            //let linkID = id;
            this.cmpVisible = true;
            this.$nextTick(()=>{
                this.$refs.menu1.dataInitializationUpload("http://localhost:8900/api/fMeter/upload");
            })

        },
        billSearch(){
            if(this.form.compId!=''&&this.form.compId!=undefined&&this.form.commId!=''&&this.form.commId!=undefined){
                this.billDetail1(this.form.compId,this.form.commId);
            }else{
                this.$message.info("请先选择物业公司、社区，再进行选择");
            }
        },
        billDetail1(compId, commId){
            this.billVisible = true;
            this.$nextTick(()=>{
                this.$refs.billVisible.dataInitializationByByBillAlter(compId,commId);
            })

        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            this.disable=true;
            this.detailVisible = true;
            this.title="查看费用调整";
            this.status = 2;
            listBills({id:row.billId,pageNo: 1, size: 10}).then(res => {
                debugger
                this.billDetail= res.data.records[0];
            });
        },
        format(val){
            let read = new Date(val);
            let yy = read.getFullYear();
            let mm = read.getMonth()+1;
            let dd = read.getDate();
            let h = read.getHours();
            let m = read.getMinutes();
            let s = read.getSeconds();
            return yy+"-"+mm+"-"+dd+" "+h+":"+m+":"+s;
        },

        // 保存编辑
        saveEditOrAdd(title,form,state) {
            if(title==='新增费用调整'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        debugger
                        this.form.alterTime = this.format(this.form.alterTime);
                        this.form.alterBy = '';
                        //调整金额的负值不能大于（账单总价格-已经付的钱+逾期产生的费用+费用调整）
                        if(this.form.alterFee*-1>this.priceCul){
                            this.$message.info("减免金额不能大于应付金额");
                        }else{
                            insertBillAlter(this.form).then(res => {
                                if(res.data){
                                    this.editVisible = false;
                                    this.$message.success(`新增成功`);
                                    this.getData();
                                }else{
                                    this.editVisible = false;
                                    this.$message.error("新增失败");
                                }
                            });
                        }
                    }
                });
            }else {
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        this.form.state = state;
                        this.form.alterTime = this.format(this.form.alterTime);
                        this.form.alterBy = '';
                        this.form.auditTime = this.format(this.form.auditTime);
                        updateBillAlter(this.form).then(res => {
                            if(res.data=='1'){
                                if(state!=''&&state!=undefined){
                                    this.verifyVisible = false;
                                    this.$message.success(`审核成功`);
                                }else{
                                    this.updateVisible = false;
                                    this.$message.success(`编辑第 ${this.idx + 1} 行成功`);
                                }
                                this.getData();
                            }else if(res.data=='2'){
                                this.$message.info("减免金额不能大于应付金额");
                            }else{
                                if(state!=''&&state!=undefined){
                                    this.verifyVisible = false;
                                    this.$message.error("审核失败");
                                }else{
                                    this.updateVisible = false;
                                    this.$message.error("编辑失败");
                                }
                            }
                        });
                    }
                });
            }
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
.link-top {
    width: 98%;
    height: 1px;
    padding: 0 15px 0 0;
    float:right;
    border-top: solid #ACC0D8 1px;
}
.link-bottom {
    width: 98%;
    height: 1px;
    padding: 0 15px 3px 0;
    float:right;
    border-top: solid #ACC0D8 1px;
}
</style>
