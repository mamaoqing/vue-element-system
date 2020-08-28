<template>
    <div class="sidebar">
        <!--    :show-checkbox="true"  选择    -->
        <el-tree :data="data" :props="defaultProps" show-checkbox @node-click="handleNodeClick"
                 @check-change="handleCheckChange" class="trees"
                 ref="tree"
        ></el-tree>
    </div>
</template>

<script>
    import tree from '../../utils/treemenu'
    import bus from '../common/bus';
    import {treemenu} from '../../api/treemenu';

    export default {
        components: {
            NavMenu: tree
        },
        data() {
            return {
                collapse: false,
                items: [],
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
        methods: {
            handleNodeClick(e) {
                console.log(e);
                if(e.type === 'community'){
                    window.localStorage.setItem('commId',e.id);
                }
                if(e.compId){
                    window.localStorage.setItem('compId',e.compId);
                }
            },
            handleCheckChange () {
                var arr = this.$refs.tree.getCheckedNodes();
                arr.forEach(function (item,index) {
                });
            }
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
        background: #324157;
        width: 250px;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }

    .trees {
        background: #324157;
    }


    .el-tree {
        color: #ffffff;
    }

    .el-tree-node__label {
        background: #00a854;
        font-size: 18px;
    }

    .el-tree-node:hover {
        background-color: #324157;
    }
    .trees > .el-tree-node__content {
        background-color: red !important;
    }

</style>
