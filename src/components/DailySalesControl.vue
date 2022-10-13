<template>
    <v-container fluid>
        <template>
            <v-dialog v-model="dialogInfo" max-width="500px">
                <v-card>
                    <v-toolbar color="black" dark> 
                        <v-btn icon dark @click="dialogInfo = false; discountClick = true">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        ID del Producto: {{ editedItem.id }}
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
        <v-row>
            <v-toolbar dark color="black" class="mb-2">
                <v-row>
                    <v-col>
                        <v-toolbar-title v-text="'VENTAS DEL DIA: ' + dateStr" class="text-h3"></v-toolbar-title>
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
                            {{ totalAmount.toString() }} Bs.
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
                            0 Bs.
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
                            0 Bs.
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
                            0 Bs.
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
                                <v-select small flat solo-inverted hide-details @change="onStoreChanged" v-model="store" :items="stores" :readonly="getPermission" label="Sucursal"></v-select>
                            </v-col>
                            <v-col>
                                <v-menu v-model="menu" :close-on-content-click="false" max-width="290">
                                    <template v-slot:activator="{ on, attrs }"> 
                                        <v-text-field small flat solo-inverted hide-details :value="computedDateFormattedDatefns" prepend-inner-icon="mdi-calendar" label="Fecha" readonly v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" @change="onDateChanged" :readonly="getPermission"></v-date-picker>
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
import { getStoresNames } from '../services/firestore/FirebaseStores';
import { getEachSale1, getTotalAmountByDay } from '../services/firestore/FirebaseSales';
import { getProductByIdShoeAndStore } from '../services/firestore/FirebaseProducts2';
import { format, parseISO } from 'date-fns';

export default {
    data: ()  => 
    ({
        expanded: [],
        singleExpand: false,
        sales: [],
        stores: [],
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
            { text: 'Codigo', value: 'idSale' },
            { text: 'Referencia', value: 'reference' },
            { text: 'Precio', value: 'itemPrice' },
            { text: 'Pares', value: 'itemQuantity' },
            { text: 'Descuentos', value: 'itemDiscount' },
            { text: 'Total', value: 'finalPrice' },
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
        cashDescription: '',

        // nuevas variables
        totalAmount: 0,
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
        getPermission()
        {
            return  this.$store.state.userRole != 'Admin';
        }
        // getIncomeTitle()
        // {
        //     return this.dailySales.reduce((partialSum, a) => partialSum + a, 0);
        // },
        // getTotalTitle()
        // {
        //     return (parseInt(this.dailySales.reduce((partialSum, a) => partialSum + a, 0)) + parseInt(this.dailyReport.cash) - parseInt(this.dailyExpenses.reduce((partialSum, a) => partialSum + a, 0))).toString();
        // },
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
            this.stores = getStoresNames();
            this.sales = getEachSale1(this.store, this.dateStr);
            // this.dailySales = getTotalAmountByDay(this.store, this.dateStr);
            // getDailyReportByDay(this.store).then( snap => 
            // {
            //     if(snap.exists)
            //     {
            //         this.dailyReport = snap.data();
            //     }
            //     else
            //     {
            //         this.dailyReport = {};
            //     }
            // });
            getTotalAmountByDay(this.store, this.dateStr).then( snap => 
            {
                if(!snap.empty)
                {
                    snap.docs.forEach( doc => 
                    {
                        this.totalAmount += doc.data().total;
                        // console.log(doc.data().total);
                    });
                }
            });
        },
        async viewSale(item)
        {
            this.dialogInfo = true;
            console.log(item.idShoe);
            await getProductByIdShoeAndStore(item.idShoe, item.store).then( doc => 
            {
                if(doc.exists)
                {
                    Object.assign(this.editedItem, doc.data());
                }
                else
                {
                    console.log('No existe');
                }
            });
        },
        onStoreChanged()
        {
            let dateAux = this.date ? format(parseISO(this.date), 'd/M/yyyy') : '';
            this.sales = getEachSale1(this.store, dateAux);
            getTotalAmountByDay(this.store, dateAux).then( snap => 
            {
                if(!snap.empty)
                {
                    snap.docs.forEach( doc => 
                    {
                        this.totalAmount += doc.data().total;
                        console.log(this.totalAmount);
                    });
                }
                else
                {
                    console.log("No existen ventas")
                }
            });
        },
        onDateChanged()
        {
            let dateAux = this.date ? format(parseISO(this.date), 'd/M/yyyy') : '';
            this.sales = getEachSale1(this.store, dateAux);
            getTotalAmountByDay(this.store, dateAux).then( snap => 
            {
                if(!snap.empty)
                {
                    snap.docs.forEach( doc => 
                    {
                        this.totalAmount += doc.data().total;
                        console.log(this.totalAmount);
                    });
                }
                else
                {
                    console.log("No existen ventas")
                }
            });
        },
        onRadioButtonChanged()
        {

        },
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