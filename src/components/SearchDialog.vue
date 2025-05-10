<template>
    <div>
        <v-dialog v-model="searchDialog" width="400px">
            <v-card>
                <v-card-text class="pa-5">
                    <v-text-field
                        clearable
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        placeholder="Search Product..."
                        v-model="search"
                    ></v-text-field>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
const search = defineModel('search');
const searchDialog = defineModel('searchDialog');
</script>

<style scoped>
.v-dialog {
    align-items: end;
}
</style>