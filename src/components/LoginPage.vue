<template>
    <div> 
        <v-container fluid fill-height class="posisinya indigo lighten-3 "> 
            <v-layout flex align-center justify-center> 
                <v-flex xs12 sm4 elevation-6>    
                    <v-card elevation="2" outlined shaped> 
                        <v-card-title class="yellow--text">Sign In
                            <v-spacer></v-spacer>
                            <v-icon @click="close_form" large color="yellow" end>mdi-close-box</v-icon>
                        </v-card-title>
                        <v-card-text class="pt-4"> 
                            <div> 
                                <v-form v-model="valid" ref="form">
                                    <v-text-field clearable label="E-mail" v-model="email" :rules="emailRules" required prepend-inner-icon="mdi-email-outline"></v-text-field> 
                                    <v-text-field clearable label="Password" v-model="password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" @click:append="show = !show" min="8" :rules="passwordRules" counter  prepend-inner-icon="mdi-onepassword" hint="For 1st time login use birth date with format YYYY-MM-DD" required></v-text-field>
                                    <v-layout class="mt-9">
                                        <v-btn @click="login" class="yellow primary--text font-weight-bold" block depressed rounded elevation="7">LOGIN</v-btn>
                                    </v-layout> 
                                </v-form> 
                            </div> 
                        </v-card-text> 
                    </v-card>
                    <V-snackbar v-model="snackbar"  style="font-family: Rubik" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar> 
                </v-flex> 
            </v-layout> 
        </v-container> 
    </div> 
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .body{
       
        background-size: inherit;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    
    .yellow{
        font-family: Rubik;
    }

    .yellow--text{
        font-family: "Akshar";
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
        name: "LoginPage", 
        data() { 
            return {
                load: false, 
                snackbar: false, 
                error_message: '', 
                show: false,
                color: '', 
                valid: false, 
                password: '', 
                passwordRules: [
                    (v) => !!v || 'Password Cannot Be Empty!',
                ],
                email: '', 
                emailRules: [
                    (v) => !!v || 'E-mail Cannot Be Empty!',
                ]
            };
        },

        methods: { 
            login() { 
                if(this.$refs.form.validate()) {
                    this.load = true; 
                    this.$http.post(this.$api + '/login', {
                        email: this.email,
                        password: this.password 
                    }).then(response => {
                        localStorage.setItem('id', response.data.user.id); 
                        localStorage.setItem('token', response.data.access_token); 
                        if(response.data.user.status_akun != 'Deleted' || response.data.user.idRole == 'MGR' || response.data.user.idRole == 'ADM' || response.data.user.idRole == 'CSV' ){
                            this.error_message = response.data.message; 
                            this.color = "green"; 
                            this.snackbar = true; 
                            this.load = false; 
                            this.clear(); 
                            if(response.data.user.idRole == 'MGR'){
                                localStorage.setItem('idRole', response.data.user.idRole); 
                                this.$router.push({
                                name: 'ManagerPage', 
                                }); 
                            }
                            else if(response.data.user.idRole == 'ADM'){
                                localStorage.setItem('idRole', response.data.user.idRole); 
                                this.$router.push({
                                name: 'AdminPage', 
                                }); 
                            }
                            else if(response.data.user.idRole == 'CSV'){
                                localStorage.setItem('idRole', response.data.user.idRole); 
                                this.$router.push({
                                name: 'CSPage', 
                                }); 
                            } 
                            else{
                                this.$router.push({
                                name: 'CustomerPage', 
                                }); 
                            }
                        }else if(response.data.user.status_akun == 'Deleted'){
                            this.error_message = 'Login Failed!'; 
                            this.color = "error"; 
                            this.snackbar = true; 
                            this.load = false; 
                            this.clear(); 
                        }

                        
                    }).catch(error => {
                        this.error_message = error.response.data.message; 
                        this.color = "red"; 
                        this.snackbar = true; 
                        localStorage.removeItem('token'); 
                        this.load = false;
                    })
                }
            },

            clear() {
                this.$refs.form.reset()
            },

            close_form() {
                this.$router.push({
                    name: 'IndexPage', 
                }); 
            }
        },
    };
</script>
