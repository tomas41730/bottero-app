<template>
    <v-container fluid>
        <template>
            <v-dialog v-model="dialogInfo" max-width="500px">
                <v-card>
                    <v-toolbar color="black" dark> 
                        <v-btn icon dark @click="dialogInfo = false; discountClick = true">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        Informacion del producto: {{ editedItem.store + ' - ' + editedItem.idShoe }}
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
        <v-data-table :headers="saleHeaders" :items="this.reserves" :search="search" item-key="cnt" multi-sort class="elevation-1">
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
                        <v-col cols="3" sm="3" md="3">
                            <v-select small flat solo-inverted hide-details @change="onStoreChanged" v-model="store" :items="stores" :readonly="getPermission" label="Sucursal"></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                        </v-col>
                    </v-row>
                </v-toolbar>
            </template>
            <template v-slot:[`item.isCompleted`]="{ item }">
                <v-icon color="green" v-if="item.isCompleted">mdi-check-circle</v-icon> 
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
                                <v-data-table locale="es-BO" :items-per-page="5" :headers="headersSaleOrder" :items="reserveOrder" item-key="cnt" sort-by="cnt" class="elevation-1">
                                    <template v-slot:top>
                                        <v-card>
                                            <v-toolbar dark color="black">
                                                <v-btn icon dark @click="closeDialog">
                                                <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                                <v-toolbar-title class="text-h4" v-text="'Reserva realizada el día: ' + reserveDate"></v-toolbar-title>
                                                <v-icon color="green" v-if="reserveInfo.isCompleted">mdi-check-circle</v-icon> 
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
                                            <v-col justify="center" align="right" md="4">
                                                <div class="text-h4">Nombre: </div>
                                                <div class="text-h4">Telf.: </div>
                                            </v-col>
                                            <v-divider vertical></v-divider>
                                            <v-col justify="center" md="8">
                                                <div class="text-h4">{{ reserveInfo.name }}</div>
                                                <div class="text-h4">{{ reserveInfo.customerPhone }}</div>
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
                                                <div class="text-h4">{{ reserveInfo.subtotal }}</div>
                                                <div class="text-h4">{{ reserveInfo.totalDiscount }}</div>
                                                <div class="text-h4">{{ reserveInfo.total }}</div>
                                                <div class="text-h4">{{ reserveInfo.payed }}</div>
                                                <div class="text-h4">{{ reserveInfo.balance }}</div>
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
                                            <v-data-table :headers="payHistoryHeaders" :items="reserveInfo.paymentHistory" item-key="cnt" class="elevation-1">    
                                                <template v-slot:no-data>
                                                    <v-btn  ref="btnReset" color="primary" @click="initialize">
                                                        Reset
                                                    </v-btn>
                                                </template>
                                            </v-data-table>
                                        </v-row>
                                        <v-row>
                                            <v-col v-if="parseInt(reserveInfo.balance) <= 0">
                                                <v-toolbar dark color="success" class="mb-1">
                                                    <v-toolbar-title class="text-h4">
                                                        PAGADO
                                                        <v-icon color="prymary" large>mdi-check-circle</v-icon> 
                                                    </v-toolbar-title>
                                                </v-toolbar>
                                            </v-col>
                                            <v-col v-else>
                                                <v-form ref="form" v-model="valid" lazy-validation>
                                                    <v-text-field id="sublabel" x-large suffix="Bs." v-model="amount" @click="onAmountChanged" :rules="[v => !!v || 'Requerido']" required></v-text-field>
                                                    <v-select v-model="payment" :items="['Efectivo', 'Tarjeta', 'QR']" label="Forma de Pago" :rules="[v => !!v || 'Requerido']" required></v-select>
                                                    <v-btn block color="primary" @click="addPay(item)" > Agregar Pago </v-btn>
                                                </v-form>
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
// import { getProductByIdShoe } from '../services/firestore/FirebaseProducts2';

import { getEachReserve, getEachReserveByStore, updateReservePays } from '../services/firestore/FirebaseReserves';
import { getStoresNames } from '../services/firestore/FirebaseStores';

export default {
    data: ()  => 
    ({
        reserves: [],
        reserveOrder: [],
        stores: [],
        dialog: false,
        dialogInfo: false,
        search: '',
        reserveDate: '//',
        editedItem: {},
        reserveInfo: {},
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
            { text: 'Precio', value: 'itemPrice' },
            { text: 'Descuentos', value: 'itemDiscount' },
            { text: 'Subtotal', value: 'finalPrice' },
            { text: 'Total', value: 'total' },
            { text: 'Pagado', value: 'payed' },
            { text: 'Saldo', value: 'balance' },
            { text: 'Estado', value: 'isCompleted' },
            { text: '#', value: 'idReserve2' },
            
        ],
        headersSaleOrder: [
            { text: 'Foto', value: 'photo' },
            { text: 'C. Barras', align: 'start', sortable: true, value: 'idShoe'},
            { text: 'Referencia', value: 'reference' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Condición', value: 'condition' },
            { text: 'Sucursal', value: 'store' },
            { text: 'Precio', value: 'itemPrice' },
            { text: 'Cantidad', value: 'itemQuantity' },
            { text: 'Descuento', value: 'itemDiscount' },
            { text: 'Monto', value: 'finalPrice' },
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
        amount: 0,
        valid: true,
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
            this.stores.push('Todas');
            this.store = this.$store.state.userStore;
            this.reserves = getEachReserveByStore(this.store);
        },
        viewItem(item)
        {
            this.editedItem = item;
            this.dialogInfo = true;
        },
        viewSale(item)
        {
            
            this.reserveDate = item.date;
            this.reserveInfo = item;
            this.reserveOrder = this.reserves.filter( doc => doc.idReserve == item.idReserve);
            console.log(this.reserveInfo);
            console.log(this.reserveOrder);
            this.dialog = true;
        },
        closeDialog()
        {
            // this.onStoreChanged();
            this.dialog = false;
        },
        addPay()
        {
            if(this.$refs.form.validate())
            {
                let date = new Date(Date.now()).toLocaleDateString('es-BO');
                let time = new Date(Date.now()).toLocaleTimeString('es-BO');
                console.log('validado');
                this.reserveInfo.paymentHistory.push({ amount: this.amount, date: date, payment: this.payment, store: this.store, time: time});
                console.log(this.reserveInfo);
                this.reserveInfo.balance = parseInt(this.reserveInfo.balance) - parseInt(this.amount);
                this.reserveInfo.payed = parseInt(this.reserveInfo.payed) + parseInt(this.amount);
                this.reserves.filter( item => item.idReserve == this.reserveInfo.idReserve).map( doc => 
                {
                    doc.balance = this.reserveInfo.balance;
                    doc.payed = this.reserveInfo.payed;
                    doc.isCompleted = this.reserveInfo.balance <= 0;
                })
                updateReservePays(this.reserveInfo);
                this.$refs.form.reset();
            }
            
        },
        onStoreChanged()
        {
            if(this.store == 'Todas')
            {
                this.reserves = getEachReserve();
            }
            else
            {
                this.reserves = getEachReserveByStore(this.store);
            }
        },
        onAmountChanged()
        {
            console.log(this.amount);
            if(this.amount == 0)
            {
                this.amount = null;
            }
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