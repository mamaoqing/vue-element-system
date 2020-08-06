<template>
    <el-form>
        <el-form-item label="地址" :label-width="'100px'">
            <el-select v-model="addList.province" placeholder="请选择省" class="address_select" @change="getcity(addList.province,true)" size="small">
                <el-option v-for="item in sheng" :key="item.provinceCode" :label="item.provinceName" :value="item.provinceCode">
                </el-option>
            </el-select>
            <el-select v-model="addList.city" placeholder="请选择市" class="address_select" @change="getarea(addList.city,true)" size="small">
                <el-option v-for="item in shi" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="addList.area" placeholder="请选择区" class="address_select" @change="postData()" size="small">
                <el-option v-for="item in qu" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>
<script>
    import {getCityDict } from '../../api/index';
    export default {
        name: "city",
        data() {
            return {
                sheng: [],
                shi: [],
                qu: [],
            };
        },
        props: ["addList"],//从父组件接受的数据
        methods: {
            // 获取省
            getsheng() {
                getCityDict().then(res => {
                    console.log(res);
                    this.sheng = res.data;//将获取的数据赋值
                });

                // var _this = this;
                // _this
                //     .$axios({
                //         method: "post",
                //         url: "*****"//获取省的接口
                //     })
                //     .then(function(res) {
                //         if (res.data.flag == 0) {//请求成功
                //             _this.sheng = res.data.data;//将获取的数据赋值
                //         }
                //     })
                //     .catch(function(response) {
                //         _this.$message.error(response.data.message);
                //     });
            },
            // 点击地区获取市
            getcity(id, is) {
                if (is) {
                    //判断是否点击上一级
                    this.addList.area = "";
                    this.addList.city = "";
                }

               /* var _this = this;
                var params = {
                    id: id //省的id，通过省获取此省下的市
                };
                params = this.$qs.stringify(params);
                _this
                    .$axios({
                        method: "post",
                        url: "****",//获取市的接口
                        data: params
                    })
                    .then(function(res) {
                        console.log(res);
                        if (res.data.flag == 0) {
                            _this.shi = res.data.data;//赋值
                        } else {
                        }
                    })
                    .catch(function(response) {
                        _this.$message.error(response.data.message);
                    });*/
                this.postData();
            },
            // 点击城市获取区
            getarea(id, is) {
                var _this = this;
                if (is) {
                    //判断是否点击上一级
                    this.addList.area = "";
                }
                var params = {
                    id: id //市的id，通过市获取此市下的区
                };
                params = this.$qs.stringify(params);
                _this
                    .$axios({
                        method: "post",
                        url: "*****",//获取区的接口
                        data: params
                    })
                    .then(function(res) {
                        if (res.data.flag == 0) {
                            _this.qu = res.data.data;
                            _this.postData();
                        }
                    })
                    .catch(function(response) {
                        _this.$message.error(response.data.message);
                    });

            },
            // 向父组件传值
            postData() {
                let _this = this;
                let sheng = this.sheng;
                let shi = this.shi;
                let qu = this.qu;

                setTimeout(function() {
                    _this.$emit("addlist", _this.addList);
                }, 10);
            }
        },
        mounted() {
            this.getsheng();
        },
        watch: {
            //监听父组件传值的变化
            // addList: {
            //     handler: function(val, oldval) {
            //         this.getcity(val.province, false);
            //         this.getarea(val.city, false);
            //     },
            //     immediate: true, //关键
            //     deep: true
            // }
        }
    };
</script>
<style scoped>

</style>
