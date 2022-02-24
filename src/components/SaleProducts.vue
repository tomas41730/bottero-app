<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="8" md="8">
          <v-card class="mx-auto" outlined>
            <v-data-table :headers="headers" :items="products" :search="search" sort-by="name" class="elevation-1">
              <template v-slot:top>
                <v-toolbar dark color="black" class="mb-1">
                  <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                </v-toolbar>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon color="success" small class="mr-2" @click="editItem(item)">
                  mdi-plus-circle
                </v-icon>
                <v-icon color="primary" small class="mr-2" @click="viewItem(item)">
                  mdi-image
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn  ref="btnReset" color="primary" @click="initialize">
                  Reset
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <div>
            <v-toolbar dark color="black" class="mb-1">
                  <v-toolbar-title>
                    DETALLE DE VENTA
                  </v-toolbar-title>
                </v-toolbar>
            <div>
              <v-card class="mx-auto" max-width="600" outlined>
                <v-list style="max-height: 500px" class="overflow-y-auto">
                <v-list-item class="overflow-y-auto" three-line v-for="(item, i) in saleOrder" :key="i">
                  <v-list-item-content>
                    <v-dialog v-model="dialogItemDiscount" max-width="750px">
                    <v-card>
                      <v-card-title>
                        DESCUENTO
                      </v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-card-title class="text-h5 mb-1"> {{ item.id }}</v-card-title>
                            <v-card-title v-text="'Ref: ' + item.reference" class="text-h5 mb-1"></v-card-title>
                            <v-card-title v-text="'Color: ' + item.material + ' ' + item.color" class="text-h5 mb-1"></v-card-title>
                            <v-card-title v-text="'Talla: ' + item.size" class="text-h5 mb-1"></v-card-title>
                            <v-card-title v-text="'Condicion: ' + item.condition" class="text-h5 mb-1"></v-card-title>
                          </v-col>
                          <v-col>
                            <div v-text="'Cantidad: ' + item.quantity" class="text-h5 mb-1"></div>
                            <div v-text="'Precio: ' + item.price" class="text-h5 mb-1"></div>
                            <div v-text="'Subtotal: ' + item.subtotal" class="text-h5 mb-1"></div>
                            <v-img :src="item.photo" max-width="250"></v-img>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-text-field x-large suffix="Bs." v-model="itemDiscount" label="Descuento" placeholder="Descuento"></v-text-field>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="primary" text @click="saveItemDiscount(item)">
                          guardar
                        </v-btn>
                        <v-btn color="primary" text @click="closeItemDiscount(item)">
                          cancelar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                    <v-list-item-subtitle v-text="'Cod: ' + item.id"></v-list-item-subtitle>
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
                              <v-text-field id="input-7-2" filled dense v-model="item.quantity" class="text-center" @input="onQuantityChanged(item)"></v-text-field>
                              <v-btn class="mx-2" fab x-small dark color="green" @click="editItem(item)">
                                <v-icon dark>mdi-plus</v-icon>
                              </v-btn>
                          </v-row>
                          <v-row>
                            <v-btn elevation="5" class="mx-3" small color="yellow" @click="discount(item)">
                              descuento
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
                <v-col class="text-center" cols="12">
                  <h3><strong>Subtotal: </strong>{{ total }} Bs.</h3>
                  <h3><strong>Descuentos: </strong>{{ totalDiscount }} Bs.</h3>
                  <h2>Total: </h2><h1><strong>{{ total - totalDiscount }} Bs.</strong></h1>
                  <v-btn v-if="this.total > 0" class="mx-2" x-large dark color="primary" @click="checkout">
                    Checkout
                  </v-btn>
                </v-col>
              </v-footer>
            </div>
          </div>  
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-data-table :headers="headersSaleOrder" :items="saleOrder" :search="search" sort-by="name" class="elevation-1">
            <template v-slot:top>
              <v-toolbar dark color="black">
                <v-btn icon dark @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>DETALLE DE VENTA</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>    
            <template v-slot:no-data>
              <v-btn  ref="btnReset" color="primary" @click="initialize">
                Reset
              </v-btn>
            </template>
          </v-data-table>
          <v-footer padless>
                <v-col class="text-center" cols="12">
                  <h3><strong>Subtotal: </strong>{{ total }} Bs.</h3>
                  <h3><strong>Descuentos: </strong>{{ totalDiscount }} Bs.</h3>
                  <h2>Total: </h2><h1><strong>{{ total - totalDiscount }} Bs.</strong></h1>
                  <v-btn v-if="this.total > 0" class="mx-2" x-large dark color="primary" @click="saveSale">
                    Confirmar Venta
                  </v-btn>
                </v-col>
              </v-footer>
        </v-card>
      </v-dialog>
    </v-container>
</template>
<script>
import { createAlert, showImage } from '../services/Alerts';
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
          reference: '',
          color: '',
          size: '',
          condition: '',
          quantity: 0,
          discount: '',
          subtotal: ''
          },
        headers: [
        { text: 'Acciones', value: 'actions', sortable: false },
        { text: 'C. Barras', align: 'start', sortable: true, value: 'idShoe'},
        { text: 'Referencia', value: 'reference' },
        { text: 'Talla', value: 'size' },
        { text: 'Color', value: 'color' },
        { text: 'Material', value: 'material' },
        { text: 'Condición', value: 'condition' },
        { text: 'Precio', value: 'price' },
        { text: 'Sucursal', value: 'store' },
        ],
        headersSaleOrder: [
        { text: 'C. Barras', align: 'start', sortable: true, value: 'idShoe'},
        { text: 'Referencia', value: 'reference' },
        { text: 'Talla', value: 'size' },
        { text: 'Color', value: 'color' },
        { text: 'Material', value: 'material' },
        { text: 'Condición', value: 'condition' },
        { text: 'Sucursal', value: 'store' },
        { text: 'Precio', value: 'price' },
        { text: 'Cantidad', value: 'quantity' },
        { text: 'Subtotal', value: 'subtotal' },
        { text: 'Descuentos', value: 'discount' },
        { text: 'ID', value: 'id' }
        ],
      saleOrder: [
      ],
      rules: [
        v => (/^\d+$/.test(v)) || 'Debe ser un numero.'
      ],
      valid: true,
      dialogItemDiscount: false,
      dialog: false,
      itemDiscount: null,
      totalDiscount: 0
    }),

    computed: 
    {
      getStore()
      {
        return this.$store.state.userStore;
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
        const itemIndex = this.saleOrder.findIndex( tmp => tmp.id ===  item.id);
        this.total = 0;
        if (itemIndex > -1)
        {
          item.quantity = parseInt(item.quantity) + 1;
          item.subtotal = item.quantity * item.price;
          Object.assign(this.saleOrder[itemIndex], item);
        }
        else
        {
          item.quantity = 1;
          item.subtotal = item.quantity * item.price;
          this.saleOrder.push(Object.assign({}, item));
        }
        this.saleOrder.forEach( doc => {
          this.total = this.total + doc.subtotal;
        });
        // console.log("qty: " + item.quantity);
        // console.log("price: " + item.price);
        // console.log("subtotal: " + item.subtotal);
        // console.log("total: " + this.total);
      },
      viewItem(item)
      {
        let msg = 'Información del producto\n';
        let description = 'Cod. Barras: ' + item.idShoe + '\n' 
                        + 'Referencia: ' + item.reference + '\n'
                        + 'Marca: ' + item.brand + '\n'
                        + 'Color: ' + item.color + '\n'
                        + 'Material: ' + item.material + '\n'
                        + 'Talla: ' + item.size + '\n'
                        + 'Condición: ' + item.condition + '\n'
                        + 'Precio: ' + item.price + ' Bs.\n'
                        + 'Sucursal: ' + item.store + '\n'
                        + 'Observación: ' + item.observation + '\n';
        showImage(item, msg, description);
      },
      deleteItem(item)
      {
        const itemIndex = this.saleOrder.findIndex( tmp => tmp.condition ===  item.condition && tmp.idShoe ===  item.idShoe && tmp.store === item.store );
        this.total = 0;
        if (itemIndex > -1)
        {
          item.quantity = item.quantity - 1;
          item.subtotal = item.quantity * item.price;
          if (item.quantity < 1)
          {
            this.saleOrder.splice(itemIndex, 1);
          }
          else
          {
            Object.assign(this.saleOrder[itemIndex], item);
          }
          this.saleOrder.forEach( doc => {
          this.total = this.total + doc.subtotal;
        });
        }
      },
      onQuantityChanged(item)
      {
        const itemIndex = this.saleOrder.findIndex( tmp => tmp.condition ===  item.condition && tmp.idShoe ===  item.idShoe && tmp.store === item.store );
        if (item.quantity == "0")
        {
          this.saleOrder.splice(itemIndex, 1);
        }
        else
        {
          this.total = 0;
          item.subtotal = item.quantity * item.price;
        }
          this.saleOrder.forEach( doc => {
          this.total = this.total + doc.subtotal;
        });
      },
      onItemDiscountChanged(item)
      {
        // this.itemDiscount = item.pDisccount * item.quantity;
        // if (this.itemDiscount < item.discount)
        // {
        //   createAlert('El descuento no puede pasar de ' + this.itemDiscount + ' Bs.', 'error');
        // }
        // else
        // {
        //   item.discount = this.itemDiscount;
          console.log(item.discount)
        // }
      },
      checkout()
      {
        console.log(this.saleOrder)
        this.dialog = true;
      },
      discount(item)
      {
        console.log('------------discount-------------')
        console.log(item)
        this.dialogItemDiscount = true;
        this.itemDiscount = item.discount;
        this.totalDiscount = 0;
        this.saleOrder.forEach( doc => {
          this.totalDiscount = this.totalDiscount + parseInt(doc.discount);
        });
        console.log('------------discount-------------')
      },
      saveItemDiscount(item)
      {
        console.log('------------save-------------')
        const itemIndex = this.saleOrder.findIndex( tmp => tmp.condition ===  item.condition && tmp.idShoe ===  item.idShoe && tmp.store === item.store );
        let limitDiscount = item.pDisccount * item.quantity;
        if (limitDiscount < this.itemDiscount)
        {
          createAlert('El descuento no puede pasar de ' + limitDiscount + ' Bs.', 'error');
        }
        else
        {
          
          item.discount = this.itemDiscount;
          Object.assign(this.saleOrder[itemIndex], item);
          this.dialogItemDiscount = false;
          this.itemDiscount = 0;
          this.totalDiscount = 0;
          console.log('Discount: ' + item.discount);
          this.saleOrder.forEach( doc => {
          this.totalDiscount = this.totalDiscount + parseInt(doc.discount);
        });
        }
        console.log('------------save-------------')
      },
      closeItemDiscount(item)
      {
        console.log('------------close-------------')
        // this.dialogItemDiscount = false;
        console.log(item)
        console.log('------------close-------------')
      },
      saveSale()
      {
        this.dialog = false;
        this.saleOrder = [];
        this.totalDiscount = 0;
        this.total = 0;
      },
    },
  }
</script>
<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
#input-7-2{
      width: 30px;
      
}
</style>
