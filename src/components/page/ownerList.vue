<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 业主列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
                <el-select v-model="query.compId" placeholder="请选择" @change="compChange">
                    <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                    <el-option :value="types.id" :key="types.id" :label="types.name" v-for="types in compList">
                        {{types.name}}
                    </el-option>
                </el-select>
                <el-select v-model="query.commId" placeholder="请选择社区" @change="commChange">
                    <el-option :value="types.id" :key="types.id" :label="types.name" v-for="types in commList">
                        {{types.name}}
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-top: 5px;">搜索
                </el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" style="margin-top: 5px;">新增业主
                </el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="handleRefresh" style="margin-top: 5px;">重置
                </el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="upload">导入</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="exportXls">导出</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="exportTemplate">导入模板下载</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @row-click="openDetails"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="公司名称" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certType" label="证件类型" min-width="125" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="certNumber" label="证件号码" min-width="125" min-height="55"
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
                <el-table-column prop="industry" label="行业" min-width="75" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" min-width="75" min-height="55"
                                 align="center"></el-table-column>
                <el-table-column prop="likes" label="爱好" min-width="75" min-height="55"
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
                <el-table-column label="操作" width="195" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button-group>
                                <el-button
                                        type="text"
                                        icon="el-icon-edit"
                                        @click.stop
                                        @click="handleEdit(scope.$index, scope.row)"
                                >编辑
                                </el-button>
                                <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        class="red"
                                        @click.stop
                                        @click="handleDelete(scope.row.id)"
                                >删除
                                </el-button>
                            </el-button-group>
                            <el-button
                                    type="text"
                                    icon="el-icon-lx-text"
                                    class="green"
                                    @click.stop
                                    @click="handleoii(scope.row.id)"
                            >开票信息
                            </el-button>
                        </el-row>

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
        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="55%" append-to-body>
            <el-form ref="form" :model="form" label-width="70px" :disabled="disable" :inline="true">
                <div>
                    <el-form-item label="id" v-show="false">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="公司名称" label-width="150px">
                        <el-input v-model="compName" disabled v-if="!isAdmin"></el-input>
                        <el-select class="myWidth" v-model="form.compId" placeholder="请选择公司" width="200px"
                                   v-if="isAdmin">
                            <el-option :value="types.id" :key="types.name" :label="types.name"
                                       v-for="types in compList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="公司id" v-show="false" v-if="!isAdmin" label-width="150px">
                        <el-input v-model="form.compId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="社区id" v-show="false" label-width="150px">
                        <el-input v-model="form.commId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="分区id" v-show="false" label-width="150px">
                        <el-input v-model="form.commAreaId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="建筑id" v-show="false" label-width="150px">
                        <el-input v-model="form.buildingId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="房间id" v-show="false" label-width="150px">
                        <el-input v-model="form.roomId" disabled></el-input>
                    </el-form-item>

                    <el-form-item class="item" label="业主类型" label-width="150px" prop="ownerType"
                                  :rules="[
                        { required: true, message: '请选择业主类型', trigger: 'blur' },
                    ]">
                        <el-select class="myWidth" v-model="form.ownerType" placeholder="请选择业主类型" width="200px"
                                   @change="ownerTypeChange">
                            <el-option :value="types.name" :key="types.name" :label="types.name"
                                       v-for="types in ownerTypes"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="证件类型" label-width="150px" prop="certType"
                                  :rules="[
                        { required: true, message: '请选择证件类型', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.certType" placeholder="请选择" class="myWidth">
                            <el-option :value="types.name" :key="types.id" :label="types.name"
                                       v-for="types in certTypes"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="证件号码" label-width="150px" prop="certNumber" :rules="[
                        { required: true, message: '请输入证件号码', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.certNumber" @input="getCount"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="业主名称" label-width="150px" prop="name"
                                  :rules="[
                        { required: true, message: '请输入业主名称', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="业主地址" label-width="150px" prop="ownerAddr"
                                  :rules="[
                        { required: true, message: '请输入业主地址', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.ownerAddr"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="业主电话" label-width="150px" prop="tel"
                                  :rules="[
                        { required: true, message: '请输入业主电话', trigger: 'blur' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                    ]">
                        <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="业主邮箱" label-width="150px" prop="email"
                                  :rules="[
                        { required: true, message: '请输入业主邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change']},
                    ]">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="行业" label-width="150px" prop="industry"
                                  :rules="[
                        { required: true, message: '请输入行业', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.industry" placeholder="请选择行业" class="myWidth">
                            <el-option :value="types.name" :key="types.id" :label="types.name"
                                       v-for="types in hys"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="性别" label-width="150px" prop="sex"
                                  :rules="[
                        { required: true, message: '请选择性别', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.sex" placeholder="请选择性别" class="myWidth">
                            <el-option :value="types.name" :key="types.id" :label="types.name"
                                       v-for="types in sexTypes"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="籍贯" label-width="150px" prop="nativePlace"
                                  :rules="[
                        { required: true, message: '请选择籍贯', trigger: 'blur' },
                    ]">
                        <el-cascader
                                v-model="nativePlace"
                                class="myWidth"
                                ref="cascaderAddr"
                                :props="{
                                    value: 'name',
                                    label: 'name',
                                    children: 'childList'
                                  }"
                                :options="provinces"
                                placeholder="请选择籍贯"
                                @change="handleChange"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item class="item" label="爱好" label-width="150px">
                        <el-input v-model="form.likes"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="学历" label-width="150px">
                        <el-input v-model="form.education"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                  :rules="[
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.state" placeholder="请选择" class="myWidth">
                            <el-option key="bbk" label="在用" value="在用"></el-option>
                            <el-option key="xtc" label="不在用" value="不在用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="联系人" label-width="150px" prop="linkName"
                                  :rules="[
                        { required: true, message: '请输入联系人', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.linkName"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="联系人电话" label-width="150px" prop="linkTel"
                                  :rules="[
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                    ]">
                        <el-input v-model="form.linkTel"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="联系人地址" label-width="150px" prop="linkAddr"
                                  :rules="[
                        { required: true, message: '请输入联系人地址', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.linkAddr"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="备注" label-width="150px">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                    <commPage :form="form" :status="status" :editVisible="editVisible"></commPage>
                </div>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button v-if="!disable" type="primary" @click="saveEditOrAdd(title)">确 定</el-button>
            </span>
        </el-dialog>
        <!--查看弹出框-->
        <el-dialog :visible.sync="chakan" append-to-body>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="业主信息" name="first">
                    <el-form ref="form" :model="form" label-width="70px" :disabled="disable" :inline="true">
                        <div>
                            <el-form-item label="id" v-show="false">
                                <el-input v-model="form.id"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="公司名称" label-width="150px">
                                <el-input v-model="compName" disabled v-if="!isAdmin"></el-input>
                                <el-select class="myWidth" v-model="form.compId" placeholder="请选择公司" width="200px"
                                           v-if="isAdmin">
                                    <el-option :value="types.id" :key="types.name" :label="types.name"
                                               v-for="types in compList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="item" label="公司id" v-show="false" v-if="!isAdmin" label-width="150px">
                                <el-input v-model="form.compId" disabled></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="社区id" v-show="false" label-width="150px">
                                <el-input v-model="form.commId" disabled></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="分区id" v-show="false" label-width="150px">
                                <el-input v-model="form.commAreaId" disabled></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="建筑id" v-show="false" label-width="150px">
                                <el-input v-model="form.buildingId" disabled></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="房间id" v-show="false" label-width="150px">
                                <el-input v-model="form.roomId" disabled></el-input>
                            </el-form-item>

                            <el-form-item class="item" label="业主类型" label-width="150px" prop="ownerType"
                                          :rules="[
                        { required: true, message: '请选择业主类型', trigger: 'blur' },
                    ]">
                                <el-select class="myWidth" v-model="form.ownerType" placeholder="请选择业主类型" width="200px"
                                           @change="ownerTypeChange">
                                    <el-option :value="types.name" :key="types.name" :label="types.name"
                                               v-for="types in ownerTypes"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="item" label="证件类型" label-width="150px" prop="certType"
                                          :rules="[
                        { required: true, message: '请选择证件类型', trigger: 'blur' },
                    ]">
                                <el-select v-model="form.certType" placeholder="请选择" class="myWidth">
                                    <el-option :value="types.name" :key="types.id" :label="types.name"
                                               v-for="types in certTypes"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="item" label="证件号码" label-width="150px" prop="certNumber" :rules="[
                        { required: true, message: '请输入证件号码', trigger: 'blur' },
                    ]">
                                <el-input v-model="form.certNumber" @input="getCount"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="业主名称" label-width="150px" prop="name"
                                          :rules="[
                        { required: true, message: '请输入业主名称', trigger: 'blur' },
                    ]">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="业主地址" label-width="150px" prop="ownerAddr"
                                          :rules="[
                        { required: true, message: '请输入业主地址', trigger: 'blur' },
                    ]">
                                <el-input v-model="form.ownerAddr"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="业主电话" label-width="150px" prop="tel"
                                          :rules="[
                        { required: true, message: '请输入业主电话', trigger: 'blur' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                    ]">
                                <el-input v-model="form.tel"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="业主邮箱" label-width="150px" prop="email"
                                          :rules="[
                        { required: true, message: '请输入业主邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change']},
                    ]">
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="行业" label-width="150px" prop="industry"
                                          :rules="[
                        { required: true, message: '请输入行业', trigger: 'blur' },
                    ]">
                                <el-select v-model="form.industry" placeholder="请选择行业" class="myWidth">
                                    <el-option :value="types.name" :key="types.id" :label="types.name"
                                               v-for="types in hys"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="item" label="性别" label-width="150px" prop="sex"
                                          :rules="[
                        { required: true, message: '请选择性别', trigger: 'blur' },
                    ]">
                                <el-select v-model="form.sex" placeholder="请选择性别" class="myWidth">
                                    <el-option :value="types.name" :key="types.id" :label="types.name"
                                               v-for="types in sexTypes"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="item" label="籍贯" label-width="150px" prop="nativePlace"
                                          :rules="[
                        { required: true, message: '请选择籍贯', trigger: 'blur' },
                    ]">
                                <el-cascader
                                        v-model="nativePlace"
                                        class="myWidth"
                                        ref="cascaderAddr"
                                        :props="{
                                    value: 'name',
                                    label: 'name',
                                    children: 'childList'
                                  }"
                                        :options="provinces"
                                        placeholder="请选择籍贯"
                                        @change="handleChange"
                                ></el-cascader>
                            </el-form-item>
                            <el-form-item class="item" label="爱好" label-width="150px">
                                <el-input v-model="form.likes"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="学历" label-width="150px">
                                <el-input v-model="form.education"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                          :rules="[
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ]">
                                <el-select v-model="form.state" placeholder="请选择" class="myWidth">
                                    <el-option key="bbk" label="在用" value="在用"></el-option>
                                    <el-option key="xtc" label="不在用" value="不在用"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="item" label="联系人" label-width="150px" prop="linkName"
                                          :rules="[
                        { required: true, message: '请输入联系人', trigger: 'blur' },
                    ]">
                                <el-input v-model="form.linkName"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="联系人电话" label-width="150px" prop="linkTel"
                                          :rules="[
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                    ]">
                                <el-input v-model="form.linkTel"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="联系人地址" label-width="150px" prop="linkAddr"
                                          :rules="[
                        { required: true, message: '请输入联系人地址', trigger: 'blur' },
                    ]">
                                <el-input v-model="form.linkAddr"></el-input>
                            </el-form-item>
                            <el-form-item class="item" label="备注" label-width="150px">
                                <el-input v-model="form.remark"></el-input>
                            </el-form-item>
                            <commPage :form="form" :status="status" :editVisible="editVisible"></commPage>
                        </div>


                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="房间信息列表" name="second">
                    <el-table
                            :data="tableRoom"
                            border
                            class="table"
                            ref="multipleTable"
                            header-cell-class-name="table-header"
                            elt
                    >
                        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                        <el-table-column prop="compName" label="物业公司" width="130"></el-table-column>
                        <el-table-column prop="commName" label="社区名称" width="120"></el-table-column>
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
                        <el-table-column prop="buildingArea" label="建筑面积"></el-table-column>
                        <el-table-column prop="usableArea" label="使用面积"></el-table-column>
                        <el-table-column prop="heatingArea" label="暖气计费面积"></el-table-column>
                        <el-table-column prop="gardenArea" label="花园面积"></el-table-column>
                        <el-table-column prop="titleDeedNo" label="产权证号"></el-table-column>
                        <el-table-column prop="landDeedNo" label="土地证号"></el-table-column>
                        <el-table-column prop="contractNo" label="购房合同号"></el-table-column>
                        <el-table-column prop="state" label="状态"></el-table-column>
                        <el-table-column prop="createdName" label="创建人"></el-table-column>
                        <el-table-column prop="createdAt" label="创建日期" width="155"></el-table-column>
                        <el-table-column prop="modifiedName" label="修改人"></el-table-column>
                        <el-table-column prop="modifiedAt" label="修改日期" width="155"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="车位信息列表" name="third">

                    <el-table
                            :data="tablePark"
                            border
                            class="table"
                            ref="multipleTable"
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
                </el-tab-pane>
                <el-tab-pane label="开票信息列表" name="fourth">
<!--                    <ownerInvoiceInfo v-if="oiiVisible" ref="ownerInvoiceInfo"></ownerInvoiceInfo>-->
                    <el-table
                            :data="tableInvo"
                            border
                            class="table"
                            ref="multipleTable"
                    >
                        <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                        <el-table-column prop="taxpayerType" label="纳税人类型" width="95" align="center"></el-table-column>
                        <el-table-column prop="name" label="开票名称" align="center"></el-table-column>
                        <el-table-column prop="identificationNo" label="识别号" align="center"></el-table-column>
                        <el-table-column prop="bankName" label="开票银行" align="center"  width="155"></el-table-column>
                        <el-table-column prop="registerTel" label="注册电话" align="center" min-width="125"></el-table-column>
                        <el-table-column prop="registerAddr" label="注册地址" align="center"></el-table-column>
                        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                        <el-table-column prop="createdName" label="创建人" align="center"></el-table-column>
                        <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"></el-table-column>
                        <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                        <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-dialog>
        <!-- 开票弹出框   -->
        <el-dialog :visible.sync="oiiVisible" append-to-body>
            <ownerInvoiceInfo v-if="oiiVisible" ref="ownerInvoiceInfo"></ownerInvoiceInfo>
        </el-dialog>

        <el-dialog :visible.sync="cmpVisible" append-to-body>
            <menu1 v-if="cmpVisible" ref="menu1"></menu1>
        </el-dialog>
    </div>
</template>

<script scoped>
    import {

        getComp

    } from '../../api/unit';
    import {
        addOwner,
        deleteIds,
        deleteOwner,
        getCount,
        getOwenList,
        update,
        exportXlsByT,
        listProvincesAndCity, exportTemplate, exportTemplateOwner, getRoomByOwnerId, getParkByOwnerId, fetchLinkData
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
                    roomId: '',
                    delIds: '',
                    pageNo: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                usableList: [],
                editVisible: false,
                pageTotal: 0,
                disable: false,
                oiiVisible: false,
                form: {},
                idx: -1,
                title: '',
                compName: '',
                commArr: [],
                ownerTypes: [],
                nativePlace: '',
                sexTypes: [],
                propTypes: [],
                cmpVisible: false,
                certTypes: [],
                hys: [],
                areaArr: [],
                eleNum: '',
                status: 0,
                provinces: [],
                propVisible: false,
                activeName: 'first',
                isAdmin: false,
                compList: [],
                roomOwnerId: null,
                chakan: false,
                commList: [],
                modelArr: [],
                tableRoom: [],
                tablePark: [],
                tableInvo: [],
                row: {},
                id: -1,

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
                getOwenList(this.query).then(res => {
                    this.tableData = res.data.data;
                    this.pageTotal = res.data.pageTotal || 0;
                });
                listProvincesAndCity(this.query).then(res => {
                    this.provinces = res.data;
                });
                // getOwenerByRoom(this.query).then(res => {
                //     console.log(res);
                //     this.tableData = res;
                //     // this.pageTotal = res.data.pageTotal || 0;
                // });
                getDictItemByDictId(12).then(res => {//12是业主类型的id
                    // debugger
                    this.ownerTypes = res.data;
                });
                getDictItemByDictId(14).then(res => {//14是性别的id
                    // debugger
                    this.sexTypes = res.data;
                });
                getDictItemByDictId(47).then(res => {//47是的证件类型id
                    // debugger
                    this.certTypes = res.data;
                });
                getDictItemByDictId(49).then(res => {//47是的id
                    // debugger
                    this.hys = res.data;
                });
                getDictItemByDictId(11).then(res => {//业主与房屋关系类型
                    // debugger
                    this.propTypes = res.data;
                });
                getCityDict(this.query).then(res => {
                    this.cascaderData = res.data;
                });

            },
            upload() {
                //let linkID = id;
                this.cmpVisible = true;
                this.$nextTick(() => {
                    this.$refs.menu1.dataInitializationUpload('http://localhost:8900/api/rOwner/upload');
                });

            },
            uploadDr(title, form) {
                console.log(this.form);
                upload(this.form.file, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(res => {

                });
            },
            ownerTypeChange(val) {
                console.log(val);
                if (val === '个人') {
                    this.form.certType = '身份证';
                } else {
                    this.form.certType = '营业执照';
                }
            }
            ,
            handleChange(val) {
                this.form.nativePlace = val.join('/');
            },
            getCount() {
                if (this.form.ownerType && this.form.certType && this.form.certNumber) {
                    getCount(this.form).then(res => {
                        if (res.data != null) {
                            this.title = '新增业主  ';
                            this.nativePlace = res.data.nativePlace.split('/');
                            this.$set(this.form, 'id', res.data.id);
                            this.$set(this.form, 'education', res.data.education);
                            this.$set(this.form, 'name', res.data.name);
                            this.$set(this.form, 'email', res.data.email);
                            this.$set(this.form, 'industry', res.data.industry);
                            this.$set(this.form, 'likes', res.data.likes);
                            this.$set(this.form, 'linkAddr', res.data.linkAddr);
                            this.$set(this.form, 'linkName', res.data.linkName);
                            this.$set(this.form, 'linkTel', res.data.linkTel);
                            this.$set(this.form, 'nativePlace', this.nativePlace);
                            this.$set(this.form, 'ownerAddr', res.data.ownerAddr);
                            this.$set(this.form, 'remark', res.data.remark);
                            this.$set(this.form, 'sex', res.data.sex);
                            this.$set(this.form, 'state', res.data.state);
                            this.$set(this.form, 'tel', res.data.tel);
                        }
                    });
                }
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },

            // 删除操作
            handleDelete(id) {

                // 二次确认删除
                this.$confirm('该业主下可能有开票等信息，确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteOwner(id).then(res => {
                            this.$message.success('删除成功');
                            this.getData();
                        });
                    })
                    .catch(() => {
                    });
            },
            handleClick(tab, event) {
                let that = this
                this.tablePark = [];
                this.tableRoom = [];
                if (this.activeName === 'second') {
                    getRoomByOwnerId(this.form.id).then(res => {
                        this.tableRoom = res.data;
                    });
                }
                if (this.activeName === 'third') {
                    getParkByOwnerId(this.form.id).then(res => {
                        console.log(res);
                        this.tablePark = res.data;
                    });
                }
                if (this.activeName === 'fourth') {
                    this.query.ownerId = this.form.id
                    fetchLinkData(this.query).then(res => {
                        this.tableInvo = res.data.data;
                    });
                }
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';

                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    if (i === length - 1) {
                        this.query.delIds += this.multipleSelection[i].id;
                    } else {
                        this.query.delIds += this.multipleSelection[i].id + ',';
                    }
                    str += this.multipleSelection[i].name + ' ';
                }
                deleteIds(this.query).then(res => {
                    this.$message.error(`删除了${str}`);
                    this.multipleSelection = [];
                    this.query.delIds = null;
                    this.getData();
                });

            },
            handleRefresh() {
                this.query = {
                    commId: '',
                    pageNo: 1,
                    size: 10
                };
                this.getData();
            },
            handleAdd() {
                this.editVisible = true;
                this.title = '新增业主';
                this.form = {};
                this.status = 0;
                this.disable = false;
                if (localStorage.getItem('ms_username') === 'admin') {
                    this.isAdmin = true;
                }
                // this.$set(this.form, 'createdName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'createdAt', new Date());
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());
                this.form.commId = this.row.commId;
                this.form.commAreaId = this.row.commAreaId;
                this.form.buildingId = this.row.buildingId;
                this.form.roomId = this.row.id;
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });

            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.status = 1;
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                if (localStorage.getItem('ms_username') === 'admin') {
                    this.isAdmin = true;
                }
                this.form.commId = this.row.commId;
                this.form.commAreaId = this.row.commAreaId;
                this.form.buildingId = this.row.buildingId;
                this.form.roomId = this.row.id;
                this.nativePlace = this.form.nativePlace.split('/');
                let that = this;
                that.$set(that.form, 'model', this.form.model - 0);
                this.modelArr.forEach(function(value, key, arr) {

                    if (arr[key].id == that.form.model) {
                        that.eleNum = arr[key].elevatorNum;
                    }

                });
                this.editVisible = true;
                this.disable = false;
                this.title = '编辑业主信息';
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());

            },
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.status = 2;
                // this.editVisible = true;
                this.chakan = true;
                this.activeName = 'first';
                this.nativePlace = this.form.nativePlace.split('/');
                let that = this;
                if (localStorage.getItem('ms_username') === 'admin') {
                    this.isAdmin = true;
                }
                that.$set(that.form, 'model', this.form.model - 0);
                this.modelArr.forEach(function(value, key, arr) {

                    if (arr[key].id == that.form.model) {
                        that.eleNum = arr[key].elevatorNum;
                    }

                });
                getComp().then(res => {
                    this.compName = res.data.name;
                    this.$set(this.form, 'compId', res.data.id);
                });
                this.title = '查看业主信息';

            },
            // 保存编辑
            saveEditOrAdd(title) {
                if (title === '新增业主') {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            // this.$delete(this.form, 'createdName');
                            // this.$delete(this.form, 'createdAt');
                            // this.$delete(this.form, 'modifiedName');
                            // this.$delete(this.form, 'modifiedAt');
                            this.editVisible = false;
                            addOwner(this.form).then(res => {
                                this.$message.success(`新增业主成功`);
                                this.getData();
                            });
                        }
                    });

                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            this.editVisible = false;
                            // this.$delete(this.form, 'modifiedName');
                            // this.$delete(this.form, 'modifiedAt');
                            update(this.form).then(res => {
                                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                this.$set(this.tableData, this.idx, this.form);
                            });
                        }
                    });
                }

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
            dataInitialization(row) {
                this.query.roomId = row.id;
                this.row = row;

            },
            handleoii(id) {

                let linkID = id;
                this.roomOwnerId = id;
                this.oiiVisible = true;
                this.$nextTick(() => {
                    this.$refs.ownerInvoiceInfo.dataInitialization(linkID);
                });

            },
            handleProp(id) {
                let linkID = id;
                this.propVisible = true;
                this.$nextTick(() => {
                    this.$refs.ownerProperty.dataInitialization(linkID);
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            },
            getTime() {
                let date = new Date();
                let yy = date.getFullYear();
                let mm = date.getMonth() + 1;
                if (mm < 10) {
                    mm = '0' + mm;
                }
                let dd = date.getDate();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                let h = date.getHours();
                if (h < 10) {
                    h = '0' + h;
                }
                let m = date.getMinutes();
                if (m < 10) {
                    m = '0' + m;
                }
                let s = date.getSeconds();
                if (s < 10) {
                    s = '0' + s;
                }
                let ms = date.getMilliseconds();
                let time = yy + '' + mm + '' + dd + '' + h + '' + m + '' + s + '' + ms;
                return time;
            },
            exportXls() {
                console.log(this.query);
                exportXlsByT(this.query).then(res => {
                    var blob = new Blob([res], { type: 'application/octet-stream' }, 'sheet.xlsx');
                    if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                        window.navigator.msSaveBlob(blob, unescape(res.headers.filename.replace(/\\u/g, '%u')));
                    } else {
                        var downloadElement = document.createElement('a');
                        var href = window.URL.createObjectURL(blob); //创建下载的链接

                        downloadElement.href = href;
                        downloadElement.download = unescape('业主信息' + this.getTime() + '.xls'); //下载后文件名

                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载

                        document.body.removeChild(downloadElement); //下载完成移除元素

                        window.URL.revokeObjectURL(href); //释放掉blob对象
                    }
                });
            },
            exportTemplate() {
                console.log(this.query);
                exportTemplateOwner(this.query).then(res => {
                    var blob = new Blob([res], { type: 'application/octet-stream' }, 'sheet.xlsx');
                    if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                        window.navigator.msSaveBlob(blob, unescape(res.headers.filename.replace(/\\u/g, '%u')));
                    } else {
                        var downloadElement = document.createElement('a');
                        var href = window.URL.createObjectURL(blob); //创建下载的链接

                        downloadElement.href = href;
                        downloadElement.download = unescape('业主信息' + this.getTime() + '.xls'); //下载后文件名

                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载

                        document.body.removeChild(downloadElement); //下载完成移除元素

                        window.URL.revokeObjectURL(href); //释放掉blob对象
                    }
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

    .myWidth {
        width: 200px;
    }
    .el-tabs >>> .el-tabs__content{
        height: 575px;
        flex-grow: 1;
        overflow-y: scroll;
    }
</style>
