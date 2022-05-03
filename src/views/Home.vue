<template>
<v-col>
  <v-row>
    <v-col>
      <v-card class="mx-auto text-center" color="green" dark max-width="300">
            <v-icon size="200">
              mdi-cash-multiple
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/dailyReport'">
            VENTAS DEL DIA
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="primary" dark max-width="300">
            <v-icon size="200">
              mdi-cart
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/sales'">
            VENTAS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="success" dark max-width="300">
            <v-icon size="200">
              mdi-clipboard-arrow-right-outline
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/transfers'">
            TRASPASOS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card class="mx-auto text-center" color="orange" dark max-width="300">
            <v-icon size="200">
              mdi-shoe-heel
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/inventory'">
            INVENTARIO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="deep-orange darken-1" dark max-width="300">
            <v-icon size="200">
              mdi-shield-account
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/roles'">
            ROLES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="blue-grey lighten-1" dark max-width="300">
            <v-icon size="200">
              mdi-account-group-outline
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/users'">
            USUARIOS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card class="mx-auto text-center" color="teal darken-1" dark max-width="300">
            <v-icon size="200">
              mdi-account-group-outline
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/customers'">
            CLIENTES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="blue-grey darken-4" dark max-width="300">
            <v-icon size="200">
              mdi-tools
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/batchChanges2'">
            Cambios por lote
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="red lighten-2" dark max-width="300">
            <v-icon size="200">
              mdi-table-edit
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/stores'">
            Sucursales, Marcas, Colores, etc.
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card class="mx-auto text-center" color="indigo darken-2" dark max-width="300">
            <v-icon size="200">
              mdi-chart-areaspline
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/salesControl'">
            REPORTE DE VENTAS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="teal darken-4" dark max-width="300">
            <v-icon size="200">
              mdi-chart-areaspline
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/reservesControl'">
            REPORTE DE RESERVAS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto text-center" color="deep-orange lighten-1" dark max-width="300">
            <v-icon size="200">
              mdi-chart-areaspline
            </v-icon>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn block text :to="'/transfersControl'">
            REPORTE DE TRASPASOS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</v-col>
  
</template>

<script>
// import db from '../services/firebase';
  export default {
    name: 'Home',
    components: {
    },
    data: () => ({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    }),
    created()
    {
      this.initialize();
    },
    methods:{
      initialize()
      {
        console.log(this.date);
        // db.collection('products').get().then( snapshot => 
        // {
        //   snapshot.docs.forEach( doc => 
        //   {
        //     db.collection('products').doc(doc.id).update( {store: doc.data().store.toString()})
        //   })
        // })
      }
    }
  }
</script>
