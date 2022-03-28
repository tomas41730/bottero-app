<template>
    <v-container fluid>
        <template>
            <v-dialog v-model="dialogInfo" max-width="500px">
                <v-card>
                    <v-toolbar color="black" dark> 
                        <v-btn icon dark @click="dialogInfo = false; discountClick = true">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        Venta realizada el dia: {{ editedItem.id }}
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
        <template>
            <v-dialog v-model="dialogCashRegister" max-width="1000px" persistent>
                <v-card>
                    <v-toolbar color="black" dark class="mb-4"> 
                        <v-btn icon dark @click="dialogCashRegister = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>
                            {{ selectedStore }} - Dinero en Caja: {{ getTotalTitleDialog }} Bs.
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-list-item-avatar  max-width="70px">
                        <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e"></v-img>
                        </v-list-item-avatar>
                    </v-toolbar>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="4">
                                    <v-row>
                                        <v-col>
                                            <v-radio-group v-model="radioOption" row mandatory>
                                                <v-col>
                                                    <v-row cols="2" sm="2" md="2" class="mb-1">
                                                        <v-radio x-large label="Ingresar Dinero" value="Ingreso" @click="onRadioButtonChanged"></v-radio>
                                                    </v-row>
                                                    <v-row x-large cols="2" sm="2" md="3" class="mb-1">
                                                        <v-radio label="Retirar Dinero" value="Retiro" @click="onRadioButtonChanged"></v-radio>
                                                    </v-row>
                                                    <v-row class="mb-1">
                                                        <v-col>
                                                            <v-select x-large flat v-model="selectedStore" :items="getStoresList" placeholder="Sucursal" label="Sucursal" @click="onCashStoreChanged"></v-select>
                                                        </v-col>
                                                        <v-col>
                                                            <v-text-field x-large flat v-model="cashRegister" placeholder="Monto" label="Monto"></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row cols="2" sm="2" md="3" class="mb-1">
                                                        <v-textarea x-large  rows="1" flat v-model="cashDescription" placeholder="Descripcion" label="Descripcion"></v-textarea>
                                                    </v-row>
                                                    <v-row class="mb-1">
                                                        <v-btn block color="primary" @click="saveCashRegister">Guardar</v-btn>
                                                    </v-row>
                                                </v-col>
                                            </v-radio-group>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col class="justify-center" cols="12" sm="12" md="8">
                                    <v-data-table :headers="cashHeaders" :items="cashRegisterMoves" :search="searchCashMoves" item-key="name" class="elevation-1">
                                        <template v-slot:top>
                                            <v-toolbar dark color="black" class="mb-1">
                                                <v-row>
                                                    <!--
                                                    <v-col>
                                                        <v-menu v-model="menu" :close-on-content-click="false" max-width="290">
                                                            <template v-slot:activator="{ on, attrs }"> 
                                                                <v-text-field small clearable flat solo-inverted hide-details :value="computedDateFormattedDatefns" prepend-inner-icon="mdi-calendar" label="Fecha" readonly v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="date" @change="closeDate1"></v-date-picker>
                                                        </v-menu>
                                                    </v-col> 
                                                    -->
                                                    <v-col>
                                                        <v-text-field v-model="searchCashMoves" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:no-data>
                                            <v-btn color="primary" @click="initialize">
                                            Reset
                                            </v-btn>
                                        </template>
                                    </v-data-table>
                                </v-col>  
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </template>
        <v-row>
            <v-toolbar dark color="black" class="mb-2">
                <v-row>
                    <v-col>
                        <v-toolbar-title v-text="'VENTAS DEL DIA: ' + dateStr" class="text-h3">VENTAS</v-toolbar-title>
                    </v-col>
                </v-row>
            </v-toolbar>
        </v-row>
        <v-row>
            <v-col>
                <v-card class="mb-2 text-center" color="green" dark max-width="300">
                    <v-row class="justify-center">
                        <h1>
                            INGRESOS
                        </h1>
                    </v-row>
                    <v-row>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row class="justify-center">
                        <h1>
                            {{ getIncomeTitle }} Bs.
                        </h1>
                    </v-row>
                </v-card>
            </v-col> 
            <v-col>
                <v-card class="mx-auto text-center" color="red" dark max-width="300">
                    <v-row class="justify-center">
                        <h1>
                            EGRESOS
                        </h1>
                    </v-row>
                    <v-row>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row class="justify-center">
                        <h1>
                            {{ getExpensesTitle }} Bs.
                        </h1>
                    </v-row>
                    
                </v-card>
            </v-col> 
            <v-col>
                <v-card class="mx-auto text-center" color="blue" dark max-width="300" @click="dialogCashRegister = true">
                    <v-row class="justify-center">
                        <h1>
                            CAJA
                        </h1>
                    </v-row>
                    <v-row>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row class="justify-center">
                        <h1>
                            {{ dailyReport.cash }} Bs.
                        </h1>
                    </v-row>
                </v-card>
            </v-col> 
            <v-col>
                <v-card class="mx-auto text-center" color="yellow" max-width="300">
                    <v-row class="justify-center">
                        <h1>
                            TOTAL
                        </h1>
                    </v-row>
                    <v-row class="justify-center">
                        <h1>
                            {{ getTotalTitle }} Bs.
                        </h1>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="justify-center" cols="12" sm="12" md="12">
            <v-data-table :headers="saleHeaders" :items="sales" :search="search" item-key="name" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar dark color="black" class="mb-1">
                        <v-row>
                            <v-col>
                                <v-select small flat solo-inverted hide-details @change="closeDate1" v-model="store" :items="stores" label="Sucursal"></v-select>
                            </v-col>
                            <v-col>
                                <v-menu v-model="menu" :close-on-content-click="false" max-width="290">
                                    <template v-slot:activator="{ on, attrs }"> 
                                        <v-text-field small clearable flat solo-inverted hide-details :value="computedDateFormattedDatefns" prepend-inner-icon="mdi-calendar" label="Fecha" readonly v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" @change="closeDate1"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col>
                                <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small color="primary" class="mr-2" @click="viewSale(item)">
                        ver 
                        <v-icon small>mdi-eye</v-icon>
                    </v-btn>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="initialize">
                    Reset
                    </v-btn>
                </template>
            </v-data-table>
        </v-row>    
    </v-container>
</template>
<script>
import { getDailyReportByDay, getEachCashMove, getEachSale, getTotalAmountByDay, getTotalExpensesByDay, setCashRegister } from '../services/firestore/FirebaseSales';
import { format, parseISO } from 'date-fns'
import { getStoresNames } from '../services/firestore/FirebaseStores';
import { getProductById } from '../services/firestore/FirebaseProducts';

export default {
    data: ()  => 
    ({
        expanded: [],
        singleExpand: false,
        sales: [],
        stores: [],
        cashRegisterMoves: [],
        storesSelected: [''],
        store: '',
        saleOrder: [],
        dialog: false,
        dialogInfo: false,
        dialogCashRegister: false,
        search: '',
        searchCashMoves: '',
        saleDate: '//',
        editedItem: {},
        dailyReport: {},
        dailySalesDialog: {},
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
            { text: 'Sucursal', align: 'start', sortable: true, value: 'store' },
            { text: 'Fecha', align: 'start', sortable: true, value: 'date' },
            { text: 'NIT', value: 'customerCi' },
            { text: 'Apellido', value: 'lastname' },
            { text: 'Codigo', value: 'id' },
            { text: 'Referencia', value: 'reference' },
            { text: 'Precio', value: 'price' },
            { text: 'Pares', value: 'quantity' },
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'Total', value: 'total' },
            { text: 'Descuentos', value: 'discount' },
        ],
        cashHeaders: [
            { text: 'Fecha', align: 'start', sortable: true, value: 'date' },
            { text: 'Accion', align: 'start', sortable: true, value: 'operation' },
            { text: 'Monto', align: 'start', sortable: true, value: 'total' },
            { text: 'Sucursal', align: 'start', sortable: true, value: 'store' },
            { text: 'Descripcion', align: 'start', sortable: true, value: 'description' },
        ],
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dateStr: (new Date(Date.now())).toLocaleDateString("es-bo"),
        menu: false,
        dailySales: [],
        dailyExpenses: [],
        dailyExpensesDialog: [],
        selectedStore: '',
        cashRegister: null,
        radioOption: 'Ingreso',
        cashDescription: ''
    }),
    computed:
    {
        computedDateFormattedDatefns () 
        {
            return this.date ? format(parseISO(this.date), 'dd/M/yyyy') : ''
        },
        getStore()
        {
            return this.$store.state.userStore;
        },
        getIncomeTitle()
        {
            return this.dailySales.reduce((partialSum, a) => partialSum + a, 0);
        },
        getTotalTitle()
        {
            return (parseInt(this.dailySales.reduce((partialSum, a) => partialSum + a, 0)) + parseInt(this.dailyReport.cash) - parseInt(this.dailyExpenses.reduce((partialSum, a) => partialSum + a, 0))).toString();
        },
        getTotalTitleDialog()
        {
            return (parseInt(this.dailySalesDialog.reduce((partialSum, a) => partialSum + a, 0)) + parseInt(this.dailySalesDialog.cash) - parseInt(this.dailyExpensesDialog.reduce((partialSum, a) => partialSum + a, 0))).toString();
        },
        getExpensesTitle()
        {
            return parseInt(this.dailyExpenses.reduce((partialSum, a) => partialSum + a, 0));
        },
        getStoresList()
        {
            return getStoresNames();
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
            this.store = this.$store.state.userStore;
            this.selectedStore = this.$store.state.userStore;
            this.sales = getEachSale(this.dateStr, this.storesSelected);
            this.cashRegisterMoves = getEachCashMove(this.selectedStore);
            this.stores = getStoresNames();
            this.stores.push('Todas');
            this.dailySales = getTotalAmountByDay(this.dateStr, this.store);
            this.dailySalesDialog = getTotalAmountByDay(this.dateStr, this.store);
            this.dailyExpenses = getTotalExpensesByDay(this.dateStr, this.store);
            this.dailyExpensesDialog = getTotalExpensesByDay(this.dateStr, this.selectedStore);
            getDailyReportByDay(this.store).then( snap => 
            {
                if(snap.exists)
                {
                    this.dailyReport = snap.data();
                }
                else
                {
                    this.dailyReport = {};
                }
            });
        },
        getTotalAmout()
        {
        },
        viewSale(item)
        {
            this.dialogInfo = true;
            getProductById(item.id).then( doc => 
            {
                if(doc.exists)
                {
                    this.editedItem = doc.data();
                }
            });
                
        },
        closeDate1()
        {
            this.menu = false;
            this.dateStr = format(parseISO(this.date), 'dd/M/yyyy');
            this.sales = [];
            this.selectedStore = this.store;
            this.sales = getEachSale(this.dateStr, this.store);
            this.cashRegisterMoves = getEachCashMove(this.selectedStore);       
            getDailyReportByDay(this.store).then( snap => 
            {
                if(snap.exists)
                {
                    this.dailyReport = snap.data();
                }
                else
                {
                    this.dailyReport = {};
                }
            });
            this.dailySales = getTotalAmountByDay(this.dateStr,this.store);
            this.dailySalesDialog = getTotalAmountByDay(this.dateStr,this.selectedStore);
            this.dailyExpenses = getTotalExpensesByDay(this.dateStr,this.store);
        },
        onStoreChanged()
        {
            this.sales = getEachSale(this.dateStr, this.store);
            this.selectedStore = this.store;
        },
        onRadioButtonChanged()
        {
            // setCashRegister(this.storesSelected)
        },
        onCashStoreChanged()
        {
            this.cashRegisterMoves = getEachCashMove(this.selectedStore);
            getDailyReportByDay(this.selectedStore).then( snap => 
            {
                if(snap.exists)
                {
                    this.dailyReportDialog = snap.data();
                }
                else
                {
                    this.dailyReportDialog = {};
                }
            }); 
            this.dailySalesDialog = getTotalAmountByDay(this.dateStr,this.selectedStore);
        },
        saveCashRegister()
        {
            console.log(this.cashRegister);
            console.log(this.cashDescription);
            console.log(this.radioOption);
            setCashRegister(this.store, this.cashRegister, this.cashDescription, this.radioOption);
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
    font-size: 14px !important;
    color: white !important;
    background: lightslategray;
    text-align: center !important;
    justify-content: center !important;
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