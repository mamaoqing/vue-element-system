<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"

                unique-opened
                router
        >
            <NavMenu :navMenus="items"></NavMenu>
        </el-menu>
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
                items: []
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            treemenu(this.query).then(res => {
                console.log(res);
                if (res.code === 0) {
                    var array = res.data;
                    for (var i = 0; i < array.length; i++) {
                        this.items.push(array[i]);
                    }
                    console.log(this.items);

                }
            });
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {

                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
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
</style>
