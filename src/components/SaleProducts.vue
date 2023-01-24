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
              <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
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
                          <v-toolbar-title v-text="'Sucursal ' + getStore" class="text-h3"></v-toolbar-title>
                        </v-col>
                      </v-toolbar>
                      <v-toolbar dark color="black" class="mb-1">
                        <v-col>
                          <v-text-field v-model="idShoe" clearable flat solo-inverted hide-details @change="filterProducts" label="Codigo de Barras"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Buscar"></v-text-field>
                        </v-col>
                      </v-toolbar>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                      <v-icon color="success" small class="mr-2" @click="addItem(item)">
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
              <v-toolbar dark color="black" class="mb-2">
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
                      <v-list-item-title v-text="item.material + ' ' + item.color" class="text-h5 mb-1"></v-list-item-title>
                      <v-list-item-title v-text="'Talla: ' + item.size" class="text-h5 mb-1"></v-list-item-title>
                      <v-row cols="1" sm="1" md="1" lg="1">
                      <v-card-actions>
                          <v-col cols="12" sm="12" md="12" lg="12">
                          <v-row>
                              <v-btn class="mx-2" fab x-small dark color="red" @click="deleteItem(item)">
                                  <v-icon dark>mdi-minus</v-icon>
                              </v-btn>
                              <v-text-field id="input-7-2" filled dense v-model="item.quantity" class="text-center" @input="onQuantityChanged(item)" :rules="rules"></v-text-field>
                              <v-btn class="mx-2" fab x-small dark color="green" @click="addItem(item)">
                                  <v-icon dark>mdi-plus</v-icon>
                              </v-btn>
                          </v-row>
                          <v-row>
                            <v-btn @click="discountBtn(item)" class="mx-2" color="black" dark>descuento</v-btn>
                          </v-row>
                          </v-col>
                      </v-card-actions>
                      </v-row>
                      <v-list-item-title v-text="item.price + ' Bs.'" class="text-h5 mb-1"></v-list-item-title>
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
                          <v-col cols="12" sm="12" md="8">
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
                          <v-col cols="12" sm="12" md="4">
                              <v-card>
                                <v-toolbar dark color="black" class="mb-1">
                                    <v-toolbar-title>
                                        INFORMACIÓN DEL CLIENTE
                                    </v-toolbar-title>
                                </v-toolbar>
                                  <v-col md="12">
                                      <v-row>
                                        <v-col md="6">
                                          <v-text-field id="sublabel" @change="onNitChanged" x-large v-model="customer.ci" placeholder="NIT"></v-text-field>
                                        </v-col>
                                        <v-col md="6">
                                          <v-text-field id="sublabel" x-large v-model="customer.lastname" placeholder="Apellido"></v-text-field>
                                        </v-col>
                                      </v-row>
                                  </v-col>
                                <template>
                                  <v-dialog persistent v-model="customerDialog" max-width="500px">
                                    <v-card>
                                      <v-toolbar color="black" dark>
                                        <v-btn icon dark @click="customerDialog = false">
                                          <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                        Informacion del Cliente: {{ customer.name + " " + customer.lastname }}
                                        <v-spacer></v-spacer>
                                        <v-list-item-avatar  max-width="70px">
                                          <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
                                        </v-list-item-avatar>
                                      </v-toolbar>
                                      <v-card-text>
                                        <v-container>
                                          <v-row>
                                            <v-col cols="12" sm="12" md="12">
                                               <v-form ref="form" v-model="valid" lazy-validation>
                                                <v-row>
                                                  <v-col>
                                                    <v-text-field v-model="customer.ci" label="CI" :rules="[v => !!v || 'Este campo es requerido.']" required></v-text-field>
                                                    <v-text-field v-model="customer.name" label="Nombre"></v-text-field>
                                                    <v-text-field v-model="customer.lastname" label="Apellido" :rules="[v => !!v || 'Este campo es requerido.']" required></v-text-field>
                                                  </v-col>
                                                  <v-col>
                                                    <v-text-field v-model="customer.phone" label="Celular" :rules="[v => !!v || 'Este campo es requerido.']" required></v-text-field>
                                                    <v-text-field v-model="customer.email" label="Email"></v-text-field>
                                                    <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                                      <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-model="customer.birthday" label="Picker without buttons" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                      </template>
                                                      <v-date-picker v-model="customer.birthday" @input="menu2 = false"></v-date-picker>
                                                    </v-menu>
                                                  </v-col>
                                                </v-row>
                                               </v-form>
                                            </v-col>
                                          </v-row>
                                        </v-container>
                                      </v-card-text>
                                      <v-card-actions>
                                          <v-spacer></v-spacer>
                                          <v-btn color="blue darken-1" text :disabled="!valid" @click="saveCustomer">guardar</v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>  
                                </template> 
                              </v-card>
                              <v-card>
                                  <v-toolbar dark color="black" class="mb-1">
                                      <v-toolbar-title>
                                          RESUMEN DE VENTA
                                      </v-toolbar-title>
                                  </v-toolbar>
                                  <v-row>
                                      <v-col>
                                          <v-list style="max-height: 300px" class="overflow-y-auto">
                                              <v-list-item class="overflow-y-auto" three-line v-for="(item, i) in saleOrder" :key="i">
                                                  
                                              <v-col cols="6" sm="6" md="6">
                                                  <v-list-item-content>
                                                      <v-list-item-subtitle v-text="'Cod: ' + item.id"></v-list-item-subtitle>
                                                      <v-list-item-subtitle v-text="'Ref: ' +item.reference"></v-list-item-subtitle>
                                                      <v-list-item-title v-text="item.color + ' ' + item.material + ' ' + item.size" class="text-h6 mb-1"></v-list-item-title>
                                                      <v-list-item-title v-text="'Talla: ' + item.size" class="text-h6 mb-1"></v-list-item-title>
                                                      <v-list-item-title v-text="'Cantidad: ' + item.quantity" class="text-h6 mb-1"></v-list-item-title>
                                                      <v-list-item-title v-text="'Suc: ' + item.store" class="text-h6 mb-1"></v-list-item-title>
                                                  </v-list-item-content>
                                              </v-col>
                                              <v-col cols="3" sm="4" md="4" align="center" justify="center">
                                                  <v-avatar class="profile" tile size="150" color="grey"><v-img @click="viewItem(item)" :src="item.photo"></v-img></v-avatar>
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
                                            <h2 v-if="efective > (total - totalDiscount)">Cambio: {{ efective - (total - totalDiscount) }} Bs.</h2>
                                            <v-btn v-if="this.total > 0 && efective >= (total - totalDiscount)" class="mx-2" dark color="primary" @click="saveSale">
                                              Confirmar Venta
                                            </v-btn>
                                            <v-btn v-if="this.total > 10 && efective < (total - totalDiscount)" class="mx-2" dark color="primary" @click="saveReserve">
                                              Confirmar Reserva
                                            </v-btn>
                                            <v-dialog persistent v-model="saleDialog" max-width="280px">
                                              <v-card>
                                                <v-toolbar color="black" dark>
                                                  <v-btn icon dark @click="saleDialog = false">
                                                    <v-icon>mdi-close</v-icon>
                                                  </v-btn>
                                                    FACTURACIÓN - {{ this.store }}
                                                  <v-spacer></v-spacer>
                                                  <v-list-item-avatar  max-width="70px">
                                                    <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
                                                  </v-list-item-avatar>
                                                </v-toolbar>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row>
                                                      <v-col>
                                                        <v-col>
                                                          <v-radio-group v-model="radioGroup" row mandatory>
                                                            <v-col>
                                                              <v-row cols="2" sm="2" md="2">
                                                                <v-select v-model="payment" :items="['Efectivo', 'Tarjeta', 'QR']" label="Forma de Pago"></v-select>
                                                              </v-row>
                                                              <v-row cols="2" sm="2" md="2">
                                                                <v-radio label="Sin Factura" value="op2" @click="onRadioButtonChanged"></v-radio>
                                                              </v-row>
                                                              <v-row cols="2" sm="2" md="2">
                                                                <v-radio label="Facturar" value="op1" @click="onRadioButtonChanged"></v-radio>
                                                              </v-row>
                                                            </v-col>
                                                          </v-radio-group>
                                                        </v-col>
                                                        <v-col>
                                                          <v-btn @click="finalizeSale" dark color="primary">Finalizar venta</v-btn>
                                                        </v-col>
                                                      </v-col>
                                                    </v-row>
                                                  </v-container>
                                                </v-card-text>
                                              </v-card>
                                            </v-dialog>
                                            <v-dialog persistent v-model="reserveDialog" max-width="280px">
                                              <v-card>
                                                <v-toolbar color="black" dark>
                                                  <v-btn icon dark @click="reserveDialog = false">
                                                    <v-icon>mdi-close</v-icon>
                                                  </v-btn>
                                                    Reservas - {{ this.store }}
                                                  <v-spacer></v-spacer>
                                                  <v-list-item-avatar  max-width="70px">
                                                    <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
                                                  </v-list-item-avatar>
                                                </v-toolbar>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row>
                                                      <v-col>
                                                        <v-col>
                                                          <v-radio-group v-model="radioGroup" row mandatory>
                                                            <v-col>
                                                              <v-row cols="2" sm="2" md="2">
                                                                <v-select v-model="payment" :items="['Efectivo', 'Tarjeta', 'QR']" label="Forma de Pago"></v-select>
                                                              </v-row>
                                                              <v-row>
                                                                <v-menu v-model="menu" :disabled="getPermission" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                                                  <template v-slot:activator="{ on, attrs }">
                                                                  <v-text-field v-model="dateStr" label="Picker without buttons" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                                  </template>
                                                                  <v-date-picker v-model="dateReserve" @input="closeDate"></v-date-picker>
                                                              </v-menu>
                                                              </v-row>
                                                              <v-row>
                                                                <v-text-field v-model="customer.phone" label="Celular" :rules="[v => !!v || 'Este campo es requerido.']" required></v-text-field>
                                                              </v-row>
                                                              <v-row>
                                                                <v-text-field v-model="customer.name" label="Nombre"  :rules="[v => !!v || 'Este campo es requerido.']" required></v-text-field>
                                                              </v-row>
                                                            </v-col>
                                                          </v-radio-group>
                                                        </v-col>
                                                        <v-col>
                                                          <v-btn @click="finalizeReserve" dark color="primary">Finalizar Reserva</v-btn>
                                                        </v-col>
                                                      </v-col>
                                                    </v-row>
                                                  </v-container>
                                                </v-card-text>
                                              </v-card>
                                            </v-dialog>    
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
import { getPorductsByCustomFilter } from '../services/firestore/FirebaseProducts2';
import { addCustomer, getCustomerByCi } from '../services/firestore/FirebaseCustomers';
import { addSale } from '../services/firestore/FirebaseSales';
import { addReserve } from '../services/firestore/FirebaseReserves'
import { format, parseISO } from 'date-fns'
import { getStoreByName } from '../services/firestore/FirebaseStores';
// import { getStoreByName } from '../services/firestore/FirebaseStores';
// import { getStoresNames } from '../services/firestore/FirebaseStores';

export default 
{
    data: () => 
    ({
        // products: getProductsByStore('Heroinas'),
        products: [],
        efective: 10,
        change: 0,
        sortBy: 'idShoe',
        search: '',
        total: 0,
        // stores: [],
        customer: {
          ci: '',
          name: '',
          lastname: '',
          email: null,
          phone: '',
          birthday: null
        },
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
            { text: 'Sucursal', value: 'store' },
            { text: 'Precio', value: 'price' },
            { text: 'Condición', value: 'condition' },
            { text: 'Union 1', value: 'customColumn' }
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
        customerDialog: false,
        reserveDialog: false,
        saleDialog: false,
        itemDiscount: 0,
        totalDiscount: 0,
        totalQuantity: 0,
        discountClick: true,
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu2: false,
        radioGroup: 'Sin Factura',
        bill: null,
        payment: 'Efectivo',
        saleDetail: null,
        store: '',
        direction:'',
        dateReserve: new Date(Date.now()).toISOString().substr(0, 10),
        dateStr: null,
        menu: false,
        idShoe: '',
        }),

    computed: 
    {
        getStore()
        {
          return this.$store.state.userStore;
        },
        getDirection()
        {
          return this.$store.state.storeDirection;
        },
        computedDateFormattedDatefns () 
        {
            return this.dateReserve ? format(parseISO(this.dateReserve), 'dd/MM/yyyy') : ''
        },
        getPermission()
        {
          return  this.$store.state.userRole != 'Admin';
        }
    },

        watch: 
        {
        
        },

        created () 
        {
        new Promise(resolve => setTimeout(resolve, 3000));
        this.initialize();
        },

        methods: 
        {
        initialize () 
        {
          this.dateStr = format(parseISO(this.dateReserve), 'dd/M/yyyy');
          // this.stores = getStoresNames();
        },
        addItem(item)
        {
          this.store = this.$store.state.userStore;
          this.direction = this.$store.state.storeDirection;
          const itemIndex = this.saleOrder.findIndex( tmp => tmp.id ===  item.id);
          this.total = 0;
          this.itemDiscount = item.price;

          getStoreByName(item.store).then( snap => 
          {
            if(!snap.empty)
            {
              snap.docs.forEach(doc => 
              {
                console.log(doc.data().direction + " - " + this.direction)
                if (this.direction == doc.data().direction)
                {
                  this.verifyAndAddItem(itemIndex, item);
                  this.saleOrder.forEach( doc => 
                  {
                    this.total = this.total + doc.subtotal;
                  });
                }
                else
                {
                  createAlert('Sucursal Incorrecta', 'error')
                }
              });
            }
            else
            {
              console.log('Error al consultar sucursal.');
            }
          });
          
          // getStoreByName(this.store).then( snap => 
          // {
          //   if (snap.docs.length > 0)
          //   {

          //   }
          // });
        },
        verifyAndAddItem(itemIndex, item)
        {
          
          
          if (itemIndex > -1)
          {
            if ((item.quantity + 1) <= item.stock) 
            {
              item.quantity = parseInt(item.quantity) + 1;
              item.subtotal = item.quantity * item.price;
              Object.assign(this.saleOrder[itemIndex], item);
            }
            else
            {
              createAlert('Stock insuficiente!', 'error');
            }
          }
          else
          {
            item.discount = 0;
            item.quantity = 1;
            if (item.quantity <= item.stock) 
            {
              item.subtotal = item.quantity * item.price;
              this.saleOrder.push(Object.assign({}, item));
            }
            else
            {
              createAlert('Stock insuficiente!', 'error');
            }
          }
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
            if(item.quantity <= item.stock)
            {
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
            }
            else
            {
              createAlert('Stock insuficiente! Solicitaste ' + item.quantity + ' pero solo tenemos ' + item.stock + ' en stock.' , 'error');
              item.quantity = '-';
            }
        },
        checkout()
        {
            console.log(this.saleOrder);
            this.dialog = true;
        },
        saveSale()
        {
          if(this.customer.ci == '' || this.customer.lastname == '')
          {
            this.customer.ci = '0';
            this.customer.lastname = 'Sin Nombre';
          }
          this.store = this.$store.state.userStore;
          this.direction = this.$store.state.storeDirection;
          this.saleDialog = true;
          this.saleOrder.forEach( doc => 
            {
              this.totalQuantity = this.totalQuantity + doc.quantity;
            });
        },
        finalizeSale()
        {
            this.dialog = false;
            this.products = [];
            // this.products = getProducts();
            if(this.radioGroup == 'op1')
            {
              this.bill = true;
              console.log('Imprimir Factura');
            }
            else if (this.radioGroup == 'op2')
            {
              this.bill = false;
              console.log('No Imprimir Factura');

            }
            else if (this.radioGroup == 'op3')
            {
              console.log('Detalle de Venta');
            }
            addSale(this.saleOrder, this.customer, this.total, this.totalDiscount, this.totalQuantity, this.efective, this.bill, this.payment, this.store);
            console.log(this.saleOrder);
            createAlert('Venta realizada con Éxito!', 'success');

            // this.saleOrder.forEach( doc => {
            //   const productIndex = this.products.findIndex( item => item.id ===  doc.id);
            //   this.products[productIndex].stock = this.products[productIndex].stock - doc.quatity;
            // });

            this.saleOrder = [];
            this.payment = '';
            this.totalDiscount = 0;
            this.total = 0;
            this.totalQuantity = 0;
            this.efective = 0;
        },
        saveReserve()
        {
          if(parseInt(this.efective) < 10)
          {
            createAlert('El monto minimo para reservar es de 10 Bs.', 'error');
          }
          else
          {// se comento esto para no pedir ci al cliente cuando haga una reserva
            // getCustomerByCi(this.customer.ci).then( snap =>
            // {
            //   if(snap.exists)
            //   {
            //     if(snap.data().phone == null)
            //     {
            //       this.customerDialog = true;
            //     }
            //   }
            //   else
            //   {
            //     this.customerDialog = true;
            //   }
            // });
            this.reserveDialog = true;
          }
          this.store = this.$store.state.userStore;
          this.direction = this.$store.state.storeDirection;
          this.saleOrder.forEach( doc => 
            {
              this.totalQuantity = this.totalQuantity + doc.quantity;
            });
        },
        finalizeReserve()
        {
          this.dateStr = format(parseISO(this.dateReserve), 'dd/M/yyyy');
          this.dateStr = format(parseISO(this.dateReserve), 'd/M/yyyy');
          addReserve(this.saleOrder, this.customer, this.total, this.totalDiscount, this.totalQuantity, this.efective, this.payment, this.store, this.dateReserve);

          this.dialog = false;
          this.saleOrder = [];
          this.totalDiscount = 0;
          this.total = 0;
          this.totalQuantity = 0;
          this.efective = 0;
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
          let limitDiscount = this.editedItem.pDiscount * this.editedItem.quantity;
          if (limitDiscount < (this.editedItem.subtotal - this.itemDiscount))
          {
            createAlert('El descuento no puede pasar de ' + limitDiscount + ' Bs.', 'error');
          }
          else if((this.editedItem.price - this.limitDiscount) < 0)
          {
            createAlert('El precio de venta máximo para este producto es de ' + this.editedItem.price + ' Bs.', 'error');
          }
          else
          {
            this.editedItem.discount = (this.editedItem.price * this.editedItem.quantity) - this.itemDiscount;
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
        },
        onNitChanged()
        {
          getCustomerByCi(this.customer.ci).then(doc => 
          {
            if(doc.exists)
            {
              this.customer = doc.data();
              if(this.customer.birthday != null)
              {
                this.customer.birthday = new Date(doc.data().birthday['seconds'] * 1000).toISOString().substr(0, 10);
              }
            }
            else
            {
              alert('Cliente Nuevo');
            }
          });
        },
        saveCustomer()
        {
          if(this.$refs.form.validate())
          {
            addCustomer(this.customer);
            this.reserveDialog = true;
            this.customerDialog = false;
          }
        },
        onRadioButtonChanged()
        {
          console.log('radioBtn: ' + this.radioGroup)
        },
        closeDate()
        {
          this.dateStr = format(parseISO(this.dateReserve), 'dd/M/yyyy');
          // console.log(format(parseISO(this.dateReserve), 'd/M/yyyy'));
          // console.log('dateReserve: ' + this.dateReserve );
          // console.log('date: ' + new Date(this.dateStr).toLocaleDateString('en-BO'));
          // console.log('time: ' + new Date(Date.now()).toLocaleTimeString('es-BO'));
          this.dateStr = format(parseISO(this.dateReserve), 'd/M/yyyy');
          this.menu = false;
        },
        async filterProducts()
        {
          console.log(this.idShoe)
          this.products = await getPorductsByCustomFilter(['idShoe','reference','brand','store'],this.idShoe);
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
