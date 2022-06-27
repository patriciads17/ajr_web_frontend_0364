<template>
    <main> 
        <v-container fluid fill-height class="posisinya indigo lighten-3"> 
            <v-layout flex align-center justify-center> 
                <v-flex xs12 sm4 elevation-6>    
                    <v-card elevation="2" outlined shaped> 
                        <v-card-title class="yellow--text font-weight-bold" style="font-family: Akshar; font-size: 40px; align-self: center;">
                            <v-spacer></v-spacer>
                            <v-icon @click="back_index" large color="yellow" href="" end>mdi-close-box</v-icon>
                        </v-card-title>
                        <v-card-text class="pt-4"> 
                            <p class="cardtitle yellow--text font-weight-bold ml-3">Register Customer</p>
                            <v-row>
                                <v-col cols="7">
                                    <p class="hint mt-8 ml-5" style="align-self: center;">Please prepared 
                                        <v-tooltip right>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on"> <u> following documents </u></span>
                                            </template>
                                            <span v-html="item.title" v-for="(item, index) in items" :key="index">
                                                {{ item.title }}
                                            </span>
                                            </v-tooltip>
                                            before clicking the <strong>NEXT</strong> button.</p>
                                    <v-btn @click="dialog = true" class="btntext mt-5 ml-5 mb-5" color="error"> NEXT
                                        <v-icon dark>mdi-arrow-right-bold-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-img class="justify-center" :src="require('@/assets/ajr_regis_cust.png')" contain max-width="150px" max-height="150px"></v-img>
                                </v-col>
                            </v-row>
                        </v-card-text> 
                    </v-card>
                    <v-dialog v-model="dialog" persistent max-width="750px">
                        <v-card>
                        <v-card-title>
                            <span class="cardtitle">Register Customer</span> 
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <p class="cardsubtitle font-weight-bold ">1 - Personal Data</p>
                                <v-row>
                                    <v-col cols="3">
                                        <v-avatar size="180" style="margin-top: 30px; margin-left: -20px">
                                            <v-img v-if="preview_pp == null" :src="require('@/assets/nopp.png')"></v-img>
                                            <v-img v-if="preview_pp != null" :src="preview_pp"></v-img>
                                        </v-avatar>
                                        <v-btn small @click="onPickFile_pp" class="btntext" style="margin-left: 110px; margin-top: -80px;" fab dark color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input type="file" style="display: none" @change="upload_pp" ref="fileInput_pp"> 
                                    </v-col>
                                    <v-col>
                                        <v-text-field class="labeltxt" clearable label="Name" v-model="form.nama" :rules="fieldRules" required prepend-inner-icon="mdi-account-outline" hint="Using name that written on your ID card"></v-text-field> 
                                        <v-dialog ref="dialog" v-model="calendar" :return-value.sync="form.tgl_lahir" persistent width="290px">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field class="labeltxt" clearable v-model="form.tgl_lahir" label="Birth Date" prepend-inner-icon="mdi-calendar"  :rules="fieldRules" readonly v-bind="attrs" v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.tgl_lahir" scrollable>
                                                <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_lahir)">OK</v-btn>
                                                </v-date-picker>
                                        </v-dialog>
                                        <v-autocomplete class="labeltxt" v-model="form.gender" :items="genders" :rules="fieldRules" label="Gender" prepend-inner-icon="mdi-gender-male-female"></v-autocomplete>
                                    </v-col>
                                    <v-col>
                                        <v-text-field class="labeltxt" clearable label="Address" v-model="form.alamat" :rules="fieldRules" prepend-inner-icon="mdi-home" required></v-text-field>
                                        <v-text-field class="labeltxt" clearable label="E-mail" v-model="form.email" min="8" :rules="fieldRules" prepend-inner-icon="mdi-email-outline" required></v-text-field>
                                        <v-text-field class="labeltxt" clearable label="Phone Number" counter v-model="form.phonenum" min="12" :rules="fieldRules" prepend-inner-icon="mdi-cellphone" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn class="font-weight-bold" color="error" text @click="dialogConfirm = true; dialogType = 'Are you sure you want to cancel this registration? </br>If Yes, all data that has been filled in will be lost'"> Cancel </v-btn> 
                            <v-btn class="font-weight-bold" color="success" text @click="dialog2 = true"> Next </v-btn> 
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialog2" persistent max-width="600px">
                        <v-card>
                            <v-card-title>
                                <span class="cardtitle">Register Customer</span> 
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <p class="cardsubtitle font-weight-bold mb-8">2 - Requirement Documents</p> 
                                    <v-row>
                                        <v-col cols="6">
                                            <p class="cardtext black--text center--text">Identity Card</p>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn small @click="onPickFile_idCard" class="btntext" color="error">
                                                <v-icon dark>mdi-image-edit</v-icon>
                                            </v-btn>
                                            <input type="file" style="display: none" @change="upload_idCard" ref="fileInput_idCard">
                                        </v-col>
                                        <v-col>
                                            <v-btn v-if="preview_idCard != null" @click="fileHandler(preview_idCard)" class="btntext ml-2" small color="indigo">
                                                <v-icon color="yellow">mdi-file-document</v-icon>File
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="6">
                                            <p class="cardtext black--text">Driver License</p>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn small @click="onPickFile_sim" class="btntext" color="error">
                                                <v-icon dark>mdi-image-edit</v-icon>
                                            </v-btn>
                                            <input type="file" style="display: none" @change="upload_sim" ref="fileInput_sim">
                                        </v-col>
                                        <v-col >
                                            <v-btn v-if="preview_sim != null" @click="fileHandler(preview_sim)" class="btntext ml-2" small color="indigo">
                                                <v-icon color="yellow">mdi-file-document</v-icon>File
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn class="font-weight-bold" color="indigo" text @click="dialog2 = false"> Back </v-btn>
                            <v-btn class="font-weight-bold" color="error" text @click="dialogConfirm = true; dialogType = 'Are you sure you want to cancel this registration? </br>If Yes, all data that has been filled in will be lost'"> Cancel </v-btn> 
                            <v-btn class="font-weight-bold" color="success" text @click="dialogConfirm = true; dialogType = 'Are you sure have filled in the correct and appropriate data?'"> Register </v-btn> 
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogImage" persistent max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Preview File</span>
                        </v-card-title>
                        <v-img :src="imgUrl" aspect-ratio="0.9" contain class="mx-5"></v-img>
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn class="font-weight-bold" color="error" text @click="dialogImage = false"> Close </v-btn> 
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                        <v-card>
                            <v-card-title>
                                <span class="headline"> Warning! </span>
                            </v-card-title>
                            <v-card-text class="dialogtext" v-html="dialogText"> {{ dialogText }}</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="font-weight-bold" color="indigo" text @click="dialogConfirm = false">Cancel</v-btn>
                                <v-btn class="font-weight-bold" color="error" text @click="setDialog">Yes</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-snackbar v-model="snackbar" :color="color" timeout="5000" style="font-family: Rubik" top>{{ error_message }}
                        <template v-slot:action="{ attrs }">
                            <v-btn color="yellow" text v-bind="attrs" v-if="mark==false" style="font-family: Rubik" @click="goto_login">LOGIN</v-btn>
                        </template>
                    </v-snackbar> 
                </v-flex> 
            </v-layout> 
        </v-container> 
    </main>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .labeltxt{
        font-family: Rubik;
    }

    .cardtitle{
        font-family: Rubik;
        font-size: 30px;
    }

    .hint{
        font-family: Rubik;
        font-size: 15px;
    }

    .iconedit2{ 
        top:-10px;
        left: 300px; 
    }

    .btntext{
        font-family: Rubik;
        font-weight: bold;
    }
    .posisinya{
        position: absolute; 
        top: 0px; 
        left: 0; 
        right: 0;
    }

    .formtxt{
        font-family: Rubik;
    }

    .headline{
        font-family: Akshar;
    }

    .cardsubtitle{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
        color: #FDD835;
    }

    .cardtext{
        font-family: Rubik;
        font-size: 15px;
    }

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }

    .dialogtext{
        font-family: Rubik;
        color: black;
    }

    .btntext{
        font-family: Rubik;
        font-weight: bold;
    }
</style>

<script> 
    export default {
        name: "RegisterCustomer",
        data() { 
            return {
                snackbar: false,
                error_message: '',
                calendar: false,
                color: '',
                dialog: false, 
                dialog2: false,
                dialogImage: false,
                dialogConfirm: false,
                items: [
                    { title: '<li>Identity Card</li>' },
                    { title: '<li>Driver License</li>' },
                ],
                user: new FormData,
                form: { 
                    nama: null,
                    tgl_lahir: null,
                    phonenum: null,
                    alamat: null,
                    gender: null,
                    email: null,
                    url_pp: null,
                    url_sim: null,
                    url_idCard: null,
                }, 
                genders: ['Female','Male'],
                btnShow: false,
                btnEdit_pp : false,
                btnEdit_sim : false,
                btnEdit_idCard : false,
                field: '', 
                fieldRules: [(v) => !!v || 'Cannot Be Empty!',],
                preview_pp: null,
                preview_sim: null,
                preview_idCard: null,
                mark:false,
                imgUrl:null,
                dialogType: null,
            };
        },
        
        methods: { 
            setDialog(){
                if(this.dialogType == 'Are you sure you want to cancel this registration? </br>If Yes, all data that has been filled in will be lost'){
                    this.dialog = false;
                    this.dialog2 = false;
                    this.dialogConfirm = false;
                    this.clear();
                }else if(this.dialogType == 'Are you sure have filled in the correct and appropriate data?'){
                    var today = new Date();
                    const diffTime = Math.abs(today - new Date(this.form.tgl_lahir));
                    const diffYear = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365)); 
                    if(diffYear < 17){
                        this.error_message = "You can not register because you are under 17 y.o"; 
                        this.color = "error"; 
                        this.snackbar = true; 
                        this.dialog = false;
                        this.dialog2 = false;
                        this.dialogConfirm = false;
                        this.dialogConfirm = false;
                        this.mark = true;
                        this.close_form();
                        this.clear();
                        this.mark = true;
                    }else{
                        this.register();
                        this.dialog = false;
                        this.dialog2 = false;
                        this.dialogConfirm = false;
                        this.dialogConfirm = false;
                    }
                   
                }
            },
            
            register() {
                this.user.append('nama_customer', this.form.nama); 
                this.user.append('email', this.form.email); 
                this.user.append('tgl_lahir_customer', this.form.tgl_lahir);
                this.user.append('no_telp_customer', this.form.phonenum);
                this.user.append('gender_customer', this.form.gender); 
                this.user.append('alamat_customer', this.form.alamat); 
                this.user.append('url_tanda_pengenal', this.form.url_idCard);
                this.user.append('url_pp_customer', this.form.url_pp); 
                this.user.append('url_sim_customer', this.form.url_sim); 
                    this.$http.post(this.$api + '/register', this.user,{
                    }).then(response => {
                        this.error_message = response.data.message; 
                        this.color = "green"; 
                        this.snackbar = true; 
                        this.close_form();
                    }).catch(error => {
                        this.error_message = error.response.data.message; 
                        this.color = "red"; 
                        this.snackbar = true;  
                        this.load = false;
                    })
            },

            goto_login(){
                this.snackbar = false;
                this.$router.push({
                    name: 'LoginPage', 
                });
            },

            close_form() {
                this.$router.push({
                    name: 'RegisterCustomer', 
                }); 
            },

            clear() {
                this.form = { 
                    nama: null,
                    tgl_lahir: null,
                    phonenum: null,
                    alamat: null,
                    gender: null,
                    email: null,
                    url_pp: null,
                    url_sim: null,
                    url_idCard: null,
                }
            },

            fileHandler(url){
                this.imgUrl = url;
                this.dialogImage = true;
            },

            back_index() {
                this.$router.push({
                    name: 'IndexPage', 
                }); 
            },

            onPickFile_pp() {
                this.btnEdit_pp = true;
                this.$refs.fileInput_pp.click();
            },

            upload_pp(event) {
                let url = event.target.files[0];
                this.form.url_pp = url;
                this.preview_pp = URL.createObjectURL(url);
            },

            onPickFile_sim() {
                this.btnEdit_sim = true;
                this.$refs.fileInput_sim.click();
            },

            upload_sim(event) {
                let url = event.target.files[0];
                this.form.url_sim = url;
                this.preview_sim = URL.createObjectURL(url);
            },

            onPickFile_idCard() {
                this.btnEdit_idCard = true;
                this.$refs.fileInput_idCard.click();
            },

            upload_idCard(event) {
                let url = event.target.files[0];
                this.form.url_idCard = url;
                this.preview_idCard = URL.createObjectURL(url);
            },

        },

        computed: {
            dialogText() {
                return this.dialogType;
            },
        },
    };
</script>