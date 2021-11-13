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
      <v-navigation-drawer
        v-model="drawer"
        absolute
        dark
        temporary
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2Flogo.png?alt=media&token=3104e203-0e98-4354-86d0-9aa05b5a290e"></v-img>
          </v-list-item-avatar>
  
          <v-list-item-title class="text-h6 yellow--text">BOTTERO
            <v-list-item-subtitle>GESTION COMERCIAL</v-list-item-subtitle>
            <!--<span v-if="loggedIn">Online</span>
            <span v-else>Ofline</span>-->
          </v-list-item-title>
          
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense>
            <v-list-group color="yellow" :value="true" prepend-icon="mdi-shoe-heel" no-action>
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
        <v-list dense>
            <v-list-group color="yellow" :value="true" prepend-icon="mdi-cart" no-action>
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
        <v-list dense>
            <v-list-group color="yellow" :value="true" prepend-icon="mdi-account-circle" no-action>
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
        <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Logout
          </v-btn>
        </div>
      </template>
      </v-navigation-drawer>
    </v-app>
  
  </div> 
     
</template>

<script>

export default {

  data: () => ({
    drawer: false,
    accountItems: [
        { title: 'USUARIOS', icon: 'mdi-account-group-outline', path: '/users'},
        { title: 'ROLES', icon: 'mdi-shield-account', path: '/roles'},
      ],
    productItems: [
        { title: 'INVENTARIO', icon: 'mdi-clipboard-text-multiple-outline', path: '/inventory'},
        { title: 'CAMBIOS POR LOTE', icon: 'mdi-package-variant-closed', path: '/batchChanges'},
        { title: 'SUCURSALES', icon: 'mdi-home-city', path: '/stores'}
    ],
    salesItems: [
        { title: 'DASHBOARD', icon: 'mdi-view-dashboard', path: '/'},
        { title: 'VENTAS', icon: 'mdi-chart-line', path: '/'},
        { title: 'TRASPASOS', icon: 'mdi-clipboard-arrow-right-outline', path: '/'}
    ],








    // items: [
    //     { title: 'PRINCIPAL', icon: 'mdi-view-dashboard', path: '/'},
    //     { title: 'SUCURSALES', icon: 'mdi-home-city', path: 'stores'},
    //     { title: 'USUARIOS', icon: 'mdi-account-group-outline', path: '/users', items: [{ title: 'List Item' }],},
    //     { title: 'ROLES', icon: 'mdi-shield-account', path: '/roles'},
    //     { title: 'INVENTARIO', icon: 'mdi-shoe-heel', path: '/inventory'},
    //     { title: 'CAMBIOS POR LOTE', icon: 'mdi-shoe-heel', path: '/batchChanges'},
    //   ],
  }),
  created(){
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
  methods: {
   
  }
};
</script>


