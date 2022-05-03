<template>
  <v-card class="mx-auto" outlined>
    <v-container fluid>
      <v-card-text>
        <div>
          <p class="text-h4 text--primary">MÓDULO DE ROLES</p>
        </div>
      </v-card-text>
      <v-divider horizontal></v-divider>
      <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
      >
        <template v-slot:header>
          <v-toolbar dark color="black" class="mb-1">
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            ></v-text-field>
            
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer></v-spacer>
              <v-select
                v-model="sortBy"
                flat
                solo-inverted
                hide-details
                :items="Keys1"
                prepend-inner-icon="mdi-magnify"
                label="Sort by"
              ></v-select>
              <v-spacer></v-spacer>
            </template>
            <v-dialog v-model="dialog" max-width="250px" max-height="1000px">
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
                    <v-col>
                      <v-row>
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-text-field v-model="editedItem.name" :counter="20" :rules="fullnameRules" label="Nombre" required>
                          </v-text-field>
                        </v-form>
                      </v-row>
                      <v-row >
                        <v-switch v-model="editedItem.users" color="success" hide-details label='Usuarios'></v-switch>
                      </v-row>
                       <v-row cols="1" sm="6" md="4">
                        <v-switch v-model="editedItem.roles" color="success" hide-details label='Roles'></v-switch>
                      </v-row>
                      <v-row cols="1" sm="6" md="4">
                        <v-switch v-model="editedItem.stores" color="success" hide-details label='Sucursales'></v-switch>
                      </v-row>
                      <v-row cols="1" sm="6" md="4">
                        <v-switch v-model="editedItem.products" color="success" hide-details label='Productos'></v-switch>
                      </v-row>
                      <v-row cols="1" sm="6" md="4">
                        <v-switch v-model="editedItem.inventory" color="success" hide-details label='Inventario'></v-switch>
                      </v-row>
                      <v-row cols="1" sm="6" md="4">
                        <v-switch v-model="editedItem.sales" color="success" hide-details label='Ventas'></v-switch>
                      </v-row>
                      <v-row cols="1" sm="6" md="4">
                        <v-switch v-model="editedItem.exchanges" color="success" hide-details label='Traspasos'></v-switch>
                      </v-row>
                      <v-row cols="1" sm="6" md="4">
                        <v-switch v-model="editedItem.orders" color="success" hide-details label='Pedidos'></v-switch>
                      </v-row>
                      
                    </v-col>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" text @click="save">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
          </v-dialog>
          </v-toolbar>
        </template>
      
        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.name"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card>
                <v-card-title class="subheading font-weight-bold">
                  {{ item.name }}
                  <v-spacer></v-spacer>
                  <template>
                    <v-icon small @click="editItem(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-card-title>
                <v-card-subtitle>{{ item.id }}</v-card-subtitle>
                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index" 
                  >
                  <v-list-item-content :class="{ 'blue--text': sortBy === keys[key.toLowerCase()] }">
                      {{ keys[key] }}:
                  </v-list-item-content>  
                    <v-list-item-content class="align-end" :class="{ 'blue--text': sortBy === key }">    
                      <v-list-item-avatar tile size="20">
                        <v-icon color="green" v-if="item[key.toLowerCase()]">mdi-check-circle</v-icon> 
                        <v-icon color="red" v-else>mdi-close-circle</v-icon>
                      </v-list-item-avatar>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    <!-- Provisional hasta mejorar el modulo de roles -->
      <v-dialog v-model="getPermission" max-width="600px" persistent>
        <v-card>
          <v-card-title>
            No cuenta con los permisos necesarios para esta sección
          </v-card-title>
          <v-col align="center" justify="center">  
            <v-container bg fill-height grid-list-md text-xs-center>
            <v-layout row wrap align-center>
              <v-flex>
                <v-list-item-avatar tile size="300">
                  <v-img :src="imgDenied"></v-img>
                </v-list-item-avatar>
                <v-flex>
              </v-flex>
              </v-flex>
            </v-layout>
          </v-container>
        </v-col>
          <v-card-actions>
            <v-btn color="primary" depressed block to="/">
              Volver al menu principal
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-card>
</template>
<script>
import { createAlert, deleteAlert } from '../services/Alerts'
import { addRole, updateRole, deleteRole, getRoles } from '../services/firestore/FirebaseRoles'

  export default {
    data: () => ({
        imgDenied: "https://library.kissclipart.com/20180829/ute/kissclipart-user-deletion-clipart-computer-icons-user-c7234fb3b6916925.png",
        dialog: false,
        valid: true,
        fullnameRules: [
        v => !!v || 'Este campo es requerido.',
        v => (v && v.length <= 10) || 'Este campo debe tener 10 números como máximo.',
        ],
        itemsPerPageArray: [4, 8, 12],
        search: '',
        filter: {},
        sortDesc: false,
        page: 1,
        itemsPerPage: 8,
        sortBy: 'name',
        keys: {
          name: 'Nombre',
          users: 'Usuarios',
          roles: 'Roles',
          stores: 'Sucursales',
          products: 'Productos',
          inventory: 'Inventario',
          sales: 'Ventas',
          exchanges: 'Traspasos',
          orders: 'Pedidos'
        },
          
        items: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            users: false,
            roles: false,
            stores: false,
            products: false,
            inventory: false,
            sales: false,
            exchanges: false,
            orders: false,
          },
        defaultItem: {
            name: '',
            users: false,
            roles: false,
            stores: false,
            products: false,
            inventory: false,
            sales: false,
            exchanges: false,
            orders: false,
          },
    }),
    computed: {
      formTitle () 
      {
        return this.editedIndex === -1 ? 'Nuevo Rol' : 'Editar Rol'
      },
      numberOfPages () {
        return Math.ceil(this.items.length / this.itemsPerPage)
      },
      filteredKeys () {
        return Object.keys(this.keys).filter(key => key !== 'name')
      },
      Keys () {
        console.log('keys: ' + Object.keys(this.keys))
        return Object.keys(this.keys)
      },
      Keys1 (){
        return Object.values(this.keys)
      },
      accountState()
      {
          if(this.editedItem.users)
          {
            return 'Habilitado'
          }
          else
          {
            return 'Deshabilitado'
          }
        
      },
      getPermission()
      {
        return  this.$store.state.userRole != 'Admin';
      }
    
    },
    watch: 
    {
      dialog (val) 
      {
        val || this.close()
      },
    },
    
    created(){
      this.initialize()
      console.log(Object.keys(this.keys))
    },
    methods: {
      initialize(){
        this.items = getRoles()
      },
      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },
      close () 
      {
        this.dialog = false
        this.$refs.form.reset()
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete () 
      {  
        this.$nextTick(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      editItem(item){
        console.log('edit'+item.name)
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) 
      {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        let msg = 'Esta por eliminar el rol:'
        deleteAlert(msg, this.editedItem.name, this.deleteItemConfirm, this.closeDelete)
      },

      deleteItemConfirm () 
      {
        let roleId = this.items[this.editedIndex].id
        console.log('ID:' + roleId)
        deleteRole(roleId)
        this.items.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      save () 
      {
          const role = Object.assign({},this.editedItem)
          let msg = ''
          if(this.$refs.form.validate())
          {
            if (this.editedIndex > -1) 
            {
              Object.assign(this.items[this.editedIndex], this.editedItem)
              updateRole(role)
              msg = 'El rol "' + this.editedItem.name + '" fue actualizado con exito!'
            } 
            else 
            {
              this.items.push(role)
              addRole(role)
              msg = 'El rol "' + this.editedItem.name + '" fue creado con exito!'
            }
            this.close()
            createAlert(msg, 'success')
            this.$refs.form.reset()
          }
          
      }
    },
  }
</script>