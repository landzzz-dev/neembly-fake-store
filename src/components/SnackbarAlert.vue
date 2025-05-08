<template>
    <div>
        <v-alert
            v-if="model"
            elevation="10"
            :type="props.type"
            :title="props.title"
            :text="props.text"
            style="position: fixed; bottom: 10px; right: 10px; z-index: 9999;"
        ></v-alert>
    </div>  
</template>

<script setup>
import { watch } from 'vue';

const model = defineModel();
const props = defineProps({
    type: String,
    title: String,
    text: String,
});

watch(() => model.value, (val) => {
    if (val) {
        setTimeout(() => {
            model.value = false;
        }, 4000);
    }
});

</script>