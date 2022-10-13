<template>
    <v-container fluid>
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
        <v-data-table :headers="saleHeaders" :items="this.sales" :search="search" item-key="name" :custom-sort="customSort" multi-sort class="elevation-1">
            <template v-slot:top>
                <v-toolbar dark color="black" class="mb-1">
                    <v-row>
                        <v-col>
                            <v-toolbar-title class="text-h3">RESERVAS</v-toolbar-title>
                        </v-col>
                    </v-row>
                </v-toolbar>
                <v-toolbar dark color="black" class="mb-1">
                    <v-row>
                        <v-col>
                            <v-menu v-model="menu2" :close-on-content-click="true" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field small clearable flat solo-inverted hide-details label="Desde" prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker locale="es-BO" v-model="search" @input="menu2 = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col>
                            <v-menu v-model="menu2" :close-on-content-click="true" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field small clearable flat solo-inverted hide-details label="Hasta" prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker locale="es-BO" v-model="search" @input="menu2 = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                        </v-col>
                    </v-row>
                </v-toolbar>
            </template>
            <template v-slot:[`item.isDebtPayed`]="{ item }">
                <v-icon color="green" v-if="item.isDebtPayed">mdi-check-circle</v-icon> 
                <v-icon color="red" v-else>mdi-close-circle</v-icon>
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
                                                <v-toolbar-title class="text-h4" v-text="'Reserva realizada el día: ' + saleDate"></v-toolbar-title>
                                                <v-icon color="green" v-if="saleInfo.isDebtPayed">mdi-check-circle</v-icon> 
                                                <v-icon color="red" v-else>mdi-close-circle</v-icon>
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
                            <v-col cols="12" sm="12" md="4">
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
                            <v-col cols="12" sm="12" md="4">
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title class="text-h4">INFORMACIÓN DE RESERVA</v-toolbar-title>
                                    </v-toolbar>
                                    <v-col>
                                        <v-row>
                                            <v-col justify="center" align="right" md="7">
                                                <div class="text-h4">Subtotal: </div>
                                                <div class="text-h4">Descuentos: </div>
                                                <div class="text-h4">Total: </div>
                                                <div class="text-h4">Pagado: </div>
                                                <div class="text-h4">Saldo: </div>
                                            </v-col>
                                            <v-divider vertical></v-divider>
                                            <v-col justify="center" md="3">
                                                <div class="text-h4">{{ saleInfo.subtotal }}</div>
                                                <div class="text-h4">{{ saleInfo.totalDiscount }}</div>
                                                <div class="text-h4">{{ saleInfo.total }}</div>
                                                <div class="text-h4">{{ saleInfo.payed }}</div>
                                                <div class="text-h4">{{ saleInfo.balance }}</div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title class="text-h4">
                                            HISTORIAL DE PAGOS
                                        </v-toolbar-title>
                                    </v-toolbar>
                                    <v-col>
                                        <v-row>
                                            <v-data-table :headers="payHistoryHeaders" :items="saleInfo.paymentHistory" item-key="name" class="elevation-1">    
                                                <template v-slot:no-data>
                                                    <v-btn  ref="btnReset" color="primary" @click="initialize">
                                                        Reset
                                                    </v-btn>
                                                </template>
                                            </v-data-table>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-btn block color="primary" @click="addPay"> Agregar Pago </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-dialog persistent v-model="payDialog" max-width="280px">
                        <v-card>
                            <v-toolbar color="black" dark>
                                <v-btn icon dark @click="payDialog = false">
                                <v-icon>mdi-close</v-icon>
                                </v-btn>
                                Reservas - {{ getStore }}
                                <v-spacer></v-spacer>
                                <v-list-item-avatar  max-width="70px">
                                <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e"></v-img>
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
                                                <v-text-field v-model="amount" label="Monto"></v-text-field>
                                            </v-row>
                                            <v-row cols="2" sm="2" md="2">
                                                <v-select v-model="payment" :items="['Efectivo', 'Tarjeta', 'QR']" label="Forma de Pago"></v-select>
                                            </v-row>
                                        </v-col>
                                        </v-radio-group>
                                    </v-col>
                                    <v-col>
                                        <v-btn @click="finalizePay" dark color="primary">Finalizar Pago</v-btn>
                                    </v-col>
                                    </v-col>
                                </v-row>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
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
import { createAlert2 } from '../services/Alerts';
import { getCustomerByCi } from '../services/firestore/FirebaseCustomers';
import { getProductById } from '../services/firestore/FirebaseProducts';
import { getEachReserve, updateReservePays } from '../services/firestore/FirebaseReserves';

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
            { text: '#', value: 'idReserve' },
            { text: 'Fecha', align: 'start', sortable: true, value: 'date' },
            { text: 'Sucursal', value: 'store' },
            { text: 'Referencia', value: 'reference' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Telefono', value: 'customerPhone' },
            { text: 'Nombre', value: 'name' },
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'Descuentos', value: 'totalDiscount' },
            { text: 'Total', value: 'total' },
            { text: 'Pagado', value: 'payed' },
            { text: 'Saldo', value: 'balance' },
            { text: 'Estado', value: 'isDebtPayed' },
            
        ],
        headersSaleOrder: [
            { text: 'Foto', value: 'photo' },
            { text: 'C. Barras', align: 'start', sortable: true, value: 'id'},
            { text: 'Referencia', value: 'reference' },
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
        payHistoryHeaders: [
            { text: 'Fecha', value: 'date' },
            { text: 'Hora', value: 'time' },
            { text: 'Sucursal', value: 'store'},
            { text: 'Monto', value: 'amount'},
            { text: 'Forma de pago', value: 'payment' },
        ],
        itemsPerPage: 5,
        menu2: false,
        radioGroup: '',
        payment: '',
        payDialog: false,
        store: '',
        amount: null
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
    created()
    {
        this.initialize();
    },
    methods:
    {
        initialize()
        {
            this.sales = getEachReserve();
            console.log(this.sales);
        },
        expandedProducts(item) 
        {
            let products = '';
            item.sale.forEach( doc => {
                products = products+ 'Cod: ' + doc.idShoe + ' * Ref: ' + doc.reference + ' * Cantidad: ' + doc.quantity + ' * Subtotal: ' + doc.subtotal + '\n';
            });
            return products;
        },
        viewSale(item)
        {
            this.saleOrder = []
            this.dialog = true;
            this.saleInfo = item;
            this.saleDate = item.date;
            item.sale.forEach( prod => 
            {
                getProductById(prod.id).then( doc => 
                {
                    if(doc.exists)
                    {
                        let product = {...doc.data(), quantity: prod.quantity, discount: prod.discount, subtotal: prod.subtotal }
                        this.saleOrder.push(product);
                    }
                });
                
            });
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
            console.log(item);
        },
        closeDialog()
        {
            console.log("Clooooooooooooooooooseeeee");
            this.dialog = false;
        },
        addPay()
        {
            if(this.saleInfo.balance == 0)
            {
                createAlert2('Esta reserva fue pagada en su totalidad. No se pueden añadir mas pagos.', 'error');
            }
            else
            {
                this.store = this.$store.state.userStore;
                this.payDialog = true;
            }
        },
        finalizePay()
        {
            this.saleInfo.payed = this.saleInfo.payed + parseInt(this.amount);
            this.saleInfo.balance = this.saleInfo.balance - parseInt(this.amount);
            let pay = { date: new Date().toLocaleDateString('es-BO'), time: new Date().toLocaleTimeString('es-BO'), amount: this.amount, payment: this.payment, store: this.store }
            this.saleInfo.paymentHistory.push(pay);
            console.log(this.saleInfo)
            updateReservePays(this.saleInfo);
            this.payDialog = false;
            const indexSale = this.sales.indexOf(item => item.id = this.saleInfo.id);
            this.sales[indexSale] = this.saleInfo;
            this.saleInfo = {};
        },
        customSort(items, index, isDesc) 
        {
            items.sort((a, b) => {
                if (index[0]=='due') {
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
    }
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