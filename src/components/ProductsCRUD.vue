<template>
  <v-container grid-list-md>
    <v-card class="mx-auto" outlined>
      <v-card-text>
        <div>
          <p class="text-h4 text--primary">MÓDULO DE INVENTARIO</p>
        </div>
      </v-card-text>
      <v-dialog v-model="dialogObservation" max-width="500px">
        <v-card>
          <v-card-title>
            Reportar calzados en condición de: {{ this.editedItem.observation }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="editedItem.observation" label="Observación" placeholder="Observación"></v-text-field></v-card-text>
              <v-card-actions>
                <v-btn color="primary" text @click="closeDialog">
                  Continuar
                </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
      <v-divider horizontal></v-divider>
      <v-row>
        <v-col>
          <v-form ref="form" v-model="valid" lazy-validation :readonly="formDisabled">
            <v-list-item three-line>
              <v-list-item-content>
                <v-col>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="editedItem.idShoe" :rules="attributeRules" label="Codigo de barras" placeholder="Codigo calzado" @input="onIdChanged"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="editedItem.reference" :rules="attributeRules" label="Referencia" placeholder="Referencia" @input="onRefChanged"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-autocomplete :items="brands" v-model="editedItem.brand" :rules="attributeRules" label="Marca" placeholder="Marca"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-autocomplete :items="sizes" v-model="editedItem.size" :rules="attributeRules" label="Talla" placeholder="Talla"></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete :items="colors" v-model="editedItem.color" :rules="attributeRules" label="Color" placeholder="Color"></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete :items="materials" v-model="editedItem.material" :rules="attributeRules" label="Material" placeholder="Material"></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="editedItem.stock" :rules="numberRules" label="Stock" placeholder="Stock"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-textarea rows="1" v-model="editedItem.description" :rules="attributeRules" label="Descripcion" placeholder="Descripcion"></v-textarea>
                    </v-col>
                    <v-col>
                      <v-autocomplete :items="categories" v-model="editedItem.category" :rules="attributeRules" label="Categoria" placeholder="Categoria"></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-select :items="stores" :rules="[v => !!v || 'Debe asignar una sucursal.']" label="Sucursal" v-model="editedItem.store"  @input="onStoreChanged"></v-select>
                    </v-col>
                    <v-col>
                      <v-select :items="conditions" v-model="editedItem.condition" :rules="attributeRules" label="Condicion" placeholder="Condicion" @input="onConditionChanged"></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="editedItem.price" label="Precio" placeholder="Precio"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="editedItem.purchasePrice" label="Precio Compra" placeholder="Precio Compra"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="editedItem.oDisccount" label="Des. Oc. %" placeholder="Desc. Oc. %"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="editedItem.pDisccount" label="Des. Lim. Bs." placeholder="Desc. Per. Bs."></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>
                  <v-card-actions>
                    <v-btn v-model="btn" :disabled="cleanDisabled" color="primary" depressed elevation="2" @click="save">
                      {{ this.btn }}
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
      <v-data-table v-model="selected" :headers="headers" :items="products" :search="search" sort-by="name" class="elevation-1">
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

     

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="error" small class="mr-2" @click="deleteItem(item)">
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
  </v-container>
</template>
<script>
import { addProduct, getProducts, deleteProduct, getProductByRef, getProductByStore, getProductByIdShoe } from '../services/firestore/FirebaseProducts'
import { getColorNames } from '../services/firestore/FirabaseColors'
import { createAlert, deleteAlertWithImage, uploadAlert } from '../services/Alerts'
import { getStoresNames } from '../services/firestore/FirebaseStores'
import { getDefaultProductPhoto, onUpload } from '../services/firestore/FirebaseStorage'
import { getBrandNames } from '../services/firestore/FirebaseBrands'
import { getSizeNames } from '../services/firestore/FirebaseSizes'
import { getMaterialNames } from '../services/firestore/FirebaseMaterials'
import { getCategoryNames } from '../services/firestore/FirebaseCategories'
  export default 
  {
    data: () => 
    ({
      btn: 'Guardar',
      defaultImage: '',
      selected: [],
      addEdit: true,
      valid: true,
      dialog: false,
      dialogDelete: false,
      search: '',
      brands : [],
      sizes : [],
      colors: [],
      materials : [],
      categories : [],
      stores: [],
      conditions : [],
      actualStock : 0,
      headers: [
        
        { text: 'Acciones', value: 'actions', sortable: false },
        { text: 'Fecha', value: 'due' },
        { text: 'Codigo de Barras', value: 'idShoe' },
        { text: 'Referencia', value: 'reference' },
        { text: 'Marca', value: 'brand' },
        { text: 'Talla', value: 'size' },
        { text: 'Color', value: 'color' },
        { text: 'Material', value: 'material' },        
        { text: 'Stock', value: 'stock' },
        { text: 'Descripcion', value: 'description' },
        { text: 'Categoria', value: 'category' },
        { text: 'Sucursal', value: 'store' },
        { text: 'Condicion', value: 'condition' },
        { text: 'Observacion', value: 'observation' },
        { text: 'Precio', value: 'price' },
        { text: 'Precio Comp.', value: 'purchasePrice' },
        { text: 'Des. Limite Bs.', value: 'pDisccount' },
        { text: 'Des. Ocasional %', value: 'oDisccount' },
      ],
      products: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        reference: '',
        idShoe: '',
        due: null,
        brand: '',
        size: '',
        color: '',
        material: '',
        price: '',
        purchasePrice: '',
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
        price: '',
        purchasePrice: '',
        stock: null,
        description: '',
        category: '',
        store: '',
        pDisccount: null,
        oDisccount: null,
        condition: '',
        photo: 'https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e',
        observation: 'Sin Observación',
      },
      url: null,
      image: null,
      imageData: null,
      numberRules: [
        v => !!v || 'Este campo es requerido.',
        v => (v && v.length <= 15) || 'Este campo debe tener 15 números como máximo.',
        v => (/^-?\d+$/.test(v) || /^\d*\.?\d+$/.test(v)) || 'Debe ser un numero.', 
      ],
      attributeRules: [
        v => !!v || 'Este campo es requerido.',
        v => (v && v.length <= 200) || 'Este campo debe tener 200 caracteres como máximo.',
      ],
      // emailRules: [
      //   v => !!v || 'El correo electrónico es requerido.',
      //   v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Debe ingresar una dirección de correo válida.',
      // ],
      formDisabled: false,
      cleanDisabled: false,
      dialogObservation: false
    }),

    computed: 
    {
      
    },

    watch: {
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
      initialize () 
      {
        this.products = getProducts();
        this.brands = getBrandNames();
        this.sizes = getSizeNames();
        this.colors = getColorNames();
        this.materials = getMaterialNames();
        this.categories = getCategoryNames();
        this.stores = getStoresNames();
        this.conditions = ['Nuevo', 'Normal', 'Oferta', 'Fallado']
        getDefaultProductPhoto().then(val => { this.editedItem.photo = val; });
      },
      viewItem(item) 
      {
        //this.editedIndex = this.products.indexOf(item);
        item.stock = item.stock.toString();
        this.editedItem = Object.assign({}, item);
        this.cleanDisabled = true;
        this.formDisabled = true; 
      },
      
      deleteItem (item) 
      {
        this.editedIndex = this.products.indexOf(item);
        this.editedItem = Object.assign({}, item);
        let msg = 'Esta por eliminar el producto:\n'
        let description = 'Marca: ' + item.brand + '\n'
                        + 'Referencia: ' + item.reference + '\n'
                        + 'Color: ' + item.color + '\n'
                        + 'Material: ' + item.material + '\n'
                        + 'Talla: ' + item.size + '\n'
                        + 'Condición: ' + item.condition + '\n'
                        + 'Cod. Barras: ' + item.idShoe + '\n'
                        + 'Sucursal: ' + item.store + '\n'
        deleteAlertWithImage(msg, description, item.photo, this.deleteItemConfirm, this.closeDelete)
      },
      deleteItemConfirm () 
      {
        let shoe = this.products[this.editedIndex]
        deleteProduct(shoe)
        this.products.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      closeDelete () 
      {
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        this.$refs.form.reset();
      },

      async save()
      {
        if(this.$refs.form.validate())
        {
          const product = Object.assign({},this.editedItem);
          product.id = product.condition + '-' + product.store + '-' + product.idShoe;
          const datetime = new Date();
          const productIndex = this.products.findIndex( item => item.condition ===  product.condition && item.idShoe ===  product.idShoe && item.store === product.store);
          let msg = ''
          if(productIndex > -1)
          {
            product.due = datetime.toLocaleDateString('en-US') + ' ' + datetime.toLocaleTimeString('en-US');
            let newStock = parseInt(product.stock) + this.actualStock;
            this.actualStock = product.stock;
            product.stock = newStock;
            Object.assign(this.products[productIndex], product)
            product.stock = this.actualStock;
            msg = 'El producto "' + product.idShoe + '" fue actualizado con exito!'
          }
          else
          {
            product.due = datetime.toLocaleDateString('en-US') + ' ' + datetime.toLocaleTimeString('en-US');
            this.products.push(product);
            msg = 'El producto "' + product.idShoe + '" fue agregado con exito!'
          } 
          await addProduct(product);
          createAlert(msg, 'success');
          this.$refs.form.reset();
          this.btn = 'Guardar';
          this.image = null;
          this.editedItem.observation = 'Sin Observación';
          console.log('Save: ' + this.editedItem.observation)
        }
      },
      async previewImage(file){
        if(this.$refs.form.validate())
        {
          uploadAlert(4000);
          console.log(file);
          this.image = file;
          this.editedItem.photo = URL.createObjectURL(this.image);
          await onUpload(file, this.editedItem, this.uploadValue, this.cleanDisabled);
          
        }
        else 
        {
          createAlert("Debe llenar los campos.", "error");
          this.image = null;
        }
        this.editedItem.stock = this.editedItem.stock.toString();
      },
      onIdChanged(){
        getProductByIdShoe(this.editedItem.idShoe).then(snap =>{
          snap.forEach(doc => {
            if(doc.exists) this.btn = 'Actualizar';
            this.editedItem = doc.data();
            this.editedItem.stock = '';
            this.editedItem.store = null;
            this.editedItem.condition = null;
          });
        });
        this.editedItem.observation = 'Sin Observación';
      },
      onRefChanged(){
        getProductByRef(this.editedItem.reference).then(snap =>{
          snap.forEach(doc => {
            if(doc.exists) this.btn = 'Actualizar';
            this.editedItem.description = doc.data().description;
            this.editedItem.category = doc.data().category;
            this.editedItem.condition = doc.data().condition;
            this.editedItem.photo = doc.data().photo;
            this.editedItem.brand = doc.data().brand;
          })
        })
      },
      onStoreChanged(){
        getProductByStore(this.editedItem.store, this.editedItem.idShoe).then(doc => {
          if(doc.exists)
          {
            this.actualStock = doc.data().stock;
          }
        });
      },
      onConditionChanged()
      {
        if(this.editedItem.condition === 'Oferta' || this.editedItem.condition === 'Fallado')
        {
          this.dialogObservation = true;
          this.editedItem.observation = '';
        }
      },
      closeDialog()
      {
        this.dialogObservation = false;
        console.log('Close: ' + this.editedItem.observation)
        createAlert(this.editedItem.observation, 'succes')
      },
      clean(){
        this.formDisabled = false; 
        this.cleanDisabled = false;
        this.$refs.form.reset();
        Object.assign(this.editedItem, this.defaultItem);
      },
    },
  }
</script>
<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
</style>