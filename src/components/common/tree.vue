<template>
    <div class="sidebar">
        <!--    :show-checkbox="true"  选择    -->
        <el-tree :data="data" :props="defaultProps" show-checkbox @node-click="handleNodeClick"
                 @check-change="handleCheckChange" class="trees"
                 :default-checked-keys="checkdata"
                 node-key="id"
                 ref="tree"
        ></el-tree>
    </div>
</template>
<script>
    import tree from '../../utils/treemenu'
    import {treemenu} from '../../api/treemenu';

    export default {
        components: {
            NavMenu: tree
        },
        data() {
            return {
                collapse: false,
                items: [],
                checkdata: [],
                data: [],
                defaultProps: {
                    children: 'childList',
                    label: 'name'
                }
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            treemenu(this.query).then(res => {
                if (res.code === 0) {
                    this.data = res.data;
                }
            });
        },
        props: {
            arr: Array,
        },
        watch: {
            arr: {
                immediate: true,
                handler: function (newVal) {
                    console.log(newVal);
                    this.checkdata = newVal;
                   if(newVal){
                       this.$nextTick(() => {
                           this.$refs.tree.setCheckedKeys(this.checkdata);
                       });
                   }else{
                       this.checkdata = [];
                       this.$nextTick(() => {
                           this.$refs.tree.setCheckedKeys(this.checkdata);
                       });
                   }
                }
            },


        },
        methods: {
            handleNodeClick(e) {
                if (e.type === 'community') {
                    window.localStorage.setItem('commId', e.id);
                }
                if (e.compId) {
                    window.localStorage.setItem('compId', e.compId);
                }
            },
            handleCheckChange() {
                var arr = this.$refs.tree.getCheckedNodes();
                var s = this.child(arr);
                this.$emit("child1", s, 'room');
            },
            child(arr) {
                var result = '';
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].childList) {
                        this.child(arr[i].childList);
                    } else {
                        if (arr[i].type === 'room') {
                            result += arr[i].id + ',';
                        }
                    }
                }
                return result;
            }
        }
    };
</script>