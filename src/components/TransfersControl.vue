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
        <v-data-table :headers="saleHeaders" :items="this.sales" :search="search" item-key="name" class="elevation-1">
            <template v-slot:top>
                <v-toolbar dark color="black" class="mb-1">
                    <v-row>
                        <v-col>
                            <v-toolbar-title class="text-h3">TRASPASOS - {{ getStore }}</v-toolbar-title>
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
            <template v-slot:[`item.completed`]="{ item }">
                <v-icon color="green" v-if="item.completed">mdi-check-circle</v-icon> 
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
                                                <v-toolbar-title class="text-h4" v-text="'Traspaso solicitado el día: ' + saleDate"></v-toolbar-title>
                                                <v-icon color="green" v-if="saleInfo.completed">mdi-check-circle</v-icon> 
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
                                    <template v-slot:[`item.sent`]="{ item }">
                                        <v-icon color="green" v-if="item.sent">mdi-check-circle</v-icon> 
                                        <v-icon color="red" v-else>mdi-close-circle</v-icon>
                                    </template> 
                                     <template v-slot:[`item.received`]="{ item }">
                                        <v-icon color="green" v-if="item.received">mdi-check-circle</v-icon> 
                                        <v-icon color="red" v-else>mdi-close-circle</v-icon>
                                    </template> 
                                    <template v-slot:[`item.selected`]="{ item }">
                                        <v-simple-checkbox v-if="saleInfo.store == store" :disabled="item.received" v-ripple color="primary" v-model="item.selected"></v-simple-checkbox> 
                                        <v-simple-checkbox v-else :disabled="disabledItem(item)" v-ripple color="yellow" v-model="item.selected"></v-simple-checkbox> 
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-btn v-if="saleInfo.store == store" block color="primary" @click="receiveSelectedProducts"> Recibir productos seleccionados </v-btn>
                            <v-btn v-else block color="primary" @click="sendSelectedProducts"> Enviar productos seleccionados </v-btn>
                            
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title class="text-h4">INFORMACIÓN DE RESERVA</v-toolbar-title>
                                    </v-toolbar>
                                    <v-col>
                                        <v-row>
                                            <v-col justify="center" align="right" md="7">
                                                <div class="text-h4">Sucursales: </div>
                                                <div class="text-h4">Destino: </div>
                                                <div class="text-h4">Cantidad: </div>
                                                <div class="text-h4">Traspaso Completado: </div>
                                            </v-col>
                                            <v-divider vertical></v-divider>
                                            <v-col justify="center" md="3">
                                                <div class="text-h4">{{ saleInfo.stores }}</div>
                                                <div class="text-h4">{{ saleInfo.store }}</div>
                                                <div class="text-h4">{{ saleInfo.quantity }}</div>
                                                <v-icon color="green" v-if="item.completed">mdi-check-circle</v-icon> 
                                                <v-icon color="red" v-else>mdi-close-circle</v-icon>
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
                                Traspasos - {{ getStore }}
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
                                            <v-row cols="2" sm="2" md="2">
                                                <v-text-field v-model="seller" label="Encargado"></v-text-field>
                                            </v-row>
                                            <v-row>
                                                <v-btn v-if="saleInfo.store == store" @click="confirmReceive" dark color="primary">Confirmar Recepcion</v-btn>
                                                <v-btn v-else @click="confirmSent" dark color="primary">Realizar Traspaso</v-btn>
                                            </v-row>
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
// import { createAlert2 } from '../services/Alerts';
import { getCustomerByCi } from '../services/firestore/FirebaseCustomers';
import { getProductById } from '../services/firestore/FirebaseProducts';
import { getTransfers, updateTransfer } from '../services/firestore/FirebaseTransfers';

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
            { text: 'Fecha', align: 'start', sortable: true, value: 'date' },
            { text: 'Destino', value: 'store' },
            { text: 'Sucursales', value: 'tranferStores' },
            { text: 'Total de Pares', value: 'quantity' },
            { text: 'Completado', value: 'completed' },
            
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
            { text: 'Destino', value: 'destiny' },
            { text: 'Cantidad', value: 'quantity' },
            { text: 'Cod. Traspaso', value: 'transferId' },
            { text: 'Enviado', value: 'sent' },
            { text: 'Recibido', value: 'received' },
            { text: '', value: 'selected' },
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
        seller: null
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
            this.sales = getTransfers();
            console.log(this.sales);
        },
        
        viewSale(item)
        {
            this.saleOrder = []
            this.dialog = true;
            this.saleInfo = item;
            this.saleDate = item.date;
            item.transfer.forEach( prod => 
            {
                getProductById(prod.id).then( doc => 
                {
                    if(doc.exists)
                    {
                        let product = {...doc.data(), 
                        quantity: prod.quantity, 
                        destiny: prod.destiny, 
                        transferId: item.transferId, 
                        sent: prod.sent, 
                        received: prod.received, 
                        selected: prod.selected,
                        dateSent: prod.dateSent,
                        timeSent: prod.timeSent,
                        dateReceived: prod.dateReceived,
                        timeReceived: prod.timeReceived,
                        seller: prod.seller,
                        receivedBy: prod.receivedBy,
                         }
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
        disabledItem(item)
        {
            this.store = this.$store.state.userStore;
            if(item.store == this.store && item.sent == false)
            {
                return false;
            } 
            return true;
        },
        closeDialog()
        {
            console.log("Clooooooooooooooooooseeeee");
            this.dialog = false;
        },
        sendSelectedProducts()
        {
            let isAllSent = this.isAllSent()
            this.store = this.$store.state.userStore;
            if(isAllSent)
            {
                createAlert2('Ya enviaste todos los productos posibles para este traspaso.', 'success');
            }
            else
            {
                this.payDialog = true;
            }
           
        },
        receiveSelectedProducts()
        {
            let isAllReceived = this.isAllReceived()
            this.store = this.$store.state.userStore;
            if(isAllReceived)
            {
                createAlert2('Ya recibiste todos los productos posibles para este traspaso.', 'success');
            }
            else
            {
                this.payDialog = true;
            }
            console.log(this.saleOrder);
        },
        isAllSent()
        {
            this.store = this.$store.state.userStore;
            let isAllSent = true;
            this.saleOrder.forEach( doc => {
                if(doc.store == this.store)
                {
                    isAllSent = isAllSent && doc.sent;
                }
            });
            console.log('isAllSent: ' + isAllSent)
            return isAllSent;
        },
        isAllReceived()
        {
            let isAllReceived = true;
            this.saleOrder.forEach( doc => {
                if(doc.sent)
                {
                    isAllReceived = isAllReceived && doc.received;
                }
            });
            console.log('isAllSent: ' + isAllReceived)
            return isAllReceived;
        },
        confirmSent()
        {
            
            // let pay = { date: new Date().toLocaleDateString('es-BO'), time: new Date().toLocaleTimeString('es-BO'), seller: this.seller, payment: this.payment, store: this.store }
            // this.saleInfo.paymentHistory.push(pay);
            this.payDialog = false;
            
            // this.saleInfo = {};

            this.saleOrder.forEach( doc => {
                if(!doc.sent)
                {
                    doc.dateSent = null;
                    doc.timeSent = null;
                    doc.seller = null;
                    doc.dateReceived = null;
                    doc.timeReceived = null;
                    doc.receivedBy = null;
                    if(doc.selected )
                    {
                        doc.sent = true;
                        doc.dateSent = new Date().toLocaleDateString('es-BO');
                        doc.timeSent = new Date().toLocaleTimeString('es-BO');
                        doc.selected = false;
                        doc.seller = this.seller;
                    }
                }
            });
            console.log(this.saleOrder);
            updateTransfer(this.saleInfo, this.saleOrder);
            this.saleInfo.transfer = this.saleOrder;
            const indexSale = this.sales.indexOf(item => item.id = this.saleInfo.id);
            this.sales[indexSale] = this.saleInfo;
        },
        confirmReceive()
        {
            
            this.payDialog = false;
            this.saleOrder.forEach( doc => {
                if(doc.sent && doc.selected)
                {
                    doc.received = true;
                    doc.dateReceived = new Date().toLocaleDateString('es-BO');
                    doc.timeReceived = new Date().toLocaleTimeString('es-BO');
                    doc.selected = false;
                    doc.receivedBy = this.seller;
                    console.log(doc)
                }

            });
            console.log(this.saleOrder);
            updateTransfer(this.saleInfo, this.saleOrder)
            this.saleInfo.transfer = this.saleOrder;
            const indexSale = this.sales.indexOf(item => item.id = this.saleInfo.id);
            this.sales[indexSale] = this.saleInfo;
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