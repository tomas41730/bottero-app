<template>
    <v-container fluid >
      <template>
        <v-dialog persistent v-model="dialogInfo" max-width="500px">
          <v-card>
            <v-toolbar color="black" dark>
              <v-btn icon dark @click="dialogInfo = false; discountClick = true">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              Informacion del producto: {{ editedItem.id }}
              <v-spacer></v-spacer>
              <v-list-item-avatar  max-width="70px">
                <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e"></v-img>
              </v-list-item-avatar>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-row>
                      <v-col>
                        <v-text-field :readonly="true" v-model="editedItem.idShoe" label="ID"></v-text-field>
                        <v-text-field :readonly="true" v-model="editedItem.size" label="Talla"></v-text-field>
                        <v-text-field :readonly="true" v-model="editedItem.stock" label="Stock"></v-text-field>
                        <v-text-field v-if="!discountClick" :readonly="true" v-model="editedItem.quantity" label="Cantidad a vender"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :readonly="true" v-model="editedItem.reference" label="Referencia"></v-text-field>
                        <v-text-field :readonly="true" v-model="editedItem.color" label="Color"></v-text-field>
                        <v-text-field :readonly="true" v-model="editedItem.price" label="Precio" suffix="Bs."></v-text-field>
                        <v-text-field v-if="!discountClick" :readonly="true" v-model="editedItem.subtotal" label="Subtotal"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :readonly="true" v-model="editedItem.store" label="Sucursal"></v-text-field>
                        <v-text-field :readonly="true" v-model="editedItem.material" label="Material"></v-text-field>
                        <v-text-field :readonly="true" v-model="editedItem.condition" label="Condición"></v-text-field>
                        <v-text-field v-if="!discountClick" :readonly="discountClick" v-model="itemDiscount" label="Precio con Descuento"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                        <v-img :src="editedItem.photo" max-width="350"></v-img>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text :disabled="discountClick" @click="saveItemDiscount">guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>  
      </template>       
        <v-row>
            <v-col cols="12" sm="8" md="8">
            <v-card class="mx-auto" outlined>
                <v-data-table :headers="headers" :items="products" :search="search" sort-by="name" class="elevation-1">
                    <template v-slot:top>
                        <v-toolbar dark color="black" class="mb-1">
                            <v-col>
                                <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-btn color="primary" @click="checkout">ventas</v-btn>
                            </v-col>
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
                                <v-text-field id="input-7-2" filled dense v-model="item.quantity" class="text-center" @input="onQuantityChanged(item)" :rules="rules"></v-text-field>
                                <v-btn class="mx-2" fab x-small dark color="green" @click="editItem(item)">
                                    <v-icon dark>mdi-plus</v-icon>
                                </v-btn>
                            </v-row>
                            <v-row>
                              <v-btn @click="discountBtn(item)" class="mx-2" color="black" dark>descuento</v-btn>
                            </v-row>
                            </v-col>
                        </v-card-actions>
                        </v-row>
                        <v-list-item-title v-text="item.price + ' Bs.'" class="text-h5 mb-1"> <p>Bs.</p></v-list-item-title>
                    </v-list-item-content>
                    <v-avatar class="profile" tile size="120" color="grey"><v-img @click="viewItem(item)" :src="item.photo"></v-img></v-avatar>

                    

                    </v-list-item>
                    </v-list>
                </v-card>              
                <v-footer padless>
                <v-col class="text-center" cols="12">
                  <h3><strong>Subtotal: </strong>{{ total }} Bs.</h3>
                  <h3><strong>Descuentos: </strong>{{ totalDiscount }} Bs.</h3>
                  <h2>Total: </h2><h1><strong>{{ total - totalDiscount }} Bs.</strong></h1>
                  <v-btn v-if="this.total > 0" class="mx-2" x-large dark color="primary" @click="dialog = true">
                    checkout
                  </v-btn>
                </v-col>
              </v-footer>
                </div>
            </div>  
        </v-col>
    </v-row>
        <v-dialog fullscreen persistent v-model="dialog" max-width="100%" transition="dialog-bottom-transition">
                    <v-card>
                        <v-row>
                            <v-col cols="12" sm="12" md="7">
                                <v-data-table :headers="headersSaleOrder" :items="saleOrder" :search="search" sort-by="name" class="elevation-1">
                                    <template v-slot:top>
                                        <v-toolbar dark color="black">
                                            <v-btn icon dark @click="dialog = false">
                                            <v-icon>mdi-arrow-left</v-icon>
                                            </v-btn>
                                            <v-toolbar-title>DETALLE DE VENTA</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                        </v-toolbar>
                                        <v-divider></v-divider>
                                    </template>    
                                    <template v-slot:no-data>
                                        <v-btn  ref="btnReset" color="primary" @click="initialize">
                                            Reset
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.photo`]="{ item }">
                                        <div class="p-2">
                                            <v-list-item-avatar tile size="130">
                                                <v-img @click="viewItem(item)" :src="item.photo"></v-img>
                                            </v-list-item-avatar>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                            <v-col cols="12" sm="12" md="5">
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title>
                                            DETALLE DE VENTA
                                        </v-toolbar-title>
                                    </v-toolbar>
                                    <v-row>
                                        <v-col>
                                            <v-list style="max-height: 650px" class="overflow-y-auto">
                                                <v-list-item class="overflow-y-auto" three-line v-for="(item, i) in saleOrder" :key="i">
                                                    
                                                <v-col cols="6" sm="6" md="6">
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle v-text="'Cod: ' + item.id"></v-list-item-subtitle>
                                                        <v-list-item-subtitle v-text="'Ref: ' +item.reference"></v-list-item-subtitle>
                                                        <v-list-item-title v-text="'Color: ' + item.material + ' ' + item.color" class="text-h5 mb-1"></v-list-item-title>
                                                        <v-list-item-title v-text="'Talla: ' + item.size" class="text-h5 mb-1"></v-list-item-title>
                                                        <v-list-item-title v-text="'Cantidad: ' + item.quantity" class="text-h5 mb-1"></v-list-item-title>
                                                        <v-list-item-title v-text="'Sucursal: ' + item.store" class="text-h5 mb-1"></v-list-item-title>
                                                    </v-list-item-content>
                                                </v-col>
                                                <v-col cols="3" sm="4" md="4" align="center" justify="center">
                                                    <v-avatar class="profile" tile size="200" color="grey"><v-img @click="viewItem(item)" :src="item.photo"></v-img></v-avatar>
                                                </v-col>
                                                </v-list-item>
                                            </v-list>
                                        </v-col>
                                    </v-row>
                                    <v-footer padless color="black" dark>
                                        <v-col class="text-center" cols="12">
                                          <h3><strong>Subtotal: </strong>{{ total }} Bs.</h3>
                                          <h3><strong>Descuentos: </strong>{{ totalDiscount }} Bs.</h3>
                                          <h2>Total: </h2><h1><strong>{{ total - totalDiscount }} Bs.</strong></h1>
                                          <v-row>
                                            <v-col align="right" justify="center">
                                                <h1>Efectivo: </h1>
                                            </v-col>
                                            <v-col align="center" justify="center">
                                              <v-text-field @change="onEfectiveChanged" id="sublabel" x-large suffix="Bs." v-model="efective" required></v-text-field>
                                            </v-col>
                                          </v-row>
                                          <h2 v-if="efective >= total">Cambio: {{ efective - total }} Bs.</h2>
                                          <v-btn v-if="this.total > 0 && efective >= total" class="mx-2" x-large dark color="primary" @click="saveSale">
                                            Confirmar Venta
                                          </v-btn>
                                          <v-btn v-if="this.total > 0 && efective < total" class="mx-2" x-large dark color="primary" @click="saveReserve">
                                            Confirmar Reserva
                                          </v-btn>
                                        </v-col>
                                    </v-footer>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import { createAlert } from '../services/Alerts';
// import { showImage } from '../services/Alerts';
import { getProducts } from '../services/firestore/FirebaseProducts';

export default 
{
    data: () => 
    ({
        // products: getProductsByStore('Heroinas'),
        
        products: getProducts(),
        efective: 0,
        change: 0,
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
        },
        headers: [
            { text: 'Acciones', value: 'actions', sortable: false },
            { text: 'C. Barras', align: 'start', sortable: true, value: 'idShoe'},
            { text: 'Referencia', value: 'reference' },
            { text: 'Stock', value: 'stock' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Condición', value: 'condition' },
            { text: 'Precio', value: 'price' },
            { text: 'Sucursal', value: 'store' },
        ],
        headersSaleOrder: [
            // { text: 'Foto', value: 'photo' },
            { text: 'C. Barras', align: 'start', sortable: true, value: 'idShoe'},
            { text: 'Referencia', value: 'reference' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Condición', value: 'condition' },
            { text: 'Sucursal', value: 'store' },
            { text: 'Precio', value: 'price' },
            { text: 'Cantidad', value: 'quantity' },
            { text: 'Descuento', value: 'discount' },
            { text: 'ID', value: 'id' }
        ],
        saleOrder: [
        ],
        rules: [
            v => (/^\d+$/.test(v)) || 'Debe ser un numero.'
        ],
        valid: true,
        dialogInfo: false,
        dialog: false,
        itemDiscount: 0,
        totalDiscount: 0,
        discountClick: true
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
            this.itemDiscount = item.price;
            if (itemIndex > -1)
            {
              item.quantity = parseInt(item.quantity) + 1;
              item.subtotal = item.quantity * item.price;
              Object.assign(this.saleOrder[itemIndex], item);
            }
            else
            {
              item.discount = 0;
              item.quantity = 1;
              item.subtotal = item.quantity * item.price;
              this.saleOrder.push(Object.assign({}, item));
            }
            this.saleOrder.forEach( doc => {
              this.total = this.total + doc.subtotal;
            });
        },
        viewItem(item)
        {
            this.dialogInfo = true;
            this.itemDiscount = item.price;
            console.log(Object.assign(this.editedItem, item));
            console.log(item);
        },
        deleteItem(item)
        {
            const itemIndex = this.saleOrder.findIndex( tmp => tmp.id ===  item.id);
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
            const itemIndex = this.saleOrder.findIndex( tmp => tmp.id ===  item.id );
            if (item.quantity == "0")
            {
                this.saleOrder.splice(itemIndex, 1);
            }
            else
            {
                this.total = 0;
                item.subtotal = item.quantity * item.price;
            }
            this.saleOrder.forEach( doc => 
            {
              this.total = this.total + doc.subtotal;
            });
        },
        checkout()
        {
            console.log(this.saleOrder)
            this.dialog = true;
        },
        saveSale()
        {
            this.dialog = false;
            this.saleOrder = [];
            this.totalDiscount = 0;
            this.total = 0;
            this.products = [];
            this.products = getProducts();
            createAlert('Venta realizada con Éxito!', 'success');
        },
        saveReserve()
        {
            this.dialog = false;
            this.saleOrder = [];
            this.totalDiscount = 0;
            this.total = 0;
            this.products = [];
            this.products = getProducts();
            createAlert('Reserva realizada con Éxito!', 'success');
        },
        discountBtn(item)
        {
          Object.assign(this.editedItem, item);
          this.discountClick = false;
          this.dialogInfo = true;
          this.viewItem(this.editedItem);
          this.itemDiscount = item.subtotal - item.discount;
        },
        saveItemDiscount()
        {
          const itemIndex = this.saleOrder.findIndex( tmp => tmp.id ===  this.editedItem.id );
          this.totalDiscount = 0;
          let limitDiscount = this.editedItem.pDisccount * this.editedItem.quantity;
          if (limitDiscount < (this.editedItem.price - this.itemDiscount))
          {
            createAlert('El descuento no puede pasar de ' + limitDiscount + ' Bs.', 'error');
          }
          else if((this.editedItem.price - this.itemDiscount) < 0)
          {
            createAlert('El precio de venta máximo para este producto es de ' + this.editedItem.price + ' Bs.', 'error');
          }
          else
          {
            this.editedItem.discount = this.editedItem.price - this.itemDiscount;
            Object.assign(this.saleOrder[itemIndex], this.editedItem);
            this.dialogInfo = false;
            this.saleOrder.forEach( doc => {
              this.totalDiscount = this.totalDiscount + parseInt(doc.discount);
            });
          }
        },
        onEfectiveChanged()
        {
          if(this.efective < this.total)
          {
            this.change = 0;
          }
          else
          {
            this.change = this.efective - this.total;
          }
        }
    },
}
</script>
<style>
body {
    font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
#input-7-2{
    width: 30px;    
}
#label {
   font: bold 15px Arial Black;
}
#sublabel {
   font-size: 40px;
}
</style>
