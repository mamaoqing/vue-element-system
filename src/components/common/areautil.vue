<template>
    <el-select v-model="areaValue" @clear="clearArea" clearable filterable placeholder="请选择社区分区"
               @change="selectArea(areaValue)">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.id">
        </el-option>
    </el-select>
</template>

<script>

    import {listArea} from "./selectutil";

    export default {
        name: 'areaUtil',
        data() {
            return {
                areaValue: '',
                options: [],
                compId: '',
            }
        },
        created() {
            this.getAreaInit();
        },
        // 获取父组件的值
        watch: {
            commIds: {
                immediate: true,
                handler: function (newVal) {
                    this.compId = newVal;
                    this.getAreaInit();
                }
            },
            changeArea: {
                immediate: true,
                handler: function (newVal) {
                    this.compValue = newVal;
                }
            }
        },
        props: {
            commIds: Number,
            changeArea: Number
        },
        methods: {
            getAreaInit() {
                if (!isNaN(this.compId) && this.compId) {
                    listArea(this.compId).then(res => {
                        this.options = res.data;
                    });
                }
            },
            selectArea(value) {
                this.$emit("area", value);
            },
            clearArea() {
                this.$emit("area", '');
            },
        }
    }
</script>