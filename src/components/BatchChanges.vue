<template>
  <v-container grid-list-md fluid>
    <v-card class="mx-auto" outlined>
      <v-card-text>
        <div>
          <p class="text-h4 text--primary">CAMBIOS POR LOTE</p>
        </div>
      </v-card-text>
      <v-divider horizontal></v-divider>
      <v-row>
          <v-col>
            <v-radio-group v-model="radioGroup" row mandatory>
              <v-radio label="Foto" value="photo" @click="onRadioButtonChanged"></v-radio>
              <v-radio label="Descripción" value="description" @click="onRadioButtonChanged"></v-radio>
              <v-radio label="Categoría" value="category" @click="onRadioButtonChanged"></v-radio>
              <v-radio label="Condición" value="condition" @click="onRadioButtonChanged"></v-radio>
              <v-radio label="Precios" value="prices" @click="onRadioButtonChanged"></v-radio>
            </v-radio-group>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  Reportar calzados en condición de: {{ this.condition }}
                </v-card-title>
                <v-card-text>
                  <v-autocomplete v-model="idShoe" :items="idShoes" label="Códigos de Barra" @input="onIdShoesChanged"></v-autocomplete>
                  <v-autocomplete v-model="store" :items="stores" label="Sucursal"></v-autocomplete>
                  <v-text-field v-model="observation" label="Observación" placeholder="Observación"></v-text-field>
                  <v-text-field v-model="total" label="Cantidad" placeholder="Cantidad"></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" text @click="closeDialog">
                    Close
                  </v-btn>
                  <v-btn color="primary" text @click="saveCondition">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
            
        </v-row>
      <v-row>
        <v-col>
          <v-col>
            <v-row>
            <v-col>
              <v-text-field v-model="reference" :rules="attributeRules" label="Referencia" placeholder="Referencia" @input="onRefChanged"></v-text-field>
            </v-col>
            <v-col>
              <v-autocomplete :items="brands" v-model="brand" :rules="attributeRules" label="Marca" placeholder="Marca" @input="onBrandChanged"></v-autocomplete>
            </v-col>
          </v-row>
          </v-col>
          <v-form ref="form" lazy-validation>  
            <v-list-item three-line>
              <v-list-item-content>
                <v-col>
                  <!--  <v-row>
                        <v-col>
                        <v-text-field v-model="reference" :rules="attributeRules" label="Referencia" placeholder="Referencia" @input="onRefChanged"></v-text-field>
                        </v-col>
                        <v-col>
                        <v-autocomplete :items="brands" v-model="brand" :rules="attributeRules" label="Marca" placeholder="Marca"></v-autocomplete>
                        </v-col>
                    </v-row> -->
                    <v-row>
                        <v-col>
                        <v-autocomplete :disabled="materialDisabled" :items="materials" v-model="material" :rules="attributeRules" label="Material" placeholder="Material" @input="onMaterialChanged"></v-autocomplete>
                        </v-col>
                        <v-col>
                        <v-autocomplete :disabled="colorDisabled" :items="colors" v-model="color" :rules="attributeRules" label="Color" placeholder="Color" ></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                        <v-text-field :disabled="descriptionDisabled" v-model="description" :rules="attributeRules" label="Descripcion" placeholder="Descripcion"></v-text-field>
                        </v-col>
                        <v-col>
                        <v-autocomplete :disabled="categoryDisabled" :items="categories" v-model="category" label="Categoria" placeholder="Categoria"></v-autocomplete>
                        </v-col>
                        <v-col>
                        <v-select :disabled="conditionDisabled" :items="conditions" v-model="condition" label="Condicion" placeholder="Condicion" @input="onConditionChanged"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                        <v-text-field :disabled="pricesDisabled" v-model="price" label="Precio" placeholder="Precio"></v-text-field>
                        </v-col>
                        <v-col>
                        <v-text-field :disabled="pricesDisabled" v-model="purchasePrice" label="Precio Compra" placeholder="Precio Compra"></v-text-field>
                        </v-col>
                        <v-col>
                        <v-text-field :disabled="pricesDisabled" v-model="oDisccount" label="Des. Oc. %" placeholder="Desc. Oc. %"></v-text-field>
                        </v-col>
                        <v-col>
                        <v-text-field :disabled="pricesDisabled" v-model="pDisccount" label="Des. Lim. Bs." placeholder="Desc. Per. Bs."></v-text-field>
                        </v-col>
                    </v-row>
                    </v-col>
                <v-col>
                  <v-card-actions>
                    <v-btn :disabled="!btn" color="primary" depressed elevation="2" @click="save">
                      Guardar
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
                  <v-img :src="photo"></v-img>
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
    </v-card> 
       <v-card class="mx-auto" outlined>
      <v-data-table :headers="headers" :items="products" :search="search" sort-by="name" class="elevation-1">
      <template v-slot:top>
        
        <v-toolbar flat>
          <v-toolbar-title>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line></v-text-field>
              </v-col>
            </v-row>
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        <v-btn  ref="btnReset" color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-card>     
  </v-container>
</template>
<script>
import { addProductCondition, getProductByStore, getProducts, getProductsByRef, getProductsByRefBrand, getProductsByRefBrandCondition, getProductsByRefBrandIdShoe, getProductsByRefBrandMaterial, getProductsByRefBrandNew, updateCategoryProducts, updateConditionProducts, updateDescriptionProducts, updatePricesProducts, updateProductStock } from '../services/firestore/FirebaseProducts'
import { onUploadBatchProducts, updateProductPhoto, getDefaultProductPhoto } from '../services/firestore/FirebaseStorage'
import { getBrandNames } from '../services/firestore/FirebaseBrands'
import { getColorNames } from '../services/firestore/FirabaseColors'
import { getMaterialNames } from '../services/firestore/FirebaseMaterials'
import { getCategoryNames } from '../services/firestore/FirebaseCategories'
import { createAlert } from '../services/Alerts'
  export default 
  {
    data: () => 
    ({
      reference: null,
      brand: null,
      material: null,
      color: null,
      description: null,
      category: null,
      condition: null,
      price: null,
      purchasePrice: null,
      oDisccount: null,
      pDisccount: null,
      idShoe: null,
      store: null,
      total: null,
      photo: null,
      image: null,
      observation: null,
      products: [],
      brands: [],
      materials: [],
      colors: [],
      categories: [],
      conditions: [],
      idShoes: [],
      stores: [],
      attributeRules: [
        v => !!v || 'Este campo es requerido.',
        v => (v && v.length <= 20) || 'Este campo debe tener 20 caracteres como máximo.',
      ],
      headers: [
        {
          text: 'Referencia',
          align: 'start',
          sortable: true,
          value: 'reference',
        },
        { text: 'Codigo de Barras', value: 'idShoe' },
        //{ text: 'Fecha', value: 'due' },
        { text: 'Marca', value: 'brand' },
        { text: 'Color', value: 'color' },
        { text: 'Material', value: 'material' },
        { text: 'Precio', value: 'price' },
        { text: 'Precio Comp.', value: 'purchasePrice' },
        { text: 'Descripcion', value: 'description' },
        { text: 'Categoria', value: 'category' },
        { text: 'Sucursal', value: 'store' },
        { text: 'Des. Limite Bs.', value: 'pDisccount' },
        { text: 'Des. Ocasional %', value: 'oDisccount' },
        { text: 'Condicion', value: 'condition' },
      ],
    search: '',
    radioGroup: 'photo',
    pricesDisabled: true,
    materialDisabled: false,
    colorDisabled: false,
    descriptionDisabled: true,
    categoryDisabled: true,
    conditionDisabled: true,
    btn: true,
    dialog: false,
    select: [
          { text: 'State 1' },
          { text: 'State 2' },
          { text: 'State 3' },
          { text: 'State 4' },
          { text: 'State 5' },
          { text: 'State 6' },
          { text: 'State 7' },
        ],
    }),

    computed: 
    {
      
    },

    watch: {
    },

    created () 
    {
      this.initialize()
    },

    methods: 
    {
      initialize () 
      {
        this.products = getProducts();
        this.brands = getBrandNames();
        this.colors = getColorNames();
        this.materials = getMaterialNames();
        this.categories = getCategoryNames();
        //this.conditions = ['Nuevo', 'Medio Viejo', 'Viejo']
        getDefaultProductPhoto().then(val => { this.photo = val; });
      },
      viewItem() 
      {
        
      },
      closeDialog(){
        this.dialog = false;
        this.dialog = false;
        this.$refs.form.reset();
        this.brand = null;
        this.idShoe = null;
        this.store = null;
        this.total = null;
        this.observation = null;
      },
      async saveCondition()
      {
        await getProductByStore(this.store, this.idShoe).then(doc => {
          if(doc.exists)
          {
            const product = doc.data();
            product.stock = '-'.concat(this.total);
            updateProductStock(product, product.stock);
            product.stock = null;
            product.stock = this.total;
            addProductCondition(product, this.condition, this.observation);
          }
        });
        this.dialog = false;
        this.$refs.form.reset();
        this.brand = null;
        this.idShoe = null;
        this.store = null;
        this.total = null;
        this.observation = null;
      },
      async save()
      {
          
          if(this.radioGroup === 'photo')
          {
            if(this.material !== null && this.color !== null)
            {
              await updateProductPhoto(this.reference, this.brand, this.material, this.color);
            }
            else
            {
              createAlert('Los campos de material y color deben estar llenos.', 'error')
            }
          }
          if(this.radioGroup === 'description')
          {
            if(this.description !== null)
            {
              await getProductsByRefBrand(this.reference, this.brand).then(snap =>{
                snap.forEach(doc => {
                  let id = doc.data().store + '-' + doc.data().idShoe
                  updateDescriptionProducts(id, this.description);
                  const productIndex = this.products.findIndex( item => item.idShoe ===  doc.data().idShoe && item.store === doc.data().store);
                  Object.assign(this.products[productIndex], { description: this.description })
                });
              });
            }
            else
            {
              createAlert('El campo de descripción debe estar lleno.', 'error')
            }
          }
          if(this.radioGroup === 'category')
          {
            if(this.category !== null)
            {
              getProductsByRefBrand(this.reference, this.brand).then(snap =>{
                snap.forEach(doc => {
                  let id = doc.data().store + '-' + doc.data().idShoe
                  updateCategoryProducts(id, this.category);
                  const productIndex = this.products.findIndex( item => item.idShoe ===  doc.data().idShoe && item.store === doc.data().store);
                  Object.assign(this.products[productIndex], { category: this.category });
                });
              });
            }
            else
            {
              createAlert('El campo de categoría debe estar lleno.', 'error');
            }
          }
          if(this.radioGroup === 'condition')
          {
            if(this.condition === null)
            {
              createAlert('El campo de condición debe estar lleno.', 'error');
            }
          }
          if(this.radioGroup === 'prices')
          {
            if(this.price !== null && this.purchasePrice !== null && this.oDisccount !== null && this.pDisccount !== null)
            {
              if(this.condition === 'Medio Viejo' || this.condition === 'Viejo')
              {
                await getProductsByRefBrandCondition(this.reference, this.brand, this.condition).then(snap =>{
                  snap.forEach(doc => {
                    let id = this.condition.replace(' ', '-') +  '-' + doc.data().store + '-' + doc.data().idShoe
                    updatePricesProducts(id, this.price, this.purchasePrice, this.oDisccount, this.pDisccount);
                    console.log('Viejos')
                    const productIndex = this.products.findIndex( item => item.idShoe ===  doc.data().idShoe && item.store === doc.data().store && item.condition === this.condition);
                    Object.assign(this.products[productIndex], 
                    { 
                      price: this.price,
                      purchasePrice: this.purchasePrice,  
                      oDisccount: this.oDisccount,
                      pDisccount: this.pDisccount
                    });
                  });
                });
              }
              else if(this.condition === 'Nuevo')
              {
                await getProductsByRefBrandNew(this.reference, this.brand).then(snap =>{
                snap.forEach(doc => {
                  let id = doc.data().store + '-' + doc.data().idShoe
                  updatePricesProducts(id, this.price, this.purchasePrice, this.oDisccount, this.pDisccount);
                  console.log('Nuevos')
                  const productIndex = this.products.findIndex( item => item.idShoe ===  doc.data().idShoe && item.store === doc.data().store);
                  Object.assign(this.products[productIndex], 
                  { 
                    price: this.price,
                    purchasePrice: this.purchasePrice,  
                    oDisccount: this.oDisccount,
                    pDisccount: this.pDisccount
                  });
                });
              });
              }
            }
            else
            {
              createAlert('El campo de condición debe estar lleno.', 'error')
            }
          }

          
          this.dialog = false;
          this.$refs.form.reset();
      },
      async previewImage(file){
        console.log(file)
        this.imageData = file;
        this.photo = URL.createObjectURL(this.image);
        await onUploadBatchProducts(file, this.brand, this.reference, this.color, this.material);
        
      },
      onRefChanged(){
        this.brands = [];
        this.products = [];
        getProductsByRef(this.reference).then(snap => {
          snap.forEach(doc => {
            this.brands.push(doc.data().brand);
            this.products.push(doc.data());
          });
        })
      },
      onBrandChanged()
      {
        this.conditions = [];
        this.materials = [];
        // this.conditionDisabled = false;
        if(this.radioGroup === 'prices')
        {
          getProductsByRefBrand(this.reference, this.brand).then(snap =>{
                snap.forEach(doc => {
                  this.conditions.push(doc.data().condition)
                });
              });
        }
        else if(this.radioGroup === 'photo')
        {
          getProductsByRefBrand(this.reference, this.brand).then(snap =>{
            snap.forEach(doc => {
              this.materials.push(doc.data().material)
            });
          });
        }
        else
        {
          this.conditions = ['Nuevo', 'Normal', 'Oferta', 'Fallado']
        }
        
      },
      onConditionChanged()
      {
        if(this.condition === 'Oferta' || this.condition === 'Fallado')
        {
          this.idShoes = [];
          this.stores = [];
          if(this.radioGroup === 'condition')
          {
            getProductsByRefBrand(this.reference, this.brand).then(snap =>{
            snap.forEach(doc => {
              this.idShoes.push(doc.data().idShoe);
              this.stores.push(doc.data().store);
              });
            });
          this.dialog = true;
          }        
        }
        else if (this.condition === 'Nuevo' || this.condition === 'Normal')
        {
          getProductsByRefBrand(this.reference, this.brand).then(snap =>{
            snap.forEach(doc => {
              let id = doc.data().store + '-' + doc.data().idShoe;
              updateConditionProducts(id, this.condition);
              const productIndex = this.products.findIndex( item => item.idShoe ===  doc.data().idShoe && item.store === doc.data().store);
              Object.assign(this.products[productIndex], { condition: this.condition });
            });
          });
        }
      },
      onMaterialChanged()
      {
        this.colors = [];
        getProductsByRefBrandMaterial(this.reference, this.brand, this.material).then(snap =>{
          snap.forEach(doc => {
            this.colors.push(doc.data().color)
          });
        });
      },
      onIdShoesChanged()
      {
        this.stores = [];
        getProductsByRefBrandIdShoe(this.reference, this.brand, this.idShoe).then(snap =>{
            snap.forEach(doc => {
              this.stores.push(doc.data().store);
              });
            });
      },
      onRadioButtonChanged()
      {
          this.btn = true;
          this.materialDisabled = true;
          this.colorDisabled = true;
          this.descriptionDisabled = true;
          this.categoryDisabled = true;
          this.conditionDisabled = true;
          this.pricesDisabled = true;
          if(this.radioGroup === 'photo')
          {
              this.materialDisabled = false;
              this.colorDisabled = false;
          }
          else if(this.radioGroup === 'description')
          {
              this.descriptionDisabled = false;
          }
          else if(this.radioGroup === 'category')
          {
              this.categoryDisabled = false;
          }
          else if(this.radioGroup === 'condition')
          {
            this.conditionDisabled = false;
            // if(this.brand !== null){
            // this.conditionDisabled = true;
            // }
          }
          else if(this.radioGroup === 'prices')
          {
              this.pricesDisabled = false;
              this.conditionDisabled = false;
          }
          this.$refs.form.reset();
          this.brand = null;
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