<template>
    <div>
        <v-dialog width="400px" v-model="model">
            <v-card border="md" rounded="0">
                <v-card-text class="text-center pa-10">
                    <v-icon size="70" color="warning">mdi-alert</v-icon>
                    <p>Do you want to delete</p> 
                    <strong>{{ props.items.title }}</strong>?
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="justify-center">
                    <v-btn @click="model = false" width="30%" class="bg-error">
                        <v-icon>mdi-close</v-icon>
                        <span>NO</span>
                    </v-btn>
                    <v-btn @click="deleteProduct(props.items.id)" width="30%" class="bg-primary">
                        <v-icon>mdi-check</v-icon>
                        <span>YES</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <SnackbarAlert 
            :type="snackbarAlert.type"
            :title="snackbarAlert.title"
            :text="snackbarAlert.text"
            v-model="snackabar"
        ></SnackbarAlert>
    </div>
</template>

<script setup>
import { useStore } from '@/plugins/store';
import { ref } from 'vue';
import SnackbarAlert from './SnackbarAlert.vue';

const model = defineModel();
const props = defineProps({
    items: Object,
});

const store = useStore();

const snackabar = ref(false);
const snackbarAlert = ref({
    type: '',
    title: '',
    text: '',
});

const deleteProduct = async (id) => {
    const index = store.productData.findIndex((item) => item.id == id);
    store.productData.splice(index, 1);
    model.value = false;
    snackabar.value = true;
    snackbarAlert.value = {
        type: 'success',
        title: props.items.title,
        text: 'Successfully deleted'
    }
}
</script>

<style scoped>

</style>