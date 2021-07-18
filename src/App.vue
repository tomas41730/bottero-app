<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar
        color="yellow"
        app
        dark
      >
        <v-app-bar-nav-icon @click.stop="drawer= !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class="text-h4 yellow--text"></v-toolbar-title>
        <v-list-item-avatar tile size="230">
            <v-img src="http://www.agenciaenlink.com.br/wp-content/uploads/2015/03/Bottero-logo.png"></v-img>
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
            <v-img src="https://static.interbankbenefit.pe/public/web/images/marca/ficha-tecnica/bottero-ficha-tecnica.png"></v-img>
          </v-list-item-avatar>
  
          <v-list-item-title class="text-h6 yellow--text">BOTTERO
            <v-list-item-subtitle>GESTION COMERCIAL</v-list-item-subtitle>
          </v-list-item-title>
          
          <v-btn
            icon
            @click.stop="drawer = !drawer"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.path"
            link
            
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title >{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-container>
        <v-row>
          <v-col>
            <v-content transition="slide-x-transition">
            <router-view></router-view>
        </v-content>
          </v-col>
        </v-row>
      </v-container>
      
    </v-app>
  
  </div> 
     
</template>

<script>
import Vuetify from 'vuetify';
export default {
  name: 'App',
  vuetify: new Vuetify(),
  data: () => ({
    drawer: false,
    items: [
        { title: 'PRINCIPAL', icon: 'mdi-view-dashboard', path: '/'},
        { title: 'SUCURSALES', icon: 'mdi-home-city', path: 'about'},
        { title: 'USUARIOS', icon: 'mdi-account-group-outline', path: '/users'},
      ],
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
};
</script>