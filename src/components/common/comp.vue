<template>
    <el-select v-model="compValue" @clear="clearComp" clearable filterable placeholder="请选择物业公司"
               @change="selectComp(compValue)">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.id">
        </el-option>
    </el-select>
</template>

<script>

    import {getComp} from "../../api/user";

    export default {
        name: 'compUtil',
        data() {
            return {
                compValue: '',
                options: [],
            }
        },
        created() {
            this.getComp();
        },
        // 获取父组件的值
        watch: {
            onChange:{
                immediate: true,
                handler: function (newVal) {
                    this.compValue = newVal;
                }
            }
        },
        props: {
            onChange:Number
        },
        methods: {
            getComp() {
                getComp().then(res => {
                    this.options = res.data;
                });
            },
            selectComp(value) {
                this.$emit("comp", value);
            },
            clearComp() {
                this.$emit("comp", '');
            },
        }
    }
</script>