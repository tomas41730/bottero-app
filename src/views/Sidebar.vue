<template>
  <div id="app">
    <v-app id="inspire">
      <v-list-item-title class="text-h6 Black--text">BOTTERO
        <v-list-item-subtitle>No cuenta con autorizacion para esta pagina</v-list-item-subtitle>
      </v-list-item-title>
    </v-app>
  </div> 
</template>

<script>

export default {

  data: () => ({

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


