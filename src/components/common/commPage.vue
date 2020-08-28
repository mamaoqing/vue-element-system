<template>
    <div>

                <el-form-item label="录入人" label-width="150px">
                    <el-input v-model="commForm.createdName"  disabled></el-input>
                </el-form-item>
                <el-form-item label="录入时间" prop="createdAt" label-width="150px" disabled>
                    <el-date-picker
                            v-model="commForm.createdAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                            disabled
                    />
                </el-form-item>
                <el-form-item label="修改人" label-width="150px">
                    <el-input v-model="commForm.modifiedName"  disabled></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="modifiedAt" label-width="150px">
                    <el-date-picker
                            v-model="commForm.modifiedAt"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            default-time="00:00:00"
                            disabled
                    />
                </el-form-item>
    </div>
</template>

<script>

    export default {
        name: 'commPage',
        props: ["form", "status", "editVisible"],//从父组件接受的数据
        data() {
            return {
                commForm: {}
            }
        },
        created() {
            this.commForm = JSON.parse(JSON.stringify(this.form));
            if (this.status === 0) {
                this.commForm.createdName = localStorage.getItem('ms_username')
                this.commForm.createdAt = new Date()
                this.commForm.modifiedName = localStorage.getItem('ms_username')
                this.commForm.modifiedAt = new Date()
            } else if (this.status === 1) {
                this.commForm.modifiedName = localStorage.getItem('ms_username')
                this.commForm.modifiedAt = new Date()
            }
        }
        ,
        watch: {
            editVisible: {
                handler() {
                    this.commForm = JSON.parse(JSON.stringify(this.form));
                    if (this.status === 0) {
                        this.commForm.createdName = localStorage.getItem('ms_username')
                        this.commForm.createdAt = new Date()
                        this.commForm.modifiedName = localStorage.getItem('ms_username')
                        this.commForm.modifiedAt = new Date()
                    } else if (this.status === 1) {
                        this.commForm.modifiedName = localStorage.getItem('ms_username')
                        this.commForm.modifiedAt = new Date()
                    }
                },
                deep: true
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
