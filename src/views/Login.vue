<template>
    <div id = "app" class = "back">
        <v-app id="inspire">
            <v-main>
                <v-container class="fill-height" fluid>
                    <v-dialog v-model="dialog" width="500px" persistent>
                        <v-card>
                            <v-card-title class="text-h5 yellow lighten-2">
                                <v-spacer></v-spacer>
                                    <v-img max-height="60" src="https://firebasestorage.googleapis.com/v0/b/bottero-app-3a25c.appspot.com/o/utilities%2FBottero-letras-logo.png?alt=media&token=d827a340-db0f-4dbf-bd0f-59f88752455b"></v-img>
                                <v-spacer/>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-form>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12"></v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="email" id = "login" label="Usuario" name="login" type="email"/>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="password" id="password" label="Contraseña" name="password" type="password"/>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn depressed color="primary" @click="signIn">
                                    Iniciar Sesion
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-container>
            </v-main>
        </v-app>
    </div>
</template>

<script>
import { auth } from '../services/firebase'
  export default {
    name : 'Login',
    data: () => 
    ({
        email: '',
        password: '',
        error: '',
        dialog: true
        
    }),

    methods: 
    {
       async signIn()
       {
           auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
                console.log(user.data);
                this.$router.replace({name: 'Batch-Products'});
            },
            error => {
                alert(error);
            });
       } 
    },
    mounted () 
    {

    },
    computed : 
    {

    },
    watch:
    {
      
    },
  }
</script>

<style scoped>

</style>