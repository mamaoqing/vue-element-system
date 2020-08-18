<template>
    <el-select v-model="value" :placeholder="titleValue" @change="selectDict(value)" clearable style="width: 150px">
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
        name: 'distUtil',
        data() {
            return {
                id: '',
                data: [],
                value: '',
                name: '',
                titleValue:'',
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
            },
            title:{
                immediate: true,
                handler :function (newVal) {
                    this.titleValue = newVal;
                },
            }

        },
        props: {
            distId: String,
            distName: String,
            change: String,
            title:String,
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
            },

        }
    }
</script>