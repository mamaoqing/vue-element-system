<template>
    <div style="width: 200px;height: 100%">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>

</template>
<script>
    import {treeorg} from '../../api/treemenu';

    export default {
        data() {
            return {
                data: [],
                defaultProps: {
                    children: 'childList',
                    label: 'name'
                }
            };
        },
        created() {
            treeorg(this.query).then(res => {
                if (res.code === 0) {
                    this.data = res.data;
                }
            });
        },
        methods: {
            handleNodeClick(e) {
                // console.log(e.id);
            }
        }
    };
</script>
