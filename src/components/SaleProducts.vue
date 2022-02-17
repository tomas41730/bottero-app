<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="8" md="8">
          <v-data-iterator :items="products" :search="search" :sort-by="sortBy.toLowerCase()" :hide-default-footer="true" :sort-desc="false">
            <template v-slot:header>
              <v-toolbar dark color="black" class="mb-1">
                <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                <template v-if="$vuetify.breakpoint.mdAndUp">
                  <v-spacer></v-spacer>
                  <v-select v-model="sortBy" flat solo-inverted hide-details :items="Keys1" prepend-inner-icon="mdi-magnify" label="Sort by"></v-select>
                  <v-spacer></v-spacer>
                </template>
              </v-toolbar>
            </template>
            <template v-slot:default="props">
                <v-row>
                    <v-col v-for="item in props.items" :key="item.name" cols="6" sm="6" md="4" lg="3">
                        <v-card>
                            <v-card-subtitle>
                              <div>Código: {{ item.idShoe }}</div>
                              <div>Referencia: {{ item.reference }}</div>
                            </v-card-subtitle>
                            <v-spacer></v-spacer><v-spacer></v-spacer>
                            <v-img :src="item.photo" aspect-ratio="1.5"></v-img>
                            <v-divider></v-divider>
                            <v-card-subtitle>
                                <div>Talla: {{ item.size }}</div>
                                <div>Condición: {{ item.condition }}</div>
                                <div>{{ item.color }} {{ item.material }}</div>
                                <div>{{ item.store }}</div>
                                <div>{{ item.price }} Bs.
                                  <v-row class="justify-end">
                                    <v-btn class="mx-2" small dark color="black" @click="editItem(item)">Añadir
                                    </v-btn>
                                  </v-row>
                                </div>
                            </v-card-subtitle>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
          </v-data-iterator>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <div>
            <v-toolbar dark color="black" class="mb-1">
                  <v-toolbar-title>
                    DETALLE DE VENTA
                  </v-toolbar-title>
                </v-toolbar>
          <!--  
            <v-data-table :headers="headers" :items="saleOrder" :items-per-page="10" :search="search" sort-by="name" :hide-default-footer="true" class="elevation-1">
              <template v-slot:top>
                <v-divider horizontal></v-divider>
                <v-toolbar dark color="black" class="mb-1">
                  <v-toolbar-title>
                    DETALLE DE VENTA
                  </v-toolbar-title>
                </v-toolbar>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                  Reset
                </v-btn>
              </template>
            </v-data-table>
            -->
            
            <div>
              <v-card class="mx-auto" max-width="600" outlined>
                <v-list style="max-height: 700px" class="overflow-y-auto">
                <v-list-item class="overflow-y-auto" three-line v-for="(item, i) in saleOrder" :key="i">
                  <v-list-item-content>
                    <v-list-item-subtitle v-text="'Cod: ' + item.idShoe"></v-list-item-subtitle>
                    <v-list-item-subtitle v-text="'Ref: ' +item.reference"></v-list-item-subtitle>
                    <v-list-item-title v-text="'Color: ' + item.material + ' ' + item.color" class="text-h5 mb-1"></v-list-item-title>
                    <v-list-item-title v-text="'Talla: ' + item.size" class="text-h5 mb-1"></v-list-item-title>
                    
                    <v-row cols="1" sm="1" md="1" lg="1">
                      <v-card-actions>
                        <v-col cols="12" sm="12" md="12" lg="12">
                          <v-row>
                              <v-btn class="mx-2" fab x-small dark color="red" @click="deleteItem(item)">
                                <v-icon dark>mdi-minus</v-icon>
                              </v-btn>
                              <v-text-field filled dense v-model="item.quantity" class="text-center"></v-text-field>
                              <v-btn class="mx-2" fab x-small dark color="green" @click="editItem(item)">
                                <v-icon dark>mdi-plus</v-icon>
                              </v-btn>
                          </v-row>
                        </v-col>
                        
                      </v-card-actions>
                    </v-row>
                    <v-list-item-title v-text="item.price + ' Bs.'" class="text-h5 mb-1"> <p>Bs.</p></v-list-item-title>
                  </v-list-item-content>
                  <v-avatar class="profile" tile size="120" color="grey"><v-img :src="item.photo"></v-img></v-avatar>
                </v-list-item>
                </v-list>
              </v-card>
              <v-footer padless>
                <v-col class="text-center" cols="12"><strong>Total: </strong>{{ total }} Bs.</v-col>
              </v-footer>
            </div>
          </div>  
        </v-col>
      </v-row>
        
    </v-container>
</template>
<script>
import { getProducts } from '../services/firestore/FirebaseProducts';
  export default 
  {
    data: () => 
    ({
        // products: getProductsByStore('Heroinas'),
        products: getProducts(),
        sortBy: 'idShoe',
        search: '',
        total: 0,
        editedItem: {
          id: '',
          idShoe: '',
          date: '',
          quantity: 0,
          disccount: '',
          total: ''
          },
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
        headers: [
        { text: 'C. Barras', align: 'start', sortable: true, value: 'idShoe'},
        { text: 'Referencia', value: 'reference' },
        { text: 'Cant.', value: 'quantity' },
        { text: 'Desc.', value: 'disccount' },
        { text: 'Acciones', value: 'actions', sortable: false },
        ],
      saleOrder: [
        // { 
        //   idShoe: '111',
        //   reference: '000',
        //   quantity: '5',
        //   disccount: '0'
        // }
      ],
    }),

    computed: 
    {
      getStore()
      {
        return this.$store.state.userStore;
      },
      Keys1 ()
      {
        return Object.values(this.keys)
      },
    },

    watch: 
    {
      
    },

    created () 
    {
      this.initialize();
      //  window.addEventListener('beforeunload', function() {
      //    if(this.$store.state.salesGuard === true){
      //      this.$router.push('/sales')
      //    }
      //    else{
      //      this.$router.push('/sidebar')
      //    }
      // })
    },

    methods: 
    {
      initialize () 
      {
        console.log(this.products);
      },
      editItem(item)
      {
        const itemIndex = this.saleOrder.findIndex( tmp => tmp.condition ===  item.condition && tmp.idShoe ===  item.idShoe && tmp.store === item.store );
        if (itemIndex > -1)
        {
          item.quantity = item.quantity + 1;
          Object.assign(this.saleOrder[itemIndex], item);
          
        }
        else
        {
          item.quantity = 1;
          item.disccount = 0;
          this.saleOrder.push(Object.assign({}, item));
        }
        this.total = this.total + item.price;
      },
      deleteItem(item)
      {
        const itemIndex = this.saleOrder.findIndex( tmp => tmp.condition ===  item.condition && tmp.idShoe ===  item.idShoe && tmp.store === item.store );
        if (itemIndex > -1)
        {
          item.quantity = item.quantity - 1;
          this.total = this.total - item.price;
          if (item.quantity < 1)
          {
            this.saleOrder.splice(itemIndex, 1);
          }
          else
          {
            Object.assign(this.saleOrder[itemIndex], item);
          }
        }
      },

      // getTotal()
      // {
      //   let total = 0;
      //   this.saleOrder.forEach(item => {
      //     let aux = item.quantity * item.price;
      //     total = total + aux;
      //   });
      //   return total;
      // }
    },
  }
</script>
<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
.v-text-field{
      width: 53px;
      
}
</style>
