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
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line>
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
                      <v-text-field v-model="editedItem.sucursal" label="Sucursal">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.rol" label="Rol">
                      </v-text-field>
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
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title>{{ deleteFormTitle }}</v-card-title>
              <v-card-subtitle>¿Desea continuar?</v-card-subtitle>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
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
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
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

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
      },
      deleteFormTitle () {
        return 'El usuario: ' + this.editedItem.nombre + ' ' + this.editedItem.apellido + ' sera eliminado.';
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = [
          {
            ci: '5234170',
            nombre: 'Tomas',
            apellido: 'Carvajal',
            celular: '+59167559661',
            correo: 'tomyandrei@hotmail.com',
            contraseña: 'Pass123',
            sucursal: '51',
            rol: 'Encargado',
            cuenta: true
          },
          {
            ci: '5245670',
            nombre: 'Andrea',
            apellido: 'Agreda',
            celular: '+59175469769',
            correo: 'andreaagreda@hotmail.com',
            contraseña: 'Pass123',
            sucursal: 'Heroinas',
            rol: 'Administrador',
            cuenta: true
          },
          {
            ci: '5245670',
            nombre: 'Andrea',
            apellido: 'Agreda',
            celular: '+59175469769',
            correo: 'andreaagreda@hotmail.com',
            contraseña: 'Pass123',
            sucursal: 'Heroinas',
            rol: 'Administrador',
            cuenta: true
          },
          {
            ci: '5245670',
            nombre: 'Andrea',
            apellido: 'Agreda',
            celular: '+59175469769',
            correo: 'andreaagreda@hotmail.com',
            contraseña: 'Pass123',
            sucursal: 'Heroinas',
            rol: 'Administrador',
            cuenta: true
          },
          {
            ci: '5245670',
            nombre: 'Andrea',
            apellido: 'Agreda',
            celular: '+59175469769',
            correo: 'andreaagreda@hotmail.com',
            contraseña: 'Pass123',
            sucursal: 'Heroinas',
            rol: 'Administrador',
            cuenta: true
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      handleClick(item){
        if (event.target.classList.contains('btn__content')) return;
        console.log(Object.assign({}, item));
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>