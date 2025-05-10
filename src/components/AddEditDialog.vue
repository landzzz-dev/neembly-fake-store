<template>
    <div>
        <v-dialog scrollable width="500px" v-model="addEditDialog">
            <v-card rounded="0">
                <v-card-title class="d-flex align-center">
                    <span>{{ props.mode }} Product</span>
                    <v-spacer />
                    <v-icon @click="addEditDialog = false">mdi-close</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text v-if="props.mode === 'Add'" class="pa-4">
                    <v-form ref="form">
                        <div v-for="(item, index) in props.headers" :key="index">
                            <div v-if="item.title !== 'Actions'">
                                <div v-if="item.title != 'Rating'">
                                    <label :for="item.value">{{ item.title }}<span class="text-pink">*</span></label>
                                    <v-text-field 
                                        v-if="item.title === 'Price'"
                                        min="1"
                                        clearable
                                        type="number"
                                        :rules="[v => !!v || item.title + ' required']"
                                        v-model="product[item.value]"
                                        @keydown="numberOnly($event)"
                                    ></v-text-field>
                                    <v-text-field 
                                        v-else
                                        clearable
                                        :rules="[v => !!v || item.title + ' required']"
                                        v-model="product[item.value]"
                                    ></v-text-field>
                                </div>
                                <div v-else>
                                    <div style="width: 100%;" v-for="(rate, i) in item.value" :key="i">
                                        <label :for="rate.value">{{ item.title + ' ' + rate.title }}</label><span class="text-pink">*</span>
                                        <v-text-field 
                                            min="1"
                                            clearable
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
                    <v-form ref="form">
                        <div v-for="(item, index) in props.items" :key="index">
                            <div v-if="index !== 'id'">
                                <label :for="index" class="text-capitalize">{{ index }}<span class="text-pink">*</span></label>
                                <v-text-field 
                                    v-if="index === 'price' || index === 'rate' || index === 'count'"
                                    min="1"
                                    clearable
                                    type="number"
                                    :rules="[v => !!v || index.charAt(0).toUpperCase() + index.slice(1) + ' required']"
                                    v-model="props.items[index]"
                                    @keydown="numberOnly($event)"
                                ></v-text-field>
                                <v-text-field 
                                    v-else
                                    clearable
                                    :rules="[v => !!v || index.charAt(0).toUpperCase() + index.slice(1) + ' required']"
                                    v-model="props.items[index]"
                                ></v-text-field>
                            </div>
                        </div>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn 
                        block 
                        width="30%"
                        :loading="loading" 
                        :class="loading ? 'bg-grey' : 'bg-success'" 
                        @click="saveProduct()" 
                    >
                        <v-icon>mdi-content-save</v-icon>
                        <span>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <CustomAlert
            :type="alertObject.type"
            :title="alertObject.title"
            :text="alertObject.text"
            v-model="alert"
        ></CustomAlert>
    </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore } from '@/plugins/store';
const CustomAlert = defineAsyncComponent(() => import('@/components/custom/CustomAlert.vue'));

const addEditDialog = defineModel();
const props = defineProps({
    mode: String,
    index: [String, Number],
    items: Object,
    oldItems: Object,
    headers: Array,
});

const store = useStore();
const { productData } = storeToRefs(store);

const productId = computed(() => {
    return productData.value.reduce((max, obj) => Math.max(max, obj.id), 0) + 1;
});

const alert = ref(false);
const alertObject = ref({
    type: '',
    title: '',
    text: '',
});

const loading = ref(false);

const form = ref();
const product = ref({});

const saveProduct = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
        loading.value = true;

        const finalProduct = {
            id: props.mode === 'Add' ? productId.value : props.items.id,
            title: props.mode === 'Add' ? product.value.title : props.items.title,
            category: props.mode === 'Add' ? product.value.category : props.items.category,
            price: props.mode === 'Add' ? Number(product.value.price) : Number(props.items.price),
            rating: {
                rate: props.mode === 'Add' ? Number(product.value.rate) : Number(props.items.rate),
                count: props.mode === 'Add' ? Number(product.value.count) : Number(props.items.count),
            },
            description: props.mode === 'Add' ? product.value.description : props.items.description,
            image: props.mode === 'Add' ? product.value.image : props.items.image
        }

        if (props.mode == 'Add') {
            setTimeout(() => {
                productData.value.unshift(finalProduct);
                alert.value = true;
                alertObject.value = {
                    type: 'success',
                    title: product.value.title,
                    text: 'Successfully added'
                }
                loading.value = false;
                addEditDialog.value = false;
                product.value = {};
            }, 1000);
        } else {
            setTimeout(() => {
                productData.value.splice(props.index, 1, finalProduct);
                alert.value = true;
                alertObject.value = {
                    type: 'success',
                    title: props.oldItems.title,
                    text:  props.oldItems.title === props.items.title ? 'Successfully updated' :
                        'Successfully updated to ' + props.items.title
                }
                loading.value = false;
                addEditDialog.value = false;
                product.value = {};
            }, 1000);
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