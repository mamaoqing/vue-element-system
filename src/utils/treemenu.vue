<!--递归组件 循环展示菜单信息-->
<template>
    <div class="navMenu">

        <template v-for="navMenu in navMenus">
            <!-- 最后一级菜单 -->
            <el-menu-item v-if="!navMenu.childList"
                          :key="navMenu.id" :data="navMenu" :index="navMenu.name"
            >
                <i class="fa fa-car"></i>
<!--                <i :class="navMenu.iconPath"></i>-->
                <span slot="title">{{navMenu.name}}</span>
            </el-menu-item>

            <!-- 此菜单下还有子菜单 -->
            <el-submenu v-if="navMenu.childList"
                        :key="navMenu.id" :data="navMenu" :index="navMenu.name">
                <template slot="title">
                    <i :class="navMenu.iconPath"></i>
                    <span> {{navMenu.name}}</span>
                </template>
                <!-- 递归 -->
                <NavMenu :navMenus="navMenu.childList"></NavMenu>
            </el-submenu>
        </template>

    </div>
</template>
<script>
    export default {
        name: 'NavMenu',
        props: ['navMenus'],
        data() {
            return {}
        },
        methods: {}
    }
</script>