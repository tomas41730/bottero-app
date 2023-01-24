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
        <v-data-table :headers="transferHeaders" :sort-by="['transferId']" :sort-desc="[true]" :items="this.transfers" :search="search" item-key="name" class="elevation-1">
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
                        <v-col cols="12" sm="4" md="4">
                            <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                        </v-col>
                    </v-row>
                </v-toolbar>
            </template>
            <template v-slot:[`item.sent`]="{ item }">
                <v-icon color="green" v-if="item.sent">mdi-check-circle</v-icon> 
                <v-icon color="red" v-else>mdi-close-circle</v-icon>
            </template> 
            <template v-slot:[`item.received`]="{ item }">
                <v-icon color="green" v-if="item.received">mdi-check-circle</v-icon> 
                <v-icon color="red" v-else>mdi-close-circle</v-icon>
            </template> 
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn small color="primary" class="mr-2" @click="viewTransfer(item)">
                    ver 
                    <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-dialog fullscreen persistent v-model="dialog" max-width="1200" transition="dialog-bottom-transition" :retain-focus="false">
                    <v-card>
                        <v-row>
                            <v-col align="center" justify="center" cols="12" sm="12" md="12">
                                <v-data-table locale="es-BO" :items-per-page="5" :headers="headersTransferOrder" :items="transferOrder" :search="search" sort-by="name" class="elevation-1">
                                    <template v-slot:top>
                                        <v-card>
                                            <v-toolbar dark color="black">
                                                <v-btn icon dark @click="dialog = false">
                                                <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                                <v-toolbar-title class="text-h4" v-text="'Traspaso #' + transferInfo.transferId +' solicitado el día: ' + transferDate"></v-toolbar-title>
                                                <v-icon color="green" v-if="transferInfo.finished">mdi-check-circle</v-icon> 
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
                                        <v-simple-checkbox v-if="transferInfo.destiny == store" :disabled="item.received" v-ripple color="primary" v-model="item.selected"></v-simple-checkbox> 
                                        <v-simple-checkbox v-else :disabled="item.sent" v-ripple color="primary" v-model="item.selected"></v-simple-checkbox> 
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-btn v-if="transferInfo.destiny == store" block color="primary" @click="receiveSelectedProducts"> Recibir productos seleccionados </v-btn>
                            <v-btn v-else block color="primary" @click="sendSelectedProducts"> Enviar productos seleccionados </v-btn>
                            <!-- <v-btn block color="primary" @click="selectAll"> Seleccionar todos </v-btn> -->
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title class="text-h4">INFORMACIÓN DE TRASPASO</v-toolbar-title>
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
                                                <div class="text-h4">{{ transferInfo.transferStores }}</div>
                                                <div class="text-h4">{{ transferInfo.destiny }}</div>
                                                <div class="text-h4">{{ transferInfo.quantity }}</div>
                                                <v-icon color="green" v-if="transferInfo.finished">mdi-check-circle</v-icon> 
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
                                <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
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
                                                <v-btn v-if="transferInfo.store == store" @click="confirmReceive" dark color="primary">Confirmar Recepcion</v-btn>
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
import { addProduct, getProductByIdShoeAndStore } from '../services/firestore/FirebaseProducts2';
import { getEachTransfer1, getEachTransferByID, updateFinishedTransfer, updateTransfer } from '../services/firestore/FirebaseTransfers';

export default {
    data: ()  => 
    ({
        transfers: [],
        transferOrder: [],
        editedItem: {},
        transferInfo: {},
        store: '',
        transferHeaders: [
            { text: 'Acciones', value: 'actions' },
            { text: 'ID', value: 'transferId' },
            { text: 'Fecha', value: 'date' },
            { text: 'Procedencia', value: 'store' },
            { text: 'Destino', value: 'destiny' },
            { text: 'Codigo de Barras', value: 'idShoe' },
            { text: 'Referencia', value: 'reference' }, 
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },    
            { text: 'Pares', value: 'itemQuantity' },
            { text: 'Enviado', value: 'sent' },
            { text: 'Recibido', value: 'received' },
        ],
        headersTransferOrder: [
            { text: 'Acciones', value: 'actions' },
            { text: 'Fecha', value: 'date' },
            { text: 'Procedencia', value: 'store' },
            { text: 'Destino', value: 'destiny' },
            { text: 'Codigo de Barras', value: 'idShoe' },
            { text: 'Referencia', value: 'reference' }, 
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },    
            { text: 'Pares', value: 'quantity' },
            { text: 'Enviado', value: 'sent' },
            { text: 'Recibido', value: 'received' },
            { text: '', value: 'selected' },
        ],
        dialog: false,
        dialogInfo: false,
        payDialog: false,
        search: '',
        transferDate: '//',
        seller: null,
        counter: 0,
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
            this.transfers = getEachTransfer1();
            this.store = this.$store.state.userStore;
        },
        viewTransfer(item)
        {
            this.store = this.$store.state.userStore;
            this.transferInfo = item;
            console.log(this.transferInfo);
            console.log(this.store);
            this.transferDate = item.date;
            this.dialog = true;
            this.search = item.date;
            this.transferOrder = getEachTransferByID(item.id);
            console.log(this.transferOrder.destiny == this.store);
        },
        disabledButton()
        {
            this.transferOrder.forEach( doc => 
            {
                if(doc.selected)
                {
                    this.counter++;
                }
            });
            return this.counter;
        },
        confirmSent()
        {

        },
        sendSelectedProducts()
        {
            // this.payDialog = true;
            console.log(this.disabledButton());
            if(this.disabledButton() >= 1)
            {
                this.transferOrder.forEach( doc => 
                {
                    console.log(doc);
                    if(!doc.sent)
                    {
                        doc.dateSent = null;
                        doc.timeSent = null;
                        doc.seller = null;
                        doc.dateReceived = null;
                        doc.timeReceived = null;
                        doc.receivedBy = null;
                        doc.sent = false;
                        if(doc.selected )
                        {
                            doc.sent = true;
                            doc.dateSent = new Date().toLocaleDateString('es-BO');
                            doc.timeSent = new Date().toLocaleTimeString('es-BO');
                            doc.selected = false;
                            doc.seller = this.seller;
                        }
                        
                        getProductByIdShoeAndStore(doc.idShoe, doc.store).then( snap => 
                        {
                            if(snap.exists)
                            {
                                let shoe = snap.data();
                                shoe.stock = doc.quantity;
                                shoe.store = doc.destiny;
                                shoe.id = shoe.store + '-' + doc.idShoe;//Consultar si se debe restar el stock al momento de hacer el traspaso o si al momento de enviar el calzado
                                addProduct(shoe);
                            }
                            else
                            {
                                console.log('Producto no encontrado.')
                            }
                        });
                    }
                });
                console.log(this.transferOrder);
                updateTransfer(this.transferInfo, this.transferOrder);
                
                this.transfers.filter(item => item.id == this.transferInfo.id).forEach( doc => 
                {
                    this.transferOrder.filter(doc1 => doc1.idShoe == doc.idShoe).forEach( prod => 
                    {
                        doc.sent = prod.sent;
                    });
                });
            }
            else
            {
                createAlert2('Debe seleccionar al menos un producto para enviar.', 'error');
            }
        },
        receiveSelectedProducts()
        {
            if(this.disabledButton() >= 1)
            {
                this.transferOrder.forEach( doc => 
                {
                    if(doc.sent && doc.selected)
                    {
                        doc.received = true;
                        doc.dateReceived = new Date().toLocaleDateString('es-BO');
                        doc.timeReceived = new Date().toLocaleTimeString('es-BO');
                        doc.selected = false;
                        doc.receivedBy = 'worker';
                    }
                    this.transferInfo.finished =  this.transferInfo.finished + doc.received;
                    updateFinishedTransfer(this.transferInfo.id, this.transferInfo.finished);
                });
                console.log('component:');
                console.log(this.transferOrder);
                updateTransfer(this.transferInfo, this.transferOrder);
                this.transfers.filter(item => item.id == this.transferInfo.id).forEach( doc => 
                {
                    this.transferOrder.filter(doc1 => doc1.idShoe == doc.idShoe).forEach( prod => 
                    {
                        doc.received = prod.received;
                    });
                });
            }
            else
            {
                createAlert2('Debe seleccionar al menos un producto para recibir.', 'error');
            }
        },
        confirmReceive()
        {

        },
        selectAll()
        {
            this.transferOrder.forEach( doc => 
            {
                console.log(doc)
                doc.selected = true;
            });
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