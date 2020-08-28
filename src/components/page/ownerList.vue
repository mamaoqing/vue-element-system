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
                >批量删除</el-button>
                <el-select v-model="query.compId" placeholder="请选择" @change="compChange">
                    <el-option key="qxz" label="请选择物业公司" value=""></el-option>
                    <el-option :value="types.id" :key="types.id" :label="types.name" v-for="types in compList">
                        {{types.name}}
                    </el-option>
                </el-select>
                <el-select v-model="query.commId" placeholder="请选择" @change="commChange">
                    <el-option key="qxz" label="请选择社区名称" value=""></el-option>
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
                <el-button type="primary" icon="el-icon-lx-add" @click="exportXls">导出</el-button>
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
                <el-table-column label="操作" width="320" align="center">
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
                        <el-input v-model="compName" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="公司id"  v-show="false" label-width="150px">
                        <el-input v-model="form.compId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="社区id"  v-show="false" label-width="150px">
                        <el-input v-model="form.commId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="分区id"  v-show="false" label-width="150px">
                        <el-input v-model="form.commAreaId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="建筑id"  v-show="false" label-width="150px">
                        <el-input v-model="form.buildingId" disabled></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="房间id"  v-show="false" label-width="150px">
                        <el-input v-model="form.roomId" disabled></el-input>
                    </el-form-item>

                    <el-form-item class="item" label="业主类型" label-width="150px" prop="ownerType"
                                  :rules="[
                        { required: true, message: '请选择业主类型', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.ownerType" placeholder="请选择业主类型">
                            <el-option :value="types.name" :key="types.name" :label="types.name"
                                       v-for="types in ownerTypes"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="证件类型" label-width="150px" prop="certType"
                                  :rules="[
                        { required: true, message: '请选择证件类型', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.certType" placeholder="请选择">
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
                        <el-select v-model="form.industry" placeholder="请选择行业">
                            <el-option :value="types.name" :key="types.id" :label="types.name"
                                       v-for="types in hys"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="性别" label-width="150px" prop="sex"
                                  :rules="[
                        { required: true, message: '请选择性别', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.sex" placeholder="请选择性别">
                            <el-option key="male" label="男" value="男"></el-option>
                            <el-option key="female" label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="籍贯" label-width="150px" prop="nativePlace"
                                  :rules="[
                        { required: true, message: '请选择籍贯', trigger: 'blur' },
                    ]">
                        <el-input v-model="form.nativePlace"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="学历" label-width="150px">
                        <el-input v-model="form.education"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="房屋关系" label-width="150px">
                        <el-select v-model="form.propTypes" placeholder="请选择与房屋关系">
                            <el-option :value="types.name" :key="types.id" :label="types.name"
                                       v-for="types in propTypes"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="item" label="状态" prop="state" label-width="150px"
                                  :rules="[
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ]">
                        <el-select v-model="form.state" placeholder="请选择">
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
        <!-- 开票弹出框   -->
        <el-dialog :visible.sync="oiiVisible" append-to-body>
            <ownerInvoiceInfo v-if="oiiVisible" ref="ownerInvoiceInfo"></ownerInvoiceInfo>
        </el-dialog>
    </div>
</template>

<script scoped>
    import {

        getComp

    } from '../../api/unit';
    import { addOwner, deleteIds, deleteOwner, getCount, getOwenList, update,exportXlsByT } from '../../api/owner';
    import { listCompAll } from '../../api/role';
    import { getDictItemByDictId, getUserComm } from '../../api/building';
    import ownerInvoiceInfo from './ownerInvoiceInfo';
    import ownerProperty from './ownerProperty';
    import { getCityDict } from '../../api';
    import commPage from '../common/commPage';
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
                sexTypes: [],
                propTypes: [],
                certTypes: [],
                hys: [],
                areaArr: [],
                eleNum: '',
                status:0,
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
            ownerProperty
        }
        ,
        methods: {
            // 获取数据
            getData() {
                getOwenList(this.query).then(res => {
                    console.log(res);
                    this.tableData = res;
                    // this.pageTotal = res.data.pageTotal || 0;
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
            getCount() {
                if(this.form.ownerType&&this.form.certType&&this.form.certNumber){
                    getCount(this.form).then(res => {
                        if (res.data != null){
                            this.$set(this.form, 'education', res.data.education);
                            this.$set(this.form, 'name', res.data.name);
                            this.$set(this.form, 'email', res.data.email);
                            this.$set(this.form, 'industry', res.data.industry);
                            this.$set(this.form, 'likes', res.data.likes);
                            this.$set(this.form, 'linkAddr', res.data.linkAddr);
                            this.$set(this.form, 'linkName', res.data.linkName);
                            this.$set(this.form, 'linkTel', res.data.linkTel);
                            this.$set(this.form, 'nativePlace', res.data.nativePlace);
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
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';

                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    if (i===length-1){
                        this.query.delIds+=this.multipleSelection[i].id;
                    }else{
                        this.query.delIds+=this.multipleSelection[i].id+',';
                    }
                    str += this.multipleSelection[i].name + ' ';
                }
                deleteIds(this.query).then(res => {
                    this.$message.error(`删除了${str}`);
                    this.multipleSelection = [];
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
                // this.$set(this.form, 'createdName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'createdAt', new Date());
                // this.$set(this.form, 'modifiedName', localStorage.getItem('ms_username'));
                // this.$set(this.form, 'modifiedAt', new Date());
                this.form.commId = this.row.commId
                this.form.commAreaId = this.row.commAreaId
                this.form.buildingId = this.row.buildingId
                this.form.roomId = this.row.id
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
                this.form.commId = this.row.commId
                this.form.commAreaId = this.row.commAreaId
                this.form.buildingId = this.row.buildingId
                this.form.roomId = this.row.id
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
                this.editVisible = true;
                let that = this;
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
                            this.query.commName = '请选择社区名称';
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
            dataInitialization(row){
              this.query.roomId = row.id
              this.row = row

            },
            handleoii(id) {
                let linkID = id;
                this.oiiVisible = true;
                this.$nextTick(() => {
                    this.$refs.ownerInvoiceInfo.dataInitialization(linkID);
                });

            },
            handleProp(id){
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
            exportXls(){
                console.log(this.query)
                exportXlsByT(this.query).then(res => {
                    var blob = new Blob([res],{type:'application/octet-stream'},'sheet.xlsx')
                    if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                        window.navigator.msSaveBlob(blob, unescape(res.headers.filename.replace(/\\u/g, '%u')));
                    } else {
                        var downloadElement = document.createElement('a');
                        var href = window.URL.createObjectURL(blob); //创建下载的链接

                        downloadElement.href = href;
                        downloadElement.download = unescape('业主信息.xls'); //下载后文件名

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
