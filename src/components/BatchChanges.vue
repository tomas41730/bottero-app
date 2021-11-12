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
              <v-row>
                <v-col cols="5" sm="2" md="2">
                  <v-radio label="Descripción" value="description" @click="onRadioButtonChanged"></v-radio>
                </v-col>
                <v-col cols="5" sm="2" md="2">
                  <v-radio label="Categoría" value="category" @click="onRadioButtonChanged"></v-radio>
                </v-col>
                <v-col cols="5" sm="2" md="2">
                  <v-radio label="Condición" value="condition" @click="onRadioButtonChanged"></v-radio>
                </v-col>
                <v-col cols="5" sm="2" md="2">
                  <v-radio label="Precios" value="prices" @click="onRadioButtonChanged"></v-radio>
                </v-col>
                <v-col cols="5" sm="2" md="2">
                  <v-radio label="Foto" value="photo" @click="onRadioButtonChanged"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
            <v-dialog v-model="dialog" max-width="500px" persistent>
              <v-form>
                <v-card>
                  <v-card-title>
                      <p class="text-h5 text--primary bold">
                        Calzado(s) en condición de: "{{ this.condition }}"
                      </p>
                  </v-card-title>
                  <v-divider horizontal></v-divider>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <p class="text-h6 text--primary">
                          Información del lote al cual se le restará stock:
                        </p>
                    </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete v-model="idShoe" :items="idShoes" label="Códigos de Barra" @input="onIdShoesChanged"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete v-model="pStore" :items="pStores" label="Sucursal de origen" @input="onPStoreChanged"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-spacer></v-spacer>
                        <v-autocomplete v-model="pCondition" :items="pConditions" label="Condición"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-divider horizontal></v-divider>
                        <p class="text-h6 text--primary">
                          Información del producto reportado:
                        </p>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete v-model="store" :items="stores" label="Sucursal de destino"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete v-model="condition" :items="conditions" label="Condición"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="total" label="Cantidad" placeholder="Cantidad"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-textarea rows="1" v-model="observation" label="Observación" placeholder="Observación"></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" text @click="closeDialog">
                      Cancelar
                    </v-btn>
                    <v-btn color="primary" text @click="saveCondition">
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-col>
            
        </v-row>
      <v-row>
        <v-col>
          <v-col>
            <v-row>
            <v-col cols="6" sm="6" md="6">
              <v-text-field v-model="reference" :rules="attributeRules" label="Referencia" placeholder="Referencia" @input="onRefChanged"></v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-autocomplete :items="brands" v-model="brand" :rules="attributeRules" label="Marca" placeholder="Marca" @input="onBrandChanged"></v-autocomplete>
            </v-col>
          </v-row>
          </v-col>
          <v-form ref="form" lazy-validation>  
            <v-list-item three-line>
              <v-list-item-content>
                <v-col>
                    <v-row>
                        <v-col cols="6" sm="6" md="6">
                        <v-autocomplete :disabled="materialDisabled" :items="materials" v-model="material" :rules="attributeRules" label="Material" placeholder="Material" @input="onMaterialChanged"></v-autocomplete>
                        </v-col>
                        <v-col cols="6" sm="6" md="6">
                        <v-autocomplete :disabled="colorDisabled" :items="colors" v-model="color" :rules="attributeRules" label="Color" placeholder="Color" @input="onColorChanged"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                        <v-text-field :disabled="descriptionDisabled" v-model="description" :rules="attributeRules" label="Descripcion" placeholder="Descripcion"></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="4">
                        <v-autocomplete :disabled="categoryDisabled" :items="categories" v-model="category" label="Categoria" placeholder="Categoria" @input="onCategoryChanged"></v-autocomplete>
                        </v-col>
                        <v-col cols="6" sm="6" md="4">
                        <v-select :disabled="conditionDisabled || !brand" :items="conditions" v-model="condition" label="Condicion" placeholder="Condicion" @input="onConditionChanged"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6" sm="6" md="3">
                        <v-text-field :disabled="pricesDisabled" v-model="price" label="Precio" placeholder="Precio"></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="3">
                        <v-text-field :disabled="pricesDisabled" v-model="purchasePrice" label="Precio Compra" placeholder="Precio Compra"></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="3">
                        <v-text-field :disabled="pricesDisabled" v-model="oDisccount" label="Des. Oc. %" placeholder="Desc. Oc. %"></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="3">
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
                        <v-file-input :disabled="photoDisabled" accept="image/*" label="Seleccionar imagen del producto" v-model="image" @change="previewImage">
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
import { /*addProductCondition,*/ getProductsByIdShoeStore, getProducts, getProductsByRef, getProductsByRefBrand, getProductsByRefBrandCondition, getProductsByRefBrandIdShoe, getProductsByRefBrandMaterial, getProductsByRefBrandNew, updateCategoryProducts/*, updateConditionProducts*/, updateDescriptionProducts, updatePricesProducts, /*updateProductStock*/ } from '../services/firestore/FirebaseProducts'
import { onUploadBatchProducts, updateProductPhoto, getDefaultProductPhoto } from '../services/firestore/FirebaseStorage'
//import { getBrandNames } from '../services/firestore/FirebaseBrands'
//import { getColorNames } from '../services/firestore/FirabaseColors'
//import { getMaterialNames } from '../services/firestore/FirebaseMaterials'
import { getCategoryNames } from '../services/firestore/FirebaseCategories'
import { createAlert } from '../services/Alerts'
import { getStoresNames } from '../services/firestore/FirebaseStores'
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
      pStore: null,
      total: null,
      photo: null,
      image: null,
      observation: null,
      pCondition: null,
      products: [],
      brands: [],
      materials: [],
      colors: [],
      categories: [],
      conditions: [],
      pConditions: [],
      idShoes: [],
      pStores: [],
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
    radioGroup: 'description',
    pricesDisabled: true,
    materialDisabled: true,
    colorDisabled: true,
    descriptionDisabled: false,
    categoryDisabled: true,
    conditionDisabled: true,
    photoDisabled: true,
    btn: true,
    dialog: false
    }),

    computed: 
    {
    },

    watch: 
    {
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
        //this.brands = getBrandNames();
        //this.colors = getColorNames();
        //this.materials = getMaterialNames();
        this.categories = getCategoryNames();
        //this.conditions = ['Nuevo', 'Medio Viejo', 'Viejo']
        getDefaultProductPhoto().then(val => { this.photo = val; });
        this.storesDest = getStoresNames();
      },
      viewItem() 
      {
        
      },
      // photoDisabled()
      // {
      //   return !(this.reference !== null && this.brand !== null && this.material !== null && this.color !== null);
      // },
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
        // await getProductByIdShoeStore(this.pCondition, this.store, this.idShoe).then(doc => {
        //   if(doc.exists)
        //   {
        //     const product = doc.data();
        //     product.stock = '-'.concat(this.total);
        //     updateProductStock(product, product.stock);
        //     product.stock = null;
        //     product.stock = this.total;
        //     addProductCondition(product, this.condition, this.observation);
        //   }
        // });
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
                  let id = doc.data().condition + '-' + doc.data().store + '-' + doc.data().idShoe;
                  updateDescriptionProducts(id, this.description);
                  const productIndex = this.products.findIndex( item => item.idShoe ===  doc.data().idShoe && item.store === doc.data().store);
                  Object.assign(this.products[productIndex], { description: this.description });
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
              await getProductsByRefBrand(this.reference, this.brand).then(snap =>{
                snap.forEach(doc => {
                  let id = doc.data().condition + '-' + doc.data().store + '-' + doc.data().idShoe;
                  updateCategoryProducts(id, this.category);
                  const productIndex = this.products.findIndex( item => item.condition ===  doc.data().condition && item.idShoe ===  doc.data().idShoe && item.store === doc.data().store);
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
              if(this.condition === 'Fallado' || this.condition === 'Oferta')
              {
                await getProductsByRefBrandCondition(this.reference, this.brand, this.condition).then(snap =>{
                  snap.forEach(doc => {
                    let id = this.condition +  '-' + doc.data().store + '-' + doc.data().idShoe
                    updatePricesProducts(id, this.price, this.purchasePrice, this.oDisccount, this.pDisccount);
                    console.log('Viejos')
                    const productIndex = this.products.findIndex( item => item.idShoe ===  doc.data().idShoe && item.store === doc.data().store && item.condition === this.condition);
                    console.log('index: ' + productIndex)
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
                  let id = this.condition + '-' + doc.data().store + '-' + doc.data().idShoe
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
        
        if(this.reference !== null && this.brand !== null && this.material !== null && this.color !== null)
        {
          console.log(file)
          this.imageData = file;
          this.photo = URL.createObjectURL(this.image);
          await onUploadBatchProducts(file, this.brand, this.reference, this.color, this.material);
        }
        else
        {
          createAlert('Debe llenar todos los campos requeridos!', 'error');
        }
        
      },
      onCategoryChanged()
      {
        console.log(this.category)
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
        else if(this.radioGroup === 'condition')
        {
          this.conditions = ['Nuevo', 'Normal', 'Oferta', 'Fallado']
          if(this.brand !== null || this.reference === '')
          {
            this.conditionDisabled = false;
          }
          else
          {
            this.conditionDisabled = true;
          }
        }
        
      },
      onConditionChanged()
      {
        if(this.condition !== null)
        {
          this.idShoes = [];
          this.stores = [];
          this.pConditions = [];
          if(this.radioGroup === 'condition')
          {
            getProductsByRefBrand(this.reference, this.brand).then(snap =>{
            snap.forEach(doc => {
              this.idShoes.push(doc.data().idShoe);
              });
            });
          this.dialog = true;
          }        
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
        this.pStores = [];
        getProductsByRefBrandIdShoe(this.reference, this.brand, this.idShoe).then(snap =>{
            snap.forEach(doc => {
              this.pStores.push(doc.data().store);
              });
            });
      },
      onPStoreChanged()// ya logramos obtener los datos para restar el stock, falta crear uno nuevo con el stock restado .
      {
        this.pConditions = [];
        getProductsByIdShoeStore(this.idShoe, this.pStore).then(snap =>{
            snap.forEach(doc => {
                this.pConditions.push(doc.data().condition)
              });
            });
      },
      onColorChanged()
      {
        if(this.color !== null)
        {
          this.photoDisabled = false;
        }
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
            this.conditionDisabled = true;
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