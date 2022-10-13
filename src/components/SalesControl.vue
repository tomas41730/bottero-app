<template>
    <v-container fluid ma-0 pa-0 fill-height>
        <template>
            <v-dialog v-model="dialogInfo" max-width="500px">
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
                                        </v-col>
                                        <v-col>
                                            <v-text-field :readonly="true" v-model="editedItem.reference" label="Referencia"></v-text-field>
                                            <v-text-field :readonly="true" v-model="editedItem.color" label="Color"></v-text-field>
                                            <v-text-field :readonly="true" v-model="editedItem.condition" label="Condición"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field :readonly="true" v-model="editedItem.price" label="Precio" suffix="Bs."></v-text-field>
                                            <v-text-field :readonly="true" v-model="editedItem.material" label="Material"></v-text-field>
                                            <v-text-field :readonly="true" v-model="editedItem.store" label="Sucursal"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row align="center" justify="center">
                                        <v-img :src="editedItem.photo" max-width="350"></v-img>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </template> 
        <v-data-table :headers="saleHeaders" :items="this.sales" :search="search" :custom-sort="customSort" multi-sort item-key="cnt" class="elevation-1">
            <template v-slot:top>
                <v-toolbar dark color="black" class="mb-1">
                    <v-row>
                        <v-col>
                            <v-toolbar-title class="text-h3">VENTAS</v-toolbar-title>
                        </v-col>
                    </v-row>
                </v-toolbar>
                <v-toolbar dark color="black" class="mb-1">
                    <v-row>
                        <v-col cols="3" sm="3" md="3">
                            <v-select small flat solo-inverted hide-details @change="onStoreChanged" v-model="store" :items="stores" :readonly="getPermission" label="Sucursal"></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-menu v-model="menu2" :close-on-content-click="true" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field small clearable flat solo-inverted hide-details label="Desde" prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker locale="es-BO" v-model="search" @input="menu2 = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-toolbar>
            </template>
            <template v-slot:[`item.bill`]="{ item }">
                <v-icon color="primary" v-if="item.bill">mdi-check-circle</v-icon>
                <v-icon color="green" v-else>mdi-check-circle</v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn small color="primary" class="mr-2" @click="viewSale(item)">
                    ver 
                    <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-dialog fullscreen persistent v-model="dialog" max-width="1200" transition="dialog-bottom-transition" :retain-focus="false">
                    <v-card>
                        <v-row>
                            <v-col align="center" justify="center" cols="12" sm="12" md="12">
                                <v-data-table locale="es-BO" :items-per-page="5" :headers="headersSaleOrder" :items="saleOrder" :search="search" sort-by="name" class="elevation-1">
                                    <template v-slot:top>
                                        <v-card>
                                            <v-toolbar dark color="black">
                                                <v-btn icon dark @click="closeDialog">
                                                <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                                <v-toolbar-title class="text-h4" v-text="'Venta realizada el día: ' + saleDate"></v-toolbar-title>
                                                <v-spacer></v-spacer>
                                            </v-toolbar>
                                            <v-divider></v-divider>
                                        </v-card>
                                    </template>    
                                    <template v-slot:no-data>
                                        <v-btn  ref="btnReset" color="primary" @click="initialize">
                                            Reset
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.photo`]="{ item }">
                                        <div class="p-2">
                                            <v-list-item-avatar tile size="70">
                                                <v-img @click="viewItem(item)" :src="item.photo"></v-img>
                                            </v-list-item-avatar>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="5">
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title class="text-h4">
                                            INFORMACIÓN DEL CLIENTE
                                        </v-toolbar-title>
                                    </v-toolbar>
                                    <v-col>
                                        <v-row>
                                            <v-col justify="center" align="right" md="6">
                                                <div class="text-h4">NIT: </div>
                                                <div class="text-h4">Apellido: </div>
                                                <div class="text-h4">Nombre: </div>
                                                <div class="text-h4">Telefono: </div>
                                            </v-col>
                                            <v-divider vertical></v-divider>
                                            <v-col justify="center" md="6">
                                                <div class="text-h4">{{ customer.ci }}</div>
                                                <div class="text-h4">{{ customer.lastname }}</div>
                                                <div class="text-h4">{{ customer.name }}</div>
                                                <div class="text-h4">{{ customer.phone }}</div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="12" md="7">
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title class="text-h4">INFORMACIÓN DE VENTA</v-toolbar-title>
                                    </v-toolbar>
                                    <v-col>
                                        <v-row>
                                            <v-col justify="center" align="right" md="4">
                                                <div class="text-h4">Subtotal: </div>
                                                <div class="text-h4">Descuentos: </div>
                                                <div class="text-h4">Total: </div>
                                                <div class="text-h4">Efectivo: </div>
                                                <div class="text-h4">Cambio: </div>
                                            </v-col>
                                            <v-col justify="center" md="2">
                                                <div class="text-h4">{{ saleInfo.subtotal }}</div>
                                                <div class="text-h4">{{ saleInfo.totalDiscount }}</div>
                                                <div class="text-h4">{{ saleInfo.total }}</div>
                                                <div class="text-h4">{{ saleInfo.efective }}</div>
                                                <div class="text-h4">{{ saleInfo.exchange }}</div>
                                            </v-col>
                                            <v-divider vertical></v-divider>
                                            <v-col justify="center" align="right" md="3">
                                                <div class="text-h4">Venta: </div>
                                                <div class="text-h4">Factura: </div>
                                            </v-col>
                                            <v-col justify="center" md="3">
                                                <div class="text-h4">{{ saleInfo.idSale }}</div>
                                                <div class="text-h4">{{ saleInfo.billNumber }}</div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row cols="12" sm="12" md="12">
                            <v-col>
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title class="text-h4">
                                            INFORMACIÓN DE PAGO
                                        </v-toolbar-title>
                                    </v-toolbar>
                                    <v-col>
                                        <v-row>
                                            <v-col justify="center" align="right" md="4">
                                                <div class="text-h4">Forma de pago: </div>
                                            </v-col>
                                            <v-col justify="center" md="2">
                                                <div class="text-h4">{{ saleInfo.payment }} </div>
                                            </v-col>
                                            <v-divider vertical></v-divider>
                                            <v-col justify="center" align="right" md="3">
                                                <div class="text-h4">Factura:</div>
                                            </v-col>
                                            <v-col justify="center" md="2">
                                                <div class="text-h4" v-if="saleInfo.bill">Si</div>
                                                <div class="text-h4" v-else>No</div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-card>
                            </v-col>    
                        </v-row>
                    </v-card>
                </v-dialog>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                Reset
                </v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>
<script>
import { getCustomerByCi } from '../services/firestore/FirebaseCustomers';
import { getEachSale, getEachSaleByID } from '../services/firestore/FirebaseSales'
import { getStoresNames } from '../services/firestore/FirebaseStores';
export default {
    data: ()  => 
    ({
        expanded: [],
        singleExpand: false,
        sales: [],
        saleOrder: [],
        dialog: false,
        dialogInfo: false,
        search: '',
        saleDate: '//',
        editedItem: {},
        saleInfo: {},
        customer: {
            ci: '',
            name: '',
            lastname: '',
            email: '',
            phone: '',
            birthday: ''
        },
        saleHeaders: [
            { text: 'Acciones', value: 'actions', sortable: false },
            { text: '#', align: 'start', value: 'cnt' },
            { text: 'Sucursal', align: 'start', sortable: true, value: 'store' },
            { text: 'Fecha', align: 'start', sortable: true, value: 'date' },
            { text: 'NIT', value: 'customerCi' },
            { text: 'Apellido', value: 'lastname' },
            { text: 'Codigo', value: 'idSale' },
            { text: 'Referencia', value: 'reference' },
            { text: 'Precio', value: 'itemPrice' },
            { text: 'Pares', value: 'itemQuantity' },
            { text: 'Descuentos', value: 'itemDiscount' },
            { text: 'Total', value: 'finalPrice' },
        ],
        saleHeaders1: [
            { text: 'Acciones', value: 'actions', sortable: false },
            { text: '#', align: 'start', sortable: true, value: 'idSale' },
            { text: 'Fecha', align: 'start', sortable: true, value: 'date' },
            { text: 'Sucursal', value: 'store' },
            { text: 'ID', value: 'itemId' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'NIT', value: 'customerCi' },
            { text: 'Apellido', value: 'lastname' },
            { text: 'Referencia', value: 'reference' },
            { text: 'Precio', value: 'price' },
            { text: 'Pares', value: 'quantity' },
            { text: 'Subtotal', value: 'individualSubtotal' },
            { text: 'Total', value: 'individualTotal' },
            { text: 'Descuentos', value: 'individualDiscount' },
            { text: 'Factura', value: 'bill' },
            
        ],
        headersSaleOrder: [
            { text: 'Foto', value: 'photo' },
            { text: 'C. Barras', align: 'start', sortable: true, value: 'idShoe'},
            { text: 'Referencia', value: 'referece' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Condición', value: 'condition' },
            { text: 'Sucursal', value: 'store' },
            { text: 'Precio', value: 'price' },
            { text: 'Cantidad', value: 'quantity' },
            { text: 'Descuento', value: 'discount' },
            { text: 'Monto', value: 'subtotal' },
            // { text: 'ID', value: 'id' }
        ],
        itemsPerPage: 5,
        menu2: false,
        stores: [],
        store: ''
    }),
    computed:
    {
        getStore()
        {
            return this.$store.state.userStore;
        },
        getPermission()
        {
            return  this.$store.state.userRole != 'Admin';
        }
    },
    watch:
    {

    },
    created()
    {
        this.initialize();
    },
    methods:
    {
        initialize()
        {
            this.stores = getStoresNames();
            this.store = this.$store.state.userStore;
            this.sales = getEachSale(this.store);
            console.log(this.sales);
        },
        viewSale(item)
        {
            console.log(item);
            this.saleOrder = []
            this.store = this.$store.state.userStore;
            this.dialog = true;
            this.saleInfo = item;
            // this.saleInfo.subtotal = item.subtotal;
            // this.saleInfo.totalDiscount = item.totalDiscount;
            // this.saleInfo.total = item.total;
            // this.saleInfo.exchange = item.exchange;
            this.saleDate = item.date;
            this.saleOrder = getEachSaleByID(item.id);
            this.saleInfo.exchange = item.exchange;
            getCustomerByCi(item.customerCi).then( doc => 
            {
                if(doc.exists)
                {
                    this.customer = doc.data();
                }
                else
                {
                    this.customer.lastname = 'Sin Nombre';
                    this.customer.ci = 0;
                }
            });
            console.log(this.saleOrder);
        },
        viewItem(item)
        {
            this.editedItem = item;
            this.dialogInfo = true;
        },
        onStoreChanged()
        {
            this.sales = getEachSale(this.store);
        },
        closeDialog()
        {
            console.log("Clooooooooooooooooooseeeee");
            this.dialog = false;
        },
        customSort(items, index, isDesc) 
        {
            items.sort((a, b) => {
                if (index[0]=='date') {
                    if (isDesc[0]) {
                        return new Date(b[index]) - new Date(a[index]);
                    } 
                    else 
                    {
                        return new Date(a[index]) - new Date(b[index]);
                    }
                }
                else 
                {
                    if(typeof a[index] !== 'undefined'){
                    if (!isDesc[0]) 
                    {
                        return a[index].toLowerCase().localeCompare(b[index].toLowerCase());
                    }
                    else 
                    {
                        return b[index].toLowerCase().localeCompare(a[index].toLowerCase());
                    }
                    }
                }
            });
            return items;
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
/* .v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
    font-size: 18px !important;
    text-align: center !important;
} */
/* .v-data-table>.v-data-table__wrapper>table>thead>tr>th {
    font-weight: bold;
    font-size: 20px !important;
    color: white !important;
    background: lightslategray;
    text-align: center !important;
} */
/* .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
    font-size: 25px !important;
} */
/* .v-input.my-class input {
    max-height: 32px !important;
} */
/* .v-input .v-label {
    height: 20px !important;
    line-height: 20px !important;
    letter-spacing: normal;
} */
</style>