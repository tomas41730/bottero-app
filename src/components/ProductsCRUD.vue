<template>
  <div id="app">
  <v-app id="inspire">
    <v-card
      class="mx-auto"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-4">
            Referencia
          </div>
          <v-list-item-title class="text-h5 mb-1">
            Codigo calzado
          </v-list-item-title>
          <v-list-item-subtitle>Talla</v-list-item-subtitle>
          <v-list-item-subtitle>Color</v-list-item-subtitle>
          <v-list-item-subtitle>Precio</v-list-item-subtitle>
          <v-list-item-subtitle>Descripcion</v-list-item-subtitle>
          <v-list-item-subtitle>Sucursal</v-list-item-subtitle>
        </v-list-item-content>
  
        <v-list-item-avatar tile size="300">
          <v-img src="https://i.pinimg.com/736x/8a/7f/5a/8a7f5ab67f311c75f2d53988754b0258.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>
  
      <v-card-actions>
        <v-btn
          outlined
          rounded
          text
        >
          Button
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</div>
</template>
<script>
  export default {
    data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: false,
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>