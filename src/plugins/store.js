import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore('store', () => {
    const productData = ref([]);
    const getProducts = async () => {
        try {
            const res = await axios.get('https://fakestoreapi.com/products');
            productData.value = res.data;
        } catch (err) {
            console.error('Error getting products: ', err);
        }
    }


    return {
        productData,
        getProducts,
    }
});