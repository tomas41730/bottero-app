<template>
    <v-container grid-list-md>
        <template>
            <v-dialog persistent v-model="dialogInfo" max-width="500px">
                <v-card>
                <v-toolbar color="black" dark>
                    <v-btn icon dark @click="dialogInfo = false; clickDelete = false">
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
                                <v-textarea :readonly="true" v-model="editedItem.description" label="Descripcion" rows="4"></v-textarea>
                            </v-col>
                            <v-col>
                                <v-text-field :readonly="true" v-model="editedItem.reference" label="Referencia"></v-text-field>
                                <v-text-field :readonly="true" v-model="editedItem.color" label="Color"></v-text-field>
                                <v-text-field :readonly="true" v-model="editedItem.condition" label="Condición"></v-text-field>
                                <v-text-field :readonly="true" v-model="editedItem.price" label="Precio Venta"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field :readonly="true" v-model="editedItem.store" label="Sucursal"></v-text-field>
                                <v-text-field :readonly="true" v-model="editedItem.material" label="Material"></v-text-field>
                                <v-text-field :readonly="true" v-model="editedItem.stock" label="Stock" suffix="Bs."></v-text-field>
                                <v-text-field :readonly="true" v-model="editedItem.pDiscount" label="Descuento"></v-text-field>
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
                    <v-btn v-if="clickDelete" color="error" text @click="deleteItem"> ELIMINAR </v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>  
        </template> 
        <v-card>
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
                        <v-flex>
                    </v-flex>
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
            <v-toolbar color="black" dark flat>
                <v-toolbar-title class="text-h3">INVENTARIO - {{ store }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn  x-large dark icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title @click="dialogStore = true">Cambiar de Sucursal</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <template v-slot:extension>
                    <v-tabs v-model="tab" align-with-title>
                        <v-tabs-slider color="yellow"></v-tabs-slider>
                        <v-tab v-for="item in items" :key="item">
                            {{ item }}
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <v-card flat>
                        <v-row>
                            <v-col>
                                <v-form ref="form" lazy-validation :readonly="formDisabled">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                            <v-col>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.idShoe" :rules="attributeRules" label="Codigo de barras" placeholder="Codigo calzado" @input="onIdChanged"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.reference" :rules="attributeRules" label="Referencia" placeholder="Referencia" @input="onRefChanged"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="4">
                                                        <v-autocomplete :items="brands" v-model="editedItem.brand" :rules="attributeRules" label="Marca" placeholder="Marca"></v-autocomplete>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-autocomplete :items="sizes" v-model="editedItem.size" :rules="attributeRules" label="Talla" placeholder="Talla"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-autocomplete :items="colors" v-model="editedItem.color" :rules="attributeRules" label="Color" placeholder="Color"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-autocomplete :items="materials" v-model="editedItem.material" :rules="attributeRules" label="Material" placeholder="Material"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-text-field v-model="editedItem.stock" label="Stock" placeholder="Stock"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="3">
                                                        <v-textarea rows="1" v-model="editedItem.description" :rules="attributeRules" label="Descripcion" placeholder="Descripcion"></v-textarea>
                                                    </v-col>
                                                    <v-col cols="4" sm="6" md="3">
                                                        <v-autocomplete :items="categories" v-model="editedItem.category" :rules="attributeRules" label="Categoria" placeholder="Categoria"></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="4" sm="6" md="3">
                                                        <v-text-field :readonly="true" label="Sucursal" v-model="editedItem.store"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="4" sm="6" md="3">
                                                        <v-autocomplete :items="conditions" v-model="editedItem.condition" :rules="attributeRules" label="Condicion" placeholder="Condicion" @input="onConditionChanged"></v-autocomplete>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-text-field suffix="$us." v-model="editedItem.purchasePrice" label="Precio Costo" placeholder="Precio Costo"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-text-field suffix="Bs." v-model="editedItem.price" label="Precio de Venta" placeholder="Precio"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-text-field suffix="Bs." v-model="editedItem.pDiscount" label="Desc. Limite Bs." placeholder="Desc. Lim. Bs."></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6" sm="6" md="3">
                                                        <v-text-field suffix="%" v-model="editedItem.oDiscount" label="Desc. Ocasional %" placeholder="Desc. Oc. %"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col>
                                                <v-card-actions>
                                                    <v-btn color="primary" depressed elevation="2" @click="save">
                                                    {{ saveBtn }}
                                                    </v-btn>
                                                    <v-btn color="primary" depressed elevation="2" @click="clean" hidden>
                                                    Limpiar
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-col>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-form>  
                            </v-col>
                            <v-col align="center" justify="center">  
                                <v-container bg fill-height grid-list-md text-xs-center>
                                    <v-layout row wrap align-center>
                                        <v-flex>
                                            <v-list-item-avatar tile size="300">
                                                <v-img :src="editedItem.photo"></v-img>
                                            </v-list-item-avatar>
                                            <v-flex>
                                                <template>
                                                    <v-file-input ref="file" accept="image/*" label="Seleccionar imagen del producto" v-model="image" @change="previewImage" @click="choosePhoto" style="display: none"></v-file-input>
                                                </template>
                                                <v-btn x-large color="primary" depressed elevation="2" @click="choosePhoto" block>
                                                    <v-icon large>mdi-image</v-icon>
                                                    ELEGIR IMAGEN DEL CALZADO
                                                </v-btn>
                                            </v-flex>
                                        </v-flex>
                                    
                                    </v-layout>
                                </v-container>
                            </v-col>
                        </v-row>
                        
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-data-table :headers="headers" :items="productsChanges" :search="search" :custom-sort="customSort" multi-sort class="elevation-1">
                            <template v-slot:top>
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Buscar"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-toolbar-title>
                                    </v-toolbar>
                                </v-card>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon color="error" small class="mr-2" @click="openDeleteDialog(item)">
                                mdi-delete
                                </v-icon>
                                <v-icon color="primary" small class="mr-2" @click="viewItem(item)">
                                mdi-eye
                                </v-icon>
                            </template>
                            <template v-slot:no-data>
                                <v-btn  ref="btnReset" color="primary" @click="initialize">
                                Reset
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-data-table :headers="headers" :items="products" :search="search" :custom-sort="customSort" multi-sort class="elevation-1">
                            <template v-slot:top>
                                <v-card>
                                    <v-toolbar dark color="black" class="mb-1">
                                        <v-toolbar-title>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="searchParam" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" @change="onSearchParamChanged" label="Producto"></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Buscar"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-toolbar-title>
                                    </v-toolbar>
                                </v-card>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon color="error" small class="mr-2" @click="openDeleteDialog(item)">
                                mdi-delete
                                </v-icon>
                                <v-icon color="primary" small class="mr-2" @click="viewItem(item)">
                                mdi-eye
                                </v-icon>
                            </template>
                            <template v-slot:no-data>
                                <v-btn  ref="btnReset" color="primary" @click="initialize">
                                Reset
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-col>
                        <v-row>
                            <v-btn color="primary" @click="getQuantitiesByStore" block>
                                Actualizar
                            </v-btn>
                        </v-row>
                        <v-row>
                            <v-col justify="center" align="right" md="6">
                                <div class="text-h4">Heroinas: </div>
                                <div class="text-h4">144: </div>
                                <div class="text-h4">151: </div>
                                <div class="text-h4">Quillacollo: </div>
                                <div class="text-h4">Deposito: </div>
                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col justify="center" md="3">
                                <div class="text-h4">{{ storeInfo.heroinas }}</div>
                                <div class="text-h4">{{ storeInfo.c144 }}</div>
                                <div class="text-h4">{{ storeInfo.c151 }}</div>
                                <div class="text-h4">{{ storeInfo.quillacollo }}</div>
                                <div class="text-h4">{{ storeInfo.deposito }}</div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-tab-item>
            </v-tabs-items>
    </v-card>
    </v-container>  
</template>
<script>
import { createAlert2 } from '../services/Alerts';
import db from '../services/firebase';
import { getColorNames } from '../services/firestore/FirabaseColors';
import { getBrandNames } from '../services/firestore/FirebaseBrands';
import { getCategoryNames } from '../services/firestore/FirebaseCategories';
import { getMaterialNames } from '../services/firestore/FirebaseMaterials';
import { getProductByRef } from '../services/firestore/FirebaseProducts';
import { addProduct, deleteProduct, getPorductsByCustomFilter, getProducts, getProductByIdShoeAndStore } from '../services/firestore/FirebaseProducts2';
import { getSizeNames } from '../services/firestore/FirebaseSizes';
import { getDefaultProductPhoto } from '../services/firestore/FirebaseStorage';
import { getStoresNames } from '../services/firestore/FirebaseStores';
export default 
{
    data: () => 
    ({
        tab: null,
        items: ['Registrar Producto', 'Cambios Recientes','General', 'Calzados por Sucursal'],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: null,
        imgDenied: "https://library.kissclipart.com/20180829/ute/kissclipart-user-deletion-clipart-computer-icons-user-c7234fb3b6916925.png",
        store: '',
        search: '',
        brands : [],
        sizes : [],
        colors: [],
        materials : [],
        categories : [],
        stores: [],
        conditions : [],
        formDisabled: false,
        dialogStore: true,
        editedItem: {
            id: null,
            reference: '',
            idShoe: '',
            due: null,
            brand: '',
            size: '',
            color: '',
            material: '',
            price: null,
            purchasePrice: 0,
            stock: null,
            description: '',
            category: '',
            store: '',
            pDiscount: null,
            oDiscount: 0,
            condition: '',
            photo: '',
            observation: 'Sin Observación'
        },
        defaultItem: {
            id: null,
            reference: '',
            idShoe: '',
            due: null,
            brand: '',
            size: '',
            color: '',
            material: '',
            price: null,
            purchasePrice: 0,
            stock: null,
            description: '',
            category: '',
            store: '',
            pDiscount: null,
            oDiscount: 0,
            condition: '',
            photo: 'https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d',
            observation: 'Sin Observación',
        },
        headers: [
            { text: 'Acciones', value: 'actions', sortable: false },
            { text: 'Fecha', value: 'due' },
            { text: 'Codigo de Barras', value: 'idShoe' },
            { text: 'Referencia', value: 'reference' },
            { text: 'Marca', value: 'brand' },
            { text: 'Talla', value: 'size' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },        
            { text: 'Stock', value: 'stock1' },
            { text: 'Descripcion', value: 'description' },
            { text: 'Categoria', value: 'category' },
            { text: 'Sucursal', value: 'store' },
            { text: 'Condicion', value: 'condition' },
            { text: 'Precio Costo', value: 'purchasePrice' },
            { text: 'Precio', value: 'price' },
            { text: 'Des. Limite Bs.', value: 'pDiscount' },
            { text: 'Des. Ocasional %', value: 'oDiscount' },
            { text: 'Observacion', value: 'observation' },
            { text: 'Fecha para ordenar', value: 'datetime' },
            { text: 'ID', value: 'id' },
        ],
        numberRules: [
            v => !!v || 'Este campo es requerido.',
            v => (v && v.length <= 15) || 'Este campo debe tener 15 números como máximo.',
            v => (/^-?\d+$/.test(v) || /^\d*\.?\d+$/.test(v)) || 'Debe ser un numero.', 
        ],
        attributeRules: [
            v => !!v || 'Este campo es requerido.',
            v => (v && v.length <= 200) || 'Este campo debe tener 200 caracteres como máximo.',
        ],
        saveBtn: 'Agregar',
        idShoeAux: null,
        searchParam: '',
        products: [],
        productsChanges: [],
        dialogInfo: false,
        clickDelete: false,
        auxStock: 0,
        storeInfo: {}
    }),

    computed: 
    {
        getPermission()
        {
            return  this.$store.state.userRole != 'Admin';
        },
        allowUploadPhoto()
        {
            return (this.editedItem.reference != '') && (this.editedItem.color != '') && (this.editedItem.material != '') && (this.editedItem.brand != '');
        },
    },

    watch: 
    {
        dialog (val) 
        {
            val || this.close()
        },
    },

    created () 
    {
        this.initialize()
    },

    methods: 
    {
        initialize()
        {
            this.reset();
            this.getQuantitiesByStore();
        },
        viewItem(item)
        {
            this.editedItem = item;
            this.dialogInfo = true;
        },
        async save()
        {
            let editedIndex = this.products.indexOf(this.editedItem);
            if(this.$refs.form.validate())
            {
                this.editedItem.id = this.editedItem.store + '-' + this.editedItem.idShoe;
                this.editedItem.stock = parseInt(this.editedItem.stock);
                console.log(this.editedItem)
                await addProduct(this.editedItem);
                if (editedIndex > -1)
                {
                    console.log("aux stock: " + this.auxStock);
                    this.products[editedIndex].stock = parseInt(this.products[editedIndex].stock) + this.auxStock;
                    let editedIndex2 = this.productsChanges.indexOf(this.editedItem);
                    if (editedIndex2 > -1 )
                    {
                        this.productsChanges[editedIndex2] = this.products[editedIndex];
                    }
                }
                else
                {
                    this.products.unshift(this.editedItem);
                    this.productsChanges.unshift(this.editedItem);
                }
            }
            else
            {
                createAlert2('Primero debe llenar todos los campos obligatorios', 'error');
            }
            this.editedItem.stock = 0;
            console.log(this.editedItem);
        },
        openDeleteDialog(item)
        {
            this.editedItem = item;
            this.dialogInfo = true;
            this.clickDelete = true;
        },
        deleteItem()
        {
            deleteProduct(this.editedItem.id);
            let editedIndex = this.products.indexOf(this.editedItem);
            if(editedIndex > -1) 
            {
                this.products.splice(editedIndex, 1);
            }
            this.dialogInfo = false;
        },
        // Product Picture Methods
        previewImage()
        {

        },
        choosePhoto()
        {
            if(this.$refs.form.validate())
            {
                this.$refs.file.$refs.input.click()
            }
            else
            {
                createAlert2('Primero debe llenar todos los campos obligatorios', 'error');
            }
        },
        // On TextField Changes Methods
        onIdChanged()
        {
            this.idShoeAux = this.editedItem.idShoe;
            getProductByIdShoeAndStore(this.editedItem.idShoe, this.store).then( doc => 
            {
                if ( doc.exists)
                {
                    this.saveBtn = 'Actualizar';
                    Object.assign(this.editedItem, doc.data());
                    if( doc.data().condition == 'Nuevo')
                    {
                        this.editedItem.condition = 'Normal';
                    }
                    this.auxStock = parseInt(this.editedItem.stock)
                    this.editedItem.stock = 0;
                    this.editedItem.purchasePrice = 0;
                    this.editedItem.oDiscount = 0;
                    console.log(this.editedItem);
                }
                else
                {
                    this.saveBtn = 'Agregar';
                    console.log('Producto no encontrado');
                    console.log(this.editedItem);
                }
            });
            
        },
        onRefChanged()
        {
            console.log(this.editedItem.reference)
            getProductByRef(this.editedItem.reference).then( snap => 
            {
                if (snap.docs.length > 0)
                {
                    snap.docs.forEach( doc => 
                    {
                        Object.assign(this.editedItem, doc.data())
                        this.editedItem.idShoe = this.idShoeAux;
                        this.editedItem.size = null;
                        this.editedItem.color = null;
                        this.editedItem.material = null;
                        this.editedItem.stock = 0;
                        this.editedItem.store = this.store;
                        this.editedItem.purchasePrice = 0;
                        this.editedItem.oDiscount = 0;
                        if( doc.data().condition == 'Nuevo')
                        {
                            this.editedItem.condition = 'Normal';
                        }
                    
                    });
                }
                else
                {
                    console.log('Referencia no encontrada')
                }
            });
        },  
        onConditionChanged()
        {

        },
        async onSearchParamChanged()
        {
            console.log(this.searchParam);
            this.products = await getPorductsByCustomFilter(['idShoe','reference','brand','store'], this.searchParam);
            console.log(this.products)
        },
        // Auxiliary Methods
        clean()
        {
            this.editedItem.idShoe = '';
            this.editedItem.reference = '';
            this.editedItem.brand = '';
            this.editedItem.size = '';
            this.editedItem.color = '';
            this.editedItem.material = '';
            this.editedItem.stock = '';
            this.editedItem.description = '';
            this.editedItem.category = '';
            this.editedItem.condition = '';
            this.editedItem.purchasePrice = 0;
            this.editedItem.price = '';
            this.editedItem.pDiscount = 0;
            this.editedItem.oDiscount = '';
            this.$refs.form.resetValidation();
            this.editedItem.store = this.store;
        },
        reset()
        {
            this.editedItem = this.defaultItem;
            this.products = getProducts();
            this.brands = getBrandNames();
            this.sizes = getSizeNames();
            this.colors = getColorNames();
            this.materials = getMaterialNames();
            this.categories = getCategoryNames();
            this.stores = getStoresNames();
            this.conditions = ['Normal', 'Descuento', 'Oferta', 'Liquidación', 'Fallado']
            getDefaultProductPhoto().then(val => { this.editedItem.photo = val; });
        },
        closeDialogStore()
        {
            if(this.store != '')
            {
                this.editedItem.store = this.store;
                this.dialogStore = false;
                this.defaultItem.store = this.store;
            }
        },
        customSort(items, index, isDesc) 
        {
            items.sort((a, b) => 
            {
                if (index[0]=='due') 
                {
                    if (isDesc[0]) 
                    {
                        return new Date(b[index]) - new Date(a[index]);
                    } 
                    else 
                    {
                        return new Date(a[index]) - new Date(b[index]);
                    }
                }
                else 
                {
                    if(typeof a[index] !== 'undefined')
                    {
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
        },
        getQuantitiesByStore()
        {
            this.storeInfo = { heroinas: 0, c144: 0, c151: 0, quillacollo: 0, deposito: 0};
            db.collection('productsAux').get().then( snap => 
            {
            if(!snap.empty)
            {
                snap.docs.forEach( doc => 
                {
                    if(!isNaN(doc.data().stock))
                    {
                        if(doc.data().store === "Heroinas")
                        {
                        this.storeInfo.heroinas = this.storeInfo.heroinas + parseInt(doc.data().stock);
                        }
                        if (doc.data().store === "144")
                        {
                        this.storeInfo.c144 = this.storeInfo.c144 + parseInt(doc.data().stock);
                        }
                        if (doc.data().store === "151")
                        {
                        this.storeInfo.c151 = this.storeInfo.c151 + parseInt(doc.data().stock);
                        }
                        if (doc.data().store === "Quillacollo")
                        {
                        this.storeInfo.quillacollo = this.storeInfo.quillacollo + parseInt(doc.data().stock);
                        }
                        if (doc.data().store === "Deposito")
                        {
                        this.storeInfo.deposito = this.storeInfo.deposito + parseInt(doc.data().stock);
                        }
                    }
                });
                console.log(this.storeInfo);
            }
            });
        }
    }
}
</script>
<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
</style>