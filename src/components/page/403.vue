

<template>

    <div class="parent" id="parent">
        11111111122223333
        <child @child1="checkIn" :distId="distId" :distName="name" ></child>
        <input v-model="distId"></input>
    </div>
</template>

<script>
    import child from "./child"

    export default {
        components: {
            child
        },
        data(){
            return{
                name:'马茂庆',
                value:'',
                distId:"3",

            }
        },
        methods: {

            checkIn(data) {
                this.value = data;
                console.log(this.value);
            }
        }
    }
</script>