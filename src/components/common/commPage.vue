<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-form-item label="录入人" label-width="150px">
                    <el-input v-model="commForm.createdName" style="width: 350px" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
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
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="修改人" label-width="150px">
                    <el-input v-model="commForm.modifiedName" style="width: 350px" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
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
            </el-col>
        </el-row>
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

</style>
