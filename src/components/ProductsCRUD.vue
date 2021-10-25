<template>
  <v-container grid-list-md>
    <v-card class="mx-auto" outlined>
      <v-card-text>
        <div>
          <p class="text-h4 text--primary">MÓDULO DE INVENTARIO</p>
        </div>
      </v-card-text>
      <v-divider horizontal></v-divider>
      <v-row>
        <v-col>
          <v-form ref="form" v-model="valid" lazy-validation>
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
                      <v-text-field v-model="editedItem.description" :rules="attributeRules" label="Descripcion" placeholder="Descripcion"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-autocomplete :items="categories" v-model="editedItem.category" :rules="attributeRules" label="Categoria" placeholder="Categoria"></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-select :items="stores" :rules="[v => !!v || 'Debe asignar una sucursal.']" label="Sucursal" v-model="editedItem.store"  @input="onStoreChanged"></v-select>
                    </v-col>
                    <v-col>
                      <v-select :items="conditions" v-model="editedItem.condition" :rules="attributeRules" label="Condicion" placeholder="Condicion"></v-select>
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
                    <v-btn v-model="btn" color="primary" depressed elevation="2" @click="save">
                      {{ this.btn }}
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
import { addProduct, getProducts, deleteProduct, getProductById, getProductByRef, getProductByStore } from '../services/firestore/FirebaseProducts'
import { getColorNames } from '../services/firestore/FirabaseColors'
import { deleteAlert, createAlert } from '../services/Alerts'
import { getStoresNames } from '../services/firestore/FirebaseStores'
import { onUpload } from '../services/firestore/FirebaseStorage'
import { getBrandNames } from '../services/firestore/FirebaseBrands'
import { getSizeNames } from '../services/firestore/FirebaseSizes'
import { getMaterialNames } from '../services/firestore/FirebaseMaterials'
import { getCategoryNames } from '../services/firestore/FirebaseCategories'
  export default 
  {
    data: () => 
    ({
      btn: 'Guardar',
      defaultImage: 'https://firebasestorage.googleapis.com/v0/b/bottero-app.appspot.com/o/utilities%2Flogo.png?alt=media&token=5be54cad-137f-4050-b392-b2319104b96d',
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
        {
          text: 'Referencia',
          align: 'start',
          sortable: true,
          value: 'reference',
        },
        { text: 'Codigo de Barras', value: 'idShoe' },
        { text: 'Fecha', value: 'due' },
        { text: 'Marca', value: 'brand' },
        { text: 'Talla', value: 'size' },
        { text: 'Color', value: 'color' },
        { text: 'Material', value: 'material' },
        { text: 'Precio', value: 'price' },
        { text: 'Precio Comp.', value: 'purchasePrice' },
        { text: 'Stock', value: 'stock' },
        { text: 'Descripcion', value: 'description' },
        { text: 'Categoria', value: 'category' },
        { text: 'Sucursal', value: 'store' },
        { text: 'Des. Limite Bs.', value: 'pDisccount' },
        { text: 'Des. Ocasional %', value: 'oDisccount' },
        { text: 'Condicion', value: 'condition' },
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
        photo: ''
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
        photo: ''
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
        v => (v && v.length <= 20) || 'Este campo debe tener 20 caracteres como máximo.',
      ],
      emailRules: [
        v => !!v || 'El correo electrónico es requerido.',
        v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Debe ingresar una dirección de correo válida.',
      ],
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
        this.conditions = ['Nuevo', 'Medio Viejo', 'Viejo']
        this.editedItem.photo = this.defaultImage;
      },
      viewItem() 
      {
        // this.editedIndex = this.products.indexOf(item);
        // this.editedItem = Object.assign({}, item);
        console.log(this.editedItem)
      },
      
      deleteItem (item) 
      {
        this.editedIndex = this.products.indexOf(item);
        this.editedItem = Object.assign({}, item);
        let msg = 'Esta por eliminar el producto'
        deleteAlert(msg, this.editedItem.idShoe + ' ' + this.editedItem.description, this.deleteItemConfirm, this.closeDelete)
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
        //this.dialogDelete = false
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
          product.id = product.store + '-' + product.idShoe;
          const datetime = new Date();
          const productIndex = this.products.findIndex( item => item.idShoe ===  product.idShoe && item.store === product.store);
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
          this.editedItem.photo = this.defaultImage;
        }
      },
      previewImage(file){
        if(this.$refs.form.validate())
        {
          console.log(file);
          this.imageData = file;
          this.editedItem.photo = URL.createObjectURL(this.image);
          onUpload(file, this.editedItem);
        }
        else 
        {
          createAlert("Debe agregar una sucursal.");
        }
      },
      onIdChanged(){
        getProductById(this.editedItem.idShoe).then(snap =>{
          snap.forEach(doc => {
            if(doc.exists) this.btn = 'Actualizar';
            this.editedItem = doc.data();
            this.editedItem.stock = '0';
            this.editedItem.store = null;
          })
        })
      },
      onRefChanged(){
        getProductByRef(this.editedItem.reference).then(snap =>{
          snap.forEach(doc => {
            if(doc.exists) this.btn = 'Actualizar';
            this.editedItem = doc.data();
            this.editedItem.stock = '0';
            this.editedItem.store = null;
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