<template>
    <div class="sidebar">
        <!--    :show-checkbox="true"  选择    -->
        <el-tree :data="data" :props="defaultProps" show-checkbox @node-click="handleNodeClick"
                 @check-change="handleCheckChange" class="trees"
                 :default-checked-keys="checkdata"
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
                checkdata:[],
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
        props:{
            arr :array,
        },
        watch: {
            arr: {
                immediate: true,
                handler: function (newVal) {
                    this.checkdata = newVal;
                }
            },


        },
        methods: {
            handleNodeClick(e) {
                console.log(e);
                if (e.type === 'community') {
                    window.localStorage.setItem('commId', e.id);
                }
                if (e.compId) {
                    window.localStorage.setItem('compId', e.compId);
                }
            },
            handleCheckChange() {
                console.log();
                var arr = this.$refs.tree.getCheckedNodes();
                console.log(arr);
                for (var i = 0; i < arr.length; i++) {
                    this.child(arr[i]);
                }
            },
            child(arr) {
                if(arr.childList){
                    this.child(arr.childList);
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        if(arr[i].type==='build'){
                            console.log(arr[i].id+"<======>"+arr[i].name);
                            this.$emit("child1", arr[i].id, arr[i].name);
                        }
                    }
                }
            }
        }
    };
</script>