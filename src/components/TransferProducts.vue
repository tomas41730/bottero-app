<template>
    <v-container fluid >
        <template>
            <v-dialog v-model="dialogInfo" max-width="500px">
                <v-card>
                    <v-toolbar color="black" dark> Informacion del producto: {{ editedItem.id }}
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
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogInfo = false">Salir</v-btn>
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
                                <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
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
                <v-toolbar dark color="black" class="mb-1">
                    <v-toolbar-title>
                        DETALLE DE TRASPASO
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
                                    <v-btn class="mx-2" fab x-small dark color="green" @click="addItem(item)">
                                        <v-icon dark>mdi-plus</v-icon>
                                    </v-btn>
                                </v-row>
                                </v-col>
                            </v-card-actions>
                        </v-row>
                        <v-list-item-title class="text-h5 mb-1"> <p> {{ item.price + ' Bs.'}} </p></v-list-item-title>
                    </v-list-item-content>
                    <v-avatar class="profile" tile size="120" color="grey"><v-img :src="item.photo"></v-img></v-avatar>

                    

                    </v-list-item>
                    </v-list>
                </v-card>              
                <v-footer padless>
                    <v-col class="text-center" cols="12">
                        <h2>Total pares de calzados: </h2>
                        <h1><strong>{{ total - totalDiscount }}</strong></h1>
                        <v-btn v-if="this.total > 0" class="mx-2" x-large dark color="primary" @click="checkout">
                            Checkout
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
                                            <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                            <v-toolbar-title>LISTA DE MERCADERIA A TRASPASAR</v-toolbar-title>
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
                                            DETALLE DE TRASPASO
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
                                            <v-form ref="form" lazy-validation>
                                                <v-row>
                                                    <v-col>
                                                        <v-select v-model="store" :items="stores" label="Sucursal" :rules="[v => !!v || 'Debe asignar una sucursal.']" required :disabled="getPermission"></v-select>
                                                    </v-col>
                                                </v-row>
                                                <h2>Total pares de calzados: </h2>
                                                <h1><strong>{{ total - totalDiscount }}</strong></h1>
                                                <v-btn v-if="this.total > 0" class="mx-2" x-large color="primary" @click="saveSale">
                                                    solicitar traspaso
                                                </v-btn>
                                            </v-form>
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
import { getStoresNames } from '../services/firestore/FirebaseStores';
import { addTransfer } from '../services/firestore/FirebaseTransfers';
export default 
{
    data: () => 
    ({
        // products: getProductsByStore('Heroinas'),
        
        products: [],
        stores: getStoresNames(),
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
            { text: 'Sucursal', value: 'store' },
            { text: 'Precio', value: 'price' },
            { text: 'Marca', value: 'brand' },
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
        itemDiscount: null,
        totalDiscount: 0,
        store: '',
        idShoe: ''
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

        created () 
        {
        this.initialize();
            

        },

        methods: 
        {
        initialize () 
        {
            this.store = this.$store.state.userStore;
        },
        addItem(item)
        {
            this.store = this.$store.state.userStore;
            if(item.store != this.store)
            {
                const itemIndex = this.saleOrder.findIndex( tmp => tmp.id ===  item.id);
                this.total = 0;
                this.verifyAndAddItem(itemIndex, item);
                this.saleOrder.forEach( doc => 
                {
                    this.total = this.total + doc.quantity;
                });
            }
            else
            {
                createAlert('Para realizar el traspaso debes escoger una sucursal diferente a la actual (' + this.store + ').', 'error')
            }
        },
        verifyAndAddItem(itemIndex, item)
        {
            if (itemIndex > -1)
            {
                if ((item.quantity + 1) <= item.stock) 
                {
                    item.quantity = parseInt(item.quantity) + 1;
                    Object.assign(this.saleOrder[itemIndex], item);
                }
                else
                {
                    createAlert('Stock insuficiente!', 'error');
                }
            }
            else
            {
                item.quantity = 1;
                if (item.quantity <= item.stock) 
                {
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
            // let msg = 'Información del producto\n';
            // let description = 'Cod. Barras: ' + item.idShoe + '\n' 
            //                 + 'Referencia: ' + item.reference + '\n'
            //                 + 'Marca: ' + item.brand + '\n'
            //                 + 'Color: ' + item.color + '\n'
            //                 + 'Material: ' + item.material + '\n'
            //                 + 'Talla: ' + item.size + '\n'
            //                 + 'Condición: ' + item.condition + '\n'
            //                 + 'Precio: ' + item.price + ' Bs.\n'
            //                 + 'Sucursal: ' + item.store + '\n'
            //                 + 'Observación: ' + item.observation + '\n';
            // showImage(item, msg, description);
            this.dialogInfo = true;
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
            if (item.quantity < 1)
            {
                this.saleOrder.splice(itemIndex, 1);
            }
            else
            {
                Object.assign(this.saleOrder[itemIndex], item);
            }
            this.saleOrder.forEach( doc => {
            this.total = this.total + doc.quantity;
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
            console.log(this.saleOrder)
            this.dialog = true;
            this.store = this.$store.state.userStore;
        },
        saveSale()
        {
            if(this.$refs.form.validate())
            {
                //this.store = this.$store.state.userStore;
                addTransfer(this.saleOrder, this.store, this.total);
                this.dialog = false;
                this.saleOrder = [];
                this.totalDiscount = 0;
                this.total = 0;
                this.products = [];
            }
        },
        async filterProducts()
        {
          console.log(this.idShoe)
          this.products = await getPorductsByCustomFilter(['idShoe','reference','brand','store'],this.idShoe);
        }
        // isMobile() {
        // if(/Android|webOS|iPhone|Opera Mini/i.test(navigator.userAgent)) {
        //     return true
        // } else {
        //     return false
        // }
//  }
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
   font: 15px Arial Black;
}
</style>
