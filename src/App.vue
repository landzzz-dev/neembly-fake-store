<template>
	<v-app>
		<v-app-bar elevation="1" density="prominent">
			<v-container class="h-100 d-flex flex-column">
				<div class="d-flex align-center ga-4" style="height: 100%;">
					<v-toolbar-title>
						<v-icon>mdi-store</v-icon>
						Neembly Fake Store
					</v-toolbar-title>
				</div>
				<div class="d-flex align-center ga-4 w-100">
					<p style="white-space: nowrap;">Total Product(s): <strong>{{ filteredProducts.length }}</strong></p>
					<div v-if="$vuetify.display.xs" class="d-flex align-center justify-end ga-4 w-100">
						<v-btn 
							icon 
							size="small" 
							class="bg-grey" 
							v-tooltip="'Search Product'"
							:elevation="searchBtnElevation"
							@mouseenter="searchBtnElevation = 4"
							@mouseleave="searchBtnElevation = 0"
							@click="searchDialog = !searchDialog"
						> 
							<v-icon size="x-large">mdi-magnify</v-icon>
						</v-btn>
						<v-btn  
							icon 
							size="small" 
							class="bg-primary scaleUp"
							v-tooltip="'Add Product'"
							:elevation="addProductBtnElevation"
							@mouseenter="addProductBtnElevation = 4"
							@mouseleave="addProductBtnElevation = 0"
							@click="openAddEditDialog('Add', {})"
						>
							<v-icon size="x-large">mdi-plus</v-icon>
						</v-btn>
						<v-btn  
							icon 
							size="small" 
							class="bg-warning scaleUp" 
							v-tooltip="'Modify Product'"
							:elevation="modifyProductBtnElevation"
							@mouseenter="modifyProductBtnElevation = 4"
							@mouseleave="modifyProductBtnElevation = 0"
							@click="modifyProduct = !modifyProduct"
						>
							<v-icon size="x-large">mdi-pencil</v-icon>
						</v-btn>
					</div>
					<div v-else class="d-flex align-center ga-4 w-100">
						<v-text-field 
							clearable
							hide-details
							class="flex-fill"
							placeholder="Search Product..." 
							prepend-inner-icon="mdi-magnify" 
							v-model="search"
						></v-text-field>
						<v-btn
							height="40"
							class="bg-primary scaleUp"
							:elevation="addProductBtnElevation"
							@mouseenter="addProductBtnElevation = 4"
							@mouseleave="addProductBtnElevation = 0"
							@click="openAddEditDialog('Add', {})" 
						>
							Add Product
						</v-btn>
						<v-btn 
							height="40"
							class="bg-warning scaleUp"
							:elevation="modifyProductBtnElevation"
							@mouseenter="modifyProductBtnElevation = 4"
							@mouseleave="modifyProductBtnElevation = 0"
							@click="modifyProduct = !modifyProduct" 
						>
							Modify Product
						</v-btn>
					</div>
				</div>
			</v-container>
		</v-app-bar>

		<v-main>
			<v-container>
				<v-row v-if="loading">
					<v-col cols="12" class="text-center">
						<v-progress-circular size="50" indeterminate color="primary"></v-progress-circular>
						<p class="mt-2">Getting all products, please wait...</p>
					</v-col>
				</v-row>
				<v-row v-else> 
					<v-col v-if="filteredProducts.length == 0" cols="12" class="text-center">No products available.</v-col>
					<v-col 
						v-else
						:cols="$vuetify.display.xs ? 12 : 
						$vuetify.display.mdAndDown ? 6 : 
						$vuetify.display.lg ? 4 : 3" 
						v-for="(item, index) in filteredProducts" :key="index"
					>
						<v-card 
							height="100%"
							rounded="0"
							:elevation="cardIndex == index ? elevation : 1" 
							:class="cardIndex == index ? 'scaleUp' : ''"
							@mouseleave="elevation = 1" 
							@mouseenter="elevation = 8; cardIndex = index" 
						>
							<div v-if="modifyProduct" class="pa-2" style="display: grid; position: absolute; width: 100%; justify-content: right; z-index: 9999;">
								<v-btn 
									icon 
									size="small" 
									color="success"
									v-tooltip="'Edit ' + item.title" 
									@click="openAddEditDialog('Edit', item)"
								>
									<v-icon>mdi-pencil</v-icon>
								</v-btn>
								<v-btn 
									icon 
									size="small" 
									color="error"
									v-tooltip="'Delete ' + item.title" 
									@click="openDeleteDialog(item)" 
								>
									<v-icon>mdi-close</v-icon>
								</v-btn>
							</div>
							<div style="justify-items: center; background-image: radial-gradient(circle,white 0%, gray 150%)">
								<v-img eager cover height="200" width="200" :lazy-src="item.image" :src="item.image"></v-img>
							</div>
							<div class="pa-4">
								<p :title="item.title" class="text-truncate" style="font-weight: 550; font-size: large;">{{ item.title }}</p>
								<div style="max-height: 40px; overflow-y: auto; font-size: smaller; margin-bottom: 8px;">
									<p :title="item.description" class="text-justify"><strong>Description:</strong> {{ item.description }}</p>
								</div>
								<p class="text-capitalize text-medium-emphasis">{{ item.category }}</p>
								<div class="d-flex align-center ga-2">
									<v-rating
										length="5"
										size=""
										half-increments
										active-color="warning"
										v-model="item.rating.rate"
									></v-rating>
									<pre>({{ item.rating.count }})</pre>
								</div>
								<p><strong>${{ item.price }}</strong></p>
							</div>
						</v-card>
					</v-col>
				</v-row>
			</v-container> 
		</v-main>

		<SearchDialog
			v-model:search="search"
			v-model:search-dialog="searchDialog"
		></SearchDialog>

		<AddEditDialog 
			:mode="productObject.mode"
			:index="productObject.index"
			:items="productObject.items"
			:old-items="productObject.oldItems"
			:headers="productObject.headers"
			v-model="productDialog"
		></AddEditDialog>

		<DeleteDialog
			:items="productDeleteObject.items"
			v-model="productDeleteDialog"
		></DeleteDialog>
	</v-app>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watchEffect, defineAsyncComponent } from 'vue';
import { useDisplay } from 'vuetify';
import { useStore } from './plugins/store.js';
import SearchDialog from './components/SearchDialog.vue';
const AddEditDialog = defineAsyncComponent(() => import('./components/AddEditDialog.vue'));
import DeleteDialog from './components/DeleteDialog.vue';

const store = useStore();
const { name } = useDisplay();

const headers = ref([
	{title: 'Title', value: 'title'},
	{title: 'Category', value: 'category'},
	{title: 'Price', value: 'price'},
	{title: 'Rating', value: [
		{title: 'Rate', value: 'rate'},
		{title: 'Count', value: 'count'}
	]},
	{title: 'Description', value: 'description'},
	{title: 'Image', value: 'image'},
	{title: 'Actions', value: 'actions'},
]);

const loading = ref(false);

onMounted(async () => {
	loading.value = true;
	await new Promise((resolve) => setTimeout(resolve, 1000));
	await store.getProducts();
	loading.value = false;
});

const searchBtnElevation = ref(0)
const addProductBtnElevation = ref(0)
const modifyProductBtnElevation = ref(0)

const cardIndex = ref(-1);
const elevation = ref(1);
const modifyProduct = ref(false);


//* ADD / EDIT PRODUCT
const productDialog = ref(false);
const productObject = reactive({
	mode: '',
	index: -1,
	items: {},
	oldItems: {},
	headers: [],
})
const openAddEditDialog = (mode, item) => {
    productDialog.value = true;
    productObject.mode = mode;

    if (mode === 'Add') {
        productObject.index = -1;
        productObject.items = {};
        productObject.oldItems = {};
        productObject.headers = [...headers.value];
    } else {
        productObject.index = store.productData.indexOf(item);
        productObject.items = {
			id: item.id,
            title: item.title,
            category: item.category,
            price: item.price,
			rate: item.rating.rate,
			count: item.rating.count,
            description: item.description,
            image: item.image
        };
		productObject.oldItems = {...item};
    }
};




//* DELETE PRODUCT
const productDeleteDialog = ref(false);
const productDeleteObject = reactive({
	items: {}
});
const openDeleteDialog = (items) => {
	productDeleteDialog.value = true;
	productDeleteObject.items = {...items}
}

const searchDialog = ref(false);
watchEffect(() => {
	if (name.value !== 'xs') searchDialog.value = false;
});


//* FILTER PRODUCT
const search = ref('');
const filteredProducts = computed(() => {
	if (search.value) {
		const filter = search.value?.toLocaleLowerCase();
		return store.productData.filter((item) => {
			return item.title.toLocaleLowerCase().includes(filter);
		});
	} else {
		return store.productData;
	}
});

</script>

<style scoped>
.v-main {
    background-color: #f8fafd !important;
}

.scaleUp {
	transition: .5s ease-in-out;
}

.scaleUp:hover {
	transform: scale(1.02);
}
</style>