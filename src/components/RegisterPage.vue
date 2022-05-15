<template>
    <main> 
        <v-container fluid fill-height class="posisinya indigo accent-1"> 
            <v-layout flex align-center justify-center> 
                <v-flex xs12 sm4 elevation-6>    
                    <v-card elevation="2" outlined shaped> 
                        <v-card-title class="yellow--text">Sign Up
                            <v-spacer></v-spacer>
                            <v-icon @click="close_form" large color="yellow" href="" end>mdi-close-box</v-icon>
                        </v-card-title>
                        <v-card-text class="pt-4"> 
                            <div> 
                                <v-form v-model="valid" ref="form">
                                    <v-text-field clearable label="Name" v-model="name" :rules="nameRules" required prepend-inner-icon="mdi-account-outline" hint="Using name that written on your ID card"></v-text-field> 
                                    <v-text-field clearable label="E-mail" v-model="email" min="8" :rules="emailRules" prepend-inner-icon="mdi-email-outline" required></v-text-field>
                                    <v-dialog ref="dialog" v-model="calendar" :return-value.sync="date" persistent width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field clearable v-model="date" label="Birth Date" prepend-inner-icon="mdi-calendar"  :rules="dateRules" readonly v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" scrollable>
                                            <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                    <v-layout class="mt-9">
                                        <v-btn @click="regis" class="yellow primary--text font-weight-bold" block depressed rounded elevation="7">REGISTER</v-btn>
                                    </v-layout> 
                                </v-form> 
                            </div> 
                        </v-card-text> 
                    </v-card>
                    <V-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar> 
                </v-flex> 
            </v-layout> 
        </v-container> 
    </main>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .yellow--text{
        font-family: Akshar;
        font-weight: bold;
        font-size: 40px;
        align-self: center;
    }
    .posisinya{
        position: absolute; 
        top: 0px; 
        left: 0; 
        right: 0;
    }
</style>

<script> 
    export default {
        name: "RegisterPage", 
        data() { 
            return {
                load: false, 
                snackbar: false, 
                error_message: '',
                calendar: false,
                user: new FormData, 
                color: '', 
                valid: false, 
                name: '', 
                nameRules: [
                    (v) => !!v || 'Name Cannot Be Empty!',
                ],
                date: '', 
                dateRules: [
                    (v) => !!v || 'Birth Date Cannot Be Empty!',
                ],
                email: '', 
                emailRules: [
                    (v) => !!v || 'Email Cannot Be Empty!',
                ]
            };
        },

        methods: { 
            regis() {
                this.user.append('nama_customer', this.name); 
                this.user.append('email', this.email); 
                this.user.append('tgl_lahir_customer', this.date);

                if(this.$refs.form.validate()) {
                    this.load = true; 
                    this.$http.post(this.$api + '/register', {
                        nama_customer: this.name,
                        email: this.email,
                        tgl_lahir_customer: this.date 
                    }).then(response => {
                        this.error_message = response.data.message; 
                        this.color = "green"; 
                        this.snackbar = true; 
                        this.load = false; 
                        this.clear(); 
                        this.$router.push({
                            name: 'LoginPage', 
                        }); 
                    }).catch(error => {
                        this.error_message = error.response.data.message; 
                        this.color = "red"; 
                        this.snackbar = true;  
                        this.load = false;
                    })
                }
            },

            clear() {
                this.$refs.form.reset()
            },

            cancel(){
                this.$router.push({
                    name: 'Login', 
                }); 
            },

            close_form() {
                this.$router.push({
                    name: 'IndexPage', 
                }); 
            }
        },
    };
</script>