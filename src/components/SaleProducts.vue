<template>
    <v-container fluid>
        <v-data-iterator :items="products" :search="search" :sort-by="sortBy.toLowerCase()" :sort-desc="false">
            <template v-slot:header>
                <v-toolbar dark color="black" class="mb-1">
                    <v-text-field
                        v-model="search"
                        clearable
                        flat
                        solo-inverted
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        label="Search"
                    ></v-text-field>
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                        <v-spacer></v-spacer>
                        <v-select
                            v-model="sortBy"
                            flat
                            solo-inverted
                            hide-details
                            :items="Keys1"
                            prepend-inner-icon="mdi-magnify"
                            label="Sort by"
                        ></v-select>
                        <v-spacer></v-spacer>
                    </template>
                    
                </v-toolbar>
            </template>
            <template v-slot:default="props">
                <v-row>
                    <v-col v-for="item in props.items" :key="item.name" cols="6" sm="6" md="4" lg="3">
                        <v-card>
                           <!--<v-card-title>Código: {{ item.idShoe }} </v-card-title>
                            <v-card-subtitle>Referencia: {{ item.reference }} </v-card-subtitle>-->
                            <v-card-subtitle>
                              <div>Código: {{ item.idShoe }}</div>
                              <div>Referencia: {{ item.reference }}</div>
                            </v-card-subtitle>
                            <v-img :src="item.photo" aspect-ratio="1.4"></v-img>
                            <v-divider></v-divider>
                            <v-card-subtitle>
                                <div>Talla: {{ item.size }}</div>
                                <div>Condición: {{ item.condition }}</div>
                                <div>{{ item.color }} {{ item.material }}</div>
                                <div>{{ item.store }}</div>
                                <div>{{ item.price }} Bs.
                                  <div><v-btn @click="editItem(item)" color="yellow accent-4">Añadir</v-btn></div>
                                </div>
                            </v-card-subtitle>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <!--<v-card-title> {{ item.price }} Bs.</v-card-title>-->
                                
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
    </v-container>
</template>
<script>
import { getProductsByStore } from '../services/firestore/FirebaseProducts';
  export default 
  {
    data: () => 
    ({
        products: getProductsByStore('Heroinas'),
        sortBy: 'idShoe',
        search: '',
        keys: 
        {
            idShoe: 'Código de barras',
            category: 'Categoría',
            condition: 'Condición',  
            reference: 'Referencia',
            brand: 'Marca',
            size: 'Talla',
            color: 'Color',
            material: 'Material',
            price: 'Precio',
            description: 'Descripción'
        },
    }),

    computed: 
    {
     getStore()
      {
        return this.$store.state.userStore;
      },
      Keys1 (){
        return Object.values(this.keys)
      },
    },

    watch: 
    {
      
    },

    created () 
    {
      this.initialize();
    },

    methods: 
    {
      initialize () 
      {
        console.log(this.products);
      },
      editItem(item){
        console.log(Object.assign({}, item));
      },
    },
  }
</script>
<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
</style>