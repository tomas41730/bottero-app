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
        <v-toolbar dark color="black" class="mb-1">
            <v-col>
                <v-row>
                    <v-col>
                        <v-toolbar-title v-text="'Control de Inventarios - ' + this.store" class="text-h3"></v-toolbar-title>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
            </v-col>
        </v-toolbar>
        <v-toolbar dark color="black">
                <v-row>
                    <v-col md="4" sm="12">
                        <v-toolbar-title v-text="'Contador: ' + this.counter" class="text-h4"></v-toolbar-title>
                    </v-col>
                    <v-col md="4" sm="12">
                        <v-btn color="primary" @click="counter = 0">reiniciar</v-btn>
                    </v-col>
                    <v-col md="4" sm="12">
                        <v-btn color="primary" block @click="dialogStore = true">Cambiar Sucursal</v-btn>
                    </v-col>
                </v-row>
        </v-toolbar>
        <v-toolbar dark color="black">
            <v-row>
                <v-col md="4" sm="12">
                    <v-text-field v-model="idShoeSearch" clearable flat solo-inverted hide-details @input="onIdShoeChanged" label="Codigo de Barras"></v-text-field>
                </v-col>
                <v-col md="4" sm="12">
                    <v-select v-model="conditionSearch" :items="conditions" clearable flat solo-inverted hide-details label="Condicion"></v-select>
                </v-col>
                <v-col md="4" sm="12">
                    <v-btn color="primary" block @click="addProduct">Agregar</v-btn>
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
                    <template v-slot:[`item.diference`]="{ item }">
                        <v-chip color="green" v-if="item.diference == 0" dark> {{ item.diference }} </v-chip> 
                        <v-chip color="red" v-else dark> {{ item.diference }} </v-chip>
                    </template> 
                    <template v-slot:[`item.actions`]>
                        <v-btn fab dark x-small color="error" @click="removeOneProductStock">
                            <v-icon dark>
                                mdi-minus
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
import { createAlert } from '../services/Alerts';
import { getProductsByStore } from '../services/firestore/FirebaseProducts2';
import { getStoresNames } from '../services/firestore/FirebaseStores';
export default 
{
    data: () => 
    ({
        counter: 0,
        products: [],
        auxProducts: [],
        stores: [],
        conditions: [],
        store: ' ',
        idShoeSearch: '',
        conditionSearch: '',
        dialogStore: true,
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
            { text: 'Stock', value: 'stock' },    
            { text: 'Control Stock', value: 'auxStock' },
            { text: 'Diferencia', value: 'diference' },
        ],
        fab: false,
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
            if(this.store != '')
            {
                this.dialogStore = false;
                this.products = getProductsByStore(this.store);
            }
            else
            {
            createAlert('Debe elegir una sucursal!', 'error');
            }
        },
        onIdShoeChanged()
        {
            this.conditions = [];
            console.log(this.idShoeSearch);
            this.products.forEach( doc => 
            {
                if(doc.idShoe == this.idShoeSearch)
                {
                    this.conditions.push(doc.condition);
                }
            });
        },
        addProduct()
        {
            this.counter++;
            const itemIndex = this.auxProducts.findIndex(item => item.idShoe == this.idShoeSearch && item.condition == this.conditionSearch)
            if(itemIndex > -1)
            {
                this.auxProducts[itemIndex].auxStock++;
                this.auxProducts[itemIndex].diference = this.auxProducts[itemIndex].auxStock - this.auxProducts[itemIndex].stock;
            }
            else
            {
                this.products.forEach( doc => 
                {
                    if(doc.idShoe == this.idShoeSearch && doc.condition == this.conditionSearch)
                    {
                        doc.auxStock++;
                        doc.diference = doc.auxStock - doc.stock;
                        this.auxProducts.push(doc);
                    }
                });
            }
        },
        removeOneProductStock()
        {
            this.counter--;
            const itemIndex = this.auxProducts.findIndex(item => item.idShoe == this.idShoeSearch && item.condition == this.conditionSearch)
            if(itemIndex > -1)
            {
                this.auxProducts[itemIndex].auxStock--;
                this.auxProducts[itemIndex].diference = this.auxProducts[itemIndex].auxStock - this.auxProducts[itemIndex].stock;
            }
            else
            {
                this.products.forEach( doc => 
                {
                    if(doc.idShoe == this.idShoeSearch && doc.condition == this.conditionSearch)
                    {
                        doc.auxStock--;
                        doc.diference = doc.auxStock - doc.stock;
                        this.auxProducts.push(doc);
                    }
                });
            }
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