<template>

    <el-select v-model="value" clearable placeholder="请选择" @change="selectDict(value)">
        <el-option
                v-for="item in data"
                :key="item.value"
                :label="item.name"
                :value="item.name">
        </el-option>
    </el-select>
</template>

<script>
    import {getDictItemByDictId} from '../../api/building'

    export default {
        name: 'child',
        data() {
            return {
                id: '',
                data: [],
                value: '',
                name: '',
            }
        },
        created() {
        },
        // 获取父组件的值
        watch: {
            distId: {
                immediate: true,
                handler: function (newVal) {
                    this.id = newVal;
                    this.data = [];
                    this.getDictItem();
                }
            },
            distName: {
                immediate: true,
                handler :function (newVal) {
                    this.name = newVal;
                },
            },
            change:{
                immediate: true,
                handler :function (newVal) {
                    this.value = newVal;
                },
            }

        },
        props: {
            distId: String,
            distName: String,
            change: String,
        },
        methods: {

            takeUp() {
                this.$emit("child1", this.data);
            },
            getDictItem() {
                getDictItemByDictId(this.id).then(res => {
                    this.data = res.data
                });
            },
            selectDict(value) {
                this.$emit("child1", value, this.name);
            }
        }
    }
</script>