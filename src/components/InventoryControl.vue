<template>
    <v-card>
        <v-dialog v-model="getPermission" max-width="600px" persistent>
            <v-card>
                <v-card-title>
                    No cuenta con los permisos necesarios para esta sección
                </v-card-title>
                <v-col align="center" justify="center">  
                    <v-container bg fill-height grid-list-md text-xs-center>
                    <v-layout row wrap align-center>
                        <v-flex>
                            <v-list-item-avatar tile size="300">
                                <v-img :src="imgDenied"></v-img>
                            </v-list-item-avatar>
                        </v-flex>
                    </v-layout>
                </v-container>
                </v-col>
                <v-card-actions>
                    <v-btn color="primary" depressed block to="/">
                    Volver al menu principal
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogStore" max-width="350px" persistent>
            <v-toolbar color="black" dark>
                MÓDULO DE INVENTARIO
                <v-spacer></v-spacer>
                <v-list-item-avatar  max-width="70px">
                <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
                </v-list-item-avatar>
            </v-toolbar>
            <v-card>
                <v-card-title>
                    ¿En qué sucursal se encuentra?
                </v-card-title>
                <v-card-text>
                    <v-select :items="stores" :rules="[v => !!v || 'Debe asignar una sucursal.']" label="Sucursal" v-model="store"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" text @click="closeDialogStore">
                    Continuar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog persistent v-model="dialogBlocks" max-width="1000px" transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="black" class="mb-6">
                    <v-btn icon x-large dark @click="dialogBlocks = false">
                    <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title class="text-h3">REGISTROS</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table :headers="headersGlobProds" :items="globProducts" class="elevation-1">
                                <template v-slot:top>
                                    <v-toolbar dark color="black">
                                        <v-row>
                                            <v-col md="6" sm="12">
                                                <v-toolbar-title>BLOQUES REGISTRADOS</v-toolbar-title>
                                            </v-col>
                                            <v-col md="6" sm="12">
                                                <v-toolbar-title v-text="'Global: ' + globCounter" class="text-h5"></v-toolbar-title>
                                            </v-col>
                                        </v-row>
                                    </v-toolbar>
                                    <v-divider></v-divider>
                                </template>   
                                <template v-slot:no-data>
                                    <v-btn color="primary" @click="initialize">
                                        Reset
                                    </v-btn>
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-btn fill dark medium color="primary" @click="addBlock(item)">
                                        VER
                                        <v-icon small>mdi-eye</v-icon>
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table :headers="headersBlock" :items="block" class="elevation-1">
                                <template v-slot:top>
                                    <v-toolbar dark color="black">
                                        <v-row>
                                            <v-col md="6" sm="12">
                                                <v-toolbar-title>BLOQUES SELECCIONADO</v-toolbar-title>
                                            </v-col>
                                            <v-col md="3" sm="12">
                                                <v-toolbar-title v-text="'Bloque: ' + blockID" class="text-h5"></v-toolbar-title>
                                            </v-col>
                                            <v-col md="3" sm="12">
                                                <v-toolbar-title v-text="'Total: ' + blockTotal" class="text-h5"></v-toolbar-title>
                                            </v-col>
                                        </v-row>
                                    </v-toolbar>
                                    <v-divider></v-divider>
                                </template>  
                                <template v-slot:no-data>
                                    <v-btn color="primary" @click="initialize">
                                        Reset
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-toolbar dark color="black" class="mb-1">
            <v-col>
                <v-row>
                    <v-col>
                        <v-toolbar-title v-text="'Control de Inventarios - ' + this.store" class="text-h3"></v-toolbar-title>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
            </v-col>
            <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn  x-large dark icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon v-text="'mdi-package-variant-closed'"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-title @click="dialogBlocks = true">Bloques Registrados</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-spacer></v-spacer>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon v-text="'mdi-autorenew'"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-title @click="dialogStore = true">Cambiar de Sucursal</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-spacer></v-spacer>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon v-text="'mdi-content-save-all'"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-title @click="saveChanges">Guardar Cambios</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
        </v-toolbar>
        <v-toolbar dark color="black">
                <v-row>
                    <v-col md="4" sm="12">
                        <v-row>
                            <v-toolbar-title v-text="'Global: ' + this.globCounter" class="text-h5"></v-toolbar-title>
                        </v-row>
                        <v-row>
                            <v-toolbar-title v-text="'Bloque actual: ' + this.counter" class="text-h5"></v-toolbar-title>
                        </v-row>
                    </v-col>
                    <v-col md="4" sm="12">
                        <v-btn color="primary" @click="resetCounter">reiniciar</v-btn>
                    </v-col>
                    <v-col md="4" >
                        <v-row>
                            <v-col md="6" sm="12">
                            <v-text-field v-model="globCounter" clearable flat solo-inverted hide-details @change="onIdShoeChanged" label="Codigo de Barras"></v-text-field>
                        </v-col>
                        <v-col md="6" sm="12">
                            <v-text-field v-model="counter" clearable flat solo-inverted hide-details label="Condicion"></v-text-field>
                        </v-col>
                        </v-row>
                    </v-col>
                </v-row>
        </v-toolbar>
        <v-toolbar dark color="black">
            <v-row>
                <v-col md="4" sm="12">
                    <v-text-field v-model="idShoeSearch" clearable flat solo-inverted hide-details @input="onIdShoeChanged" label="Codigo de Barras"></v-text-field>
                </v-col>
                <v-col md="4" sm="12">
                    <v-text-field v-model="conditionSearch" clearable flat solo-inverted hide-details label="Condicion"></v-text-field>
                </v-col>
                <v-col md="4" sm="12">
                    <v-btn color="primary" block @click="addProduct" :disabled="conditionSearch == '' || conditionSearch == 'No Registrado'">Agregar</v-btn>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-row>
            <!--
            <v-col md="6">
                <v-data-table :headers="headers" :items="products" sort-by="name" class="elevation-1">
                </v-data-table> 
            </v-col> -->  
            <v-col md="12">
                <v-data-table :headers="headers2" :items="auxProducts" sort-by="name" class="elevation-1">
                    <template v-slot:[`item.difference`]="{ item }">
                        <v-chip color="green" v-if="item.difference == 0" dark> {{ item.difference }} </v-chip> 
                        <v-chip color="red" v-else dark> {{ item.difference }} </v-chip>
                    </template> 
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn fab dark x-small color="error" @click="removeOneProductStock(item)">
                            <v-icon dark>
                                mdi-minus
                            </v-icon>
                        </v-btn>
                        <v-btn fab dark x-small color="success" @click="addProductBtn(item)">
                            <v-icon dark>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </template>
                </v-data-table> 
            </v-col>
        </v-row>
        <!-- boton flotante
        <v-speed-dial v-model="fab" :top="false" :bottom="true" :left="false" :right="true" :direction="'top'" :open-on-hover="false" :transition="'slide-y-reverse-transition'">
            <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon v-if="fab">
                        mdi-close
                    </v-icon>
                    <v-icon v-else>
                        mdi-account-circle
                    </v-icon>
                </v-btn>
            </template>
            <v-btn fab dark small  color="green">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab dark small color="indigo">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn fab dark small color="red">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-speed-dial> -->          
    </v-card>
</template>
<script>
import { createAlert2/*, notification*/ } from '../services/Alerts';
import { addProduct2, addSubinventory, getProductByIdShoeLast } from '../services/firestore/FirebaseProducts2';
import { getStoresNames } from '../services/firestore/FirebaseStores';
export default 
{
    data: () => 
    ({
        counter: 0,
        globCounter: 0,
        blockTotal: 0,
        blockNum: 1,
        blockID: '',
        products: [],
        auxProducts: [],
        globProducts: [],
        block: [],
        stores: [],
        conditions: [],
        store: ' ',
        idShoeSearch: '',
        conditionSearch: '',
        dialogStore: true,
        dialogBlocks: false,
        imgDenied: "https://library.kissclipart.com/20180829/ute/kissclipart-user-deletion-clipart-computer-icons-user-c7234fb3b6916925.png",
        headers: [
            { text: 'Codigo de Barras', value: 'idShoe' },
            { text: 'Sucursal', value: 'store' },
            { text: 'Condicion', value: 'condition' },
            { text: 'Referencia', value: 'reference' }, 
            { text: 'Stock', value: 'stock' },
            { text: 'Marca', value: 'brand' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },    
            { text: 'Precio', value: 'price' }
        ],
        headers2: [
            { text: 'Quitar', value: 'actions' },
            { text: 'Codigo de Barras', value: 'idShoe' },
            { text: 'Condicion', value: 'condition' }, 
            { text: 'Sucursal', value: 'store' },
            { text: 'Referencia', value: 'reference' },  
            { text: 'Talla', value: 'size' },   
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Marca', value: 'brand' },
            { text: 'Stock', value: 'stock' },    
            { text: 'Control Stock', value: 'auxStock' },
            { text: 'Diferencia', value: 'difference' },
        ],
         headersBlock: [
            { text: 'Codigo de Barras', value: 'idShoe' },
            { text: 'Condicion', value: 'condition' }, 
            { text: 'Sucursal', value: 'store' },
            { text: 'Referencia', value: 'reference' },  
            { text: 'Talla', value: 'size' },   
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Marca', value: 'brand' },
            { text: 'Stock', value: 'stock' }
        ],
        headersGlobProds: [
            { text: 'Acciones', value: 'actions' },
            { text: 'Bloque', value: 'block' },
            { text: 'Total', value: 'total' },
            ],
        fab: false,
        editedItem: null
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
            this.stores = getStoresNames();
        },
        closeDialogStore()
        {
            if(this.store.length != 1)
            {
                this.dialogStore = false;
            }
        },
        onIdShoeChanged1()
        {
            this.conditions = [];
            console.log(this.idShoeSearch);
            this.products.forEach( doc => 
            {
                if(parseInt(doc.idShoe) == parseInt(this.idShoeSearch))
                {
                    this.conditions.push(doc.condition);
                }
            });
        },
        onIdShoeChanged()
        {
            console.log(this.idShoeSearch)
            getProductByIdShoeLast(this.idShoeSearch).then( snap => {
                snap.docs.forEach( doc => {
                    if(doc.exists)
                    {   
                        this.conditionSearch = doc.data().condition;
                        this.editedItem = doc.data();
                        this.editedItem.auxStock = 0;
                        this.editedItem.difference = 0;
                    }
                    else
                    {
                        console.log('No existen coincidencias para el producto: ' + this.idShoeSearch);
                    }
                });
                if (snap.docs.length < 1)
                {
                    this.conditionSearch = 'No Registrado'
                    //notification('http://freesoundeffect.net/sites/default/files/ding-collect-01-sound-effect-88180542.mp3');
                }
                else
                {
                    this.addProduct();
                    this.idShoeSearch = "";
                }
            });
        },
        addProduct()
        {
            this.counter++;
            this.globCounter++;
            const itemIndex = this.auxProducts.findIndex(item => item.idShoe == this.idShoeSearch && item.condition == this.conditionSearch)
            if(itemIndex > -1)
            {
                this.auxProducts[itemIndex].auxStock++;
                this.auxProducts[itemIndex].difference = this.auxProducts[itemIndex].auxStock - this.auxProducts[itemIndex].stock;
                let elem = this.auxProducts.splice(itemIndex, 1);
                this.auxProducts.unshift(elem[0]);
            }
            else
            {
                this.editedItem.auxStock++;
                this.editedItem.difference = this.editedItem.auxStock - this.editedItem.stock;
                this.auxProducts.unshift(this.editedItem);
            }
            console.log(this.editedItem)
        },
        addProductBtn(item)
        {   
            this.counter++;
            this.globCounter++;
            const itemIndex = this.auxProducts.findIndex(doc => doc.idShoe == item.idShoe && doc.condition == item.condition)
            if(itemIndex > -1)
            {
                this.auxProducts[itemIndex].auxStock++;
                this.auxProducts[itemIndex].difference = this.auxProducts[itemIndex].auxStock - this.auxProducts[itemIndex].stock;
                let elem = this.auxProducts.splice(itemIndex, 1);
                this.auxProducts.unshift(elem[0]);
            }
            else
            {
                let prod = null
                this.products.forEach( doc => 
                {
                    
                    if(doc.idShoe == item.idShoe && doc.condition == item.condition)
                    {
                        doc.auxStock++;
                        doc.difference = doc.auxStock - doc.stock;
                        prod = doc;
                        
                    }
                });
                this.auxProducts.unshift(prod);
            }
        },
        removeOneProductStock(item)
        {
            if(this.counter > 0 && this.globCounter > 0)
            {
                this.counter--;
                this.globCounter--;
            }
            const itemIndex = this.auxProducts.findIndex(doc => doc.idShoe == item.idShoe && doc.condition == item.condition)
            if(itemIndex > -1)
            {
                this.auxProducts[itemIndex].auxStock--;
                if (this.auxProducts[itemIndex].auxStock < 1)
                {
                    this.auxProducts.splice(itemIndex, 1);
                }
                else
                {
                    this.auxProducts[itemIndex].difference = this.auxProducts[itemIndex].auxStock - this.auxProducts[itemIndex].stock;
                }
            }
            else
            {
                this.auxProducts.forEach( doc => 
                {
                    
                    if(doc.idShoe == item.idShoe && doc.condition == item.condition)
                    {
                        doc.auxStock--;
                        doc.difference = doc.auxStock - doc.stock;
                        
                    }
                });
            }
        },
        saveChanges()
        {
            addSubinventory(this.auxProducts, this.store);
            let blockObj = { block: this.blockNum, total: this.counter, products: this.auxProducts  };
            this.blockNum++;
            this.globProducts.push(blockObj);
            this.auxProducts.forEach( doc => {
                doc.stock = doc.auxStock;
                doc.store = this.store;
                doc.id = this.store + '-' + doc.idShoe;
                // doc.pDiscount = doc.pDisccount;
                // doc.oDiscount = doc.oDisccount;
                // delete doc.oDisccount;
                // delete doc.pDisccount;
                // delete doc.auxStock;
                // delete doc.difference;
            });

            this.auxProducts.forEach( doc => {
                addProduct2(doc);
            });
            // this.products = [];
            // this.auxProducts.forEach( doc => {
            //     let obj = {
            //         id: this.store + '-' + doc.idShoe,
            //         store: this.store,
            //         condition: doc.condition,
            //         reference: doc.reference,
            //         stockA: doc.auxStock,
            //         stockB: doc.stock,
            //         differece: doc.differece,
            //         size: doc.size,
            //         idShoe: doc.idShoe
            //     }
            //     this.products.push(obj);
            // });
            this.auxProducts = [];
            this.idShoeSearch = '';
            this.conditionSearch = '';
            this.counter = 0;
            createAlert2('Se guardaron los datos correctamente', 'success');
        },
        resetCounter()
        {
            this.globCounter = this.globCounter - this.counter;
            this.counter = 0;
        },
        addBlock(item)
        {
            this.block = item.products;
            this.blockTotal = item.total;
            this.blockID = item.block;
        }
    },
  }
</script>
<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
</style>