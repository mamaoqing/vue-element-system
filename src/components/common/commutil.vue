<template>
    <el-select v-model="compValue" @clear="clearComm" clearable filterable placeholder="请选择社区"
               @change="selectComm(compValue)">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.id">
        </el-option>
    </el-select>
</template>

<script>

    import {listComm} from "./selectutil";

    export default {
        name: 'compUtil',
        data() {
            return {
                compValue: '',
                options: [],
                compId:'',
            }
        },
        created() {
            this.getCommInit();
        },
        // 获取父组件的值
        watch: {
            compIds:{
                immediate: true,
                handler: function (newVal) {
                    this.compId = newVal;
                    this.getCommInit();
                }
            },
            change:{
                immediate: true,
                handler: function (newVal) {
                    this.compValue = newVal;
                }
            }
        },
        props: {
            compIds:Number,
            change:Number
        },
        methods: {
            getCommInit() {
                listComm(this.compId).then(res => {
                    this.options = res.data;
                });
            },
            selectComm(value) {
                this.$emit("comm", value);
            },
            clearComm() {
                this.$emit("comm", '');
            },
        }
    }
</script>