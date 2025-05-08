<template>
    <div>
        <v-dialog scrollable width="500px" v-model="model">
            <v-card rounded="0">
                <v-card-title class="d-flex align-center">
                    <span>{{ props.mode }} Product</span>
                    <v-spacer />
                    <v-icon @click="model= false" color="red">mdi-close</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text v-if="props.mode == 'Add'" class="pa-4">
                    <v-form ref="form">
                        <div v-for="(item, index) in props.headers" :key="index">
                            <div v-if="item.title != 'Actions'">
                                <div v-if="item.title != 'Rating'">
                                    <label :for="item.value">{{ item.title }}<span class="text-pink">*</span></label>
                                    <v-text-field 
                                        v-if="item.title != 'Price'"
                                        :rules="[v => !!v || item.title + ' required']"
                                        v-model="product[item.value]"
                                    ></v-text-field>
                                    <v-text-field 
                                        v-else
                                        min="1"
                                        type="number"
                                        :rules="[v => !!v || item.title + ' required']"
                                        v-model="product[item.value]"
                                        @keydown="numberOnly($event)"
                                    ></v-text-field>
                                </div>
                                <div v-else class="d-flex ga-4">
                                    <div style="width: 100%;" v-for="(rate, i) in item.value" :key="i">
                                        <label :for="rate.value">{{ item.title + ' ' + rate.title }}</label><span class="text-pink">*</span>
                                        <v-text-field 
                                            min="1"
                                            type="number"
                                            :rules="[v => !!v || rate.title + ' required']"
                                            v-model="product[rate.value]"
                                            @keydown="numberOnly($event)"
                                        ></v-text-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-text v-else>
                    <v-form ref="form"></v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="saveProduct()" class="bg-success" block width="30%">
                        <v-icon>mdi-content-save</v-icon>
                        <span>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const model = defineModel();
const props = defineProps({
    mode: String,
    items: Object,
    headers: Array,
});

const form = ref();

const product = ref({});

const saveProduct = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
        if (props.mode == 'Add') {
            console.log(product.value);
            
        }
    }
}

const numberOnly = (event) => {
    if (['-', 'e', 'E'].includes(event.key)) {
        event.preventDefault();
    }

    return;
}

</script>

<style scoped>

</style>