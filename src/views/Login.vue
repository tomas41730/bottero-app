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
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="email" id = "login" label="Usuario" name="login" type="email"/>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Contraseña" hint="Contraseña" counter @click:append="show1 = !show1"></v-text-field>
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
import { getRoleById } from '../services/firestore/FirebaseRoles';
import { getUserByEmail } from '../services/firestore/FirebaseUsers';
  export default {
    name : 'Login',
    data: () => 
    ({
        email: '',
        password: '',
        error: '',
        dialog: true,
        show1: false,
        rules: {
          required: value => !!value || 'Required.',
          emailMatch: () => (`The email and password you entered don't match`),
        },
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
                        this.$store.state.userIdRole = doc.data().idRole;
                        getRoleById(doc.data().idRole).then(doc => {
                            this.$store.state.salesGuard = doc.data().sales; 
                        });
                    });
                });
                this.$router.replace({name: 'Home'});
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