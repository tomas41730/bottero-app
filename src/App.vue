<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar color="yellow" app dark>
        <v-app-bar-nav-icon @click.stop="drawer= !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class="text-h4 yellow--text"></v-toolbar-title>
        <v-list-item-avatar tile size="230">
            <v-img src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2FBottero-letras-logo.png?alt=media&token=d827a340-db0f-4dbf-bd0f-59f88752455b"></v-img>
        </v-list-item-avatar>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" absolute dark temporary disable-resize-watcher app>
        
        <v-system-bar>
          
          <span class="pa-17 text-center align-self-center"> {{ getSalesGuard }} </span>
        </v-system-bar>
        <v-list-item class="px-0">
          <v-col>
            <v-list-item-avatar>
              <v-img src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e"></v-img>
            </v-list-item-avatar>
          </v-col>
         <v-col>
            <v-row>
              <v-list-item-title class="text-h6 yellow--text">BOTTERO
                <v-list-item-subtitle>GESTION COMERCIAL</v-list-item-subtitle>
              </v-list-item-title>
              <v-divider></v-divider>
            </v-row>
            <v-row>
              <v-list-item-subtitle v-if="loggedIn">ONLINE</v-list-item-subtitle>
              <v-list-item-subtitle v-else>OFFLINE</v-list-item-subtitle>
            </v-row>
         </v-col>          
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          
        </v-list-item>
        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item-group color="yellow">
            <v-list-item v-for="(item, i) in items" :key="i" :to="item.path">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-list nav dense>
            <v-list-group color="yellow" :value="false" prepend-icon="mdi-shoe-heel" no-action>
                <template v-slot:activator>
                    <v-list-item-title>PRODUCTOS</v-list-item-title>
                </template>
                    <v-list-item v-for="item in productItems" :key="item.title" :to="item.path" link>
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-group>
        </v-list>
        <v-list nav dense>
            <v-list-group color="yellow" :value="false" prepend-icon="mdi-account-circle" no-action>
                <template v-slot:activator>
                    <v-list-item-title>CUENTAS</v-list-item-title>
                </template>
                <v-list-item v-for="item in accountItems" :key="item.title" :to="item.path" link>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-group>
        </v-list>
        <v-list nav dense>
            <v-list-group color="yellow" :value="false" prepend-icon="mdi-cart" no-action>
                <template v-slot:activator>
                    <v-list-item-title>VENTAS</v-list-item-title>
                </template>
                <v-list-item v-for="item in salesItems" :key="item.title" :to="item.path" link>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-group>
        </v-list>
        <v-list nav dense>
            <v-list-group color="yellow" :value="false" prepend-icon="mdi-chart-line" no-action>
                <template v-slot:activator>
                    <v-list-item-title>REPORTES</v-list-item-title>
                </template>
                <v-list-item v-for="item in reportsItems" :key="item.title" :to="item.path" link>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-group>
        </v-list>
        <template v-slot:append>
          <v-divider></v-divider>
        <div class="pa-5">
              <v-list-item  three-line>
                <v-list-item-content class="text-center align-self-center">
                  <v-list-item-title class="text-h6">
                    {{ getName }} {{ getLastname }}
                  </v-list-item-title>
                  <v-list-item-title class="text-h6">
                    {{ getStore }}
                  </v-list-item-title>
                  <v-list-item-subtitle> {{ getRole }} </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>  
        
          <v-btn block @click="signOut">
            Cerrar Sesión
          </v-btn>
        </div>
      </template>
      </v-navigation-drawer>
      <v-container>
        <v-row>
          <v-col>
            <v-main transition="slide-x-transition">
              <router-view></router-view>
            </v-main>
          </v-col>
        </v-row>
      </v-container>
      
    </v-app>
  
  </div> 
     
</template>

<script>
import Vuetify from 'vuetify';
import { auth } from './services/firebase';

export default {
  name: 'App',
  vuetify: new Vuetify(),

  data: () => ({
    drawer: false,
    accountItems: [
        { title: 'USUARIOS', icon: 'mdi-account-group-outline', path: '/users'},
        { title: 'ROLES', icon: 'mdi-shield-account', path: '/roles'},
        { title: 'CLIENTES', icon: 'mdi-account-group-outline', path: '/customers'},
      ],
    productItems: [
        { title: 'REGISTRO DE PRODUCTOS', icon: 'mdi-clipboard-text-multiple-outline', path: '/inventory'},
        { title: 'SUBINVENTARIO', icon: 'mdi-clipboard-text-multiple-outline', path: '/subinventory'},
        { title: 'CAMBIOS POR LOTE', icon: 'mdi-package-variant-closed', path: '/batchChanges2'},
        { title: 'SUCURSALES', icon: 'mdi-home-city', path: '/stores'}
    ],
    salesItems: [
        { title: 'VENTAS', icon: 'mdi-chart-line', path: '/sales'},
        { title: 'TRASPASOS', icon: 'mdi-clipboard-arrow-right-outline', path: '/transfers'}, 
    ],
    reportsItems: [
        { title: 'VENTAS', icon: 'mdi-chart-line', path: '/salesControl'},
        { title: 'RESERVAS', icon: 'mdi-chart-line', path: '/reservesControl'},
        { title: 'TRASPASOS', icon: 'mdi-chart-line', path: '/transfersControl'},
    ],
    items: [
        { title: 'MENU PRINCIPAL', icon: 'mdi-view-dashboard', path: '/'},
        { title: 'VENTAS DEL DIA', icon: 'mdi-cash-multiple', path: '/dailyReport' },
      ],
    loggedIn: false
  }),
  created(){
    auth.onAuthStateChanged(user => {
      if(user){
        this.loggedIn = true;
      }
      else
      {
        this.loggedIn = false;
      }
    });
    //console.log(this.$store.state.userEmail)
  },
  computed: 
    {
      getEmail()
      {
        return this.$store.state.userEmail;
      },
      getName()
      {
        return this.$store.state.userName;
      },
      getLastname()
      {
        return this.$store.state.userLastname;
      },
      getRole()
      {
        return this.$store.state.userRole;
      },
      getStore()
      {
        return this.$store.state.userStore;
      },
      getSalesGuard()
      {
        return this.$store.state.salesGuard;
      }
    },
  watch: {
    group () {
      this.drawer = false
    },
  },
  methods: {
   async signOut()
   {
     try
     {
       const data = await auth.signOut();
       console.log(data);
       this.$router.replace({name: 'Login'})
     }
     catch(err)
     {
       console.log(err)
     }
   }
  }
};
</script>


