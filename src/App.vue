<template>
	<v-app>
		<v-app-bar>
			<v-container class="d-flex align-center">
				<v-toolbar-title>
					<v-icon>mdi-store</v-icon>
					Neembly Fake Store
				</v-toolbar-title>
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
					<v-col :cols="$vuetify.display.xs ? 12 : 6">
						<v-text-field 
							clearable
							hide-details 
							placeholder="Search Product..." 
							prepend-inner-icon="mdi-magnify" 
							v-model="search"
						></v-text-field>
					</v-col>
					<v-col :cols="$vuetify.display.xs ? 12 : 6" class="text-end">
						<v-btn 
							class="mr-2"
							height="40" 
							color="primary"
							:width="$vuetify.display.xs ? '49%' : ''" 
							@click="openAddEditDialog('Add', {})" 
						>
							Add Product
						</v-btn>
						<v-btn 
							height="40" 
							color="warning"
							:width="$vuetify.display.xs ? '49%' : ''" 
							@click="modifyProduct = !modifyProduct" 
						>
							Modify Product
						</v-btn>
					</v-col>
					<v-col v-if="filteredProducts.length == 0" cols="12" class="text-center">No products available.</v-col>
					<v-col 
						v-else
						:cols="$vuetify.display.xs ? 12 : 
						$vuetify.display.mdAndDown ? 6 : 
						$vuetify.display.lg ? 4 : 3" 
						v-for="(item, index) in filteredProducts" :key="index"
					>
						<v-card 
							rounded="0"
							:elevation="cardIndex == index ? elevation : 2" 
							:class="cardIndex == index ? 'scaleUp' : ''"
							@mouseleave="elevation = 4" 
							@mouseenter="elevation = 8; cardIndex = index" 
						>
							<div v-if="modifyProduct" class="pa-2" style="display: grid; position: absolute; width: 100%; justify-content: right; z-index: 9999;">
								<v-btn 
									icon 
									size="small" 
									v-tooltip="'Edit ' + item.title" color="success"
									@click="openAddEditDialog('Edit', item)"
								>
									<v-icon>mdi-pencil</v-icon>
								</v-btn>
								<v-btn 
									icon 
									size="small" 
									v-tooltip="'Delete ' + item.title" 
									@click="openDeleteDialog(item)" color="error"
								>
									<v-icon>mdi-close</v-icon>
								</v-btn>
							</div>
							<div style="justify-items: center; background-image: radial-gradient(circle,white 0%, gray 150%)">
								<v-img eager cover height="200" width="200" :lazy-src="item.image" :src="item.image"></v-img>
							</div>
							<div class="pa-4">
								<p class="text-truncate" style="font-weight: 550; font-size: large;">{{ item.title }}</p>
								<p class="text-capitalize text-medium-emphasis">{{ item.category }}</p>
								<p class="d-flex align-center ga-2">
									<v-rating
										length="5"
										size=""
										half-increments
										active-color="warning"
										v-model="item.rating.rate"
									></v-rating>
									<pre>({{ item.rating.count }})</pre>
								</p>
								<p><strong>${{ item.price }}</strong></p>
							</div>
						</v-card>
					</v-col>
				</v-row>
			</v-container> 
		</v-main>

		<AddEditDialog 
			:mode="productObject.mode"
			:items="productObject.items"
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
import { onMounted, ref, reactive, computed } from 'vue';
import { useStore } from './plugins/store.js';
import AddEditDialog from './components/AddEditDialog.vue';
import DeleteDialog from './components/DeleteDialog.vue';

const store = useStore();

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

const cardIndex = ref(-1);
const elevation = ref(2);
const modifyProduct = ref(false);

const productDialog = ref(false);
const productObject = reactive({
	mode: '',
	items: {},
	headers: [],
})
const openAddEditDialog = (mode, item) => {
	productDialog.value = true;
	productObject.mode = mode;
	productObject.headers = headers.value;

	if (mode == 'Add') {
		//
	} else {
		productObject.items = {...item};
	}
};

const productDeleteDialog = ref(false);
const productDeleteObject = reactive({
	items: {}
});
const openDeleteDialog = (items) => {
	productDeleteDialog.value = true;
	productDeleteObject.items = {...items}
}

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
.scaleUp {
	transition: .5s ease-in-out;
}

.scaleUp:hover {
	transform: scale(1.02);
}
</style>