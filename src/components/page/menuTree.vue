<template>
    <div style="width: 200px;height: 100%">
        <el-button @click="getCheckedKeys">保存</el-button>
        <el-button @click="resetChecked">清空</el-button>

        <el-tree
                :data="data"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                check-strictly="true"
                :props="defaultProps">
        </el-tree>
    </div>

</template>
<script>
    import { addRole, listRoleMenu,setRoleMenu,getRoleMenuByRoleId } from '../../api/role';
    import { fetchLinkData } from '../../api';

    export default {
        data() {
            return {
                //data: [],
                query: {
                    roleId:'',
                    menuId:'',
                },
                defaultProps: {
                    children: 'chirldMenuList',
                    label: 'name'
                },
                data: []
            };
        },
        created() {

        },
        methods: {
            dataInitialization(id) {
                this.query.roleId = id;
                //console.log("@@@@@@@@@@@@@@@@@@@@@@"+this.query.roleId);
                this.getData();
                this.getHxData();
            },
            handleNodeClick(e) {
                // console.log(e.id);
            },
            // 获取
            getData() {
                listRoleMenu(this.query).then(res => {
                    if (res.code === 0) {
                        this.data = res.data;

                    }
                });
            },
            getHxData(){
                console.log("------------------------"+this.query.roleId);
                getRoleMenuByRoleId(this.query.roleId).then(res => {
                    if (res.code === 0) {
                        //debugger
                        //console.log(res.data);
                        this.$refs.tree.setCheckedKeys(res.data);
                        //this.$refs.menuTree.setCheckedKeys([4]);
                    }
                });
            },
            getCheckedKeys() {
                var menu=this.$refs.tree.getCheckedKeys();
                var menuId='';
                for(var i=0;i<menu.length;i++){
                    menuId += menu[i]+",";
                }
                this.query.menuId=menuId;
                setRoleMenu(this.query).then(res => {
                    this.$message.success(`保存成功`);
                    window.opener=null
                    window.open('','_self');
                    window.close()
                });
            },
            resetChecked() {
                this.$refs.tree.setCheckedKeys([]);
            }
        }
    };
</script>
<style>
    .el-dialog__body {
        padding: 0px 20px;

    }
    .el-dialog {
        width: 25%;
    }
</style>