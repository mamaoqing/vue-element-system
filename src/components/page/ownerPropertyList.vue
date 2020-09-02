<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 业主物业关系列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
                <el-select v-model="query.ownerType" placeholder="请选择业主类型" @change="commChange">
                    <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in ownerTypes">
                        {{types.name}}
                    </el-option>
                </el-select>
                <el-select v-model="query.propertyType" placeholder="请选择物业类型" @change="commChange">
                    <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in wyTypes">
                        {{types.name}}
                    </el-option>
                </el-select>
                <el-input v-model="query.ownerName" placeholder="业主名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.certNumber" placeholder="身份证号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-top: 5px;">搜索
                </el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="handleRefresh" style="margin-top: 5px;">重置
                </el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">添加</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    @row-click="openDetails"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="compName" label="物业公司" align="center" min-width="120"></el-table-column>
                <el-table-column prop="commName" label="社区名称" align="center"></el-table-column>
                <el-table-column prop="commAreaName" label="分区名称" align="center" min-width="110"></el-table-column>
                <el-table-column prop="buildingName" label="楼栋名称" align="center"></el-table-column>
                <el-table-column prop="propertyType" label="物业类型" align="center"></el-table-column>
                <el-table-column prop="ownerType" label="业主类型" align="center"></el-table-column>
                <el-table-column prop="ownerName" label="业主姓名" align="center"></el-table-column>
                <el-table-column prop="tel" label="业主电话" align="center" min-width="110"></el-table-column>
                <el-table-column prop="ownerAddr" label="业主地址" align="center" min-width="110"></el-table-column>
                <el-table-column prop="email" label="业主邮箱" align="center" min-width="125"></el-table-column>
                <el-table-column prop="certType" label="证件类型" align="center"></el-table-column>
                <el-table-column prop="certNumber" label="证件号码" align="center" min-width="125"></el-table-column>
                <el-table-column prop="industry" label="行业" align="center" min-width="75"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" min-width="55"></el-table-column>
                <el-table-column prop="nativePlace" label="籍贯" align="center"></el-table-column>
                <el-table-column prop="education" label="学历" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createdName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" min-width="155"></el-table-column>
                <el-table-column prop="modifiedName" label="修改人" align="center"></el-table-column>
                <el-table-column prop="modifiedAt" label="修改时间" align="center" min-width="155"></el-table-column>
                <el-table-column label="操作" width="125" align="center">
                    <template slot-scope="scope">

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
        <!--查看弹出框-->
        <el-dialog :visible.sync="editVisible" append-to-body width="35%">
            <el-form ref="form" :model="form" label-width="100px" >
                <el-form-item label="id" v-show="false">
                    <el-input v-model="form.id"  disabled></el-input>
                </el-form-item>
                <el-form-item label="物业公司">
                    <el-input v-model="form.compName" disabled></el-input>
                </el-form-item>
                <el-form-item label="社区">
                    <el-input v-model="form.commName" disabled></el-input>
                </el-form-item>
                <el-form-item label="物业类型">
                    <el-input v-model="form.propertyType" disabled></el-input>
                </el-form-item>
                <el-form-item label="关系类型" prop="type" :rules="[
                    { required: true, message: '请选择关系', trigger: 'blur' },
                ]">
                    <el-select v-model="form.type" placeholder="请选择" style="width: 200px" :disabled="disable">
                        <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in types">
                            {{types.name}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业主类型">
                    <el-input v-model="form.ownerType" disabled></el-input>
                </el-form-item>
                <el-form-item label="业主名称">
                    <el-input v-model="form.ownerName" disabled></el-input>
                </el-form-item>
                <el-form-item label="业主电话">
                    <el-input v-model="form.tel" disabled></el-input>
                </el-form-item>
                <el-form-item label="业主地址">
                    <el-input v-model="form.ownerAddr" disabled></el-input>
                </el-form-item>
                <el-form-item label="业主邮箱">
                    <el-input v-model="form.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="证件类型">
                    <el-input v-model="form.certType" disabled></el-input>
                </el-form-item>
                <el-form-item label="证件号码">
                    <el-input v-model="form.certNumber" disabled></el-input>
                </el-form-item>
                <el-form-item label="行业">
                    <el-input v-model="form.industry" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="form.sex" disabled></el-input>
                </el-form-item>
                <el-form-item label="籍贯">
                    <el-input v-model="form.nativePlace" disabled></el-input>
                </el-form-item>
                <el-form-item label="学历">
                    <el-input v-model="form.education" disabled></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" :disabled="disable"></el-input>
                </el-form-item>
                <el-form-item label="录入人">
                    <el-input v-model="form.createdName"  disabled></el-input>
                </el-form-item>
                <el-form-item label="修改人">
                    <el-input v-model="form.modifiedName"  disabled></el-input>
                </el-form-item>
                <el-form-item label="录入时间"prop="createdAt" disabled>
                    <el-date-picker
                            v-model="form.createdAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                            disabled
                    />
                </el-form-item>
                <el-form-item label="修改时间" prop="modifiedAt">
                    <el-date-picker
                            v-model="formOwner.modifiedAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                            disabled
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEditOrAdd(title,'formOwner')">确 定</el-button>
                </span>

        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog :visible.sync="ownerVisible" append-to-body width="25%">
            <el-form ref="formOwner" :model="formOwner" label-width="100px" :disabled="disable">
                <el-form-item label="物业类型" style="float: none;margin-left: 50px" prop="type" :rules="[
                        { required: true, message: '请选择物业类型', trigger: 'blur' },
                    ]">
                    <el-select v-model="formOwner.propertyType" placeholder="请选择" style="width: 150px">
                        <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in wyTypes">
                            {{types.name}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择业主" style="float: none;margin-left: 50px" prop="ownerId" :rules="[
                        { required: true, message: '请选择业主', trigger: 'blur' },
                    ]">
                    <el-input v-model="formOwner.ownerId" v-show="false"></el-input>
                    <el-input v-model="ownerName" :disabled="true" style="width: 150px"></el-input>
                    <el-button
                            type="text"
                            icon="el-icon-search"
                            @click.stop
                            @click="selectOwner()"
                    >选择
                    </el-button>
                </el-form-item>
                <el-form-item label="物业编号" prop="propertyId" style="float: none;margin-left: 50px" :disabled="false" :rules="[
                        { required: true, message: '请选择物业编号', trigger: 'blur' },
                    ]">
                    <el-input v-model="formOwner.propertyId" v-show="false" :disabled="true" style="width: 150px;"></el-input>
                    <el-input v-model="formOwner.propertyName" :disabled="true" style="width: 150px;"></el-input>
                    <el-button
                            type="text"
                            icon="el-icon-search"
                            @click.stop
                            @click="roomParkingSearch()"
                    >选择
                    </el-button>
                </el-form-item>
                <el-form-item label="关系类型" style="float: none;margin-left: 50px" prop="type" :rules="[
                        { required: true, message: '请选择关系', trigger: 'blur' },
                    ]">
                    <el-select v-model="formOwner.type" placeholder="请选择" style="width: 150px">
                        <el-option :value="types.name" :key="types.id" :label="types.name" v-for="types in types">
                            {{types.name}}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="备注" style="float: none;margin-left: 50px">
                    <el-input v-model="formOwner.remark" style="width: 150px"></el-input>
                </el-form-item>
                <el-form-item label="录入人" style="float: none;margin-left: 50px">
                    <el-input v-model="formOwner.createdName"  disabled style="width: 150px" ></el-input>
                </el-form-item>
                <el-form-item label="修改人" style="float: none;margin-left: 50px">
                    <el-input v-model="formOwner.modifiedName"  disabled style="width: 150px"></el-input>
                </el-form-item>
                <el-form-item label="录入时间" style="float: none;margin-left: 50px" prop="createdAt" disabled>
                    <el-date-picker
                            v-model="formOwner.createdAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                            disabled
                    />
                </el-form-item>
                <el-form-item label="修改时间" prop="modifiedAt" style="float: none;margin-left: 50px">
                    <el-date-picker
                            v-model="formOwner.modifiedAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                            disabled
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveOwnerAdd(title,'formOwner')">确 定</el-button>
                </span>
        </el-dialog>
        <!--   选择业主弹出框     -->
        <el-dialog :visible.sync="selectOwnerVis" append-to-body>
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
                        @selection-change="handleSelection"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
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
                    <span slot="footer" class="dialog-footer" style="float: left">
                        <el-button @click="ownerNo()">取 消</el-button>
                        <el-button type="primary" @click="ownerYes()">确 定</el-button>
                    </span>
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
        <el-dialog :visible.sync="roomVisible" append-to-body width="55%">
            <roomVisible v-on:childByValue="childByValue" v-if="roomVisible" ref="roomVisible"></roomVisible>
        </el-dialog>
        <el-dialog :visible.sync="parkingVisible" append-to-body width="55%">
            <parkingVisible v-on:childByValueParking="childByValueParking" v-if="parkingVisible"
                            ref="parkingVisible"></parkingVisible>
        </el-dialog>
    </div>
</template>

<script>

    import {
        getInfo,
        getAllProp,
        getOwenList,
        insertRoomOwnerOrPark, deleteOwnerProp, updateOwnerProp
    } from '../../api/owner';
    import { getDictItemByDictId, getUserComm } from '../../api/building';
    import { getArea, getBuild, getComm, getComp } from '../../api/unit';
    import { listCompAll } from '../../api/role';
    import roomVisible from './roomChoose';
    import parkingVisible from './parkingChoose';

    export default {
        name: 'ownerProperty',
        data() {
            return {
                query: {
                    compId: '',
                    commId: '',
                    delIds: '',
                    pageNo: 1,
                    size: 10
                },
                query2: {
                    compId: '',
                    commId: '',
                    roomId: '',
                    delIds: '',
                    pageNo: 1,
                    size: 10
                },
                title: '',
                tableData: [],
                tableData2: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                ownerVisible: false,
                editshow: true,
                taxpayerType: [],
                pageTotal: 0,
                pageTotal2: 0,
                compName: '',
                ownerName: '',
                compList: [],
                selectOwnerVis: false,
                roomVisible: false,
                parkingVisible: false,
                disable: false,
                ownerTypes: [],
                types: [],
                wyTypes: [],
                commList: [],
                commArr: [],
                areaArr: [],
                buidlArr: [],
                form: {},
                formOwner: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
            getDictItemByDictId(8).then(res => {
                this.taxpayerType = res.data;
            });
            getDictItemByDictId(12).then(res => {
                this.ownerTypes = res.data;
            });
            getDictItemByDictId(45).then(res => {
                this.wyTypes = res.data;
            });
            getDictItemByDictId(11).then(res => {//11是业主与房屋关系类型的id
                this.types = res.data;
            });
            this.formOwner.createdName = localStorage.getItem('ms_username')
            this.formOwner.createdAt = new Date()
            this.formOwner.modifiedName = localStorage.getItem('ms_username')
            this.formOwner.modifiedAt = new Date()
        },
        components: {
            roomVisible,
            parkingVisible
        },
        methods: {
            getData() {
                getComm(this.query).then(res => {
                    this.commArr = res.data;
                });
                getAllProp(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.data.data;
                    this.pageTotal = res.data.pageTotal;
                });

                listCompAll(this.query).then(res => {
                    // debugger
                    this.compList = res.data.records;
                    if (res.data.records.length == 1) {
                        this.query.compName = res.data.records[0].name;
                    }

                });
                // getComp().then(res => {
                //     this.compName = res.data.name;
                //     this.$set(this.form, 'compId', res.data.id);
                // });
            },
            handleRefresh() {
                this.query = {
                    commId: '',
                    pageNo: 1,
                    size: 10
                };
                this.getData();
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
            //表格行点击事件
            openDetails(row) {
                //具体操作
                this.form = row;
                this.disable = true;
                this.editVisible = true;
                this.title = '查看物业对应信息';

            },
            //新增操作
            handleAdd() {
                this.ownerVisible = true;
                this.title = '新增物业对应信息';
                this.form = {};
                this.editshow = true;
                this.form.ownerId = this.query.ownerId;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                console.log(this.query);
                this.getData();
            },
            // 删除操作
            handleDelete(id) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteOwnerProp(id).then(res => {
                            this.$message.success('删除成功');
                            this.getData();
                        });
                    })
                    .catch(() => {
                    });
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
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            getInfo() {
                if (this.form.taxpayerType && this.form.identificationNo) {
                    getInfo(this.form).then(res => {
                        if (res.data != null) {
                            this.$set(this.form, 'name', res.data.name);
                            this.$set(this.form, 'bank', res.data.bank);
                            this.$set(this.form, 'registerTel', res.data.registerTel);
                            this.$set(this.form, 'registerAddr', res.data.registerAddr);
                            this.$set(this.form, 'remark', res.data.remark);
                        }
                    });
                }
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.disable = false;
                this.title = '编辑物业对应信息';
                this.editVisible = true;
                this.editshow = false;
            },
            // 保存编辑
            saveEditOrAdd(title) {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.editVisible = false;
                        let query = {};
                        query.id = this.form.id
                        query.type = this.form.type
                        query.remark = this.form.remark
                        updateOwnerProp(query).then(res => {
                            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.$set(this.tableData, this.idx, this.form);
                        });
                    }
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            },
            handleGetComm(val) {
                getArea(val).then(res => {
                    this.areaArr = [];
                    this.buidlArr = [];
                    this.form.commAreaId = '';
                    this.form.buildingId = '';
                    this.query.commAreaId = '';
                    this.query.buildingId = '';
                    this.areaArr = res.data;
                });
            },
            handleGetArea(val) {

                getBuild(val).then(res => {
                    this.buidlArr = [];
                    this.form.buildingId = '';
                    this.query.buildingId = '';
                    this.buidlArr = res.data;
                });
            },
            handleGetBuild(val) {
                this.$forceUpdate();
            },
            saveOwnerAdd(title,form) {
                this.$refs[form].validate((valid)=>{
                    if(valid) {
                        console.log(this.formOwner)
                        insertRoomOwnerOrPark(this.formOwner).then(res => {
                            if (res.code===0){
                                this.$message.success(`添加成功`);
                                this.ownerVisible = false;
                                this.getData();
                            }else{
                                this.$message.error(res.msg);
                            }
                        });
                    }
                });
            },
            selectOwner() {
                this.selectOwnerVis = true;
                getOwenList(this.query2).then(res => {
                    this.tableData2 = res.data.data;
                    this.pageTotal2 = res.data.pageTotal || 0;
                });
            },
            ownerYes() {
                this.selectOwnerVis = false;
            },
            ownerNo() {
                this.formOwner.ownerId = '';
                this.ownerName = '';
                this.selectOwnerVis = false;
            },
            handleSelection(val) {
                this.ownerName = '';
                const length = val.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    if (i === length - 1) {
                        str += val[i].id;
                    } else {
                        str += val[i].id + ',';
                    }
                    this.ownerName += val[i].name + ';';
                }
                this.formOwner.ownerId = str;
            },
            roomParkingSearch() {

                if(this.formOwner.propertyType!=''&&this.formOwner.propertyType!=undefined){
                    if (this.formOwner.propertyType == '房产') {
                        this.roomDetail(this.formOwner.compId, this.formOwner.commId, this.formOwner.commAreaId);
                    } else {
                        this.parkingDetail(this.formOwner.compId, this.formOwner.commId, this.formOwner.commAreaId);
                    }
                }else{
                    this.$message.info("请先选择物业类型，再进行选择");
                }
            },
            roomDetail(compId, commId, commAreaId) {
                this.roomVisible = true;
                this.$nextTick(() => {
                    this.$refs.roomVisible.dataInitializationByMeter(compId, commId, commAreaId);
                });

            },
            parkingDetail(compId, commId, commAreaId) {
                this.parkingVisible = true;
                this.$nextTick(() => {
                    this.$refs.parkingVisible.dataInitializationByMeter(compId, commId, commAreaId);
                });

            },
            childByValue(list){
                console.log(list)
                this.roomVisible = false;
                this.formOwner.propertyId = list.id;
                this.formOwner.compId = list.compId;
                this.formOwner.commId = list.commId;
                this.formOwner.commAreaId = list.commAreaId;
                this.formOwner.buildingId = list.buildingId;
                this.formOwner.propertyName = list.buildingNo+"-"+list.unitNo+"-"+list.roomNo;
            },
            childByValueParking(list){
                console.log(list)
                this.parkingVisible = false;
                this.formOwner.propertyId = list.id;
                this.formOwner.compId = list.compId;
                this.formOwner.commId = list.commId;
                this.formOwner.commAreaId = list.commAreaId;
                this.formOwner.propertyName = list.no;
            },
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

    .el-input {
        width: 200px;
    }

    .el-input__inner {
        width: 200px;
        padding: 0 0 0 30px;
    }
</style>
