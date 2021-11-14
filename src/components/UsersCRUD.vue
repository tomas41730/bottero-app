<template>
  <v-card class="mx-auto" outlined>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="users"
      :search="search"
      sort-by="name"
      class="elevation-1" 
    >
      <template v-slot:top>
        <v-card-text>
            <div>
              <p class="text-h4 text--primary">MÓDULO DE USUARIOS</p>
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
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.ci" :counter="20" :rules="numberRules" label="CI" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.name" :counter="20" :rules="fullnameRules" label="Nombres" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.lastname" :counter="20" :rules="fullnameRules" label="Apellidos" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4" >
                        <v-text-field v-model="editedItem.phone" :counter="15" :rules="numberRules" label="Celular" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.email" :counter="50" :rules="emailRules" label="Correo" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.password" :counter="20" :rules="[v => !!v || 'La contraseña es requerida.']"  label="Contraseña" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          :items="items"
                          :rules="[v => !!v || 'Debe asignar una sucursal.']"
                          label="Sucursal"
                          v-model="editedItem.store" required
                        >
                          <template v-slot:selection="data" >
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
                          :rules="[v => !!v || 'Debe asignar un rol.']"
                          label="Rol"
                          v-model="editedItem.role" required
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
                        <v-switch v-model="editedItem.account" color="success" hide-details :label="`Cuenta: ${ accountState }`"></v-switch>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close" error>
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" text :disabled="!valid" @click="save" primary>
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
            
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:[`item.account`]="{ item }">
        <v-icon color="green" v-if="item.account">mdi-check-circle</v-icon> 
        <v-icon color="red" v-else>mdi-close-circle</v-icon>
      </template> 

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="orange" small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon color="error" small @click="deleteItem(item)">
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
import { getRoleNames } from '../services/firestore/FirebaseRoles'
//import { auth } from '../services/firebase'
  export default 
  {
    data: () => 
    ({
      valid: true,
      dialog: false,
      dialogDelete: false,
      search: '',
      items: [],
      roles: getRoleNames(),
      selected:[],
      headers: [
        {
          text: 'CI',
          align: 'start',
          sortable: false,
          value: 'ci',
        },
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastname' },
        { text: 'Celular', value: 'phone' },
        { text: 'Correo', value: 'email' },
        { text: 'Contraseña', value: 'password' },
        { text: 'Sucursal', value: 'store' },
        { text: 'Rol', value: 'role' },
        { text: 'Cuenta Habilitada', value: 'account', align: 'center', },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        ci: '',
        name: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        store: '',
        role: '',
        idRole: '',
        account: true
          },
      defaultItem: {
        ci: '',
        name: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        store: '',
        role: '',
        idRole: '',
        account: true
      },
      numberRules: [
        v => !!v || 'Este campo es requerido.',
        v => (v && v.length <= 15) || 'Este campo debe tener 15 números como máximo.',
        v => /^\d+$/.test(v) || 'Debe ser un numero.', 
      ],
      fullnameRules: [
        v => !!v || 'Este campo es requerido.',
        v => (v && v.length <= 10) || 'Este campo debe tener 20 caracteres como máximo.',
      ],
      emailRules: [
        v => !!v || 'El correo electrónico es requerido.',
        v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Debe ingresar una dirección de correo válida.',
 ],
    }),

    computed: 
    {
      formTitle () 
      {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
      },
      deleteFormTitle () 
      {
        return 'El usuario: ' + this.editedItem.name + ' ' + this.editedItem.lastname + ' sera eliminado.';
      },
      accountState()
      {
        if(this.editedItem.account)
        {
          return 'Habilitado'
        }
        else
        {
          return 'Deshabilitado'
        }
      }
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
        this.users = getUsers()
        this.items = getStoresNames()
      },

      editItem (item) 
      {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) 
      {
        this.editedIndex = this.users.indexOf(item);
        this.editedItem = Object.assign({}, item);
        let msg = 'Esta por eliminar al usuario'
        deleteAlert(msg, this.editedItem.name + ' ' + this.editedItem.lastname, this.deleteItemConfirm, this.closeDelete)
      },
      deleteItemConfirm () 
      {
        let ci = this.users[this.editedIndex].ci
        deleteUser(ci)
        this.users.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () 
      {
        this.$refs.form.reset()
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
        if(this.$refs.form.validate())
        {
          let msg = ''
          let fullname = this.editedItem.name + ' ' + this.editedItem.lastname;
          console.log('1');
          console.log(this.editedItem);
          if(this.editedIndex > -1)
          {
            console.log('old');
            console.log(this.editedItem);
            Object.assign(this.users[this.editedIndex], this.editedItem)
            msg = 'El usuario "' + fullname + '" fue actualizado con éxito!';
          }
          else
          {
            console.log('new');
            console.log(this.editedItem);
            this.users.push(Object.assign({}, this.editedItem))
            msg = 'El usuario "' + fullname + '" fue creado con éxito!'
          }
          addUser(Object.assign({}, this.editedItem));
          createAlert(msg, 'success');
          this.close();
          this.$refs.form.reset();
        }
      },
      onChange()
      {
        console.log(this.editedItem);
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