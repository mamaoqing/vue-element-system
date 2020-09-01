<template>
    <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="80px"  style="margin:20px;width:60%;min-width:600px;">
        <el-form-item label="上传文件" prop="excelFile">
            <el-upload
                    class="upload-demo"
                    :headers="header"
                    ref="upload"
                    :action="uploadUrl()"
                    name="file"
                    drag
                    :data="upData"
                    :file-list="fileList"
                    :on-error="uploadFalse"
                    :on-success="uploadSuccess"
                    :auto-upload="false"
                    :before-upload="beforeAvatarUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <el-button slot="trigger" size="small" >选取文件</el-button> -->
                <div slot="tip" class="el-upload__tip" style="color:red">上传文件只能是 xls、xlsx格式!</div>
            </el-upload>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitUpload(form)">导入</el-button>
            <el-button   @click="onCancel(form)">取消</el-button>
        </el-form-item>
    </el-form>
</template>


<script>
    import { listRoom } from '../../api/room';

    export default {
        data() {
            return {
                rules: {
                    coordinateType: [
                        { required: true, message: '请选择文件中的坐标类型', trigger: 'change' }
                    ],
                },
                form: {
                    fileName:'',
                    coordinateType: 'BD09',
                },
                header:{},
                url:'',
                fileList: [],
            }
        },
        computed: {
            // 这里定义上传文件时携带的参数，即表单数据
            upData: function() {
                return this.form
            }
        },
        created() {
            this.getData();
        },
        methods: {
            //导入接口地址
            uploadUrl: function() {
                return this.url; //接口
                    },
            getData() {
                debugger
                this.header={'Authentication-Token':localStorage.getItem("token")};
                console.log(this.header);
            },
            //文件上传成功触发
            uploadSuccess(response, file, fileList) {
                console.log(response)
                if(response.code == 0){
                    this.$message({
                        message: '导入成功',
                        type: 'success'
                    });
                    //导入成功后关闭页面
                    this.$emit('childByValueUpload','');
                }else {
                    this.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
            },
            //文件上传失败触发
            uploadFalse(response, file, fileList) {
                this.$message({
                    message: '文件上传失败！',
                    type: 'error'
                });
            },
            // 上传前对文件的大小和类型的判断
            beforeAvatarUpload(file) {
                this.form.fileName = file.name;
                const extension = file.name.split(".")[1] === "xls";
                const extension2 = file.name.split(".")[1] === "xlsx";
                //const extension3 = file.name.split(".")[1] === "txt";
                if (!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'error'
                    });
                }
                return extension || extension2  ;
            },
            //表单提交
            submitUpload(form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        //触发组件的action
                        this.$refs.upload.submit();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //表单取消
            onCancel(form){
                this.$refs.form.resetFields();
            },
            dataInitializationUpload(uploadUrl){
                this.url = uploadUrl;
            }



        }
    }
</script>