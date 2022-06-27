<template>
    <div>
        <v-container fluid fill-height class="posisinya mt-5">
            <v-row align="centre" justify="center">
                <v-card append rounded outlined elevation="4" width="1250px" min-height="300px">
                    <v-row align="left" justify="left" class="mt-n5">
                        <v-card append color="indigo" align="center" rounded outlined elevation="4" width="230px" height="50px">
                            <v-card-title class="cardTitle pa-0 my-2 justify-center"> Customers Table </v-card-title>
                        </v-card>
                    </v-row>
                    <v-row align="end" justify="end" class="mt-2 mr-5">
                        <v-col cols="4">
                            <v-text-field dense rounded filled background-color="yellow" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <v-divider class="mx-4 mt-6"></v-divider>
                    <v-data-table height="300px" class="datacust mx-4" :headers="headers" :items="customers" :search="search">
                        <template v-slot:[`item.id_card`]="{ item }">
                            <v-chip class="datacust" :color="getColor(item.url_tanda_pengenal)" outlined> 
                                {{ getText(item.url_tanda_pengenal) }} 
                            </v-chip>
                        </template> 
                        <template v-slot:[`item.driver_license`]="{ item }">
                            <v-chip class="datacust" :color="getColor(item.url_sim_customer)" outlined> 
                                {{ getText(item.url_sim_customer) }} 
                            </v-chip>
                        </template> 
                        <template v-slot:[`item.status_akun`]="{ item }">
                            <v-chip class="datacust" :color="getColorSts(item.status_akun)" outlined> 
                                {{ getTextSts(item.status_akun) }} 
                            </v-chip>
                        </template> 
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn @click="showHandler(item)" class="mx-2 mr-2" fab dark x-small color="indigo">
                                <v-icon dark>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                        <template v-slot:[`item.activation`]="{ item }">
                            <v-btn v-if="item.status_akun == 'Inactive'" @click="dialogConfirm = true; dialogType = 'Are you sure want to activate this customer account?'; editId = item.id" class="mx-2 mr-2" fab dark x-small :disabled="btnInactive=false" color="success">
                                <v-icon dark>mdi-check-bold</v-icon>
                            </v-btn>
                            <v-btn v-if="item.status_akun == 'Active'" @click="dialogConfirm = true; dialogType = 'Are you sure want to inactivate this customer account?'; editId = item.id" class="mx-2 mr-2" fab dark x-small :disabled="btnActive=false" color="error">
                                <v-icon dark>mdi-close-thick</v-icon>
                            </v-btn>
                        </template> 
                    </v-data-table> 
                </v-card>
                <v-dialog v-model="dialog" persistent max-width="530px"> 
                    <v-card> 
                        <v-card-title>
                            <span class="headline">Data Customer</span> 
                        </v-card-title> 
                        <v-card-text> 
                            <v-container > 
                                <v-text-field class="formtxt" v-model="form.nama_customer" label="Name" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.gender_customer" label="Gender" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.tgl_lahir_customer" label="Birth Date" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.alamat_customer" label="Address" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.no_telp_customer" label="Phone Number" required :readonly="btnShow == true"></v-text-field>
                                <v-text-field class="formtxt" v-model="form.email" label="Email" required :readonly="btnShow == true"></v-text-field>
                                <v-card rounded="10" color="yellow" min-height="220px">
                                    <v-card-title class="pengenaltxt pt-1 pb-1">Kartu Tanda Pengenal</v-card-title>
                                    <v-img :src="$imgloader+form.url_tanda_pengenal" width="330px" height="150px" class="mx-14 mt-1 mb-5"></v-img>
                                    <v-file-input v-if="btnEdit == true" class="mx-3 my-3" label="Choose File" filled prepend-icon="mdi-camera" ></v-file-input>
                                </v-card>
                                <v-card class="mt-7" rounded="10" color="yellow" min-height="220px">
                                    <v-card-title class="pengenaltxt pt-1 pb-1">Surat Izin Mengemudi (SIM)</v-card-title>
                                    <v-img :src="$imgloader+form.url_sim_customer" width="330px" height="150px" class="mx-14 mt-1 mb-5"></v-img>
                                    <v-file-input v-if="btnEdit == true" class="mx-3 my-3" label="Choose File" filled prepend-icon="mdi-camera" ></v-file-input>
                                </v-card>
                            </v-container> 
                        </v-card-text> 
                        <v-card-actions>
                            <v-spacer></v-spacer> 
                            <v-btn v-if="btnShow == true" color="indigo" class="font-weight-bold" text @click="close"> Close </v-btn>
                        </v-card-actions> 
                    </v-card> 
                </v-dialog>
                <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                    <v-card>
                        <v-card-title>
                            <span class="headline"> Warning! </span>
                        </v-card-title>
                        <v-card-text> {{ dialogText }} </v-card-text>
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

    .pengenaltxt{
        font-family: Rubik;
        font-size: 12px;
    }

    .posisinya{
        position: absolute; 
        top: 10px; 
        left: 0; 
        right: 0;
    }

    .cardTitle{
        font-family: Akshar;
        font-size: 30px;
        color: yellow;
    }

    .formtxt{
        font-family: Rubik;
    }

    .headline{
        font-family: Akshar;
    }

    .datacust{
        font-family: Akshar;
        font-weight: bold;
        font-size: 20px;
    }
</style>

<script> 
    export default {
        name: "DataEmployee",
        data() { 
            return {
                inputType: 'Create',
                load: false,
                snackbar: false,
                error_message: '',
                calendar: false,
                color: '',
                search: null, 
                dialog: false, 
                dialogType: '',
                editId: '',
                dialogConfirm: false,
                headers: [
                    {text: "ID", value: "id"},
                    {text: "Name", value: "nama_customer"},
                    {text: "Birth Date", value: "tgl_lahir_customer"},
                    {text: "Address", value: "alamat_customer"},
                    {text: "Phone Number", value: "no_telp_customer"},
                    {text: "ID Card", value: "id_card"},
                    {text: "Driver's License", value: "driver_license"},
                    {text: "Account", value: "status_akun"},
                    {text: "Activation", value: "activation"},
                    {text: "", value: "actions"},
                ],
                customer: new FormData,
                customers: [],
                 form: { 
                    nama_customer: null,
                    tgl_lahir_customer: null,
                    alamat_customer: null,
                    no_telp_customer: null,
                    gender_customer: null,
                    email: null,
                    url_tanda_pengenal: null,
                    url_sim_customer: null
                },
                sts_akun: null,
                btnShow: false,
                btnActive: false,
                btnInactive: false,
            };
        },


        methods: {
            setDialog(){
                if(this.dialogType == "Are you sure want to activate this customer account?"){
                    this.dialogConfirm = false;
                   this.update_on();
                }else if(this.dialogType == "Are you sure want to inactivate this customer account?"){
                    this.dialogConfirm = false;
                    this.update_off();
                }       
            },

            readData() {
                var url = this.$api + '/users';
                this.$http.get(url, {
                    headers:{
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.customers = response.data.data;
                })
            },

            update_on(){
                this.btnActive = true;
                this.updateData(this.editId);
            },

            update_off(){
                this.btnInactive = true;
                this.updateData(this.editId);
            },

            updateData(id) { 
                if(this.btnActive == true){
                   this.sts_akun = 'Active'
                }else if(this.btnInactive == true){
                    this.sts_akun = 'Inactive'
                }
                
                let newData = {
                    status_akun: this.sts_akun,
                }; 
                var url = this.$api + '/update/'+id; 
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
                    this.readData(); 
                }).catch(error => {
                    this.error_message = error.response.data.message; 
                    this.color = 'red'; 
                    this.snackbar = true; 
                    this.load = false;
                });
            },

            getColor(url){
                if(url == 'default/noimg.jpg') return 'error'
                else return 'success'
            },

            getText(url){
                if(url == 'default/noimg.jpg') return 'No Data'
                else return 'Have Data'
            },

            getColorSts(sts){
                if(sts == 'Inactive') return 'error'
                else if(sts == 'Deleted') return 'grey'
                else return 'success'

            },

            getTextSts(sts){
                if(sts == 'Inactive') return 'Inactive'
                else if(sts == 'Deleted') return 'Deleted'
                else return 'Active'
            },

            showHandler(item) {
                this.btnShow = true;
                this.form.nama_customer = item.nama_customer; 
                this.form.gender_customer = item.gender_customer; 
                this.form.tgl_lahir_customer = item.tgl_lahir_customer; 
                this.form.alamat_customer = item.alamat_customer; 
                this.form.no_telp_customer = item.no_telp_customer; 
                this.form.url_tanda_pengenal = item.url_tanda_pengenal;  
                this.form.url_sim_customer = item.url_sim_customer;
                this.form.email = item.email;
                this.dialog = true;
            },

            close() {
                this.dialog = false; 
                this.readData();
            },
            //Batas coding 1
        },

        computed: {
            dialogText() {
                return this.dialogType;
            },
        },

        mounted() {
            this.readData();
        },
    };
</script>