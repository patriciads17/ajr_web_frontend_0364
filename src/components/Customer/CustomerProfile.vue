<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-15">
            <v-row justify="center" class="mt-15">
                <v-form ref="form" v-model="valid">
                    <v-card append rounded outlined elevation="4" width="530px"  min-height="300px">
                        <v-row align="center" justify="center" class="mt-n5">
                            <v-card append color="primary" align="center" rounded outlined elevation="4" width="300px" height="50px">
                                <v-card-title class="cardTitle pa-0 my-2 justify-center"> {{cardtitle}} </v-card-title>
                            </v-card>
                        </v-row>
                        <v-row>
                            <v-col class="mt-10 ml-8 mr-4 mb-3" cols="3">
                                <v-avatar size="120">
                                    <v-img v-if="btnEdit == false" :src="$imgloader+customer.url_pp_customer"></v-img>
                                    <v-img v-if="btnEdit == true" :src="preview_pp"></v-img>
                                </v-avatar>
                                <v-btn v-if="btnEdit == true" x-small @click="onPickFile" class="iconedit ml-15 mt-n8" fab dark color="error">
                                    <v-icon dark>mdi-image-edit</v-icon>
                                </v-btn>
                                <input v-if="btnEdit == true" type="file" style="display: none" @change="upload_pp" ref="fileInput">
                            </v-col>
                            <v-col class="mt-6 mb-5">
                                <p class="datacust ma-1"> {{ customer.id }} </p>
                                <v-chip class="mb-3" color="success" outlined> 
                                    Customer
                                </v-chip>
                                <v-chip class="mb-3 mr-5" :color="getColorGender(customer.gender_customer)" outlined> 
                                    <v-icon left> {{ getIcon(customer.gender_customer) }} </v-icon> 
                                    {{ customer.gender_customer }} 
                                </v-chip>
                                <v-chip class="mb-3" :color="getColorAkun(customer.status_akun)" outlined> 
                                    {{ customer.status_akun }} 
                                </v-chip>
                            </v-col>
                            <v-col class="mt-9 ml-10" cols="3">
                                <v-row>
                                    <v-btn class="my-10" v-if="btnEdit == false" @click.stop="btnEdit = !btnEdit" rounded outlined color="indigo">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row>
                                    <v-btn v-if="btnEdit == false" @click="removeAccountHandler" rounded outlined color="error">
                                        <v-icon>mdi-account-remove</v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row>
                                    <v-btn class="my-10" v-if="btnEdit == true" @click="dialogConfirm = true ; dialogType = 'Are you sure you want to save these changes?'" rounded outlined color="success">
                                        <v-icon>mdi-check-bold</v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row>
                                    <v-btn  v-if="btnEdit == true" @click="dialogConfirm = true ; dialogType = 'Are you sure you want to cancel these changes?'" rounded outlined color="error">
                                        <v-icon>mdi-close-thick</v-icon>
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-divider class="mx-4"></v-divider>
                        <v-row class="my-2 mx-5">                    
                            <v-col cols="12" sm="12">
                                <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="customer.nama_customer" label="Name" :readonly="btnEdit == false"></v-text-field>
                                <v-autocomplete v-if="btnEdit == true" background-color="yellow" :items="genders" label="Gender" v-model="customer.gender_customer" filled dense class="pa-0 mb-0" rounded></v-autocomplete>
                                <v-dialog ref="dialog" v-model="calendar" :return-value.sync="customer.tgl_lahir_customer" persistent width="290px" :disabled="btnEdit == false">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="customer.tgl_lahir_customer" label="Birth Date" :readonly="btnEdit == false" v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="customer.tgl_lahir_customer" scrollable>
                                    <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="calendar = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.dialog.save(customer.tgl_lahir_customer)">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                                <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="customer.alamat_customer" label="Address" :readonly="btnEdit == false"></v-text-field>
                                <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="customer.no_telp_customer" label="Phone Number" :readonly="btnEdit == false"></v-text-field>
                                <v-text-field class="formtxt" dense rounded filled background-color="yellow" v-model="customer.email" label="Email" :readonly="btnEdit == false"></v-text-field>
                                <div>
                                    <v-card rounded="10" color="yellow" min-height="220px">
                                        <v-card-title class="pengenaltxt pt-1 pb-1">Kartu Tanda Pengenal</v-card-title>
                                        <v-img v-if="btnEdit == false" :src="$imgloader+customer.url_tanda_pengenal" width="330px" height="150px" class="mx-16 mt-1 mb-5"></v-img>
                                        <v-img v-if="btnEdit == true" :src="preview_id" width="330px" height="150px" class="mx-16 mt-1 mb-5"></v-img>
                                        <v-btn v-if="btnEdit == true" small @click="onPickFile_id" class="iconedit2 ml-15 mt-n8" fab dark color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input v-if="btnEdit == true" type="file" style="display: none" @change="upload_id" ref="fileInput_id">
                                    </v-card>
                                </div>
                                <div class="mt-8">
                                    <v-card rounded="10" color="yellow" min-height="220px">
                                        <v-card-title class="pengenaltxt pt-1 pb-1">Surat Izin Mengemudi (SIM)</v-card-title>
                                        <v-img v-if="btnEdit == false" :src="$imgloader+customer.url_sim_customer" width="330px" height="150px" class="mx-16 mt-1 mb-5"></v-img>
                                        <v-img v-if="btnEdit == true" :src="preview_sim" width="330px" height="150px" class="mx-16 mt-1 mb-5"></v-img>
                                        <v-btn v-if="btnEdit == true" small @click="onPickFile_sim" class="iconedit2 ml-15 mt-n8" fab dark color="error">
                                            <v-icon dark>mdi-image-edit</v-icon>
                                        </v-btn>
                                        <input v-if="btnEdit == true" type="file" style="display: none" @change="upload_sim" ref="fileInput_sim">
                                    </v-card>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row v-if="btnEdit == true" class="mx-8 mt-2 mb-3">
                            <v-checkbox v-model="enabled" hide-details class="shrink" ></v-checkbox>
                            <v-text-field v-model="newPassword" class="formtxt" dense rounded filled background-color="yellow" :disabled="!enabled" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" @click:append="show = !show" label="Change Password?" placeholder="New Password"></v-text-field>
                        </v-row>
                    </v-card>
                </v-form>
                <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                    <v-card>
                        <v-card-title>
                            <span class="headline"> Warning! </span>
                        </v-card-title>
                        <v-card-text class="dialogtext" v-html="dialogText"> {{ dialogText }}</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="indigo" class="font-weight-bold" text @click="dialogConfirm = false">Cancel</v-btn>
                            <v-btn color="error" class="font-weight-bold" text @click="setDialog">Yes</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row> 
        </v-container>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Akshar"); 
    @import url("https://fonts.googleapis.com/css?family=Rubik");
    @import url("https://fonts.googleapis.com/css?family=Josefin%20Sans");  

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }

    .iconname{
        font-family: Rubik;
    }

    .iconedit{ 
        top:-10px;
        left: 20px; 
    }

    .iconedit2{ 
        top:-10px;
        left: 300px; 
    }

    .formtxt{
        font-family: Rubik;
    }

    .pengenaltxt{
        font-family: Rubik;
        font-size: 12px;
    }

    .posisinya{
        position: absolute; 
        top: 30px; 
        left: 0; 
        right: 0;
    }

    .cardTitle{
        font-family: Akshar;
        font-size: 30px;
        color: yellow;
    }
</style>

<script>
  export default {
    name: "CustomerProfile",
    data () {
        return {
            valid: true,
            enabled: false,
            show: false,
            load: false,
            snackbar: false,
            calendar: false,
            error_message: '',
            dialogType: '',
            dialogConfirm: false,
            color: '',
            btnEdit: false,
            genders: ['Male','Female'],
            customer: [],
            url_pp: null,
            url_id: null,
            url_sim: null,
            preview_pp: require('@/assets/nopp.png'),
            preview_sim: require('@/assets/noimg.jpg'),
            preview_id: require('@/assets/noimg.jpg'),
            updatedData: new FormData,
            newPassword: null,
            logoutIdentifier: new FormData,
        }
    },

    methods: {
        setDialog(){
            if(this.dialogType == 'Are you sure you want to save these changes?'){
                this.dialogConfirm = false;
                this.save();
            }else if(this.dialogType == 'Are you sure you want to cancel these changes?'){
                this.dialogConfirm = false;
                this.cancel();
            }else if(this.dialogType == 'Are you sure want to remove/delete your account?'){
                this.dialogConfirm = false;
                this.removeAccount();
            }
        },

        readData() {
            var url = this.$api + '/user/' + localStorage.getItem('id');
            this.$http.get(url, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.customer = response.data.data;
            })
        },

        removeAccountHandler(){
            this.dialogConfirm = true;
            this.dialogType = 'Are you sure want to remove/delete your account?';
        },

        removeAccount(){
            let newData = {
                    status_akun: 'Deleted',
                }; 
                var url = this.$api + '/removeAccount/'+localStorage.getItem('id'); 
                this.load = true; 
                this.$http.put(url, newData, { 
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message; 
                    this.color = 'green'; 
                    this.snackbar = true; 
                    this.load = false;  
                    this.logout();
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
        },

        save() {
            this.updatedData.append('nama_customer',this.customer.nama_customer);
            this.updatedData.append('alamat_customer',this.customer.alamat_customer);
            this.updatedData.append('tgl_lahir_customer',this.customer.tgl_lahir_customer);
            this.updatedData.append('gender_customer',this.customer.gender_customer);
            this.updatedData.append('no_telp_customer',this.customer.no_telp_customer);
            this.updatedData.append('email',this.customer.email);
            this.updatedData.append('url_tanda_pengenal',this.url_id);
            this.updatedData.append('url_sim_customer',this.url_sim);
            this.updatedData.append('url_pp_customer',this.url_pp);

            if(!(this.newPassword == null)){
                this.updatedData.append('password',this.newPassword);
            }

            var url = this.$api + '/user'; 
            this.load = true; 
            this.$http.post(url,this.updatedData, { 
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type' : 'multipart/form-data'
                }
            }).then(response => {
                this.error_message = response.data.message; 
                this.color = 'green'; 
                this.snackbar = true; 
                this.load = false; 
                this.readData();// baca data 
                this.btnEdit = false; 
            }).catch(error => {
                this.error_message = error.response.data.message; 
                this.color = 'red'; 
                this.snackbar = true; 
                this.load = false;
            });
            this.preview_foto = require('@/assets/nopp.png');
            this.preview_img = require('@/assets/noimg.jpg');
        },

        cancel(){
            this.readData();
            this.btnEdit = false;
            this.preview_foto = require('@/assets/nopp.png');
            this.preview_img = require('@/assets/noimg.jpg');
        },

        getColorGender (gender) {
            if (gender === 'Female') return 'pink'
            else if (gender === 'Male') return 'blue'
            else return 'transparent'
        },
        
        getColorAkun (akun) {
            if (akun === 'Active') return 'success'
            else if (akun === 'Inactive') return 'error'
        },
        
        getIcon (gender) {
            if (gender === 'Female') return 'mdi-face-woman'
            else if (gender === 'Male') return 'mdi-face-man'
        },

        onPickFile() {
            this.$refs.fileInput.click();
        },

        onPickFile_id() {
            this.$refs.fileInput_id.click();
        },

        onPickFile_sim() {
            this.$refs.fileInput_sim.click();
        },

        upload_pp(event) {
            console.log(event)
            let url_pp = event.target.files[0];
            this.url_pp = url_pp;
            this.preview_pp = URL.createObjectURL(url_pp);
        },

        upload_id(event) {
            console.log(event)
            let url_id = event.target.files[0];
            this.url_id = url_id;
            this.preview_id = URL.createObjectURL(url_id);
        },

        upload_sim(event) {
            console.log(event)
            let url_sim = event.target.files[0];
            this.url_sim = url_sim;
            this.preview_sim = URL.createObjectURL(url_sim);
        },

        logout(){
            this.logoutIdentifier.append('guard','user')
            var url = this.$api + '/logout';
            this.$http.post(url, this.logoutIdentifier, {
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            })
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('idRole');
            this.$router.push({
                name: 'IndexPage'
            });
            
        }
        // Batas Coding 1
    },

    mounted() {
        this.readData();
    },
    
    computed: {
        cardtitle () {
            return this.btnEdit === false ? 'My Profile' : 'Edit My Profile'
        },
        dialogText() {
            return this.dialogType;
        },
    },
  }
</script>