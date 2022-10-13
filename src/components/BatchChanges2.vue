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
                                <v-radio label="Stocks" value="stock" @click="onRadioButtonChanged"></v-radio>
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
                            <v-select v-else-if="radioGroup == 'all' || radioGroup == 'stock'" v-model="conditionSearch" :items="stores" label="Sucursal"></v-select>
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
                                    <v-toolbar-title>
                                        <v-btn v-if="radioGroup == 'all'" :disabled="btnEditProducts" color="primary" depressed elevation="2" @click="changeDialog = true" hidden>Editar Informacion de los calzados</v-btn>
                                        <v-row v-else-if="radioGroup == 'stock'">
                                            <v-col>
                                                <v-text-field v-model="idShoeSearch" clearable flat solo-inverted hide-details @input="onIdShoeChanged" label="Codigo de Barras"></v-text-field>
                                            </v-col>
                                            <v-col>
                                                <v-menu :disabled="btnEditProducts || conditionSearch == 'Todas'" bottom right>
                                                    <template v-slot:activator="{ on, attrs }">
                                                    <v-btn  x-large dark icon v-bind="attrs" v-on="on">
                                                        <v-icon>mdi-dots-vertical</v-icon>
                                                    </v-btn>
                                                    </template>
                                                    <v-list>
                                                        <v-list-item link>
                                                            <v-list-item-icon>
                                                                <v-icon v-text="'mdi-autorenew'"></v-icon>
                                                            </v-list-item-icon>
                                                            <v-list-item-title @click="askToReset">Reiniciar Stocks</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item link>
                                                            <v-list-item-icon>
                                                                <v-icon v-text="'mdi-content-save-all'"></v-icon>
                                                            </v-list-item-icon>
                                                            <v-list-item-title @click="askToSave">Guardar Cambios</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </v-col>
                                        </v-row>
                                        <v-btn v-else :disabled="btnEditProducts" color="primary" depressed elevation="2" @click="photoDialog = true" hidden>Cambiar Foto</v-btn>
                                    </v-toolbar-title>
                                </v-col>
                            </v-toolbar>
                        </template>
                        <template v-slot:no-data>
                            <v-btn  ref="btnReset" color="primary" @click="initialize">
                            Reset
                            </v-btn>
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
                            <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
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
                                    <v-text-field v-model="editedItem.oDiscount" label="Descuento especial" suffix="%"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field v-model="editedItem.brand" label="Marca"></v-text-field>
                                    <v-text-field v-model="editedItem.price" label="Precio de venta" suffix="Bs."></v-text-field>
                                    <v-text-field v-model="editedItem.pDiscount" label="Descuento Límite" suffix="Bs."></v-text-field>
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
import { confirmAlert, createAlert } from '../services/Alerts';
import { updateProductStock } from '../services/firestore/FirebaseProducts2';
import { getProductsByRef, getProductsByRefBrandColorMaterial, getProductsByRefStore, updateProductBC1, updateProductPhoto, uploadProductPhoto } from '../services/firestore/FirebaseProducts2';
export default 
{
    data: () => 
    ({
        products: [],
        productsAux: [],
        stores: [],
        brands: [],
        colors: [],
        materials: [],
        radioGroup: 'all',
        loader: null,
        loading: false,
        changeDialog: false,
        photoDialog: false,
        editStock:false,
        btnEditProducts: true,
        // btnEditPhoto: true,
        referenceSearch: '',
        conditionSearch: '',
        idShoeSearch: '',
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
            pDiscount: null,
            oDiscount: null,
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
            pDiscount: null,
            oDiscount: null,
            condition: '',
            photo: '',
            observation: 'Sin Observación'
        },
        headers: [
            { text: 'Acciones', value: 'actions' },
            { text: 'Stock', value: 'stock' },
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
            { text: 'Des. Limite Bs.', value: 'pDiscount' },
            { text: 'Des. Ocasional %', value: 'oDiscount' },
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
            this.stores = [];
            getProductsByRef(this.referenceSearch).then( snap => 
            {
                // this.fillProductsArray()
                if(!snap.empty)
                {
                    snap.docs.forEach( doc => 
                    {
                        this.productsAux.push(doc.data());
                        this.stores.push(doc.data().store);
                        this.brands.push(doc.data().brand);
                    });
                    this.stores.push('Todas')
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
        onIdShoeChanged()
        {
            console.log(this.idShoeSearch);
            const productIndex = this.products.findIndex( item => item.idShoe === this.idShoeSearch);
            if(productIndex > -1)
            {
                this.addProduct(this.products[productIndex]);
                this.idShoeSearch = '';
            }
        },
        searchForGeneralChanges()
        {
            if(this.conditionSearch == 'Todas')
            {
                getProductsByRef(this.referenceSearch).then( snap => 
                {
                    this.fillProductsArray(snap);
                });
            }
            else
            {
                getProductsByRefStore(this.referenceSearch, this.conditionSearch).then( snap => 
                {
                    this.fillProductsArray(snap);
                });
            }
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
            if(this.radioGroup == 'all' || this.radioGroup == 'stock')
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
            console.log('hola')
            if(this.conditionSearch == 'Todas')
            {
                getProductsByRef(this.referenceSearch).then( snap => 
                {
                    if(!snap.empty)
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
                            this.products[productIndex].oDiscount = this.editedItem.oDiscount;
                            this.products[productIndex].pDiscount = this.editedItem.pDiscount;
                        });
                    }
                });
            }
            else
            {
                getProductsByRefStore(this.referenceSearch, this.conditionSearch).then( snap => 
                {
                    if(!snap.empty)
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
                            this.products[productIndex].oDiscount = this.editedItem.oDiscount;
                            this.products[productIndex].pDiscount = this.editedItem.pDiscount;
                        });
                    }
                });
            }
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
            if(!snap.empty)
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
        },
        addProductBtn(item)
        {
            const itemIndex = this.products.findIndex(elem => elem.id == item.id);
            if(itemIndex > -1)
            {
                this.products[itemIndex].stock++;
            }
            console.log(item)
        },
        addProduct(item)
        {
            const itemIndex = this.products.findIndex(elem => elem.id == item.id);
            if(itemIndex > -1)
            {
                this.products[itemIndex].stock++;
                let elem = this.products.splice(itemIndex, 1);
                this.products.unshift(elem[0]);
            }
        },
        removeOneProductStock(item)
        {
            const itemIndex = this.products.findIndex(elem => elem.id == item.id);
            if(itemIndex > -1)
            {
                this.products[itemIndex].stock--;
            }
        },
        askToSave()
        {
            let msg = `Los stocks de los calzados de referencia: ${this.referenceSearch} pertenecientes a la sucursal ${this.conditionSearch} seran actualizados`;
            let description = 'Una vez guardados los cambios no se podran revertir los valores.';
            confirmAlert(msg, description, 'info', this.saveStocks);
        },
        askToReset()
        {
            let msg = `Los stocks de los calzados de referencia: ${this.referenceSearch} pertenecientes a la sucursal ${this.conditionSearch} se reduciran a 0.`;
            let description = 'Si desea revertir los valores anteriores, esto solo se podrá si aún no hizo click en la opción de Guardar Cambios dentro del menu de opciones.';
            confirmAlert(msg, description, 'info', this.resetStocks);
        },
        saveStocks()
        {
            this.products.forEach( item => 
            {
                updateProductStock(item.id, item.stock);
            });

        },
        resetStocks()
        {
            this.products.forEach(item => item.stock = 0);
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