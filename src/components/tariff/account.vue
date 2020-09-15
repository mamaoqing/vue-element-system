<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  费用预存管理
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
            <el-input v-model="query.ownerName" placeholder="业主名称" class="handle-input mr10" ></el-input>
            <el-select v-model="query.propertyType" placeholder="请选择物业类型" @change="typeChange">
                <el-option :value="types.name" :key="types.name" :label="types.name" v-for="types in propertyTypeList" >{{types.name}}</el-option>
            </el-select>
            <el-select v-model="query.propertyName" placeholder="请选择物业编号" >
                <el-option key="qxz" label="请选择物业编号" value=""></el-option>
                <el-option :value="types.id" :key="types.propertyName" :label="types.propertyName" v-for="types in typeNameList" >{{types.propertyName}}</el-option>
            </el-select>
            <el-input v-model="query.name" placeholder="账户名称" class="handle-input mr10" ></el-input>
            <el-input v-model="query.no" placeholder="预存账号编号" class="handle-input mr10" ></el-input>

            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">预存</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                elt
                @row-click="openDetails"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="compName" label="物业公司" width="130"></el-table-column>
                <el-table-column prop="compId" label="物业公司id" width="130" v-if="false"></el-table-column>
                <el-table-column prop="commName" label="社区" width="120"></el-table-column>
                <el-table-column prop="commId" label="社区id" width="120" v-if="false"></el-table-column>
                <el-table-column prop="ownerName" label="业主名称"></el-table-column>
                <el-table-column prop="ownerTel" label="业主联系电话"></el-table-column>
                <el-table-column prop="ownerId" label="业主id" v-if="false"></el-table-column>
                <el-table-column prop="name" label="预存账号名称"></el-table-column>
                <el-table-column prop="no" label="预存账号编号"></el-table-column>
                <el-table-column prop="fee" label="预存金额"></el-table-column>
                <el-table-column prop="createdName" label="创建人" ></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="155" ></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" ></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" width="155" ></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click.stop
                            @click="renewAccount(scope.$index, scope.row)"
                        >续费</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click.stop
                                @click="castAccount(scope.$index, scope.row)"
                        >提现</el-button>
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
                        <el-select v-model="form.commId" placeholder="请选择"  @change="select_status" :disabled="edit">
                            <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择业主"  prop="ownerId" >
                        <el-input v-model="form.ownerId" v-show="false"></el-input>
                        <el-input v-model="form.ownerName" :disabled="true" style="width: 150px"></el-input>
                        <el-button
                                type="text"
                                icon="el-icon-search"
                                @click.stop
                                @click="selectOwner()"
                        >选择</el-button>
                    </el-form-item>
                    <el-form-item label="费用标准"  prop="ruleId" :disabled="false" >
                        <el-input v-model="form.ruleId" v-show="false"></el-input>
                        <el-input v-model="form.ruleName" style="width: 150px"></el-input>
                        <el-button
                                type="text"
                                icon="el-icon-search"
                                @click.stop
                                @click="selectRule()"
                        >选择</el-button>
                    </el-form-item>
                    <el-form-item label="物业类型" prop="propertyType">
                        <el-input v-model="form.propertyType" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="物业编号" prop="propertyId">
                        <el-input v-model="form.propertyId" v-show="false"></el-input>
                        <el-input v-model="form.propertyName" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="账户名称" prop="name">
                        <el-input v-model="form.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="账户类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择"   :disabled="edit">
                            <el-option :value="types.name" :key="types.name"  :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="预存账号编号" prop="no">
                        <el-input v-model="form.no" :disabled="edit"></el-input>
                    </el-form-item>
                    <el-form-item label="预存金额"  prop="fee">
                        <el-input v-model="form.fee" :disabled="edit"></el-input>
                    </el-form-item>
                    <el-form-item label="增加额"  prop="feeAdd" v-if="feeAddShow">
                        <el-input v-model="form.feeAdd" ></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式"  prop="paymentMethod" >
                        <el-select v-model="form.paymentMethod" placeholder="请选择"  >
                            <el-option :value="types.name" :key="types.name"  :label="types.name" v-for="types in paymentMethodList" >{{types.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注"  prop="remark">
                        <el-input v-model="form.remark" ></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','')">提 交</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="detailVisible" width="60%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" :disabled="disable">
                <el-row>
                    <el-col :span="6" style="width: 280px;">
                        <el-form-item label="物业公司" label-width="120px">
                            <el-select v-model="form.compId" placeholder="请选择" style="width: 160px;" :disabled="true">
                                <el-option :value="types.id" :key="types.name" :label="types.name" v-for="types in compList" >{{types.name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 260px;">
                        <el-form-item label="社区名称" label-width="100px">
                            <el-select v-model="form.commName" placeholder="请选择" style="width: 160px;" :disabled="true">
                                <el-option :value="types.id" :key="types.name"  :label="types.name" v-for="types in commList" >{{types.name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 200px;">
                        <el-form-item label="业主名称"  label-width="100px">
                            <el-input v-model="form.ownerName" :disabled="true" style="width: 100px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 260px;">
                        <el-form-item label="业主联系电话"  label-width="120px" >
                            <el-input v-model="form.ownerTel" style="width: 140px" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" style="width: 220px;">
                        <el-form-item label="预存账号名称" label-width="120px">
                            <el-input v-model="form.name" :disabled="true" style="width: 140px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 240px;">
                        <el-form-item label="预存账号编号" label-width="140px">
                            <el-input v-model="form.no" :disabled="true" style="width: 100px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 160px;">
                        <el-form-item label="预存金额" label-width="80px">
                            <el-input v-model="form.fee" :disabled="true" style="width: 80px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 380px;">
                        <el-form-item label="备注" label-width="80px">
                            <el-input v-model="form.remark" :disabled="true" style="width: 300px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" style="width: 240px;">
                        <el-form-item label="录入人" label-width="120px">
                            <el-input v-model="form.createdName"  :disabled="true" style="width: 120px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 240px;">
                        <el-form-item label="录入时间" label-width="80px">
                            <el-input v-model="form.createdAt" :disabled="true" style="width: 160px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 220px;">
                        <el-form-item label="修改人" label-width="80px">
                            <el-input v-model="form.modifiedName"  :disabled="true" style="width: 120px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="width: 240px;">
                        <el-form-item label="修改时间" label-width="80px">
                            <el-input v-model="form.modifiedAt" :disabled="true" style="width: 160px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="container">
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-cascades"></i> 财务流水列表
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-table
                        :data="tableData4"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                    <el-table-column prop="no" label="流水单号" width="120" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="accountName" label="账户名称" min-width="110" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="accountNo" label="账户编号" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="ownerName" label="业主名" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="cost" label="金额" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="operType" label="操作类型" align="center" min-width="75"
                                     min-height="55"></el-table-column>
                    <el-table-column prop="paymentMethod" label="支付方式" align="center" min-width="75"
                                     min-height="55"></el-table-column>
                    <el-table-column prop="createdName" label="操作人" align="center" min-width="75"
                                     min-height="55"></el-table-column>
                    <el-table-column prop="createdAt" label="操作时间" align="center" min-width="155"
                                     min-height="55"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query4.pageNo"
                            :page-size="query4.size"
                            :total="pageTotal4"
                            @current-change="handlePageChange4"
                    ></el-pagination>
                </div>
            </div>
            <div class="container">
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-cascades"></i> 账单支付信息列表
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-table
                        :data="tableData5"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                >
                    <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                    <el-table-column prop="no" label="财务流水编号" min-width="90" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="accountNo" label="账单编号" min-width="90" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="name" label="费用标准名称" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="cost" label="金额" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="createdName" label="操作人" align="center" min-width="75"
                                     min-height="55"></el-table-column>
                    <el-table-column prop="createdAt" label="操作时间" align="center" min-width="155"
                                     min-height="55"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query5.pageNo"
                            :page-size="query5.size"
                            :total="pageTotal5"
                            @current-change="handlePageChange5"
                    ></el-pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','')">提 交</el-button>
            </span>
        </el-dialog>
        <!--   选择业主弹出框     -->
        <el-dialog  :visible.sync="selectOwnerVis" append-to-body>
            <div class="container">
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-cascades"></i> 点击选择业主
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-input v-model="query2.name" placeholder="业主名称" class="handle-input mr10" ></el-input>
                <div class="handle-box">
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch1" >搜索</el-button>
                </div>
                <el-table
                        :data="tableData2"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @row-click="chooseDetails"
                >
                    <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
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
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query2.pageNo"
                            :page-size="query2.size"
                            :total="pageTotal2"
                            @current-change="handlePageChange2"
                    ></el-pagination>
                </div>
            </div>
        </el-dialog>
        <el-dialog  :visible.sync="selectRules" append-to-body>
            <div class="container">
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-cascades"></i> 点击选择费用标准
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-table
                        :data="tableData3"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @row-click="chooseRuleDetails"
                >
                    <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                    <el-table-column prop="name" label="业主类型" min-width="90" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="propertyType" label="物业类型" min-width="90" min-height="55"
                                     align="center"></el-table-column>
                    <el-table-column prop="property_id" label="物业id" min-width="125" min-height="55" v-show="false"
                                     align="center"></el-table-column>
                    <el-table-column prop="propertyName" label="物业编号" min-width="125" min-height="55"
                                     align="center"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :total="pageTotal3"
                            @current-change="handlePageChange3"
                    ></el-pagination>
                </div>
            </div>
        </el-dialog>
        <!-- 续费弹出框 -->
        <el-dialog :title="title" :visible.sync="updateVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" >
                <el-form-item label="账户名称" prop="name">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账户类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择"   :disabled="true">
                        <el-option :value="types.name" :key="types.name"  :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预存账号编号" prop="no">
                    <el-input v-model="form.no" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="预存金额"  prop="fee">
                    <el-input v-model="form.fee" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="增加额"  prop="feeAdd" >
                    <el-input v-model="form.feeAdd" ></el-input>
                </el-form-item>
                <el-form-item label="支付方式"  prop="paymentMethod" >
                    <el-select v-model="form.paymentMethod" placeholder="请选择"   :disabled="edit">
                        <el-option :value="types.name" :key="types.name"  :label="types.name" v-for="types in paymentMethodList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注"  prop="remark">
                    <el-input v-model="form.remark" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','')">确定</el-button>
            </span>
        </el-dialog>
        <!-- 提现弹出框 -->
        <el-dialog :title="title" :visible.sync="castVisible" width="40%" append-to-body>
            <el-form ref="form" :model="form" label-width="120px"  :rules="rules" >
                <el-input v-model="form.compId" v-if="false"></el-input>
                <el-input v-model="form.commId" v-if="false"></el-input>
                <el-input v-model="form.ownerId" v-if="false"></el-input>
                <el-form-item label="账户名称" prop="name">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账户类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择"   :disabled="true">
                        <el-option :value="types.name" :key="types.name"  :label="types.name" v-for="types in typeList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预存账号编号" prop="no">
                    <el-input v-model="form.no" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="预存金额"  prop="fee">
                    <el-input v-model="form.fee" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="提现额"  prop="feeAdd" >
                    <el-input v-model="form.feeAdd" ></el-input>
                </el-form-item>
                <el-form-item label="支付方式"  prop="paymentMethod" >
                    <el-select v-model="form.paymentMethod" placeholder="请选择"   :disabled="edit">
                        <el-option :value="types.name" :key="types.name"  :label="types.name" v-for="types in paymentMethodList" >{{types.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注"  prop="remark">
                    <el-input v-model="form.remark" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="castVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditOrAdd(title,'form','')">确定</el-button>
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
import { insertAccount,updateAccount,listAccount,getRuleList,getAccount,listFinanceRecord,listFinanceBillRecord,getTypeName} from '../../api/tariff/account';
import { listBills } from '../../api/tariff/bill';
import billVisible from './bill';
import { getOwenList } from '../../api/owner';
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
        let checkpropertyType = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业类型"));
            }else{
                return callback();
            }
        }
        let checkpropertyId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入物业编号"));
            }else{
                return callback();
            }
        }
        let checkownerId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请选择业主"));
            }else{
                return callback();
            }
        }
        let checkruleId = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请选择费用标准"));
            }else{
                return callback();
            }
        }
        let checkname = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请输入账户名称"));
            }else{
                return callback();
            }
        }
        let checktype = (rule,value,callback) =>{
            if(!value){
                return callback(new Error("请选择账户类型"));
            }else{
                return callback();
            }
        }
        // name 账户名称 type 账户类型 fee 余额 feeAdd 增加额（feeAddShow==true） 支付方式 paymentMethod
        let  checkfee= (rule,value,callback) =>{
            if (!value) {
                return callback(new Error("请输入预存金额"));
            } else {
                if (value>0) {
                    return callback();
                } else {
                    return callback(new Error("请输入正确的数字,不可小于0"));
                }
            }
        }
        let checkfeeAdd = (rule,value,callback) =>{
            console.log(this.feeAddShow);
            if(this.feeAddShow){
                if(!value){
                    return callback(new Error("请输入"+this.title+"额"));
                }else{
                    if (value>0) {
                        return callback();
                    } else {
                        return callback(new Error("请输入正确的数字,不可小于0"));
                    }
                }
            }
        }
        let checkpaymentMethod = (rule,value,callback) =>{
            debugger
            if(!value){
                return callback(new Error("请输入支付方式"));
            }else{
                return callback();
            }
        }
        return {
            query: {
                compId:'',
                commId:'',
                ruleId:'',
                ruleName:'',
                ownerId:'',
                ownerName:'',
                propertyName:'',
                propertyId:'',
                propertyType:'',
                fee:'',
                feeAdd:'',
                remark:'',
                paymentMethod:'',
                pageNo: 1,
                size: 10
            },
            query2: {
                compId: '',
                commId: '',
                roomId:'',
                delIds:'',
                name:'',
                pageNo: 1,
                size: 10
            },
            query3: {
                compId: '',
                commId: '',
                roomId:'',
                delIds:'',
                pageNo: 1,
                size: 10
            },
            query4: {
                /*compId: '',
                commId: '',
                roomId:'',
                delIds:'',*/
                accountId:'',
                pageNo: 1,
                size: 10
            },
            query5: {
                accountId:'',
                pageNo: 1,
                size: 10
            },
            tableData: [],
            tableData2: [],
            tableData3: [],
            tableData4: [],
            tableData5: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            updateVisible:false,
            verifyVisible:false,
            detailVisible:false,
            castVisible:false,
            feeAddShow:false,
            edit:false,
            otherComp:false,
            pageTotal:0,
            pageTotal2:0,
            pageTotal3:0,
            pageTotal4:0,
            pageTotal5:0,
            compId:'',
            disable:false,
            compList:[],
            commList:[],
            typeNameList:[],
            billVisible:false,
            propertyTypeList:[],//物业类型
            ruleList:[],//费用标准
            typeList:[],//账户类型
            paymentMethodList:[],//支付方式
            selectOwnerVis:false,
            selectRules:false,
            updateChoose:false,
            form: {},
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
                ownerId:[{
                    validator:checkownerId,required: true,trigger:'blur'
                }],
                ruleId:[{
                    validator:checkruleId,required: true,trigger:'blur'
                }],

                propertyType:[{
                    validator:checkpropertyType,required: true,trigger:'blur'
                }],//物业类型
                propertyId:[{
                    validator:checkpropertyId,required: true,trigger:'blur'
                }],//物业编号
                name:[{
                    validator:checkname,required: true,trigger:'blur'
                }],
                fee:[{
                    validator:checkfee,required: true,trigger:'blur'
                }],
                type:[{
                    validator:checktype,required: true,trigger:'blur'
                }],
                feeAdd:[{
                    validator:checkfeeAdd,required: true,trigger:'blur'
                }],
                paymentMethod:[{
                    validator:checkpaymentMethod,required: true,trigger:'blur'
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
        typeChange(){
            getTypeName(this.query).then(res => {
                if(res.data){
                    this.typeNameList = res.data;
                }
            });
        },
        commChange(){
            if(this.query.propertyType!=''&&this.query.propertyType!=undefined){
                getTypeName(this.query).then(res => {
                    if(res.data){
                        this.typeNameList = res.data;
                    }
                });
            }
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
                    this.compId=res.data.records[0].id;
                    getUserComm(res.data.records[0].id).then(res => {
                        if(res.data){
                            this.form.commId=undefined;
                            this.commList = res.data;
                        }
                    });
                }
                listAccount(this.query).then(res => {
                    this.ruleList=[];
                    this.tableData = res.data.records;
                    this.pageTotal = res.data.total || 0;
                });
            });
            getDictItemByDictId(45).then(res => {//45是物业类型
                this.propertyTypeList = res.data;
            });
            getDictItemByDictId(58).then(res => {//58是账户类型
                this.typeList = res.data;
            });
            getDictItemByDictId(59).then(res => {//59是支付方式
                this.paymentMethodList = res.data;
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
        handleAdd() {
            debugger
            this.form = {};
            if(this.compId!=''&&this.compId!=undefined){
                this.form.compId = this.compId;
            }
            this.editVisible = true;
            this.title="费用预存";
            this.feeAddShow = false;
            this.form.isReNew = false;
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
        handleSearch1() {
            this.query2.pageNo=1;
            this.$set(this.query2, 'pageIndex', 1);
            getOwenList(this.query2).then(res => {
                this.tableData2 = res.data.data;
                this.pageTotal2 = res.data.pageTotal || 0;
            });
        },
        selectOwner(){
            if(this.form.compId!=''&&this.form.compId!=undefined&&this.form.commId!=''&&this.form.commId!=undefined){
                this.selectOwnerVis = true;
                this.query2.compId = this.form.compId;
                this.query2.commId = this.form.commId;
                this.query2.name = '';
                getOwenList(this.query2).then(res => {
                    this.tableData2 = res.data.data;
                    this.pageTotal2 = res.data.pageTotal || 0;
                });
            }else{
                this.$message.info(`请先选择物业公司和社区`);
            }
        },
        chooseDetails (row) {
            debugger
            this.selectOwnerVis = false;
            this.$set(this.form, "ownerId", row.id);//业主id
            this.$set(this.form, "ownerName", row.name);//业主名称
            if(row.id!=''){
                getRuleList(row.id).then(res => {
                    this.tableData3 = res.data;
                    this.pageTotal3 = res.data.pageTotal || 0;
                });
            }
        },
        selectRule(){
            if(this.form.ownerId!=''&&this.form.ownerId!=undefined){
                this.selectRules = true;
            }else{
                this.$message.info(`请先选择物业公司和社区`);
            }
        },
        chooseRuleDetails (row) {
            this.form.ruleId = row.id;
            this.form.ruleName = row.name;
            this.form.propertyId = row.propertyId;
            this.form.propertyName = row.propertyName;
            this.form.propertyType = row.propertyType;
            console.log(this.form.ownerId+"---------"+this.form.ruleId)
            if(this.form.ownerId!=''&&this.form.ownerId!=undefined&&this.form.ruleId!=''&&this.form.ruleId!=undefined){
                //业主（名称模糊查询，有数据权限），选择费用标准（下拉列表，可以多个费用标准），
                // 如果选出的业主与费用标准与之前的账号验证相同，其他数据将带出原账户信息，添加账户操作改修改账户操作
                getAccount({ownerId:this.form.ownerId,ruleId:this.form.ruleId}).then(res => {
                    this.selectRules = false;
                    if(res.data!=null){//增加改为修改
                        debugger
                        this.form.isReNew = true;//续费
                        this.edit = true;
                        this.feeAddShow = true;
                        this.$set(this.form, "name", res.data.name);
                        this.$set(this.form, "no", res.data.no);
                        this.$set(this.form, "fee", res.data.fee);
                        this.$set(this.form, "remark", res.data.remark);
                        this.$set(this.form, "type", res.data.type);
                        this.form.id = res.data.id;
                    }else{
                        this.$set(this.form, "name", this.form.ownerName+row.name);
                    }
                });
            }else if(this.form.ruleId==''||this.form.ruleId==undefined){

            }else{
                this.$set(this.form, "ruleId", '');
                this.$set(this.form, "ruleName", '');
                this.$message.info("请先选择业主");
            }
        },
        // 续费操作
        renewAccount(index, row) {
            debugger
            this.idx = index;
            this.form = row;
            this.updateVisible = true;
            this.title="续费";
            this.feeAddShow = true;
            this.$set(this.form, "isReNew", true);
            this.$set(this.form, "paymentMethod", '');
            this.$refs.form.clearValidate();
        },
        castAccount(index, row) {
            this.idx = index;
            this.form = row;
            this.castVisible = true;
            this.title="提现";
            this.feeAddShow = true;
            this.$set(this.form, "isReNew", false);
            this.$set(this.form, "paymentMethod", '');
            this.$refs.form.clearValidate();
        },
        //表格行点击事件
        openDetails (row) {
            //具体操作
            this.form = row;
            //this.disable=true;
            this.detailVisible = true;
            this.title="查看费用预存";
            this.query4.accountId = row.id;
            this.query5.accountId = row.id;
            listFinanceRecord(this.query4).then(res => {
                this.tableData4 = res.data.records;
                this.pageTotal4 = res.data.total || 0;
            });
            listFinanceBillRecord(this.query5).then(res => {
                debugger
                this.tableData5 = res.data.records;
                this.pageTotal5 = res.data.total || 0;
            });
            //this.status = 2;
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
            if(title==='费用预存'){
                //this.editVisible = false;
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        insertAccount(this.form).then(res => {
                            if(res.data==true){
                                this.editVisible = false;
                                this.$message.success(`新增成功`);
                                this.getData();
                            }else if(res.data==false){
                                this.$message.info("预存账号编号重复");
                            }else{
                                this.editVisible = false;
                                this.$message.error("新增失败");
                            }
                        });
                    }
                });
            }else{
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        if(this.form.fee>=this.form.feeAdd){
                            updateAccount(this.form).then(res => {
                                if(res.data){
                                    if(this.form.isReNew){
                                        this.updateVisible = false;
                                        this.$message.success("续费成功");
                                    }else{
                                        this.castVisible = false;
                                        this.$message.success("提现成功");
                                    }
                                    this.getData();
                                }else{
                                    if(this.form.isReNew){
                                        this.updateVisible = false;
                                        this.$message.success("续费失败");
                                    }else{
                                        this.castVisible = false;
                                        this.$message.success("提现失败");
                                    }
                                    this.getData();
                                }
                            });
                        }else{
                            this.$message.info("提现额不能大于预存金额");
                        }
                    }
                });
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNo', val);
            this.getData();
        },
        handlePageChange2(val) {
            debugger
            this.$set(this.query2, 'pageNo', val);
            getOwenList(this.query2).then(res => {
                this.tableData2 = res.data.data;
                this.pageTotal2 = res.data.pageTotal || 0;
            });
        },
        handlePageChange3(val) {
            this.$set(this.query3, 'pageNo', val);
            this.getData();
        },
        handlePageChange4(val) {
            this.$set(this.query4, 'pageNo', val);
            listFinanceRecord(this.query4).then(res => {
                this.tableData4 = res.data.records;
                this.pageTotal4 = res.data.total || 0;
            });

        },
        handlePageChange5(val) {
            this.$set(this.query5, 'pageNo', val);
            listFinanceBillRecord(this.query5).then(res => {
                debugger
                this.tableData5 = res.data.records;
                this.pageTotal5 = res.data.total || 0;
            });
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
