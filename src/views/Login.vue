<template>
    <div id = "app" class = "back">
        <v-app id="inspire">
            <v-main>
                <v-container class="fill-height" fluid>
                    <v-dialog v-model="dialog" width="500px" persistent>
                        <v-card>
                            <v-card-title class="text-h5 yellow lighten-2">
                                <v-spacer></v-spacer>
                                    <v-img max-height="60" src="https://firebasestorage.googleapis.com/v0/b/botteroadmin.appspot.com/o/utilities%2FBottero-letras-logo.png?alt=media&token=39eee5e8-3611-4bc7-aad8-8e920b73d602"></v-img>
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
import { getUserByEmail } from '../services/firestore/FirebaseUsers';
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
                //this.$store.dispatch('setUserInfo', this.email);
                getUserByEmail(this.email).then(snap => {
                    snap.forEach(doc => {
                        this.$store.state.userEmail = doc.data().email;
                        this.$store.state.userName = doc.data().name;
                        this.$store.state.userLastname = doc.data().lastname;
                        this.$store.state.userStore = doc.data().store;
                        this.$store.state.userRole = doc.data().role;
                    })
                })
                this.$router.replace({name: 'Users'});
            },
            error => {
                alert(error);
            });
       }, 
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