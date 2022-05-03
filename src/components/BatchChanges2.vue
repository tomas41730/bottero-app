<template>
    <v-container grid-list-md fluid>
        <v-card class="mx-auto" outlined>
            <v-toolbar dark color="black" class="mb-1">
                <v-row>
                    <v-toolbar-title v-text="'CAMBIOS POR LOTE'" class="text-h3"></v-toolbar-title>
                </v-row>
            </v-toolbar> 
            <v-row>
                <v-col align="center" justify="center">
                    <v-toolbar dark color="black">
                        <v-radio-group v-model="radioGroup" row mandatory>
                            <v-row>
                                <v-radio label="Todo" value="all" @click="onRadioButtonChanged"></v-radio>
                                <v-radio label="Foto" value="photo" @click="onRadioButtonChanged"></v-radio>
                            </v-row>
                        </v-radio-group>
                    </v-toolbar>    
                </v-col>        
            </v-row> 
            <v-col>
                <v-col>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="referenceSearch" label="Referencia" @input="onReferenceChanged"></v-text-field>
                            <v-select v-if="radioGroup == 'photo'" v-model="colorSearch" :items="colors" label="Color" @input="onColorChanged"></v-select>
                        </v-col>
                        <v-col >
                            <v-select v-if="radioGroup == 'photo'" v-model="brandSearch" :items="brands" label="Marca" @input="onBrandChanged"></v-select>
                            <v-select v-else-if="radioGroup == 'all'" v-model="conditionSearch" :items="conditions" label="Condicion"></v-select>
                            <v-select v-if="radioGroup == 'photo'" v-model="materialSearch" :items="materials" label="Material"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                       <!-- <v-col>
                            <v-btn v-if="radioGroup == 'all'" color="primary" depressed elevation="2" @click="saveAllTextChanges" hidden>Buscar</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="primary" depressed elevation="2" @click="savePhotoChanges" hidden></v-btn>
                        </v-col>-->
                        <v-card-actions>
                            <v-col>
                                <v-btn class="mb-3" color="primary" depressed elevation="2" @click="searchItems" hidden>Buscar</v-btn>
                            </v-col>
                        </v-card-actions>
                    </v-row>
                </v-col>
            </v-col>
            <v-row>
                <v-col>
                    <v-card class="mx-auto" outlined>
                        <v-data-table :headers="headers" :items="products" :search="search" sort-by="name" class="elevation-1">
                        <template v-slot:top>
                            <v-toolbar dark color="black" class="mb-1">
                                <v-col>
                                    <v-btn v-if="radioGroup == 'all'" :disabled="btnEditProducts" color="primary" depressed elevation="2" @click="changeDialog = true" hidden>Editar Informacion de los calzados</v-btn>
                                    <v-btn v-else :disabled="btnEditProducts" color="primary" depressed elevation="2" @click="photoDialog = true" hidden>Cambiar Foto</v-btn>
                                </v-col>
                            </v-toolbar>
                        </template>
                        <template v-slot:no-data>
                            <v-btn  ref="btnReset" color="primary" @click="initialize">
                            Reset
                            </v-btn>
                        </template>
                        </v-data-table>
                    </v-card>
                </v-col>     
            </v-row>
            <v-row>
                <v-dialog persistent v-model="changeDialog" max-width="700px">
                    <v-card>
                        <v-toolbar color="black" dark>
                            <v-btn icon dark @click="changeDialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            Informacion del codigo de referencia: {{ editedItem.reference }}
                            <v-spacer></v-spacer>
                            <v-list-item-avatar  max-width="70px">
                            <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e"></v-img>
                            </v-list-item-avatar>
                        </v-toolbar>
                        <v-col cols="12" sm="12" md="12">
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="editedItem.reference" label="Referencia"></v-text-field>
                                    <v-textarea rows="4" v-model="editedItem.description" label="Descripcion"></v-textarea>
                                </v-col>
                                <v-col>
                                    <v-text-field v-model="editedItem.category" label="Categoria"></v-text-field>
                                    <v-text-field v-model="editedItem.purchasePrice" label="Precio de Costo" suffix="$us"></v-text-field>
                                    <v-text-field v-model="editedItem.oDisccount" label="Descuento especial" suffix="%"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field v-model="editedItem.brand" label="Marca"></v-text-field>
                                    <v-text-field v-model="editedItem.price" label="Precio de venta" suffix="Bs."></v-text-field>
                                    <v-text-field v-model="editedItem.pDisccount" label="Descuento Límite" suffix="Bs."></v-text-field>
                                </v-col>
                            </v-row>
                            <v-card-actions>
                                <v-btn color="primary" depressed elevation="2" @click="saveGeneralChanges">
                                Guardar
                                </v-btn>
                            </v-card-actions>
                        </v-col>   
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row>
                <v-dialog persistent v-model="photoDialog" max-width="700px">
                    <v-card>
                        <v-toolbar color="black" dark>
                            <v-btn icon dark @click="photoDialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                                {{ editedItem.reference + ' - ' + editedItem.brand + ' - ' + editedItem.color + ' - ' + editedItem.material }}
                            <v-spacer></v-spacer>
                            <v-list-item-avatar  max-width="70px">
                                <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e"></v-img>
                            </v-list-item-avatar>
                        </v-toolbar>
                        <v-col cols="12" sm="12" md="12">
                            <v-row>
                                <v-col align="center" justify="center">  
                                    <v-container bg fill-height grid-list-md text-xs-center>
                                    <v-layout row wrap align-center>
                                    <v-flex>
                                        <v-list-item-avatar tile size="300">
                                        <v-img :src="editedItem.photo"></v-img>
                                        </v-list-item-avatar>
                                        <v-flex>
                                            <template>
                                                <v-file-input accept="image/*" label="Seleccionar imagen del producto" v-model="image" @change="previewImage">
                                                </v-file-input>
                                            </template>
                                        </v-flex>
                                    </v-flex>
                                    </v-layout>
                                </v-container>
                                </v-col>
                            </v-row>
                            <v-card-actions>
                                <v-btn :loading="loading" :disabled="loading" color="primary" depressed elevation="2" @click="savePhotoChanges">
                                Guardar
                                </v-btn>
                            </v-card-actions>
                        </v-col>   
                    </v-card>
                </v-dialog>
            </v-row>
        </v-card>     
    </v-container>
</template>
<script>
import { createAlert } from '../services/Alerts';
import { getProductsByRef, getProductsByRefBrandColorMaterial, getProductsByRefCondition, updateProductBC1, updateProductPhoto, uploadProductPhoto } from '../services/firestore/FirebaseProducts2';
export default 
{
    data: () => 
    ({
        products: [],
        productsAux: [],
        conditions: [],
        brands: [],
        colors: [],
        materials: [],
        radioGroup: 'all',
        loader: null,
        loading: false,
        changeDialog: false,
        photoDialog: false,
        btnEditProducts: true,
        // btnEditPhoto: true,
        referenceSearch: '',
        conditionSearch: '',
        search: '',
        brandSearch: '',
        colorSearch: '',
        materialSearch: '',
        photo: null,
        image: null,
        filePhoto: null,
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
            purchasePrice: null,
            stock: null,
            description: '',
            category: '',
            store: '',
            pDisccount: null,
            oDisccount: null,
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
            purchasePrice: null,
            stock: null,
            description: '',
            category: '',
            store: '',
            pDisccount: null,
            oDisccount: null,
            condition: '',
            photo: '',
            observation: 'Sin Observación'
        },
        headers: [
            { text: 'Codigo de Barras', value: 'id' },
            { text: 'Referencia', value: 'reference'},
            { text: 'Marca', value: 'brand' },
            { text: 'Color', value: 'color' },
            { text: 'Material', value: 'material' },
            { text: 'Talla', value: 'size' },
            { text: 'Precio', value: 'price' },
            { text: 'Precio Comp.', value: 'purchasePrice' },
            { text: 'Descripcion', value: 'description' },
            { text: 'Categoria', value: 'category' },
            { text: 'Sucursal', value: 'store' },
            { text: 'Des. Limite Bs.', value: 'pDisccount' },
            { text: 'Des. Ocasional %', value: 'oDisccount' },
            { text: 'Condicion', value: 'condition' },
        ],
    }),

    computed: 
    {
    },

    watch: 
    {
        loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      },
    },

    created () 
    {
        this.initialize()
    },

    methods:        
    {
        initialize () 
        {
            console.log(this.radioGroup);   
        },
        onRadioButtonChanged()
        {
            console.log(this.radioGroup);
            this.reset();
        },
        onReferenceChanged()
        {
            this.conditions = [];
            getProductsByRef(this.referenceSearch).then( snap => 
            {
                // this.fillProductsArray()
                if(snap.docs.length > 0)
                {
                    snap.docs.forEach( doc => 
                    {
                        this.productsAux.push(doc.data());
                        this.conditions.push(doc.data().condition);
                        this.brands.push(doc.data().brand);
                    });
                }
            });
        },
        onBrandChanged()
        {
            this.productsAux.forEach(doc => {
                if(doc.brand == this.brandSearch && doc.reference == this.referenceSearch)
                {
                    this.colors.push(doc.color);
                }
            });
        },
        onColorChanged()
        {
            this.productsAux.forEach(doc => 
            {
                if(doc.brand == this.brandSearch && doc.reference == this.referenceSearch && doc.color == this.colorSearch)
                {
                    this.materials.push(doc.material);
                }
            });
        },
        searchForGeneralChanges()
        {
            getProductsByRefCondition(this.referenceSearch, this.conditionSearch).then( snap => 
            {
                this.fillProductsArray(snap);
            });
        },
        searchForPhotoChanges()
        {
            getProductsByRefBrandColorMaterial(this.referenceSearch, this.brandSearch, this.colorSearch, this.materialSearch).then( snap => 
            {
                this.fillProductsArray(snap);
            });
        },    
        searchItems()
        {
            this.products = [];
            this.productsAux = [];
            if(this.radioGroup == 'all')
            {
                this.searchForGeneralChanges();
            }
            else
            {
                this.searchForPhotoChanges();
            }
        },
        async saveGeneralChanges()
        {
            getProductsByRefCondition(this.referenceSearch, this.conditionSearch).then( snap => 
            {
                if(snap.docs.length > 0)
                {
                    snap.docs.forEach( doc => 
                    {
                        updateProductBC1(doc.data().id, this.editedItem);
                        const productIndex = this.products.findIndex( item => item.id ===  doc.data().id );
                        this.products[productIndex].reference = this.editedItem.reference;
                        this.products[productIndex].category = this.editedItem.category;
                        // this.products[productIndex].color = this.editedItem.color;
                        // this.products[productIndex].material = this.editedItem.material;
                        this.products[productIndex].description = this.editedItem.description;
                        this.products[productIndex].price = this.editedItem.price;
                        this.products[productIndex].purchasePrice = this.editedItem.purchasePrice;
                        this.products[productIndex].oDisccount = this.editedItem.oDisccount;
                        this.products[productIndex].pDisccount = this.editedItem.pDisccount;
                    });
                }
            });
            this.changeDialog = false;
        },
        async savePhotoChanges()
        {
            console.log(this.filePhoto);
            await updateProductPhoto(this.referenceSearch, this.colorSearch, this.materialSearch, this.brandSearch);
            this.photoDialog = false;
            this.loader = null;
        },
        async previewImage(file)
        {
            this.editedItem.photo = URL.createObjectURL(this.image);
            this.filePhoto = file;
            await uploadProductPhoto(this.filePhoto, this.referenceSearch, this.colorSearch, this.materialSearch, this.brandSearch);
            this.loader = 'loading';
        },
        fillProductsArray(snap)
        {
            if(snap.docs.length > 0)
            {
                this.btnEditProducts = false;
                snap.docs.forEach( doc => 
                {
                    this.products.push(doc.data());
                    this.editedItem = doc.data();
                });
            }
            else
            {
                createAlert('No se encontraron coincidencias!', 'info');
            }
        },
        reset()
        {
            this.products = [];
            this.productsAux = [];
            this.conditions = [];
            this.brands = [];
            this.colors = [];
            this.materials = [];
            this.referenceSearch = '';
            this.editedItem = this.defaultItem;
            this.btnEditProducts = true;  
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