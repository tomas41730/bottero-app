<template>
  <v-card class="mx-auto" outlined>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :search="search"
      sort-by="name"
      class="elevation-1" 
    >
      <template v-slot:top>
        <v-card-text>
            <div>
              <p class="text-h4 text--primary">MODULO DE USUARIOS</p>
            </div>
        </v-card-text>
        <v-divider horizontal></v-divider>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line>
            </v-text-field>
          </v-toolbar-title>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="yellow accent-4" class="mx-2" fab dark v-bind="attrs" v-on="on" small >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.ci" label="CI">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nombre" label="Nombres">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.apellido" label="Apellidos" >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" >
                      <v-text-field v-model="editedItem.celular" label="Celular">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.correo" label="Correo">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.contraseña" label="Contraseña">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :items="items"
                        label="Sucursal"
                        v-model="editedItem.sucursal"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            :key="JSON.stringify(data.item)"
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            :disabled="data.disabled"
                            @click:close="data.parent.selectItem(data.item)"
                          >
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :items="roles"
                        label="Rol"
                        v-model="editedItem.rol"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            :key="JSON.stringify(data.item)"
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            :disabled="data.disabled"
                            @click:close="data.parent.selectItem(data.item)"
                          >
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.cuenta" label="Cuenta">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close" error>
                  Cancelar
                </v-btn>
                <v-btn color="primary" text @click="save" primary>
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
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
import { addUser, deleteUser, getUsers } from '../services/firestore/FirebaseUsers'
import { deleteAlert, createAlert } from '../services/Alerts'
import { getStoresNames } from '../services/firestore/FirebaseStores'
  export default 
  {
    data: () => 
    ({
      dialog: false,
      dialogDelete: false,
      search: '',
      items: [],
      roles: ['Admin', 'Encargado', 'Vendedora'],
      selected:[],
      headers: [
        {
          text: 'CI',
          align: 'start',
          sortable: false,
          value: 'ci',
        },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido', value: 'apellido' },
        { text: 'Celular', value: 'celular' },
        { text: 'Correo', value: 'correo' },
        { text: 'Contraseña', value: 'contraseña' },
        { text: 'Sucursal', value: 'sucursal' },
        { text: 'Rol', value: 'rol' },
        { text: 'Cuenta Habilitada', value: 'cuenta' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        ci: '',
        nombre: '',
        apellido: '',
        celular: '',
        correo: '',
        contraseña: '',
        sucursal: '',
        rol: '',
        cuenta: true
          },
      defaultItem: {
        ci: '',
        nombre: '',
        apellido: '',
        celular: '',
        correo: '',
        contraseña: '',
        sucursal: '',
        rol: '',
        cuenta: true
      },
    }),

    computed: 
    {
      formTitle () 
      {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
      },
      deleteFormTitle () 
      {
        return 'El usuario: ' + this.editedItem.nombre + ' ' + this.editedItem.apellido + ' sera eliminado.';
      },
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
        this.desserts = getUsers()
        this.items = getStoresNames()
      },

      editItem (item) 
      {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      handleClick(item)
      {
        console.log(Object.assign({}, item));
      },

      deleteItem (item) 
      {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        let msg = 'Esta por eliminar al usuario'
        deleteAlert(msg, this.editedItem.nombre + ' ' + this.editedItem.apellido, this.deleteItemConfirm, this.closeDelete)
      },

      deleteItemConfirm () 
      {
        let ci = this.desserts[this.editedIndex].ci
        deleteUser(ci)
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () 
      {
        this.dialog = false
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () 
      {
        this.dialogDelete = false
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () 
      {
        const user = Object.assign({},this.editedItem)
        let msg = ''
        let fullname =this.editedItem.nombre + ' ' + this.editedItem.apellido
        if (this.editedIndex > -1) 
        {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
          msg = 'El usuario "' + fullname + '" fue actualizado con exito!'
        } 
        else 
        {
          this.desserts.push(this.editedItem)
          msg = 'El usuario "' + fullname + '" fue creado con exito!'
        }
        addUser(user.ci, user)
        this.close()
        createAlert(msg)
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