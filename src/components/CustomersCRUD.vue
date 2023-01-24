<template>
  <v-card class="mx-auto" outlined>
    <v-data-table :headers="headers" :items="customers" :search="search" sort-by="name" class="elevation-1">
      <template v-slot:top>
            <v-toolbar dark color="black" class="mb-1">
                <v-col>
                    <v-toolbar-title v-text="'CLIENTES'" class="text-h3"></v-toolbar-title>
                </v-col>
                <v-col>
                    <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search"></v-text-field>
                </v-col>
                <v-col md="1">
                        <v-btn color="yellow accent-4" class="mx-2" @click="addItem" fab dark small >
                            <v-icon dark>
                            mdi-plus
                            </v-icon>
                        </v-btn>
                </v-col>
            </v-toolbar>
          <v-dialog v-model="dialog" max-width="500px">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card>
                <v-toolbar color="black" dark>
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title v-text="title"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-list-item-avatar  max-width="70px">
                        <v-img max-width="50px" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2Flogo.png?alt=media&token=ec2d4d87-9102-4ae0-8328-e52154af033d"></v-img>
                    </v-list-item-avatar>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="customer.ci" :readonly="isToAdd" label="CI" :rules="[v => !!v || 'Este campo es requerido.']" required></v-text-field>
                            <v-text-field v-model="customer.name" :readonly="isToRemove" label="Nombre"></v-text-field>
                            <v-text-field v-model="customer.email" :readonly="isToRemove" label="Email"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="customer.lastname" :readonly="isToAdd" label="Apellido" :rules="[v => !!v || 'Este campo es requerido.']" required></v-text-field>
                            <v-text-field v-model="customer.phone" :readonly="isToRemove" label="Celular"></v-text-field>
                            <v-menu v-model="menuBirthday" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="date" label="Picker without buttons" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="customer.birthday" :readonly="isToRemove" @input="onBirthdayChanged"></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close" error>
                    Cancelar
                  </v-btn>
                  <v-btn v-if="!isToRemove" color="primary" text @click="save" primary>
                    Guardar
                  </v-btn>
                  <v-btn v-else color="primary" text @click="deleteCustomer" primary>
                    Eliminar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
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
import { addCustomer, getCustomers } from '../services/firestore/FirebaseCustomers'
import { format, parseISO } from 'date-fns'
import db from '../services/firebase'

  export default 
  {
    data: () => 
    ({
        valid: true,
        dialog: false,
        dialogDelete: false,
        search: '',
        headers: [
            { text: 'CI', align: 'start', value: 'ci' },
            { text: 'Nombre', value: 'name' },
            { text: 'Apellido', value: 'lastname' },
            { text: 'Celular', value: 'phone' },
            { text: 'Correo', value: 'email' },
            { text: 'Cumpleaños', value: 'birthday' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        defaultItem: {
            ci: '',
            name: null,
            lastname: '',
            email: null,
            phone: null,
            birthday: null
            },
        customer: {
            ci: '',
            name: null,
            lastname: '',
            email: null,
            phone: null,
            birthday: null
            },
        customerIndex: -1,
        title: '',
        date: null,
        isToRemove: false,
        isToAdd: false,
        customers: [],
        menuBirthday: false,
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
      
    },

    watch: {
    },

    created () 
    {
      this.initialize()
    },

    methods: 
    {
        initialize () 
        {
            this.customers = getCustomers();
        },
        addItem()
        {
            this.customer = {};
            this.customer.birthday =  new Date(Date.now()).toISOString().substr(0, 10);
            this.date = format(parseISO(this.customer.birthday), 'd/M/yyyy');
            this.dialog = true;
            this.title = 'Agregar Nuevo Cliente';
        },
        editItem (item) 
        {
            this.isToAdd = true;
            this.dialog = true;
            this.title = 'Actualizar Informacion del Cliente';
            this.customer = item;
            this.customerIndex = this.customers.indexOf(item);
            this.customer.birthday =  new Date(this.customer.birthday).toISOString().substr(0, 10);
            this.date = format(parseISO(this.customer.birthday), 'd/M/yyyy');
        },
        deleteItem (item) 
        {
            this.isToRemove = true;
            this.dialog = true;
            this.title = 'Eliminar Cliente';
            this.customer = item;
            this.customerIndex = this.customers.indexOf(item);
            this.customer.birthday =  new Date(this.customer.birthday).toISOString().substr(0, 10);
            this.date = format(parseISO(this.customer.birthday), 'd/M/yyyy');
        },
        close()
        {
            this.dialog = false;
            this.customer = {};
            this.isToRemove = false;
        },
        save () 
        {
            console.log(this.customer)
            if(this.$refs.form.validate())
            {
                
                addCustomer(this.customer);
                this.dialog = false;
                if(this.customerIndex > -1) 
                {
                    Object.assign(this.customers[this.customerIndex], this.customer)
                }
                else
                {
                    this.customers.push(Object.assign({}, this.customer));
                }
                this.isToAdd = false;
                this.customer = {};
            }
        },
        deleteCustomer()
        {
            console.log(this.customer);
            db.collection('customers').doc(this.customer.ci).delete();
            this.dialog = false;
            this.isToRemove = false;
            this.customers.splice(this.customerIndex, 1);
            this.customer = this.defaultItem;
            this.customer = {};
        },
        onChange()
        {
            
        },
        onBirthdayChanged()
        {
            this.customer.birthday =  new Date(this.customer.birthday).toISOString().substr(0, 10);
            this.date = format(parseISO(this.customer.birthday), 'd/M/yyyy');
            console.log('Customer: ' + this.customer.birthday);
            console.log('date: ' + this.date);
            this.menuBirthday = false;
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