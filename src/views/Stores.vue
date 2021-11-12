<template>
  
  <v-col>
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <crud-stores/>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <crud-colors/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <crud-sizes/>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <crud-categories/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <crud-brands/>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <crud-materials/>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import CrudStores from '../components/StoresCRUD.vue'
import CrudColors from '../components/ColorsCRUD.vue'
import CrudSizes from '../components/SizesCRUD.vue'
import CrudCategories from '../components/CategoriesCRUD.vue'
import CrudBrands from '../components/BrandsCRUD.vue'
import CrudMaterials from '../components/MaterialsCRUD.vue'
  export default {
    name: 'Stores',

    components: {
        CrudStores,
        CrudColors,
        CrudSizes,
        CrudCategories,
        CrudBrands,
        CrudMaterials
    },
  }
</script>
