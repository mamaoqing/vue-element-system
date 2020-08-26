<template>
    <div>
        <el-form-item label="录入人" label-width="150px">
            <el-input v-model="form.createdName" disabled></el-input>
        </el-form-item>
        <el-form-item label="录入时间" prop="createdAt" label-width="150px" disabled>
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
        <el-form-item label="修改人" label-width="150px">
            <el-input v-model="form.modifiedName" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="modifiedAt" label-width="150px">
            <el-date-picker
                    v-model="form.modifiedAt"
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
    import { getCityDict, getProvinces } from '../../api';
    import { getDictItemByDictId } from '../../api/building';

    export default {
        name: 'commPage',
        props: ["form"],//从父组件接受的数据
        created() {

        },
        mounted() {
            if (this.form.id!=null){
                console.log("--------------------------")
                this.form.modifiedName = localStorage.getItem('ms_username')
                this.form.modifiedAt = new Date()
            }else{
                console.log("+++++++++++++++++++++++++")
                this.form.createdName = localStorage.getItem('ms_username')
                this.form.createdAt = new Date()
                this.form.modifiedName = localStorage.getItem('ms_username')
                this.form.modifiedAt = new Date()

            }
        }
    };
</script>

<style scoped>

</style>
