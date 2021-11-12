<template>
  <v-card class="mx-auto" outlined>
    <v-data-table :headers="headers" :items="materials" :items-per-page="5" :search="search" sort-by="name" class="elevation-1">
      <template v-slot:top>
        <v-card-text>
            <div>
              <p class="text-h4 text--primary">MÓDULO DE MATERIALES</p>
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
                        <v-text-field v-model="editedItem.material" :counter="20" :rules="rules" label="Material" required>
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
import { addMaterial, getMaterials, updateMaterial, deleteMaterial } from '../services/firestore/FirebaseMaterials'
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
          value: 'material',
        },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      materials: [],
      editedIndex: -1,
      editedItem: {
        material: '',
        id: ''
          },
      defaultItem: {
        material: '',
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
        return this.editedIndex === -1 ? 'Nueva Material' : 'Editar Material';
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
        this.materials = getMaterials();
      },

      editItem (item) 
      {
        this.editedIndex = this.materials.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },


      deleteItem (item) 
      {
        this.editedIndex = this.materials.indexOf(item);
        this.editedItem = Object.assign({}, item);
        let msg = 'Esta por eliminar la material';
        deleteAlert(msg, this.editedItem.material, this.deleteItemConfirm, this.closeDelete);
      },

      deleteItemConfirm () 
      {
        let idItem = this.materials[this.editedIndex].id;
        deleteMaterial(idItem);
        this.materials.splice(this.editedIndex, 1);
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
          const material = Object.assign({},this.editedItem);
          let msg = '';
          if (this.editedIndex > -1) 
          {
            Object.assign(this.materials[this.editedIndex], this.editedItem);
            updateMaterial(material);
            msg = 'El material "' + this.editedItem.material + '" fue actualizado con exito!';
          } 
          else 
          {
            this.materials.push(this.editedItem);
            addMaterial(material);
            msg = 'El material "' + this.editedItem.material + '" fue creado con exito!';
          }
          this.close()
          createAlert(msg, 'success');
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