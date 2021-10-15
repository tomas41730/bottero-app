<template>
  <v-card class="mx-auto" outlined>
    <v-data-table :headers="headers" :items="brands" :items-per-page="3" :search="search" sort-by="name" class="elevation-1">
      <template v-slot:top>
        <v-card-text>
            <div>
              <p class="text-h4 text--primary">MÓDULO DE MARCAS</p>
            </div>
        </v-card-text>
        <v-divider horizontal></v-divider>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line>
            </v-text-field>
          </v-toolbar-title>

          <v-dialog v-model="dialog" max-width="250px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="yellow accent-4" class="mx-2" fab dark v-bind="attrs" v-on="on" small >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </template>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.brand" :counter="20" :rules="rules" label="Marca" required>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" text :disabled="!valid" @click="save">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>

          
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { addBrand, getBrands, updateBrand, deleteBrand } from '../services/firestore/FirebaseBrands'
import { createAlert, deleteAlert } from '../services/Alerts'

  export default 
  {
    data: () => 
    ({
      valid: true,
      dialog: false,
      search: '',
      headers: [
        {
          text: 'Marca',
          align: 'start',
          sortable: true,
          value: 'brand',
        },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      brands: [],
      editedIndex: -1,
      editedItem: {
        brand: '',
        id: ''
          },
      defaultItem: {
        brand: '',
        id: ''
      },
      rules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 20) || 'Este campo debe tener 20 carácteres como máximo.',
      ],
    }),

    computed: 
    {
      formTitle () 
      {
        return this.editedIndex === -1 ? 'Nueva Marca' : 'Editar Marca';
      },
    },

    watch: 
    {
      dialog (val) 
      {
        val || this.close();
      },
    },

    created () 
    {
      this.initialize();
    },

    methods: 
    {
      initialize () 
      {
        this.brands = getBrands();
      },

      editItem (item) 
      {
        this.editedIndex = this.brands.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },


      deleteItem (item) 
      {
        this.editedIndex = this.brands.indexOf(item);
        this.editedItem = Object.assign({}, item);
        let msg = 'Esta por eliminar la marca';
        deleteAlert(msg, this.editedItem.brand, this.deleteItemConfirm, this.closeDelete);
      },

      deleteItemConfirm () 
      {
        let idItem = this.brands[this.editedIndex].id;
        deleteBrand(idItem);
        this.brands.splice(this.editedIndex, 1);
        this.closeDelete();
      },

      close () 
      {
        this.$refs.form.reset();
        this.dialog = false;
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      closeDelete () 
      {  
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      save () 
      {
        if(this.$refs.form.validate())
        {
          const brand = Object.assign({},this.editedItem);
          let msg = '';
          if (this.editedIndex > -1) 
          {
            Object.assign(this.brands[this.editedIndex], this.editedItem);
            updateBrand(brand);
            msg = 'La Marca "' + this.editedItem.brand + '" fue actualizada con exito!';
          } 
          else 
          {
            this.brands.push(this.editedItem);
            addBrand(brand);
            msg = 'La Marca "' + this.editedItem.brand + '" fue creada con exito!';
          }
          this.close()
          createAlert(msg);
          this.initialize();
          this.$refs.form.reset();
        }
        
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