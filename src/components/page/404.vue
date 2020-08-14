<template>
    <div class="children">
        <button @click="takeUp">点击传值给父组件</button>
    </div>
</template>

<script>
    export default {
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            takeUp(){
                this.$emit("child","content");
            }
        }
    }
</script>