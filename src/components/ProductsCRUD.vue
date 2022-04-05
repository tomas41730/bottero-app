<template>
  <v-container grid-list-md>
    <v-card class="mx-auto" outlined>
      <v-card-text>
        <div>
          <p class="text-h4 text--primary">MÓDULO DE INVENTARIO - {{ this.store }}</p>
        </div>
      </v-card-text>
      <v-dialog v-model="dialogObservation" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            Registrar calzados en condición de: {{ this.editedItem.condition }}
          </v-card-title>
          <v-card-text>
            <v-textarea rows="1" v-model="editedItem.observation" label="Observación" placeholder="Observación"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="closeDialog">
              Continuar
            </v-btn>
            <v-btn color="primary" text @click="cancelObservation">
              Cancelar
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
            <v-select :items="stores" :rules="[v => !!v || 'Debe asignar una sucursal.']" label="Sucursal" @input="onStoreChanged" v-model="store"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="closeDialogStore">
              Continuar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-divider horizontal></v-divider>
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
                      <v-text-field v-model="editedItem.stock" :rules="numberRules" label="Stock" placeholder="Stock"></v-text-field>
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
                      <!--<v-select :readonly="true" :items="stores" @click="dialogStore = true" :rules="[v => !!v || 'Debe asignar una sucursal.']" label="Sucursal" v-model="editedItem.store"></v-select>-->
                      <v-btn outlined color="primary" @click="dialogStore = true" block> Sucursal </v-btn>
                    </v-col>
                    <v-col cols="4" sm="6" md="3">
                      <v-select :items="conditions" v-model="editedItem.condition" :rules="attributeRules" label="Condicion" placeholder="Condicion" @input="onConditionChanged"></v-select>
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
                      <v-text-field suffix="Bs." v-model="editedItem.pDisccount" label="Desc. Limite Bs." placeholder="Desc. Lim. Bs."></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="3">
                      <v-text-field suffix="%" v-model="editedItem.oDisccount" label="Desc. Ocasional %" placeholder="Desc. Oc. %"></v-text-field>
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
import { addProduct, getProducts, deleteProduct, getProductByRef, getProductByIdShoe, getProductsByRefBrandMaterialColor, getProductById, addInventory } from '../services/firestore/FirebaseProducts'
import { getColorNames } from '../services/firestore/FirabaseColors'
import { createAlert, deleteAlertWithImage, uploadAlert } from '../services/Alerts'
import { getStoresNames } from '../services/firestore/FirebaseStores'
import { deletePhoto, getDefaultProductPhoto, onUpload } from '../services/firestore/FirebaseStorage'
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
      addEdit: false,
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
        { text: 'Precio Costo', value: 'purchasePrice' },
        { text: 'Precio', value: 'price' },
        { text: 'Des. Limite Bs.', value: 'pDisccount' },
        { text: 'Des. Ocasional %', value: 'oDisccount' },
        { text: 'Observacion', value: 'observation' },
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
      formDisabled: false,
      cleanDisabled: false,
      dialogObservation: false,
      dialogStore: true,
      store: null,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
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
        console.log(this.date);
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
      viewItem(item) 
      {
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
                        + 'Observación: ' + item.observation + '\n'
        deleteAlertWithImage(msg, description, item.photo, this.deleteItemConfirm, this.closeDelete)
      },
      async deleteItemConfirm () 
      {
        let shoe = this.products[this.editedIndex]
        //deleteProduct(shoe);
        await getProductsByRefBrandMaterialColor(shoe.reference, shoe.brand, shoe.material, shoe.color).then(snap =>{
               if(snap.size === 1)
               {
                 deletePhoto(shoe);
               }
              deleteProduct(shoe);
              });
        uploadAlert(2000, 'Eliminando producto de la base de datos.');
        this.products.splice(this.editedIndex, 1);
        this.closeDelete();
      },
      closeDelete () 
      {
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
        this.$refs.form.reset();
      },

      async save()
      {
        this.editedItem.store = this.store;
        if(this.$refs.form.validate())
        {
          const product = Object.assign({},this.editedItem);
          product.id = product.condition + '-' + product.store + '-' + product.idShoe;
          const datetime = new Date();
          const productIndex = this.products.findIndex( item => item.condition ===  product.condition && item.idShoe ===  product.idShoe && item.store === product.store);        
          let msg = '';
          let appObj = {
            date: this.date,
            datetime: datetime.toLocaleDateString('en-US') + ' ' + datetime.toLocaleTimeString('en-US'),
            id: this.editedItem.condition + '-' + this.editedItem.store + '-' + this.editedItem.idShoe,
            idShoe: this.editedItem.idShoe,
            reference: this.editedItem.reference,
            stock: this.editedItem.stock,
            condition: this.editedItem.condition,
            store: this.editedItem.store
          }
          addInventory(appObj, this.date);
          if(productIndex > -1)
          {
            let actualStock = parseInt(this.products[productIndex].stock);
            product.due = datetime.toLocaleDateString('en-US') + ' ' + datetime.toLocaleTimeString('en-US');
            let auxStock = parseInt(product.stock);
            if(actualStock + parseInt(product.stock) < 0) 
            { 
              createAlert('No se puede tener un stock menor a 0.', 'error'); 
              this.editedItem.stock = parseInt(product.stock);
            } 
            else
            { 
              product.stock = actualStock + parseInt(product.stock);
              Object.assign(this.products[productIndex], product);
              product.stock = auxStock;
              msg = 'El producto "' + product.idShoe + '" fue actualizado con exito!';
              this.succesSave(product, msg);
            }
          }
          else
          {
            if(parseInt(product.stock) < 0) 
            { 
              createAlert('No se puede tener un stock menor a 0.', 'error'); 
              this.editedItem.stock = parseInt(product.stock);
            }
            else
            {
              product.due = datetime.toLocaleDateString('en-US') + ' ' + datetime.toLocaleTimeString('en-US');
              this.products.push(product);
              msg = 'El producto "' + product.idShoe + '" fue agregado con exito!';
              this.succesSave(product, msg);
            }
          } 
        }
      },
      async succesSave(product, msg)
      {
        await addProduct(product);
        createAlert(msg, 'success');
        this.$refs.form.reset();
        this.btn = 'Guardar';
        this.image = null;
        this.editedItem.observation = 'Sin Observación';
      },
      async previewImage(file)
      {
        if(this.$refs.form.validate())
        {
          uploadAlert(5000, 'Subiendo imagen! Por favor espere.');
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
      onStoreChanged()
      {

      },
      onIdChanged()
      {
        getProductByIdShoe(this.editedItem.idShoe).then(snap =>{
          snap.forEach(doc => {
            //if(doc.exists) this.btn = 'Actualizar';
            this.editedItem = doc.data();
            this.editedItem.stock = '';
            this.editedItem.store = this.store;
            this.editedItem.condition = null;
          });
        });
        this.editedItem.observation = 'Sin Observación';
      },
      onRefChanged(){
        getProductByRef(this.editedItem.reference).then(snap =>{
          snap.forEach(doc => {
            //if(doc.exists) this.btn = 'Actualizar';
            this.editedItem.description = doc.data().description;
            this.editedItem.category = doc.data().category;
            this.editedItem.condition = doc.data().condition;
            //this.editedItem.photo = doc.data().photo;
            this.editedItem.brand = doc.data().brand;
            this.editedItem.price = doc.data().price;
            this.editedItem.purchasePrice = doc.data().purchasePrice;
            this.editedItem.pDisccount = doc.data().pDisccount;
            this.editedItem.oDisccount = doc.data().oDisccount;
          })
        })
      },
      onConditionChanged()
      {
        let idShoe = this.editedItem.condition + '-' + this.store + '-' + this.editedItem.idShoe;
        if((this.editedItem.condition === 'Oferta' || this.editedItem.condition === 'Fallado'))
        {
          this.dialogObservation = true;
          this.editedItem.observation = '';
          getProductById(idShoe).then(doc =>{
            if(doc.exists)
            {
              this.btn = 'Actualizar';
              this.editedItem.observation = doc.data().observation;
            }
            else
            {
              this.btn = 'Guardar';
            }
          });
        }
        else
        {
          getProductById(idShoe).then(doc =>{
            this.btn = (doc.exists) ? 'Actualizar' : 'Guardar';
          });
          this.editedItem.observation = 'Sin Observación';
        }
      },
      closeDialog()
      {
        console.log('Close1: ' + this.editedItem.observation)
        if(this.editedItem.observation !== ''){
          this.dialogObservation = false;
          console.log('Close:2 ' + this.editedItem.observation)
        }
        else
        {
          createAlert('Debe agregar una observacion o cancelar!', 'error');
        }
      },
      cancelObservation()
      {
        this.dialogObservation = false;
        this.editedItem.condition = null;
      },
      closeDialogStore()
      {
        let idShoe = this.editedItem.condition + '-' + this.store + '-' + this.editedItem.idShoe;
        if(this.store !== null)
        {
          getProductById(idShoe).then(doc =>{
            this.btn = (doc.exists) ? 'Actualizar' : 'Guardar';
          });
          this.editedItem.observation = 'Sin Observación';
          this.dialogStore = false;
        }
        else
        {
          createAlert('Debe elegir una sucursal!', 'error');
        }
      },
      clean(){
        this.formDisabled = false; 
        this.cleanDisabled = false;
        this.$refs.form.reset();
        Object.assign(this.editedItem, this.defaultItem);
        this.editedItem.store = this.store;
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