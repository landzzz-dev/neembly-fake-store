<template>
    <div>
        <v-alert
            v-if="alert"
            elevation="10"
            :type="props.type"
            :title="props.title"
            :text="props.text"
            style="position: fixed; bottom: 10px; right: 10px; margin-left: 10px; z-index: 9999;"
        ></v-alert>
    </div>  
</template>

<script setup>
import { watch } from 'vue';

const alert = defineModel();
const props = defineProps({
    type: String,
    title: String,
    text: String,
});

watch(() => alert.value, (val) => {
    if (val) {
        setTimeout(() => {
            alert.value = false;
        }, 4000);
    }
});

</script>